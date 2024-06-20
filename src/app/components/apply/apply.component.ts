import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilderComponent, FormConfig, sendHttpRequestAndSubscribe } from '@likdan/form-builder-core';
import { Buttons, Controls } from '@likdan/form-builder-material';
import { Validators } from '@angular/forms';
import { Observable, pipe, tap } from 'rxjs';
import {
  RedirectService,
  RegistryService,
  StudyPlacesService,
  TranslationPipe,
  TranslationService,
} from '@likdan/studyum-core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
  selectedRowItems = signal<Object>([]);

  private studyPlacesService = inject(StudyPlacesService);
  private registry = inject(RegistryService);
  private redirect = inject(RedirectService);
  private translationService = inject(TranslationService);

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
          let config: Object = {};
          switch (v) {
            case 'teacher':
              config = this.registry.getTeachersPaginatedSelectConfig();
              break;
            case 'student':
              config = this.registry.getStudentsPaginatedSelectConfig();
              break;
            default:
              return;
          }

          ((config as any)['items'] as Observable<any[]>)
            .pipe(takeUntilDestroyed())
            .subscribe(i => this.selectedRowItems.set({ ...config, items: i }));
        },
        validators: [Validators.required],
      },
      typeId: {
        type: Controls.select,
        label: this.translationService.getTranslation('apply_form_type'),
        additionalFields: {
          searchable: true,
          searchInputText: this.translationService.getTranslation('controls_select_search'),
          loadNextButtonText: this.translationService.getTranslation('controls_select_load_next'),
          items: computed(() => (this.selectedRowItems() as any)['items']),
          next: computed(() => (this.selectedRowItems() as any)['next']),
          reload: computed(() => (this.selectedRowItems() as any)['reload']),
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
