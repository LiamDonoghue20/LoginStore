import { Injectable } from "@angular/core";
import { Subject, BehaviorSubject } from 'rxjs';
import { IProduct } from "@/products/product";

@Injectable({
    providedIn: 'root'
})
export class BasketService{

    subject = new Subject()
    private currentUserSubject: BehaviorSubject<IProduct[]>;

    constructor(){      
    }

    sendItem(product) {
        console.log(product)
        this.subject.next(product) //triggering an event
    }

 
    getBasketItems(){
        
       return this.subject.asObservable()

    }
}