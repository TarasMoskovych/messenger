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

  isElectronApp = this.electronService.isElectronApp;
  fullScreen = false;

  constructor(private electronService: ElectronService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.onWindowStateInit();
  }

  onMinimize() {
    this.emitFrameAction('minimize');
  }

  onMaximize() {
    this.fullScreen = !this.fullScreen;
    this.emitFrameAction('maximize');
  }

  onClose() {
    this.emitFrameAction('close');
  }

  private onWindowStateInit() {
    if (this.isElectronApp) {
      this.electronService.ipcRenderer.on('window:state', (e, fullScreen: boolean) => {
        this.fullScreen = fullScreen;
        this.cdr.detectChanges();
      });
    }
  }

  private emitFrameAction(type: string) {
    if (this.isElectronApp) {
      this.electronService.ipcRenderer.send('frame:actions', { type });
    } else {
      console.warn('Not electron application!');
    }
  }

}
