import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { User } from '../../interfaces/user';
import { UserService } from '../../services/user.service';
import { Observable } from 'rxjs';
import { AsyncPipe, NgStyle } from '@angular/common';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [RouterLink, AsyncPipe, NgStyle],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss',
})
export class UsersListComponent {
  userService = inject(UserService);

  users$: Observable<User[]> = this.userService.getUsers();

  edit(id: number) {
    console.log(`Edit user ${id}`);
  }
  delete(id: number) {
    console.log(`Delete user ${id}`);
    this.userService.deleteUser(id).subscribe((res) => {
      console.log(res);
      this.users$ = this.userService.getUsers();
    });
  }
}
