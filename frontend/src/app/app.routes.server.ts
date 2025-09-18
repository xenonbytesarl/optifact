import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Dynamic parameterized routes should not be prerendered.
  // Invoices
  { path: 'invoices/:id', renderMode: RenderMode.Server },
  { path: 'invoices/:id/edit', renderMode: RenderMode.Server },
  // Sequences
  { path: 'sequences/:id', renderMode: RenderMode.Server },
  { path: 'sequences/:id/edit', renderMode: RenderMode.Server },
  // Claims
  { path: 'claims/:id', renderMode: RenderMode.Server },
  { path: 'claims/:id/edit', renderMode: RenderMode.Server },
  // Actors
  { path: 'actors/:id', renderMode: RenderMode.Server },
  { path: 'actors/:id/edit', renderMode: RenderMode.Server },
  // Attachment types
  { path: 'attachment-types/:id', renderMode: RenderMode.Server },
  { path: 'attachment-types/:id/edit', renderMode: RenderMode.Server },
  // Products
  { path: 'products/:id', renderMode: RenderMode.Server },
  { path: 'products/:id/edit', renderMode: RenderMode.Server },
  // Product categories
  { path: 'product-categories/:id', renderMode: RenderMode.Server },
  { path: 'product-categories/:id/edit', renderMode: RenderMode.Server },
  // Fallback: prerender all other routes
  { path: '**', renderMode: RenderMode.Prerender }
];

// Optional: define prerender parameter generation hook.
// Returning an empty array means no parameterized routes are prerendered by default.
// You can later fetch IDs from an API and return [{ id: '...' }] objects per route.
export function getPrerenderParams() {
  return [] as Array<Record<string, string>>;
}
