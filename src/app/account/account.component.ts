import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Md5 } from 'ts-md5';
import { AuthService } from '../shared/services/auth.service';
import { UserService } from '../shared/services/user.service';
import { Login } from '../shared/types/login.type';
import { TempEdit } from '../shared/types/temp_edit';
import { User } from '../shared/types/user.type';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent {

  public form: FormGroup;

  private own_user!: User;
  private own_log!: Login;

  constructor(public router:Router,public authService:AuthService, public userService:UserService){
    this.form = this._buildForm();
  }

  public modifier(temp: TempEdit){
    this.own_user = {
      id: Number(localStorage.getItem('user')),
      nom: temp.nom,
      prenom: temp.prenom,
      no_secu: this.own_user.no_secu,
      no_permis: temp.no_permis,
      adresse: temp.adresse
    };

    this.own_log = {
      user:Number(localStorage.getItem('user')),
      pwd:Md5.hashStr(temp.pwd)
    }

    if (window.confirm("Voulez vous vraiment modifier votre profil ? ")){
      this.userService.update(this.own_user).subscribe();
      if (this.own_log.pwd!=="" || this.own_log.pwd !== undefined) this.authService.update(this.own_log).subscribe();
      window.location.reload();
    }
  }

  ngOnInit(): void {
    if (!this.authService.isAuth()) this.router.navigate(['/login']);

    this.userService.fetch().subscribe({
      next: (users: User[]) => {
        users.forEach(user => {
          if(user.id==Number(localStorage.getItem('user'))){
            this.own_user=user;
            this.form.patchValue(user);
            return;
          }
        });
      },
    });

    this.authService.fetch().subscribe({
      next: (logs: Login[]) => {
        logs.forEach(log => {
          if(log.user==Number(localStorage.getItem('user'))){
            this.own_log=log;
            return;
          }
        });
      },
    })
  }

  private _buildForm(): FormGroup {
    const locat_regex = "^-?[0-9]\\d*(\\.\\d{1,18})?$";
    return new FormGroup({
      prenom: new FormControl('', Validators.compose([
        Validators.required, Validators.minLength(1)
      ])),
      no_permis: new FormControl('', Validators.compose([
        Validators.required, Validators.minLength(1)
      ])),
      adresse: new FormControl('', Validators.compose([
        Validators.required, Validators.minLength(1)
      ])),
      pwd: new FormControl('', Validators.compose([
        
      ])),
      nom: new FormControl('', Validators.compose([
        Validators.required, Validators.minLength(1)
      ]))
    });
  }


}