import { Component, OnInit } from '@angular/core';
import { RepositoryService } from '../shared/services/repository.service';
import { ErrorHandlerService } from '../shared/services/error-handler.service';

export class OrderItemResult {
  orderItems: OrderItem[];
}

export class OrderItem {
  itemID: number;
  name: string;
  price: number;
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
  public items: OrderItemResult;
  public ShoppingCartArray: Array<ShoppingCart> = [];
  isModalActive: boolean = false;
  isHidden: boolean = false;
  ordernumber: number;
  public errorMessage: string = '';
  quantity: number;

  constructor(private repository: RepositoryService, private errorHandler: ErrorHandlerService) { }

  ngOnInit() {
    this.getAllOrderItems();
  }


  public async getAllOrderItems(){
    let apiAddress: string = "v1/Orders/Items";

    await this.repository
              .getDataAsync<OrderItemResult>(apiAddress)
              .then(res => {
                this.items = res;
              })
              .catch(error => {
                this.errorHandler.handleError(error);
                this.errorMessage = this.errorHandler.errorMessage;
              });

  }

  public async addToShoppingCart(item: OrderItem, quantity: number){
    this.isHidden = true;

    if (quantity === null || quantity == undefined ) {
      quantity = 1;
    }
    
    if (!this.ItemExistInCart(item)) {

      let apiAddress: string = "v1/Orders/Item/" + item.itemID;

      await this.repository
              .getDataAsync<OrderItem>(apiAddress)
              .then(res => {
                this.UpdateShoppingCart(res, +quantity)
              })
              .catch(error => {
                this.errorHandler.handleError(error);
                this.errorMessage = this.errorHandler.errorMessage;
              });

    }
    else {
      
      var index = this.ShoppingCartArray.findIndex(x => x.itemID == item.itemID)
      var q = this.ShoppingCartArray[index].quantity;
      this.ShoppingCartArray[index].quantity = +quantity + +q;

      let apiAddress: string = "v1/Orders/Item/" + item.itemID;

      await this.repository
              .getDataAsync<OrderItem>(apiAddress)
              .then(res => {
                this.ShoppingCartArray[index].totalprice = this.ShoppingCartArray[index].quantity * res.price;
              })
              .catch(error => {
                this.errorHandler.handleError(error);
                this.errorMessage = this.errorHandler.errorMessage;
              });

    }
  }

  private ItemExistInCart(item: OrderItem):boolean {
    return this.ShoppingCartArray.some(x => x.itemID === item.itemID);
  }

  private UpdateShoppingCart(item: OrderItem, quantity: number){
    let total = item.price * quantity;

    let shippingorder = new ShoppingCart();
    shippingorder.itemID = item.itemID;
    shippingorder.name = item.name;
    shippingorder.price = item.price;
    shippingorder.quantity = quantity;
    shippingorder.totalprice = total;

    this.ShoppingCartArray.push(shippingorder);
  }

  public async saveShoppingCart(){
    this.isHidden = false;
    this.isModalActive = true;

    var cart = this.ShoppingCartArray.map(x => ({ itemid: x.itemID, quantity: x.quantity }));

    let apiAddress: string = "v1/Orders/Order";
    
    await this.repository
              .createAsync<OrderItem>(apiAddress, JSON.stringify(cart))
              .then(res => {
                this.ordernumber = res as number;
              })
              .catch(error => {
                this.errorHandler.handleError(error);
                this.errorMessage = this.errorHandler.errorMessage;
              });
      
    this.ShoppingCartArray = [];
  }

  public removeFromShoppingCart(item: OrderItem) {
    if (this.ItemExistInCart(item)) {
      var index = this.ShoppingCartArray.findIndex(x => x.itemID === item.itemID);
      this.ShoppingCartArray.splice(index, 1);

      if (this.ShoppingCartArray.length === 0) {
        this.isHidden = false;
      };
    }
  }

  toggleModal() {
    this.isModalActive = !this.isModalActive;
  }

}
