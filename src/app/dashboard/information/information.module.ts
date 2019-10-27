import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FriendDetailsComponent, GroupDetailsComponent, MembersComponent } from './components';
import { InformationComponent } from './information.component';

import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    InformationComponent,
    FriendDetailsComponent,
    GroupDetailsComponent,
    MembersComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  entryComponents: [
    MembersComponent
  ],
  exports: [InformationComponent]
})
export class InformationModule { }
