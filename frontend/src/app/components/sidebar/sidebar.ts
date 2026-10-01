import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <header class="top-nav-bar">
      <div class="nav-content-container">
        
        <!-- Left: Brand Emblem -->
        <div class="brand-box" routerLink="/dashboard">
          <div class="brand-logo-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
          </div>
          <span class="brand-title">StockSmart</span>
        </div>

        <!-- Center: Horizontal Pill Links -->
        <nav class="nav-pills">
          <a routerLink="/dashboard" routerLinkActive="active" class="pill-link">
            <span>Dashboard</span>
            <span class="active-dot"></span>
          </a>

          <a routerLink="/inventory" routerLinkActive="active" class="pill-link">
            <span>Inventory</span>
            <span class="active-dot"></span>
          </a>

          <a routerLink="/scanner" routerLinkActive="active" class="pill-link">
            <span>Barcode/RFID</span>
            <span class="active-dot"></span>
          </a>

          <a routerLink="/suppliers" routerLinkActive="active" class="pill-link">
            <span>Suppliers</span>
            <span class="active-dot"></span>
          </a>

          <a routerLink="/reports" routerLinkActive="active" class="pill-link">
            <span>Reports</span>
            <span class="active-dot"></span>
          </a>
        </nav>

        <!-- Right: Utilities & User Profile -->
        <div class="nav-right-tools">
          <div class="search-pill">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.3-4.3"/>
            </svg>
            <input 
              type="text" 
              [(ngModel)]="searchQuery" 
              (keyup.enter)="onTopSearch()"
              placeholder="Search stock, products..." 
              class="search-input">
          </div>

          <button class="icon-btn" title="Notifications">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            <span class="notif-dot"></span>
          </button>

          <!-- User Badge Profile -->
          <div class="user-profile-badge" *ngIf="user">
            <div class="user-avatar">
              {{ user.fullName ? user.fullName.substring(0, 2).toUpperCase() : 'JL' }}
            </div>
            <div class="user-text">
              <div class="u-name">{{ user.fullName || 'Jordan Lee' }}</div>
              <div class="u-role">{{ user.role || 'Product Manager' }}</div>
            </div>
          </div>

          <button class="logout-link" title="Sign Out" (click)="logout()">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>

      </div>
    </header>
  `,
  styles: [`
    .top-nav-bar {
      height: 72px;
      background: #ffffff;
      border-bottom: 1px solid var(--border-color);
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);
    }
    .nav-content-container {
      max-width: 1540px;
      margin: 0 auto;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 32px;
    }
    .brand-box {
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
    }
    .brand-logo-icon {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      background: var(--accent-gradient);
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);
    }
    .brand-title {
      font-size: 1.25rem;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.02em;
    }
    .nav-pills {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .pill-link {
      padding: 8px 18px;
      border-radius: 20px;
      font-size: 0.9rem;
      font-weight: 600;
      color: #64748b;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s ease;
    }
    .pill-link:hover {
      color: #0f172a;
      background: #f1f5f9;
    }
    .pill-link.active {
      background: #0f172a;
      color: #ffffff;
    }
    .active-dot {
      display: none;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #10b981;
    }
    .pill-link.active .active-dot {
      display: inline-block;
    }
    .nav-right-tools {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .search-pill {
      display: flex;
      align-items: center;
      gap: 8px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 20px;
      padding: 6px 14px;
      color: #94a3b8;
      width: 220px;
    }
    .search-input {
      border: none;
      background: transparent;
      outline: none;
      font-size: 0.825rem;
      color: #0f172a;
      width: 100%;
    }
    .icon-btn {
      position: relative;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      color: #64748b;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    .notif-dot {
      position: absolute;
      top: 8px;
      right: 8px;
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #10b981;
    }
    .user-profile-badge {
      display: flex;
      align-items: center;
      gap: 10px;
      padding-left: 8px;
      border-left: 1px solid #e2e8f0;
    }
    .user-avatar {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      background: #10b981;
      color: #ffffff;
      font-weight: 700;
      font-size: 0.8rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .u-name {
      font-size: 0.85rem;
      font-weight: 700;
      color: #0f172a;
      line-height: 1.1;
    }
    .u-role {
      font-size: 0.725rem;
      color: #64748b;
    }
    .logout-link {
      background: transparent;
      border: none;
      color: #94a3b8;
      cursor: pointer;
      padding: 6px;
      display: flex;
      align-items: center;
      border-radius: 6px;
    }
    .logout-link:hover {
      color: #ef4444;
      background: #fee2e2;
    }
  `]
})
export class SidebarComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  searchQuery = '';

  get user(): User | null {
    return this.authService.currentUserValue;
  }

  onTopSearch() {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/inventory'], { queryParams: { q: this.searchQuery.trim() } });
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
