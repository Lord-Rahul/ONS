const dbname = "ONS";
const api = "/api/v1";
const options = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
};

export { dbname, api, options };
