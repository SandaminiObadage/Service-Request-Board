const app = require("./app");
const { connectDB } = require("./config/db");
const { env } = require("./config/env");

connectDB()
  .then(() => {
    app.listen(env.PORT, () => {
      console.log(`API running on port ${env.PORT}`);
      console.log(`Swagger UI docs: http://localhost:${env.PORT}/api-docs`);
      console.log(`OpenAPI JSON: http://localhost:${env.PORT}/openapi.json`);
    });
  })
  .catch((error) => {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  });
