import { Application, ErrorRequestHandler } from 'express';

type ValidationError = {
  path: string;
  message: string;
  errorCode: string;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const handler: ErrorRequestHandler = (err, req, res, next) => {
  const { name, message, status, statusCode, info } = err;
  let validationInfo = {};
  if (err.errors?.length > 0) {
    validationInfo = err.errors.reduce(
      (acc: ValidationError, curr: any) => ({ ...acc, [curr.path.split('/').pop()]: curr.message }),
      {}
    );
  }
  // eslint-disable-next-line no-console
  console.error(err);
  res.status(status ?? 500);
  return res.json({ name, message, statusCode, info: info ?? validationInfo });
};

class ExpressError {
  public static mount(app: Application): Application {
    app.use(handler);

    return app;
  }
}

export default ExpressError;
