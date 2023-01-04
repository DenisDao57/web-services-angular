import { Injectable } from '@angular/core';
import { Voiture } from '../types/voiture.type';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { defaultIfEmpty, filter, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VoitureService {

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
     this._http.get<Voiture>(this._backendURL.allVoiture);
   }
 
   /**
    * Pour get all Voiturex
    */
   fetch(): Observable<Voiture[]> {
   
     return this._http.get<Voiture[]>(this._backendURL.allVoiture)
       .pipe(
         filter((Voiture: Voiture[]) => !!Voiture),
         defaultIfEmpty([])
       );
   }
 
   /**
    * Pour créer un Voiture
    */
   create(Voiture: Voiture): Observable<any> {
     return this._http.post<Voiture>(this._backendURL.createVoiture, Voiture, this._options());
   }
 
   update(Voiture: Voiture): Observable<any> {
     var id_url = Voiture.registrationNumber;
     return this._http.put<Voiture>(this._backendURL.editVoiture.replace(':id', id_url), Voiture, this._options());
   }
 
 
   // Pour delete un Voiture
   delete(id: string): Observable<string> {
     return this._http.delete(this._backendURL.deleteVoiture.replace(':id', id))
       .pipe(
         map(() => id)
       );
   }
 
   /**
    * Function to return request options
    */
   private _options(headerList: object = {}): any {
     return { headers: new HttpHeaders(Object.assign({ 'Content-Type': 'application/json' }, headerList)) };
   }
}
