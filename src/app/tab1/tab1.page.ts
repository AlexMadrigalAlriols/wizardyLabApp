import { Component, OnInit } from '@angular/core';
import { AuthService } from '../-services/auth.service';
import { ThemeService } from '../-services/theme.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  constructor(private authService: AuthService, private themeService: ThemeService) {}

  async ngOnInit() {

  }

  logout() {
    this.authService.logout();
  }
}
