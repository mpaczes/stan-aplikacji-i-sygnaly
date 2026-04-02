import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'cars-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'signal-store-cars-app';
}
