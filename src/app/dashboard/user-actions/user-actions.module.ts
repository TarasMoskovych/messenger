import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';

import {
  AddFriendComponent,
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
    LiveSearchComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    AddFriendComponent,
    FriendsComponent,
    ProfileComponent,
    RequestsComponent,
    LiveSearchComponent
  ]
})
export class UserActionsModule { }
