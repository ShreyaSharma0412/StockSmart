import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login';
import { SignUpComponent } from './components/auth/signup/signup';
import { InventoryManagementComponent } from './components/inventory-management/inventory-management';
import { DashboardComponent } from './components/dashboard/dashboard';
import { ScannerModalComponent } from './components/scanner-modal/scanner-modal';
import { SuppliersComponent } from './components/suppliers/suppliers';
import { ReportsComponent } from './components/reports/reports';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignUpComponent },
  { path: 'inventory', component: InventoryManagementComponent, canActivate: [authGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'scanner', component: ScannerModalComponent, canActivate: [authGuard] },
  { path: 'suppliers', component: SuppliersComponent, canActivate: [authGuard] },
  { path: 'reports', component: ReportsComponent, canActivate: [authGuard] },
  { path: '', redirectTo: '/inventory', pathMatch: 'full' },
  { path: '**', redirectTo: '/inventory' }
];
