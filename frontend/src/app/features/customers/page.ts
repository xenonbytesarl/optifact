import { Component } from '@angular/core';
import { PageHeaderComponent } from '../../shared/ui/page-header';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-customers-page',
  standalone: true,
  imports: [PageHeaderComponent, RouterOutlet],
  template: `
    <div class="p-4">
      <app-page-header title="Clients" subtitle="Gestion des clients"></app-page-header>
    </div>
    <router-outlet />
  `
})
export class CustomersPage {}
