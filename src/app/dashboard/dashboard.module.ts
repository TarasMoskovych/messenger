import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';
import { ChatModule } from './chat/chat.module';
import { InformationModule } from './information/information.module';
import { UserActionsModule } from './user-actions/user-actions.module';

import { DashBoardRoutingModule } from './dashboard-routing.module';

import { DashboardComponent } from './dashboard.component';
import { NavbarComponent } from './navbar/navbar.component';

@NgModule({
  declarations: [
    DashboardComponent,
    NavbarComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ChatModule,
    InformationModule,
    UserActionsModule,
    DashBoardRoutingModule
  ]
})
export class DashboardModule { }
