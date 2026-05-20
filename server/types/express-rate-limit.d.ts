declare module 'express-rate-limit' {
  import { RequestHandler } from 'express';

  interface Options {
    windowMs?: number;
    max?: number;
    message?: any;
    standardHeaders?: boolean;
    legacyHeaders?: boolean;
    keyGenerator?: (req: any) => string;
  }

  function rateLimit(options?: Options): RequestHandler;

  export default rateLimit;
}
