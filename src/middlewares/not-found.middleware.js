import { sendError } from '../utils/response.js';

export const notFoundHandler = (req, res) => {
  return sendError(
    res,
    `Cannot ${req.method} ${req.originalUrl}`,
    404,
    'RESOURCE_NOT_FOUND'
  );
};
