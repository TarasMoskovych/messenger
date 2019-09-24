import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';

import { ChatComponent } from './chat.component';
import { TextboxComponent } from './components';

@NgModule({
  declarations: [
    ChatComponent,
    TextboxComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [ChatComponent]
})
export class ChatModule { }
