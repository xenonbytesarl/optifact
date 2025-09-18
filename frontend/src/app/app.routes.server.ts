import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Dynamic parameterized routes should not be prepended.
  { path: 'invoices/:id', renderMode: RenderMode.Server },
  { path: 'invoices/:id/edit', renderMode: RenderMode.Server },
  { path: 'sequences/:id', renderMode: RenderMode.Server },
  { path: 'sequences/:id/edit', renderMode: RenderMode.Server },
  { path: 'claims/:id', renderMode: RenderMode.Server },
  { path: 'claims/:id/edit', renderMode: RenderMode.Server },
  // Fallback: prerender all other routes
  { path: '**', renderMode: RenderMode.Prerender }
];
