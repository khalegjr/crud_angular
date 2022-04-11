import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { ElementDialogComponent } from 'src/app/shared/element-dialog/element-dialog.component';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  @ViewChild(MatTable)
  table!: MatTable<any>;
  displayedColumns: string[] = [
    'position',
    'name',
    'weight',
    'symbol',
    'action',
  ];
  dataSource = ELEMENT_DATA;

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {}

  openDialog(element: PeriodicElement | null, action: string): void {
    if (element === null && action === 'create') {
      const dialogRef = this.dialog.open(ElementDialogComponent, {
        width: '250px',
        data: this.clearForm(),
      });
      dialogRef.componentInstance.action = action;

      this.createElement(dialogRef);
    } else {
      const dialogRef = this.dialog.open(ElementDialogComponent, {
        width: '250px',
        // data: element,
        data: {
          position: element?.position,
          name: element?.name,
          weight: element?.weight,
          symbol: element?.symbol,
        },
      });
      dialogRef.componentInstance.action = action;

      this.editElement(dialogRef);
    }
  }

  clearForm() {
    return {
      position: null,
      name: null,
      weight: null,
      symbol: null,
    };
  }

  createElement(dialogRef: MatDialogRef<ElementDialogComponent | null>): void {
    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        this.dataSource.push(result);
        this.table.renderRows();
      }
      console.log('The dialog was closed');
    });
  }

  // TODO: fix the edit of position
  editElement(dialogRef: MatDialogRef<ElementDialogComponent>): void {
    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        const index = this.dataSource.findIndex(
          (item) => item.position === result.position
        );

        this.dataSource[index] = result;
        this.table.renderRows();
      }
    });
  }

  deleteElement(position: number): void {
    const index: number = this.dataSource.findIndex(
      (item) => item.position === position
    );
    if (index > -1) {
      this.dataSource.splice(index, 1);
      this.table.renderRows();
    }
  }
}
