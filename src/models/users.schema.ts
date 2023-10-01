import { Schema } from 'mongoose';

export enum UserRole {
  User = 'user',
  Admin = 'admin',
}

const UsersSchema: Schema = new Schema(
  {
    user_first_name: {
      type: String,
      required: true,
    },
    user_last_name: {
      type: String,
      required: true,
    },
    user_username: {
      type: String,
      unique: true,
      required: true,
    },
    user_email: {
      type: String,
      unique: true,
      required: true,
    },
    user_password: {
      type: String,
      required: true,
    },
    user_location: {
      type: String,
      default: 'Your location',
    },
    user_description: {
      type: String,
      default: 'Your description',
    },
    user_role: {
      type: String,
      required: true,
      enum: Object.values(UserRole),
    },
    user_image: {
      type: String,
      required: true,
      default: 'user.png',
    },
    user_last_login_date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    user_isactive: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default UsersSchema;
