import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HashtagInputComponent } from './hashtag-input.component';

describe('HashtagInputComponent', () => {
  let component: HashtagInputComponent;
  let fixture: ComponentFixture<HashtagInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HashtagInputComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HashtagInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
