import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { defaultIfEmpty, filter, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../types/user.type';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public headers = {'Content-Type': 'text/plain; charset=utf-8'};

  // private property to store all backend URLs
  private readonly _backendURL: any;

  constructor(private _http: HttpClient) {

    this._backendURL = {};

    // build backend base url
    let baseUrl = `${environment.backend.protocol}://${environment.backend.host}`;
    if (environment.backend.port) {
      baseUrl += `:${environment.backend.port}`;
    }

    // build all backend urls
    // @ts-ignore
    Object.keys(environment.backend.endpoints).forEach(k => this._backendURL[ k ] = `${baseUrl}${environment.backend.endpoints[ k ]}`);
    this._http.get<User>(this._backendURL.allLog);
  }

 fetch(): Observable<User[]> {
   return this._http.get<User[]>(this._backendURL.allUser)
     .pipe(
       filter((logs: User[]) => !!logs),
       defaultIfEmpty([])
     );
 }  

 update(log: User): Observable<any> {
  var id_url = log.id;
  return this._http.put<User>(this._backendURL.editUser, log, {headers:this.headers});
}
}
