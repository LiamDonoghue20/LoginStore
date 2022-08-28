import { NgModule } from "@angular/core";
import { ProductListComponent } from "./product-list.component"
import { SharedModule } from "@/shared/shared.module";
import { ConvertToSpacesPipe } from "@/shared/convert-to-spaces.pipe";
import { ProductDetailComponent } from "./productDetail/product-detail.component";
import { RouterModule } from "@angular/router";
import { ProductDetailGuard } from "./productDetail/product-detail.guard";
import { BasketComponent } from "@/basket/basket.component";
import { BasketItemComponent } from "@/basket/basket-item/basket-item.components";

@NgModule({
    declarations: [
    ProductListComponent,
    ConvertToSpacesPipe,
    ProductDetailComponent,
    BasketComponent,
    BasketItemComponent
    ],

    imports: [
        SharedModule,
        RouterModule.forChild([
            {path: 'products', component: ProductListComponent},
            {
                path: 'products/:id',
                canActivate: [ProductDetailGuard],
                component: ProductDetailComponent
            }
        ])

    ]
})
export class ProductModule { }