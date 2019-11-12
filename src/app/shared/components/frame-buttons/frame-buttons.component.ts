import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { ElectronService } from 'ngx-electron';

@Component({
  selector: 'app-frame-buttons',
  templateUrl: './frame-buttons.component.html',
  styleUrls: ['./frame-buttons.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FrameButtonsComponent {
  @Input() primary = false;

  isElectronApp = this.electronService.isElectronApp;

  constructor(private electronService: ElectronService) { }

  onMinimize() {
    this.emitFrameAction('minimize');
  }

  onMaximize() {
    this.emitFrameAction('maximize');
  }

  onClose() {
    this.emitFrameAction('close');
  }

  private emitFrameAction(type: string) {
    if (this.isElectronApp) {
      this.electronService.ipcRenderer.send('frame:actions', { type });
    } else {
      console.warn('Not electron application!');
    }
  }

}
