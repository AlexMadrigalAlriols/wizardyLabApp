import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { FrameworkService } from './framework.service';
import { get } from 'jquery';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = false;
  private token: string | null = null;
  private portal: string |null = null;
  private user: string |null = null;

  constructor(private router: Router, private framework: FrameworkService) { }

  login(email: string, password: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.framework.post('login', {email, password}, false).subscribe((response: any) => {
        if(response.token) {
          this.isAuthenticated = true;
          this.token = response.token;
          localStorage.setItem('token', response.token);
          localStorage.setItem('portal', JSON.stringify(response.portal))
          this.portal = JSON.stringify(response.portal);
          resolve(true);
        } else {
          resolve(false);
        }
      },
      error => {
        resolve(false);
      });
    });
  }

  getPortal(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.framework.get('portal', {}, true).subscribe(
        (response: any) => {
          localStorage.setItem('portal', JSON.stringify(response.portal));
          this.portal = JSON.stringify(response.portal);
          this.user = JSON.stringify(response.user);
          localStorage.setItem('user', JSON.stringify(response.user));
          resolve(this.portal);
        },
        error => {
          this.router.navigate(['/login']);
          reject(error);
        }
      );
    });
  }

  logout() {
    this.isAuthenticated = false;
    this.token = null;
    localStorage.removeItem('token');
    localStorage.removeItem('portal');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return this.token || localStorage.getItem('token');
  }

  async getPortalDetails() {
    return this.getPortal()
      .then(portal => {
        return JSON.parse(portal);
      })
      .catch(error => {
        this.logout();
        this.router.navigate(['/login']);
      });
  }

  checkAuthenticated(): boolean {
    return this.isAuthenticated || !!localStorage.getItem('token') || !!localStorage.getItem('portal');
  }
}
