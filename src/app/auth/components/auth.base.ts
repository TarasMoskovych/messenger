import { FormGroup } from '@angular/forms';

export abstract class BaseAuth {
  loading = false;
  form: FormGroup;

  protected showLoader() {
    this.loading = true;
  }

  protected hideLoader() {
    this.loading = false;
  }

  protected enableForm() {
    this.form.enable();
  }

  protected disableForm() {
    this.form.disable();
  }

}
