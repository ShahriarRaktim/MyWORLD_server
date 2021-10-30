const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0js5x.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// const database = client.db("tour");
// const serviceCollection = database.collection("plans");
// app.get("/plans", (req, res) => {
//     const ne = serviceCollection.find({});
//     console.log(ne)
//   res.send(ne);
// });

async function run() {
  try {
    await client.connect();

    const database = client.db("tour");
    const serviceCollection = database.collection("plans");
    const userCollection = database.collection("users");

    //Get All
    app.get("/plans", async (req, res) => {
      const result = await serviceCollection.find({}).toArray();
      res.send(result);
    });

    app.get("/booking", async (req, res) => {
      const result = await userCollection.find({}).toArray();
      res.send(result);
    });

    //Get One
    app.get("/plans/:id", async (req, res) => {
      const id = req.params.id;
      const service = { _id: ObjectId(id) };
      const result = await serviceCollection.findOne(service);
      console.log(result);
      res.send(result);
    });
    //Post
    app.post("/booking", async (req, res) => {
      const service = req.body;
      const result = await userCollection.insertOne(service);
      res.json(result);
    });

    //Delete
    app.delete("/booked/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id)
      const service = { _id: ObjectId(id) };
      const result = await userCollection.deleteOne(service);
      res.send(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/love', (req, res)=>{
    res.send("Running hello")
});

app.listen(port, () => {
  console.log("Running Genius Server on port", port);
});
