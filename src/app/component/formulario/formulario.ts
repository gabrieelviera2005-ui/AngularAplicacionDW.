import { Component, computed, input, output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

interface FormOption {
  label: string;
  value: string | number;
}

interface FormField {
  key: string;
  label: string;
  type?: string;
  placeholder?: string;
  value?: string | number | null;
  options?: FormOption[];
}

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-formulario',
  styleUrl: './formulario.css',
  templateUrl: './formulario.html',
})
export class Formulario {
  fields = input<FormField[]>([]);
  submitForm = output<Record<string, string | number | null>>();

  form = computed(() => {
    const group: Record<string, FormControl<string | number | null>> = {};
    this.fields().forEach((field) => {
      const initialValue = field.value ?? '';
      group[field.key] = new FormControl<string | number | null>(initialValue, {
        validators: [Validators.required],
      });
    });
    return new FormGroup(group);
  });

  onSubmit() {
    const currentForm = this.form();
    if (currentForm.valid) {
      this.submitForm.emit(currentForm.getRawValue());
      currentForm.reset();
    }
  }
}
