import { Request, Response, NextFunction } from 'express';
import { RespondentService } from '../services/RespondentService';
import { IApiResponse, IRespondentCreateRequest } from '../types/respondent';

export class RespondentController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body as IRespondentCreateRequest;
      const respondent = await RespondentService.createRespondent(data);

      const response: IApiResponse<any> = {
        success: true,
        data: respondent,
        message: 'Respondent created successfully',
        timestamp: new Date().toISOString(),
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid respondent ID',
          timestamp: new Date().toISOString(),
        });
      }

      const respondent = await RespondentService.getRespondent(id);

      const response: IApiResponse<any> = {
        success: true,
        data: respondent,
        timestamp: new Date().toISOString(),
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const result = await RespondentService.getAllRespondents(page, limit);

      const response: IApiResponse<any> = {
        success: true,
        data: {
          respondents: result.data,
          pagination: {
            page,
            limit,
            total: result.total,
            pages: Math.ceil(result.total / limit),
          },
        },
        timestamp: new Date().toISOString(),
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid respondent ID',
          timestamp: new Date().toISOString(),
        });
      }

      const respondent = await RespondentService.updateRespondent(id, req.body);

      const response: IApiResponse<any> = {
        success: true,
        data: respondent,
        message: 'Respondent updated successfully',
        timestamp: new Date().toISOString(),
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid respondent ID',
          timestamp: new Date().toISOString(),
        });
      }

      await RespondentService.deleteRespondent(id);

      const response: IApiResponse<any> = {
        success: true,
        message: 'Respondent deleted successfully',
        timestamp: new Date().toISOString(),
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  static async getBySchool(req: Request, res: Response, next: NextFunction) {
    try {
      const schoolName = decodeURIComponent(req.params.schoolName);
      const respondents = await RespondentService.getBySchool(schoolName);

      const response: IApiResponse<any> = {
        success: true,
        data: respondents,
        timestamp: new Date().toISOString(),
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  static async getByDateRange(req: Request, res: Response, next: NextFunction) {
    try {
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        return res.status(400).json({
          success: false,
          error: 'startDate and endDate query parameters are required',
          timestamp: new Date().toISOString(),
        });
      }

      const respondents = await RespondentService.getByDateRange(
        startDate as string,
        endDate as string
      );

      const response: IApiResponse<any> = {
        success: true,
        data: respondents,
        timestamp: new Date().toISOString(),
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  static async getStatistics(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await RespondentService.getStatistics();

      const response: IApiResponse<any> = {
        success: true,
        data: stats,
        timestamp: new Date().toISOString(),
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }
}
