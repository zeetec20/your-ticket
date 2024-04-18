ALTER TABLE "events" ADD COLUMN "date" date NOT NULL;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "time_start" time NOT NULL;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "time_end" time NOT NULL;