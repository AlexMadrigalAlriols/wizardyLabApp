import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../-services/auth.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements AfterViewInit, OnInit {
  email: null|string = null;
  password: null|string = null;

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    if (this.email && this.password) {
      this.authService.login(this.email, this.password).then(success => {
        if (success) {
          this.router.navigate(['/tabs']);
        } else {
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
