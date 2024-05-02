import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilderComponent, FormConfig, sendHttpRequestAndSubscribe } from '@likdan/form-builder-core';
import { Buttons, Controls } from '@likdan/form-builder-material';
import { Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { pipe, tap } from 'rxjs';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    FormBuilderComponent,
    RouterLink,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupComponent {
  private router = inject(Router);

  config = <FormConfig<any>>{
    controls: {
      login: {
        type: Controls.textInput,
        label: 'Login',
        validators: [Validators.required],
      },
      email: {
        type: Controls.textInput,
        label: 'Email',
        validators: [Validators.required, Validators.email],
      },
      password: {
        type: Controls.textInput,
        label: 'Password',
        additionalFields: {
          type: 'password',
        },
        validators: [Validators.required],
      },
      repeatedPassword: {
        type: Controls.textInput,
        label: 'Repeat password',
        additionalFields: {
          type: 'password',
        },
        validators: [Validators.required],
      },
    },
    submit: {
      button: Buttons.Submit.Flat,
      buttonText: 'Submit',
      onSubmit: sendHttpRequestAndSubscribe({
        url: 'api/auth/v1/signup',
        method: 'POST',
        pipeline: pipe(tap(() => this.router.navigate(['/login']))),
      }),
    },
  };
}
