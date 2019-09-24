import { Component, ChangeDetectionStrategy } from '@angular/core';

import { AuthService } from 'src/app/core/services';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent {

  constructor(private authService: AuthService) { }

  logout() {
    this.authService.logout();
  }

}
