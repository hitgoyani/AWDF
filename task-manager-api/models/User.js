import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * User Schema Definition (Practical 7)
 * Fields:
 *  - name: String (Required)
 *  - email: String (Required, Unique, Lowercase, Validated)
 *  - password: String (Required, Min 6 characters, Hashed with bcrypt)
 *  - role: String (Default 'student')
 *  - createdAt: Date (Default Date.now)
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
    },
    role: {
      type: String,
      enum: ['student', 'admin', 'developer'],
      default: 'student',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Pre-save hook to hash password before saving to database
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next ? next() : null;
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    if (next) next();
  } catch (err) {
    if (next) next(err);
    else throw err;
  }
});

// Instance method to compare plain password with hashed password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
