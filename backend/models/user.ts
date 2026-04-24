import mongoose, { Schema, Document, Mongoose } from "mongoose";

export interface IPlan {
  breakfast: string[];
  lunch: string[];
  dinner: string[];
}
const planSchema: Schema = new Schema({
  breakfast: { type: Array, required: false },
  lunch: { type: Array, required: false },
  dinner: { type: Array, required: false },
});

export interface IProfile extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  age: string;
  gender: string;
  weight: string;
  height: string;
  dietType: string;
  allergies?: string;
  healthGoal: string;
  activityLevel: string;
  medicalConditions?: string;
  plan: IPlan[];
  weightLog: { date: Date; weight: number }[];
}

const profileSchema: Schema = new Schema({
  name: { type: String, required: true },
  age: { type: String, required: true },
  gender: { type: String, required: true },
  weight: { type: String, required: true },
  height: { type: String, required: true },
  dietType: { type: String, required: true },
  allergies: { type: String },
  healthGoal: { type: String, required: true },
  activityLevel: { type: String, required: true },
  medicalConditions: { type: String },
  plan: {
    type: [planSchema],
    default: [{ breakfast: [], lunch: [], dinner: [] }], // <-- default empty plan
  },
  weightLog: [{ date: { type: Date, default: Date.now }, weight: Number }]
});

export interface IUser extends Document {
  fullName: string;
  email: string;
  password: string;
  profile: IProfile[];
  resetToken?: string | null;
  resetTokenExpiry?: Date | null;
  otpAttempts?: number;
}

const userSchema: Schema = new Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profile: { type: [profileSchema], default: [] },
  resetToken: { type: String, default: "" },
  resetTokenExpiry: { type: Date, default: null },
  otpAttempts: { type: Number, default: 0 },
});

const User = mongoose.model<IUser>("User", userSchema);
export default User;
