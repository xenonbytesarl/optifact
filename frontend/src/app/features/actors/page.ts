import { Component } from '@angular/core';
import { PageHeaderComponent } from '../../shared/ui/page-header';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-actors-page',
  standalone: true,
  imports: [PageHeaderComponent, RouterOutlet],
  template: `
    <div class="p-4">
      <app-page-header title="Acteurs" subtitle="Gestion des acteurs"></app-page-header>
    </div>
    <router-outlet />
  `
})
export class ActorsPage {}
