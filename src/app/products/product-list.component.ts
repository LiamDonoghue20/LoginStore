import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { IProduct } from './product';
import { ProductService } from '../_services/product.service'

@Component({
    selector: 'products',
    templateUrl: './product-list.component.html',
    styles: ["./product-list.component.css"]

})

export class ProductListComponent implements OnInit, OnDestroy {

    pageTitle: string = 'Product List'
    imageWidth: number = 200;
    imageMargin: number = 8;
    showImage: boolean = false;
    errorMessage: string = '';

    sub!: Subscription

    //private back end variable denoted by _ 
    private _listFilter: string = '';

    //setter called everytime the listFilter is updated
    set listFilter(value: string){
        //sets the private variable to the value passed into the function
        this._listFilter = value;
        console.log('In setter:', value)
        //call the performFilter function with value passed into listFilter
        this.filteredProducts = this.performFilter(value)
    }

    //gets the currrent _listFilter value, to be displayed in the front end
    get listFilter(): string {
        return this._listFilter;
    }

    //filteredProducts which displays on the front end
    filteredProducts: IProduct[] = [];
    //holds all of the products available in the JSON
    products: IProduct[] = [];


    constructor(private productService: ProductService){

    }
    
    ngOnInit(){
        //on initiation of the list, call get getProducts in the products service
        this.sub = this.productService.getProducts().subscribe({
            next: products => {
                this.products = products;
                //set the filteredProducts to all the products, so they all display before they're filtered
                this.filteredProducts = this.products;
            },
            error: err => this.errorMessage = err
        })

    }

    ngOnDestroy(){
        this.sub.unsubscribe;
    }

    performFilter(filterBy: string): IProduct[]{
        //set the value to filter by to lower case (so its not case sensitive)
        filterBy = filterBy.toLocaleLowerCase();
        //filter the array of products with an IProduct, return the product which matches the filterBy variable
        return this.products.filter((product: IProduct) =>
        product.productName.toLocaleLowerCase().includes(filterBy))
    }

    toggleImage(): void {
        this.showImage = !this.showImage;
    }


}