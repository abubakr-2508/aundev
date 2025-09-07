import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import * as fs from "fs";
import * as path from "path";

async function runMigration() {
  // Read the migration file
  const migrationPath = path.join(__dirname, "migrations", "0001_user_subscriptions.sql");
  const migrationSQL = fs.readFileSync(migrationPath, "utf-8");

  // Connect to the database
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });
  
  await client.connect();
  
  try {
    // Run the migration
    await client.query(migrationSQL);
    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Error running migration:", error);
  } finally {
    await client.end();
  }
}

runMigration();