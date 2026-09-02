import mongoose from "mongoose";

const pettyCashSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    paidTo: {
      type: String,
      trim: true,
      default: "",
    },

    paymentMethod: {
      type: String,
      enum: ["Cash", "UPI", "Bank", "Card", "Other"],
      default: "Cash",
    },

    reference: {
      type: String,
      trim: true,
      default: "",
    },

    notes: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.PettyCash ||
  mongoose.model("PettyCash", pettyCashSchema);