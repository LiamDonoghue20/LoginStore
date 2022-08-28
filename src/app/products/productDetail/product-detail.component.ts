import { IProduct } from "../product";
import { Subscription } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { Component, OnInit, Input } from "@angular/core";
import { ProductService } from "../../_services/product.service";
import { BasketService } from "../../_services/basket.service";

@Component({
    templateUrl: './product-detail.component.html',
     styles: ['./product-detail.css']
})

export class ProductDetailComponent implements OnInit {
    pageTitle: string = 'Product Detail';
    product: IProduct | undefined;
    sub!: Subscription;
    errorMessage: string = '';
    @Input() basketItem: IProduct;
    notEnoughItems: boolean = false;

    constructor(private route: ActivatedRoute,
                private router: Router,
                private productService: ProductService,
                private basketService: BasketService){}

    ngOnInit(): void {
        // on initiation of the product detail component, grab the product ID
        //append it to the pageTitle
        const id = Number(this.route.snapshot.paramMap.get('id'));
        this.pageTitle += ` ${id}`
        //if a product ID is retrieved, get the rest of the product via the getProduct method
        if (id){
            this.getProduct(id);
           
        }
    }


    getProduct(id: number): void {
        //calls getProduct method in product service with the product id
        this.productService.getProduct(id).subscribe({
            next: product => this.product = product,
            error: err => this.errorMessage = err
        })
        
    }
    addToBasket(): void{
        //call sendItem with the selected product
        this.basketItem = this.product;
        this.basketService.sendItem(this.basketItem)
        
        
    }
    onBack():void {
        this.router.navigate(['/products']);
    }

    //receives the message from the basket component class via the notEnoughProducts output
    //sets local boolean of notEnoughItems to the value emited by the basket
    //which handles whether the add product to basket button is disabled or not
    //the output value in the basket child component and this function are connected via the code in the front end:
    //  <pm-basket  (notEnoughProducts)='checkEnoughItems($event)'></pm-basket>
    checkEnoughItems(message: boolean): void {
        this.notEnoughItems = message;
     
      }
  
}