import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { LightboxModule } from 'ngx-lightbox';
import { NgScrollbarModule } from 'ngx-scrollbar';

import { MaterialModule } from './../material/material.module';
import { LoaderComponent, InputBoxComponent } from './components';
import { RelativeDatePipe, SmartDatePipe } from './pipes';

@NgModule({
  declarations: [
    LoaderComponent,
    InputBoxComponent,
    RelativeDatePipe,
    SmartDatePipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    FlexLayoutModule,
    MaterialModule,
    NgxSkeletonLoaderModule,
    LightboxModule,
    NgScrollbarModule
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    FlexLayoutModule,
    MaterialModule,
    NgxSkeletonLoaderModule,
    LightboxModule,
    NgScrollbarModule,
    LoaderComponent,
    InputBoxComponent,
    RelativeDatePipe,
    SmartDatePipe
  ]
})
export class SharedModule { }
