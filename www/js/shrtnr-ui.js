import {Element} from './external/@polymer/polymer/polymer-element.js';
import {GestureEventListeners} from './external/@polymer/polymer/lib/mixins/gesture-event-listeners.js';
import './external/@polymer/polymer/lib/elements/dom-repeat.js';

import Api from '../../lib/client/Api.js';

import './shrtnr-entry.js';

export class ShrtnrUi extends GestureEventListeners(Element) {
  static get properties() {
    return {
      entries: {
        type: Array,
        value: () => []
      },
      api: {
        type: Object,
        value: () => new Api(),
        readOnly: true
      },
    };
  }


  static get template() {
    return `
      <style>
        :host {
          display: block;
          --shrtnr-grey: #9e9e9e;
          --shrtnr-grey-lighten-3: #eeeeee;
          --shrtnr-green: #4caf50;
          --shrtnr-green-darken-3: #2e7d32;
          --shrtnr-red-lighten-4: #ffcdd2;
        }

        article {
          padding: 1em;
        }

        #entry {
          padding-bottom: 1em;
          border-bottom: 1px solid var(--shrtnr-grey);
          margin-bottom: 1em;
          width: 100%;
          display: flex;
        }

        #url {
          flex: 1;
          padding: 1em;
          margin-right: 1em;
          border-radius: .5em 0 0 .5em;
          border: 1px solid var(--shrtnr-grey);
          outline: none;
          font-size: 1em;
        }

        #url:invalid {
          background-color: var(--shrtnr-red-lighten-4);
        }

        button {
          width: 6em;
          color: white;
          background-color: var(--shrtnr-green);
          border: 1px solid var(--shrtnr-green-darken-3);
          border-radius: 0 .5em .5em 0;
          margin: 0;
          padding: 0;
          cursor: pointer;
        }

        button:disabled {
          pointer-events: none;
          color: var(--shrtnr-grey);
          background-color: var(--shrtnr-grey-lighten-3);
          border: 1px solid var(--shrtnr-grey);
        }

        shrtnr-entry + shrtnr-entry {
          margin-top: 1em;
        }
      </style>

      <article>
        <section id="entry">
          <input
            id="url"
            placeholder="Enter URL to shorten"
            pattern="https?://.+"
            maxLength="1024"
            on-input="_onInput"></input>
          <button disabled id="submit" on-tap="_onSubmit">Shorten</button>
        </section>
        <section id="entries">
          <template is="dom-repeat" items="[[entries]]">
            <shrtnr-entry
              full="{{item.full}}"
              clicks="{{item.clicks}}"
              identifier="{{item.identifier}}"
              on-delete="_onDelete">
            </shrtnr-entry>
          </template>
        </section>
      </article>
    `;
  }

  async connectedCallback() {
    super.connectedCallback();
    const array = await this.api.query();
    for (const entry of array) {
      this.push('entries', entry);
    }
  }

  _onInput() {
    this.$.submit.disabled = !(this.$.url.value && this.$.url.validity.valid);
  }

  async _onSubmit() {
    try{
      this.$.url.disabled = true;
      this.$.submit.disabled = true;

      const url = this.$.url.value;
      const entry = await this.api.shorten(url);
      this.push('entries', entry);
    } finally {
      this.$.url.disabled = false;
      this.$.submit.disabled = false;
      this.$.url.value = '';
    }
  }

  async _onDelete(e, detail) {
    const deleted = await this.api.delete(detail);
    const index = this.entries.findIndex(entry => entry.identifier.id === deleted.identifier.id);
    this.splice('entries', index, 1);
  }
}

customElements.define('shrtnr-ui', ShrtnrUi);
