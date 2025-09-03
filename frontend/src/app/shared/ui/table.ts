import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="overflow-x-auto">
      <table class="w-full text-sm border-collapse">
        <ng-content select="thead" />
        <ng-content select="tbody" />
        <ng-content select="tfoot" />
      </table>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Default,
  host: {
    class: 'block'
  }
})
export class TableComponent {}
