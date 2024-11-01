import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostComponent } from './post.component';

describe('PostComponent', () => {
  let component: PostComponent;
  let fixture: ComponentFixture<PostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PostComponent);
    component = fixture.componentInstance;

    component.post = {
      id: 1,
      username: 'testUser',
      content: 'Test content',
      avatarUrl: '',
      timestamp: new Date().toISOString(),
      likes: 0,
      comments: 0,
      shares: 0,
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
