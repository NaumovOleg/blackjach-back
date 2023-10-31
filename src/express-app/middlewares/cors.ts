import cors from 'cors';
import { Application } from 'express';

class Cors {
  public static mount(app: Application): Application {
    const options = {};

    app.use(cors(options));

    return app;
  }
}

export default Cors;
