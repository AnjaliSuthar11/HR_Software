import mongoose from "mongoose";

const HolidaySchema = new mongoose.Schema(
  {
    // Holiday date
    date: {
      type: Date,
      required: true,
    },

    // Holiday name
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // Holiday category
    type: {
      type: String,
      enum: [
        "National Holiday",
        "Festival",
        "Company Holiday",
        "Other",
      ],
      default: "Company Holiday",
    },

    // Optional description
    description: {
      type: String,
      default: "",
      trim: true,
    },

    // Whether salary should be paid for this holiday
    paid: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate holiday records for the same date/name
HolidaySchema.index(
  {
    date: 1,
    name: 1,
  },
  {
    unique: true,
  }
);

export default mongoose.models.Holiday ||
  mongoose.model("Holiday", HolidaySchema);