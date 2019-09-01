import { Component, OnInit } from '@angular/core';
import { RepositoryService } from '../shared/services/repository.service';
import { ErrorHandlerService } from '../shared/services/error-handler.service';

export interface OrderItem {
  itemID: number,
  name: string,
  price: number
}

export class ShoppingCart {
  itemID: number;
  name: string;
  quantity: number;
  price: number;
  totalprice: number;
}

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})

export class OrdersComponent implements OnInit {
  public items: OrderItem[];
  private ShoppingCartArray: Array<ShoppingCart> = [];
  isModalActive: boolean = false;
  isHidden: boolean = false;
  ordernumber: number;
  public errorMessage: string = '';

  constructor(private repository: RepositoryService, private errorHandler: ErrorHandlerService) { }

  ngOnInit() {
    this.getAllOrderItems();
  }


  public getAllOrderItems(){
    let apiAddress: string = "v1/Orders/Items";
    this.repository.getData(apiAddress)
      .subscribe(res => {
        this.items = res as OrderItem[];
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.errorMessage = this.errorHandler.errorMessage;
      })
  }


  public addToShoppingCart(item: OrderItem, quantity: number){
    this.isHidden = true;

    if (quantity == null) quantity = 1;

    let apiAddress: string = "v1/Orders/Item/" + item.itemID;
    this.repository.getData(apiAddress)
      .subscribe(res => {
        this.UpdateShoppingCart(res as OrderItem, quantity);
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.errorMessage = this.errorHandler.errorMessage;
      })
  }

  private UpdateShoppingCart(item, quantity){
    let total = item.price * quantity;

    let shippingorder = new ShoppingCart();
    shippingorder.itemID = item.itemID;
    shippingorder.name = item.name;
    shippingorder.price = item.price;
    shippingorder.quantity = quantity;
    shippingorder.totalprice = total;

    this.ShoppingCartArray.push(shippingorder);
  }

  public saveShoppingCart(){
    this.isHidden = false;
    this.isModalActive = true;

    var cart = this.ShoppingCartArray.map(x => ({ itemid: x.itemID, quantity: x.quantity }));

    let apiAddress: string = "v1/Orders/Order";
    this.repository.create(apiAddress, JSON.stringify(cart))
      .subscribe(res => {
        this.ordernumber = res as number;
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.errorMessage = this.errorHandler.errorMessage;
      })
      
    this.ShoppingCartArray = [];
  }

  toggleModal() {
    this.isModalActive = !this.isModalActive;
  }

}
