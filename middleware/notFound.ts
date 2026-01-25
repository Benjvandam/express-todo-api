import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../types/index.js';

const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error: HttpError = new Error(`Not Found - ${req.originalUrl}`);
  error.status = 404;
  next(error);
}

export default notFound;