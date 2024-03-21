import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { DialogConfig, DialogRef } from '@angular/cdk/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../services/snackbar.service';
import { GlobalConstants } from '../shared/global-constants';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit{

  forgotPasswordForm: any = FormGroup;
  responseMessage: any;


constructor(private formBuider: FormBuilder,
  private router: Router,
  private userService: UserService,
  private dialogRef: DialogRef<ForgotPasswordComponent>,
  private ngxService: NgxUiLoaderService,
  private snackBar: SnackbarService){}

ngOnInit(): void {
  this.forgotPasswordForm = this.formBuider.group({
    email: [null,[Validators.required,Validators.pattern(GlobalConstants.emailRegex)]]
  })
}
handleSubmit(){
  this.ngxService.start();
  let formData = this.forgotPasswordForm.value;
  let data = {
    email: formData.email
  }
  this.userService.forgotPassword(data).subscribe((res: any) => {
    this.ngxService.stop();
    this.dialogRef.close();
    this.responseMessage = res?.message;
    this.snackBar.openSnackBar(this.responseMessage,'');
  }, (error) =>{
    this.ngxService.stop();
    if(error.error?.message){
      this.responseMessage = error.error?.message;
    } else {
      this.responseMessage = GlobalConstants.genericError;
    }
    this.snackBar.openSnackBar(this.responseMessage,GlobalConstants.genericError);
  })
}
}
