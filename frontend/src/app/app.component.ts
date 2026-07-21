import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { ToastContainerComponent } from './components/toast/toast-container.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NavbarComponent,
    FooterComponent,
    ToastContainerComponent
  ],
  template: `
    <div class="flex flex-col min-h-screen">
      <!-- Global Navbar -->
      <app-navbar></app-navbar>

      <!-- Main Content Outlet -->
      <main class="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <router-outlet></router-outlet>
      </main>

      <!-- Global Footer -->
      <app-footer></app-footer>

      <!-- Global Toast Container -->
      <app-toast-container></app-toast-container>
    </div>
  `
})
export class AppComponent implements OnInit {
  private previousPath = '';

  constructor(private router: Router) {}

  ngOnInit() {
    // Sadece farklı bir sayfa yoluna (path) gidildiğinde en üste kaydır, queryParams / sıralama değişimlerinde sayfa yerinde kalsın
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(event => {
        const currentPath = event.urlAfterRedirects.split('?')[0];
        if (currentPath !== this.previousPath) {
          this.previousPath = currentPath;
          window.scrollTo(0, 0);
        }
      });
  }
}
