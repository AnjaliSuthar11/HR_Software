// import mongoose from "mongoose";

// const TaskAttachmentSchema = new mongoose.Schema(
//   {
//     fileName: {
//       type: String,
//       required: true,
//     },

//     url: {
//       type: String,
//       required: true,
//     },

//     publicId: {
//       type: String,
//       default: "",
//     },

//     resourceType: {
//       type: String,
//       default: "",
//     },

//     format: {
//       type: String,
//       default: "",
//     },

//     mimeType: {
//       type: String,
//       default: "",
//     },

//     size: {
//       type: Number,
//       default: 0,
//     },
//   },
//   {
//     _id: false,
//   }
// );

// const TaskSchema = new mongoose.Schema(
//   {
//     employeeId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Employee",
//       required: true,
//     },

//     assignedByEmployeeId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Employee",
//       default: null,
//     },

//     title: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     description: {
//       type: String,
//       default: "",
//       trim: true,
//     },

//     taskDate: {
//       type: Date,
//       required: true,
//     },

//     dueDate: {
//       type: Date,
//       default: null,
//     },

//     priority: {
//       type: String,
//       enum: [
//         "Low",
//         "Medium",
//         "High",
//         "Urgent",
//       ],
//       default: "Medium",
//     },

//     status: {
//       type: String,
//       enum: [
//         "Pending",
//         "In Progress",
//         "Hold",
//         "Completed",
//       ],
//       default: "Pending",
//     },

//     completedAt: {
//       type: Date,
//       default: null,
//     },

//     seenAt: {
//       type: Date,
//       default: null,
//     },

//     attachments: {
//       type: [TaskAttachmentSchema],
//       default: [],
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// export default mongoose.models.Task ||
//   mongoose.model("Task", TaskSchema);


// 21 october

import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    assignedById: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
      index: true,
    },
    assignedByName: {
      type: String,
      required: true,
      trim: true,
    },
    assignedToId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
      index: true,
    },
    assignedToName: {
      type: String,
      required: true,
      trim: true,
    },
    taskTitle: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    assignedDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    deadline: {
      type: Date,
      default: null,
    },
    assignedQuantity: {
      type: Number,
      default: 1,
      min: 0,
    },
    completedQuantity: {
      type: Number,
      default: 0,
      min: 0,
    },
    approvedQuantity: {
      type: Number,
      default: 0,
      min: 0,
    },
    startTime: {
      type: String,
      default: "",
    },
    endTime: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed", "On Hold"],
      default: "Pending",
    },
    remarks: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

TaskSchema.index({ assignedToId: 1, assignedDate: -1 });
TaskSchema.index({ assignedById: 1, assignedDate: -1 });

export default mongoose.models.Task ||
  mongoose.model("Task", TaskSchema);
