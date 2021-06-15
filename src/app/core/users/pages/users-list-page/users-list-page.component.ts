import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {UsersService} from '../../services/users.service';
import {UsersQuery} from '../../models/user-query';
import {finalize, takeUntil, tap} from 'rxjs/internal/operators';
import {defaultTo, omitBy, size} from 'lodash-es';
import {UserModel} from '../../models/user.model';
import {MatPaginator, MatTableDataSource, PageEvent} from '@angular/material';
import {forkJoin, Subject} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {getQueryParams, parseQueryParams} from '../../utils/helpers';

@Component({
  selector: 'exads-users-list-page',
  templateUrl: './users-list-page.component.html',
  styleUrls: ['./users-list-page.component.scss']
})
export class UsersListPageComponent implements OnInit, OnDestroy {
  page: number = 0;
  pageSize: number = 20;
  totalUsers: number;
  displayedColumns: string[];
  dataSource: MatTableDataSource<UserModel>;
  isLoading: boolean;
  private $componentDestroyed = new Subject();
  private paginator: MatPaginator;
  pageLabel: string;
  pageSizeOpts = [20, 50, 100, 500];

  @ViewChild(MatPaginator, {static: false}) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
  }

  constructor(private userService: UsersService, private route: ActivatedRoute, private router: Router) {
    this.displayedColumns = ['username', 'fullname', 'email', 'status', 'created_date'];
  }

  ngOnInit() {
    this.getUsers();
    this.getAmountOfUsers();
    this.route.queryParamMap.pipe(
      tap(params => {
        const {page, pageSize} = parseQueryParams(params);
        this.page = page > 0 ? page - 1 : page;
        this.pageSize = pageSize;
        this.getUsers();
        this.getAmountOfUsers();
      }),
      takeUntil(this.$componentDestroyed)
    ).subscribe()
  }

  getUsers() {
    this.isLoading = true;
    const query: UsersQuery = omitBy<UsersQuery>({
      page: this.page,
      limit: this.pageSize,
    }, v => !v);

    forkJoin([this.userService.getUsers(query), this.userService.getStatuses()]).pipe(
      tap((results) => {
        const users = results[0];
        const statuses = results[1];
        const mergedValues = users.map(obj => {
          const o = statuses.filter(v => v.id === obj.id_status)[0];
          return {...obj, fullname: `${obj.first_name} ${obj.last_name ? obj.last_name : ''}`, status: o}
        });
        this.dataSource = new MatTableDataSource(mergedValues);
      }),
      finalize(() => this.isLoading = false),
      takeUntil(this.$componentDestroyed)
    ).subscribe(() => {
    });
  }

  getAmountOfUsers() {
    this.userService.getUsers().pipe(
      tap((res) => {
        this.totalUsers = res.length;
        this.pageLabel = this.getRangeLabel(this.page, this.pageSize, this.totalUsers);
      }),
      takeUntil(this.$componentDestroyed)
    ).subscribe()
  }

  changePage(event, pageSize?: boolean) {
    const queryParams: any = getQueryParams(this.route.snapshot.queryParamMap, []);
    if (event.pageIndex) {
      queryParams.page = event.pageIndex + 1;
    }
    if (event.pageIndex === 0) {
      queryParams.page = undefined;
    }
    if (pageSize && event !== this.pageSizeOpts[0]) {
      queryParams.limit = event;
      queryParams.page = undefined;
    }
    if (pageSize && event === this.pageSizeOpts[0] && queryParams.limit !== event) {
      queryParams.limit = undefined;
    }
    this.router.navigate([''], {queryParams, relativeTo: this.route});
  }

  getRangeLabel(page: number, pageSize: number, length: number) {
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    const endIndex = startIndex < length ?
      Math.min(startIndex + pageSize, length) :
      startIndex + pageSize;
    return `Showing ${startIndex + 1} - ${endIndex} / ${this.totalUsers} entries`
  }

  ngOnDestroy(): void {
    this.$componentDestroyed.next();
    this.$componentDestroyed.unsubscribe();
  }
}
