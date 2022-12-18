const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.3booq2e.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const sectorsCollection = client.db("TaskForm").collection("sectors");
    const savedDataCollection = client.db("TaskForm").collection("savedData");

    //get sectors data
    app.get("/getSectors", async (req, res) => {
      const query = {};
      const cursor = sectorsCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    //save data in database
    app.post("/saveData", async (req, res) => {
      const data = req.body;

      //check if the user already in database or not
      const name = data.name;
      const query = { name: name };
      const user = await savedDataCollection.findOne(query);
      if (user) {
        return res.status(409).send({ message: "This name has already taken" });
      }

      const result = await savedDataCollection.insertOne(data);
      res.send(result);
    });

    //get saved data by name
    app.get("/getSavedData", async (req, res) => {
      const name = req.query.name;
      const query = { name: name };
      const result = await savedDataCollection.findOne(query);
      res.send(result);
    });

    //update data
    app.patch("/updateData", async (req, res) => {
      const name = req.query.name;
      const data = req.body;
      const query = { name: name };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name: data?.name,
          sector: data?.sector,
          agree: data?.agree,
        },
      };
      const result = await savedDataCollection.updateOne(
        query,
        updateDoc,
        options
      );
      res.send(result);
    });
  } finally {
  }
}
run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Wow! Our server is running");
});

app.listen(port, () => {
  console.log("Server is running in port 5000");
});
