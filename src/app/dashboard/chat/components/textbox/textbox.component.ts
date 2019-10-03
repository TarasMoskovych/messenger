import { Component, ChangeDetectionStrategy, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { EmojiEvent } from '@ctrl/ngx-emoji-mart/ngx-emoji/public_api';

import { appConfig } from 'src/app/configs';

@Component({
  selector: 'app-textbox',
  templateUrl: './textbox.component.html',
  styleUrls: ['./textbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextboxComponent {
  @Output() sendMessage = new EventEmitter<string>();
  @ViewChild('field', { static: false }) private textarea: ElementRef;

  maxLength = appConfig.textBoxLength;
  message = '';
  showEmojiPicker = false;

  onAddEmoji(event: EmojiEvent) {
    const { message } = this;
    const text = `${message}${event.emoji.native}`;

    this.message = text;
    this.textarea.nativeElement.focus();
    this.showEmojiPicker = false;
  }

  onSendMessage(event?: KeyboardEvent) {
    event && event.preventDefault();

    const msg = this.message.trim();

    if (msg.length) {
      this.sendMessage.emit(msg);
      this.message = '';
    }
  }

  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }
}
