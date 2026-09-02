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
      // NEW
      department: {
        type: String,
        default: "",
        trim: true,
      },

      // NEW
      appliedPosition: {
        type: String,
        default: "",
        trim: true,
      },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.RegistrationLink ||
  mongoose.model("RegistrationLink", RegistrationLinkSchema);