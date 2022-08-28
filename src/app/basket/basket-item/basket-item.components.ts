import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'pm-basket-item',
    templateUrl: './basket-item.component.html'
})

export class BasketItemComponent implements OnInit {
    
    constructor() {}

    @Input() basketItem: any;
    ngOnInit(){ 

    }
}