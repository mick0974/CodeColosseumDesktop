import { Directive, Input, HostListener } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Directive({
  selector: '[appFormSubmitValidationMsg]'
})
export class FormSubmitValidationMsgDirective {

  @Input() validationControl!: FormGroup;

  @HostListener('click', ["$event"])
  handleClickEvent() {
    this.markAsTouched(this.validationControl);
  }

  private markAsTouched(formGroup: FormGroup): void {
    formGroup.markAsTouched();
    formGroup.updateValueAndValidity();
    (<any>Object).values(formGroup.controls).forEach(
      control => {
        control.markAsTouched();
        control.updateValueAndValidity({ onlySelf: false, emitEvent: true });
        if (control.controls) {
          this.markAsTouched(control);
        }
      });
  }

}