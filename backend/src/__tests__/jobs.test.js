const mongoose = require("mongoose");
const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");

process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-secret";

const app = require("../app");
const { JobRequest } = require("../models/JobRequest");
const User = require("../models/User");

let mongoServer;
let homeowner;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterEach(async () => {
  await JobRequest.deleteMany({});
  await User.deleteMany({});
  homeowner = null;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Jobs API", () => {
  test("GET /api/jobs lists jobs", async () => {
    homeowner = await User.create({
      name: "Home Owner",
      email: "owner@example.com",
      passwordHash: "hashed-password",
      role: "homeowner"
    });

    await JobRequest.create({
      title: "Fix sink leak",
      description: "The kitchen sink is leaking below the cabinet.",
      category: "Plumbing",
      location: "Colombo",
      contactName: "Test User",
      contactEmail: "test@example.com",
      createdBy: homeowner._id
    });

    const response = await request(app).get("/api/jobs").expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.count).toBe(1);
    expect(response.body.data.jobs[0].title).toBe("Fix sink leak");
  });

  test("POST /api/jobs returns validation errors for invalid input", async () => {
    const agent = request.agent(app);

    await agent
      .post("/api/auth/register")
      .send({
        name: "Valid User",
        email: "valid@example.com",
        password: "Password123!",
        role: "homeowner"
      })
      .expect(201);

    const response = await agent
      .post("/api/jobs")
      .send({
        title: "",
        description: "short",
        category: "Roofing",
        contactEmail: "not-an-email"
      })
      .expect(422);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Validation failed");
    expect(response.body.errors.length).toBeGreaterThan(0);
  });
});
