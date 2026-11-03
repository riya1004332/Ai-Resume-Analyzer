import { Request, Response, NextFunction } from 'express';
import { dbService } from '../services/database/dbService';

export const profileController = {
  async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      let profile = await dbService.getProfile(userId);

      if (!profile) {
        // Auto-initialize profile if first access
        profile = await dbService.upsertProfile({
          id: userId,
          email: req.user!.email,
          full_name: req.user!.fullName || ''
        });
      }

      res.json({
        success: true,
        message: 'Profile retrieved successfully',
        data: profile
      });
    } catch (error) {
      next(error);
    }
  },

  async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { fullName, educationLevel, experienceLevel, careerDomain, careerInterest } = req.body;

      const updated = await dbService.upsertProfile({
        id: userId,
        full_name: fullName,
        education_level: educationLevel,
        experience_level: experienceLevel,
        career_domain: careerDomain,
        career_interest: careerInterest
      });

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: updated
      });
    } catch (error) {
      next(error);
    }
  }
};

