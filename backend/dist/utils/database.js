"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDatabase = exports.initializeDatabase = void 0;
// Simple database client without Prisma for now
const sqlite3_1 = __importDefault(require("sqlite3"));
const sqlite_1 = require("sqlite");
let db = null;
const initializeDatabase = async () => {
    if (db)
        return db;
    db = await (0, sqlite_1.open)({
        filename: './dev.db',
        driver: sqlite3_1.default.Database
    });
    // Create tables based on our schema
    await db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      start_date DATE,
      end_date DATE,
      budget REAL,
      status TEXT DEFAULT 'PLANNING',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS work_items (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      unit TEXT NOT NULL,
      design_quantity REAL NOT NULL,
      completed_quantity REAL DEFAULT 0,
      unit_price REAL NOT NULL,
      start_date DATE,
      end_date DATE,
      status TEXT DEFAULT 'NOT_STARTED',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (project_id) REFERENCES projects (id)
    );

    CREATE TABLE IF NOT EXISTS materials (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT,
      unit TEXT,
      unit_price REAL,
      stock_quantity REAL DEFAULT 0,
      minimum_stock REAL DEFAULT 0,
      supplier TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS equipment (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT,
      model TEXT,
      status TEXT DEFAULT 'AVAILABLE',
      daily_rate REAL,
      last_maintenance DATE,
      next_maintenance DATE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS workers (
      id TEXT PRIMARY KEY,
      employee_code TEXT UNIQUE,
      name TEXT NOT NULL,
      position TEXT,
      skill_level INTEGER,
      hourly_rate REAL,
      daily_rate REAL,
      phone TEXT,
      address TEXT,
      hire_date DATE,
      status TEXT DEFAULT 'ACTIVE',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
    return db;
};
exports.initializeDatabase = initializeDatabase;
const getDatabase = () => {
    if (!db) {
        throw new Error('Database not initialized. Call initializeDatabase() first.');
    }
    return db;
};
exports.getDatabase = getDatabase;
//# sourceMappingURL=database.js.map