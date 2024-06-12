// src/app/services/cliente.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private myAppUrl = 'https://localhost:7111/';
  private myApiUrl = 'api/Cliente/';

  constructor(private http: HttpClient) { }

  getListCliente(): Observable<any> {
    console.log("Ruta->", this.myAppUrl + this.myApiUrl);
    return this.http.get(this.myAppUrl + this.myApiUrl);
  }

  deleteCliente(id: number): Observable<any> {
    return this.http.delete(this.myAppUrl + this.myApiUrl + id);
  }

  saveCliente(cliente: any): Observable<any> {
    // Enviar el objeto cliente completo
    console.log("RutaService->", this.myAppUrl + this.myApiUrl, cliente);
    return this.http.post(this.myAppUrl + this.myApiUrl, cliente);
  }

  updateCliente(id: number, cliente: any): Observable<any> {
    return this.http.put(this.myAppUrl + this.myApiUrl + id, cliente);
  }
}
