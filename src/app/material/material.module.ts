import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatLineModule,
  MatListModule,
  MatExpansionModule,
  MatToolbarModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatIconModule,
  MatDialogModule,
  MatTooltipModule,
  MatTabsModule,
  MatSnackBarModule,
  MatProgressSpinnerModule
} from '@angular/material';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatButtonModule,
    MatCheckboxModule,
    MatLineModule,
    MatListModule,
    MatExpansionModule,
    MatToolbarModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatDialogModule,
    MatTooltipModule,
    MatTabsModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  exports: [
    MatButtonModule,
    MatCheckboxModule,
    MatLineModule,
    MatListModule,
    MatExpansionModule,
    MatToolbarModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatDialogModule,
    MatTooltipModule,
    MatTabsModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ]
})
export class MaterialModule { }
