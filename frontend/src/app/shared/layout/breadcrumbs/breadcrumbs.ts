import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-breadcrumbs',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './breadcrumbs.html',
  changeDetection: ChangeDetectionStrategy.Default
})
export class BreadcrumbsComponent {
  private route = inject(ActivatedRoute);

  // Simple placeholder: use route snapshot to build crumbs by path segments
  segments = computed(() => {
    const arr: Array<{ label: string; url: string }> = [];
    let path = '';
    let current: ActivatedRoute | null = this.route.root;
    while (current) {
      const snapshot = current.snapshot;
      const urlPart = snapshot.url.map(s => s.path).join('/');
      if (urlPart) {
        path += `/${urlPart}`;
        const label = snapshot.data?.['title'] || urlPart;
        arr.push({ label, url: path });
      }
      current = current.firstChild as any;
    }
    return arr;
  });
}
