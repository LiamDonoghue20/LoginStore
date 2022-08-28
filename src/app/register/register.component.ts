import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AlertService, UserService, AuthenticationService } from '@/_services';

@Component({
    templateUrl: './register.component.html',
  })
  export class RegisterComponent implements OnInit {
  
    registerForm: FormGroup;
    loading = false;
    submitted = false;
  
    constructor(
      private formBuilder: FormBuilder,
      private router: Router,
      private authenticationService: AuthenticationService,
      private userService: UserService,
      private alertService: AlertService
    ) { 
      //redirect to home if already logged in
      if(this.authenticationService.currentUserValue){
        this.router.navigate(['/']);
      }
    }
  
    ngOnInit(): void {
      //validators for all fields in the form, set via formBuilder
      this.registerForm = this.formBuilder.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        username: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(6)]]
      });
    }
  
     // convenience getter for easy access to form fields
    get f(){ return this.registerForm.controls; }
  
    onSubmit(){
      this.submitted = true;
  
      //reset alerts on submit
      this.alertService.clear();
  
      //stop here if form invalid
      if(this.registerForm.invalid){
        return;
      }
  
      this.loading = true;
  
      //call the register method in user service with the registration form details
      this.userService.register(this.registerForm.value)
          .pipe(first())
          .subscribe(
            data => {
              //call success message in alert service to display success alert
              this.alertService.success('Registration successful', true);
            },
            error => {
              //call error alert if there is an error
              this.alertService.error(error);
              this.loading = false;
            }
          )
  
    }
  }