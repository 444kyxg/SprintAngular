import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { VeiculoService, Vehicle, VehiclesResponse, VehicleTelemetry } from '../../services/veiculo.service';
import { AuthService } from '../../services/auth';
import { MenuComponent } from '../../components/menu/menu';

interface TelemetriaItem {
  vin: string;
  odometro: number;
  nivelCombustivel: number;
  status: string;
  lat: number;
  long: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MenuComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
  vehicles: Vehicle[] = [];
  selectedVehicleId: number = 1;
  selectedVehicle?: Vehicle;

  vinsCadastrados: string[] = [
    '2FRHDUYS2Y63NHD22454',
    '2RFAASDY54E4HDU34874',
    '2FRHDUYS2Y63NHD22455',
    '2RFAASDY54E4HDU34875',
    '2FRHDUYS2Y63NHD22654',
    '2FRHDUYS2Y63NHD22854'
  ];

  telemetriaLista: TelemetriaItem[] = [];
  searchTerm: string = '';
  menuAberto: boolean = false;
  loading: boolean = true;

  constructor(
    private veiculoService: VeiculoService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.carregarDashboard();
  }

  carregarDashboard(): void {
    this.loading = true;

    this.veiculoService.getVehicles().subscribe({
      next: ({ vehicles }: VehiclesResponse) => {
        this.vehicles = vehicles;
        if (this.vehicles.length > 0) {
          this.selectedVehicleId = Number(this.vehicles[0].id);
          this.selectedVehicle = { ...this.vehicles[0] };
        }
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Erro ao carregar veículos:', err);
        this.loading = false;
      }
    });

    this.telemetriaLista = [];
    this.vinsCadastrados.forEach((vin: string) => {
      this.veiculoService.getVehicleData(vin).subscribe({
        next: (data: VehicleTelemetry) => {
          this.telemetriaLista.push({
            vin: vin,
            odometro: data.odometro,
            nivelCombustivel: data.nivelCombustivel,
            status: data.status,
            lat: data.lat,
            long: data.long
          });
          this.cdr.detectChanges();
        },
        error: (err: any) => console.error(`Erro no VIN ${vin}:`, err)
      });
    });
  }

  get telemetriaFiltrada(): TelemetriaItem[] {
    if (!this.searchTerm.trim()) return this.telemetriaLista;
    return this.telemetriaLista.filter((item: TelemetriaItem) =>
      item.vin.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  onVehicleChange(id: any): void {
    const numericId = Number(id);
    this.selectedVehicleId = numericId;

    const veiculoEncontrado = this.vehicles.find((v: Vehicle) => Number(v.id) === numericId);

    if (veiculoEncontrado) {
      this.selectedVehicle = { ...veiculoEncontrado };
      this.cdr.detectChanges();
    }
  }

  toggleMenu(): void {
    this.menuAberto = !this.menuAberto;
  }

  logout(): void {
    this.authService.logout();
  }
}