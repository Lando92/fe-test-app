import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {UsersRoutingModule} from './users-routing.module';
import {UsersComponent} from './users.component';
import {UsersListPageComponent} from './pages/users-list-page/users-list-page.component';
import {CreateUserPageComponent} from './pages/create-user-page/create-user-page.component';
import {BrowserModule} from '@angular/platform-browser';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {SharedModule} from '../../shared/shared.module';


@NgModule({
  declarations: [UsersComponent, UsersListPageComponent, CreateUserPageComponent],
  imports: [
    CommonModule,
    UsersRoutingModule,
    SharedModule
  ]
})
export class UsersModule {
}
