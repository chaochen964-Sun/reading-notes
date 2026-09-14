CREATE TABLE "books" (
	"id" text PRIMARY KEY NOT NULL,
	"isbn" text NOT NULL,
	"title" text NOT NULL,
	"authors" text DEFAULT '' NOT NULL,
	"publisher" text DEFAULT '' NOT NULL,
	"published_date" text DEFAULT '' NOT NULL,
	"cover_url" text DEFAULT '' NOT NULL,
	"podcast_url" text DEFAULT '' NOT NULL,
	"chapters_json" text DEFAULT '[]' NOT NULL,
	"created_at" double precision NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cycles" (
	"id" text PRIMARY KEY NOT NULL,
	"eyebrow" text DEFAULT '本期共读' NOT NULL,
	"title" text NOT NULL,
	"selected_book_id" text,
	"summary" text DEFAULT '' NOT NULL,
	"is_active" integer DEFAULT 1 NOT NULL,
	"created_at" double precision NOT NULL
);
--> statement-breakpoint
CREATE TABLE "group_notes" (
	"id" text PRIMARY KEY NOT NULL,
	"cycle_id" text NOT NULL,
	"book_id" text NOT NULL,
	"device_id" text NOT NULL,
	"display_name" text NOT NULL,
	"avatar" text NOT NULL,
	"chapter" text DEFAULT '' NOT NULL,
	"quote" text DEFAULT '' NOT NULL,
	"body" text NOT NULL,
	"created_at" double precision NOT NULL
);
--> statement-breakpoint
CREATE TABLE "library_entries" (
	"id" text PRIMARY KEY NOT NULL,
	"device_id" text NOT NULL,
	"display_name" text NOT NULL,
	"avatar" text NOT NULL,
	"book_id" text NOT NULL,
	"status" text DEFAULT 'reading' NOT NULL,
	"progress" integer DEFAULT 0 NOT NULL,
	"current_chapter" text DEFAULT '' NOT NULL,
	"reflection" text DEFAULT '' NOT NULL,
	"updated_at" double precision NOT NULL
);
--> statement-breakpoint
CREATE TABLE "nominees" (
	"id" text PRIMARY KEY NOT NULL,
	"cycle_id" text NOT NULL,
	"book_id" text NOT NULL,
	"note" text DEFAULT '' NOT NULL,
	"created_at" double precision NOT NULL
);
--> statement-breakpoint
CREATE TABLE "personal_notes" (
	"id" text PRIMARY KEY NOT NULL,
	"device_id" text NOT NULL,
	"display_name" text NOT NULL,
	"avatar" text NOT NULL,
	"book_id" text NOT NULL,
	"chapter" text DEFAULT '' NOT NULL,
	"quote" text DEFAULT '' NOT NULL,
	"body" text NOT NULL,
	"created_at" double precision NOT NULL
);
--> statement-breakpoint
CREATE TABLE "suppressed_nominees" (
	"id" text PRIMARY KEY NOT NULL,
	"cycle_id" text NOT NULL,
	"book_id" text NOT NULL,
	"created_at" double precision NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "books_isbn_unique" ON "books" USING btree ("isbn");--> statement-breakpoint
CREATE INDEX "group_notes_cycle_book_idx" ON "group_notes" USING btree ("cycle_id","book_id");--> statement-breakpoint
CREATE UNIQUE INDEX "library_device_book_unique" ON "library_entries" USING btree ("device_id","book_id");--> statement-breakpoint
CREATE INDEX "library_device_idx" ON "library_entries" USING btree ("device_id");--> statement-breakpoint
CREATE INDEX "nominees_cycle_idx" ON "nominees" USING btree ("cycle_id");--> statement-breakpoint
CREATE INDEX "personal_notes_device_book_idx" ON "personal_notes" USING btree ("device_id","book_id");--> statement-breakpoint
CREATE UNIQUE INDEX "suppressed_nominees_cycle_book_unique" ON "suppressed_nominees" USING btree ("cycle_id","book_id");