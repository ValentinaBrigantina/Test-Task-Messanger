CREATE TABLE IF NOT EXISTS "users_to_channels" (
	"user_id" integer NOT NULL,
	"channel_id" integer NOT NULL,
	CONSTRAINT "users_to_channels_user_id_channel_id_pk" PRIMARY KEY("user_id","channel_id")
);
--> statement-breakpoint
ALTER TABLE "channels" ADD COLUMN "name" varchar(255);--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_to_channels" ADD CONSTRAINT "users_to_channels_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_to_channels" ADD CONSTRAINT "users_to_channels_channel_id_channels_id_fk" FOREIGN KEY ("channel_id") REFERENCES "public"."channels"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
