import type { User as SelectUser } from "@shared/schema";

declare global {
  namespace Express {
    interface User extends SelectUser {}
    interface Request {
      user?: SelectUser;
      customer?: any;
    }
  }
}

declare module "express-session" {
  interface SessionData {
    userId?: number;
    customerId?: number;
    clientIP?: string;
  }
}

export {};