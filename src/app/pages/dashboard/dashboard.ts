import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface ItemTelemetria {
  vin: string;
  odometro: string;
  combustivel: number;
  statusOleo: string;
  lat: string;
  long: string;
}

interface DadosVeiculo {
  nome: string;
  vendas: string;
  conectados: string;
  updateSoftware: string;
  imagem: string;
  telemetria: ItemTelemetria[];
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent {
  menuAberto: boolean = false;
  modeloSelecionado: string = 'mustang';
  termoBusca: string = '';

  // Base de dados com métricas e telemetria por modelo
  dadosVeiculos: Record<string, DadosVeiculo> = {
    mustang: {
      nome: 'Mustang',
      vendas: '1.250',
      conectados: '1.180',
      updateSoftware: '98%',
      imagem: 'images/mustang.png',
      telemetria: [
        { vin: '1FA6P8CF0R5100001', odometro: '12.450 km', combustivel: 85, statusOleo: 'OK', lat: '-23.5505', long: '-46.6333' },
        { vin: '1FA6P8CF0R5100002', odometro: '45.100 km', combustivel: 32, statusOleo: 'OK', lat: '-22.9068', long: '-43.1729' },
        { vin: '1FA6P8CF0R5100003', odometro: '8.300 km', combustivel: 95, statusOleo: 'OK', lat: '-19.9167', long: '-43.9345' }
      ]
    },
    broncoSport: {
      nome: 'Bronco Sport',
      vendas: '3.400',
      conectados: '3.250',
      updateSoftware: '94%',
      imagem: 'images/broncoSport.png',
      telemetria: [
        { vin: '3FA6P0SU0R8200001', odometro: '28.900 km', combustivel: 60, statusOleo: 'OK', lat: '-25.4284', long: '-49.2733' },
        { vin: '3FA6P0SU0R8200002', odometro: '15.200 km', combustivel: 45, statusOleo: 'OK', lat: '-30.0346', long: '-51.2177' }
      ]
    },
    ranger: {
      nome: 'Ranger',
      vendas: '8.900',
      conectados: '8.400',
      updateSoftware: '91%',
      imagem: 'gitimages/ranger.png',
      telemetria: [
        { vin: '8AFAR23A0R9300001', odometro: '62.000 km', combustivel: 70, statusOleo: 'OK', lat: '-15.7801', long: '-47.9292' },
        { vin: '8AFAR23A0R9300002', odometro: '88.400 km', combustivel: 18, statusOleo: 'Atenção', lat: '-12.9777', long: '-38.5016' }
      ]
    },
    territory: {
      nome: 'Territory',
      vendas: '2.100',
      conectados: '1.980',
      updateSoftware: '96%',
      imagem: 'images/territory.png',
      telemetria: [
        { vin: 'LVSH78100R1400001', odometro: '5.100 km', combustivel: 90, statusOleo: 'OK', lat: '-8.0476', long: '-34.8770' }
      ]
    }
  };

  constructor(private router: Router) {}

  get veiculoAtual(): DadosVeiculo {
    return this.dadosVeiculos[this.modeloSelecionado] || this.dadosVeiculos['mustang'];
  }

  get telemetriaFiltrada(): ItemTelemetria[] {
    const lista = this.veiculoAtual.telemetria;
    if (!this.termoBusca.trim()) {
      return lista;
    }
    return lista.filter(item => 
      item.vin.toLowerCase().includes(this.termoBusca.toLowerCase())
    );
  }

  toggleMenu(): void {
    this.menuAberto = !this.menuAberto;
  }

  irParaHome(): void {
    this.menuAberto = false;
    this.router.navigate(['/home']);
  }

  irParaDashboard(): void {
    this.menuAberto = false;
    this.router.navigate(['/dashboard']);
  }

  logout(): void {
    this.menuAberto = false;
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}