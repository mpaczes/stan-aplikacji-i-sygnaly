import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { VehicleStore } from '../stores/vehicle.store';

@Component({
  selector: 'cars-bottom-nav',
  standalone: true,
  imports: [MatButtonModule],
  template: `
    <div class="nav-container">
      <button mat-stroked-button (click)="store.prevPage()" [disabled]="!store.canPrev()">
        Przewiń w lewo
      </button>
      <span>Strona {{ store.currentPage() + 1 }} z {{ store.totalPages() || 1 }}</span>
      <button mat-stroked-button (click)="store.nextPage()" [disabled]="!store.canNext()">
        Przewiń w prawo
      </button>
    </div>
  `,
  styles: [`.nav-container { display: flex; justify-content: center; align-items: center; gap: 20px; padding: 20px; }`]
})
export class BottomNavComponent {
  readonly store = inject(VehicleStore);
}