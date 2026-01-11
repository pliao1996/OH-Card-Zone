
import { db } from "./db";
import { cards, type Card, type InsertCard } from "@shared/schema";
import { eq, sql } from "drizzle-orm";

export interface IStorage {
  getCards(type?: 'image' | 'word'): Promise<Card[]>;
  getCard(id: number): Promise<Card | undefined>;
  drawCards(mode: 'image' | 'word' | 'pair'): Promise<Card[]>;
  seedCards(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getCards(type?: 'image' | 'word'): Promise<Card[]> {
    if (type) {
      return await db.select().from(cards).where(eq(cards.type, type));
    }
    return await db.select().from(cards);
  }

  async getCard(id: number): Promise<Card | undefined> {
    const [card] = await db.select().from(cards).where(eq(cards.id, id));
    return card;
  }

  async drawCards(mode: 'image' | 'word' | 'pair'): Promise<Card[]> {
    if (mode === 'image') {
      const result = await db.execute(sql`SELECT * FROM cards WHERE type = 'image' ORDER BY RANDOM() LIMIT 1`);
      return result.rows.map(row => ({
        id: row.id as number,
        type: row.type as string,
        number: row.number as number,
        content: row.content as string,
        title: row.title as string
      }));
    } else if (mode === 'word') {
      const result = await db.execute(sql`SELECT * FROM cards WHERE type = 'word' ORDER BY RANDOM() LIMIT 1`);
      return result.rows.map(row => ({
        id: row.id as number,
        type: row.type as string,
        number: row.number as number,
        content: row.content as string,
        title: row.title as string
      }));
    } else {
      // Pair
      const imgResult = await db.execute(sql`SELECT * FROM cards WHERE type = 'image' ORDER BY RANDOM() LIMIT 1`);
      const wordResult = await db.execute(sql`SELECT * FROM cards WHERE type = 'word' ORDER BY RANDOM() LIMIT 1`);
      
      const imgCard = imgResult.rows[0];
      const wordCard = wordResult.rows[0];

      return [
        {
          id: imgCard.id as number,
          type: imgCard.type as string,
          number: imgCard.number as number,
          content: imgCard.content as string,
          title: imgCard.title as string
        },
        {
          id: wordCard.id as number,
          type: wordCard.type as string,
          number: wordCard.number as number,
          content: wordCard.content as string,
          title: wordCard.title as string
        }
      ];
    }
  }

  async seedCards(): Promise<void> {
    const count = await db.select({ count: sql<number>`count(*)` }).from(cards);
    if (Number(count[0].count) > 0) return;

    const newCards: InsertCard[] = [];

    // Mapped image filenames based on uploaded assets
    const imageMap: Record<number, string> = {
      68: "68_1768113123930.jpg",
      76: "76_1768113123929.jpg",
      77: "77_1768113123930.jpg",
      78: "78_1768113123929.jpg",
      79: "79_1768113123929.jpg",
      80: "80_1768113123930.jpg",
      81: "81_1768113123927.jpg",
      82: "82_1768113109974.jpg",
      83: "83_1768113109974.jpg",
      84: "84_1768113109974.jpg",
      85: "85_1768113109971.jpg",
      86: "86_1768113109973.jpg",
      87: "87_1768113109972.jpg",
      88: "88_1768113109973.jpg",
    };

    // Seed 88 Image Cards
    for (let i = 1; i <= 88; i++) {
      newCards.push({
        type: 'image',
        number: i,
        content: imageMap[i] || `image_${i}.jpg`,
        title: `Image Card ${i}`
      });
    }

    // Seed 100 Word Cards
    const placeholderWords = [
      "Letting Go", "Love", "Fear", "Hope", "Change", "Childhood", "Dreams", "Family", 
      "Guilt", "Joy", "Pain", "Play", "Power", "Shame", "Trust", "Truth"
    ];
    
    for (let i = 1; i <= 100; i++) {
      const word = placeholderWords[(i - 1) % placeholderWords.length];
      newCards.push({
        type: 'word',
        number: i,
        content: i <= placeholderWords.length ? word : `${word} ${Math.ceil(i / placeholderWords.length)}`,
        title: `Word Card ${i}`
      });
    }

    await db.insert(cards).values(newCards);
    console.log("Database seeded with OH Cards");
  }
}

export const storage = new DatabaseStorage();
