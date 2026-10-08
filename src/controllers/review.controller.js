import reviewService from '../services/review.service.js';
import { sendSuccess } from '../utils/response.js';

class ReviewController {
  /**
   * POST /api/v1/applications/:id/review
   */
  async processReview(req, res, next) {
    try {
      const result = await reviewService.processReview(
        req.params.id,
        req.body,
        req.user,
        req
      );
      return sendSuccess(res, `Application review processed successfully: ${req.body.action}`, result, 200);
    } catch (error) {
      next(error);
    }
  }
}

export default new ReviewController();
