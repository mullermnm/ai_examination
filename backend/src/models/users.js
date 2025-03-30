import mongoose, { Schema } from "mongoose";

const schema = new Schema(
  {
    fullName: {
      type: String,
      required: true
    },
    userId: {
        type: String,
        unique: true,
        required: true
    },
    userRole: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
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
export const model = mongoose.model("Users", schema);