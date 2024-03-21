import { Routes } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { ManageCategoryComponent } from './manage-category/manage-category.component';
import { RouteGuardService } from '../services/route-guard.service';
import { ManageProductComponent } from './manage-product/manage-product.component';
import { ManageOrderComponent } from './manage-order/manage-order.component';
import { ManageUserComponent } from './manage-user/manage-user.component';
import { ViewBillProductsComponent } from './dialog/view-bill-products/view-bill-products.component';
import { ViewBillComponent } from './view-bill/view-bill.component';
import { HomeComponent } from '../home/home.component';
import { BestSellerComponent } from '../best-seller/best-seller.component';
import { ViewHomeComponent } from './view-home/view-home.component';
import { ProductDetailsComponent } from './product-details/product-details.component';


export const MaterialRoutes: Routes = [
    {
        path: 'category',
        component: ManageCategoryComponent,
        canActivate: [RouteGuardService],
        data: {
            expectedRole: ['admin']
        }
    },
    {
        path: 'product',
        component: ManageProductComponent,
        canActivate: [RouteGuardService],
        data: {
            expectedRole: ['admin']
        }
    },
    {
        path: 'order',
        component: ManageOrderComponent,
        canActivate: [RouteGuardService],
        data: {
            expectedRole: ['admin', 'user']
        }
    },
    {
        path: 'user',
        component: ManageUserComponent,
        canActivate: [RouteGuardService],
        data: {
            expectedRole: ['admin']
        }
    },
    {
        path: 'bill',
        component: ViewBillComponent,
        canActivate: [RouteGuardService],
        data: {
            expectedRole: ['admin']
        }
    },
    {
        path: 'view',
        component: ViewHomeComponent,
        canActivate: [RouteGuardService],
        data: {
            expectedRole: ['admin','user']
        },
    },
    {
        path: 'details/:id',
        component: ProductDetailsComponent,
        canActivate: [RouteGuardService],
        data: {
            expectedRole: ['admin','user']
        }
    }
];
