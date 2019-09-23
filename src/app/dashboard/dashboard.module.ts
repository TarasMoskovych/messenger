import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashBoardRoutingModule } from './dashboard-routing.module';
import { SharedModule } from '../shared/shared.module';
import { UserActionsModule } from './user-actions/user-actions.module';

import { DashboardComponent } from './dashboard.component';
import { NavbarComponent } from './navbar/navbar.component';
import { UserActionsComponent } from './user-actions/user-actions.component';

@NgModule({
  declarations: [
    DashboardComponent,
    NavbarComponent,
    UserActionsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    UserActionsModule,
    DashBoardRoutingModule
  ]
})
export class DashboardModule { }
