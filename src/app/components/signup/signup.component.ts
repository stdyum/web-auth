import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilderComponent, FormConfig, sendHttpRequestAndSubscribe } from '@likdan/form-builder-core';
import { Buttons, Controls } from '@likdan/form-builder-material';
import { Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { pipe, tap } from 'rxjs';
import { Oauth2Component } from '../oauth2/oauth2.component';
import { TranslationPipe, TranslationService } from '@likdan/studyum-core';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    FormBuilderComponent,
    RouterLink,
    Oauth2Component,
    TranslationPipe
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupComponent {
  private translationService = inject(TranslationService);
  private router = inject(Router);

  config = <FormConfig<any>>{
    controls: {
      login: {
        type: Controls.textInput,
        label: this.translationService.getTranslation('signup_form_login'),
        validators: [Validators.required],
      },
      email: {
        type: Controls.textInput,
        label: this.translationService.getTranslation('signup_form_email'),
        validators: [Validators.required, Validators.email],
      },
      password: {
        type: Controls.textInput,
        label: this.translationService.getTranslation('signup_form_password'),
        additionalFields: {
          type: 'password',
        },
        validators: [Validators.required],
      },
      repeatedPassword: {
        type: Controls.textInput,
        label: this.translationService.getTranslation('signup_form_repeat_password'),
        additionalFields: {
          type: 'password',
        },
        validators: [Validators.required],
      },
    },
    submit: {
      button: Buttons.Submit.Flat,
      buttonText: this.translationService.getTranslation('signup_form_submit'),
      onSubmit: sendHttpRequestAndSubscribe({
        url: 'api/auth/v1/signup',
        method: 'POST',
        pipeline: pipe(tap(() => this.router.navigate(['/login']))),
      }),
    },
  };
}
