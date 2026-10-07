import { ValidationError } from '../errors/api-error.js';
import { REVIEW_ACTION_LIST } from '../constants/review-actions.js';

export const validateReviewAction = (req, res, next) => {
  const { action, notes } = req.body || {};
  const errors = [];

  if (!action || !REVIEW_ACTION_LIST.includes(action)) {
    errors.push({
      field: 'action',
      message: `Action is required and must be one of: ${REVIEW_ACTION_LIST.join(', ')}.`,
    });
  }

  if (!notes || typeof notes !== 'string' || !notes.trim()) {
    errors.push({
      field: 'notes',
      message: 'Review notes are required.',
    });
  } else if (notes.trim().length < 3) {
    errors.push({
      field: 'notes',
      message: 'Review notes must be at least 3 characters.',
    });
  }

  if (errors.length > 0) {
    return next(new ValidationError(errors));
  }

  next();
};
