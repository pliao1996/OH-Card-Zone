
import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Initialize seed data
  await storage.seedCards();

  app.get(api.cards.list.path, async (req, res) => {
    const type = req.query.type as 'image' | 'word' | undefined;
    const cards = await storage.getCards(type);
    res.json(cards);
  });

  app.get(api.cards.get.path, async (req, res) => {
    const card = await storage.getCard(Number(req.params.id));
    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }
    res.json(card);
  });

  app.post(api.cards.draw.path, async (req, res) => {
    try {
      const input = api.cards.draw.input.parse(req.body);
      const cards = await storage.drawCards(input.mode, input.count);
      res.json({ cards });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  return httpServer;
}
