import { AsyncPipe, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  inject,
} from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import { User } from '../../interfaces/user';
import {
  Observable,
  Subject,
  map,
  share,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';

@Component({
  selector: 'app-create-edit-user',
  standalone: true,
  imports: [ReactiveFormsModule, AsyncPipe, RouterLink, NgIf],
  templateUrl: './create-edit-user.component.html',
  styleUrl: './create-edit-user.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateEditUserComponent implements OnDestroy {
  userService: UserService = inject(UserService);
  router: Router = inject(Router);
  route: ActivatedRoute = inject(ActivatedRoute);

  positions: Array<string> = [
    'Developer Intern',
    'Junior Developer',
    'Middle Developer',
    'Senior Developer',
    'Tech Team Lead',
  ];

  form: FormGroup = new FormGroup({
    id: new FormControl<number | undefined | null>(null),
    name: new FormControl<string | undefined | null>(null, [Validators.required, Validators.minLength(5)]),
    surname: new FormControl<string | undefined | null>(
      null,
      [Validators.required, Validators.minLength(6)]
    ),
    birthDate: new FormControl<Date | undefined | null>(
      null,
      Validators.required
    ),
    mobile: new FormControl<number | undefined | null>(null, [
      Validators.required,
      Validators.pattern("[0-9]{3}-[0-9]{3}")
    ]),
    address: new FormGroup({
      city: new FormControl<string | undefined | null>(
        null,
        Validators.required
      ),
      street: new FormControl<string | undefined | null>(
        null,
        Validators.required
      ),
    }),
    skills: new FormArray([
      new FormControl<string | undefined | null>(null, Validators.required),
    ]),
    workExperience: new FormArray([]),
  });

  addSkill() {
    (<FormArray>this.form.get('skills')).push(
      new FormControl<string | undefined | null>(null, Validators.required)
    );
  }

  deleteSkill(index: number) {
    const controls = <FormArray>this.form.get('skills');
    controls.removeAt(index);
  }

  addExperience() {
    const frmgroup: FormGroup = new FormGroup({
      place: new FormControl<string | undefined | null>(
        null,
        Validators.required
      ),
      position: new FormControl<string | undefined | null>(
        null,
        Validators.required
      ),
      start: new FormControl<Date | undefined | null>(
        null,
        Validators.required
      ),
      end: new FormControl<Date | undefined | null>(null),
    });

    (<FormArray>this.form.get('workExperience')).push(frmgroup);
  }

  deleteExperience(index: number) {
    const frmArray = <FormArray>this.form.get('workExperience');
    frmArray.removeAt(index);
  }

  user$: Observable<User> = this.route.params.pipe(
    map((params: Params) => params['id']),
    switchMap((id: number) =>
      this.userService.getUser(id).pipe(
        tap((user: User) => {
          if (!user) return;

          const skillsLength: number = user.skills.length - 1;
          for (let i = 0; i < skillsLength; i++) {
            this.addSkill();
          }

          const workExperienceLength: number = user.workExperience.length;
          for (let i = 0; i < workExperienceLength; i++) {
            this.addExperience();
          }

          this.form.patchValue(user);
        })
      )
    ),
    share()
  );

  sub$: Subject<any> = new Subject();

  onSubmit() {
    if (this.form.invalid) {
      alert('Invalid form!');
      this.form.markAllAsTouched()
      return;
    }

    const {
      id,
      name,
      surname,
      birthDate,
      mobile,
      address,
      skills,
      workExperience,
    } = this.form.value;

    if (id) {
      this.userService
        .updateUser({
          id,
          name,
          surname,
          birthDate,
          mobile,
          address,
          skills,
          workExperience,
        } as User)
        .pipe(takeUntil(this.sub$))
        .subscribe((res: User) => {
          this.router.navigate(['/']);
          alert('User Updated Successfully!');
        });
      return;
    } else {
      const randomId = Math.floor(Math.random() * 1000);
      const user: User = {
        id: randomId,
        name,
        surname,
        birthDate,
        mobile,
        address,
        skills,
        workExperience,
      } as User;

      this.userService
        .createUser(user)
        .pipe(takeUntil(this.sub$))
        .subscribe((res: User) => {
          console.log(res);
          alert('User Created Successfully!');
          this.router.navigate(['/']);
        });
    }
  }

  ngOnDestroy(): void {
    this.sub$.next(null);
    this.sub$.complete();
  }
}
