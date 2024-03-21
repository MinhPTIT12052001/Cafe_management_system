import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  onAddProduct = new EventEmitter();
  onEditProduct = new EventEmitter();
  productForm: any = FormGroup;
  dialogAction: any = "Add";
  action: any = "Add";
  responseMessage: any;
  categorys: any = [];
  selectedFile: File | undefined;


  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any,
    private formBulider: FormBuilder,
    protected productService: ProductService,
    public dialogRef: MatDialogRef<ProductComponent>,
    private snackbarService: SnackbarService,
    private categoryService: CategoryService,
    private ngxService: NgxUiLoaderService
  ) { } 

  ngOnInit(): void {
    this.productForm = this.formBulider.group({
      name: [null, [Validators.required]],
      categoryId: [null, Validators.required],
      price: [null, Validators.required],
      description: [null],
      file: [null]
    });
    if (this.dialogData.action === "Edit") {
      this.dialogAction = "Edit";
      this.action = "Update";
      this.productForm.patchValue(this.dialogData.data);
    }
    this.getCategorys();
  }
  onFileSelected(event: any){
    if(event.target.files){
      const file = event.target.files[0];
      this.selectedFile = file;
    }
  }

  getCategorys() {
    this.categoryService.getCategorys().subscribe((response: any) => {
      this.categorys = response;
    }, (error) => {
      console.error(error);
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    });
  }

  handleSubmit() {
    if (this.dialogAction === "Edit") {
      this.edit();
    } else {
      this.add();
    }
  }

  add() {
    this.ngxService.start();
    
    const formData = this.builderFormAdddata();
    
      this.productService.add(formData).subscribe((response: any) => {
      this.dialogRef.close();
      this.ngxService.stop();
      this.onAddProduct.emit();
      this.responseMessage = response.message;
      this.snackbarService.openSnackBar(this.responseMessage, "success");
    }, (error) => {
      this.dialogRef.close();
      this.ngxService.stop();
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    });
  }

  edit() {
    this.ngxService.start()
    
    const data = this.builderFormEditData();


    this.productService.update(data).subscribe((response: any) => {
      this.ngxService.stop();
      this.dialogRef.close();
      this.onEditProduct.emit();
      this.responseMessage = response.message;
      this.snackbarService.openSnackBar(this.responseMessage, "success");
    }, (error) => {
      this.ngxService.stop();
     
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    });
  }

  private builderFormAdddata(): FormData {
    const formData = new FormData();
    
    formData.append('name',this.productForm.get('name').value);
    formData.append('categoryId', this.productForm.get('categoryId').value);
    formData.append('price', this.productForm.get('price').value);
    formData.append('description', this.productForm.get('description').value);

    if (this.selectedFile) {
      formData.append('imageFile',this.selectedFile, this.selectedFile.name)
    }
    return formData;
    }


    private builderFormEditData(): FormData {
      const formData = new FormData();
      formData.append('id', this.dialogData.data.id);
      formData.append('name', this.productForm.get('name').value);
      formData.append('categoryId', this.productForm.get('categoryId').value);
      formData.append('price', this.productForm.get('price').value);
      formData.append('description', this.productForm.get('description').value);
  
      if (this.selectedFile) {
        formData.append('imageFile', this.selectedFile, this.selectedFile.name);
      }
      return formData;
    }
  }

