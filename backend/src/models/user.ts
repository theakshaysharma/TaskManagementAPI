import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { ROLES } from '../utils/constants';

export interface IUser {
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    password: string;
    role?: string;
}

interface userModelInterface extends mongoose.Model<UserDoc> {
    build(attr: IUser): UserDoc;
}

interface UserDoc extends mongoose.Document {
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    password: string;
    role: string;
    isPasswordCorrect(providedPassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<IUser>(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        },
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            minLength: [8, 'Username too short'],
            maxLength: [40, 'Username too long']
        },
        firstName: { type: String, required: true, trim: true },
        lastName: { type: String, required: true, trim: true },
        password: {
            type: String,
            required: true,
            minLength: 8
        },
        role: {
            type: String,
            required: true,
            enum: [ROLES.USER, ROLES.ADMIN],
            default: ROLES.USER
        }
    },
    { timestamps: true }
);

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

userSchema.method('isPasswordCorrect', async function (providedPassword: string): Promise<boolean> {
    return await bcrypt.compare(providedPassword, this.password);
});

const User = mongoose.model<UserDoc, userModelInterface>('User', userSchema);

export { User };
