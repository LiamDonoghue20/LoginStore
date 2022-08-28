import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable, Subject } from 'rxjs';


//enables any component in the application to display alert messages at the top of the page via the alert component.
@Injectable({
    providedIn: 'root'
  })
  export class AlertService {
  
    private subject = new Subject<any>();
    private keepAfterRouteChange = false;
  
    
  
    constructor(private router: Router) {
      
    // clear alert messages on route change unless 'keepAfterRouteChange' flag is true
      this.router.events.subscribe(event => {
        if (event instanceof NavigationStart){
          if (this.keepAfterRouteChange){
            //only keep for a single route change
            this.keepAfterRouteChange = false;
          } else {
            //clear the alert message
            this.clear();
          }
        }
      });
     }
  
    //returns an Observable that is used by the alert component 
    //to subscribe to notifications for whenever a message should be displayed.   
     getAlert(): Observable<any>{
       return this.subject.asObservable();
     }
  
     success(message: string, keepAfterRouteChange = false){
       this.keepAfterRouteChange = keepAfterRouteChange;
       this.subject.next({ type: 'success', text: message});
     }
  
     error(message: string, keepAfterRouteChange = false){
      this.keepAfterRouteChange = keepAfterRouteChange;
      this.subject.next({ type: 'error', text: message});
    }
  
     clear(){
       //clear by calling subject.next() without params
       this.subject.next();
     }
  }
  