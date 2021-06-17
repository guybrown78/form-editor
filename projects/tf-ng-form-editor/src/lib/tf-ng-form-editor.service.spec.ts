import { TestBed } from '@angular/core/testing';

import { TfNgFormEditorService } from './tf-ng-form-editor.service';

describe('TfNgFormEditorService', () => {
  let service: TfNgFormEditorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TfNgFormEditorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
