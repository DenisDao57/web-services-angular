import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Voiture } from '../types/voiture.type';

@Component({
  selector: 'nwt-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit, OnChanges {
  // private property to store cancel$ value
  private readonly _cancel$: EventEmitter<void>;
  // private property to store submit$ value
  private readonly _submit$: EventEmitter<Voiture>;

  private readonly _form: FormGroup;

  /**
   * Component constructor
   */
  constructor() {
    this._cancel$ = new EventEmitter<void>();
    this._submit$ = new EventEmitter<Voiture>();
    this._form = this._buildForm();
  }


  // Si Voiture change, ça veut dire qu'on veut pré remplir quelque chose 
  ngOnChanges(changes: SimpleChanges): void {

    if (changes['Voiture'] && this.voiture != undefined){
      this._form.patchValue(this.voiture);
    }

  }

  @Input()
  public action:string = '';

  @Input()
  public voiture?:Voiture = undefined;
  

  
  /**
   * Returns private property _cancel$
   */
  @Output('cancel')
  get cancel$(): EventEmitter<void> {
    return this._cancel$;
  }

   /**
   * Returns private property _submit$ || Le submit en output sert surtout à fermer le dialog
   * Puisque liste.component prend déjà les données via le dialog close
   */
  @Output('submit')
  get submit$(): EventEmitter<Voiture> {
    return this._submit$;
  }
  

  

  /**
   * OnInit implementation
   */
  ngOnInit(): void {
    //console.log(this.Voiture);
  }

  cancel(): void {
    this._cancel$.emit();
  }

  submit(Voiture: Voiture): void {
    this._submit$.emit(Voiture);
  }

  get form(): FormGroup {
    return this._form;
  }

  private _buildForm(): FormGroup {
    const locat_regex = "^-?[0-9]\\d*(\\.\\d{1,18})?$";
    return new FormGroup({
      registrationNumber: new FormControl('', Validators.compose([
        Validators.required
      ])),
      vehiculeType: new FormControl('', Validators.compose([
        Validators.required
      ])),
      brand: new FormControl('', Validators.compose([
        Validators.required
      ])),
      model: new FormControl('', Validators.compose([
        Validators.required
      ])),
      seats: new FormControl('', Validators.compose([
        Validators.required, Validators.pattern(locat_regex)
      ]))
    });
  }

}