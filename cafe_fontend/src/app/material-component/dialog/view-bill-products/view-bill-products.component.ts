import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ViewBillComponent } from '../../view-bill/view-bill.component';


@Component({
  selector: 'app-view-bill-products',
  templateUrl: './view-bill-products.component.html',
  styleUrls: ['./view-bill-products.component.scss'],
})
export class ViewBillProductsComponent implements OnInit {

displayColumn: string[] = ['name', 'category', 'price', 'quantity', 'total'];
dataSource: any;
data: any;
responseMessage: any;
  constructor(
    public dialogRef: MatDialogRef<ViewBillProductsComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData:any){}

  ngOnInit(): void {
    this.data = this.dialogData.data
    this.dataSource = JSON.parse(this.dialogData.data.productDetail);
    console.log(this.dialogData.data)
  }
}
