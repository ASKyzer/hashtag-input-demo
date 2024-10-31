import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { SUGGESTED_HASHTAGS } from '../../constants/hashtags.constants';
import { HashtagSuggestionsComponent } from '../hashtag-suggestions/hashtag-suggestions.component';

@Component({
  selector: 'app-hashtag-input',
  standalone: true,
  imports: [CommonModule, HashtagSuggestionsComponent],
  templateUrl: './hashtag-input.component.html',
  styleUrl: './hashtag-input.component.css',
})
export class HashtagInputComponent implements OnInit, OnDestroy {
  private editor: Editor;
  showSuggestions = false;
  filteredTags: string[] = [];

  private availableTags = SUGGESTED_HASHTAGS;

  ngOnInit() {
    this.editor = new Editor({
      element: document.querySelector('.editor-content')!,
      extensions: [StarterKit],
      editorProps: {
        attributes: {
          class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
        },
        handleKeyDown: (view: any, event: KeyboardEvent) => {
          if (event.key === 'Escape' && this.showSuggestions) {
            this.showSuggestions = false;
            return true;
          }
          return false;
        },
      },
      onUpdate: ({ editor }) => {
        this.checkForHashtag(editor);
      },
    });
  }

  private checkForHashtag(editor: Editor) {
    const text = editor.state.doc.textBetween(
      Math.max(0, editor.state.selection.from - 100),
      editor.state.selection.from,
      '\n'
    );

    const match = text.match(/#(\w*)$/);

    if (match) {
      const query = match[1].toLowerCase();
      this.filteredTags = this.availableTags.filter((tag) => tag.toLowerCase().startsWith(query)).slice(0, 5);
      this.showSuggestions = this.filteredTags.length > 0;
    } else {
      this.showSuggestions = false;
    }
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

  ngOnDestroy() {
    this.editor.destroy();
  }
}
