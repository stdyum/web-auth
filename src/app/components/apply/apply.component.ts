import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilderComponent, FormConfig, sendHttpRequestAndSubscribe } from '@likdan/form-builder-core';
import { Buttons, Controls } from '@likdan/form-builder-material';
import { Validators } from '@angular/forms';
import { pipe, take, tap } from 'rxjs';
import {
  RedirectService,
  StudentsService,
  StudyPlacesService,
  TeachersService,
  TranslationPipe,
  TranslationService,
} from '@likdan/studyum-core';

@Component({
  selector: 'app-apply',
  standalone: true,
  imports: [
    FormBuilderComponent,
    TranslationPipe,
  ],
  templateUrl: './apply.component.html',
  styleUrl: './apply.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApplyComponent {
  private studyPlacesService = inject(StudyPlacesService);

  private studentsService = inject(StudentsService);
  private teachersService = inject(TeachersService);

  private redirect = inject(RedirectService);
  private translationService = inject(TranslationService);

  private types = signal<any[]>([]);
  private studyPlaceId = signal<string>('');

  config = <FormConfig<any>>{
    controls: {
      userName: {
        type: Controls.textInput,
        label: this.translationService.getTranslation('apply_form_username'),
        validators: [Validators.required],
      },
      studyPlaceId: {
        type: Controls.select,
        label: this.translationService.getTranslation('apply_form_studyplace'),
        additionalFields: {
          searchable: false,
          items: this.studyPlacesService.loadStudyplacesForSelect(),
        },
        valueChanges: this.studyPlaceId.set.bind(this.studyPlaceId),
        validators: [Validators.required],
      },
      role: {
        type: Controls.select,
        label: this.translationService.getTranslation('apply_form_role'),
        additionalFields: {
          searchable: false,
          items: computed(() => [
            { value: 'teacher', display: this.translationService.getTranslation('apply_form_role_teacher')() },
            { value: 'student', display: this.translationService.getTranslation('apply_form_role_student')() },
            { value: 'stuff', display: this.translationService.getTranslation('apply_form_role_stuff')() },
          ]),
        },
        valueChanges: v => {
          this.types.set([]);
          switch (v) {
            case 'teacher':
              this.teachersService.loadForSelect(null, this.studyPlaceId())
                .pipe(take(1))
                .subscribe(this.types.set.bind(this.types));
              break;
            case 'student':
              this.studentsService.loadForSelect(null, this.studyPlaceId())
                .pipe(take(1))
                .subscribe(this.types.set.bind(this.types));
              break;
          }
        },
        validators: [Validators.required],
      },
      typeId: {
        type: Controls.select,
        label: this.translationService.getTranslation('apply_form_type'),
        additionalFields: {
          searchable: false,
          items: this.types,
        },
      },
    },
    submit: {
      button: Buttons.Submit.Flat,
      buttonText: this.translationService.getTranslation('apply_form_submit'),
      onSubmit: sendHttpRequestAndSubscribe({
        url: 'api/studyplaces/v1/enrollments',
        method: 'POST',
        pipeline: pipe(tap(() => this.redirect.redirect(''))),
      }),
    },
  };
}
