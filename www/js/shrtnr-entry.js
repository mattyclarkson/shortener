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
          --shrtnr-grey: #9e9e9e;
          --shrtnr-grey-darken-3: #424242;
          --shrtnr-transition: .5s;
          --shrtnr-red: #f44336;
          --shrtnr-red-darken-3: #c62828;
          --shrtnr-blue-lighten-5: #e3f2fd;
        }

        article {
          width: 100%;
          display: flex;
        }

        a {
          flex: 1;
          padding: 1em;
          margin-right: 1em;
          border-radius: .5em 0 0 .5em;
          border: 1px solid var(--shrtnr-grey);
          color: var(--shrtnr-grey);
          text-decoration: none;
          transition: background-color var(--shrtnr-transition), color var(--shrtnr-transition);
        }

        a:hover {
          color: var(--shrtnr-grey-darken-3);
          background-color: var(--shrtnr-blue-lighten-5);
        }

        button {
          width: 6em;
          color: white;
          background-color: var(--shrtnr-red);
          border: 1px solid var(--shrtnr-red-darken-3);
          border-radius: 0 .5em .5em 0;
          margin: 0;
          padding: 0;
          cursor: pointer;
        }
      </style>

      <article>
        <a href="/{{identifier}}">{{full}}</a>
        <button on-tap="_onDelete">Delete</button>
      </article>
    `;
  }

  _onDelete() {
    const event = new CustomEvent('delete', {bubbles: false, detail: this.identifier.toString()});
    this.dispatchEvent(event);
  }
}

customElements.define('shrtnr-entry', ShrtnrEntry);
