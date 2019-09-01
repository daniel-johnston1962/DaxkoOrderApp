import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { OrdersComponent } from './orders/orders.component';
import { PastordersComponent } from './pastorders/pastorders.component';
import { NotfoundComponent } from './core/notfound/notfound.component';
import { InternalServerComponent  } from './core/error-pages/internal-server/internal-server.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'orders',
    component: OrdersComponent
  },
  {
    path: 'pastorders',
    component: PastordersComponent
  },
  {
    path: '404', 
    component: NotfoundComponent
  },
  {
    path: '**',
    redirectTo: '/404'
  },
  {
    path: '500',
    component: InternalServerComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
