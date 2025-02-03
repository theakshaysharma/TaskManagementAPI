import { Router } from 'express';
import { checkJwt } from '../middleware/checkJwt';  // Middleware to check JWT token
import { asyncHandler } from '../middleware/asyncHandler';
import TaskController from '../controllers/TaskController';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task management endpoints
 */

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 example: "Complete the project report"
 *               category:
 *                 type: string
 *                 default: "work"
 *                 example: "work"
 *               priority:
 *                 type: string
 *                 enum: ["high", "medium", "low"]
 *                 default: "medium"
 *                 example: "medium"
 *               completed:
 *                 type: boolean
 *                 default: false
 *     responses:
 *       201:
 *         description: Task created successfully
 *       400:
 *         description: Bad request
 */
router.post('/', [checkJwt], asyncHandler(TaskController.createTask));

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get all tasks for the logged-in user
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of tasks for the user
 *       404:
 *         description: No tasks found for the user
 */
router.get('/', [checkJwt], asyncHandler(TaskController.getAllTasks));

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Update a task by ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Task ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *                 default: "work"
 *               priority:
 *                 type: string
 *                 enum: ["high", "medium", "low"]
 *                 default: "medium"
 *               completed:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       404:
 *         description: Task not found
 */
router.put('/:id', [checkJwt], asyncHandler(TaskController.updateTask));

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Delete a task by ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Task ID to delete
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       404:
 *         description: Task not found
 */
router.delete('/:id', [checkJwt], asyncHandler(TaskController.deleteTask));

export default router;
