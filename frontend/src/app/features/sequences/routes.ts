import {Routes} from '@angular/router';
import {sequenceFindByIdResolver, sequenceSearchResolver} from './sequence.resolver';

export const sequencesRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./page').then(m => m.SequencesPage),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'list' },
      {
        path: 'list',
        loadComponent: () => import('./screens/sequences-list').then(m => m.SequencesListPage),
        resolve: { sequencesSearch: sequenceSearchResolver }
      },
      { path: 'new', loadComponent: () => import('./screens/sequence-new').then(m => m.SequenceNewPage) },
      {
        path: ':id',
        loadComponent: () => import('./screens/sequence-view').then(m => m.SequenceViewPage),
        resolve: { sequenceFindById: sequenceFindByIdResolver }
      },
      {
        path: ':id/edit',
        loadComponent: () => import('./screens/sequence-edit').then(m => m.SequenceEditPage),
        resolve: { sequenceFindById: sequenceFindByIdResolver }
      }
    ]
  }
];
