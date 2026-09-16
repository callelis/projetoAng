import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { Usuario } from '../models/usuario.model';
import { DadosVeiculo, DadosVeiculoAPI, Veiculo, Veiculos, VeiculosAPI } from '../models/veiculo.model';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly apiUrl = 'http://localhost:3001';
  private readonly sessionKey = 'usuarioLogado';
  private readonly rememberKey = 'usuarioLogadoAutomaticamente';
  private readonly tokenKey = 'tokenTemporario';
  private readonly tokenExpirationKey = 'tokenTemporarioExpiraEm';
  private readonly tokenLifetimeMs = 30 * 60 * 1000;

  constructor(private readonly http: HttpClient) {}

  login(usuario: Pick<Usuario, 'nome' | 'senha'>, lembrarLogin = false): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/login`, usuario).pipe(
      tap(usuarioLogado => {
        const dadosUsuario = JSON.stringify(usuarioLogado);
        const token = crypto.randomUUID();
        const tokenExpiraEm = Date.now() + this.tokenLifetimeMs;

        sessionStorage.removeItem(this.sessionKey);
        localStorage.removeItem(this.rememberKey);
        sessionStorage.removeItem(this.tokenKey);
        sessionStorage.removeItem(this.tokenExpirationKey);
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.tokenExpirationKey);

        if (lembrarLogin) {
          localStorage.setItem(this.rememberKey, dadosUsuario);
          localStorage.setItem(this.tokenKey, token);
          localStorage.setItem(this.tokenExpirationKey, String(tokenExpiraEm));
        } else {
          sessionStorage.setItem(this.sessionKey, dadosUsuario);
          sessionStorage.setItem(this.tokenKey, token);
          sessionStorage.setItem(this.tokenExpirationKey, String(tokenExpiraEm));
        }
      })
    );
  }

  getVehicles(): Observable<Veiculo[]> {
    return this.http.get<VeiculosAPI | Veiculos>(`${this.apiUrl}/vehicles`).pipe(
      map(response => Array.isArray(response) ? response : response.vehicles)
    );
  }

  getVehicleData(vin: string): Observable<DadosVeiculo> {
    return this.http.post<DadosVeiculo | DadosVeiculo[] | DadosVeiculoAPI>(`${this.apiUrl}/vehicleData`, { vin }).pipe(
      map(response => {
        let data: DadosVeiculo;

        if (Array.isArray(response)) {
          data = response[0] ?? {};
        } else if ('vehicleData' in response) {
          data = Array.isArray(response.vehicleData) ? response.vehicleData[0] ?? {} : response.vehicleData ?? {};
        } else if ('data' in response) {
          data = Array.isArray(response.data) ? response.data[0] ?? {} : response.data ?? {};
        } else {
          data = response;
        }

        return {
          ...data,
          odometer: data.odometer ?? data.odometro,
          fuel: data.fuel ?? data.combustivel ?? data.nivelCombustivel,
          latitude: data.latitude ?? data.lat,
          longitude: data.longitude ?? data.long
        };
      })
    );
  }

  isAuthenticated(): boolean {
    const storage = sessionStorage.getItem(this.tokenKey) !== null ? sessionStorage : localStorage;
    const token = storage.getItem(this.tokenKey);
    const expiration = storage.getItem(this.tokenExpirationKey);
    const expirationTime = Number(expiration);

    if (!token || !expiration || !Number.isFinite(expirationTime) || Date.now() >= expirationTime) {
      this.logout();
      return false;
    }

    return storage.getItem(this.sessionKey) !== null ||
      storage.getItem(this.rememberKey) !== null;
  }

  logout(): void {
    sessionStorage.removeItem(this.sessionKey);
    localStorage.removeItem(this.rememberKey);
    sessionStorage.removeItem(this.tokenKey);
    sessionStorage.removeItem(this.tokenExpirationKey);
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.tokenExpirationKey);
  }
}
