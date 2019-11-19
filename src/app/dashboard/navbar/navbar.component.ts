import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ElectronService } from 'ngx-electron';

import { AuthService } from 'src/app/core/services';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent {
  isElectronApp = this.electronService.isElectronApp;

  constructor(
    private electronService: ElectronService,
    private authService: AuthService,
  ) { }

  logout() {
    this.authService.logout();
  }

}
