import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken.js";

const getUser = async ({ req, email }) => {
  const db = req.dbClient.db("users");
  const user = await db.collection("credentials").findOne({ email: email });
  return user;
};

const matchPassword = async (encryptedPassword, password) => {
  let result = await bcrypt.compare(password, encryptedPassword);
  console.log(result);
  return result;
};
 
const createUser = async ({ req, name, email, password }) => {
  const db = req.dbClient.db("users");
  const salt = await bcrypt.genSalt(process.env.SALTNUM);
  password = await bcrypt.hash(password, salt);
  const result = await db
    .collection("credentials")
    .insertOne({ name, email, password });
  console.log(`Document inserted with ID: ${result.insertedId}`);
  generateToken()
  return result;
};

export { getUser, matchPassword, createUser };
