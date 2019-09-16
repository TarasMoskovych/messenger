import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashBoardRoutingModule } from './dashboard-routing.module';
import { SharedModule } from '../shared/shared.module';

import { DashboardComponent } from './dashboard.component';
import {
  AddFriendComponent,
  FriendsComponent,
  NavbarComponent,
  SidebarComponent,
  ProfileComponent,
  RequestsComponent
} from './components';

@NgModule({
  declarations: [
    AddFriendComponent,
    FriendsComponent,
    DashboardComponent,
    NavbarComponent,
    SidebarComponent,
    ProfileComponent,
    RequestsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    DashBoardRoutingModule
  ]
})
export class DashboardModule { }
