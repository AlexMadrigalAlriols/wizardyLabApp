import { Component } from '@angular/core';
import { ThemeService } from '../-services/theme.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(private themeService: ThemeService) {}

}
