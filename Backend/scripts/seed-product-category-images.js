import 'dotenv/config';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import { Category } from '../src/models/category.model.js';
import { Product } from '../src/models/product.model.js';

const dbName = 'ONS';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const categoryImageMap = [
  {
    match: ['saree', 'sarees'],
    url: 'https://placehold.co/1200x1600/f3d6da/111111?text=Sarees',
  },
  {
    match: ['lehenga', 'lehengas', 'lehnga'],
    url: 'https://placehold.co/1200x1600/f2d7e6/111111?text=Lehengas',
  },
  {
    match: ['kurti', 'kurtis'],
    url: 'https://placehold.co/1200x1600/e8e7ff/111111?text=Kurtis',
  },
  {
    match: ['anarkali'],
    url: 'https://placehold.co/1200x1600/f7e7d3/111111?text=Anarkali',
  },
  {
    match: ['palazzo set', 'palazzo sets', 'palazzo'],
    url: 'https://placehold.co/1200x1600/dff3ef/111111?text=Palazzo+Sets',
  },
  {
    match: ['suit', 'suits'],
    url: 'https://placehold.co/1200x1600/dde9f7/111111?text=Suits',
  },
];

const productImageMap = [
  {
    match: ['beautiful red saree', 'red saree', 'saree'],
    url: 'https://placehold.co/1200x1600/d94f4f/ffffff?text=Beautiful+Red+Saree',
  },
  {
    match: ['elegant red silk saree', 'silk saree'],
    url: 'https://placehold.co/1200x1600/b33c3c/ffffff?text=Elegant+Red+Silk+Saree',
  },
  {
    match: ['bridal green lehenga', 'green lehenga', 'lehenga'],
    url: 'https://placehold.co/1200x1600/2f7d4c/ffffff?text=Bridal+Green+Lehenga',
  },
  {
    match: ['yellow palazzo set', 'palazzo set'],
    url: 'https://placehold.co/1200x1600/f1c54b/111111?text=Yellow+Palazzo+Set',
  },
  {
    match: ['pink party anarkali set', 'anarkali'],
    url: 'https://placehold.co/1200x1600/e87aa1/ffffff?text=Pink+Party+Anarkali+Set',
  },
  {
    match: ['kurti'],
    url: 'https://placehold.co/1200x1600/c8c8ff/111111?text=Kurti',
  },
];

const normalize = (value) => String(value || '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, ' ')
  .trim();

const findMappedUrl = (name, map) => {
  const normalizedName = normalize(name);
  const match = map.find((entry) => entry.match.some((token) => normalizedName.includes(normalize(token))));
  return match?.url || null;
};

const fetchImageBuffer = async (sourceUrl) => {
  const response = await fetch(sourceUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch source image: ${sourceUrl}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
};

const uploadSeedImage = async (sourceUrl, folder, label) => {
  const buffer = await fetchImageBuffer(sourceUrl);

  const result = await new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        overwrite: true,
        unique_filename: true,
        public_id: label,
      },
      (error, uploadedResult) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(uploadedResult);
      }
    );

    Readable.from(buffer).pipe(uploadStream);
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
    originalName: `${label}.jpg`,
  };
};

const main = async () => {
  if (!process.env.DB_URI) {
    throw new Error('DB_URI is missing');
  }

  await mongoose.connect(process.env.DB_URI, { dbName });

  const categories = await Category.find().lean();
  const products = await Product.find().populate('category', 'name').lean();

  const categoryUpdates = [];
  for (const category of categories) {
    if (category.image?.url) {
      continue;
    }

    const imageUrl = findMappedUrl(category.name, categoryImageMap);
    if (!imageUrl) {
      continue;
    }

    const label = `category-${normalize(category.name).replace(/\s+/g, '-')}`;
    const image = await uploadSeedImage(imageUrl, 'ons-store/categories', label);
    categoryUpdates.push(
      Category.updateOne(
        { _id: category._id },
        { $set: { image } }
      )
    );
  }

  const productUpdates = [];
  for (const product of products) {
    if (product.mainImage?.url) {
      continue;
    }

    const imageUrl = findMappedUrl(`${product.name} ${product.category?.name || ''}`, productImageMap)
      || findMappedUrl(product.category?.name, productImageMap)
      || findMappedUrl(product.name, productImageMap);

    if (!imageUrl) {
      continue;
    }

    const label = `product-${normalize(product.name).replace(/\s+/g, '-')}`;
    const mainImage = await uploadSeedImage(imageUrl, 'ons-store/products', label);

    productUpdates.push(
      Product.updateOne(
        { _id: product._id },
        { $set: { mainImage } }
      )
    );
  }

  await Promise.all([...categoryUpdates, ...productUpdates]);

  const updatedCategories = await Category.countDocuments({ 'image.url': { $exists: true, $ne: '' } });
  const updatedProducts = await Product.countDocuments({ 'mainImage.url': { $exists: true, $ne: '' } });

  console.log(JSON.stringify({
    categoriesUpdated: categoryUpdates.length,
    productsUpdated: productUpdates.length,
    categoriesWithImages: updatedCategories,
    productsWithImages: updatedProducts,
  }, null, 2));

  await mongoose.disconnect();
};

main().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});