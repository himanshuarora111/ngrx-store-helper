import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AutoBind } from 'ngrx-store-wrapper';

@Injectable({
  providedIn: 'root'
})
export class SampleServiceService {
  private apiUrl = 'https://api.restful-api.dev/objects/ff8081819782e69e0197a31541675900';

  constructor(private http: HttpClient) { }

  /**
   * Fetches data from the API
   * @returns Observable containing API response
   */
  getData(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  /**
   * Updates data in the API
   * @returns Observable containing API response
   */
  @AutoBind()
  updateData(data: any): Observable<any> {
    const headers = { 'Content-Type': 'application/json' };

    return this.http.put(this.apiUrl, data, { headers });
  }
}
