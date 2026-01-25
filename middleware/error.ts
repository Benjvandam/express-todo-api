import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../types/index.js';

const errorHandler = (err: HttpError, req: Request, res: Response, next: NextFunction) => {
  if (err.status) {
    res.status(err.status).json({msg: err.message});
  } else {
    res.status(500).json({msg: err.message});
  }
};

export default errorHandler;