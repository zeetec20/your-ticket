ALTER TABLE "guests"
ALTER COLUMN "name"
SET DATA TYPE varchar(255);
--> statement-breakpoint
-- ALTER TABLE "events"
-- ADD COLUMN "organizer" varchar(225) NOT NULL DEFAULT 'name';
--> statement-breakpoint
-- ALTER TABLE "guests"
-- ADD COLUMN "code" varchar(255) NOT NULL;
--> statement-breakpoint
-- ALTER TABLE "guests"
-- ADD COLUMN "attended_at" timestamp;
ALTER TABLE "events"
ALTER COLUMN "organizer" DROP DEFAULT;
ALTER TABLE "guests"
ALTER COLUMN "code" DROP DEFAULT;