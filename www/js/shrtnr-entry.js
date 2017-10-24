import {Element} from './external/@polymer/polymer/polymer-element.js';
import {GestureEventListeners} from './external/@polymer/polymer/lib/mixins/gesture-event-listeners.js';

export class ShrtnrEntry extends GestureEventListeners(Element) {
  static get properties() {
    return {
      full: {
        type: String
      },
      clicks: {
        type: Number
      },
      identifier: {
        type: String
      }
    };
  }


  static get template() {
    return `
      <style>
        :host {
          display: block;
        }
      </style>

      <article>
        <section>
          <a href="/{{identifier}}">{{full}}</a>
          <button on-tap="_onDelete">Delete</button>
        </section>
      </article>
    `;
  }

  _onDelete() {
    const event = new CustomEvent('delete', {bubbles: false, detail: this.identifier.toString()});
    this.dispatchEvent(event);
  }
}

customElements.define('shrtnr-entry', ShrtnrEntry);
