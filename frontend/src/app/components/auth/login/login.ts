import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="auth-page">
      <div class="auth-card glass-card">
        <!-- Logo & Header -->
        <div class="auth-header">
          <div class="logo-box">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m2 7 10-5 10 5-10 5z"/>
              <path d="m2 17 10 5 10-5"/>
              <path d="m2 12 10 5 10-5"/>
            </svg>
          </div>
          <h1>Inventory Manager</h1>
          <p class="tagline">Retail Inventory Optimization System</p>
        </div>

        <!-- Demo Quick Fill Banner -->
        <div class="demo-banner">
          <span>Demo Account Available</span>
          <button type="button" class="btn-demo" (click)="fillDemo()">Fill Demo Credentials</button>
        </div>

        <!-- Error Alert -->
        <div *ngIf="errorMessage" class="error-alert">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span>{{ errorMessage }}</span>
        </div>

        <!-- Form -->
        <form (ngSubmit)="onSubmit()" #loginForm="ngForm" class="auth-form">
          <div class="form-group">
            <label>Email Address</label>
            <div class="input-wrapper">
              <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <input 
                type="email" 
                [(ngModel)]="email" 
                name="email" 
                #emailModel="ngModel"
                required 
                pattern="^[a-zA-Z0-9._%+-]+&#64;[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
                class="form-input with-icon" 
                [class.invalid]="emailModel.invalid && (emailModel.dirty || emailModel.touched)"
                placeholder="manager@stocksmart.com">
            </div>
            <div *ngIf="emailModel.invalid && (emailModel.dirty || emailModel.touched)" class="field-error">
              Please enter a valid email address.
            </div>
          </div>

          <div class="form-group">
            <label>Password</label>
            <div class="input-wrapper">
              <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <input 
                [type]="showPassword ? 'text' : 'password'" 
                [(ngModel)]="password" 
                name="password" 
                #passwordModel="ngModel"
                required 
                minlength="6"
                class="form-input with-icon" 
                [class.invalid]="passwordModel.invalid && (passwordModel.dirty || passwordModel.touched)"
                placeholder="••••••••">
              <button type="button" class="toggle-pwd" (click)="showPassword = !showPassword">
                {{ showPassword ? 'Hide' : 'Show' }}
              </button>
            </div>
            <div *ngIf="passwordModel.invalid && (passwordModel.dirty || passwordModel.touched)" class="field-error">
              Password must be at least 6 characters long.
            </div>
          </div>

          <button type="submit" class="btn-primary auth-btn" [disabled]="loginForm.invalid || loading">
            <span *ngIf="!loading">Sign In to Dashboard</span>
            <span *ngIf="loading">Authenticating...</span>
          </button>
        </form>

        <div class="auth-footer">
          Don't have an account? <a routerLink="/signup" class="auth-link">Create Account</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: radial-gradient(circle at top right, #1e293b, #0b0f19 70%);
      padding: 20px;
    }
    .auth-card {
      width: 100%;
      max-width: 440px;
      padding: 36px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .auth-header {
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .logo-box {
      width: 52px;
      height: 52px;
      border-radius: 14px;
      background: linear-gradient(135deg, #10b981, #059669);
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 12px;
      box-shadow: 0 6px 16px rgba(16, 185, 129, 0.3);
    }
    .auth-header h1 {
      font-size: 1.6rem;
      font-weight: 800;
      color: #ffffff;
    }
    .tagline {
      font-size: 0.85rem;
      color: var(--text-muted);
    }
    .demo-banner {
      background: rgba(59, 130, 246, 0.12);
      border: 1px solid rgba(59, 130, 246, 0.3);
      border-radius: 10px;
      padding: 10px 14px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 0.8rem;
      color: #93c5fd;
    }
    .btn-demo {
      background: #2563eb;
      color: #ffffff;
      border: none;
      padding: 4px 10px;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      font-size: 0.75rem;
    }
    .error-alert {
      background: rgba(239, 68, 68, 0.15);
      border: 1px solid rgba(239, 68, 68, 0.3);
      color: #f87171;
      padding: 10px 14px;
      border-radius: 8px;
      font-size: 0.85rem;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .form-group label {
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--text-secondary);
    }
    .input-wrapper {
      position: relative;
    }
    .input-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-muted);
    }
    .form-input.with-icon {
      width: 100%;
      padding-left: 38px;
    }
    .form-input.invalid {
      border-color: #ef4444;
    }
    .field-error {
      font-size: 0.75rem;
      color: #ef4444;
      margin-top: 2px;
    }
    .toggle-pwd {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      background: transparent;
      border: none;
      color: var(--text-muted);
      font-size: 0.75rem;
      cursor: pointer;
    }
    .auth-btn {
      width: 100%;
      justify-content: center;
      padding: 12px;
      margin-top: 8px;
      font-size: 0.95rem;
    }
    .auth-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    .auth-footer {
      text-align: center;
      font-size: 0.85rem;
      color: var(--text-muted);
    }
    .auth-link {
      color: #60a5fa;
      font-weight: 600;
      text-decoration: none;
    }
    .auth-link:hover {
      text-decoration: underline;
    }
  `]
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  showPassword = false;
  loading = false;
  errorMessage = '';

  fillDemo() {
    this.email = 'admin@stocksmart.com';
    this.password = 'admin123';
    this.errorMessage = '';
  }

  onSubmit() {
    if (!this.email || !this.password) return;
    this.loading = true;
    this.errorMessage = '';

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/inventory']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err?.error?.message || 'Invalid email or password.';
      }
    });
  }
}
