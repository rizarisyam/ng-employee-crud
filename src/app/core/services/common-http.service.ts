// src/app/core/services/http.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private http: HttpClient) {}

  get<T>(url: string, params?: HttpParams | any, headers?: HttpHeaders | any): Observable<T> {
    return this.http.get<T>(url, {
      params: this.buildParams(params),
      headers: this.buildHeaders(headers),
    });
  }

  post<T>(url: string, body: any, headers?: HttpHeaders | any): Observable<T> {
    return this.http.post<T>(url, body, {
      headers: this.buildHeaders(headers),
    });
  }

  put<T>(url: string, body: any, headers?: HttpHeaders | any): Observable<T> {
    return this.http.put<T>(url, body, {
      headers: this.buildHeaders(headers),
    });
  }

  delete<T>(url: string, params?: HttpParams | any, headers?: HttpHeaders | any): Observable<T> {
    return this.http.delete<T>(url, {
      params: this.buildParams(params),
      headers: this.buildHeaders(headers),
    });
  }

  private buildHeaders(customHeaders: any): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    if (customHeaders) {
      for (const key of Object.keys(customHeaders)) {
        headers = headers.set(key, customHeaders[key]);
      }
    }

    return headers;
  }

  private buildParams(customParams: any): HttpParams {
    let params = new HttpParams();

    if (customParams) {
      for (const key of Object.keys(customParams)) {
        params = params.set(key, customParams[key]);
      }
    }

    return params;
  }
}
