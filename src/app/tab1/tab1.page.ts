import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../-services/auth.service';
import { ThemeService } from '../-services/theme.service';
import * as L from 'leaflet';
import Swal from 'sweetalert2';
import * as $ from 'jquery';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  isModalOpen = false;
  currentDate: string;

  @ViewChild('mapContainer', { static: false }) mapContainer?: ElementRef;

  constructor(private authService: AuthService, private themeService: ThemeService) {
    this.fixLeafletIcons();

    // Obtener la fecha y hora actual
    const now = new Date();

    // Formatear la fecha y hora como string en el formato deseado (dd/MM/yyyy HH:mm)
    this.currentDate = this.formatDate(now);
  }

  openModal() {
    this.isModalOpen = true;
    this.initMap();
  }

  closeModal() {
    this.isModalOpen = false;
  }

  clockIn() {
    console.log($('#longitude').val(), $('#latitude').val());
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
                .bindPopup('Tu ubicación actual')
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
