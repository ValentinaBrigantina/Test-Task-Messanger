ALTER TABLE "messages" RENAME COLUMN "image" TO "src";--> statement-breakpoint
ALTER TABLE "messages" ALTER COLUMN "text" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "messages" ADD COLUMN "type" integer DEFAULT 1 NOT NULL;