import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu.html',
  styleUrl: './menu.css'
})
export class MenuComponent {
  // Estado que define se a gaveta do menu está aberta
  menuAberto: boolean = false;

  constructor(private router: Router) {}

  // Alterna o menu entre aberto e fechado
  toggleMenu(): void {
    this.menuAberto = !this.menuAberto;
  }

  // Navega e fecha o menu automaticamente
  irPara(rota: string): void {
    this.menuAberto = false;
    this.router.navigate([`/${rota}`]);
  }

  // Realiza o logout e fecha o menu
  logout(): void {
    this.menuAberto = false;
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}