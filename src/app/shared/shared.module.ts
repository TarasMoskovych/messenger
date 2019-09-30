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

@NgModule({
  declarations: [
    LoaderComponent,
    InputBoxComponent
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
    InputBoxComponent
  ]
})
export class SharedModule { }
