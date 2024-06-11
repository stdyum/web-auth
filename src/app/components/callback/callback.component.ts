import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { RedirectService } from '@likdan/studyum-core';
import { AuthService } from '@likdan/studyum-core';

@Component({
  selector: 'callback',
  standalone: true,
  imports: [],
  templateUrl: './callback.component.html',
  styleUrl: './callback.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CallbackComponent {
  private route = inject(ActivatedRoute);
  private redirect = inject(RedirectService);
  private authService = inject(AuthService);

  constructor() {
    this.route.queryParams
      .pipe(switchMap(p => this.authService.saveTokens(p)))
      .subscribe(() => this.redirect.redirect());
  }
}
