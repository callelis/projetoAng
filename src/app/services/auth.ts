import {HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private apiUrl = "http://localhost:3001";

  constructor(private http: HttpClient) {}
  login(usuario:Pick<Usuario, 'nome'|'senha'>): Observable<Usuario>{
    return this.http.post<Usuario>(`${this.apiUrl}/login`,usuario);
  }
}
