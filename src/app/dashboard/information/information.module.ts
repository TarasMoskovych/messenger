import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FriendDetailsComponent, GroupDetailsComponent, MembersComponent, NotificationsComponent } from './components';
import { InformationComponent } from './information.component';
import { VideoCallComponent } from 'src/app/shared/components';

import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    InformationComponent,
    FriendDetailsComponent,
    GroupDetailsComponent,
    MembersComponent,
    NotificationsComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  entryComponents: [
    MembersComponent,
    VideoCallComponent
  ],
  exports: [InformationComponent]
})
export class InformationModule { }
