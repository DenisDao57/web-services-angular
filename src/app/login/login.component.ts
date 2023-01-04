import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { Login } from '../shared/types/login.type';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  private readonly _form: FormGroup;
  public error: Boolean = false;

  constructor(private _authService: AuthService, private router: Router) { 
    this._form = this._buildForm();
  }

  ngOnInit(): void {
    // If the user is already auth, he can't be on this page
    // So we redirect him
    if (this._authService.isAuth()) this.router.navigate(['/home']);
  }

  get form(): FormGroup {
    return this._form;
  }

  // Login button function
  // For now it checks if the login process is a success
  // If yes then it changes the page
  // Else it stays on the page
  public login(log:Login){
    this._authService.fetch().subscribe({
      next: (logins: Login[]) => {
        logins.forEach(temp => {
          if(temp.user==log.user && temp.pwd === log.pwd){
            localStorage.setItem('user',log.user.toString());
            this.router.navigate(['/home']);
          }
        });
        this.error=true;
      }
  });
}

  // Buildform function
  // It checks if field are correct according to our criterias
  private _buildForm(): FormGroup {
    const locat_regex = "^-?[0-9]\\d*(\\.\\d{1,18})?$";
    return new FormGroup({
      user: new FormControl('', Validators.compose([
        Validators.required, Validators.minLength(1)
      ])),
      pwd: new FormControl('', Validators.compose([
        Validators.required, Validators.minLength(1)
      ]))
    });
  }

}
