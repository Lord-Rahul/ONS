import React from 'react';

const CareInstructionsTab = ({ product }) => {
  // Check if product has care instructions in database
  const hasCareInstructions = product?.careInstructions || 
                              product?.washingInstructions || 
                              product?.care;

  if (!hasCareInstructions) {
    return (
      <div>
        <div className="text-lg font-light text-black mb-6">Care & Maintenance</div>
        <div className="text-center py-8">
          <p className="text-gray-500 italic">
            Care instructions not available for this product.
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Please contact customer support for care guidance.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="text-lg font-light text-black mb-6">Care & Maintenance</div>
      
      <div className="space-y-6">
        {/* Show care instructions from database */}
        {product.careInstructions && (
          <div>
            <h4 className="font-medium text-black mb-3">Care Instructions</h4>
            <div className="text-gray-600 font-light leading-relaxed">
              {typeof product.careInstructions === 'string' ? (
                <p>{product.careInstructions}</p>
              ) : (
                product.careInstructions.map((instruction, index) => (
                  <div key={index} className="flex items-start mb-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    {instruction}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Show washing instructions from database */}
        {product.washingInstructions && (
          <div>
            <h4 className="font-medium text-black mb-3">Washing Instructions</h4>
            <div className="text-gray-600 font-light leading-relaxed">
              {typeof product.washingInstructions === 'string' ? (
                <p>{product.washingInstructions}</p>
              ) : (
                product.washingInstructions.map((instruction, index) => (
                  <div key={index} className="flex items-start mb-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    {instruction}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Show general care from database */}
        {product.care && (
          <div>
            <h4 className="font-medium text-black mb-3">General Care</h4>
            <p className="text-gray-600 font-light leading-relaxed">
              {product.care}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CareInstructionsTab;