import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PickerModule } from '@ctrl/ngx-emoji-mart';

import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { LightboxModule } from 'ngx-lightbox';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { MaterialModule } from './../material/material.module';
import { FrameButtonsComponent, LoaderComponent, InputBoxComponent } from './components';
import { RelativeDatePipe, SmartDatePipe } from './pipes';
import { DragAndDropDirective } from './directives';

@NgModule({
  declarations: [
    FrameButtonsComponent,
    LoaderComponent,
    InputBoxComponent,
    RelativeDatePipe,
    SmartDatePipe,
    DragAndDropDirective
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
    InfiniteScrollModule,
    PickerModule
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    FlexLayoutModule,
    MaterialModule,
    NgxSkeletonLoaderModule,
    LightboxModule,
    InfiniteScrollModule,
    FrameButtonsComponent,
    LoaderComponent,
    InputBoxComponent,
    RelativeDatePipe,
    SmartDatePipe,
    PickerModule,
    DragAndDropDirective
  ]
})
export class SharedModule { }
