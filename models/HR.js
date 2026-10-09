import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const HRSchema = new mongoose.Schema({
  HRLoginEmail: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },

  HRLoginPassword: {
    type: String,
    required: true,
    select: false,
  },
});

HRSchema.pre("save", async function () {
  if (!this.isModified("HRLoginPassword")) return;

  this.HRLoginPassword = await bcrypt.hash(
    this.HRLoginPassword,
    12
  );
});

const HR =
  mongoose.models.HR ||
  mongoose.model("HR", HRSchema, "HR");

export default HR;