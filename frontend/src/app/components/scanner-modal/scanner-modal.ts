import { Component, EventEmitter, Output, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventoryService } from '../../services/inventory.service';
import { Product } from '../../models/inventory.model';

@Component({
  selector: 'app-scanner-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="scanner-container">
      <div class="scanner-card glass-card">
        <div class="header">
          <div class="icon-ring">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 7V5a2 2 0 0 1 2-2h2"/>
              <path d="M17 3h2a2 2 0 0 1 2 2v2"/>
              <path d="M21 17v2a2 2 0 0 1-2 2h-2"/>
              <path d="M7 21H5a2 2 0 0 1-2-2v-2"/>
              <rect x="7" y="7" width="10" height="10" rx="1"/>
            </svg>
          </div>
          <div>
            <h2>Barcode & RFID Scanner Simulator</h2>
            <p>Scan hardware RFID tags or enter Barcode/SKU numbers for instant stock lookup.</p>
          </div>
        </div>

        <!-- Quick Sample Scanner Buttons -->
        <div class="sample-pills">
          <span class="label">Quick Samples:</span>
          <button class="pill" (click)="scanCode('8901234567801')">Organic Oil (8901234567801)</button>
          <button class="pill" (click)="scanCode('8901234567802')">Coffee Beans (8901234567802)</button>
          <button class="pill" (click)="scanCode('RFID-11245-C')">RFID Tag (RFID-11245-C)</button>
          <button class="pill" (click)="scanCode('RFID-65489-D')">Ceramic Mug (RFID-65489-D)</button>
        </div>

        <!-- Search / Scan Input -->
        <div class="scan-input-group">
          <input 
            type="text" 
            [(ngModel)]="scanInput" 
            (keyup.enter)="onScan()" 
            class="form-input scan-input" 
            placeholder="Scan RFID Tag or Enter Barcode ID..."
            #scannerInput>
          <button class="btn-primary" (click)="onScan()">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.3-4.3"/>
            </svg>
            Scan Tag
          </button>
        </div>

        <!-- Result Section -->
        <div class="scan-result" *ngIf="searched">
          <div *ngIf="foundProduct" class="product-result-card">
            <div class="product-media">
              <img [src]="foundProduct.imageUrl || 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=150'" [alt]="foundProduct.name">
            </div>
            <div class="product-info">
              <div class="title-row">
                <h3>{{ foundProduct.name }}</h3>
                <span class="status-pill" [ngClass]="foundProduct.status.toLowerCase().replace(' ', '-')">
                  <span class="dot"></span>
                  {{ foundProduct.status }}
                </span>
              </div>
              <div class="sku-tag">SKU: {{ foundProduct.sku }} | Barcode: {{ foundProduct.barcode }}</div>
              <div class="rfid-tag">RFID Tag: {{ foundProduct.rfidTag || 'N/A' }}</div>
              <div class="metrics-row">
                <div class="m-box">
                  <span class="m-val">{{ foundProduct.quantity }} units</span>
                  <span class="m-lbl">Stock Level</span>
                </div>
                <div class="m-box">
                  <span class="m-val">\${{ foundProduct.price }}</span>
                  <span class="m-lbl">Unit Price</span>
                </div>
                <div class="m-box">
                  <span class="m-val">{{ foundProduct.location || 'Warehouse A' }}</span>
                  <span class="m-lbl">Location</span>
                </div>
              </div>
            </div>
          </div>

          <div *ngIf="!foundProduct" class="not-found-card">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <div>
              <h4>No product matched barcode/RFID code: "{{ scanInput }}"</h4>
              <p>Please check the tag hardware reader or create a new product catalog item.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .scanner-container {
      padding: 24px;
      max-width: 900px;
      margin: 0 auto;
    }
    .scanner-card {
      padding: 28px;
    }
    .header {
      display: flex;
      gap: 16px;
      align-items: center;
      margin-bottom: 24px;
    }
    .icon-ring {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      background: rgba(59, 130, 246, 0.15);
      color: #60a5fa;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid rgba(59, 130, 246, 0.3);
    }
    .header h2 {
      font-size: 1.25rem;
      color: #ffffff;
    }
    .header p {
      font-size: 0.85rem;
      color: var(--text-muted);
    }
    .sample-pills {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px;
      margin-bottom: 16px;
    }
    .sample-pills .label {
      font-size: 0.8rem;
      color: var(--text-secondary);
    }
    .pill {
      background: #182236;
      color: #93c5fd;
      border: 1px solid var(--border-color);
      border-radius: 6px;
      padding: 4px 10px;
      font-size: 0.75rem;
      cursor: pointer;
    }
    .pill:hover {
      background: #2563eb;
      color: #ffffff;
    }
    .scan-input-group {
      display: flex;
      gap: 12px;
      margin-bottom: 24px;
    }
    .scan-input {
      flex: 1;
      font-size: 1rem;
      padding: 12px 16px;
    }
    .product-result-card {
      display: flex;
      gap: 20px;
      background: #182238;
      border: 1px solid var(--border-accent);
      border-radius: 12px;
      padding: 20px;
    }
    .product-media img {
      width: 90px;
      height: 90px;
      border-radius: 10px;
      object-fit: cover;
    }
    .product-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .title-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .title-row h3 {
      font-size: 1.15rem;
      color: #ffffff;
    }
    .sku-tag, .rfid-tag {
      font-size: 0.8rem;
      color: var(--text-muted);
    }
    .metrics-row {
      display: flex;
      gap: 16px;
      margin-top: 10px;
    }
    .m-box {
      background: rgba(255, 255, 255, 0.04);
      padding: 8px 14px;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
    }
    .m-val {
      font-weight: 700;
      color: #ffffff;
      font-size: 0.9rem;
    }
    .m-lbl {
      font-size: 0.7rem;
      color: var(--text-muted);
    }
    .not-found-card {
      display: flex;
      gap: 16px;
      align-items: center;
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.3);
      border-radius: 12px;
      padding: 20px;
      color: #f87171;
    }
  `]
})
export class ScannerModalComponent {
  private inventoryService = inject(InventoryService);
  private cdr = inject(ChangeDetectorRef);

  scanInput = '';
  searched = false;
  foundProduct: Product | null = null;

  scanCode(code: string) {
    this.scanInput = code;
    this.onScan();
  }

  onScan() {
    if (!this.scanInput.trim()) return;
    this.inventoryService.scanProduct(this.scanInput.trim()).subscribe(prod => {
      this.searched = true;
      this.foundProduct = prod;
      this.cdr.markForCheck();
    });
  }
}
