import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmmployeeService {

  constructor(private httpClient: HttpClient) { }

  getAllEmployeeDetails(path: any) {
    return this.httpClient.get(`${environment.userDetails}/${path}`)
  }

  postEmployeeDetails(path: any, payload: any) {
    return this.httpClient.post<any>(`${environment.userDetails}/${path}`, payload)
  }

  getEmployeeDetails(path: any, params: any) {
    return this.httpClient.get(`${environment.userDetails}/${path}`, params)
  }

  deleteEmployee(path: any, params: any) {
    return this.httpClient.delete(`${environment.userDetails}/${path}`, params)
  }

  updateEmployee(path: string, params: any, payload: any) {
    return this.httpClient.put(`${environment.userDetails}/${path}`, payload, { params });
  }
  
}
