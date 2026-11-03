import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';
import { dbService } from '../services/database/dbService';
import { extractResumeText } from '../services/resume/textExtractor';
import { supabaseAdmin } from '../config/supabase';
import { env } from '../config/env';

export const resumeController = {
  async uploadResume(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({
          success: false,
          message: 'No resume file uploaded.',
          error: { code: 'MISSING_FILE' }
        });
        return;
      }

      const userId = req.user!.id;
      const fileBuffer = req.file.buffer;
      const originalName = req.file.originalname;
      const fileSize = req.file.size;

      // Extract text and verify file signature (magic bytes)
      const extraction = await extractResumeText(fileBuffer);
      const resumeId = randomUUID();
      const sanitizedFilename = originalName.replace(/[^a-zA-Z0-9._-]/g, '_');
      const storagePath = `${userId}/${resumeId}/${sanitizedFilename}`;

      // Upload to private Supabase Storage bucket if Supabase configured
      const isLiveSupabase =
        env.SUPABASE_URL.startsWith('https://') &&
        env.SUPABASE_SERVICE_ROLE_KEY !== 'dev-service-role-key';

      if (isLiveSupabase) {
        const { error: storageError } = await supabaseAdmin.storage
          .from('resumes')
          .upload(storagePath, fileBuffer, {
            contentType: req.file.mimetype,
            upsert: false
          });

        if (storageError) {
          console.warn('[Storage] Upload to Supabase bucket warning:', storageError.message);
        }
      }

      // Persist resume metadata & extracted text in PostgreSQL
      const createdResume = await dbService.createResume({
        user_id: userId,
        file_name: originalName,
        storage_path: storagePath,
        file_type: extraction.fileType,
        file_size: fileSize,
        extracted_text: extraction.text,
        processing_status: 'uploaded'
      });

      res.status(201).json({
        success: true,
        message: 'Resume uploaded and processed successfully',
        data: createdResume
      });
    } catch (error: any) {
      next(error);
    }
  },

  async listResumes(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const resumes = await dbService.listUserResumes(userId);

      res.json({
        success: true,
        message: 'Resumes retrieved successfully',
        data: resumes
      });
    } catch (error) {
      next(error);
    }
  },

  async getResume(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      const resume = await dbService.getResumeById(id, userId);
      if (!resume) {
        res.status(404).json({
          success: false,
          message: 'Resume not found or access denied.',
          error: { code: 'NOT_FOUND' }
        });
        return;
      }

      res.json({
        success: true,
        message: 'Resume retrieved successfully',
        data: resume
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteResume(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      const deleted = await dbService.deleteResume(id, userId);
      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'Resume not found or access denied.',
          error: { code: 'NOT_FOUND' }
        });
        return;
      }

      res.json({
        success: true,
        message: 'Resume deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
};

