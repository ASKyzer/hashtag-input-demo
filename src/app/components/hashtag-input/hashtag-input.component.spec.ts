/**
 * Test Suite for HashtagInputComponent
 *
 * Tests the functionality of a component that handles hashtag input and suggestions
 * using a TipTap-based text editor.
 */
import { ComponentFixture, TestBed, fakeAsync, flush, tick } from '@angular/core/testing';
import { SUGGESTED_HASHTAGS } from '@constants/hashtags.constants';
import { Editor } from '@tiptap/core';
import { HashtagInputComponent } from './hashtag-input.component';

describe('HashtagInputComponent', () => {
  let component: HashtagInputComponent;
  let fixture: ComponentFixture<HashtagInputComponent>;

  /**
   * Set up test environment before each test
   * Configures TestBed and creates fresh component instance
   */
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HashtagInputComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HashtagInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /** Verify component can be created */
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /** Verify initial state of component properties */
  it('should initialize with default values', () => {
    expect(component.isEditable).toBe(true);
    expect(component.showSuggestions).toBe(false);
    expect(component.filteredTags).toEqual([]);
    expect(component.usedTags.size).toBe(0);
    expect(component.suggestionPosition).toEqual({ x: 0, y: 0 });
  });

  /** Test editor initialization after view init */
  it('should initialize editor in ngAfterViewInit', () => {
    component.ngAfterViewInit();

    expect(component.editor).toBeTruthy();
    expect(component.editor instanceof Editor).toBe(true);
  });

  /**
   * Test update event emission
   * Uses fakeAsync to handle debounced events
   */
  it('should emit update event when editor content changes', fakeAsync(() => {
    spyOn(component.update, 'emit');

    component.ngAfterViewInit();

    tick();

    component.update.emit();

    tick(300);

    expect(component.update.emit).toHaveBeenCalled();

    flush();
  }));

  /** Test hashtag filtering functionality */
  it('should filter tags correctly', () => {
    const query = 'test';
    const result = component.getSuggestions(query);
    const expectedTags = SUGGESTED_HASHTAGS.filter((tag) => tag.toLowerCase().startsWith(query.toLowerCase()));

    expect(result).toEqual(expectedTags);
  });

  /** Test hashtag insertion into editor */
  it('should handle hashtag insertion', () => {
    component.ngAfterViewInit();

    const testTag = 'test';

    spyOn(component.editor.commands, 'focus');
    spyOn(component.editor.commands, 'insertContent');

    component.insertHashtag(testTag);

    expect(component.showSuggestions).toBe(false);
  });

  /**
   * Test tracking of used hashtags
   * Uses mock editor to simulate content with hashtags
   */
  it('should update used tags when content changes', fakeAsync(() => {
    component.ngAfterViewInit();

    tick();

    component.allTags = ['test', 'example'];

    const mockEditor = {
      getHTML: () => '<p>#test #example</p>',
      getText: () => '#test #example',
      state: {
        doc: {
          textContent: '#test #example',
        },
      },
      commands: {
        focus: () => true,
        insertContent: () => true,
      },
      chain: () => ({
        focus: () => ({ run: () => true }),
      }),
      destroy: () => {},
    };

    component.usedTags = new Set();
    component.editor = mockEditor as any;
    component.updateUsedTags(mockEditor as any);

    fixture.detectChanges();

    tick();

    expect(component.usedTags.has('test')).toBe(true);
    expect(component.usedTags.has('example')).toBe(true);

    flush();
  }));

  /** Test proper cleanup on component destruction */
  it('should clean up resources on destroy', () => {
    component.ngAfterViewInit();

    spyOn(component.editor, 'destroy');

    component.ngOnDestroy();

    expect(component.editor.destroy).toHaveBeenCalled();
  });

  /** Test tag selection handling */
  it('should handle tag selection', () => {
    component.ngAfterViewInit();

    const testTag = 'test';

    spyOn(component.editor.chain(), 'focus').and.returnValue(component.editor.chain());
    spyOn(component.editor.chain(), 'insertContentAt').and.returnValue(component.editor.chain());

    component.selectTag(testTag);

    expect(component.showSuggestions).toBe(false);
  });

  /** Test suggestion dropdown positioning */
  it('should update suggestion position within viewport bounds', () => {
    component.ngAfterViewInit();
    component.editor.commands.setContent('Some text');

    const from = 1;
    const hashtagLength = 1;

    (component as any).updateSuggestionPosition(from, hashtagLength);

    expect(component.suggestionPosition.x).toBeGreaterThanOrEqual(0);
    expect(component.suggestionPosition.y).toBeDefined();
  });
});
