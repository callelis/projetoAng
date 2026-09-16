export interface Veiculos extends Array<Veiculo> {}

export interface DadosVeiculo {
  id?: number | string
  vin?: string
  odometer?: number | string
  odometro?: number | string
  fuel?: number | string
  combustivel?: number | string
  nivelCombustivel?: number | string
  status?: string
  latitude?: number | string
  longitude?: number | string
  lat?: number | string
  long?: number | string
}

export interface DadosVeiculoAPI {
  vehicleData?: DadosVeiculo | DadosVeiculo[]
  data?: DadosVeiculo | DadosVeiculo[]
  vin?: string
  odometer?: string
  fuel?: string
  status?: string
  latitude?: string
  longitude?: string
}

export interface Veiculo{
  id: number | string
  vehicle: string
  image?: string
  volumetotal: number | string
  connected: number | string
  softwareUpdates: number | string
  vin?: string
  odometer?: string
  fuel?: string
  status?: string
  latitude?: string
  longitude?: string
}

export interface VeiculosAPI {
  vehicles: Veiculos;
}
