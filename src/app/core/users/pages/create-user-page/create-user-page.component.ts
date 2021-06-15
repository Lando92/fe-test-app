import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ValidateString} from '../../utils/helpers';
import {debounceTime, switchMap, takeUntil, tap} from 'rxjs/internal/operators';
import {Subject} from 'rxjs';
import {UsersService} from '../../services/users.service';
import {UserNameQuery, UsersQuery} from '../../models/user-query';
import {Router} from '@angular/router';
import {ToasterService} from '../../../../shared/services/toaster.service';

@Component({
  selector: 'exads-create-user-page',
  templateUrl: './create-user-page.component.html',
  styleUrls: ['./create-user-page.component.scss']
})
export class CreateUserPageComponent implements OnInit, OnDestroy {
  createUserForm: FormGroup;
  private $componentDestroyed = new Subject();
  duplicatedUserName: boolean;

  constructor(private usersService: UsersService, private router: Router, private toaster: ToasterService) {
  }

  ngOnInit() {
    this.createUserForm = new FormGroup({
      username: new FormControl('', [Validators.maxLength(20), Validators.minLength(3), ValidateString]),
      first_name: new FormControl(''),
      last_name: new FormControl(''),
      email: new FormControl('', [Validators.pattern('^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$')]),
    });

    this.createUserForm.controls.username.valueChanges.pipe(
      debounceTime(500),
      switchMap(value => {
        const query: UserNameQuery = {username: value};
        return this.usersService.getUsers(query)
      }),
      tap(res => {
        if (res.length) {
          this.duplicatedUserName = true
          this.createUserForm.controls.username.setErrors({duplicated: true})
        } else {
          this.duplicatedUserName = false
          if (this.createUserForm.controls.username.invalid && this.createUserForm.controls.username.hasError('duplicated'))
            this.createUserForm.controls.username.setErrors(null)
        }
      }),
      takeUntil(this.$componentDestroyed),
    ).subscribe();
  }

  createNewUser() {
    const user = {...this.createUserForm.getRawValue(), id_status: 1};
    this.usersService.createUsers({user}).pipe(
      tap(res => {
        this.toaster.showSuccessToaster('User created successfully');
        this.router.navigate(['/users'])
      })
    ).subscribe()
  }

  ngOnDestroy(): void {
    this.$componentDestroyed.next();
    this.$componentDestroyed.unsubscribe();
  }

}
