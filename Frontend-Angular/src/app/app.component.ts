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
      <main class="flex-grow">
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
  constructor(private router: Router) {}

  ngOnInit() {
    // Scroll to top on every successful navigation
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        window.scrollTo(0, 0);
      });
  }
}
