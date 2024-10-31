import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-hashtag-suggestions',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="isVisible" class="suggestions-dropdown">
      <div *ngFor="let tag of suggestions" class="suggestion-item" (click)="selectTag(tag)">#{{ tag }}</div>
    </div>
  `,
  styles: [
    `
      .suggestions-dropdown {
        position: absolute;
        background: white;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        max-height: 200px;
        overflow-y: auto;
        width: 200px;
        z-index: 1000;
      }

      .suggestion-item {
        padding: 8px 12px;
        cursor: pointer;
        transition: background-color 0.2s;
      }

      .suggestion-item:hover {
        background-color: #f0f0f0;
      }
    `,
  ],
})
export class HashtagSuggestionsComponent {
  @Input() suggestions: string[] = [];
  @Input() isVisible: boolean = false;
  @Output() tagSelected = new EventEmitter<string>();

  selectTag(tag: string) {
    this.tagSelected.emit(tag);
  }
}
