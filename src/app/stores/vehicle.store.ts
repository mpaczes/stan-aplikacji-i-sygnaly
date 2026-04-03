import { signalStore, withState, withComputed, withMethods, patchState } from '@ngrx/signals';
import { computed } from '@angular/core';

export interface Vehicle {
  vin: string;
  marka: string;
  model: string;
}

interface VehicleState {
  vehicles: Vehicle[];
  currentPage: number;
  pageSize: number;
}

const initialState: VehicleState = {
  vehicles: [
    { vin: 'toyota123', marka: 'toyota', model: 'corrola' },
    { vin: 'suzuki123', marka: 'suzuki', model: 'vitara' },
    { vin: 'honda123', marka: 'honda', model: 'civic' },
    { vin: 'skoda123', marka: 'skoda', model: 'kodiak' }
  ],
  currentPage: 0,
  pageSize: 3,
};

export const VehicleStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    // Obliczanie rekordów dla bieżącej strony - używamy nawiasów () dla sygnałów
    pagedVehicles: computed(() => {
      const start = store.currentPage() * store.pageSize();
      return store.vehicles().slice(start, start + store.pageSize());
    }),
    totalPages: computed(() => Math.ceil(store.vehicles().length / store.pageSize())),
    canNext: computed(() => (store.currentPage() + 1) * store.pageSize() < store.vehicles().length),
    canPrev: computed(() => store.currentPage() > 0)
  })),
  withMethods((store) => ({
    addVehicle(vehicle: Vehicle) {
      patchState(store, {
        // Nowy pojazd na początku listy
        vehicles: [vehicle, ...store.vehicles()],
        // Powrót do pierwszej strony, aby zobaczyć dodany rekord
        currentPage: 0
      });
    },
    nextPage() {
      // Pobieramy wartość sygnału przez store.currentPage()
      if ((store.currentPage() + 1) * store.pageSize() < store.vehicles().length) {
        patchState(store, { currentPage: store.currentPage() + 1 });
      }
    },
    prevPage() {
      // Pobieramy wartość sygnału przez store.currentPage()
      if (store.currentPage() > 0) {
        patchState(store, { currentPage: store.currentPage() - 1 });
      }
    }
  }))
);
