import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilderComponent, FormConfig, sendHttpRequestAndSubscribe } from '@likdan/form-builder-core';
import { Buttons, Controls } from '@likdan/form-builder-material';
import { Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { pipe, tap } from 'rxjs';
import { RedirectService } from '@likdan/studyum-core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormBuilderComponent,
    RouterLink,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  config = <FormConfig<any>>{
    controls: {
      login: {
        type: Controls.textInput,
        label: 'Login',
        validators: [Validators.required],
      },
      password: {
        type: Controls.textInput,
        label: 'Password',
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
        url: 'api/sso/v1/login',
        method: 'POST',
        pipeline: pipe(tap(() => this.redirect.redirect(''))),
      }),
    },
  };
  private redirect = inject(RedirectService);
}
