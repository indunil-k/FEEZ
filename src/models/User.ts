import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId; // userID (MongoDB _id)
  userName: string;
  user: string; // username/email
  password: string; // hashed password
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema<IUser> = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: [true, 'User name is required'],
      trim: true,
      maxlength: [50, 'User name cannot exceed 50 characters'],
    },
    user: {
      type: String,
      required: [true, 'Username/Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't include password in queries by default
    },
  },
  {
    timestamps: true,
  }
);

// Prevent re-compilation during development
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
