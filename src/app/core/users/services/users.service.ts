import {Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UsersQuery} from '../models/user-query';
import {UserModel} from '../models/user.model';
import {map} from 'rxjs/internal/operators';
import {StatusModel} from '../models/status.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  serverUrl = `${environment.serverAddress}`;

  constructor(private http: HttpClient) {
  }

  getUsers(query?: UsersQuery): Observable<UserModel[]> {
    const params = query as any;
    return this.http.get<any>(`${this.serverUrl}users`, {params}).pipe(
      map(x => x.data)
    );
  }

  getStatusesById(id: number): Observable<StatusModel> {
    return this.http.get<any>(`${this.serverUrl}statuses/${id}`).pipe(
      map(x => x.data.status)
    );
  }

  getStatuses(): Observable<StatusModel[]> {
    return this.http.get<any>(`${this.serverUrl}statuses`).pipe(
      map(x => x.data)
    );
  }
}
