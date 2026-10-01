import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, throwError } from 'rxjs';

export interface User {
  id?: number;
  email: string;
  fullName?: string;
  role?: string;
  storeLocation?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = '/api/auth';

  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  private getUserFromStorage(): User | null {
    const saved = localStorage.getItem('stocksmart_user');
    return saved ? JSON.parse(saved) : null;
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  public isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  login(credentials: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(res => {
        if (res && res.token && res.user) {
          localStorage.setItem('stocksmart_token', res.token);
          localStorage.setItem('stocksmart_user', JSON.stringify(res.user));
          this.currentUserSubject.next(res.user);
        }
      })
    );
  }

  signup(userData: { email: string; password: string; fullName: string; role?: string; storeLocation?: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/signup`, userData).pipe(
      tap(res => {
        if (res && res.token && res.user) {
          localStorage.setItem('stocksmart_token', res.token);
          localStorage.setItem('stocksmart_user', JSON.stringify(res.user));
          this.currentUserSubject.next(res.user);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('stocksmart_token');
    localStorage.removeItem('stocksmart_user');
    this.currentUserSubject.next(null);
  }
}
