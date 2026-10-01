import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { Product, Category, Supplier, PurchaseOrder, StockTransaction, KpiSummary } from '../models/inventory.model';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private http = inject(HttpClient);
  private apiUrl = '/api';

  // Products API
  getProducts(search?: string): Observable<Product[]> {
    let params = new HttpParams();
    if (search && search.trim()) {
      params = params.set('search', search.trim());
    }
    return this.http.get<Product[]>(`${this.apiUrl}/products`, { params }).pipe(
      catchError(err => {
        console.error('Error fetching products from backend', err);
        return of([]);
      })
    );
  }

  getProductById(id: number): Observable<Product | null> {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`).pipe(
      catchError(() => of(null))
    );
  }

  scanProduct(code: string): Observable<Product | null> {
    const params = new HttpParams().set('code', code);
    return this.http.get<Product>(`${this.apiUrl}/products/scan`, { params }).pipe(
      catchError(() => of(null))
    );
  }

  addProduct(product: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/products`, product);
  }

  updateProduct(id: number, product: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/products/${id}`, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/products/${id}`);
  }

  adjustStock(id: number, quantityDelta: number, type: string, remarks?: string, sourceLocation?: string, destinationLocation?: string): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/products/${id}/adjust-stock`, {
      quantityDelta,
      type,
      remarks,
      sourceLocation,
      destinationLocation
    });
  }

  // Categories & Suppliers
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories`).pipe(
      catchError(() => of([]))
    );
  }

  addCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(`${this.apiUrl}/categories`, category);
  }

  getSuppliers(): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(`${this.apiUrl}/suppliers`).pipe(
      catchError(() => of([]))
    );
  }

  addSupplier(supplier: Supplier): Observable<Supplier> {
    return this.http.post<Supplier>(`${this.apiUrl}/suppliers`, supplier);
  }

  // Purchase Orders & AI Reorder Pipeline
  getPurchaseOrders(): Observable<PurchaseOrder[]> {
    return this.http.get<PurchaseOrder[]>(`${this.apiUrl}/orders`).pipe(
      catchError(() => of([]))
    );
  }

  triggerReorder(productId: number, quantity?: number): Observable<PurchaseOrder> {
    return this.http.post<PurchaseOrder>(`${this.apiUrl}/orders/reorder/${productId}`, { quantity });
  }

  updateOrderStatus(orderId: number, status: string): Observable<PurchaseOrder> {
    return this.http.put<PurchaseOrder>(`${this.apiUrl}/orders/${orderId}/status`, { status });
  }

  // Dashboard & KPI Summaries
  getKpiSummary(): Observable<KpiSummary> {
    return this.http.get<KpiSummary>(`${this.apiUrl}/dashboard/kpi`).pipe(
      catchError(() => of({
        totalInventoryValue: 1234567,
        totalInventoryValueTrend: '+2.1%',
        lowStockAlerts: 14,
        lowStockAlertsTrend: '-5.0%',
        avgTurnoverRate: 4.2,
        avgTurnoverRateTrend: '+0.3%',
        potentialLostRevenue: 12500,
        potentialLostRevenueTrend: '+1.5%'
      }))
    );
  }

  getReorderRecommendations(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/dashboard/reorder-recommendations`).pipe(
      catchError(() => of([]))
    );
  }

  // Transactions Log
  getTransactions(): Observable<StockTransaction[]> {
    return this.http.get<StockTransaction[]>(`${this.apiUrl}/transactions`).pipe(
      catchError(() => of([]))
    );
  }
}
