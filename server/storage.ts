import * as fs from 'fs';
import * as path from 'path';

import type { Card } from "@shared/schema";

export interface IStorage {
  getCards(type?: "image" | "word"): Promise<Card[]>;
  getCard(id: number): Promise<Card | undefined>;
  drawCards(mode: "image" | "word" | "pair", count?: number): Promise<Card[]>;
  seedCards(): Promise<void>;
}

export class FileStorage implements IStorage {
  private cardsData: Card[] | null = null;

  private async loadCards(): Promise<Card[]> {
    if (this.cardsData !== null) {
      return this.cardsData;
    }

    try {
      const cardsFilePath = path.join(process.cwd(), "cards.json");
      const data = await fs.promises.readFile(cardsFilePath, "utf-8");
      this.cardsData = JSON.parse(data);
      return this.cardsData!;
    } catch (error) {
      console.error("Failed to load cards.json:", error);
      this.cardsData = [];
      return this.cardsData;
    }
  }

  async getCards(type?: "image" | "word"): Promise<Card[]> {
    const allCards = await this.loadCards();
    if (type) {
      return allCards.filter((card) => card.type === type);
    }
    return allCards;
  }

  async getCard(id: number): Promise<Card | undefined> {
    const allCards = await this.loadCards();
    return allCards.find((card) => card.id === id);
  }

  async drawCards(
    mode: "image" | "word" | "pair",
    count: number = 1
  ): Promise<Card[]> {
    const allCards = await this.loadCards();

    if (mode === "image") {
      const imageCards = allCards.filter((card) => card.type === "image");
      return this.getRandomCards(imageCards, count);
    } else if (mode === "word") {
      const wordCards = allCards.filter((card) => card.type === "word");
      return this.getRandomCards(wordCards, count);
    } else {
      // For pair mode, we usually want 1 image + 1 word, or multiple pairs if count > 1
      const imageCards = allCards.filter((card) => card.type === "image");
      const wordCards = allCards.filter((card) => card.type === "word");
      const cards: Card[] = [];

      for (let i = 0; i < count; i++) {
        const randomImage = this.getRandomCard(imageCards);
        const randomWord = this.getRandomCard(wordCards);
        if (randomImage) cards.push(randomImage);
        if (randomWord) cards.push(randomWord);
      }

      return cards;
    }
  }

  private getRandomCard(cards: Card[]): Card | undefined {
    if (cards.length === 0) return undefined;
    return cards[Math.floor(Math.random() * cards.length)];
  }

  private getRandomCards(cards: Card[], count: number): Card[] {
    if (cards.length === 0) return [];

    // 确保不会重复抽取同一张牌
    const availableCards = [...cards];
    const result: Card[] = [];

    for (let i = 0; i < count && availableCards.length > 0; i++) {
      const randomIndex = Math.floor(Math.random() * availableCards.length);
      const randomCard = availableCards[randomIndex];
      result.push(randomCard);
      // 移除已抽取的卡牌
      availableCards.splice(randomIndex, 1);
    }

    return result;
  }

  async seedCards(): Promise<void> {
    // No-op: Cards are loaded from cards.json on demand
  }
}

export const storage = new FileStorage();
