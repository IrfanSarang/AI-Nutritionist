import mongoose, { Document } from 'mongoose';
export interface IPlan {
    breakfast: string[];
    lunch: string[];
    dinner: string[];
}
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
}
export interface IUser extends Document {
    fullName: string;
    email: string;
    password: string;
    profile: IProfile[];
    resetToken?: string | null;
    resetTokenExpiry?: Date | null;
}
declare const User: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, {}> & IUser & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default User;
//# sourceMappingURL=user.d.ts.map