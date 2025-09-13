import { ChangeDetectionStrategy, Component, HostListener, computed, input, model, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * AttachmentDropzoneComponent
 * - Drag & drop or click to select multiple files
 * - Accepts file types via `accept` (string like "image/*,.pdf" or string[])
 * - Enforces a maximum total size across all files via `maxTotalSize` (in bytes)
 * - Emits `files` model for two-way binding and `error` output for validation errors
 * - Accessible and keyboard friendly
 *
 * Usage:
 *   <app-attachment-dropzone
 *     [accept]="'image/*,.pdf'"
 *     [maxTotalSize]="10 * 1024 * 1024" // 10 MB
 *     [(files)]="attachments"
 *   />
 */
@Component({
  selector: 'app-attachment-dropzone',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.Default,
  host: {
    'class': 'block',
  },
  template: `
    <div
      class="relative border-2 border-dashed rounded-md p-6 text-center transition-colors select-none bg-surface border-token hover:border-[var(--color-primary)] focus-visible:outline-none focus-visible:ring-2 ring-[var(--color-primary)]"
      [class.opacity-60]="disabled()"
      [class.cursor-not-allowed]="disabled()"
      [class.cursor-pointer]="!disabled()"
      [class.bg-neutral-50]="isDragging() && !disabled()"
      tabindex="0"
      role="button"
      aria-label="Attachment dropzone"
      (click)="onHostClick()"
      (keydown.enter)="triggerPick()"
      (keydown.space)="$event.preventDefault(); triggerPick()"
      (dragover)="onDragOver($event)"
      (dragleave)="onDragLeave($event)"
      (drop)="onDrop($event)"
    >
      <input
        type="file"
        class="sr-only"
        [attr.multiple]="multiple() ? '' : null"
        [attr.accept]="acceptAttr() || null"
        (change)="onFileInputChange($event)"
        #fileInput
      />

      <div class="flex flex-col items-center gap-2 pointer-events-none">
        <span class="material-symbols-outlined text-4xl text-neutral-400">upload</span>
        <div class="text-sm text-neutral-600 dark:text-neutral-300">
          {{ label() || 'Glissez-déposez vos fichiers ici ou cliquez pour parcourir' }}
        </div>
        @if (hint()) {
          <div class="text-xs text-neutral-500">
            {{ hint() }}
          </div>
        }
        <div class="text-xs text-neutral-500">
          @if (acceptText()) { <span>Types: {{ acceptText() }}</span> }
          @if (maxTotalSize()) { <span class="ml-2">Limite totale: {{ readableMaxSize() }}</span> }
        </div>
      </div>

      @if (files().length) {
        <div class="mt-4 text-left">
          <div class="text-sm font-medium mb-2">Fichiers sélectionnés ({{ files().length }}) — Total: {{ readableSize(totalSize()) }}</div>
          <ul class="space-y-1 max-h-40 overflow-auto pr-1">
            @for (f of files(); let i = $index; track f.name + ':' + f.size + ':' + f.lastModified) {
              <li class="text-sm bg-neutral-50 dark:bg-neutral-800 px-2 py-1 rounded">
                <div class="flex items-center justify-between">
                  <div class="min-w-0 flex-1 flex items-center gap-2">
                    <span class="material-symbols-outlined text-base text-neutral-400 shrink-0">attach_file</span>
                    <span class="truncate" [title]="f.name">{{ f.name }}</span>
                  </div>
                  <div class="flex items-center gap-2 shrink-0">
                    <span class="text-neutral-500">{{ readableSize(f.size) }}</span>
                    @if (showRemove()) {
                      <button type="button" class="p-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700" (click)="removeFile(i)" aria-label="Supprimer">
                        <span class="material-symbols-outlined text-base text-neutral-500">close</span>
                      </button>
                    }
                  </div>
                </div>
                @if (progressFor(f) !== null) {
                  <div class="mt-1 h-1.5 w-full bg-neutral-200 dark:bg-neutral-700 rounded overflow-hidden">
                    <div class="h-full bg-[var(--color-primary)] transition-[width]" [style.width.%]="progressFor(f) ?? 0"></div>
                  </div>
                }
              </li>
            }
          </ul>
        </div>
      }
    </div>
  `
})
export class AttachmentDropzoneComponent {
  // Inputs
  accept = input<string | string[] | null>(null);
  maxTotalSize = input<number | null>(null); // in bytes
  disabled = input<boolean>(false);
  multiple = input<boolean>(false);
  label = input<string | null>(null);
  hint = input<string | null>(null);

  // Two-way bound files list
  files = model<File[]>([]);

  // Outputs
  added = output<File[]>();
  error = output<string>();

  // New optional inputs/props
  showRemove = input<boolean>(true);
  // Per-file progress map (0..100). Keyed by file signature name|size|lastModified
  progress = input<Record<string, number> | Map<string, number> | null>(null);

  // Internal state
  isDragging = signal(false);

  // Derived
  private normalizedAccept = computed(() => {
    const a = this.accept();
    if (!a) return [] as string[];
    const parts = Array.isArray(a) ? a : a.split(',');
    return parts.map(s => s.trim()).filter(Boolean);
  });

  acceptAttr = computed(() => {
    const arr = this.normalizedAccept();
    return arr.length ? arr.join(',') : '';
  });

  acceptText = computed(() => this.acceptAttr());

  totalSize = computed(() => this.files().reduce((sum, f) => sum + f.size, 0));

  readableMaxSize = computed(() => this.readableSize(this.maxTotalSize() || 0));

  // Event handlers
  onHostClick() {
    if (this.disabled()) return;
    this.triggerPick();
  }

  triggerPick() {
    if (this.disabled()) return;
    // Find the input inside the host and click it
    const inputEl = (document.activeElement as HTMLElement)?.querySelector?.('input[type=file]') as HTMLInputElement | null;
    // Fallback: query inside the component root by id
    const fallback = document.querySelector('#__attachment_hidden_input__') as HTMLInputElement | null;
    (inputEl || fallback)?.click?.();
  }

  @HostListener('document:dragover', ['$event'])
  preventDocDragOver(evt: DragEvent) {
    evt.preventDefault();
  }

  onDragOver(evt: DragEvent) {
    if (this.disabled()) return;
    evt.preventDefault();
    this.isDragging.set(true);
  }

  onDragLeave(_: DragEvent) {
    if (this.disabled()) return;
    this.isDragging.set(false);
  }

  onDrop(evt: DragEvent) {
    if (this.disabled()) return;
    evt.preventDefault();
    this.isDragging.set(false);
    const list = evt.dataTransfer?.files;
    if (!list || list.length === 0) return;
    this.handleIncomingFiles(Array.from(list));
  }

  onFileInputChange(evt: Event) {
    const input = evt.target as HTMLInputElement;
    const list = input.files;
    if (list && list.length) {
      this.handleIncomingFiles(Array.from(list));
    }
    // Reset input value to allow re-selecting the same file(s)
    if (input) input.value = '';
  }

  removeFile(index: number) {
    const current = this.files();
    if (index < 0 || index >= current.length) return;
    const next = current.slice();
    next.splice(index, 1);
    this.files.set(next);
  }

  private handleIncomingFiles(incoming: File[]) {
    // Filter by accept
    const accepted = incoming.filter(f => this.isFileAccepted(f));
    const rejectedCount = incoming.length - accepted.length;

    // Merge with existing if multiple; else replace
    let next = this.multiple() ? [...this.files(), ...accepted] : accepted.slice(0, 1);

    // Deduplicate by name+size+lastModified to avoid duplicates when dropping twice
    next = this.deduplicate(next);

    // Validate total size
    const max = this.maxTotalSize();
    if (max != null && max > 0) {
      const total = next.reduce((s, f) => s + f.size, 0);
      if (total > max) {
        this.error.emit(`La taille totale des fichiers (${this.readableSize(total)}) dépasse la limite autorisée (${this.readableSize(max)}).`);
        return; // Do not update files
      }
    }

    if (rejectedCount > 0) {
      this.error.emit(`${rejectedCount} fichier(s) ignoré(s) car non conforme(s) au format accepté.`);
    }

    this.files.update(() => next);
    this.added.emit(accepted);
  }

  private isFileAccepted(file: File): boolean {
    const patterns = this.normalizedAccept();
    if (!patterns.length) return true; // no restriction
    const mime = file.type?.toLowerCase();
    const name = file.name.toLowerCase();
    return patterns.some(p => this.matchAccept(p, mime, name));
  }

  private matchAccept(pattern: string, mime: string, name: string): boolean {
    const p = pattern.toLowerCase();
    if (p.includes('/')) {
      // mime or mime wildcard like image/*
      if (p.endsWith('/*')) {
        const type = p.split('/')[0];
        return mime?.startsWith(type + '/') || false;
      }
      return mime === p;
    }
    // extension: .pdf, .png, .docx
    if (p.startsWith('.')) {
      return name.endsWith(p);
    }
    // Fallback: substring in name
    return name.includes(p);
  }

  private deduplicate(arr: File[]): File[] {
    const map = new Map<string, File>();
    for (const f of arr) {
      const key = this.fileKey(f);
      if (!map.has(key)) map.set(key, f);
    }
    return Array.from(map.values());
  }

  fileKey(f: File): string {
    return `${f.name}|${f.size}|${f.lastModified}`;
  }

  progressFor(f: File): number | null {
    const p = this.progress();
    if (!p) return null;
    const key = this.fileKey(f);
    if (p instanceof Map) return p.get(key) ?? null;
    return (p as Record<string, number>)[key] ?? null;
  }

  readableSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const val = bytes / Math.pow(k, i);
    return `${val.toFixed(val >= 100 || i === 0 ? 0 : val >= 10 ? 1 : 2)} ${sizes[i]}`;
  }
}
