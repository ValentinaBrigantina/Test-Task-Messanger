import { drizzle } from 'drizzle-orm/postgres-js'
// import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'
import { z } from "zod"

const PostgresEnv = z.object({
    DB_URL: z.string().url(),
  })
const ProcessEnv = PostgresEnv.parse(process.env)

const queryClient = postgres(ProcessEnv.DB_URL);
export const db = drizzle(queryClient);