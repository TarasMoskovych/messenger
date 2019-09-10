import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-input-box',
  templateUrl: './input-box.component.html',
  styleUrls: ['./input-box.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputBoxComponent {
  @Input() autofocus = false;
  @Input() form: FormGroup;
  @Input() path: string;
  @Input() placeholder: string;
  @Input() position = 'left';
  @Input() type = 'text';
  @Input() width = '100%';
}
