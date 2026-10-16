import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const AdminSchema = new mongoose.Schema(
  {
    adminEmail: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    adminPassword: {
      type: String,
      required: true,
      select: false,
    },
  },
  { timestamps: true }
);

AdminSchema.pre("save", async function () {
  if (!this.isModified("adminPassword")) return;

  this.adminPassword = await bcrypt.hash(
    this.adminPassword,
    12
  );
});

const Admin =
  mongoose.models.Admin ||
  mongoose.model("Admin", AdminSchema, "admins");

export default Admin;