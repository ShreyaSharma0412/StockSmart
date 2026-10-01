import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryService } from '../../services/inventory.service';
import { Product, KpiSummary } from '../../models/inventory.model';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="reports-view">
      <header class="view-header">
        <div>
          <h1 class="page-title">Reports & Export Analytics</h1>
          <p class="subtitle">Download inventory valuation summaries, CSV catalogs, and low stock alert logs.</p>
        </div>
      </header>

      <div class="reports-grid">
        <div class="report-card glass-card">
          <div class="r-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          </div>
          <h3>Full Product Catalog Export</h3>
          <p>Export all active SKUs, available quantities, prices, categories, and locations to CSV.</p>
          <button class="btn-primary" (click)="exportProductCsv()">Export CSV</button>
        </div>

        <div class="report-card glass-card">
          <div class="r-icon warning">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          </div>
          <h3>Low Stock Alert Summary</h3>
          <p>Download list of items below reorder threshold for immediate supplier restock.</p>
          <button class="btn-primary" (click)="exportLowStockCsv()">Download Alert Log</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .reports-view {
      padding: 32px 40px;
      max-width: 1480px;
      margin: 0 auto;
    }
    .view-header {
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
    .reports-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 24px;
    }
    .report-card {
      padding: 28px;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
    }
    .r-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      background: rgba(59, 130, 246, 0.15);
      color: #60a5fa;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .r-icon.warning {
      background: rgba(239, 68, 68, 0.15);
      color: #f87171;
    }
    .report-card h3 {
      font-size: 1.15rem;
      color: #ffffff;
    }
    .report-card p {
      font-size: 0.85rem;
      color: var(--text-secondary);
      margin-bottom: 8px;
    }
  `]
})
export class ReportsComponent implements OnInit {
  private inventoryService = inject(InventoryService);
  products: Product[] = [];

  ngOnInit() {
    this.inventoryService.getProducts().subscribe(p => this.products = p);
  }

  exportProductCsv() {
    if (!this.products.length) return;
    const headers = ['ID', 'Name', 'SKU', 'Barcode', 'RFID', 'Price', 'Quantity', 'Status', 'Location', 'Category', 'Supplier'];
    const rows = this.products.map(p => [
      p.id,
      `"${p.name}"`,
      p.sku,
      p.barcode || '',
      p.rfidTag || '',
      p.price,
      p.quantity,
      p.status,
      `"${p.location || ''}"`,
      `"${p.category?.name || ''}"`,
      `"${p.supplier?.name || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'StockSmart_Product_Catalog.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  exportLowStockCsv() {
    const lowStock = this.products.filter(p => p.status === 'Low Stock' || p.status === 'Out of Stock' || p.quantity <= (p.minStockLevel || 15));
    if (!lowStock.length) return;
    const headers = ['SKU', 'Name', 'Available Qty', 'Min Level', 'Reorder Qty', 'Status', 'Supplier'];
    const rows = lowStock.map(p => [
      p.sku,
      `"${p.name}"`,
      p.quantity,
      p.minStockLevel || 15,
      p.reorderQuantity || 50,
      p.status,
      `"${p.supplier?.name || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'StockSmart_LowStock_Alerts.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
