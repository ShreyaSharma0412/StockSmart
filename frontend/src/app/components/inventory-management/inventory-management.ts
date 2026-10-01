import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { InventoryService } from '../../services/inventory.service';
import { Product, Category, Supplier, PurchaseOrder, KpiSummary } from '../../models/inventory.model';
import { ProductModalComponent } from '../product-modal/product-modal';
import { StockAdjustModalComponent } from '../stock-adjust-modal/stock-adjust-modal';

@Component({
  selector: 'app-inventory-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductModalComponent, StockAdjustModalComponent],
  template: `
    <div class="inventory-view">
      <!-- Top Title Header -->
      <header class="view-header">
        <h1 class="page-title">Inventory Management</h1>
        <button class="btn-primary" (click)="openAddModal()">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add Product
        </button>
      </header>

      <!-- Top KPI Metric Cards Grid -->
      <section class="kpi-grid">
        <!-- Card 1: Total Inventory Value -->
        <div class="kpi-card glass-card">
          <span class="kpi-label">Total Inventory Value</span>
          <div class="kpi-value">\${{ kpiSummary.totalInventoryValue | number:'1.0-0' }}</div>
          <div class="kpi-trend trend-up">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="18 15 12 9 6 15"/>
            </svg>
            {{ kpiSummary.totalInventoryValueTrend }}
          </div>
        </div>

        <!-- Card 2: Low Stock Alerts -->
        <div class="kpi-card glass-card">
          <span class="kpi-label">Low Stock Alerts</span>
          <div class="kpi-value">{{ kpiSummary.lowStockAlerts }} items</div>
          <div class="kpi-trend trend-down">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
            {{ kpiSummary.lowStockAlertsTrend }}
          </div>
        </div>

        <!-- Card 3: Avg Turnover Rate -->
        <div class="kpi-card glass-card">
          <span class="kpi-label">Avg. Turnover Rate</span>
          <div class="kpi-value">{{ kpiSummary.avgTurnoverRate }}/year</div>
          <div class="kpi-trend trend-up">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="18 15 12 9 6 15"/>
            </svg>
            {{ kpiSummary.avgTurnoverRateTrend }}
          </div>
        </div>

        <!-- Card 4: Potential Lost Revenue -->
        <div class="kpi-card glass-card">
          <span class="kpi-label">Potential Lost Revenue</span>
          <div class="kpi-value">\${{ kpiSummary.potentialLostRevenue | number:'1.0-0' }}</div>
          <div class="kpi-trend trend-up">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="18 15 12 9 6 15"/>
            </svg>
            {{ kpiSummary.potentialLostRevenueTrend }}
          </div>
        </div>
      </section>

      <!-- Main Section: Table (Left) + AI Widgets (Right) -->
      <section class="main-content-layout">
        
        <!-- Left Table Container -->
        <div class="table-container glass-card">
          
          <!-- Filters & Search Toolbar -->
          <div class="toolbar">
            <div class="search-box">
              <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.3-4.3"/>
              </svg>
              <input 
                type="text" 
                [(ngModel)]="searchQuery" 
                (ngModelChange)="onSearchChange()" 
                class="form-input search-input" 
                placeholder="Search by product name or SKU...">
            </div>

            <div class="filter-controls">
              <select [(ngModel)]="selectedCategory" (change)="filterProducts()" class="form-input filter-select">
                <option value="ALL">Category: All</option>
                <option *ngFor="let cat of categories" [value]="cat.name">{{ cat.name }}</option>
              </select>

              <select [(ngModel)]="selectedStatus" (change)="filterProducts()" class="form-input filter-select">
                <option value="ALL">Status: All</option>
                <option value="Low Stock">Status: Low</option>
                <option value="In Stock">Status: In Stock</option>
                <option value="Out of Stock">Status: Out of Stock</option>
                <option value="Warning">Status: Warning</option>
              </select>
            </div>
          </div>

          <!-- Product Inventory Table -->
          <div class="table-wrapper">
            <table class="inventory-table">
              <thead>
                <tr>
                  <th>PRODUCT</th>
                  <th>SKU</th>
                  <th>AVAILABLE</th>
                  <th>STATUS</th>
                  <th>TOTAL VALUE</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let prod of filteredProducts">
                  <td class="product-cell">
                    <div class="product-thumb">
                      <img [src]="prod.imageUrl || 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=100'" [alt]="prod.name">
                    </div>
                    <div class="product-details">
                      <div class="p-name">{{ prod.name }}</div>
                      <div class="p-sub" *ngIf="prod.location">{{ prod.location }}</div>
                    </div>
                  </td>
                  <td class="sku-cell">{{ prod.sku }}</td>
                  <td class="qty-cell">{{ prod.quantity }} units</td>
                  <td>
                    <span class="status-pill" [ngClass]="getStatusClass(prod.status)">
                      <span class="dot"></span>
                      {{ prod.status }}
                    </span>
                  </td>
                  <td class="price-cell">\${{ (prod.quantity * prod.price) | number:'1.2-2' }}</td>
                  <td class="actions-cell">
                    <button class="btn-action-restock" title="Quick Restock / Adjust" (click)="openStockAdjust(prod)">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                      Restock
                    </button>
                    <button class="btn-action-edit" title="Edit Product" (click)="openEditModal(prod)">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <path d="M12 20h9"/>
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                      </svg>
                      Edit
                    </button>
                  </td>
                </tr>
                <tr *ngIf="filteredProducts.length === 0">
                  <td colspan="6" class="no-data">
                    No products found matching filters.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Right Widgets Container -->
        <div class="widgets-container">
          
          <!-- Widget 1: AI Reorder Recommendations -->
          <div class="widget-card glass-card">
            <h3 class="widget-title">AI Reorder Recommendations</h3>
            <div class="reorder-list">
              <div class="reorder-item" *ngFor="let item of reorderItems">
                <div class="reorder-thumb">
                  <img [src]="item.imageUrl || 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=100'" [alt]="item.name">
                </div>
                <div class="reorder-info">
                  <div class="r-title">{{ item.name }}</div>
                  <div class="r-units">{{ item.quantity }} units left</div>
                  <div class="r-rec">Reorder {{ item.reorderQuantity || 50 }} units</div>
                </div>
                <button class="btn-reorder" (click)="triggerReorder(item)">Reorder</button>
              </div>
            </div>
          </div>

          <!-- Widget 2: Automated Reorder Pipeline -->
          <div class="widget-card glass-card">
            <h3 class="widget-title">Automated Reorder Pipeline</h3>
            <div class="pipeline-list">
              <div class="pipeline-item" *ngFor="let order of purchaseOrders">
                <div class="pipeline-icon" [ngClass]="(order.status || 'SENT').toLowerCase()">
                  <!-- Sent Icon -->
                  <svg *ngIf="order.status === 'SENT'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="22" y1="2" x2="11" y2="13"/>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                  </svg>
                  <!-- In Transit Icon -->
                  <svg *ngIf="order.status === 'IN_TRANSIT'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="1" y="3" width="15" height="13"/>
                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
                    <circle cx="5.5" cy="18.5" r="2.5"/>
                    <circle cx="18.5" cy="18.5" r="2.5"/>
                  </svg>
                  <!-- Delivered Icon -->
                  <svg *ngIf="order.status === 'DELIVERED'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                </div>
                <div class="pipeline-info">
                  <div class="p-po">{{ order.poNumber }} {{ order.status === 'SENT' ? 'Sent' : (order.status === 'IN_TRANSIT' ? 'In Transit' : 'Delivered') }}</div>
                  <div class="p-sup" *ngIf="order.supplier">Supplier: {{ order.supplier.name }}</div>
                  <div class="p-eta" *ngIf="order.eta">{{ order.eta.startsWith('ETA') ? order.eta : 'Received ' + order.eta }}</div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </section>

      <!-- Add / Edit Modal -->
      <app-product-modal 
        *ngIf="showProductModal" 
        [product]="selectedProduct"
        [categories]="categories"
        [suppliers]="suppliers"
        (save)="onSaveProduct($event)"
        (close)="showProductModal = false">
      </app-product-modal>

      <!-- Stock Adjust Modal -->
      <app-stock-adjust-modal 
        *ngIf="showStockAdjustModal && selectedProductForAdjust"
        [product]="selectedProductForAdjust"
        (apply)="onApplyStockAdjust($event)"
        (close)="showStockAdjustModal = false">
      </app-stock-adjust-modal>

    </div>
  `,
  styles: [`
    .inventory-view {
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
      letter-spacing: -0.02em;
    }

    /* KPI Grid */
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      margin-bottom: 28px;
    }

    .kpi-card {
      padding: 22px 24px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .kpi-label {
      font-size: 0.825rem;
      color: var(--text-muted);
      font-weight: 500;
    }

    .kpi-value {
      font-size: 1.8rem;
      font-weight: 800;
      color: #ffffff;
      letter-spacing: -0.02em;
    }

    .kpi-trend {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .trend-up {
      color: #34d399;
    }

    .trend-down {
      color: #f87171;
    }

    /* Main Section Layout */
    .main-content-layout {
      display: grid;
      grid-template-columns: 1fr 340px;
      gap: 24px;
    }

    /* Table Container */
    .table-container {
      padding: 24px;
      display: flex;
      flex-direction: column;
    }

    .toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      margin-bottom: 20px;
    }

    .search-box {
      position: relative;
      flex: 1;
      max-width: 380px;
    }

    .search-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-muted);
    }

    .search-input {
      width: 100%;
      padding-left: 38px;
    }

    .filter-controls {
      display: flex;
      gap: 12px;
    }

    .filter-select {
      cursor: pointer;
      min-width: 140px;
    }

    /* Table Styling */
    .table-wrapper {
      overflow-x: auto;
    }

    .inventory-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }

    .inventory-table th {
      padding: 12px 16px;
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--text-muted);
      letter-spacing: 0.05em;
      border-bottom: 1px solid var(--border-color);
    }

    .inventory-table td {
      padding: 16px;
      font-size: 0.875rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.04);
      color: var(--text-primary);
      vertical-align: middle;
    }

    .inventory-table tbody tr:hover {
      background-color: var(--bg-card-hover);
    }

    .product-cell {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .product-thumb img {
      width: 44px;
      height: 44px;
      border-radius: 8px;
      object-fit: cover;
      border: 1px solid var(--border-color);
    }

    .p-name {
      font-weight: 600;
      color: #ffffff;
    }

    .p-sub {
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .sku-cell {
      color: var(--text-secondary);
      font-family: monospace;
      font-size: 0.825rem;
    }

    .qty-cell {
      font-weight: 600;
    }

    .price-cell {
      font-weight: 700;
      color: #ffffff;
    }

    .actions-cell {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .btn-action-restock {
      background: #e6f4ea;
      border: 1px solid #a7f3d0;
      color: #047857;
      font-size: 0.775rem;
      font-weight: 700;
      padding: 6px 10px;
      border-radius: 8px;
      display: inline-flex;
      align-items: center;
      gap: 5px;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }

    .btn-action-restock:hover {
      background: #10b981;
      color: #ffffff;
      border-color: #10b981;
      box-shadow: 0 3px 8px rgba(16, 185, 129, 0.3);
    }

    .btn-action-edit {
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      color: #1d4ed8;
      font-size: 0.775rem;
      font-weight: 700;
      padding: 6px 10px;
      border-radius: 8px;
      display: inline-flex;
      align-items: center;
      gap: 5px;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }

    .btn-action-edit:hover {
      background: #3b82f6;
      color: #ffffff;
      border-color: #3b82f6;
      box-shadow: 0 3px 8px rgba(59, 130, 246, 0.3);
    }

    .no-data {
      text-align: center;
      color: var(--text-muted);
      padding: 32px;
    }

    /* Widgets Section */
    .widgets-container {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .widget-card {
      padding: 20px;
    }

    .widget-title {
      font-size: 0.95rem;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 16px;
    }

    /* AI Reorder Items */
    .reorder-list {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .reorder-item {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .reorder-thumb img {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      object-fit: cover;
    }

    .reorder-info {
      flex: 1;
    }

    .r-title {
      font-size: 0.85rem;
      font-weight: 600;
      color: #ffffff;
    }

    .r-units {
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .r-rec {
      font-size: 0.75rem;
      color: #34d399;
      font-weight: 500;
    }

    /* Pipeline Items */
    .pipeline-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .pipeline-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
    }

    .pipeline-icon {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .pipeline-icon.sent {
      background: rgba(59, 130, 246, 0.15);
      color: #60a5fa;
    }

    .pipeline-icon.in_transit {
      background: rgba(168, 85, 247, 0.15);
      color: #c084fc;
    }

    .pipeline-icon.delivered {
      background: rgba(16, 185, 129, 0.15);
      color: #34d399;
    }

    .p-po {
      font-size: 0.85rem;
      font-weight: 700;
      color: #ffffff;
    }

    .p-sup {
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .p-eta {
      font-size: 0.725rem;
      color: var(--text-secondary);
    }
  `]
})
export class InventoryManagementComponent implements OnInit {
  private inventoryService = inject(InventoryService);
  private cdr = inject(ChangeDetectorRef);
  private route = inject(ActivatedRoute);

  kpiSummary: KpiSummary = {
    totalInventoryValue: 1234567,
    totalInventoryValueTrend: '+2.1%',
    lowStockAlerts: 14,
    lowStockAlertsTrend: '-5.0%',
    avgTurnoverRate: 4.2,
    avgTurnoverRateTrend: '+0.3%',
    potentialLostRevenue: 12500,
    potentialLostRevenueTrend: '+1.5%'
  };

  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: Category[] = [];
  suppliers: Supplier[] = [];
  reorderItems: Product[] = [];
  purchaseOrders: PurchaseOrder[] = [];

  searchQuery = '';
  selectedCategory = 'ALL';
  selectedStatus = 'ALL';

  // Modals
  showProductModal = false;
  selectedProduct: Partial<Product> = {};

  showStockAdjustModal = false;
  selectedProductForAdjust: Product | null = null;

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['q']) {
        this.searchQuery = params['q'];
      }
      this.filterProducts();
    });
    this.loadData();
  }

  loadData() {
    this.inventoryService.getKpiSummary().subscribe(kpi => {
      this.kpiSummary = kpi;
      this.cdr.markForCheck();
    });
    this.inventoryService.getCategories().subscribe(cats => {
      this.categories = cats;
      this.cdr.markForCheck();
    });
    this.inventoryService.getSuppliers().subscribe(sups => {
      this.suppliers = sups;
      this.cdr.markForCheck();
    });
    this.inventoryService.getPurchaseOrders().subscribe(pos => {
      this.purchaseOrders = pos;
      this.cdr.markForCheck();
    });

    this.inventoryService.getProducts().subscribe(prods => {
      this.products = prods;
      this.filterProducts();
      this.cdr.markForCheck();
    });

    this.inventoryService.getReorderRecommendations().subscribe(recs => {
      this.reorderItems = recs;
      this.cdr.markForCheck();
    });
  }

  onSearchChange() {
    this.filterProducts();
  }

  filterProducts() {
    let result = [...this.products];

    if (this.searchQuery && this.searchQuery.trim()) {
      const q = this.searchQuery.trim().toLowerCase();
      result = result.filter(p => {
        const nameMatch = p.name ? p.name.toLowerCase().includes(q) : false;
        const skuMatch = p.sku ? p.sku.toLowerCase().includes(q) : false;
        const barcodeMatch = p.barcode ? p.barcode.toLowerCase().includes(q) : false;
        const rfidMatch = p.rfidTag ? p.rfidTag.toLowerCase().includes(q) : false;
        const categoryMatch = p.category?.name ? p.category.name.toLowerCase().includes(q) : false;
        const supplierMatch = p.supplier?.name ? p.supplier.name.toLowerCase().includes(q) : false;
        const locationMatch = p.location ? p.location.toLowerCase().includes(q) : false;
        const descMatch = p.description ? p.description.toLowerCase().includes(q) : false;

        return nameMatch || skuMatch || barcodeMatch || rfidMatch || categoryMatch || supplierMatch || locationMatch || descMatch;
      });
    }

    if (this.selectedCategory !== 'ALL') {
      result = result.filter(p => p.category?.name === this.selectedCategory);
    }

    if (this.selectedStatus !== 'ALL') {
      result = result.filter(p => p.status === this.selectedStatus);
    }

    this.filteredProducts = result;
    this.cdr.markForCheck();
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Low Stock': return 'low-stock';
      case 'In Stock': return 'in-stock';
      case 'Warning': return 'warning';
      case 'Out of Stock': return 'out-of-stock';
      default: return 'in-stock';
    }
  }

  openAddModal() {
    this.selectedProduct = {
      quantity: 10,
      price: 19.99,
      status: 'In Stock',
      minStockLevel: 15,
      reorderQuantity: 50
    };
    this.showProductModal = true;
    this.cdr.markForCheck();
  }

  openEditModal(product: Product) {
    this.selectedProduct = { ...product };
    this.showProductModal = true;
    this.cdr.markForCheck();
  }

  onSaveProduct(prodData: Partial<Product>) {
    if (prodData.id) {
      this.inventoryService.updateProduct(prodData.id, prodData).subscribe(() => {
        this.showProductModal = false;
        this.loadData();
      });
    } else {
      this.inventoryService.addProduct(prodData).subscribe(() => {
        this.showProductModal = false;
        this.loadData();
      });
    }
  }

  openStockAdjust(product: Product) {
    this.selectedProductForAdjust = product;
    this.showStockAdjustModal = true;
    this.cdr.markForCheck();
  }

  onApplyStockAdjust(event: { delta: number; type: string; remarks: string; destLoc?: string }) {
    if (!this.selectedProductForAdjust?.id) return;
    this.inventoryService.adjustStock(
      this.selectedProductForAdjust.id,
      event.delta,
      event.type,
      event.remarks,
      undefined,
      event.destLoc
    ).subscribe(() => {
      this.showStockAdjustModal = false;
      this.loadData();
    });
  }

  triggerReorder(product: Product) {
    if (!product.id) return;
    this.inventoryService.triggerReorder(product.id, product.reorderQuantity || 50).subscribe(() => {
      this.loadData();
    });
  }
}
