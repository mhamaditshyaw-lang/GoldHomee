import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import bcrypt from "bcrypt";
import { storage } from "./storage";
import { pool } from "./db";
import connectPg from "connect-pg-simple";
import MemoryStoreFactory from "memorystore";

const PostgresStore = connectPg(session);
const MemoryStore = MemoryStoreFactory(session);

export function setupAuth(app: Express) {
  const sessionStore = process.env.NODE_ENV === "production"
    ? new PostgresStore({
        pool,
        tableName: 'user_sessions',
        createTableIfMissing: true,
      })
    : new MemoryStore({
        checkPeriod: 86400000,
      });

  app.use(session({
    store: sessionStore,
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'lax'
    },
    name: 'sessionId',
    proxy: true
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user) {
          return done(null, false, { message: "Invalid credentials" });
        }

        let passwordMatch = false;
        if (user.password.startsWith('$2')) {
          passwordMatch = await bcrypt.compare(password, user.password);
        } else {
          passwordMatch = user.password === password;
        }

        if (!passwordMatch) {
          return done(null, false, { message: "Invalid credentials" });
        }

        if (!user.isActive) {
          return done(null, false, { message: "Account is inactive" });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }),
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      if (!user) {
        return done(null, false);
      }
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
}
