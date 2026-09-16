import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Menu } from '../../componentes/menu/menu';
import { DadosVeiculo, Veiculo } from '../../models/veiculo.model';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-dashboard',
  imports: [FormsModule, Menu],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  selectedVehicleId = '';
  vinCode = '';
  vehicles: Veiculo[] = [];
  vehicleData?: DadosVeiculo;
  private vinRequestId = 0;
  isLoading = true;
  errorMessage = '';

  constructor(private readonly auth: Auth) {}

  ngOnInit(): void {
    this.auth.getVehicles().subscribe({
      next: vehicles => {
        this.vehicles = vehicles;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Não foi possível carregar os veículos.';
      }
    });
  }

  get selectedVehicle(): Veiculo | undefined {
    return this.vehicles.find(vehicle => String(vehicle.id) === this.selectedVehicleId);
  }

  get displayedVehicle(): Veiculo | undefined {
    return this.vinCode.trim() ? this.vehicleByVin : this.selectedVehicle;
  }

  private get vehicleByVin(): Veiculo | undefined {
    const typedVin = this.normalizeVin(this.vinCode);

    if (!typedVin) {
      return undefined;
    }

    const vehicleById = this.vehicleData?.id === undefined
      ? undefined
      : this.vehicles.find(vehicle => String(vehicle.id) === String(this.vehicleData?.id));

    return vehicleById ?? this.vehicles.find(vehicle => this.normalizeVin(vehicle.vin) === typedVin);
  }

  vehicleImage(vehicle: Veiculo): string {
    if (vehicle.image) {
      return vehicle.image;
    }

    const normalizedName = vehicle.vehicle.toLowerCase();

    if (normalizedName.includes('ranger')) return '/img/ranger.png';
    if (normalizedName.includes('mustang')) return '/img/mustang.png';
    if (normalizedName.includes('territory')) return '/img/territory.png';
    if (normalizedName.includes('bronco')) return '/img/broncoSport.png';

    return '/img/ford.png';
  }

  onVehicleChange(): void {
    this.vinCode = '';
    this.vehicleData = undefined;
    this.vinRequestId++;
  }

  onVinChange(vin: string = this.vinCode): void {
    this.vinCode = vin;
    const typedVin = this.normalizeVin(vin);
    const requestId = ++this.vinRequestId;
    const vehicle = this.vehicles.find(item => this.normalizeVin(item.vin) === typedVin);

    this.selectedVehicleId = vehicle ? String(vehicle.id) : '';
    this.vehicleData = undefined;

    if (!typedVin) {
      return;
    }

    this.auth.getVehicleData(typedVin).subscribe({
      next: vehicleData => {
        if (requestId === this.vinRequestId &&
          (!vehicleData.vin || this.normalizeVin(vehicleData.vin) === typedVin)) {
          this.vehicleData = vehicleData;
          if (vehicleData.id !== undefined) {
            this.selectedVehicleId = String(vehicleData.id);
          }
        }
      },
      error: () => {
        if (requestId === this.vinRequestId) {
          this.vehicleData = undefined;
        }
      }
    });
  }

  private normalizeVin(vin?: string): string {
    return vin?.trim().toUpperCase() ?? '';
  }

}
