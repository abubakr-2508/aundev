import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import dotenv from "dotenv";

dotenv.config();

async function createTable() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log("Connected to database");

    // Check if the user_freestyle_data table exists
    const tableExistsQuery = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'user_freestyle_data'
      );
    `;

    const tableResult = await client.query(tableExistsQuery);
    const tableExists = tableResult.rows[0].exists;

    if (!tableExists) {
      // Create the user_freestyle_data table
      const createTableQuery = `
        CREATE TABLE user_freestyle_data (
          user_id TEXT PRIMARY KEY,
          freestyle_identity TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT NOW() NOT NULL
        );
      `;

      await client.query(createTableQuery);
      console.log("Table user_freestyle_data created successfully");
    } else {
      console.log("Table user_freestyle_data already exists");
    }

    // Check if the enum type exists
    const enumExistsQuery = `
      SELECT EXISTS (
        SELECT 1 FROM pg_type WHERE typname = 'app_user_permission'
      );
    `;

    const enumResult = await client.query(enumExistsQuery);
    const enumExists = enumResult.rows[0].exists;

    if (!enumExists) {
      // Create the enum type
      const createEnumQuery = `
        CREATE TYPE app_user_permission AS ENUM('read', 'write', 'admin');
      `;

      await client.query(createEnumQuery);
      console.log("Enum app_user_permission created successfully");
    } else {
      console.log("Enum app_user_permission already exists");
    }
  } catch (error) {
    console.error("Error creating table:", error);
  } finally {
    await client.end();
  }
}

createTable();