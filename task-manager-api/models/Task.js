import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
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
        message: '{VALUE} is not a valid priority. Allowed values: low, medium, high',
      },
      default: 'medium',
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

// Pre-save hook to trim whitespace from title (Practical 5)
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
