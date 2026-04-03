import { Component, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { VehicleStore } from '../stores/vehicle.store';

@Component({
  selector: 'cars-middle-table',
  standalone: true,
  imports: [MatTableModule],
  template: `
    <table mat-table [dataSource]="store.pagedVehicles()" class="mat-elevation-z8">
      <ng-container matColumnDef="vin">
        <th mat-header-cell *matHeaderCellDef> VIN </th>
        <td mat-cell *matCellDef="let v"> {{v.vin}} </td>
      </ng-container>
      <ng-container matColumnDef="marka">
        <th mat-header-cell *matHeaderCellDef> Marka </th>
        <td mat-cell *matCellDef="let v"> {{v.marka}} </td>
      </ng-container>
      <ng-container matColumnDef="model">
        <th mat-header-cell *matHeaderCellDef> Model </th>
        <td mat-cell *matCellDef="let v"> {{v.model}} </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
    </table>
  `,
  styles: [`table { width: 100%; margin: 20px 0; }`]
})
export class MiddleTableComponent {
  readonly store = inject(VehicleStore);
  readonly displayedColumns: string[] = ['vin', 'marka', 'model'];
}
