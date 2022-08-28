import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { AlertService } from '@/_services';

@Component({
    selector: 'alert',
    templateUrl: './alert.component.html'
  })
  export class AlertComponent implements OnInit, OnDestroy {
    private subscription!: Subscription
    message: any;
  
    constructor(private alertService: AlertService) { }
  
    //when the alert component is initiated
    ngOnInit(): void {
      //subscribe to alert service to alert service
      this.subscription = this.alertService.getAlert()
            .subscribe(message => {
              //switch statement on the stream of data coming in, whether its a success or error message
              switch(message && message.type){
                case 'success':
                  //if its success use the success style class
                  message.cssClass = 'alert alert-success'
                  break;
                case 'error':
                  ////if its success use the error one
                  message.cssClass =  'alert alert-danger'
                  break;
              }
              // passes alert messages to the template whenever a message is received from the alert service. 
              this.message = message;
            })
    }
  
    //unsubscribe when the alert is closed
    ngOnDestroy(){
      this.subscription.unsubscribe();
    }
  
  }
  