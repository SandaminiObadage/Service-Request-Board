const cookieParser = require("cookie-parser");
const cors = require("cors");
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");

const { env } = require("./config/env");
const authRoutes = require("./routes/authRoutes");
const { openApiSpec } = require("./docs/openapi");
const jobRoutes = require("./routes/jobRoutes");
const { errorHandler } = require("./middleware/errorHandler");
const { notFound } = require("./middleware/notFound");

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true
  })
);
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

if (env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

app.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "API is healthy" });
});

app.get("/openapi.json", (req, res) => {
  res.status(200).json(openApiSpec);
});
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(openApiSpec, {
    customSiteTitle: "Mini Service Request Board API Docs",
    swaggerOptions: {
      persistAuthorization: true,
      tryItOutEnabled: true,
      requestInterceptor: (request) => {
        request.credentials = "include";
        return request;
      }
    }
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
