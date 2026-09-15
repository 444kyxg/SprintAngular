import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, Usuario } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent implements OnInit {
  usuario = {
    nome: '',
    senha: ''
  };

  mensagemErro: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.logout();
  }

  login(): void {
    this.mensagemErro = '';

    this.authService.login(this.usuario).subscribe({
      next: (response: Usuario) => {
        this.router.navigate(['/home']);
      },
      error: (err: any) => {
        console.error('Falha no login', err);
        this.mensagemErro = err.error?.message || 'Falha na autenticação. Verifique usuário e senha.';
      }
    });
  }
}