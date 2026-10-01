import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product, Category, Supplier } from '../../models/inventory.model';

@Component({
  selector: 'app-product-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-backdrop" (click)="onClose()">
      <div class="modal-dialog glass-card" (click)="$event.stopPropagation()">
        <!-- Header -->
        <div class="modal-header">
          <h2>{{ product.id ? 'Edit Product' : 'Add New Product' }}</h2>
          <button class="close-btn" (click)="onClose()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <!-- Form Body -->
        <form (ngSubmit)="onSubmit()" class="modal-body">
          <div class="form-grid">
            <div class="form-group full-width">
              <label>Product Name *</label>
              <input type="text" [(ngModel)]="formData.name" name="name" required class="form-input" placeholder="e.g. Organic Coconut Oil">
            </div>

            <div class="form-group">
              <label>SKU Code *</label>
              <input type="text" [(ngModel)]="formData.sku" name="sku" required class="form-input" placeholder="e.g. SKU-84521">
            </div>

            <div class="form-group">
              <label>Price ($) *</label>
              <input type="number" step="0.01" [(ngModel)]="formData.price" name="price" required class="form-input" placeholder="18.50">
            </div>

            <div class="form-group">
              <label>Available Quantity *</label>
              <input type="number" [(ngModel)]="formData.quantity" name="quantity" required class="form-input" placeholder="8">
            </div>

            <div class="form-group">
              <label>Min Reorder Threshold</label>
              <input type="number" [(ngModel)]="formData.minStockLevel" name="minStockLevel" class="form-input" placeholder="15">
            </div>

            <div class="form-group">
              <label>Barcode ID</label>
              <input type="text" [(ngModel)]="formData.barcode" name="barcode" class="form-input" placeholder="8901234567801">
            </div>

            <div class="form-group">
              <label>RFID Tag ID</label>
              <input type="text" [(ngModel)]="formData.rfidTag" name="rfidTag" class="form-input" placeholder="RFID-84521-A">
            </div>

            <div class="form-group">
              <label>Category</label>
              <select [(ngModel)]="selectedCategoryId" name="categoryId" class="form-input">
                <option [ngValue]="null">Select Category</option>
                <option *ngFor="let cat of categories" [ngValue]="cat.id">{{ cat.name }}</option>
              </select>
            </div>

            <div class="form-group">
              <label>Supplier</label>
              <select [(ngModel)]="selectedSupplierId" name="supplierId" class="form-input">
                <option [ngValue]="null">Select Supplier</option>
                <option *ngFor="let sup of suppliers" [ngValue]="sup.id">{{ sup.name }}</option>
              </select>
            </div>

            <div class="form-group">
              <label>Location / Store</label>
              <input type="text" [(ngModel)]="formData.location" name="location" class="form-input" placeholder="Warehouse A / Store B">
            </div>

            <div class="form-group">
              <label>Image URL</label>
              <input type="text" [(ngModel)]="formData.imageUrl" name="imageUrl" class="form-input" placeholder="https://images.unsplash.com/...">
            </div>

            <div class="form-group full-width">
              <label>Description</label>
              <textarea [(ngModel)]="formData.description" name="description" rows="2" class="form-input" placeholder="Product details..."></textarea>
            </div>
          </div>

          <!-- Footer Actions -->
          <div class="modal-footer">
            <button type="button" class="btn-secondary" (click)="onClose()">Cancel</button>
            <button type="submit" class="btn-primary">
              {{ product.id ? 'Save Changes' : 'Create Product' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .modal-dialog {
      width: 100%;
      max-width: 650px;
      background-color: var(--bg-card);
      padding: 24px;
      max-height: 90vh;
      overflow-y: auto;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 12px;
      border-bottom: 1px solid var(--border-color);
    }

    .modal-header h2 {
      font-size: 1.25rem;
      font-weight: 700;
      color: #ffffff;
    }

    .close-btn {
      background: transparent;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
    }

    .close-btn:hover {
      color: #ffffff;
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .full-width {
      grid-column: span 2;
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

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 24px;
      padding-top: 16px;
      border-top: 1px solid var(--border-color);
    }
  `]
})
export class ProductModalComponent implements OnInit {
  @Input() product: Partial<Product> = {};
  @Input() categories: Category[] = [];
  @Input() suppliers: Supplier[] = [];

  @Output() save = new EventEmitter<Partial<Product>>();
  @Output() close = new EventEmitter<void>();

  formData: Partial<Product> = {};
  selectedCategoryId: number | null = null;
  selectedSupplierId: number | null = null;

  ngOnInit() {
    this.formData = { ...this.product };
    this.selectedCategoryId = this.product.category?.id || null;
    this.selectedSupplierId = this.product.supplier?.id || null;
  }

  onClose() {
    this.close.emit();
  }

  onSubmit() {
    if (!this.formData.name || !this.formData.name.trim()) {
      alert('Please enter a valid product name.');
      return;
    }

    if (this.selectedCategoryId !== null && this.selectedCategoryId !== undefined) {
      const catId = Number(this.selectedCategoryId);
      const cat = this.categories.find(c => Number(c.id) === catId);
      if (cat) this.formData.category = cat;
    }
    if (this.selectedSupplierId !== null && this.selectedSupplierId !== undefined) {
      const supId = Number(this.selectedSupplierId);
      const sup = this.suppliers.find(s => Number(s.id) === supId);
      if (sup) this.formData.supplier = sup;
    }
    this.save.emit(this.formData);
  }
}
