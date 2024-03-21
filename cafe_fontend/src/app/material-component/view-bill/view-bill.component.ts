import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BillService } from 'src/app/services/bill.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { ViewBillProductsComponent } from '../dialog/view-bill-products/view-bill-products.component';
import * as saveAs from 'file-saver';

@Component({
  selector: 'app-view-bill',
  templateUrl: './view-bill.component.html',
  styleUrls: ['./view-bill.component.scss']
})
export class ViewBillComponent implements OnInit{

  displayedColumns: string[] = ['name', 'email','contactNumber', 'paymentMethod', 'total', 'view'];
  dataSource: any;
  responseMessage: any;

  constructor(private billService: BillService,
    private router: Router,
    private dialog: MatDialog,
    private snackbarService: SnackbarService,
    private ngxService: NgxUiLoaderService){}

ngOnInit(): void {
  this.tableData();
  this.ngxService.start()
}
  tableData(){
    this.billService.getBills().subscribe((res: any) =>{
      this.ngxService.stop();
      this.dataSource = new MatTableDataSource(res);
    }, (error)=> {
      this.ngxService.stop();
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }
      else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage,error);
    })
  }
  filterBill(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  handleViewAction(values: any){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      data:values
    }
    dialogConfig.width = "100%";
    const dialogRef = this.dialog.open(ViewBillProductsComponent,dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close()
    })
  }
  deleteBill(id: any) {
    this.billService.delete(id).subscribe((response: any) => {
      this.tableData();
      this.snackbarService.openSnackBar("Delete bill successfully", 'success');
    }, (error: any) => {

    })
  }

  downloadReportAction(values: any) {
    this.billService.getPdf(values.id).subscribe((response: any) => {
      saveAs(response, 'invoice');
    }, (error) => {
      console.log(error)
    })
  }
}
