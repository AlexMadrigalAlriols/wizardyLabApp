import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = false;
  private userId: string | null = null;

  constructor(private router: Router) { }

  login(email: string, password: string): Promise<boolean> {
    return new Promise((resolve) => {
      if (email === 'test@test.com' && password === 'password') {
        this.isAuthenticated = true;
        this.userId = '12345';
        localStorage.setItem('userId', this.userId);
        resolve(true);
      } else {
        resolve(false);
      }
    });
  }

  logout() {
    this.isAuthenticated = false;
    this.userId = null;
    localStorage.removeItem('userId');
    this.router.navigate(['/login']);
  }

  getUserId(): string | null {
    return this.userId || localStorage.getItem('userId');
  }

  checkAuthenticated(): boolean {
    return this.isAuthenticated || !!localStorage.getItem('userId');
  }
}
