
import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===
export const cards = pgTable("cards", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // 'image' | 'word'
  number: integer("number").notNull(), // 1-88 for images, 1-100 for words
  content: text("content").notNull(), // filename for images, text for words
  title: text("title").notNull(),     // Display name (e.g., "Image Card #1")
});

// === BASE SCHEMAS ===
export const insertCardSchema = createInsertSchema(cards).omit({ id: true });

// === EXPLICIT API CONTRACT TYPES ===
export type Card = typeof cards.$inferSelect;
export type InsertCard = z.infer<typeof insertCardSchema>;

export type CardResponse = Card;
export type CardsListResponse = Card[];

export interface DrawRequestParams {
  type: 'image' | 'word' | 'pair';
}

export interface DrawResponse {
  imageCard?: Card;
  wordCard?: Card;
}
