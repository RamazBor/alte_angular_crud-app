import { Routes } from '@angular/router';
import { UsersListComponent } from './components/users-list/users-list.component';
import { CreateEditUserComponent } from './components/create-edit-user/create-edit-user.component';

export const routes: Routes = [
  {
    path: '',
    component: UsersListComponent
  },
  {
    path: 'create-edit',
    component: CreateEditUserComponent
  },
  {
    path: 'create-edit/:id',
    component: CreateEditUserComponent
  }
];
