import { NextFunction, Request, Response } from 'express';
import { ClientError } from '../exceptions/clientError';
import { UnauthorizedError } from '../exceptions/unauthorizedError';
import { NotFoundError } from '../exceptions/notFoundError';
import { TaskModel } from '../models/task';

// Controller for tasks
class TaskController {
    // Create a new task
    static createTask = async (req: any, res: Response, next: NextFunction) => {
        const {  description, category, priority } = req.body;
        const userId = req?.token?.payload?.userId;
        if (  !description ) {
            throw new ClientError('description is required');
        }

        const task = new TaskModel({
            userId,
            description,
            category,
            priority
        });

        try {
            await task.save();
            res.status(201).json({ success: true, message: 'Task created successfully', data: task });
        } catch (error) {
            next(error);
        }
    };

    // Get all tasks for the logged-in user
    static getAllTasks = async (req: any, res: Response, next: NextFunction) => {
        const userId = req?.token?.payload?.userId;
        try {
            const tasks = await TaskModel.find({ userId }).exec();
            res.status(200).json({ success: true, data: tasks });
        } catch (error) {
            next(error);
        }
    };

    // Update task
    static updateTask = async (req: any, res: Response, next: NextFunction) => {
        console.log(req.body)
        const taskId = req.params.id;
        const {  description, category, completed } = req.body;
        const userId = req?.token?.payload?.userId;
        if (!description || !category || completed==undefined) {
            throw new ClientError('All fields (description, category, completed) are required');
        }

        try {
            const task = await TaskModel.findOneAndUpdate(
                { _id: taskId, userId },
                {  description, category, completed },
                { new: true }
            );

            if (!task) {
                throw new NotFoundError('Task not found or unauthorized to update');
            }

            res.status(200).json({ success: true, message: 'Task updated successfully', data: task });
        } catch (error) {
            next(error);
        }
    };

    // Delete task
    static deleteTask = async (req: any, res: Response, next: NextFunction) => {
        const taskId = req.params.id;
        const userId = req?.token?.payload?.userId;
        try {
            const task = await TaskModel.findOneAndDelete({ _id: taskId, userId });

            if (!task) {
                throw new NotFoundError('Task not found or unauthorized to delete');
            }

            res.status(200).json({ success: true, message: 'Task deleted successfully' });
        } catch (error) {
            next(error);
        }
    };
}

export default TaskController;
