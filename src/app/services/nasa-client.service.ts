import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {IPhoto} from "../interfaces/IPhoto.interface";

const apiKey = '0pjtLN0emvPxufOE9XehzpeTHxsKrfY4Z3N6WOKH';
const apiUrl = 'https://api.nasa.gov/mars-photos/api/v1/rovers/';

@Injectable({
  providedIn: 'root'
})
export class NasaClientService {

  constructor(private http: HttpClient) { }

  getPhotosByEarthDate(value: any): Observable<{photos: IPhoto[]}>{
    return this.http.get<{photos: IPhoto[]}>(
      `${apiUrl}${value.id}/photos`,
      {
        params: new HttpParams({
          fromObject: {
            earth_date: value.date,
            camera: value.camera,
            api_key: apiKey
          }
        })
      }
    )
  }

  getPhotosByMartianSol(value: any){
    return this.http.get<{photos: IPhoto[]}>(
      `${apiUrl}${value.id}/photos`,
      {
        params: new HttpParams({
          fromObject: {
            sol: value.date,
            camera: value.camera,
            api_key: apiKey
          }
        })
      }
    )
  }
}
