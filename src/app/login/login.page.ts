import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../-services/auth.service';
import { LoadingController } from '@ionic/angular';
import * as $ from 'jquery';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements AfterViewInit, OnInit {
  email: null|string = null;
  password: null|string = null;

  constructor(private authService: AuthService, private router: Router, private loadingController: LoadingController) {}

  async onLogin() {
    const loading = await this.loadingController.create();
    await loading.present();
    if (this.email && this.password) {
      this.authService.login(this.email, this.password).then(success => {
        if (success) {
          loading.dismiss();
          this.router.navigate(['/tabs']);
        } else {
          loading.dismiss();
          $('#login-container').addClass('error');
          $('#error-container').removeClass('d-none')
        }
      });
    }
  }

  ngOnInit(): void {
    if(this.authService.checkAuthenticated()) {
      this.router.navigate(['/tabs']);
    }
  }

  ngAfterViewInit(): void {
    const inputs = $('.login-input');

    inputs.on('focus', function() {
      const parent = $(this).parent().parent();
      parent.addClass('focus');
    });

    inputs.on('blur', function() {
      const parent = $(this).parent().parent();
      if ($(this).val() === '') {
        parent.removeClass('focus');
      }
    });
  }
}
