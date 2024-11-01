/**
 * Test Suite for HashtagSuggestionsComponent
 *
 * Tests the functionality of a dropdown component that displays
 * and handles hashtag suggestions.
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HashtagSuggestionsComponent } from './hashtag-suggestions.component';

describe('HashtagSuggestionsComponent', () => {
  let component: HashtagSuggestionsComponent;
  let fixture: ComponentFixture<HashtagSuggestionsComponent>;

  /**
   * Set up test environment before each test
   * Configures TestBed and creates fresh component instance
   */
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HashtagSuggestionsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HashtagSuggestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /** Verify component can be created */
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /** Verify initial state of component properties */
  it('should initialize with default values', () => {
    expect(component.suggestions).toEqual([]);
    expect(component.isVisible).toBe(false);
  });

  /** Test dropdown visibility based on isVisible input */
  it('should show/hide dropdown based on isVisible input', () => {
    // Initially hidden
    let dropdown = fixture.debugElement.query(By.css('.suggestions-dropdown'));

    expect(dropdown).toBeNull();

    // Show dropdown
    component.isVisible = true;
    fixture.detectChanges();
    dropdown = fixture.debugElement.query(By.css('.suggestions-dropdown'));

    expect(dropdown).toBeTruthy();

    // Hide dropdown
    component.isVisible = false;
    fixture.detectChanges();
    dropdown = fixture.debugElement.query(By.css('.suggestions-dropdown'));

    expect(dropdown).toBeNull();
  });

  /** Test suggestion items rendering */
  it('should render suggestion items correctly', () => {
    const testTags = ['test1', 'test2', 'test3'];

    component.suggestions = testTags;
    component.isVisible = true;
    fixture.detectChanges();

    const items = fixture.debugElement.queryAll(By.css('.suggestion-item'));

    expect(items.length).toBe(testTags.length);

    items.forEach((item, index) => {
      expect(item.nativeElement.textContent).toContain(`#${testTags[index]}`);
    });
  });

  /** Test tag selection functionality */
  it('should emit selected tag when clicking a suggestion', () => {
    const testTag = 'test1';

    component.suggestions = [testTag];
    component.isVisible = true;
    fixture.detectChanges();

    // Spy on the output emitter
    spyOn(component.tagSelected, 'emit');

    // Click the suggestion item
    const item = fixture.debugElement.query(By.css('.suggestion-item'));

    item.triggerEventHandler('click', null);

    expect(component.tagSelected.emit).toHaveBeenCalledWith(testTag);
  });

  /** Test tag selection method directly */
  it('should emit tag through selectTag method', () => {
    const testTag = 'test1';

    spyOn(component.tagSelected, 'emit');

    component.selectTag(testTag);

    expect(component.tagSelected.emit).toHaveBeenCalledWith(testTag);
  });

  /** Test empty suggestions list */
  it('should handle empty suggestions list', () => {
    component.suggestions = [];
    component.isVisible = true;
    fixture.detectChanges();

    const items = fixture.debugElement.queryAll(By.css('.suggestion-item'));

    expect(items.length).toBe(0);
  });

  /** Test long suggestion list rendering */
  it('should render long suggestion lists', () => {
    const longTagList = Array.from({ length: 20 }, (_, i) => `test${i}`);

    component.suggestions = longTagList;
    component.isVisible = true;
    fixture.detectChanges();

    const items = fixture.debugElement.queryAll(By.css('.suggestion-item'));

    expect(items.length).toBe(longTagList.length);
  });
});
