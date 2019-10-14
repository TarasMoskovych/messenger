import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FriendDetailsComponent } from './components';
import { InformationComponent } from './information.component';

import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    InformationComponent,
    FriendDetailsComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [InformationComponent]
})
export class InformationModule { }
