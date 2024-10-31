import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HashtagSuggestionsComponent } from './hashtag-suggestions.component';

describe('HashtagSuggestionsComponent', () => {
  let component: HashtagSuggestionsComponent;
  let fixture: ComponentFixture<HashtagSuggestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HashtagSuggestionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HashtagSuggestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
