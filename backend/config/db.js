import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();
const uri = process.env.MONGODB_URI;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri);

export default async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    const connection = await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
    return connection;
  } catch (e) {
    console.log(e); 
    throw new Error("unable to connect to MongoDB");
  }
  /*   finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  } */
}
