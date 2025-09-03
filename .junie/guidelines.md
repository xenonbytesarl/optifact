# Lignes directrices projet – Application de facturation (Angular 20, Tailwind 4, NgRx Signal 19)

Ce document décrit une architecture simple et claire, avec séparation des responsabilités, pour une application de facturation (clients, produits, devis, factures, paiements). Il est adapté à Angular 20, Tailwind CSS v4 et @ngrx/signals v19/20.

Objectifs
- Simplicité: structure minimale, lisible par une petite équipe.
- Séparation des responsabilités: domaines fonctionnels nets, état local vs global, composants UI stateless.
- Scalabilité raisonnable: possibilité d’ajouter des features sans refactor massif.

1. Structure des dossiers (suggestion)
frontend/
  src/
    app/
      core/                # services transverses, interceptors, guards, config, api clients
      shared/              # librairie UI (components, directives, pipes), utilitaires
      features/
        customers/         # domaine Clients (feature slice)
        products/          # domaine Produits
        invoices/          # domaine Factures
        quotes/            # domaine Devis
        payments/          # domaine Paiements
      state/               # stores globaux (signals) si nécessaires
      app.routes.ts        # routes racine
      app.config.ts        # application providers (HttpClient, Tailwind init, etc.)
      app.component.*      # shell app
    styles.css             # Tailwind @import

2. Conventions Angular
- Standalone components: privilégier les composants standalone (pas de NgModule). 
- Routing par feature: chaque feature expose ses routes via un fichier routes.ts et est chargée en lazy-load.
- Injection: utiliser les providers au plus près de l’usage (provideIn: 'root' si transverse, sinon dans la route/feature).
- Change detection: par défaut Angular 20 optimise avec zoneless; viser des composants présentations (
  inputs/outputs) + containers (logique, sélection d’état) si nécessaire.

3. Tailwind CSS v4
- Configuration minimale: import unique dans src/styles.css avec `@import "tailwindcss";` (déjà présent).
- Design tokens: définir une palette (via CSS variables) dans :root si besoin. Ex. :root { --color-primary: ... }
- Icônes: utiliser Material Symbols (outlined/rounded) pour l’ensemble des icônes de l’application.
  - Ajout recommandé: <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" /> dans frontend/src/index.html.
  - Usage: <span class="material-symbols-outlined">home</span> avec des classes utilitaires Tailwind pour la taille/couleur.
- Pratiques:
  - Utiliser des classes utilitaires dans les templates.
  - Exposer des composants shared (Button, Card, FormField) pour réutilisation et cohérence.
  - Créer des presets de classes via @apply uniquement pour motifs très fréquents (ex: .btn-primary).

4. État & NgRx Signals
- Principes:
  - Préférer l’état local (signals dans les components) pour UI éphémère.
  - Utiliser des stores par feature lorsque l’état doit être partagé, dérivé ou synchronisé avec l’API.
- Pattern store par feature (simplifié):
  - customers.store.ts: 
    - signals: customers, loading, error, filters.
    - computed: filteredCustomers, stats.
    - methods: load(), add(), update(), remove().
    - effects (optionnel): gestion d’appels HTTP avec cancellation simple.
  - Exporte un provider: provideCustomersStore().
  - Consommation dans containers: inject(CustomersStore) pour lire/écrire.
- Stores globaux (app/state):
  - auth.store.ts: user, token, permissions.
  - settings.store.ts: préférence UI, devise, entreprise.
- Interop RxJS: où des flux externes existent (WebSocket), convertissez en signal via toSignal ou exposez avec compute.

5. Accès API et services
- clients HTTP par domaine dans core/api: CustomersApi, InvoicesApi, etc.
  - Responsabilité: requêtes CRUD, mapping minimal DTO -> modèle interne.
- Services domaine (optionnels) dans features/xxx/data ou core/domain si réutilisés.
- Gestion des erreurs: 
  - HttpInterceptor global (core/interceptors) pour 401/403/500.
  - Les stores gèrent error signal et exposent status (idle/loading/success/error).

6. Routage
- app.routes.ts: routes principales (dashboard, features). 
- Feature routes: lazy via loadComponent/loadChildren, gardes au besoin (authGuard).
- Shell layout: AppComponent affiche la topbar/sidebar + router-outlet.

7. UI et composants
- Shared components: Button, Input, Select, Table, Modal, EmptyState, Spinner.
- Feature components:
  - Container: InvoicesPage (charge, sélectionne, orchestre actions)
  - Présentation: InvoiceList, InvoiceRow, InvoiceForm
- Formulaires: Reactive Forms; validations sync/async. 
- Tables: composants réutilisables (pagination, tri, filtre) dans shared si usage commun.
- Cards: composants réutilisables (pagination, tri, filtre) dans shared si usage commun.
- Responsive: l’application doit être responsive et couvrir téléphone, tablette, PC portable, grand écran et très grand écran. Utiliser les breakpoints Tailwind (sm/md/lg/xl/2xl), layout fluides, grilles, et composants adaptatifs (stack->row, pagination compacte, etc.).

8. Modélisation de base (exemples)
- Customer: { id, name, email, phone, address }
- Product: { id, name, sku, priceHT, tva }
- Invoice: { id, number, date, customerId, lines: [{ productId, qty, priceHT, tva }], status, totalHT, totalTVA, totalTTC }
- Quote: proche d’Invoice avec status différent
- Payment: { id, invoiceId, date, amount, method }

9. Flux métiers (exemples)
- Création facture: sélectionner client -> ajouter lignes (produits) -> calculs -> sauvegarder -> générer PDF.
- Règlement: affecter paiement à facture -> MAJ status (partiellement payé, payé).

10. Exemples de code
- Store simple (signals)
  
  // features/customers/customers.store.ts
  import { inject, signal, computed } from '@angular/core';
  import { CustomersApi } from '../../core/api/customers.api';

  export class CustomersStore {
    private api = inject(CustomersApi);

    customers = signal([] as Array<{ id: string; name: string }>>());
    loading = signal(false);
    error = signal<string | null>(null);
    search = signal('');

    filtered = computed(() => {
      const q = this.search().toLowerCase();
      return this.customers().filter(c => c.name.toLowerCase().includes(q));
    });

    async load() {
      this.loading.set(true);
      this.error.set(null);
      try {
        const data = await this.api.list();
        this.customers.set(data);
      } catch (e: any) {
        this.error.set(e?.message ?? 'Erreur de chargement');
      } finally {
        this.loading.set(false);
      }
    }
  }

  export function provideCustomersStore() {
    return [{ provide: CustomersStore, useClass: CustomersStore }];
  }

- API client
  
  // core/api/customers.api.ts
  import { inject } from '@angular/core';
  import { HttpClient } from '@angular/common/http';

  export class CustomersApi {
    private http = inject(HttpClient);
    private base = '/api/customers';

    list() { return this.http.get<any[]>(this.base).toPromise(); }
    get(id: string) { return this.http.get<any>(`${this.base}/${id}`).toPromise(); }
    create(payload: any) { return this.http.post<any>(this.base, payload).toPromise(); }
    update(id: string, payload: any) { return this.http.put<any>(`${this.base}/${id}`, payload).toPromise(); }
    remove(id: string) { return this.http.delete<void>(`${this.base}/${id}`).toPromise(); }
  }

11. Qualité & tests
- Lint/format: Prettier configuré; ajouter ESLint si besoin.
- Tests unitaires: Jasmine/Karma par défaut. Viser tests sur stores (logique) et utilitaires.
- Tests d’intégration: tester components containers avec HttpTestingController.
- Tests E2E: utiliser Cypress pour les tests end-to-end (scénarios utilisateurs clés: navigation, formulaires, flux de facturation). Organisation suggérée: dossier e2e/ avec specs par feature; scripts npm: cypress:open et cypress:run.

12. Performance & accessibilité
- Signals et computed pour limiter recalculs.
- Pagination/Infinite scroll pour listes volumineuses.
- i18n (optionnel): Angular i18n ou transloco si besoin.
- A11y: respecter roles ARIA de base; focus management pour modals.

13. Build & environments
- Environments Angular pour URLs API.
- SSR (optionnel) déjà configuré, utile pour SEO/impressions PDF.
- CI rapide: `npm ci && npm run build` dans frontend/.

14. Roadmap minimale
- M0: Skeleton features + stores vides + routes.
- M1: Clients, Produits CRUD.
- M2: Factures (création, calculs), PDF (service séparé), Paiements.
- M3: Tableaux de bord (chiffre d’affaires, impayés).

15. Règles de contribution
- Une PR par feature slice. 
- 1 store par feature max tant que c’est simple. 
- Pas de logique métier dans les composants de présentation.

Références
- Angular 20 docs (standalone, signals)
- NgRx Signals Store
- Tailwind CSS v4

16. Charte graphique & branding
- Logo: utiliser le fichier frontend/public/assets/images/logo.png pour l’identité visuelle (header, sidebar, écran de connexion). Prévoir des variantes sombre/clair si nécessaire.
- Favicon/manifest: optionnel mais recommandé, aligné sur le logo.
- Cohérence: respecter la palette et la typographie définies, et réutiliser les composants shared.
