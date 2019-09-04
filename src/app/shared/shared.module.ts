import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MaterialModule } from './../material/material.module';
import { LoaderComponent } from './components/loader/loader.component';
import { InputBoxComponent } from './components/input-box/input-box.component';

@NgModule({
  declarations: [LoaderComponent, InputBoxComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    FlexLayoutModule,
    MaterialModule
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    FlexLayoutModule,
    MaterialModule,
    LoaderComponent,
    InputBoxComponent
  ]
})
export class SharedModule { }
