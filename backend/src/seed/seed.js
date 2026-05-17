const bcrypt = require("bcryptjs");
const { connectDB, disconnectDB } = require("../config/db");
const { JobRequest } = require("../models/JobRequest");
const User = require("../models/User");

const jobs = [
  {
    title: "Leaking kitchen tap",
    description: "Kitchen mixer tap is dripping constantly and needs repair or replacement.",
    category: "Plumbing",
    location: "Colombo 05",
    contactName: "Amali Perera",
    contactEmail: "amali@example.com",
    status: "Open"
  },
  {
    title: "Bedroom light switch issue",
    description: "Main bedroom light switch sparks occasionally and should be inspected.",
    category: "Electrical",
    location: "Nugegoda",
    contactName: "Kasun Silva",
    contactEmail: "kasun@example.com",
    status: "In Progress"
  },
  {
    title: "Repaint garden wall",
    description: "Exterior garden wall needs surface preparation and weatherproof paint.",
    category: "Painting",
    location: "Rajagiriya",
    contactName: "Nimali Fernando",
    contactEmail: "nimali@example.com",
    status: "Open"
  },
  {
    title: "Repair wooden pantry cabinet",
    description: "Two pantry cabinet doors are loose and one hinge may need replacing.",
    category: "Joinery",
    location: "Battaramulla",
    contactName: "Dinesh Jayawardena",
    contactEmail: "dinesh@example.com",
    status: "Closed"
  },
  {
    title: "Bathroom drain blocked",
    description: "Bathroom drain is draining slowly and has started producing an odor.",
    category: "Plumbing",
    location: "Dehiwala",
    contactName: "Sarah Joseph",
    contactEmail: "sarah@example.com",
    status: "Open"
  },
  {
    title: "Install ceiling fan",
    description: "Need a ceiling fan installed in the living room with existing wiring checked.",
    category: "Electrical",
    location: "Kotte",
    contactName: "Ruwan Dias",
    contactEmail: "ruwan@example.com",
    status: "Open"
  }
];

const users = [
  {
    name: "Demo Homeowner",
    email: "homeowner@example.com",
    password: "Password123!",
    role: "homeowner"
  },
  {
    name: "Demo Tradesperson",
    email: "tradesperson@example.com",
    password: "Password123!",
    role: "tradesperson"
  }
];

async function seed() {
  await connectDB();
  await Promise.all([JobRequest.deleteMany({}), User.deleteMany({})]);

  const preparedUsers = await Promise.all(
    users.map(async (user) => ({
      name: user.name,
      email: user.email,
      role: user.role,
      passwordHash: await bcrypt.hash(user.password, 12)
    }))
  );

  const createdUsers = await User.insertMany(preparedUsers);
  const homeowner = createdUsers.find((user) => user.role === "homeowner");
  await JobRequest.insertMany(jobs.map((job) => ({ ...job, createdBy: homeowner._id })));

  console.log("Seed complete");
  console.table(users.map(({ name, email, password, role }) => ({ name, email, password, role })));
  await disconnectDB();
}

seed().catch(async (error) => {
  console.error(error);
  await disconnectDB();
  process.exit(1);
});
