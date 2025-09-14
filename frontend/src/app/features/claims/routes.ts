import {Routes} from '@angular/router';
import { claimSearchResolver, claimFindByIdResolver } from './claims.resolver';
import {productSearchResolver} from '../products/product.resolver';
import {actorSearchResolver} from '../actors/actor.resolver';

export const claimsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./screens/claims-list').then(m => m.ClaimsListScreen),
    resolve: {
      claimsSearch: claimSearchResolver,
      actorSearch: actorSearchResolver,
      productSearch: productSearchResolver
    },
    data: { title: 'Demandes' }
  },
  {
    path: 'new', loadComponent: () => import('./screens/claim-new').then(m => m.ClaimNewPage),
    resolve: {
      productSearch: productSearchResolver,
      actorSearch: actorSearchResolver
    }
  },
  {
    path: ':id', loadComponent: () => import('./screens/claim-view').then(m => m.ClaimViewPage),
    resolve: { claimFindById: claimFindByIdResolver, productSearch: productSearchResolver, actorSearch: actorSearchResolver }
  },
  {
    path: ':id/edit', loadComponent: () => import('./screens/claim-edit').then(m => m.ClaimEditPage),
    resolve: {
      claimFindById: claimFindByIdResolver,
      productSearch: productSearchResolver,
      actorSearch: actorSearchResolver
    }
  },
];
