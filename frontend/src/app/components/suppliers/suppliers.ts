import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventoryService } from '../../services/inventory.service';
import { Supplier } from '../../models/inventory.model';

@Component({
  selector: 'app-suppliers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="suppliers-view">
      <header class="view-header">
        <div>
          <h1 class="page-title">Supplier Management</h1>
          <p class="subtitle">Vendor directory, fulfillment SLA ratings, and lead times.</p>
        </div>
        <button class="btn-primary" (click)="openAddModal()">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add Supplier
        </button>
      </header>

      <!-- Suppliers Grid -->
      <div class="suppliers-grid">
        <div class="supplier-card glass-card" *ngFor="let s of suppliers">
          <div class="sup-header">
            <div class="sup-badge">{{ s.code || 'SUP' }}</div>
            <div class="sup-rating">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              <span>{{ s.rating || 4.8 }}</span>
            </div>
          </div>

          <h3 class="sup-name">{{ s.name }}</h3>

          <div class="sup-details">
            <div class="d-row">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              <span>{{ s.email || 'orders@vendor.com' }}</span>
            </div>
            <div class="d-row">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              <span>{{ s.phone || '+1-800-555-0199' }}</span>
            </div>
            <div class="d-row">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <span>{{ s.address || 'Distribution Center' }}</span>
            </div>
          </div>

          <div class="sup-footer">
            <span class="lead-time">Lead Time: <strong>{{ s.leadTimeDays || 3 }} days</strong></span>
          </div>
        </div>
      </div>

      <!-- Add Supplier Modal -->
      <div class="modal-backdrop" *ngIf="showModal" (click)="showModal = false">
        <div class="modal-dialog glass-card" (click)="$event.stopPropagation()">
          <h2>Add New Supplier</h2>
          <form (ngSubmit)="saveSupplier()">
            <div class="form-group">
              <label>Supplier Name *</label>
              <input type="text" [(ngModel)]="newSupplier.name" name="name" required class="form-input">
            </div>
            <div class="form-group">
              <label>Vendor Code</label>
              <input type="text" [(ngModel)]="newSupplier.code" name="code" class="form-input" placeholder="SUP-ECO">
            </div>
            <div class="form-group">
              <label>Email</label>
              <input type="email" [(ngModel)]="newSupplier.email" name="email" class="form-input">
            </div>
            <div class="form-group">
              <label>Phone</label>
              <input type="text" [(ngModel)]="newSupplier.phone" name="phone" class="form-input">
            </div>
            <div class="form-group">
              <label>Address</label>
              <input type="text" [(ngModel)]="newSupplier.address" name="address" class="form-input">
            </div>
            <div class="modal-footer">
              <button type="button" class="btn-secondary" (click)="showModal = false">Cancel</button>
              <button type="submit" class="btn-primary">Save Supplier</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .suppliers-view {
      padding: 32px 40px;
      max-width: 1480px;
      margin: 0 auto;
    }
    .view-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 28px;
    }
    .page-title {
      font-size: 1.85rem;
      font-weight: 700;
      color: #ffffff;
    }
    .subtitle {
      font-size: 0.85rem;
      color: var(--text-muted);
      margin-top: 4px;
    }
    .suppliers-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
    }
    .supplier-card {
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .sup-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .sup-badge {
      background: rgba(59, 130, 246, 0.15);
      color: #60a5fa;
      padding: 4px 10px;
      border-radius: 6px;
      font-weight: 700;
      font-size: 0.75rem;
    }
    .sup-rating {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 0.85rem;
      font-weight: 700;
      color: #f59e0b;
    }
    .sup-name {
      font-size: 1.15rem;
      font-weight: 700;
      color: #ffffff;
    }
    .sup-details {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin: 8px 0;
    }
    .d-row {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.825rem;
      color: var(--text-secondary);
    }
    .sup-footer {
      padding-top: 12px;
      border-top: 1px solid var(--border-color);
      font-size: 0.8rem;
      color: var(--text-muted);
    }
    .modal-dialog {
      width: 100%;
      max-width: 480px;
      padding: 24px;
    }
    .modal-dialog h2 {
      font-size: 1.2rem;
      color: #ffffff;
      margin-bottom: 16px;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-bottom: 12px;
    }
    .form-group label {
      font-size: 0.8rem;
      color: var(--text-secondary);
    }
    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 20px;
    }
  `]
})
export class SuppliersComponent implements OnInit {
  private inventoryService = inject(InventoryService);
  private cdr = inject(ChangeDetectorRef);

  suppliers: Supplier[] = [];
  showModal = false;
  newSupplier: Partial<Supplier> = {};

  ngOnInit() {
    this.loadSuppliers();
  }

  loadSuppliers() {
    this.inventoryService.getSuppliers().subscribe(sups => {
      this.suppliers = sups;
      this.cdr.markForCheck();
    });
  }

  openAddModal() {
    this.newSupplier = { rating: 4.8, leadTimeDays: 3 };
    this.showModal = true;
    this.cdr.markForCheck();
  }

  saveSupplier() {
    if (!this.newSupplier.name) return;
    this.inventoryService.addSupplier(this.newSupplier as Supplier).subscribe(() => {
      this.showModal = false;
      this.loadSuppliers();
    });
  }
}
