import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'oauth2',
  standalone: true,
  imports: [
    MatButton,
    MatIcon,
    MatIcon,
  ],
  templateUrl: './oauth2.component.html',
  styleUrl: './oauth2.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Oauth2Component {
  oauth2(provider: string): void {
    window.location.href = `https://api-auth.studyum.net/api/v1/auth/oauth2/${provider}`
  }
}
