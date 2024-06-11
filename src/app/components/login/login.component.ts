import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilderComponent, FormConfig, sendHttpRequestAndSubscribe } from '@likdan/form-builder-core';
import { Buttons, Controls } from '@likdan/form-builder-material';
import { Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { pipe, tap } from 'rxjs';
import { RedirectService, TranslationPipe, TranslationService } from '@likdan/studyum-core';
import { MatButton } from '@angular/material/button';
import { Oauth2Component } from '../oauth2/oauth2.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormBuilderComponent,
    RouterLink,
    MatButton,
    MatIcon,
    Oauth2Component,
    TranslationPipe,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private translationService = inject(TranslationService);
  private redirect = inject(RedirectService);

  config = <FormConfig<any>>{
    controls: {
      login: {
        type: Controls.textInput,
        label: this.translationService.getTranslation('login_form_login'),
        validators: [Validators.required],
      },
      password: {
        type: Controls.textInput,
        label: this.translationService.getTranslation('login_form_password'),
        additionalFields: {
          type: 'password',
        },
        validators: [Validators.required],
      },
      sessionExpirationAt: {
        type: Controls.datetime,
        label: this.translationService.getTranslation('login_form_session_expiration_at'),
      },
    },
    submit: {
      button: Buttons.Submit.Flat,
      buttonText: this.translationService.getTranslation('login_form_submit'),
      onSubmit: sendHttpRequestAndSubscribe({
        url: 'api/sso/v1/login',
        method: 'POST',
        pipeline: pipe(tap(() => this.redirect.redirect(''))),
      }, event => {
        const sessionExpirationAtDate: Date = event.value.sessionExpirationAt.date;
        const sessionExpirationAtTime = event.value.sessionExpirationAt.time;
        sessionExpirationAtDate.setHours(sessionExpirationAtTime.hour, sessionExpirationAtTime.minute);

        event.value.sessionExpirationAt = sessionExpirationAtDate;
        return event.value;
      }),
    },
  };
}
