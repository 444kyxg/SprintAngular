import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, filter } from 'rxjs/operators';
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
export class DashboardComponent implements OnInit, OnDestroy {
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

  // RxJS: Subject para capturar o fluxo de digitação da busca
  private searchSubject = new Subject<string>();
  private searchSubscription?: Subscription;

  constructor(
    private veiculoService: VeiculoService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.carregarDashboard();
    this.configurarFiltroRxJS();
  }

  ngOnDestroy(): void {
    // Evita vazamento de memória ao destruir o componente
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  // Uso dos operadores RxJS exigidos no filtro de busca
  private configurarFiltroRxJS(): void {
    this.searchSubscription = this.searchSubject.pipe(
      debounceTime(300),                                   // Aguarda 300ms de pausa na digitação
      distinctUntilChanged(),                              // Dispara só se o valor realmente mudou
      map((term: string) => term.trim().toLowerCase()),    // Transforma para letras minúsculas sem espaços
      filter((term: string) => term.length === 0 || term.length >= 2) // Aceita campo vazio ou 2+ caracteres
    ).subscribe((termProcessed: string) => {
      this.searchTerm = termProcessed;
      this.cdr.detectChanges();
    });
  }

  // Evento disparado no input do HTML
  onSearchInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.searchSubject.next(inputElement.value);
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
    if (!this.searchTerm) return this.telemetriaLista;
    return this.telemetriaLista.filter((item: TelemetriaItem) =>
      item.vin.toLowerCase().includes(this.searchTerm)
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