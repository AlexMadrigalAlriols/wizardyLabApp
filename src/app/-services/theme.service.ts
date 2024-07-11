import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { filter } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private portal: any;

  constructor(private router: Router, private authService: AuthService, private translateService: TranslateService) {
    this.router.events
    .pipe(filter((event: any) => event instanceof NavigationEnd))
    .subscribe(async (event: NavigationEnd) => {
      if (event.url !== '/login') {
        this.portal = await this.authService.getPortalDetails();
        localStorage.setItem('portal', JSON.stringify(this.portal))
        this.translateService.use(this.portal.language);
        this.updateTheme(this.portal.data);
      }
    });
  }

  public getPortal() {
    return this.portal;
  }

  public updateTheme(colors: any) {
    document.documentElement.style.setProperty('--primary-color', colors.primary_color);
    document.documentElement.style.setProperty('--secondary-color', colors.secondary_color);
    document.documentElement.style.setProperty('--primary-light-color', colors.primary_light_color);
    document.documentElement.style.setProperty('--secondary-light-color', colors.secondary_light_color);
    document.documentElement.style.setProperty('--btn-txt', colors.btn_text_color);
    document.documentElement.style.setProperty('--menu-txt-color', colors.menu_text_color);
  }
}
