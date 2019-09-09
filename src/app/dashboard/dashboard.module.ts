import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashBoardRoutingModule } from './dashboard-routing.module';
import { SharedModule } from '../shared/shared.module';

import { DashboardComponent } from './dashboard.component';
import { NavbarComponent, SidebarComponent, ProfileComponent } from './components';

@NgModule({
  declarations: [
    DashboardComponent,
    NavbarComponent,
    SidebarComponent,
    ProfileComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    DashBoardRoutingModule
  ]
})
export class DashboardModule { }
