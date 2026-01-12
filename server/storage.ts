
import { db } from "./db";
import { cards, type Card, type InsertCard } from "@shared/schema";
import { eq, sql } from "drizzle-orm";

export interface IStorage {
  getCards(type?: 'image' | 'word'): Promise<Card[]>;
  getCard(id: number): Promise<Card | undefined>;
  drawCards(mode: 'image' | 'word' | 'pair', count?: number): Promise<Card[]>;
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

  async drawCards(mode: 'image' | 'word' | 'pair', count: number = 1): Promise<Card[]> {
    if (mode === 'image') {
      const result = await db.execute(sql`SELECT * FROM cards WHERE type = 'image' ORDER BY RANDOM() LIMIT ${count}`);
      return result.rows.map(row => ({
        id: row.id as number,
        type: row.type as string,
        number: row.number as number,
        content: row.content as string,
        title: row.title as string
      }));
    } else if (mode === 'word') {
      const result = await db.execute(sql`SELECT * FROM cards WHERE type = 'word' ORDER BY RANDOM() LIMIT ${count}`);
      return result.rows.map(row => ({
        id: row.id as number,
        type: row.type as string,
        number: row.number as number,
        content: row.content as string,
        title: row.title as string
      }));
    } else {
      // For pair mode, we usually want 1 image + 1 word, or multiple pairs if count > 1
      const cards: Card[] = [];
      for (let i = 0; i < count; i++) {
        const imgResult = await db.execute(sql`SELECT * FROM cards WHERE type = 'image' ORDER BY RANDOM() LIMIT 1`);
        const wordResult = await db.execute(sql`SELECT * FROM cards WHERE type = 'word' ORDER BY RANDOM() LIMIT 1`);
        
        if (imgResult.rows[0]) {
          const imgCard = imgResult.rows[0];
          cards.push({
            id: imgCard.id as number,
            type: imgCard.type as string,
            number: imgCard.number as number,
            content: imgCard.content as string,
            title: imgCard.title as string
          });
        }
        if (wordResult.rows[0]) {
          const wordCard = wordResult.rows[0];
          cards.push({
            id: wordCard.id as number,
            type: wordCard.type as string,
            number: wordCard.number as number,
            content: wordCard.content as string,
            title: wordCard.title as string
          });
        }
      }
      return cards;
    }
  }

  async seedCards(): Promise<void> {
    const count = await db.select({ count: sql<number>`count(*)` }).from(cards);
    if (Number(count[0].count) > 0) return;

    const newCards: InsertCard[] = [];

    const imageMap: Record<number, string> = {
      61: "61_1768115306541.jpg",
      62: "62_1768115306540.jpg",
      63: "63_1768115306540.jpg",
      64: "64_1768115306540.jpg",
      65: "65_1768115306539.jpg",
      66: "66_1768115306535.jpg",
      67: "67_1768115306525.jpg",
      68: "68_1768113123930.jpg",
      69: "69_1768115306537.jpg",
      70: "70_1768115306535.jpg",
      71: "71_1768115306533.jpg",
      72: "72_1768115306529.jpg",
      73: "73_1768115306534.jpg",
      74: "74_1768115306524.jpg",
      75: "75_1768115306536.jpg",
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

    for (let i = 1; i <= 88; i++) {
      const filename = imageMap[i];
      newCards.push({
        type: 'image',
        number: i,
        content: filename || `image_${i}.jpg`,
        title: filename || `图卡 ${i}`
      });
    }

    const ohWords = [
      "放下", "爱", "恐惧", "希望", "改变", "童年", "梦想", "家庭", 
      "愧疚", "快乐", "痛苦", "游戏", "力量", "羞耻", "信任", "真理",
      "孤独", "友谊", "背叛", "成功", "失败", "冒险", "安全", "冲突",
      "和平", "自然", "城市", "劳动", "休息", "死亡", "出生", "时间"
    ];
    
    const wordMap: Record<number, string> = {
      68: "68_1768219050854.png",
      69: "69_1768219050855.png",
      70: "70_1768219050856.png",
      71: "71_1768219050854.png",
      72: "72_1768219050855.png",
      73: "73_1768219050854.png",
      75: "75_1768219050854.png",
      76: "76_1768219050854.png",
      77: "77_1768219050855.png",
      78: "78_1768219050856.png",
      79: "79_1768219050855.png",
      80: "80_1768219050855.png",
      81: "81_1768219050855.png",
      82: "82_1768219050855.png",
      83: "83_1768219050853.png",
      84: "84_1768219050854.png",
      85: "85_1768219050854.png",
      86: "86_1768219050854.png",
      87: "87_1768219050853.png",
      88: "88_1768219050853.png",
    };

    for (let i = 1; i <= 88; i++) {
      const word = ohWords[(i - 1) % ohWords.length];
      const filename = wordMap[i];
      newCards.push({
        type: 'word',
        number: i,
        content: filename || word,
        title: `字卡 ${i}`
      });
    }

    await db.insert(cards).values(newCards);
    console.log("Database seeded with OH Cards (Chinese)");
  }
}

export const storage = new DatabaseStorage();
