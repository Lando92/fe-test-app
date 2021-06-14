import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {UsersComponent} from './users.component';
import {UsersListPageComponent} from './pages/users-list-page/users-list-page.component';
import {CreateUserPageComponent} from './pages/create-user-page/create-user-page.component';


const routes: Routes = [
  {
    path: '', component: UsersComponent, children: [
      {
        path: '', component: UsersListPageComponent
      },
      {
        path: 'create', component: CreateUserPageComponent
      },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule {
}
