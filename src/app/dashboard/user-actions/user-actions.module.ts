import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';

import { UserActionsComponent } from './user-actions.component';
import {
  AddFriendComponent,
  GroupsComponent,
  FriendsComponent,
  ProfileComponent,
  RequestsComponent,
  LiveSearchComponent
} from './components';

@NgModule({
  declarations: [
    AddFriendComponent,
    FriendsComponent,
    ProfileComponent,
    RequestsComponent,
    LiveSearchComponent,
    UserActionsComponent,
    GroupsComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    UserActionsComponent
  ]
})
export class UserActionsModule { }
