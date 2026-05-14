import { RespondentModel } from '../models/RespondentModel';
import { IRespondent, IRespondentCreateRequest } from '../types/respondent';
import { ApiError } from '../middleware/errorHandler';
import logger from '../config/logger';

export class RespondentService {
  /**
   * Create a new respondent
   */
  static async createRespondent(data: IRespondentCreateRequest): Promise<IRespondent> {
    try {
      // Check if serial number already exists
      const exists = await RespondentModel.serialNumberExists(data.serial_no);
      if (exists) {
        throw new ApiError(409, `Serial number ${data.serial_no} already exists`);
      }

      const id = await RespondentModel.create(data);
      const respondent = await RespondentModel.getById(id);

      if (!respondent) {
        throw new ApiError(500, 'Failed to create respondent');
      }

      logger.info(`Respondent created with ID: ${id}`);
      return respondent;
    } catch (error) {
      logger.error(`Error creating respondent: ${error}`);
      throw error;
    }
  }

  /**
   * Get respondent by ID
   */
  static async getRespondent(id: number): Promise<IRespondent> {
    const respondent = await RespondentModel.getById(id);
    if (!respondent) {
      throw new ApiError(404, `Respondent with ID ${id} not found`);
    }
    return respondent;
  }

  /**
   * Get all respondents with pagination
   */
  static async getAllRespondents(page: number = 1, limit: number = 20) {
    if (page < 1 || limit < 1) {
      throw new ApiError(400, 'Page and limit must be positive integers');
    }
    return RespondentModel.getAll(page, limit);
  }

  /**
   * Update respondent
   */
  static async updateRespondent(
    id: number,
    data: Partial<IRespondent>
  ): Promise<IRespondent> {
    const respondent = await this.getRespondent(id);

    const updated = await RespondentModel.update(id, data);
    if (!updated) {
      throw new ApiError(500, 'Failed to update respondent');
    }

    const updatedRespondent = await RespondentModel.getById(id);
    if (!updatedRespondent) {
      throw new ApiError(500, 'Failed to fetch updated respondent');
    }

    logger.info(`Respondent ${id} updated`);
    return updatedRespondent;
  }

  /**
   * Delete respondent
   */
  static async deleteRespondent(id: number): Promise<boolean> {
    await this.getRespondent(id); // Check if exists

    const deleted = await RespondentModel.delete(id);
    if (!deleted) {
      throw new ApiError(500, 'Failed to delete respondent');
    }

    logger.info(`Respondent ${id} deleted`);
    return true;
  }

  /**
   * Get respondents by school
   */
  static async getBySchool(schoolName: string) {
    return RespondentModel.getBySchool(schoolName);
  }

  /**
   * Get respondents by date range
   */
  static async getByDateRange(startDate: string, endDate: string) {
    return RespondentModel.getByDateRange(startDate, endDate);
  }

  /**
   * Get statistics
   */
  static async getStatistics() {
    // This would require additional queries to gather statistics
    // For now, returning a placeholder structure
    return {
      totalRespondents: 0,
      bySchool: {},
      byAge: {},
      rhInfoAdequacy: {},
    };
  }
}
