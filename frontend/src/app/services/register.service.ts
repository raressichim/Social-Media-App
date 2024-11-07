import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private http: HttpClient) {
  }

  private loginUrl: string = "http://localhost:8080/api/users";

  register(): Observable<any> {
    return this.http.get<any>(this.loginUrl, {
      withCredentials: true,
    });
  }
}
