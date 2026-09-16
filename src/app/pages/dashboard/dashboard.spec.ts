import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { Dashboard } from './dashboard';

describe('Dashboard', () => {
  let component: Dashboard;
  let fixture: ComponentFixture<Dashboard>;
  let httpTesting: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dashboard],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Dashboard);
    component = fixture.componentInstance;
    httpTesting = TestBed.inject(HttpTestingController);
    fixture.detectChanges();

    httpTesting.expectOne('http://localhost:3001/vehicles').flush([
        {
          id: 1,
          vehicle: 'Ranger',
          volumetotal: 1800,
          connected: 620,
          softwareUpdates: 410,
          vin: '1FTER4FH2PLE10234'
        },
        {
          id: 2,
          vehicle: 'Mustang',
          volumetotal: 1500,
          connected: 500,
          softwareUpdates: 750,
          vin: '2FRHDUYS2Y63NHD22455'
        }
      ]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show only the selected vehicle data', () => {
    expect(fixture.nativeElement.querySelector('.car-image-container')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('.table-container')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('.vin-input').value).toBe('');
    expect(fixture.nativeElement.textContent).toContain('Selecione um veículo');

    component.selectedVehicleId = '1';
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.car-image-container img').src).toContain('ranger.png');
    expect(fixture.nativeElement.querySelector('.vin-input').value).toBe('');
    expect(fixture.nativeElement.textContent).toContain('1800');

    component.vinCode = '1FTER4FH2PLE10234';
    component.onVinChange();
    const vehicleDataRequest = httpTesting.expectOne('http://localhost:3001/vehicleData');
    expect(vehicleDataRequest.request.method).toBe('POST');
    expect(vehicleDataRequest.request.body).toEqual({ vin: '1FTER4FH2PLE10234' });
    vehicleDataRequest.flush({
      vin: '1FTER4FH2PLE10234',
      odometer: '42.300 Km',
      fuel: '78 %',
      status: 'on',
      latitude: '-12,2322',
      longitude: '-38,2314'
    });
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.car-image-container img').src).toContain('ranger.png');
    expect(fixture.nativeElement.querySelector('.vin-input').value).toBe('1FTER4FH2PLE10234');
    expect(fixture.nativeElement.textContent).toContain('1800');
    expect(fixture.nativeElement.textContent).not.toContain('1500');
    expect(fixture.nativeElement.textContent).toContain('42.300 Km');
    expect(fixture.nativeElement.textContent).toContain('78 %');
    expect(fixture.nativeElement.textContent).toContain('-12,2322');
    expect(component.selectedVehicleId).toBe('1');

    component.vinCode = '2FRHDUYS2Y63NHD22455';
    component.onVinChange();
    fixture.detectChanges();

    expect(component.selectedVehicleId).toBe('2');
    expect(fixture.nativeElement.querySelector('#veiculo-select').value).toBe('2');
  });
});
