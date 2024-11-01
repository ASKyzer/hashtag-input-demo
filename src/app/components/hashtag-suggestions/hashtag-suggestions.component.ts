import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-hashtag-suggestions',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isVisible) {
    <div class="suggestions-dropdown">
      @for (tag of suggestions; track tag) {
      <div class="suggestion-item" (click)="selectTag(tag)">#{{ tag }}</div>
      }
    </div>
    }
  `,
  styles: [
    `
      .suggestions-dropdown {
        position: absolute;
        background: var(--primary-darker);
        border: 1px solid var(--primary);
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        max-height: 200px;
        overflow-y: auto;
        min-width: 300px;
        width: fit-content;
        z-index: 1000;
      }

      .suggestion-item {
        padding: 8px 12px;
        cursor: pointer;
        transition: background-color 0.2s;
        border-bottom: 1px solid var(--primary);
      }

      .suggestion-item:hover {
        background: var(--primary-dark);
      }

      .suggestion-close-button:hover {
        background: var(--primary-dark);
      }
    `,
  ],
})
export class HashtagSuggestionsComponent {
  @Input() suggestions: string[] = [];
  @Input() selectedItem: number = 0;
  @Input() isVisible: boolean = false;
  @Output() tagSelected = new EventEmitter<string>();

  selectTag(tag: string) {
    this.tagSelected.emit(tag);
  }
}
