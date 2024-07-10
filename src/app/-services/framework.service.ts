import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { AuthService } from './auth.service';

const baseUrl = 'https://wizardylab.test/api';
let headers = new HttpHeaders({
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
  'Access-Control-Allow-Headers': 'Content-Type'
});

@Injectable({
  providedIn: 'root'
})
export class FrameworkService {
  constructor(private http: HttpClient) { }

  get(url: string, body: any, auth: boolean = true) {
    if(auth) {
      headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      });
    }

    return this.http.get(`${baseUrl}/${url}`, {headers: headers})
  }

  post(url: string, body: any, auth: boolean = true) {
    if(auth) {
      headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      });
    }

    return this.http.post(`${baseUrl}/${url}`, body, {headers: headers})
  }

  put(url: string, body: any) {
    return this.http.put(`${baseUrl}/${url}`, body)
  }

  delete(url: string, body: any, auth: boolean = true) {
    if(auth) {
      headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      });
    }

    return this.http.delete(`${baseUrl}/${url}`, {headers: headers})
  }
}
