import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-view-home',
  templateUrl: './view-home.component.html',
  styleUrls: ['./view-home.component.scss']
})
export class ViewHomeComponent implements OnInit {

  products: Array<Product> = []; 
  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.productService.getProducts().subscribe(
      (data: any) => {
        this.products = data;
        console.log(this.products)
      },
      (error) => {
        console.error(error);
      }
    );
  }

  getImageUrl(element: any): string {
    try {
      if (element.imageName && element.imageType && element.imageBytes) {
        let uint8Array = new Uint8Array(atob(element.imageBytes).split('').map(char => char.charCodeAt(0)));
        const base64Image = btoa(String.fromCharCode(...uint8Array));
        return `data:${element.imageType};base64,${base64Image}`;
      }
    } catch (error) {
      console.error('Error decoding image:', error);
    }
    return 'assets/placeholder-image.png';
  }
}
export class Product {
  id: number;
  name: string;
  description: string;
  price: number;
  status: string;
  imageName: string;

  constructor(id: number, name: string, description: string, price: number, status: string, imageName: string) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.status = status;
    this.imageName = imageName;
  }
}

