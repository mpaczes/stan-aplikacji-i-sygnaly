import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { VehicleStore } from '../stores/vehicle.store';

@Component({
  selector: 'cars-top-form',
  standalone: true,
  imports: [ReactiveFormsModule, MatInputModule, MatButtonModule],
  template: `
    <form [formGroup]="vehicleForm" (ngSubmit)="onSubmit()" class="form-container">
      <mat-form-field>
        <mat-label>VIN</mat-label>
        <input matInput formControlName="vin">
      </mat-form-field>
      <mat-form-field>
        <mat-label>Marka</mat-label>
        <input matInput formControlName="marka">
      </mat-form-field>
      <mat-form-field>
        <mat-label>Model</mat-label>
        <input matInput formControlName="model">
      </mat-form-field>
      <button mat-raised-button color="primary" [disabled]="vehicleForm.invalid">Dodaj Pojazd</button>
    </form>
  `,
  styles: [`.form-container { display: flex; gap: 10px; padding: 20px; border-bottom: 1px solid #ccc; }`]
})
export class TopFormComponent {
  private fb = inject(FormBuilder);
  readonly store = inject(VehicleStore);

  vehicleForm = this.fb.group({
    vin: ['', Validators.required],
    marka: ['', Validators.required],
    model: ['', Validators.required]
  });

  onSubmit() {
    if (this.vehicleForm.valid) {
      this.store.addVehicle(this.vehicleForm.getRawValue() as any);
      this.vehicleForm.reset();
    }
  }
}