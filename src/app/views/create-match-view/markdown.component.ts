import marked from 'marked';
import { Renderer } from 'marked';
import highlightjs from 'highlight.js';
import { DOMPurify } from 'dompurify';

import {
    Component, Input, OnChanges, SimpleChange, ViewEncapsulation
} from '@angular/core';
import {
    DomSanitizer, SafeHtml
} from '@angular/platform-browser';

@Component({
    selector: 'markdown',
    template: '<pre [innerHTML]="data"></pre>',
    encapsulation: ViewEncapsulation.None
})
export class MarkdownComponent implements OnChanges {

    @Input() 
    text: string= '';
    data: SafeHtml = {};
    md: any;

    static highlightCode(code: string, language: string): string {
        if (!(language && highlightjs.getLanguage(language))) {
             // use 'markdown' as default language
            language = 'markdown';
        }

        const result = highlightjs.highlight(language, code).value;
        return `<code class="hljs ${language}">${result}</code>`;
    }

    constructor(private sanitizer: DomSanitizer) {
        const renderer = new Renderer();
        renderer.code = MarkdownComponent.highlightCode;
        this.md = marked.setOptions({ renderer });
    }

    markdownToSafeHtml(value: string): SafeHtml {
        const html = this.md(value);
        const safeHtml = DOMPurify.sanitize(html);
        return this.sanitizer.bypassSecurityTrustHtml(safeHtml);
    }

    ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
        for (const propName in changes) {
            if (propName === 'text') {
                const value = changes[propName].currentValue;
                if (value) {
                    this.data = this.markdownToSafeHtml(value);
                }
            }
        }
    }
}