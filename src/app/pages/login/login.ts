import { Component } from '@angular/core';
import { Auth } from '../../services/auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  usuario = {
    nome: '',
    senha: ''
  }
  loginAutomatico = false;
  mensagemDeErro: String | null = null;
  constructor(private auth: Auth, private router: Router) { }
  login() {
    this.auth.login(this.usuario, this.loginAutomatico).subscribe({
      next: response => {
        this.router.navigate(['/home']);
      }, error: (err) => {
        this.mensagemDeErro = err.error?.message || 'Ocorreu um erro ao tentar fazer login.';
      }
    })
  }
}