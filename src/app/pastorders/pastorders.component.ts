import { Component, OnInit } from '@angular/core';
import { RepositoryService } from '../shared/services/repository.service';
import { ErrorHandlerService } from '../shared/services/error-handler.service';

export interface PastOrders {
  id: number,
  totalNumOfItems: number,
  orderTotal: number
}

export interface pastOrderItems {
  name: string,
  itemPrice: number,
  quantity: number,
  totalItemPrice: number
} 

@Component({
  selector: 'app-pastorders',
  templateUrl: './pastorders.component.html',
  styleUrls: ['./pastorders.component.css']
})
export class PastordersComponent implements OnInit {
  public pastorders: PastOrders[];
  public errorMessage: string = '';

  constructor( private repository: RepositoryService, private errorHandler: ErrorHandlerService ) { }

  ngOnInit() {
    this.getAllPastOrders(); 
  } 

   public getAllPastOrders() {
    let apiAddress: string = "v1/Orders/PastOrders";
    this.repository.getData(apiAddress)
      .subscribe(res => {
        this.pastorders = res as PastOrders[];
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.errorMessage = this.errorHandler.errorMessage;
      }) 
  } 
}
