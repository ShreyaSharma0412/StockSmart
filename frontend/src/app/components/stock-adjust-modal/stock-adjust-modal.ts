import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from '../../models/inventory.model';

@Component({
  selector: 'app-stock-adjust-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-backdrop" (click)="onClose()">
      <div class="modal-dialog glass-card" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <div>
            <h2>Stock Movement & Adjustment</h2>
            <div class="subtitle">{{ product.name }} ({{ product.sku }})</div>
          </div>
          <button class="close-btn" (click)="onClose()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <form (ngSubmit)="onSubmit()" class="modal-body">
          <div class="current-badge">
            Current Quantity Available: <strong>{{ product.quantity || 0 }} units</strong>
          </div>

          <div class="form-group">
            <label>Movement Type</label>
            <select [(ngModel)]="type" name="type" class="form-input">
              <option value="STOCK_IN">Stock In (Restock / Receiving)</option>
              <option value="STOCK_OUT">Stock Out (Sale / Dispatch)</option>
              <option value="TRANSFER">Inter-Location Transfer</option>
              <option value="AUDIT">Inventory Audit Adjustment</option>
            </select>
          </div>

          <div class="form-group">
            <label>Quantity Delta</label>
            <input type="number" min="1" [(ngModel)]="amount" name="amount" required class="form-input" placeholder="e.g. 50">
          </div>

          <div class="form-group" *ngIf="type === 'TRANSFER'">
            <label>Destination Location</label>
            <input type="text" [(ngModel)]="destinationLocation" name="destinationLocation" class="form-input" placeholder="Store B / Aisle 4">
          </div>

          <div class="form-group">
            <label>Remarks / Reference</label>
            <input type="text" [(ngModel)]="remarks" name="remarks" class="form-input" placeholder="e.g. Supplier PO restock or POS sale">
          </div>

          <div class="modal-footer">
            <button type="button" class="btn-secondary" (click)="onClose()">Cancel</button>
            <button type="submit" class="btn-primary">Apply Adjustment</button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .modal-dialog {
      width: 100%;
      max-width: 480px;
      padding: 24px;
    }
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 16px;
    }
    .modal-header h2 {
      font-size: 1.15rem;
      color: #ffffff;
    }
    .subtitle {
      font-size: 0.8rem;
      color: var(--text-muted);
    }
    .close-btn {
      background: transparent;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
    }
    .current-badge {
      background: rgba(59, 130, 246, 0.12);
      color: #60a5fa;
      padding: 10px 14px;
      border-radius: 8px;
      font-size: 0.85rem;
      margin-bottom: 16px;
      border: 1px solid rgba(59, 130, 246, 0.2);
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-bottom: 14px;
    }
    .form-group label {
      font-size: 0.8rem;
      color: var(--text-secondary);
      font-weight: 600;
    }
    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 20px;
    }
  `]
})
export class StockAdjustModalComponent {
  @Input() product!: Product;
  @Output() apply = new EventEmitter<{ delta: number; type: string; remarks: string; destLoc?: string }>();
  @Output() close = new EventEmitter<void>();

  type = 'STOCK_IN';
  amount = 10;
  remarks = '';
  destinationLocation = '';

  onClose() {
    this.close.emit();
  }

  onSubmit() {
    const delta = this.type === 'STOCK_OUT' ? -Math.abs(this.amount) : Math.abs(this.amount);
    this.apply.emit({
      delta,
      type: this.type,
      remarks: this.remarks || `${this.type} adjustment`,
      destLoc: this.destinationLocation
    });
  }
}
