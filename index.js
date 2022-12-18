const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');
require("dotenv").config();

app.use(cors());  
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.3booq2e.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
  try{
    const selectorsCollection = client.db("TaskForm").collection("selectors");


    app.get('/selector', async(req, res) => {
      const doc = {
        selector: "Manufacturing",
      };
      const result = await selectorsCollection.insertOne(doc);
      res.send(result)
    })

  }
  finally{

  }
}
run().catch(err => console.log(err))

app.get('/', (req, res) => {
  res.send("Wow! Our server is running");
})

app.listen(port, () => {
  console.log("Server is running in port 5000");
})