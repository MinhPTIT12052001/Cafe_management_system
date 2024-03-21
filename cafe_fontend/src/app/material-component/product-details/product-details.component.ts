import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit{

  productId: number | undefined;
  productDetails: any;
  
  constructor(private route: ActivatedRoute,
    private productService: ProductService){

  }
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.productId = +params['id'];
      this.getProductDetails();
    });
  }
  getProductDetails() {
    this.productService.getById(this.productId).subscribe(
      (data) => {
        this.productDetails = data;
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
