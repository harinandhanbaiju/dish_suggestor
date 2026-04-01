import "server-only";

type ServerConfig = {
  mongodbUri: string | null;
  mongodbDbName: string;
  nodeEnv: string;
};

// Centralized env reads keep sensitive config in one place and simplify validation.
export const serverConfig: ServerConfig = {
  mongodbUri: process.env.MONGODB_URI ?? null,
  mongodbDbName: process.env.MONGODB_DB_NAME || "dish_suggestion_helper",
  nodeEnv: process.env.NODE_ENV || "development",
};
