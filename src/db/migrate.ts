import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

const main = async () => {
  try {
    await migrate(db, { migrationsFolder: "./src/db/migrations" });
    console.log("Migration completed 🎉");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

main();
