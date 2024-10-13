import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

const migrationClient = drizzle(postgres(process.env.DB_URL as string, { max: 1 }))
// console.log('process.env.DB_URL: ', process.env.DB_URL)
// await migrate(drizzle(migrationClient), { migrationsFolder: "./server/db/drizzle" });
const main = async () => {
	try {
		await migrate(migrationClient, { migrationsFolder: "./drizzle" });
		console.log("Migration complete");
	} catch (error) {
		console.log(error);
	}
	process.exit(0);
};
main()