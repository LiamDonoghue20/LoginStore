import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { IProduct } from "../products/product";
import { catchError, tap, map} from "rxjs/operators";
@Injectable({
    providedIn: 'root'
})

export class ProductService {
    
    //the location of the products json
    private productUrl = 'src\\app\\_productdata\\products\\products.json';
   
    //initiating with the http client so get methods can be used
    constructor(private http: HttpClient){

    }

    //returns observable of an array of IProducts (custom product interface)
    getProducts(): Observable<IProduct[]>{
        //calls get on the product URL and prints it to console
        return this.http.get<IProduct[]>(this.productUrl).pipe(
            tap(data => console.log('All', JSON.stringify(data))),
            catchError(this.handleError)
        );
    }

    //get a single product by passing the product ID
    getProduct(id: number) : Observable<IProduct | undefined> {
        return this.getProducts()
                .pipe(
                    //find a product that matches the product id
                    map((products: IProduct[]) => products.find(product => product.productId == id))
                );

    }



 

    private handleError(err: HttpErrorResponse){
        let errorMessage = '';
        if(err.error instanceof ErrorEvent){
           errorMessage = `An error: ${err.status}, error message is: ${err.message}`
        } else {
            errorMessage = `Server returned an error code ${err.status}, error message is: ${err.message}`
        }
        console.log(errorMessage)
        return throwError(errorMessage)
    }
}