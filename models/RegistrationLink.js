import mongoose from "mongoose";

const RegistrationLinkSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    used: {
      type: Boolean,
      default: false,
    },

    usedAt: {
      type: Date,
      default: null,
    },

    expiresAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.RegistrationLink ||
  mongoose.model("RegistrationLink", RegistrationLinkSchema);