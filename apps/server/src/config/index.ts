import dotenv from "dotenv";

// Carregar variáveis de ambiente
dotenv.config();

export class Config {
  // Database
  static readonly DB_HOST = process.env["DB_HOST"] || "localhost";
  static readonly DB_PORT = parseInt(process.env["DB_PORT"] || "5432");
  static readonly DB_NAME = process.env["DB_NAME"] || "projetointegrador";
  static readonly DB_USER = process.env["DB_USER"] || "postgres";
  static readonly DB_PASSWORD = process.env["DB_PASSWORD"] || "password";
  static readonly DATABASE_URL =
    process.env["DATABASE_URL"] ||
    `postgresql://${this.DB_USER}:${this.DB_PASSWORD}@${this.DB_HOST}:${this.DB_PORT}/${this.DB_NAME}`;

  // Server
  static readonly SERVER_PORT = parseInt(process.env["SERVER_PORT"] || "3000");
  static readonly NODE_ENV = process.env["NODE_ENV"] || "development";

  // CORS
  static readonly CORS_ORIGIN =
    process.env["CORS_ORIGIN"] || "http://localhost:5173";

  // JWT
  static readonly JWT_SECRET =
    process.env["JWT_SECRET"] ||
    "your-super-secret-jwt-key-change-in-production";

  // Docker
  static readonly DOCKER_IMAGE_TAG =
    process.env["DOCKER_IMAGE_TAG"] || "latest";

  // Métodos utilitários
  static isDevelopment(): boolean {
    return this.NODE_ENV === "development";
  }

  static isProduction(): boolean {
    return this.NODE_ENV === "production";
  }

  static isTest(): boolean {
    return this.NODE_ENV === "test";
  }

  static getCorsOrigins(): string[] {
    return [
      "*",
      this.CORS_ORIGIN,
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "http://0.0.0.0:5173",
    ];
  }

  static getDatabaseConfig() {
    return {
      host: this.DB_HOST,
      port: this.DB_PORT,
      database: this.DB_NAME,
      user: this.DB_USER,
      password: this.DB_PASSWORD,
      url: this.DATABASE_URL,
    };
  }

  static getServerConfig() {
    return {
      port: this.SERVER_PORT,
      environment: this.NODE_ENV,
      corsOrigins: this.getCorsOrigins(),
    };
  }

  // Debug method to check environment variables
  static debug() {
    console.log("🔧 Config Debug:");
    console.log("DATABASE_URL:", this.DATABASE_URL);
    console.log("DB_HOST:", this.DB_HOST);
    console.log("DB_USER:", this.DB_USER);
    console.log("DB_PASSWORD:", this.DB_PASSWORD);
    console.log("DB_PORT:", this.DB_PORT);
    console.log("NODE_ENV:", this.NODE_ENV);
  }
}
