import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  private _isDarkMode = signal(false);
  isDarkMode = computed(() => this._isDarkMode());

  constructor() {
    // Initialize theme (SSR-safe)
    let prefersDark = false;
    let saved: string | null = null;
    if (this.isBrowser) {
      try {
        saved = window.localStorage?.getItem('theme') ?? null;
        prefersDark = typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      } catch {
        saved = null;
      }
    }
    this._isDarkMode.set(saved ? saved === 'dark' : prefersDark);

    if (this.isBrowser) {
      this.applyTheme();
    }
  }

  toggleTheme() {
    this._isDarkMode.update(v => !v);
    if (this.isBrowser) this.applyTheme();
  }

  setDark(dark: boolean) {
    this._isDarkMode.set(dark);
    if (this.isBrowser) this.applyTheme();
  }

  private applyTheme() {
    if (!this.isBrowser) return;
    const root = document.documentElement;
    if (this._isDarkMode()) root.classList.add('dark'); else root.classList.remove('dark');
    try {
      window.localStorage?.setItem('theme', this._isDarkMode() ? 'dark' : 'light');
    } catch {}
  }
}
