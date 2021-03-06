import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



import { TfNgCoreModule } from 'tf-ng-core'
import { TfNgFormModule} from 'tf-ng-form'

import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';

import { TfNgFormEditorComponent } from './tf-ng-form-editor.component';
import { FieldPickerComponent } from './components/field-picker/field-picker.component';


import { NgZorroModule } from './ng-zorro.module'

import { Configurations } from './moduleConfig';

import { NavigationComponent } from './components/navigation/navigation.component';
import { NavigationSideBarComponent } from './components/navigation-side-bar/navigation-side-bar.component';
import { NavigationItemComponent } from './components/navigation-item/navigation-item.component';
import { MetaSettingsComponent } from './components/meta-settings/meta-settings.component';
import { TreeViewComponent } from './components/tree-view/tree-view.component';
import { FieldItemComponent } from './components/field-item/field-item.component';
import { TreeItemComponent } from './components/tree-item/tree-item.component';
import { FieldDetailsComponent } from './components/field-details/field-details.component';
import { HeaderComponent } from './components/field-item/header/header.component';
import { PageHeaderComponent } from './components/page-header/page-header.component';
import { OptionsComponent } from './components/field-item/options/options.component';
import { AddRowComponent } from './components/add-row/add-row.component';
import { ComponentOptionsComponent } from './components/field-details/component-options/component-options.component';
import { SwitchWrapperComponent } from './components/switch-wrapper/switch-wrapper.component';
import { FieldGroupComponent } from './components/field-item/field-group/field-group.component';
import { TreeDevComponent } from './components/tree-dev/tree-dev.component';
import { FieldComponent } from './components/field/field.component';
import { GridComponent } from './components/field-item/grid/grid.component';
import { CellFormgroupComponent } from './components/field-item/grid/cell-formgroup/cell-formgroup.component';
import { CellComponent } from './components/field-item/grid/cell/cell.component';
import { RowComponent } from './components/field-item/grid/row/row.component';
import { CellFieldItemComponent } from './components/field-item/grid/cell-field-item/cell-field-item.component';
import { TabItemsComponent } from './components/field-item/tab-items/tab-items.component';
import { EditorComponent } from './components/field/editor/editor.component';
import { LayoutComponent } from './components/field/layout/layout.component';
import { ConfigOptionsComponent } from './components/field/config-options/config-options.component';
import { InlinePreviewComponent } from './components/inline-preview/inline-preview.component';

import { TfNgFormEditorService } from './tf-ng-form-editor.service';
import { FormEditorConfigService } from './form-editor-config.service';
import { NewFormMetaComponent } from './components/new-form-meta/new-form-meta.component';
import { PreviewSettingsComponent } from './components/preview-settings/preview-settings.component';
import { PermissionsComponent } from './components/field/permissions/permissions.component';
import { RichTextComponent } from './components/rich-text/rich-text.component';
import { DateOptionsComponent } from './components/field/config-options/date-options/date-options.component';

import { CanDeactivateGuard } from './tf-ng-form-editor.guard';
import { GridColumnLayoutSelectionComponent } from './components/field-details/grid-column-layout-selection/grid-column-layout-selection.component';
import { NumberOptionsComponent } from './components/field-details/number-options/number-options.component'





@NgModule({
  declarations: [
    TfNgFormEditorComponent,
    FieldPickerComponent,
    NavigationComponent,
    NavigationSideBarComponent,
    NavigationItemComponent,
    MetaSettingsComponent,
    TreeViewComponent,
    FieldItemComponent,
    TreeItemComponent,
    FieldDetailsComponent,
    HeaderComponent,
    PageHeaderComponent,
    OptionsComponent,
    AddRowComponent,
    ComponentOptionsComponent,
    SwitchWrapperComponent,
    FieldGroupComponent,
    TreeDevComponent,
    FieldComponent,
    GridComponent,
    CellFormgroupComponent,
    CellComponent,
    RowComponent,
    CellFieldItemComponent,
    TabItemsComponent,
    EditorComponent,
    LayoutComponent,
    ConfigOptionsComponent,
    InlinePreviewComponent,
    NewFormMetaComponent,
    PreviewSettingsComponent,
    PermissionsComponent,
    RichTextComponent,
    DateOptionsComponent,
    GridColumnLayoutSelectionComponent,
    NumberOptionsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TfNgCoreModule,
    TfNgFormModule,
    NgZorroModule,
    FroalaEditorModule,
    FroalaViewModule
  ],
  exports: [
    TfNgFormEditorComponent
  ],
  providers: [
    CanDeactivateGuard,
  ]
})
export class TfNgFormEditorModule { }
// export class TfNgFormEditorModule {
//   // Create this static method in the library module.
//   public static forRoot(config: Configurations): ModuleWithProviders<TfNgFormEditorModule> {
//     return {
//       ngModule: TfNgFormEditorModule,
//       providers: [
//         { provide: Configurations, useValue: config }
//       ]
//     };
//   }
// }
