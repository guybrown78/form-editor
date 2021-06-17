import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TfNgFormEditorComponent } from './tf-ng-form-editor.component';

describe('TfNgFormEditorComponent', () => {
  let component: TfNgFormEditorComponent;
  let fixture: ComponentFixture<TfNgFormEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TfNgFormEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TfNgFormEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
