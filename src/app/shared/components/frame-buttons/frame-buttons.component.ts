import { Component, ChangeDetectionStrategy, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { ElectronService } from 'ngx-electron';

@Component({
  selector: 'app-frame-buttons',
  templateUrl: './frame-buttons.component.html',
  styleUrls: ['./frame-buttons.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FrameButtonsComponent implements OnInit {
  @Input() primary = false;

  private window: Electron.BrowserWindow = null;

  isElectronApp = this.electronService.isElectronApp;
  fullScreen = false;

  constructor(private electronService: ElectronService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    if (this.isElectronApp) { this.electronOnInit(); }
  }

  electronOnInit() {
    this.getRemoteWindow();
    this.onWindowChange();
  }

  onMinimize() {
    this.window && this.window.minimize();
  }

  onMaximize() {
    if (this.window) {
      this.window.setFullScreen(!this.window.isFullScreen());
      this.fullScreen = this.window.isFullScreen();
    }
  }

  onClose() {
    this.window && this.window.close();
  }

  private getRemoteWindow() {
    this.window = this.electronService.remote.getCurrentWindow();
    this.fullScreen = this.window.isFullScreen();
  }

  private onWindowChange() {
    this.electronService.ipcRenderer.on('window:change', (e, isFullScreen: boolean) => {
      this.fullScreen = isFullScreen;
      this.cdr.detectChanges();
    });
  }
}
