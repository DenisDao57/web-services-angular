import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(public authService : AuthService, private router: Router) { 
  }

  ngOnInit(): void {
  
  }
  
  public disconnect(){
    if(window.confirm("Vous êtes sûr de vouloir vous déconnecter ? ")){
      localStorage.removeItem('user');
      this.router.navigate(['/login']);
    }
  }

}
