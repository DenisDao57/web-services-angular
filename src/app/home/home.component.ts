import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Params } from '@angular/router';
import { delay, interval, of, Subscription, timer } from 'rxjs';
import { DialogComponent } from '../shared/dialog/dialog.component';
import { Voiture } from '../shared/types/voiture.type';
import { VoitureService } from '../shared/services/voiture.service';
import { LoanService } from '../shared/services/loan.service';
import { Loan } from '../shared/types/loan.type';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PreLoan } from '../shared/types/preloan.type';


@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  // Liste de tout les Voitures
  private _voiture: Voiture[];
  private temp: Voiture[];

  private subscription:Subscription;

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

  public xml: boolean = false;

  public marque: string = "";
  public type: string = "";
  public modele: string = "";
  public seats: number = 0;
  public date: string = "";
  public dateStart: string = "";
  public dateEnd: string = "";

  public form: FormGroup;

  public id_user: string = "";


  constructor(private _dialog: MatDialog, private _voitureService: VoitureService, private route: ActivatedRoute, private loanService:LoanService) {
    this._voiture = [];
    this.temp = [];
    this.address = new Map();
    this.add_bool = true;
    this.myFiltre = '';
    this.subscription=Subscription.EMPTY;
    this._windowScrolled=false;
    this.createSuccess=true;
    this.form = this.buildForm();
  }

  get voiture(): Voiture[] {
    return this._voiture;
  }

  get windowScrolled(): boolean{
    return this._windowScrolled;
  }

  updateVoiture() {
    this._voitureService.fetch(this.xml).subscribe({
      next: (Voiture: Voiture[]) => {
        this._voiture = Voiture;
        this.temp=Object.assign([],this._voiture);
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

    // Pour le bouton scroll up
    window.addEventListener('scroll', () => {
      this._windowScrolled = window.pageYOffset !== 0;
    });

    let user = localStorage.getItem('user');
    if (user != null) this.id_user = user;

  }

  showDialog(action: string, li?: Voiture): void {
    // open modal
    const dialog_ref = this._dialog.open(DialogComponent, {
      width: '500px',
      disableClose: false,
    });

    // set action
    if (action == 'add') {
      // ADD
      this.add_bool = true;
    } else this.add_bool = false; // EDIT

    // Si on est en mode edit
    if (!this.add_bool) {
      dialog_ref.componentInstance.mode = 'edit';
      dialog_ref.componentInstance.voiture = li;
    }

    dialog_ref.afterClosed().subscribe({
      next: (res) => {
        if (res !== undefined) {
          if (this.add_bool)
            // Si c'est en mode ADD on va create sinon on va update
            this.subscription = this._voitureService.create(res).subscribe({
              error: (e) => this.createSuccess=false,
              complete: () => this.createSuccess=true
            }
            );
          else this.subscription = this._voitureService.update(res).subscribe();
          // On update la liste
          this.updateAsync();
        }
      }
  });
  }

  public submit(event: Event) {
  
  }

  public addPre(id_voiture:string, preloan:PreLoan){
    let loan:Loan;
    let id_user = localStorage.getItem('user');
    let temp = "-1";
    if (id_user != null) temp = id_user;
    loan = {
      id_user:Number(temp),
      id_vehicle:id_voiture,
      start : preloan.start,
      end : preloan.start
    };
    this.loanService.createPre(loan).subscribe({
      next:() => {
        window.location.reload();
      }
    });
  }

  scrollToTop(): void {
    window.scrollTo(0, 0);
  }

  public dateChange(){
    if (this.temp.length != 0) this._voiture = Object.assign([],this.temp);
    var datepick = new Date(this.date);
    this.loanService.fetch().subscribe({
      next: (loans: Loan[]) => {
        loans.forEach(loan => {
          let count = -1;
          var start = new Date(loan.start);
          var end = new Date(loan.start);
          this._voiture.forEach(car => {
            count ++;
            if(car.registrationNumber === loan.id_vehicle){
              if (start.toDateString() === datepick.toDateString() || (start <= datepick && end >= datepick)){
                this._voiture.splice(count,1);
              }
            }
          });
        });
      },
    });
  }

  private buildForm(): FormGroup {
    const locat_regex = "^-?[0-9]\\d*(\\.\\d{1,18})?$";
    return new FormGroup({
      start: new FormControl('', Validators.compose([
        Validators.required
      ]))
    });
  }

  
}
