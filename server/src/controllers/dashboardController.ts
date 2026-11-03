import { Request, Response, NextFunction } from 'express';
import { dbService } from '../services/database/dbService';

export const dashboardController = {
  async getDashboard(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const metrics = await dbService.getDashboardMetrics(userId);

      res.json({
        success: true,
        message: 'Dashboard metrics retrieved successfully',
        data: metrics
      });
    } catch (error) {
      next(error);
    }
  }
};

