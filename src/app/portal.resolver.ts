import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './-services/auth.service';
import { ThemeService } from './-services/theme.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class PortalResolver implements Resolve<any> {

  constructor(private authService: AuthService, private themeService: ThemeService, private translateService: TranslateService) {}

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
    const portal = await this.authService.getPortalDetails();
    localStorage.setItem('portal', JSON.stringify(portal));
    this.themeService.updateTheme(portal.data);
    this.translateService.use(portal.language);
  }
}
