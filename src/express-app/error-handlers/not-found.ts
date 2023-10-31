import { Application, RequestHandler } from 'express';

const handler: RequestHandler = (req, res) =>
  res.status(404).json({ message: `Resource ${req.url} not found` });

class NotFoundError {
  public static mount(app: Application): Application {
    app.use(handler);

    return app;
  }
}

export default NotFoundError;
