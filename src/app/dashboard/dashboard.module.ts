import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashBoardRoutingModule } from './dashboard-routing.module';
import { SharedModule } from '../shared/shared.module';

import { DashboardComponent } from './dashboard.component';
import {
  AddFriendComponent,
  NavbarComponent,
  SidebarComponent,
  ProfileComponent,
  RequestsComponent
} from './components';

@NgModule({
  declarations: [
    AddFriendComponent,
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
