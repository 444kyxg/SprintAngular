import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu.html',
  styleUrl: './menu.css'
})
export class MenuComponent {
  menuAberto: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  toggleMenu(): void {
    this.menuAberto = !this.menuAberto;
  }

  irPara(rota: string): void {
    this.menuAberto = false;
    this.router.navigate([`/${rota}`]);
  }

  logout(): void {
    this.menuAberto = false;
    this.authService.logout();
  }
}