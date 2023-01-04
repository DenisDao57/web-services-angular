import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { defaultIfEmpty, filter, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Loan } from '../types/loan.type';

@Injectable({
  providedIn: 'root'
})
export class LoanService {

  // private property to store all backend URLs
  private readonly _backendURL: any;
  public headers = {'Content-Type': 'text/plain; charset=utf-8'};


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
    this._http.get<Loan>(this._backendURL.allLoan);
  }
  

  /**
   * Pour get all Loans
   */
  fetch(): Observable<Loan[]> {
  
    return this._http.get<Loan[]>(this._backendURL.allLoan)
      .pipe(
        filter((Voiture: Loan[]) => !!Voiture),
        defaultIfEmpty([])
      );
  }

  create(loan: Loan): Observable<any> {
    return this._http.post<Loan>(this._backendURL.addLoan, loan);
  }

  /**
   * Pour get all Loans
   */
  fetchPre(): Observable<Loan[]> {
    return this._http.get<Loan[]>(this._backendURL.allpreLoan)
      .pipe(
        filter((loan: Loan[]) => !!loan),
        defaultIfEmpty([])
      );
  }

  createPre(loan: Loan): Observable<any> {
    return this._http.post<Loan>(this._backendURL.addpreLoan, loan,  {headers:this.headers});
  }

  deletePre(loan: Loan): Observable<any> {
    let params = new HttpParams();
    params = params.append('user', loan.id_user);
    params = params.append('car', loan.id_vehicle);
    return this._http.delete<Loan>(this._backendURL.deletePre);
  }

}
