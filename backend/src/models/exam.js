import mongoose, { Schema } from "mongoose";

const schema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    courseName: {
      type: String,
      required: true
    },
    courseCode: {
      type: String,
      required: true
    },
    examCode: {
      type: String,
      required: true,
      unique: true
    },
    totalMarks: {
      type: Number,
      required: true
    },
    timeLimit: {
      type: Number,
      required: true
    },
    questions: {
      type: Array,
      required: true
    },
    registeredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
      required: true
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft'
    }
    
  },
  {
    timestamps: true,
    id: true,
    toObject: {
      virtuals: true,
    },
    toJSON: {
      virtuals: true,
    },
  }
);
export const model = mongoose.model("Exams", schema);