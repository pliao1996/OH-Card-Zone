import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type DrawInput, type DrawResponse } from "@shared/routes";

// GET /api/cards
export function useCards(type?: 'image' | 'word') {
  return useQuery({
    queryKey: [api.cards.list.path, type],
    queryFn: async () => {
      const url = buildUrl(api.cards.list.path);
      // Need to append query params manually as buildUrl only handles path params
      const queryParams = type ? `?type=${type}` : '';
      const res = await fetch(url + queryParams, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch cards");
      return api.cards.list.responses[200].parse(await res.json());
    },
  });
}

// GET /api/cards/:id
export function useCard(id: number) {
  return useQuery({
    queryKey: [api.cards.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.cards.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch card");
      return api.cards.get.responses[200].parse(await res.json());
    },
  });
}

// POST /api/draw
export function useDrawCards() {
  return useMutation({
    mutationFn: async (input: DrawInput) => {
      const res = await fetch(api.cards.draw.path, {
        method: api.cards.draw.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to draw cards");
      return api.cards.draw.responses[200].parse(await res.json());
    },
  });
}
