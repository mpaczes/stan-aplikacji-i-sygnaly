import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TopFormComponent } from './components/top-form.component';
import { MiddleTableComponent } from './components/middle-table.component';
import { BottomNavComponent } from './components/bottom-nav.component';

@Component({
  selector: 'cars-root',
  standalone: true,
  imports: [CommonModule, TopFormComponent, MiddleTableComponent, BottomNavComponent],
  template: `
    <div style="max-width: 800px; margin: 0 auto;">
      <cars-top-form />
      <cars-middle-table />
      <cars-bottom-nav />
    </div>
  `
})
export class AppComponent {}
