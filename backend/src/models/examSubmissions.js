import mongoose, { Schema } from 'mongoose';

const schema = new Schema(
  {
    examId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exams',
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
    },
    answers: {
      type: Array,
      default: [],
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    gradedAt: {
      type: Date,
    },
    feedback: {
      type: String,
    },
    score: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['SUBMITTED', 'GRADED', 'DRAFT'],
      default: 'SUBMITTED',
    },
  },
  {
    timestamps: true,
    id: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

export const model = mongoose.model('ExamSubmissions', schema);
