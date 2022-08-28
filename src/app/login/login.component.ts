import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AlertService, AuthenticationService } from '@/_services';

@Component({
    templateUrl: 'login.component.html'
  })
  export class LoginComponent implements OnInit {
  
    loginForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string | undefined;
  
  
  
    constructor(
      private formBuilder: FormBuilder,
      private route: ActivatedRoute,
      private router: Router,
      private authenticationService: AuthenticationService,
      private alertService: AlertService
    ) {
      if (this.authenticationService.currentUserValue){
        //redirected to home if already logged in 
        this.router.navigate(['/']);
      }
     }
  
    ngOnInit(): void {
      //loginForm is a FormGroup that defines the form controls and validators, and is used to access data entered into the form.
      //The FormGroup is part of the Angular Reactive Forms module and is bound to the login template with the [formGroup]="loginForm" directive. 
      this.loginForm = this.formBuilder.group({
        //applys validation to the username and password of the form
        username: ['', Validators.required],
        password: ['', Validators.required]
      });
  
      //get return url from route parameters or default to '/'
      this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }
  
    //convenience getter for easy access to form fields
    get f(){ return this.loginForm.controls;}
    
    onSubmit(){
      this.submitted = true;
  
      //reset alerts on submit
      this.alertService.clear();
  
      //stop here if form is invalid
      if(this.loginForm.invalid){
        return;
      }
  
      //set the boolean of loading to true here
      this.loading = true;
      //pass the username and password values with form controls (reserved as f)
      this.authenticationService.login(this.f.username.value, this.f.password.value)
      .pipe(first())
      .subscribe(
          data => {
            //if successful navigate to the return URL (/)
              this.router.navigate([this.returnUrl]);
          },
          error => {
            //if error, display via the alert service and set loading to false so the user can try again
              this.alertService.error(error);
              this.loading = false;
          });
  }
  }