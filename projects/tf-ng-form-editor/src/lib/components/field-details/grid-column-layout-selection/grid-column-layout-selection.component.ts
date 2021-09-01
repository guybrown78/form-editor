import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter
} from '@angular/core';
import {
  FormEditorConfigService,
  SelectableGridColumnDefinitions,
} from '../../../form-editor-config.service';

@Component({
  selector: 'form-editor-grid-column-layout-selection',
  templateUrl: './grid-column-layout-selection.component.html',
  styleUrls: ['./grid-column-layout-selection.component.css']
})
export class GridColumnLayoutSelectionComponent implements OnInit {

  private _selectedColumnLayout:number[];
  @Input('selectedColumnLayout') set selectedColumnLayout(values:number[]){
    this.selected = values.toString()
    this._selectedColumnLayout = values;
  }

  selected:string;
  columnDefinitions:SelectableGridColumnDefinitions[];

  private _selectedColumnDefinition:SelectableGridColumnDefinitions;
  @Input('selectedColumnDefinition') set selectedColumnDefinition(value:SelectableGridColumnDefinitions){
    this._selectedColumnDefinition = value;
  }
  get selectedColumnDefinition():SelectableGridColumnDefinitions{
    return this._selectedColumnDefinition;
  }

  @Output("onSelectedColumnLayout") onSelectedColumnLayout = new EventEmitter<number[]>()

  constructor(
    private formEditorConfig:FormEditorConfigService
  ) { }

  ngOnInit(): void {
    this.columnDefinitions = this.formEditorConfig._columnDefinitions;
  }

  onColumnLayoutChange(columnWidths:number[]){
    this._selectedColumnLayout = this.selected.split(",").map(n => Number(n));
    this.onSelectedColumnLayout.emit(this._selectedColumnLayout);
  }

}
