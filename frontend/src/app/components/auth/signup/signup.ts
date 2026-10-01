import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="auth-page">
      <div class="auth-card glass-card">
        <div class="auth-header">
          <div class="logo-box">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <path d="m2 7 10-5 10 5-10 5z"/>
              <path d="m2 17 10 5 10-5"/>
              <path d="m2 12 10 5 10-5"/>
            </svg>
          </div>
          <h1>Create Account</h1>
          <p class="tagline">Register new staff account for Inventory Manager</p>
        </div>

        <div *ngIf="errorMessage" class="error-alert">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span>{{ errorMessage }}</span>
        </div>

        <form (ngSubmit)="onSubmit()" #signupForm="ngForm" class="auth-form">
          <div class="form-group">
            <label>Full Name *</label>
            <input 
              type="text" 
              [(ngModel)]="fullName" 
              name="fullName" 
              #nameModel="ngModel"
              required 
              class="form-input" 
              [class.invalid]="nameModel.invalid && (nameModel.dirty || nameModel.touched)"
              placeholder="Alex Retailer">
            <div *ngIf="nameModel.invalid && (nameModel.dirty || nameModel.touched)" class="field-error">
              Full name is required.
            </div>
          </div>

          <div class="form-group">
            <label>Email Address *</label>
            <input 
              type="email" 
              [(ngModel)]="email" 
              name="email" 
              #emailModel="ngModel"
              required 
              pattern="^[a-zA-Z0-9._%+-]+&#64;[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
              class="form-input" 
              [class.invalid]="emailModel.invalid && (emailModel.dirty || emailModel.touched)"
              placeholder="alex@store.com">
            <div *ngIf="emailModel.invalid && (emailModel.dirty || emailModel.touched)" class="field-error">
              Valid email is required.
            </div>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label>Password *</label>
              <input 
                type="password" 
                [(ngModel)]="password" 
                name="password" 
                #passwordModel="ngModel"
                required 
                minlength="6"
                class="form-input" 
                [class.invalid]="passwordModel.invalid && (passwordModel.dirty || passwordModel.touched)"
                placeholder="••••••••">
              <div *ngIf="passwordModel.invalid && (passwordModel.dirty || passwordModel.touched)" class="field-error">
                Min 6 characters.
              </div>
            </div>

            <div class="form-group">
              <label>Confirm Password *</label>
              <input 
                type="password" 
                [(ngModel)]="confirmPassword" 
                name="confirmPassword" 
                required 
                class="form-input" 
                [class.invalid]="password !== confirmPassword && confirmPassword.length > 0"
                placeholder="••••••••">
              <div *ngIf="password !== confirmPassword && confirmPassword.length > 0" class="field-error">
                Passwords do not match.
              </div>
            </div>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label>System Role</label>
              <select [(ngModel)]="role" name="role" class="form-input">
                <option value="MANAGER">Store Manager</option>
                <option value="CLERK">Inventory Clerk</option>
                <option value="ADMIN">System Admin</option>
              </select>
            </div>

            <div class="form-group">
              <label>Primary Location</label>
              <select [(ngModel)]="storeLocation" name="storeLocation" class="form-input">
                <option value="Warehouse A">Warehouse A</option>
                <option value="Store B">Store B</option>
                <option value="Main Hub">Main Hub</option>
              </select>
            </div>
          </div>

          <button type="submit" class="btn-primary auth-btn" [disabled]="signupForm.invalid || password !== confirmPassword || loading">
            <span *ngIf="!loading">Create Account & Enter</span>
            <span *ngIf="loading">Creating Account...</span>
          </button>
        </form>

        <div class="auth-footer">
          Already registered? <a routerLink="/login" class="auth-link">Sign In</a>
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
      max-width: 500px;
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
      gap: 14px;
    }
    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
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
    .form-input.invalid {
      border-color: #ef4444;
    }
    .field-error {
      font-size: 0.75rem;
      color: #ef4444;
      margin-top: 2px;
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
  `]
})
export class SignUpComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  fullName = '';
  email = '';
  password = '';
  confirmPassword = '';
  role = 'MANAGER';
  storeLocation = 'Warehouse A';
  loading = false;
  errorMessage = '';

  onSubmit() {
    if (!this.fullName || !this.email || !this.password || this.password !== this.confirmPassword) return;
    this.loading = true;
    this.errorMessage = '';

    this.authService.signup({
      fullName: this.fullName,
      email: this.email,
      password: this.password,
      role: this.role,
      storeLocation: this.storeLocation
    }).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/inventory']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err?.error?.message || 'Failed to create account.';
      }
    });
  }
}
