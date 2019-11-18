import { Directive, Output, EventEmitter, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[appDragDrop]'
})
export class DragAndDropDirective {
  @Output() onFileDropped = new EventEmitter<any>();

  @HostBinding('style.outline') outline = 'none';

  //Dragover listener
  @HostListener('dragover', ['$event']) onDragOver(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.outline = '2px dashed #3F51B5';
  }

  //Dragleave listener
  @HostListener('dragleave', ['$event']) public onDragLeave(evt) {
    evt.preventDefault();
    evt.stopPropagation();

    this.outline = 'none';
  }

  //Drop listener
  @HostListener('drop', ['$event']) public ondrop(evt) {
    evt.preventDefault();
    evt.stopPropagation();

    this.outline = 'none';

    const files = evt.dataTransfer.files;

    if (files.length > 0) {
      this.onFileDropped.emit(files);
    }
  }

}
