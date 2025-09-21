import { Routes } from '@angular/router';
import {settingFindByIdResolver, settingFindFirstResolver} from './setting.resolver';

export const settingsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./page').then(m => m.SettingsPage),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'view' },
      {
        path: 'view',
        loadComponent: () => import('./screens/setting-view').then(m => m.SettingViewPage),
        resolve: { settingFindById: settingFindFirstResolver }
      },
      {
        path: 'edit',
        loadComponent: () => import('./screens/setting-edit').then(m => m.SettingEditPage),
        resolve: { settingFindById: settingFindFirstResolver }
      }
    ]
  }
];
