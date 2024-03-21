import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { enviroment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  url = enviroment.apiUrl;

  constructor(private http: HttpClient) { }

  getDetails(){
    return this.http.get(this.url + "/dashboard/details");
  }
}

