import { Request, Response, NextFunction } from 'express';
import { dbService } from '../services/database/dbService';

export const progressController = {
  async createTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { roadmapId, taskTitle, description } = req.body;

      const created = await dbService.createProgressTask({
        user_id: userId,
        roadmap_id: roadmapId || null,
        task_title: taskTitle,
        description: description || null,
        status: 'pending'
      });

      res.status(201).json({
        success: true,
        message: 'Progress task created successfully',
        data: created
      });
    } catch (error) {
      next(error);
    }
  },

  async listTasks(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const tasks = await dbService.listProgressTasks(userId);

      const completed = tasks.filter((t) => t.status === 'completed').length;
      const total = tasks.length;
      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

      res.json({
        success: true,
        message: 'Progress overview retrieved successfully',
        data: {
          tasks,
          total,
          completed,
          percentage
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async updateTaskStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const { status } = req.body;

      const updated = await dbService.updateProgressTaskStatus(id, userId, status);
      if (!updated) {
        res.status(404).json({
          success: false,
          message: 'Task not found or access denied.',
          error: { code: 'NOT_FOUND' }
        });
        return;
      }

      res.json({
        success: true,
        message: 'Task status updated successfully',
        data: updated
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      const deleted = await dbService.deleteProgressTask(id, userId);
      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'Task not found or access denied.',
          error: { code: 'NOT_FOUND' }
        });
        return;
      }

      res.json({
        success: true,
        message: 'Task deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
};

