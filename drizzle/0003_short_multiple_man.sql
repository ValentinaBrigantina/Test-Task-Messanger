ALTER TABLE "expenses" ALTER COLUMN "user_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "expenses" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "expenses" ADD COLUMN "date" date NOT NULL;--> statement-breakpoint
ALTER TABLE "expenses" ADD COLUMN "created_at" timestamp DEFAULT now();