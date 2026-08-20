import mongoose from "mongoose";

const interviewRoundSchema = new mongoose.Schema(
{
  communication:{
    type:Number,
    default:null
  },

  confidence:{
    type:Number,
    default:null
  },

  technicalSkill:{
    type:Number,
    default:null
  },

  experience:{
    type:Number,
    default:null
  },

  presentation:{
    type:Number,
    default:null
  },


  remarks:{
    type:String,
    default:""
  },


  recommendation:{
    type:String,
    enum:[
      "Selected",
      "Shortlisted",
      "Can be Consider",
      "Rejected",
      "Hold",
      ""
    ],
    default:""
  },




},
{
  _id:false
}
);

const candidateSchema = new mongoose.Schema(
  {
    // ================= Personal =================

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      default: undefined,
    },

    dateOfBirth: Date,

    maritalStatus: {
      type: String,
      enum: ["Single", "Married", "Divorced", "Other"],
      default: undefined,
    },

    mobile: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },
profileImage:{
 type:String,
 default:""
},
    address: {
      type: String,
      default: "",
    },

    // ================= Education =================

    highestQualification: String,

    university: String,

    passingYear: String,

    percentage: String,

    // ================= Skills =================

    softwareKnowledge: {
      type: [String],
      default: [],
    },

    // ================= Employment =================

    previousCompany: String,

    previousDesignation: String,

    experience: {
      type: String,
      enum: ["Yes", "No",],
      default: undefined,
    },

    experienceYears: String,

    lastSalary: String,

    lastInHandSalary: String,

    salarySlip: {
      type: String,
      enum: ["Yes", "No", "Other"],
      default: undefined,
    },

    experienceLetter: {
      type: String,
      enum: ["Yes", "No"],
      default: undefined,
    },

    noticePeriod: {
      type: String,
      enum: ["Yes", "No"],
      default: undefined,
    },

    
    currentlyWorking: {
      type: String,
      enum: ["Yes", "No", "Other"],
      default: undefined,
    },

    criminalRecord: {
      type: String,
      enum: ["Yes", "No"],
      default: undefined,
    },
     
 preferredJoiningDate: {
  type: Date,
  default: null,
},

offeredJoiningDate: {
  type: Date,
  default: null,
},


    reference: String,

    // ================= Resume =================

    resume: {
      type: String,
      default: "",
    },

    // ================= Interview =================

    round1: {
      type: interviewRoundSchema,
      default: undefined,
    },

    round2: {
      type: interviewRoundSchema,
      default: undefined,
    },

    // ================= Status =================

    finalStatus: {
      type: String,
      enum: [
        "New",
        "Round 1",
        "Round 2",
        "Selected",
        "Rejected",
        "On Hold",
        "Joined",
      ],
      default: "New",
    },

    notes: {
      type: String,
      default: "",
    },

    registrationToken: {
  type: String,
  default: null,
},

registrationTokenUsed: {
  type: Boolean,
  default: false,
},
convertedToEmployee: {
  type: Boolean,
  default: false,
},

employeeId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Employee",
  default: null,
},

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Candidate ||
  mongoose.model("Candidate", candidateSchema);