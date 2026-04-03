import { TestBed } from '@angular/core/testing';
import { VehicleStore, Vehicle } from './vehicle.store';
import { patchState } from '@ngrx/signals';

describe('VehicleStore', () => {
  let store: InstanceType<typeof VehicleStore>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    store = TestBed.inject(VehicleStore);

    // Resetuj do niezależnego stanu początkowego dla każdego testu
    patchState(store, {
      vehicles: [
        { vin: 'toyota123', marka: 'toyota', model: 'corrola' },
        { vin: 'suzuki123', marka: 'suzuki', model: 'vitara' },
        { vin: 'honda123', marka: 'honda', model: 'civic' },
        { vin: 'skoda123', marka: 'skoda', model: 'kodiak' }
      ],
      currentPage: 0,
      pageSize: 3
    });
  });

  // -----------------------------------------------------------------------
  // Stan początkowy
  // -----------------------------------------------------------------------
  describe('Stan początkowy', () => {
    it('powinien zawierać 4 pojazdy', () => {
      expect(store.vehicles().length).toBe(4);
    });

    it('powinien mieć currentPage = 0', () => {
      expect(store.currentPage()).toBe(0);
    });

    it('powinien mieć pageSize = 3', () => {
      expect(store.pageSize()).toBe(3);
    });

    it('powinien zawierać pojazdy: toyota, suzuki, honda, skoda', () => {
      const vins = store.vehicles().map(v => v.vin);
      expect(vins).toEqual(['toyota123', 'suzuki123', 'honda123', 'skoda123']);
    });
  });

  // -----------------------------------------------------------------------
  // Computed: pagedVehicles
  // -----------------------------------------------------------------------
  describe('pagedVehicles', () => {
    it('powinien zwrócić pierwsze 3 pojazdy dla strony 0', () => {
      const paged = store.pagedVehicles();
      expect(paged.length).toBe(3);
      expect(paged[0].vin).toBe('toyota123');
      expect(paged[1].vin).toBe('suzuki123');
      expect(paged[2].vin).toBe('honda123');
    });

    it('powinien zwrócić 1 pojazd dla strony 1 (ostatnia strona)', () => {
      store.nextPage();
      const paged = store.pagedVehicles();
      expect(paged.length).toBe(1);
      expect(paged[0].vin).toBe('skoda123');
    });
  });

  // -----------------------------------------------------------------------
  // Computed: totalPages
  // -----------------------------------------------------------------------
  describe('totalPages', () => {
    it('powinien zwrócić 2 dla 4 pojazdów z pageSize=3', () => {
      expect(store.totalPages()).toBe(2);
    });

    it('powinien zaktualizować totalPages po dodaniu pojazdu', () => {
      const newVehicle: Vehicle = { vin: 'bmw123', marka: 'bmw', model: 'x5' };
      store.addVehicle(newVehicle);
      // 5 pojazdów / pageSize 3 = ceil(5/3) = 2
      expect(store.totalPages()).toBe(2);
    });

    it('powinien zwrócić 3 po dodaniu 2 nowych pojazdów (łącznie 6)', () => {
      store.addVehicle({ vin: 'bmw123', marka: 'bmw', model: 'x5' });
      store.addVehicle({ vin: 'audi123', marka: 'audi', model: 'a4' });
      // 6 pojazdów / pageSize 3 = ceil(6/3) = 2
      expect(store.totalPages()).toBe(2);
    });
  });

  // -----------------------------------------------------------------------
  // Computed: canNext
  // -----------------------------------------------------------------------
  describe('canNext', () => {
    it('powinien być true na stronie 0 (są jeszcze pojazdy)', () => {
      expect(store.canNext()).toBeTrue();
    });

    it('powinien być false na ostatniej stronie', () => {
      store.nextPage(); // przejście na stronę 1 (ostatnią)
      expect(store.canNext()).toBeFalse();
    });
  });

  // -----------------------------------------------------------------------
  // Computed: canPrev
  // -----------------------------------------------------------------------
  describe('canPrev', () => {
    it('powinien być false na stronie 0', () => {
      expect(store.canPrev()).toBeFalse();
    });

    it('powinien być true po przejściu na stronę 1', () => {
      store.nextPage();
      expect(store.canPrev()).toBeTrue();
    });
  });

  // -----------------------------------------------------------------------
  // Metoda: addVehicle()
  // -----------------------------------------------------------------------
  describe('addVehicle()', () => {
    it('powinien dodać pojazd na początku listy', () => {
      const newVehicle: Vehicle = { vin: 'bmw123', marka: 'bmw', model: 'x5' };
      store.addVehicle(newVehicle);
      expect(store.vehicles()[0].vin).toBe('bmw123');
    });

    it('powinien zwiększyć liczbę pojazdów o 1', () => {
      const before = store.vehicles().length;
      store.addVehicle({ vin: 'bmw123', marka: 'bmw', model: 'x5' });
      expect(store.vehicles().length).toBe(before + 1);
    });

    it('powinien zresetować currentPage do 0 po dodaniu pojazdu', () => {
      store.nextPage(); // przejście na stronę 1
      expect(store.currentPage()).toBe(1);

      store.addVehicle({ vin: 'bmw123', marka: 'bmw', model: 'x5' });
      expect(store.currentPage()).toBe(0);
    });

    it('nie powinien modyfikować pozostałych pojazdów', () => {
      const newVehicle: Vehicle = { vin: 'bmw123', marka: 'bmw', model: 'x5' };
      store.addVehicle(newVehicle);
      const vehicles = store.vehicles();
      expect(vehicles[1].vin).toBe('toyota123');
      expect(vehicles[2].vin).toBe('suzuki123');
      expect(vehicles[3].vin).toBe('honda123');
      expect(vehicles[4].vin).toBe('skoda123');
    });
  });

  // -----------------------------------------------------------------------
  // Metoda: nextPage()
  // -----------------------------------------------------------------------
  describe('nextPage()', () => {
    it('powinien przejść na stronę 1 gdy canNext = true', () => {
      store.nextPage();
      expect(store.currentPage()).toBe(1);
    });

    it('nie powinien zmieniać strony gdy jesteśmy na ostatniej stronie', () => {
      store.nextPage(); // strona 1 (ostatnia)
      store.nextPage(); // próba przejścia dalej - powinna być zignorowana
      expect(store.currentPage()).toBe(1);
    });
  });

  // -----------------------------------------------------------------------
  // Metoda: prevPage()
  // -----------------------------------------------------------------------
  describe('prevPage()', () => {
    it('nie powinien zmieniać strony gdy jesteśmy na stronie 0', () => {
      store.prevPage();
      expect(store.currentPage()).toBe(0);
    });

    it('powinien cofnąć się na stronę 0 ze strony 1', () => {
      store.nextPage(); // strona 1
      store.prevPage(); // powrót na stronę 0
      expect(store.currentPage()).toBe(0);
    });
  });

  // -----------------------------------------------------------------------
  // Scenariusze integracyjne
  // -----------------------------------------------------------------------
  describe('Scenariusze integracyjne', () => {
    it('nawigacja: następna strona -> poprzednia strona -> powrót do stanu wyjściowego', () => {
      expect(store.currentPage()).toBe(0);
      expect(store.canPrev()).toBeFalse();
      expect(store.canNext()).toBeTrue();

      store.nextPage();
      expect(store.currentPage()).toBe(1);
      expect(store.canPrev()).toBeTrue();
      expect(store.canNext()).toBeFalse();

      store.prevPage();
      expect(store.currentPage()).toBe(0);
      expect(store.canPrev()).toBeFalse();
      expect(store.canNext()).toBeTrue();
    });

    it('dodanie pojazdu aktualizuje pagedVehicles i totalPages', () => {
      const newVehicle: Vehicle = { vin: 'bmw123', marka: 'bmw', model: 'x5' };
      store.addVehicle(newVehicle);

      // Nowy pojazd powinien być widoczny na stronie 0
      expect(store.pagedVehicles()[0].vin).toBe('bmw123');
      // 5 pojazdów / 3 = ceil(5/3) = 2 strony
      expect(store.totalPages()).toBe(2);
    });
  });
});
