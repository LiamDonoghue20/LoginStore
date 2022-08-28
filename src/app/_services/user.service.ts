import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '@/_models';


@Injectable({
    providedIn: 'root'
  })
  export class UserService {
  
    // set of CRUD methods for managing users, 
    //it acts as the interface between the Angular application and the backend api
    constructor(private http: HttpClient) { }
  
    //getAll is called in the home component to get the users from the api and populate the local array
    getAll() {
      return this.http.get<User[]>(`${config.apiUrl}/users`);
    }
  
    register(user: User){
      return this.http.post<User[]>(`${config.apiUrl}/users/register`, user);
    }
  
    delete(id: number){
      return this.http.delete(`${config.apiUrl}/users/${id}`);
    }
  }
  