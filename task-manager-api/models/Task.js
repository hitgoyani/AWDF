import mongoose from 'mongoose';

/**
 * Task Schema Definition (Practical 5)
 * Fields:
 *  - title: String (Required, trimmed via pre-save hook)
 *  - description: String (Optional, default empty)
 *  - completed: Boolean (Default false)
 *  - priority: String (Enum: 'low', 'medium', 'high', Default 'medium')
 *  - createdAt: Date (Default Date.now)
 */
const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required and cannot be empty'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    completed: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      enum: {
        values: ['low', 'medium', 'high'],
        message: '{VALUE} is not a valid priority. Allowed values are: low, medium, high',
      },
      default: 'medium',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    userEmail: {
      type: String,
      default: '',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

// Supplementary Problem: Pre-save hook to automatically trim whitespace from title
taskSchema.pre('save', function (next) {
  if (this.title) {
    this.title = this.title.trim();
  }
  if (typeof next === 'function') {
    next();
  }
});

const Task = mongoose.model('Task', taskSchema);

export default Task;
