
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
      1: "1_1768116238623.jpg",
      2: "2_1768116238628.jpg",
      3: "3_1768116238625.jpg",
      4: "4_1768116238625.jpg",
      5: "5_1768116238624.jpg",
      6: "6_1768116238621.jpg",
      7: "7_1768116238620.jpg",
      8: "8_1768116238621.jpg",
      9: "9_1768116238619.jpg",
      10: "10_1768116238622.jpg",
      11: "11_1768116238627.jpg",
      12: "12_1768116238626.jpg",
      13: "13_1768116238619.jpg",
      14: "14_1768116238620.jpg",
      15: "15_1768116238627.jpg",
      16: "16_1768116238626.jpg",
      17: "17_1768116853169.jpg",
      18: "18_1768116853169.jpg",
      19: "19_1768116238625.jpg",
      20: "20_1768116238626.jpg",
      21: "21_1768116853170.jpg",
      22: "22_1768116853169.jpg",
      23: "23_1768116853170.jpg",
      24: "24_1768116853164.jpg",
      25: "25_1768116853166.jpg",
      26: "26_1768116853170.jpg",
      27: "27_1768116853168.jpg",
      28: "28_1768116853170.jpg",
      29: "29_1768116853168.jpg",
      30: "30_1768116853170.jpg",
      31: "31_1768116853171.jpg",
      32: "32_1768116853169.jpg",
      33: "33_1768116853170.jpg",
      34: "34_1768116853169.jpg",
      35: "35_1768116853170.jpg",
      36: "36_1768115533921.jpg",
      37: "37_1768117293846.jpg",
      38: "38_1768117293844.jpg",
      39: "39_1768115533921.jpg",
      40: "40_1768116972360.jpg",
      41: "41_1768117293844.jpg",
      42: "42_1768116972359.jpg",
      43: "43_1768116972359.jpg",
      44: "44_1768116853170.jpg",
      45: "45_1768117293844.jpg",
      46: "46_1768115533919.jpg",
      47: "47__1768115533920.jpg",
      48: "48_1768116972359.jpg",
      49: "49_1768115533920.jpg",
      50: "50_1768115533919.jpg",
      51: "51_1768115533917.jpg",
      52: "52_1768115533919.jpg",
      53: "53_1768115533916.jpg",
      54: "54_1768115533913.jpg",
      55: "55_1768115533917.jpg",
      56: "56_1768115533916.jpg",
      57: "57_1768115533919.jpg",
      58: "58_1768115533914.jpg",
      59: "59_1768115533918.jpg",
      60: "60_1768115533918.jpg",
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
      8: "8_1768220157108.png",
      10: "10_1768220157111.png",
      11: "11_1768220157108.png",
      12: "12_1768220157108.png",
      13: "13_1768220157108.png",
      14: "14_1768220157108.png",
      15: "15_1768220157110.png",
      16: "16_1768220157111.png",
      17: "17_1768220157107.png",
      18: "18_1768220157110.png",
      19: "19_1768220157107.png",
      20: "20_1768220157107.png",
      21: "21_1768220157108.png",
      22: "22_1768220157107.png",
      23: "23_1768220157105.png",
      24: "24_1768220157107.png",
      25: "25_1768220157094.png",
      26: "26_1768220157095.png",
      27: "27_1768220157107.png",
      28: "28_1768220157094.png",
      29: "29_1768219681308.png",
      30: "30_1768219681307.png",
      31: "31_1768219681308.png",
      32: "32_1768219681307.png",
      33: "33_1768219681307.png",
      34: "34_1768219681307.png",
      35: "35_1768219681308.png",
      36: "36_1768219681307.png",
      37: "37_1768219681308.png",
      38: "38_1768219681307.png",
      39: "39_1768219681307.png",
      40: "40_1768219681308.png",
      41: "41_1768219681307.png",
      42: "42_1768219681307.png",
      43: "43_1768219681306.png",
      44: "44_1768219681306.png",
      45: "45_1768219681306.png",
      46: "46_1768219681306.png",
      47: "47_1768219681306.png",
      48: "48_1768219300626.png",
      49: "49_1768219300627.png",
      50: "50_1768219300627.png",
      51: "51_1768219300627.png",
      52: "52_1768219300623.png",
      53: "53_1768219300623.png",
      54: "54_1768219300628.png",
      55: "55_1768219300625.png",
      56: "56_1768219300623.png",
      57: "57_1768219300625.png",
      58: "58_1768219300622.png",
      59: "59_1768219300623.png",
      60: "60_1768219681305.png",
      61: "61_1768219300627.png",
      62: "62_1768219300628.png",
      63: "63_1768219300622.png",
      64: "64_1768219300620.png",
      65: "65_1768219300621.png",
      66: "66_1768219300621.png",
      67: "67_1768219300621.png",
      68: "68_1768219050854.png",
      69: "69_1768219050855.png",
      70: "70_1768219050856.png",
      71: "71_1768219050854.png",
      72: "72_1768219050855.png",
      73: "73_1768219050854.png",
      74: "74_1768219300620.png",
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
        title: filename ? `字卡 ${i}` : word
      });
    }

    await db.insert(cards).values(newCards);
    console.log("Database seeded with OH Cards (Chinese)");
  }
}

export const storage = new DatabaseStorage();
