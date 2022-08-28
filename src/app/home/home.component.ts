import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { User } from '@/_models';
import { UserService, AuthenticationService } from '@/_services';
@
Component({
    templateUrl: './home.component.html',
  })
  export class HomeComponent implements OnInit {
  
    currentUser: User;
    users = []
  
    constructor(private authenticationService : AuthenticationService,
                private userService: UserService) {
                  //sets currentUser via the service so it can be displayed on the home template
                  this.currentUser = this.authenticationService.currentUserValue;
                 }
  
    //call load all users function when the home component is initialised             
    ngOnInit(): void {
      this.loadAllUsers();
    }
  
    //passes an id to the delete function in the user service
    //calls load all users again after its been deleted
    deleteUser(id: number){
      this.userService.delete(id)
          .pipe(first())
          .subscribe(() => this.loadAllUsers());
    }
  
    private loadAllUsers(){
      //call the getAll function in the user service to retrieve all the users in the api URL
      //assign the local array to the array of users coming through
      this.userService.getAll()
          .pipe(first())
          .subscribe(users => this.users = users);
    }
  
  }
  