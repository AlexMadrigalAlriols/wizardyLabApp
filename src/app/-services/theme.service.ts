import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  constructor(private router: Router, private authService: AuthService) {
    this.router.events
    .pipe(filter((event: any) => event instanceof NavigationEnd))
    .subscribe(async (event: NavigationEnd) => {
        if (event.url !== '/login') {
          const portal = await this.authService.getPortalDetails();
          this.updateTheme(portal.data);
        }
      });
  }

  private updateTheme(colors: any) {
    document.documentElement.style.setProperty('--primary-color', colors.primary_color);
    document.documentElement.style.setProperty('--secondary-color', colors.secondary_color);
    document.documentElement.style.setProperty('--primary-light-color', colors.primary_light_color);
    document.documentElement.style.setProperty('--secondary-light-color', colors.secondary_light_color);
    document.documentElement.style.setProperty('--btn-txt', colors.secondary_light_color);
    document.documentElement.style.setProperty('--secondary-light-color', colors.btn_text_color);
    document.documentElement.style.setProperty('--menu-txt-color', colors.menu_text_color);
  }
}
