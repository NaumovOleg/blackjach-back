import cors from 'cors';
import express, { Application } from 'express';

class Http {
  public static mount(app: Application): Application {
    app.use(cors());
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());

    return app;
  }
}

export default Http;
