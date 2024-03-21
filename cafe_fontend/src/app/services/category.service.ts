import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { enviroment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  url = enviroment.apiUrl;

  constructor(private http: HttpClient) { }

  add(data: any){
    return this.http.post(this.url + 
      "/category/add", data,{
        headers:new HttpHeaders().set('Content-Type','application/json')
      })
  }
  update(data: any){
    return this.http.post(this.url + 
      "/category/update", data,{
        headers:new HttpHeaders().set('Content-Type','application/json')
      })
  }
  getCategorys(){
    return this.http.get(this.url + "/category/get");
  }
  getFilteredCategorys(){
    return this.http.get(this.url + "/category/get?filterValue=true");
  }
}
