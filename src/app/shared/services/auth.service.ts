import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { defaultIfEmpty, filter, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Login } from '../types/login.type';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
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
     this._http.get<Login>(this._backendURL.allLog);
   }

  fetch(): Observable<Login[]> {
    return this._http.get<Login[]>(this._backendURL.allLog)
      .pipe(
        filter((logs: Login[]) => !!logs),
        defaultIfEmpty([])
      );
  }


  fetchId(id:string): Observable<Login> {
    return this._http.get<Login>(this._backendURL.idUser.replace(':id', id));
  }  

  update(log: Login): Observable<any> {
    var id_url = log.user
    return this._http.put<Login>(this._backendURL.editLog, log, {headers:this.headers});
  }

  public isAuth(): boolean {
    if (localStorage.getItem('user') != null) return true;
    return false;
  }
}
