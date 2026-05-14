import { Router } from 'express';
import { RespondentController } from '../controllers/RespondentController';
import { validateRequest } from '../middleware/validateRequest';
import {
  respondentValidationSchema,
  respondentUpdateSchema,
} from '../middleware/validation';

const router = Router();

/**
 * @route POST /api/v1/respondents
 * @desc Create a new respondent
 * @body {IRespondentCreateRequest}
 * @returns {IApiResponse<IRespondent>}
 */
router.post('/', validateRequest(respondentValidationSchema), RespondentController.create);

/**
 * @route GET /api/v1/respondents
 * @desc Get all respondents with pagination
 * @query {number} page - Page number (default: 1)
 * @query {number} limit - Items per page (default: 20)
 * @returns {IApiResponse<{respondents: IRespondent[], pagination: any}>}
 */
router.get('/', RespondentController.getAll);

/**
 * @route GET /api/v1/respondents/stats/summary
 * @desc Get statistics summary
 * @returns {IApiResponse<any>}
 */
router.get('/stats/summary', RespondentController.getStatistics);

/**
 * @route GET /api/v1/respondents/stats/date-range
 * @desc Get respondents by date range
 * @query {string} startDate - Start date (YYYY-MM-DD)
 * @query {string} endDate - End date (YYYY-MM-DD)
 * @returns {IApiResponse<IRespondent[]>}
 */
router.get('/stats/date-range', RespondentController.getByDateRange);

/**
 * @route GET /api/v1/respondents/school/:schoolName
 * @desc Get respondents by school
 * @params {string} schoolName - School name
 * @returns {IApiResponse<IRespondent[]>}
 */
router.get('/school/:schoolName', RespondentController.getBySchool);

/**
 * @route GET /api/v1/respondents/:id
 * @desc Get respondent by ID
 * @params {number} id - Respondent ID
 * @returns {IApiResponse<IRespondent>}
 */
router.get('/:id', RespondentController.getById);

/**
 * @route PUT /api/v1/respondents/:id
 * @desc Update respondent
 * @params {number} id - Respondent ID
 * @body {Partial<IRespondent>}
 * @returns {IApiResponse<IRespondent>}
 */
router.put('/:id', validateRequest(respondentUpdateSchema), RespondentController.update);

/**
 * @route DELETE /api/v1/respondents/:id
 * @desc Delete respondent
 * @params {number} id - Respondent ID
 * @returns {IApiResponse<any>}
 */
router.delete('/:id', RespondentController.delete);

export default router;
