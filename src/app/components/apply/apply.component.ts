import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilderComponent, FormConfig, sendHttpRequestAndSubscribe } from '@likdan/form-builder-core';
import { Buttons, Controls } from '@likdan/form-builder-material';
import { Validators } from '@angular/forms';
import { pipe, take, tap } from 'rxjs';
import { RedirectService, StudentsService, StudyPlacesService, TeachersService } from '@likdan/studyum-core';

@Component({
  selector: 'app-apply',
  standalone: true,
  imports: [
    FormBuilderComponent,
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

  private types = signal<any[]>([]);
  private studyPlaceId = signal<string>('');

  config = <FormConfig<any>>{
    controls: {
      userName: {
        type: Controls.textInput,
        label: 'User name',
        validators: [Validators.required],
      },
      studyPlaceId: {
        type: Controls.select,
        label: 'Study Place',
        additionalFields: {
          searchable: false,
          items: this.studyPlacesService.loadStudyplacesForSelect(),
        },
        valueChanges: this.studyPlaceId.set.bind(this.studyPlaceId),
        validators: [Validators.required],
      },
      role: {
        type: Controls.select,
        label: 'Role',
        additionalFields: {
          searchable: false,
          items: [
            { value: 'teacher', display: 'Teacher' },
            { value: 'student', display: 'Student' },
            { value: 'stuff', display: 'Stuff' },
          ],
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
        label: 'Type',
        additionalFields: {
          searchable: false,
          items: this.types,
        },
      },
    },
    submit: {
      button: Buttons.Submit.Flat,
      buttonText: 'Submit',
      onSubmit: sendHttpRequestAndSubscribe({
        url: 'api/studyplaces/v1/enrollments',
        method: 'POST',
        pipeline: pipe(tap(() => this.redirect.redirect(''))),
      }),
    },
  };
}
