import mongoose, { Model, Document } from "mongoose";
import * as bcrypt from "bcrypt";
import { IUser } from "../@types";

const VendorContent = new mongoose.Schema({
  username: { type: String },
  startDate: { type: Number, requirerd: false },
  endDate: { type: Number, required: false },
});

const userSchema = new mongoose.Schema<IUser>({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  chesscom: { type: VendorContent },
  lichess: { type: VendorContent },
  /* chessDCusername: { type: String },
  lichessusername: { type: String },
  chessDotComLastUpdated: { type: String },
  lichessComLastUpdated: { type: String }, */
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  let saltNum = parseInt(process.env.SALTNUM as string);
  const salt = await bcrypt.genSalt(saltNum);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User: Model<IUser> = mongoose.model("User", userSchema);

export default User;
