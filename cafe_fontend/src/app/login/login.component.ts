import { DialogConfig } from '@angular/cdk/dialog';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBarConfig } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalConstants } from '../shared/global-constants';
import { SnackbarService } from '../services/snackbar.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{

  hide: boolean = true;
  formLogin: any = FormGroup;
  responseMessage: any;


 constructor(private router: Router,
  private dialogRef: MatDialogRef<LoginComponent>,
  private snackBar: SnackbarService,
  private userService: UserService,
  private ngxService: NgxUiLoaderService,
  private form: FormBuilder){
}
ngOnInit(): void {
  this.formLogin = this.form.group({
    email: [null,[Validators.required,Validators.pattern(GlobalConstants.emailRegex)]],
    password: [null,[Validators.required]]
  })
}

handleSubmit(){
  this.ngxService.start();
  let formData = this.formLogin.value;
  let data = {
    email: formData.email,
    password: formData.password,
  }
  this.userService.LogIn(data).subscribe((res :any) => {
    this.ngxService.stop();
    this.dialogRef.close();
    localStorage.setItem('token',res.token)
    this.router.navigate(['/cafe/view']);
  },(error) => {
    this.ngxService.stop();
    if(error.error?.message){
      this.responseMessage = error.error?.message;
    } else{
      this.responseMessage = GlobalConstants.genericError;
    }
    this.snackBar.openSnackBar(this.responseMessage,GlobalConstants.genericError);
  })
}
}
