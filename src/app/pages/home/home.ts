import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent {
  menuAberto: boolean = false;

  constructor(private router: Router) {}

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