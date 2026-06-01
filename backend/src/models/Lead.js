import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
{
  name: String,
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: String,
  gender: String,
  company: String,
  position: String,

  status: {
    type: String,
    default: "new"
  },

  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  source: String,

  tags: [String],

  lastContacted: Date
},
{
  timestamps: true
}
);

export default mongoose.model("Lead", leadSchema);