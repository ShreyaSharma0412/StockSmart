import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar';
import { AuthService } from './services/auth.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet, 
    SidebarComponent
  ],
  template: `
    <div class="app-layout" [class.auth-layout]="isAuthPage">
      <!-- Top Navigation Bar -->
      <app-sidebar *ngIf="!isAuthPage && isLoggedIn"></app-sidebar>

      <!-- Main Router Outlet Stage -->
      <main class="main-stage">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app-layout {
      display: flex;
      flex-direction: column;
      width: 100%;
      min-height: 100vh;
      background-color: var(--bg-main);
    }
    .main-stage {
      width: 100%;
      flex: 1;
      margin-left: 0;
    }
  `]
})
export class App {
  private authService = inject(AuthService);
  private router = inject(Router);

  isAuthPage = false;

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const url = event.urlAfterRedirects || event.url;
      this.isAuthPage = url.includes('/login') || url.includes('/signup');
    });
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}
