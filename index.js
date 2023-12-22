require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://job-task-01.web.app",
      "https://job-task-01.firebaseapp.com",
    ],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

const uri = `mongodb+srv://${process.env.JOB_TASK_1_USER}:${process.env.JOB_TASK_1_PASS}@cluster0.qzinma9.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const todoTasks = client.db("jobTask-1").collection("todoTask");

    app.post("/todo", async (req, res) => {
      const todoTask = req.body;
      const result = await todoTasks.insertOne(todoTask);
      res.send(result);
    });

    app.get("/todo/:email", async (req, res) => {
      const user = req.params.email;
      const query = { user_email: user };
      const result = await todoTasks.find(query).toArray();
      res.send(result);
    });

    app.patch("/todo", async (req, res) => {
      const status = req.body;
      console.log(status);
    });

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("job task server is running");
});

app.listen(port, () => {
  console.log(`job task server is running on port: ${port}`);
});
