const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "Mini Service Request Board API",
    version: "1.0.0",
    description: "Express REST API for the GlobalTNA Mini Service Request Board."
  },
  servers: [
    {
      url: "http://localhost:5000",
      description: "Local backend"
    }
  ],
  tags: [
    { name: "Health" },
    { name: "Auth" },
    { name: "Jobs" }
  ],
  components: {
    securitySchemes: {
      cookieAuth: {
        type: "apiKey",
        in: "cookie",
        name: "token",
        description: "JWT stored in an HttpOnly cookie after login/register. The token is signed, issuer/audience validated, and expires after JWT_EXPIRES_IN, currently recommended as 2h."
      },
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Optional testing method. Paste a valid JWT as: Bearer <token>. The app normally uses the HttpOnly token cookie."
      }
    },
    parameters: {
      JobId: {
        name: "id",
        in: "path",
        required: true,
        description: "MongoDB ObjectId of the job request.",
        schema: { type: "string", example: "665e9f4b7a8d3a8fd5a54321" }
      },
      RequestId: {
        name: "requestId",
        in: "path",
        required: true,
        description: "MongoDB ObjectId of the tradesperson request inside the job.",
        schema: { type: "string", example: "665e9f4b7a8d3a8fd5a88888" }
      },
      CategoryFilter: {
        name: "category",
        in: "query",
        required: false,
        description: "Filter jobs by service category.",
        schema: { type: "string", enum: ["Plumbing", "Electrical", "Painting", "Joinery"] }
      },
      StatusFilter: {
        name: "status",
        in: "query",
        required: false,
        description: "Filter jobs by current status.",
        schema: { type: "string", enum: ["Open", "In Progress", "Closed"] }
      },
      KeywordFilter: {
        name: "keyword",
        in: "query",
        required: false,
        description: "Search across job title and description.",
        schema: { type: "string", example: "tap" }
      }
    },
    schemas: {
      ApiError: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          message: { type: "string", example: "Validation failed" },
          errors: {
            type: "array",
            items: {
              type: "object",
              properties: {
                field: { type: "string", example: "email" },
                message: { type: "string", example: "Please provide a valid email" }
              }
            }
          }
        }
      },
      User: {
        type: "object",
        properties: {
          id: { type: "string", example: "665e9f4b7a8d3a8fd5a12345" },
          name: { type: "string", example: "Demo Homeowner" },
          email: { type: "string", example: "homeowner@example.com" },
          role: { type: "string", enum: ["homeowner", "tradesperson"], example: "homeowner" },
          createdAt: { type: "string", format: "date-time" }
        }
      },
      JobRequest: {
        type: "object",
        properties: {
          _id: { type: "string", example: "665e9f4b7a8d3a8fd5a54321" },
          title: { type: "string", example: "Leaking kitchen tap" },
          description: { type: "string", example: "Kitchen mixer tap is dripping constantly and needs repair." },
          category: { type: "string", enum: ["Plumbing", "Electrical", "Painting", "Joinery"], example: "Plumbing" },
          location: { type: "string", example: "Colombo 05" },
          contactName: { type: "string", example: "Amali Perera" },
          contactEmail: { type: "string", example: "amali@example.com" },
          status: { type: "string", enum: ["Open", "In Progress", "Closed"], example: "Open" },
          createdBy: { $ref: "#/components/schemas/User" },
          assignedTo: {
            nullable: true,
            allOf: [{ $ref: "#/components/schemas/User" }]
          },
          requests: {
            type: "array",
            items: { $ref: "#/components/schemas/TradespersonRequest" }
          },
          createdAt: { type: "string", format: "date-time" }
        }
      },
      TradespersonRequest: {
        type: "object",
        properties: {
          _id: { type: "string" },
          tradesperson: { $ref: "#/components/schemas/User" },
          message: { type: "string", example: "I can visit tomorrow morning." },
          status: { type: "string", enum: ["Pending", "Accepted", "Declined"], example: "Pending" },
          requestedAt: { type: "string", format: "date-time" }
        }
      },
      RegisterRequest: {
        type: "object",
        required: ["name", "email", "password"],
        properties: {
          name: { type: "string", example: "Demo Homeowner" },
          email: { type: "string", example: "homeowner@example.com" },
          password: { type: "string", example: "Password123!" },
          role: { type: "string", enum: ["homeowner", "tradesperson"], example: "homeowner" }
        }
      },
      LoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", example: "homeowner@example.com" },
          password: { type: "string", example: "Password123!" }
        }
      },
      CreateJobRequest: {
        type: "object",
        required: ["title", "description", "category", "contactName", "contactEmail"],
        properties: {
          title: { type: "string", example: "Leaking kitchen tap" },
          description: { type: "string", example: "Kitchen mixer tap is dripping constantly and needs repair." },
          category: { type: "string", enum: ["Plumbing", "Electrical", "Painting", "Joinery"], example: "Plumbing" },
          location: { type: "string", example: "Colombo 05" },
          contactName: { type: "string", example: "Amali Perera" },
          contactEmail: { type: "string", example: "amali@example.com" }
        }
      },
      UpdateStatusRequest: {
        type: "object",
        required: ["status"],
        properties: {
          status: { type: "string", enum: ["Open", "In Progress", "Closed"], example: "In Progress" }
        }
      },
      TradespersonJobRequest: {
        type: "object",
        properties: {
          message: {
            type: "string",
            maxLength: 500,
            example: "I can visit tomorrow morning and have plumbing experience."
          }
        }
      },
      DecideTradespersonRequest: {
        type: "object",
        required: ["decision"],
        properties: {
          decision: { type: "string", enum: ["accept", "decline"], example: "accept" }
        }
      }
    }
  },
  paths: {
    "/health": {
      get: {
        tags: ["Health"],
        summary: "Check API health",
        responses: {
          200: { description: "API is healthy" }
        }
      }
    },
    "/api/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register user",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/RegisterRequest" } } }
        },
        responses: {
          201: { description: "Registered successfully and 2-hour auth cookie is set" },
          422: { description: "Validation failed", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiError" } } } }
        }
      }
    },
    "/api/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login user",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/LoginRequest" } } }
        },
        responses: {
          200: { description: "Logged in successfully and 2-hour auth cookie is set" },
          401: { description: "Invalid email or password" }
        }
      }
    },
    "/api/auth/logout": {
      post: {
        tags: ["Auth"],
        summary: "Logout user",
        responses: { 200: { description: "Auth cookie cleared" } }
      }
    },
    "/api/auth/me": {
      get: {
        tags: ["Auth"],
        summary: "Get logged-in user",
        description: "Requires a valid JWT. In the app this is sent automatically as the HttpOnly `token` cookie. In Swagger, first call login/register with Try it out, or use Authorize with bearerAuth.",
        security: [{ cookieAuth: [] }, { bearerAuth: [] }],
        responses: {
          200: { description: "Current user" },
          401: { description: "Authentication required" }
        }
      }
    },
    "/api/jobs": {
      get: {
        tags: ["Jobs"],
        summary: "List jobs",
        parameters: [
          { $ref: "#/components/parameters/CategoryFilter" },
          { $ref: "#/components/parameters/StatusFilter" },
          { $ref: "#/components/parameters/KeywordFilter" }
        ],
        responses: { 200: { description: "List of jobs" } }
      },
      post: {
        tags: ["Jobs"],
        summary: "Create job as homeowner",
        description: "Protected. Requires logged-in user with role `homeowner`. JWT is checked by backend middleware.",
        security: [{ cookieAuth: [] }, { bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/CreateJobRequest" } } }
        },
        responses: {
          201: { description: "Job created" },
          403: { description: "Only homeowners can create jobs" },
          422: { description: "Validation failed" }
        }
      }
    },
    "/api/jobs/{id}": {
      get: {
        tags: ["Jobs"],
        summary: "Get single job",
        parameters: [{ $ref: "#/components/parameters/JobId" }],
        responses: { 200: { description: "Job details" }, 404: { description: "Job not found" } }
      },
      put: {
        tags: ["Jobs"],
        summary: "Edit job as creator homeowner",
        description: "Protected. Only the homeowner who created the job can edit it. Assigned jobs cannot be edited.",
        security: [{ cookieAuth: [] }, { bearerAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/JobId" }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/CreateJobRequest" } } }
        },
        responses: { 200: { description: "Job updated" }, 403: { description: "Only creator homeowner can edit" } }
      },
      patch: {
        tags: ["Jobs"],
        summary: "Update job status as assigned tradesperson",
        description: "Protected. Only the tradesperson assigned by the homeowner can update status.",
        security: [{ cookieAuth: [] }, { bearerAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/JobId" }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateStatusRequest" }
            }
          }
        },
        responses: { 200: { description: "Status updated" }, 403: { description: "Only assigned tradesperson can update" } }
      },
      delete: {
        tags: ["Jobs"],
        summary: "Delete job as creator homeowner",
        description: "Protected. Only the homeowner who created the job can delete it.",
        security: [{ cookieAuth: [] }, { bearerAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/JobId" }],
        responses: { 200: { description: "Job deleted" }, 403: { description: "Only creator homeowner can delete" } }
      }
    },
    "/api/jobs/{id}/requests": {
      post: {
        tags: ["Jobs"],
        summary: "Tradesperson requests a job",
        description: "Protected. Requires logged-in user with role `tradesperson`. A tradesperson can request each open job once.",
        security: [{ cookieAuth: [] }, { bearerAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/JobId" }],
        requestBody: {
          required: false,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/TradespersonJobRequest" }
            }
          }
        },
        responses: { 201: { description: "Request sent" }, 409: { description: "Already requested or job unavailable" } }
      }
    },
    "/api/jobs/{id}/requests/{requestId}": {
      patch: {
        tags: ["Jobs"],
        summary: "Homeowner accepts or declines a tradesperson request",
        description: "Protected. Only the homeowner who created the job can accept or decline tradesperson requests.",
        security: [{ cookieAuth: [] }, { bearerAuth: [] }],
        parameters: [
          { $ref: "#/components/parameters/JobId" },
          { $ref: "#/components/parameters/RequestId" }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/DecideTradespersonRequest" }
            }
          }
        },
        responses: { 200: { description: "Request decision saved" } }
      }
    }
  }
};

module.exports = { openApiSpec };
