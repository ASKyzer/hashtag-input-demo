import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { SUGGESTED_HASHTAGS } from '@constants/hashtags.constants';
import { Editor, Extension } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { Plugin } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';
import { fromEvent, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

/**
 * HashtagInputComponent
 *
 * A rich text editor component that provides hashtag functionality with real-time suggestions.
 * Built using TipTap editor with ProseMirror extensions for hashtag highlighting and handling.
 *
 * Features:
 * - Real-time hashtag suggestions
 * - Hashtag highlighting
 * - Keyboard navigation support
 * - Position-aware suggestion dropdown
 * - Tag tracking and filtering
 */
@Component({
  selector: 'app-hashtag-input',
  standalone: true,
  imports: [CommonModule],
  template: `<div (click)="focusEditor($event)" class="editor-container">
    <div #editorElement class="editor-content"></div>
    @if (showSuggestions) {
    <div
      class="suggestions-dropdown"
      role="listbox"
      [attr.aria-label]="'Hashtag suggestions'"
      [ngStyle]="{
        left: suggestionPosition.x + 'px',
        top: suggestionPosition.y + 'px'
      }"
    >
      @for (tag of filteredTags; track tag; let i = $index) {
      <div
        #tagItem
        role="option"
        class="suggestion-item"
        [class.selected]="i === selectedIndex"
        [attr.aria-selected]="i === selectedIndex"
        (click)="selectTag(tag)"
        tabindex="-1"
      >
        #{{ tag }}
      </div>
      }
    </div>
    }
  </div>`,
  styleUrl: './hashtag-input.component.css',
})
export class HashtagInputComponent implements OnDestroy, AfterViewInit {
  /** List of all available hashtags */
  allTags = SUGGESTED_HASHTAGS;

  /** Initial content for the editor */
  @Input() content!: string;

  /** Reference to the editor DOM element */
  @ViewChild('editorElement') editorElement!: ElementRef;

  /** TipTap editor instance */
  editor!: Editor;

  /** Currently filtered suggestions based on input */
  filteredTags: string[] = [];

  /** Controls whether the editor is editable */
  @Input() isEditable = true;

  /** Index of currently selected suggestion */
  selectedIndex = -1;

  /** Controls visibility of suggestions dropdown */
  showSuggestions = false;

  /** Position coordinates for suggestions dropdown */
  suggestionPosition: { x: number; y: number } = { x: 0, y: 0 };

  /** References to suggestion items for keyboard navigation */
  @ViewChildren('tagItem') tagItems!: QueryList<ElementRef>;

  /** Set of hashtags currently used in the editor */
  usedTags: Set<string> = new Set();

  /** Emits when editor content is updated */
  @Output() update = new EventEmitter<void>();

  /** Subscription for document click events */
  private documentClickSubscription!: Subscription;

  /** Subscription for editor click events */
  private editorClickSubscription: Subscription;

  /** Subscription for keyboard events */
  private keyboardSubscription!: Subscription;

  /** Currently selected tags */
  private selectedTags: string[] = [];

  /**
   * TipTap extension for hashtag highlighting and handling
   * Provides:
   * - Tab key navigation for suggestions
   * - Enter key completion
   * - Visual highlighting of hashtags
   */
  HashtagHighlight = Extension.create({
    name: 'hashtagHighlight',
    addProseMirrorPlugins: () => [
      new Plugin({
        props: {
          handleKeyDown: (view, event) => {
            // TODO: Add support for arrow keys and tab key
            if (event.key === 'Enter') {
              const { state } = view;
              const { from } = state.selection;
              const currentLine = state.doc.textBetween(Math.max(0, from - 100), from, '\n');
              const match = currentLine.match(/#\w+$/);

              if (match) {
                const start = from - match[0].length;

                this.editor
                  .chain()
                  .focus()
                  .insertContentAt({ from: start, to: from }, match[0] + ' ')
                  .run();

                this.updateUsedTags(this.editor);
              }
            }

            return false;
          },
          decorations: (state: any) => {
            const decorations: Decoration[] = [];
            const hashtagRegex = /#\w+/g;

            state.doc.descendants((node: any, pos: any) => {
              if (node.isText) {
                Array.from(node.text.matchAll(hashtagRegex)).forEach((match: RegExpMatchArray) => {
                  const from = pos + match.index;
                  const to = from + match[0].length;
                  const nextChar = node.text[match.index + match[0].length];

                  if (nextChar === ' ' || nextChar === '\n' || match.index + match[0].length === node.text.length) {
                    decorations.push(
                      Decoration.inline(from, to, {
                        class: 'hashtag',
                        style: `color: var(--hashtag-color);`,
                      })
                    );
                  }
                });
              }
            });

            return DecorationSet.create(state.doc, decorations);
          },
        },
      }),
    ],
  });

  /**
   * Initializes the TipTap editor with necessary extensions and configurations
   */
  ngAfterViewInit() {
    this.editor = new Editor({
      autofocus: true,
      element: this.editorElement.nativeElement,
      extensions: [
        StarterKit,
        this.HashtagHighlight.configure({
          onEnter: (editor: Editor) => this.updateUsedTags(editor),
        }),
      ],
      editable: this.isEditable,
      content: this.content || '',
      onUpdate: ({ editor }) => {
        this.handleHashtagInput(editor);
        this.update.emit();
      },
    });
    this.editor.view.dom.style.outline = 'none';

    this.keyboardSubscription = fromEvent<KeyboardEvent>(document, 'keydown')
      .pipe(filter(() => this.showSuggestions))
      .subscribe((event) => {
        switch (event.key) {
          case 'Tab':
            if (this.selectedIndex === -1) {
              this.selectedIndex = 0;
              this.focusSelectedItem();
              event.preventDefault();
            }
            break;
          case 'ArrowDown':
            event.preventDefault();
            this.selectedIndex = Math.min(this.selectedIndex + 1, this.filteredTags.length - 1);
            this.focusSelectedItem();
            break;
          case 'ArrowUp':
            event.preventDefault();
            this.selectedIndex = Math.max(this.selectedIndex - 1, 0);
            this.focusSelectedItem();
            break;
          case 'Enter':
            if (this.selectedIndex >= 0) {
              event.preventDefault();
              this.selectTag(this.filteredTags[this.selectedIndex]);
            }
            break;
          case 'Escape':
            this.showSuggestions = false;
            this.selectedIndex = -1;
            break;
        }
      });

    // Add document click listener
    this.documentClickSubscription = fromEvent<MouseEvent>(document, 'click').subscribe((event) => {
      const target = event.target as HTMLElement;
      const isInsideSuggestions = target.closest('.suggestions-dropdown');
      const isHashtagInput = target.closest('.editor-container');

      if (!isInsideSuggestions && !isHashtagInput) {
        this.showSuggestions = false;
        this.selectedIndex = -1;
      }
    });
  }

  /**
   * Handles hashtag input in real-time
   * - Updates used tags
   * - Filters suggestions
   * - Updates suggestion position
   * @param editor The TipTap editor instance
   */
  handleHashtagInput(editor: Editor) {
    this.updateUsedTags(editor);

    const { from } = editor.state.selection;
    const currentLine = editor.state.doc.textBetween(Math.max(0, from - 100), from, '\n');
    const match = currentLine.match(/#(\w*)$/);

    if (match) {
      const hashtagText = match[1];

      if (hashtagText.length > 0) {
        this.filteredTags = this.allTags
          .filter((tag) => !this.usedTags.has(tag))
          .filter((tag) => tag.toLowerCase().startsWith(hashtagText.toLowerCase()));

        this.updateSuggestionPosition(from, hashtagText.length);
        this.showSuggestions = this.filteredTags.length > 0;
        this.selectedIndex = -1;
      } else {
        this.showSuggestions = false;
      }
    } else {
      this.showSuggestions = false;
    }
  }

  /**
   * Updates the set of used hashtags based on editor content
   * @param editor The TipTap editor instance
   */
  updateUsedTags(editor: Editor) {
    const content = editor.state.doc.textContent;
    const usedTagsSet = new Set(
      Array.from(content.matchAll(/#(\w+)(?=[\s\n]|$)/g))
        .map((match) => match[1])
        .filter((tag) => this.allTags.includes(tag))
    );

    this.usedTags = usedTagsSet;
  }

  /**
   * Handles tag selection from typing
   * @param tag The selected hashtag
   */
  selectTag(tag: string) {
    const { from, to } = this.editor.state.selection;
    const currentLine = this.editor.state.doc.textBetween(Math.max(0, from - 100), from, '\n');
    const match = currentLine.match(/#\w*$/);

    if (match) {
      const start = from - match[0].length;

      this.editor.chain().focus().insertContentAt({ from: start, to }, `#${tag} `).run();
      this.updateUsedTags(this.editor);
    }

    this.showSuggestions = false;
  }

  /**
   * Filters suggestions based on input query
   * @param query The search query
   * @returns Filtered list of hashtag suggestions
   */
  getSuggestions(query: string) {
    const matchingTags = this.allTags.filter((tag) => {
      const isAlreadySelected = this.editor?.getHTML().includes(`#${tag}`);

      return !isAlreadySelected && tag.toLowerCase().startsWith(query.toLowerCase());
    });

    return matchingTags;
  }

  /**
   * Handles hashtag insertion from suggestions dropdown
   * @param tag The selected hashtag
   */
  insertHashtag(tag: string) {
    const currentText = this.editor.state.doc.textBetween(
      Math.max(0, this.editor.state.selection.from - 100),
      this.editor.state.selection.from,
      '\n'
    );
    const lastHashIndex = currentText.lastIndexOf('#');

    if (lastHashIndex !== -1) {
      const pos = this.editor.state.selection.from - (currentText.length - lastHashIndex);

      this.editor
        .chain()
        .focus()
        .setTextSelection(pos)
        .deleteRange({ from: pos, to: this.editor.state.selection.from })
        .insertContent(`#${tag} `)
        .run();
    }
    this.showSuggestions = false;
  }

  /**
   * Adds an item to selected tags
   * @param item The tag to select
   */
  selectItem(item: any) {
    this.selectedTags.push(item);
  }

  /**
   * Focuses the editor
   * @param event Mouse event that triggered focus
   */
  focusEditor(event: MouseEvent) {
    this.editor.commands.focus();
  }

  /**
   * Removes a tag from selected tags
   * @param tag The tag to remove
   */
  handleDelete(tag: string) {
    this.selectedTags = this.selectedTags.filter((t) => t !== tag);
  }

  /**
   * Cleanup on component destruction
   * - Destroys editor instance
   * - Unsubscribes from observables
   */
  ngOnDestroy() {
    this.editor.destroy();

    if (this.editorClickSubscription) this.editorClickSubscription.unsubscribe();
    if (this.keyboardSubscription) this.keyboardSubscription.unsubscribe();
    if (this.documentClickSubscription) this.documentClickSubscription.unsubscribe();
  }

  /**
   * Updates the position of suggestions dropdown
   * Ensures dropdown stays within viewport bounds
   * @param from Cursor position
   * @param hashtagLength Length of current hashtag
   */
  private updateSuggestionPosition(from: number, hashtagLength: number) {
    const coords = this.editor.view.coordsAtPos(from - hashtagLength);
    const editorRect = this.editorElement.nativeElement.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const suggestionsWidth = 300;

    let xPos = coords.left - editorRect.left - 24;

    if (coords.left + suggestionsWidth > viewportWidth) {
      xPos = Math.min(xPos, viewportWidth - suggestionsWidth - editorRect.left - 8);
    }

    xPos = Math.max(0, xPos);
    this.suggestionPosition = {
      x: xPos,
      y: coords.bottom - editorRect.top + 16,
    };
  }

  private focusSelectedItem() {
    const items = this.tagItems?.toArray();
    if (items && items[this.selectedIndex]) {
      items[this.selectedIndex].nativeElement.focus();
    }
  }
}
