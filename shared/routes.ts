
import { z } from 'zod';
import { cards } from './schema';

// ============================================
// SHARED ERROR SCHEMAS
// ============================================
export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

// ============================================
// API CONTRACT
// ============================================
export const api = {
  cards: {
    list: {
      method: 'GET' as const,
      path: '/api/cards',
      input: z.object({
        type: z.enum(['image', 'word']).optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof cards.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/cards/:id',
      responses: {
        200: z.custom<typeof cards.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    draw: {
      method: 'POST' as const,
      path: '/api/draw',
      input: z.object({
        mode: z.enum(['image', 'word', 'pair']),
      }),
      responses: {
        200: z.object({
          cards: z.array(z.custom<typeof cards.$inferSelect>()),
        }),
      },
    },
  },
};

// ============================================
// REQUIRED: buildUrl helper
// ============================================
export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

// ============================================
// TYPE HELPERS
// ============================================
export type CardResponse = z.infer<typeof api.cards.get.responses[200]>;
export type DrawInput = z.infer<typeof api.cards.draw.input>;
export type DrawResponse = z.infer<typeof api.cards.draw.responses[200]>;
