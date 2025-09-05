import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { EncryptionService } from './encryption.service';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
}

export interface PointsTransaction {
  amount: number;
  description: string;
}

export interface TransferRequest extends PointsTransaction {
  recipient: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = '/api';

  constructor(
    private http: HttpClient,
    private router: Router,
    private encryptionService: EncryptionService
  ) {
    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor logic will be handled by Angular HttpInterceptor
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.status === 401) {
      localStorage.removeItem('auth-storage');
      this.router.navigate(['/login']);
    }
    return throwError(() => error);
  }

  // Auth APIs
  getPublicKey(): Observable<any> {
    return this.http.get(`${this.baseUrl}/auth/public-key`)
      .pipe(catchError(this.handleError.bind(this)));
  }

  async login(data: LoginRequest): Promise<Observable<any>> {
    try {
      const publicKeyResponse = await this.getPublicKey().toPromise();
      const publicKey = publicKeyResponse.publicKey;
      const encryptedPassword = await this.encryptionService.encrypt(publicKey, data.password);

      return this.http.post(`${this.baseUrl}/auth/login`, {
        username: data.username,
        password: encryptedPassword
      }).pipe(catchError(this.handleError.bind(this)));
    } catch (error) {
      return throwError(() => error);
    }
  }

  async register(data: RegisterRequest): Promise<Observable<any>> {
    try {
      console.log('Getting public key...');
      const publicKeyResponse = await this.getPublicKey().toPromise();
      console.log('Public key response:', publicKeyResponse);

      const publicKey = publicKeyResponse.publicKey;
      console.log('Encrypting password...');
      const encryptedPassword = await this.encryptionService.encrypt(publicKey, data.password);
      console.log('Password encrypted successfully');

      console.log('Sending registration request...');
      const response = this.http.post(`${this.baseUrl}/auth/register`, {
        email: data.email,
        username: data.username,
        password: encryptedPassword
      }).pipe(catchError(this.handleError.bind(this)));

      console.log('Registration response:', response);
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      return throwError(() => error);
    }
  }

  // Points APIs
  getBalance(): Observable<any> {
    return this.http.get(`${this.baseUrl}/points/balance`)
      .pipe(catchError(this.handleError.bind(this)));
  }

  getTransactionHistory(): Observable<any> {
    return this.http.get(`${this.baseUrl}/points/history`)
      .pipe(catchError(this.handleError.bind(this)));
  }

  earnPoints(data: PointsTransaction): Observable<any> {
    return this.http.post(`${this.baseUrl}/points/earn`, data)
      .pipe(catchError(this.handleError.bind(this)));
  }

  redeemPoints(data: PointsTransaction): Observable<any> {
    return this.http.post(`${this.baseUrl}/points/redeem`, data)
      .pipe(catchError(this.handleError.bind(this)));
  }

  transferPoints(recipient: string, data: PointsTransaction): Observable<any> {
    return this.http.post(`${this.baseUrl}/points/transfer/${recipient}`, data)
      .pipe(catchError(this.handleError.bind(this)));
  }

  tradePoints(data: { amount: number }): Observable<any> {
    return this.http.post(`${this.baseUrl}/points/trade`, data)
      .pipe(catchError(this.handleError.bind(this)));
  }

  payWithPoints(data: { amount: number }): Observable<any> {
    return this.http.post(`${this.baseUrl}/points/pay`, data)
      .pipe(catchError(this.handleError.bind(this)));
  }
}
