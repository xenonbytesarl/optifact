import { Injectable, effect, inject, signal } from '@angular/core';

export type Lang = 'en' | 'fr';

type Dict = Record<string, any>;

@Injectable({ providedIn: 'root' })
export class TranslateService {
  private storageKey = 'app.lang';
  lang = signal<Lang>(this.detectInitialLang());
  private dict = signal<Dict>({});

  constructor() {
    // keep <html lang> in sync
    effect(() => {
      const l = this.lang();
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('lang', l);
      }
      // persist
      try { localStorage.setItem(this.storageKey, l); } catch {}
      // load dictionary on change
      this.load(l);
    });
  }

  private detectInitialLang(): Lang {
    try {
      const saved = localStorage.getItem(this.storageKey) as Lang | null;
      if (saved === 'en' || saved === 'fr') return saved;
    } catch {}
    const nav = (typeof navigator !== 'undefined' && navigator.language) ? navigator.language : 'fr';
    return nav.toLowerCase().startsWith('fr') ? 'fr' : 'en';
  }

  async load(lang: Lang) {
    // In SSR (no window), skip fetching assets; the dictionary will be loaded on the acteur after hydration
    if (typeof window === 'undefined') {
      this.dict.set({});
      return;
    }
    try {
      const res = await fetch(`/assets/i18n/${lang}.json`, { cache: 'no-store' });
      if (!res.ok) throw new Error(`Failed to load ${lang}`);
      const json = (await res.json()) as Dict;
      this.dict.set(json);
    } catch (e) {
      // fallback to empty
      this.dict.set({});
      // eslint-disable-next-line no-console
      console.warn('[i18n] load failed', e);
    }
  }

  setLang(lang: Lang) { this.lang.set(lang); }
  toggle() { this.setLang(this.lang() === 'fr' ? 'en' : 'fr'); }

  t(key: string, params?: Record<string, string | number>): string {
    const value = this.lookup(key, this.dict());
    let str = typeof value === 'string' ? value : key;
    if (params) {
      for (const k of Object.keys(params)) {
        str = str.replace(new RegExp(`{{\\s*${k}\\s*}}`, 'g'), String(params[k]));
      }
    }
    return str;
  }

  private lookup(path: string, d: Dict): any {
    return path.split('.').reduce<any>((acc, part) => (acc && acc[part] != null ? acc[part] : undefined), d);
  }
}
