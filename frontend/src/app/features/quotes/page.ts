import { Component } from '@angular/core';
import { PageHeaderComponent } from '../../shared/ui/page-header';
import { ButtonComponent } from '../../shared/ui/button';
import { IconComponent } from '../../shared/ui/icon';

@Component({
  selector: 'app-quotes-page',
  standalone: true,
  imports: [PageHeaderComponent, ButtonComponent, IconComponent],
  template: `
    <div class="p-4">
      <app-page-header [title]="'Devis'" [subtitle]="'Propositions commerciales'">
        <div actions>
          <app-button>
            <app-icon name="add"></app-icon>
            Nouveau devis
          </app-button>
        </div>
      </app-page-header>
    </div>
  `
})
export class QuotesPage {}
