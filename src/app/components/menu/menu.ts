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
  menuAberto: boolean = false;

  constructor(private router: Router) {}

  toggleMenu(): void {
    this.menuAberto = !this.menuAberto;
  }

  irPara(rota: string): void {
    this.menuAberto = false;
    this.router.navigate([`/${rota}`]);
  }

  logout(): void {
    this.menuAberto = false;
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}