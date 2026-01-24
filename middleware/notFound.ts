import { Request, Response, NextFunciton } from 'express';
import { HttpError } from '../types/index.js';

const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.status = 404;
  next(error);
}

export default notFound;