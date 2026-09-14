CREATE TABLE `suppressed_nominees` (
	`id` text PRIMARY KEY NOT NULL,
	`cycle_id` text NOT NULL,
	`book_id` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `suppressed_nominees_cycle_book_unique` ON `suppressed_nominees` (`cycle_id`,`book_id`);
