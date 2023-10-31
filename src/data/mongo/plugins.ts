import { Schema, ErrorHandlingMiddlewareFunction } from 'mongoose';
import HttpError, { BadRequest } from 'http-errors';

type ErrorHandler = (err: any, next: Parameters<ErrorHandlingMiddlewareFunction>[2]) => void;
export type MongoPlugin = (schema: Schema) => void;

const handleMongoError: ErrorHandler = (error, next) => {
  if (error.code !== 11000) return next(error);

  const result = error.message.match(/dup key.*/);
  const key = Object.keys(error.keyPattern)[0];
  const err = HttpError(409, 'Duplicate key error');
  err.info = { [key]: `${result[0]} already exist` };

  return next(err);
};

const handleValidationError: ErrorHandler = (error, next) => {
  const errorInfo = Object.keys(error.errors).reduce(
    (acc: any, key) => ({
      ...acc,
      [key]: error.errors[key].message
    }),
    {}
  );

  const customError: any = new BadRequest(error.message.match(/.* failed/)[0]);
  customError.info = errorInfo;
  return next(customError);
};

const handleCastError: ErrorHandler = (error, next) => {
  const customError = new Error(error.message);
  customError.name = error.name;
  next(HttpError(404, customError));
};

const handleError: ErrorHandlingMiddlewareFunction = (error, _, next) => {
  switch (error.name) {
    case 'MongoServerError':
      handleMongoError(error, next);
      break;
    case 'MongoError':
      handleMongoError(error, next);
      break;
    case 'ValidationError':
      handleValidationError(error, next);
      break;
    case 'CastError':
      handleCastError(error, next);
      break;
    default:
      next(error);
  }
};

export const HandleMongoDBErrors: MongoPlugin = (schema) => {
  schema.post('validate', handleError);
  schema.post('save', handleError);
  schema.post('updateOne', handleError);
  schema.post('updateMany', handleError);
  schema.post('insertMany', handleError);
  schema.post('find', handleError);
  schema.post('findOne', handleError);
  schema.post('findOneAndUpdate', handleError);
  schema.post('findOneAndRemove', handleError);
};
