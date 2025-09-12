import {Routes} from '@angular/router';
import {attachmentTypeFindByIdResolver, attachmentTypeSearchResolver} from './attachment-type.resolver';

export const attachmentTypesRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./page').then(m => m.AttachmentTypesPage),
    children: [
      {path: '', pathMatch: 'full', redirectTo: 'list'},
      {
        path: 'list',
        loadComponent: () => import('./screens/attachment-types-list').then(m => m.AttachmentTypesListPage),
        resolve: {
          attachmentTypesSearch: attachmentTypeSearchResolver
        }
      },
      {path: 'new', loadComponent: () => import('./screens/attachment-type-new').then(m => m.AttachmentTypeNewPage)},
      {
        path: ':id',
        loadComponent: () => import('./screens/attachment-type-view').then(m => m.AttachmentTypeViewPage),
        resolve: {
          attachmentTypeFindById: attachmentTypeFindByIdResolver
        }
      },
      {
        path: ':id/edit',
        loadComponent: () => import('./screens/attachment-type-edit').then(m => m.AttachmentTypeEditPage),
        resolve: {
          attachmentTypeFindById: attachmentTypeFindByIdResolver
        }
      },
    ]
  }
];
