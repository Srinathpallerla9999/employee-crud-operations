import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})

export class AuthService {

  constructor(private http: HttpClient) { }
  userName: any

  registerAndLogin(path: any, payload: any) {
    return this.http.post<any>(`${environment.userDetails}/${path}`, payload);
  }

  getToken() {
    return localStorage.getItem('access_token')
  }

  getUserName() {
    return localStorage.getItem("userName")
  }
}


