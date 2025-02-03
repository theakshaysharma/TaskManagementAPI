import { Schema, model, Document } from 'mongoose';

// Task schema definition
const taskSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        description: { type: String, required: true },
        category: { type: String, required: false, default: 'none' },
        priority: { type: String, enum: ['high', 'medium', 'low'], required: false, default: 'medium' },
        completed: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export interface Task extends Document {
    userId: string;
    description: string;
    category: string;
    priority: 'high' | 'medium' | 'low';
    completed: boolean;
}

export const TaskModel = model<Task>('Task', taskSchema);
