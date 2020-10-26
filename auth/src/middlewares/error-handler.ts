import { Request, Response, NextFunction } from 'express';
import { RequestValidationError } from '../errors/request-validation-error';
import { DatabaseConnectionError } from '../errors/database-connection-error';

export const errorHanlder = (
  err: Error, 
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  if (err instanceof RequestValidationError) {
    console.log('handling this RequestValidationError');
  }

  if (err instanceof DatabaseConnectionError) {
    res.status(500).send({ errors: [{ message: err.reason}] })
  }

  res.status(400).send({ errors: [{ message: 'Something went wrong'}] })
};