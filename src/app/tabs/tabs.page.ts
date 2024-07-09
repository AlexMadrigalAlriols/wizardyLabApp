import { Component } from '@angular/core';
import { ThemeService } from '../-services/theme.service';
import { AuthService } from '../-services/auth.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(private themeService: ThemeService, private authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
}
