import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { HashtagSuggestionsComponent } from '@components/hashtag-suggestions/hashtag-suggestions.component';
import { SUGGESTED_HASHTAGS } from '@constants/hashtags.constants';
import { Editor, Extension } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { Plugin } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-hashtag-input',
  standalone: true,
  imports: [CommonModule, HashtagSuggestionsComponent],
  template: `<div (click)="focusEditor($event)" class="editor-container">
    <div #editorElement class="editor-content"></div>
    <app-hashtag-suggestions
      class="suggestions"
      [suggestions]="filteredTags"
      [isVisible]="showSuggestions"
      (tagSelected)="insertHashtag($event)"
      [ngStyle]="{
        left: suggestionPosition.x + 'px',
        top: suggestionPosition.y + 'px'
      }"
    >
    </app-hashtag-suggestions>
  </div>`,
  styleUrl: './hashtag-input.component.css',
})
export class HashtagInputComponent implements OnDestroy, AfterViewInit {
  allTags = SUGGESTED_HASHTAGS;
  @ViewChild('editorElement') editorElement!: ElementRef;
  editor!: Editor;
  filteredTags: string[] = [];
  showSuggestions = false;
  suggestionPosition: { x: number; y: number } = { x: 0, y: 0 };
  @ViewChildren('tagItem') tagItems!: QueryList<ElementRef>;
  usedTags: Set<string> = new Set();

  private editorClickSubscription: Subscription;
  private selectedTags: string[] = [];

  HashtagHighlight = Extension.create({
    name: 'hashtagHighlight',
    addProseMirrorPlugins: () => [
      new Plugin({
        props: {
          handleKeyDown: (view, event) => {
            if (event.key === 'Tab' && this.showSuggestions) {
              event.preventDefault();

              if (this.tagItems.first) this.tagItems.first.nativeElement.focus();

              return true;
            }
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

  ngAfterViewInit() {
    this.editor = new Editor({
      element: this.editorElement.nativeElement,
      extensions: [
        StarterKit,
        this.HashtagHighlight.configure({
          onEnter: (editor: Editor) => this.updateUsedTags(editor),
        }),
      ],
      content: '',
      onUpdate: ({ editor }) => {
        this.handleHashtagInput(editor);
      },
    });
    this.editor.view.dom.style.outline = 'none';
  }

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

        if (!this.showSuggestions) {
          this.updateSuggestionPosition(from, hashtagText.length);
        }
        this.showSuggestions = this.filteredTags.length > 0;
      } else {
        this.showSuggestions = false;
      }
    } else {
      this.showSuggestions = false;
    }
  }

  updateUsedTags(editor: Editor) {
    const content = editor.state.doc.textContent;
    const usedTagsSet = new Set(
      Array.from(content.matchAll(/#(\w+)(?=[\s\n]|$)/g))
        .map((match) => match[1])
        .filter((tag) => this.allTags.includes(tag))
    );

    this.usedTags = usedTagsSet;
  }

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

  getSuggestions(query: string) {
    const matchingTags = this.allTags.filter((tag) => {
      const isAlreadySelected = this.editor?.getHTML().includes(`#${tag}`);

      return !isAlreadySelected && tag.toLowerCase().startsWith(query.toLowerCase());
    });

    return matchingTags;
  }

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

  selectItem(item: any) {
    this.selectedTags.push(item);
  }

  focusEditor(event: MouseEvent) {
    this.editor.commands.focus();
  }

  handleDelete(tag: string) {
    this.selectedTags = this.selectedTags.filter((t) => t !== tag);
  }

  ngOnDestroy() {
    this.editor.destroy();

    if (this.editorClickSubscription) this.editorClickSubscription.unsubscribe();
  }

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
}
