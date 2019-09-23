import { Component, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-textbox',
  templateUrl: './textbox.component.html',
  styleUrls: ['./textbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextboxComponent {
  @Output() sendMessage = new EventEmitter<string>();

  maxLength = 100;
  message: string;

  onSendMessage() {
    const msg = this.message.trim();
    if (msg.length) {
      this.sendMessage.emit(msg);
      this.message = '';
    }
  }

}
