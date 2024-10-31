import { Component, OnDestroy, OnInit } from '@angular/core';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';

@Component({
  selector: 'app-hashtag-input',
  standalone: true,
  imports: [],
  templateUrl: './hashtag-input.component.html',
  styleUrl: './hashtag-input.component.css',
})
export class HashtagInputComponent implements OnInit, OnDestroy {
  private editor: Editor;

  ngOnInit() {
    this.editor = new Editor({
      element: document.querySelector('.editor-content')!,
      extensions: [StarterKit],
      editorProps: {
        attributes: {
          class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
        },
      },
    });
  }

  ngOnDestroy() {
    this.editor.destroy();
  }
}
