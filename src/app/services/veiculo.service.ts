import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Vehicle {
  id: number;
  vehicle: string;
  volumetotal: number;
  connected: number;
  softwareUpdates: number;
  img: string;
}

export interface VehiclesResponse {
  vehicles: Vehicle[];
}

export interface VehicleTelemetry {
  id: number;
  odometro: number;
  nivelCombustivel: number;
  status: 'on' | 'off';
  lat: number;
  long: number;
}

@Injectable({
  providedIn: 'root'
})
export class VeiculoService {
  private readonly baseUrl = 'http://localhost:3001';

  constructor(private http: HttpClient) {}

  getVehicles(): Observable<VehiclesResponse> {
    return this.http.get<VehiclesResponse>(`${this.baseUrl}/vehicles`);
  }

  getVehicleData(vin: string): Observable<VehicleTelemetry> {
    return this.http.post<VehicleTelemetry>(`${this.baseUrl}/vehicleData`, { vin });
  }
}