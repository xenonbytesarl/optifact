import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { TopbarComponent } from './shared/layout/topbar/topbar';
import { SidebarComponent } from './shared/layout/sidebar/sidebar';
import { ThemeService } from './core/settings/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, TopbarComponent, SidebarComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  // UI state using signals
  isSidebarOpen = signal(false);

  // Theme is delegated to a specialized service (SSR-safe)
  theme = inject(ThemeService);

  toggleSidebar() {
    this.isSidebarOpen.update(v => !v);
  }

  openSidebar() { this.isSidebarOpen.set(true); }
  closeSidebar() { this.isSidebarOpen.set(false); }
}
