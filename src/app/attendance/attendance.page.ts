import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../-services/auth.service';
import { ThemeService } from '../-services/theme.service';
import * as L from 'leaflet';
import Swal from 'sweetalert2';
import * as $ from 'jquery';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { TimerService } from '../-services/timer.service';
import { LoadingController } from '@ionic/angular';
import { FrameworkService } from '../-services/framework.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-tab1',
  templateUrl: 'attendance.page.html',
  styleUrls: ['attendance.page.scss'],
  providers: [DatePipe]
})
export class AttendancePage implements OnInit {
  isModalOpen = false;
  currentDate: string;
  primary_color: string = '#3880ff';
  currentTime: string | null;
  currentDateLong: string | null;
  timer: string;
  timerSubscription?: Subscription;
  user: any;

  @ViewChild('mapContainer', { static: false }) mapContainer?: ElementRef;

  constructor(private authService: AuthService,
      private themeService: ThemeService,
      private datePipe: DatePipe,
      private timerService: TimerService,
      private loadingController: LoadingController,
      private framework: FrameworkService,
      private translateService: TranslateService
  ) {
    this.fixLeafletIcons();

    // Obtener la fecha y hora actual
    const now = new Date();
    this.currentDate = this.formatDate(now);
    this.timer = '00:00:00';
    this.currentTime = this.datePipe.transform(new Date(), 'hh:mm:ss a');
    this.currentDateLong = this.datePipe.transform(new Date(), 'dd MMM, yyyy');
  }

  ngOnInit(): void {
    const loading = this.loadingController.create();
    loading.then(loadingElement => {
      loadingElement.present();
    });

    let portal = JSON.parse(localStorage.getItem('portal') ?? '{}');
    this.user = JSON.parse(localStorage.getItem('user') ?? '{}');

    if(!this.user && !portal) {
      this.authService.getPortal().then(() => {
        this.user = JSON.parse(localStorage.getItem('user') ?? '{}');
        portal = JSON.parse(localStorage.getItem('portal') ?? '{}');
      },
      error => {
        this.authService.logout();
      });
    }

    this.timer = this.user.timer;
    this.primary_color = portal.data.primary_color;

    if(this.user.is_clockIn) {
      this.timerService.startTimer(this.timer);
      this.timerSubscription = this.timerService.getCurrentTime().subscribe(time => {
        this.timer = time;
      });
    }

    loading.then(loadingElement => {
      loadingElement.dismiss();
    });
  }

  openModal() {
    this.isModalOpen = true;
    this.initMap();
  }

  closeModal() {
    this.isModalOpen = false;
  }

  refresh(event: any) {
    setTimeout(() => {
      this.authService.getPortal().then(() => {
        this.user = JSON.parse(localStorage.getItem('user') ?? '{}');
        let portal = JSON.parse(localStorage.getItem('portal') ?? '{}');

        this.timer = this.user.timer;
        this.primary_color = portal.data.primary_color;
        if(this.user.is_clockIn) {
          this.timerService.startTimer(this.timer);
          this.timerSubscription = this.timerService.getCurrentTime().subscribe(time => {
            this.timer = time;
          });
        } else {
          this.timerService.stopTimer();
          this.timerSubscription?.unsubscribe();
          this.user.is_clockIn = false;
        }
      },
      error => {
        this.authService.logout();
      });

      event.target.complete();
    }, 1000);
  }

  clockIn() {
    const loading = this.loadingController.create();
    loading.then(loadingElement => {
      loadingElement.present();
    });

    const lat = $('#latitude').val();
    const lon = $('#longitude').val();

    this.framework.post('clock-in', {latitude: lat, longitude: lon}, true).subscribe((response: any) => {
      this.timerService.startTimer(this.timer);
      this.timerSubscription = this.timerService.getCurrentTime().subscribe(time => {
        this.timer = time;
      });
      this.user.is_clockIn = true;
      localStorage.setItem('user', JSON.stringify(this.user));
      loading.then(loadingElement => {
        loadingElement.dismiss();
      });
      this.isModalOpen = false;
      Swal.fire({
        toast: true,
        title: this.translateService.instant('clock_in_success'),
        icon: 'success',
        showConfirmButton: false,
        position: 'top-end',
        timer: 3000
      });
    },
    error => {
      loading.then(loadingElement => {
        loadingElement.dismiss();
      });

      Swal.fire({
        toast: true,
        title: this.translateService.instant('errors.clock_in'),
        icon: 'error',
        showConfirmButton: false,
        position: 'top-end',
        timer: 3000,
      });
    });
  }

  clockOut() {
    const loading = this.loadingController.create();
    loading.then(loadingElement => {
      loadingElement.present();
    });

    this.framework.post('clock-out', {}, true).subscribe((response: any) => {
      this.timerService.stopTimer();
      this.timerSubscription?.unsubscribe();
      this.user.is_clockIn = false;
      localStorage.setItem('user', JSON.stringify(this.user));
      loading.then(loadingElement => {
        loadingElement.dismiss();
      });
      Swal.fire({
        toast: true,
        title: this.translateService.instant('clock_out_success'),
        icon: 'success',
        showConfirmButton: false,
        position: 'top-end',
        timer: 3000
      });
    },
    error => {
      loading.then(loadingElement => {
        loadingElement.dismiss();
      });

      Swal.fire({
        toast: true,
        title: this.translateService.instant('errors.clock_out'),
        icon: 'error',
        showConfirmButton: false,
        position: 'top-end',
        timer: 3000,
      });
    });
  }

  initMap() {
    setTimeout(() => {
      if (this.mapContainer && this.mapContainer.nativeElement) {
        const map = L.map(this.mapContainer.nativeElement).setView([0, 0], 2); // Default coordinates
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const lat = position.coords.latitude;
              const lon = position.coords.longitude;
              map.setView([lat, lon], 17);

              L.marker([lat, lon])
                .addTo(map)
                .bindPopup(this.translateService.instant('ubication_pin_message'))
                .openPopup();

              $('#longitude').val(lon);
              $('#latitude').val(lat)
            },
            (error) => {
              Swal.fire({
                toast: true,
                title: 'Error with ubication',
                icon: 'error',
                showConfirmButton: false,
                position: 'top-end',
                timer: 3000,
              });
            }
          );


        } else {
          Swal.fire({
            toast: true,
            title: 'Geolocalización no soportada por este navegador',
            icon: 'error',
            showConfirmButton: false,
            position: 'top-end',
            timer: 3000,
          });
        }
      } else {
        console.error('Map container not found');
      }
    }, 100); // Delay to ensure the modal is fully open
  }

  fixLeafletIcons() {
    // @ts-ignore
    delete L.Icon.Default.prototype._getIconUrl;

    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'assets/leaflet/images/marker-icon-2x.png',
      iconUrl: 'assets/leaflet/images/marker-icon.png',
      shadowUrl: 'assets/leaflet/images/marker-shadow.png',
    });
  }

  private formatDate(date: Date): string {
    const day = this.padZero(date.getDate());
    const month = this.padZero(date.getMonth() + 1); // Los meses van de 0 a 11 en JavaScript
    const year = date.getFullYear();
    const hours = this.padZero(date.getHours());
    const minutes = this.padZero(date.getMinutes());

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  private padZero(num: number): string {
    return num < 10 ? `0${num}` : num.toString();
  }
}
