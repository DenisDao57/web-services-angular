import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Voiture } from '../types/voiture.type';
@Component({
  selector: 'nwt-add-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: [ './dialog.component.css' ]
})
export class DialogComponent implements OnInit {

  /**
   * Component constructor
   */

  // Mode pour add ou edit | "add" ou "edit"
  public mode:string;
  // Voiture à edit dans le cas "edit"
  public voiture?:Voiture;

  constructor(private _dialogRef: MatDialogRef<DialogComponent>){
    this.mode="add";
  }



  /**
   * OnInit implementation
   */
  ngOnInit(): void {
    
  }

  /**
   * Function to cancel the process and close the modal
   */
  onCancel(): void {
    this._dialogRef.close();
  }

  onSave(voiture: Voiture): void {
    this._dialogRef.close(voiture);
  }

  /**
   * Function to close the modal and send person to parent
   */
}