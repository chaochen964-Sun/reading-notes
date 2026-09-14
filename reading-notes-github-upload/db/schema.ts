import { doublePrecision, index, integer, pgTable, text, uniqueIndex } from "drizzle-orm/pg-core";

// `created_at`/`updated_at` hold epoch milliseconds. Postgres `integer` overflows at
// 2^31, so these use `double precision`, which represents every millisecond value
// JavaScript can produce exactly and is returned to the driver as a number.
export const books = pgTable("books", {
  id: text("id").primaryKey(), isbn: text("isbn").notNull(), title: text("title").notNull(), authors: text("authors").notNull().default(""), publisher: text("publisher").notNull().default(""), publishedDate: text("published_date").notNull().default(""), coverUrl: text("cover_url").notNull().default(""), podcastUrl: text("podcast_url").notNull().default(""), chaptersJson: text("chapters_json").notNull().default("[]"), createdAt: doublePrecision("created_at").notNull(),
}, (table) => [uniqueIndex("books_isbn_unique").on(table.isbn)]);

export const libraryEntries = pgTable("library_entries", {
  id: text("id").primaryKey(), deviceId: text("device_id").notNull(), displayName: text("display_name").notNull(), avatar: text("avatar").notNull(), bookId: text("book_id").notNull(), status: text("status").notNull().default("reading"), progress: integer("progress").notNull().default(0), currentChapter: text("current_chapter").notNull().default(""), reflection: text("reflection").notNull().default(""), updatedAt: doublePrecision("updated_at").notNull(),
}, (table) => [uniqueIndex("library_device_book_unique").on(table.deviceId, table.bookId), index("library_device_idx").on(table.deviceId)]);

export const personalNotes = pgTable("personal_notes", {
  id: text("id").primaryKey(), deviceId: text("device_id").notNull(), displayName: text("display_name").notNull(), avatar: text("avatar").notNull(), bookId: text("book_id").notNull(), chapter: text("chapter").notNull().default(""), quote: text("quote").notNull().default(""), body: text("body").notNull(), createdAt: doublePrecision("created_at").notNull(),
}, (table) => [index("personal_notes_device_book_idx").on(table.deviceId, table.bookId)]);

// `is_active` stays an integer flag (1/0) so the raw SQL in the API routes can set it
// directly without a boolean cast.
export const cycles = pgTable("cycles", {
  id: text("id").primaryKey(), eyebrow: text("eyebrow").notNull().default("本期共读"), title: text("title").notNull(), selectedBookId: text("selected_book_id"), summary: text("summary").notNull().default(""), isActive: integer("is_active").notNull().default(1), createdAt: doublePrecision("created_at").notNull(),
});

export const nominees = pgTable("nominees", {
  id: text("id").primaryKey(), cycleId: text("cycle_id").notNull(), bookId: text("book_id").notNull(), note: text("note").notNull().default(""), createdAt: doublePrecision("created_at").notNull(),
}, (table) => [index("nominees_cycle_idx").on(table.cycleId)]);

export const suppressedNominees = pgTable("suppressed_nominees", {
  id: text("id").primaryKey(), cycleId: text("cycle_id").notNull(), bookId: text("book_id").notNull(), createdAt: doublePrecision("created_at").notNull(),
}, (table) => [uniqueIndex("suppressed_nominees_cycle_book_unique").on(table.cycleId, table.bookId)]);

export const groupNotes = pgTable("group_notes", {
  id: text("id").primaryKey(), cycleId: text("cycle_id").notNull(), bookId: text("book_id").notNull(), deviceId: text("device_id").notNull(), displayName: text("display_name").notNull(), avatar: text("avatar").notNull(), chapter: text("chapter").notNull().default(""), quote: text("quote").notNull().default(""), body: text("body").notNull(), createdAt: doublePrecision("created_at").notNull(),
}, (table) => [index("group_notes_cycle_book_idx").on(table.cycleId, table.bookId)]);
