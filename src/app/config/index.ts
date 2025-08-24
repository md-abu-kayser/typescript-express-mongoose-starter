import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({
  path: path.join(
    process.cwd(),
    `.env${process.env.NODE_ENV ? `.${process.env.NODE_ENV}` : ''}`,
  ),
});

// Configuration interface for type safety
export interface IConfig {
  port: number;
  database_url: string;
  node_env: string;
  jwt_secret?: string;
}

// Validate required environment variables
const validateEnv = () => {
  const requiredEnvVars = ['PORT', 'DATABASE_URL', 'NODE_ENV'];
  const missingVars = requiredEnvVars.filter(
    (varName) => !process.env[varName],
  );

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}`,
    );
  }
};

validateEnv();

// Export configuration with proper typing
export const config: IConfig = {
  port: parseInt(process.env.PORT || '5000', 10),
  database_url: process.env.DATABASE_URL as string,
  node_env: process.env.NODE_ENV || 'development',
  jwt_secret: process.env.JWT_SECRET,
};

export default config;
