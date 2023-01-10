import { Component } from '@angular/core';
import { ActivatedRoute, Route, Router, RouterLink } from '@angular/router';
import { DialogComponent } from '../shared/dialog/dialog.component';
import { AuthService } from '../shared/services/auth.service';
import { LoanService } from '../shared/services/loan.service';
import { VoitureService } from '../shared/services/voiture.service';
import { Loan } from '../shared/types/loan.type';
import { TempLoan } from '../shared/types/temp_loan';
import { Voiture } from '../shared/types/voiture.type';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css']
})
export class LocationComponent {
  // Liste de tout les Voitures
  private _voiture: TempLoan[];
  public preVoiture: TempLoan[];

  // Booleen pour différencier add et edit | Ici on va dire que si add_bool = true
  // alors c'est qu'on veut add
  private add_bool: Boolean;
  // Booleen pour le scroll up
  private _windowScrolled: boolean;
  // Booleen pour savoir si le create a fail
  public createSuccess: boolean;
  // Variable pour le filtre (barre de recherche)
  public myFiltre: string;
  // Map pour associer une addresse à un Voiture
  public address: Map<string, string>;

  public marque: string = "";
  public type: string = "";
  public modele: string = "";
  public seats: number = 0;
  public date: string = "";

  public today:Date = new Date();


  constructor(private _voitureService: VoitureService, 
    private route: ActivatedRoute, private loanService:LoanService,
    public authService:AuthService, public router:Router) {
    this._voiture = [];
    this.preVoiture = [];
    this.address = new Map();
    this.add_bool = true;
    this.myFiltre = '';
    this._windowScrolled=false;
    this.createSuccess=true;
  }

  get voiture(): TempLoan[] {
    return this._voiture;
  }

  get windowScrolled(): boolean{
    return this._windowScrolled;
  }

  updateVoiture() {
    this._voitureService.fetch(false).subscribe({
      next: (voitures: Voiture[]) => {
        this.loanService.fetch().subscribe({
          next: (loans: Loan[]) => {
            loans.forEach(loan => {
              if (loan.id_user==Number(localStorage.getItem('user'))){
                voitures.forEach(voiture => {
                  if (loan.id_vehicle === voiture.registrationNumber){
                    var temp = {
                      start:      new Date(loan.start),
                      end:        new Date(loan.end),
                      registrationNumber: voiture.registrationNumber,
                      vehiculeType: voiture.vehiculeType,
                      brand: voiture.brand,
                      model: voiture.model,
                      category: voiture.category,
                      gearbox: voiture.gearbox,
                      seats: voiture.seats,
                      comments: voiture.comments
                    }
                    this._voiture.push(temp);
                  }
                });
            }
            });
          },
        });
      },
    });
  }

  updatePreVoiture() {
    this._voitureService.fetch(false).subscribe({
      next: (voitures: Voiture[]) => {
        this.loanService.fetchPre().subscribe({
          next: (loans: Loan[]) => {
            loans.forEach(loan => {
              if (loan.id_user==Number(localStorage.getItem('user'))){
                voitures.forEach(voiture => {
                  if (loan.id_vehicle === voiture.registrationNumber){
                    var temp = {
                      start:      new Date(loan.start),
                      end:        new Date(loan.end),
                      registrationNumber: voiture.registrationNumber,
                      vehiculeType: voiture.vehiculeType,
                      brand: voiture.brand,
                      model: voiture.model,
                      category: voiture.category,
                      gearbox: voiture.gearbox,
                      seats: voiture.seats,
                      comments: voiture.comments
                    }
                    this.preVoiture.push(temp);
                  }
                });
            }
            });
          },
        });
      },
    });
  }

  // On update en asynchrone les Voitures
  resolve(sec:number) {
    const time_in_sec = sec*1000;
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(0);
      }, time_in_sec);
    });
  }

  async updateAsync() {
    const value = <number>await this.resolve(0.2);
    this.updateVoiture();
  }


  // ON INIT 
  ngOnInit(): void {
    this.updateVoiture();
    this.updatePreVoiture();
    if (!this.authService.isAuth()) this.router.navigate(['/home']);
  }

  public submit(event: Event) {
  
  }

  scrollToTop(): void {
    window.scrollTo(0, 0);
  }


}
