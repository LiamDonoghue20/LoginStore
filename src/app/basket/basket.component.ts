import { OnInit, Component, Output, EventEmitter } from "@angular/core";
import { BasketService } from "../_services/basket.service"
import { IProduct } from "../products/product"
@Component({
    selector: 'pm-basket',
    templateUrl: './basket.component.html'
})

export class BasketComponent implements OnInit {
    basketItems = []
    basketTotal = 0;
    basketIsEmpty: boolean = true;
   @Output() notEnoughProducts: EventEmitter<boolean> = new EventEmitter<boolean>();
    showNotEnoughProductsError: boolean = false;

    constructor(private basketService: BasketService){ }

    ngOnInit() {
        //initiates basket component with items via the getBasketItems function inside the basket
        this.basketService.getBasketItems().subscribe((product: IProduct) => {
            //call 'addProductToBasket' function with the product retrieved via the service
            this.addProductToBasket(product)
        })
    }

    removeFromBasket(){

        //if there is no items in the basket, set basketIsEmpty boolean to true
        //basketIsEmpty boolean is used to hide/show basket and basket is empty alert
        if(this.basketItems[0].quantity === 0){
            this.basketIsEmpty = true
        } else {
            //other wise reduce the quantity of the most recent item in the basketItems array by 1
            this.basketItems[0].quantity--
            //remove the price of the removed item from the total
            this.basketItems.forEach(item => {
                        this.basketTotal -= item.price
             })
        } 
        //emits notEnoughProducts as false, so 'add products' button in product detail front end is no longer disabled
        this.notEnoughProducts.emit(false)
        //sets local boolean of showNotEnoughProduct error so not enough product error is no longer displayed
        this.showNotEnoughProductsError = false;
    }

 

    
   

    addProductToBasket(product: IProduct){

        //set basketIsEmpty to false so basket is shown in front end
        this.basketIsEmpty = false;
        let productExists: boolean = false;
        //for each product in the basketItems array
        for(let i in this.basketItems){
            //if the basket Item ID already exists in the basketItems array
                    if  (this.basketItems[i].productId === product.productId){
                        ///then increment the quantity by 1
                        this.basketItems[i].quantity++
                        //and set boolean to true and break the for loop
                        productExists = true
                        //if the total amount of items in the basket is equal or above the stored avaialable quantity of items
                        if(this.basketItems[i].quantity >= product.quantity){
                            //emit that the notEnoughProducts output is true
                            //so that in the product detail front end disabled the add products button
                            this.notEnoughProducts.emit(true)
                            //set showNotEnoughProductsError to true so that not enough products error is displayed in basket front end
                            this.showNotEnoughProductsError = true
                        }
                        break;
                    }
        }
    //if productExists is false (i.e its the first item of that ID being added to the basket)
        if(!productExists){
            //then push the item to the basketItems array
            this.basketItems.push({
                //with these values
                productId: product.productId,
                productName: product.productName,
                quantity: 1,
                amountOfProducts: product.quantity,
                price: product.price
            })
           
        }
    
        //add up the total of the item prices in the basket
        this.basketTotal = 0;
        this.basketItems.forEach(item => {
        this.basketTotal += (item.quantity * item.price)
        })

    }
}