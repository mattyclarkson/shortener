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
      <article>
        <section id="entry">
          <input id="url" placeholder="Enter URL to shorten" on-input="_onInput"></input>
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
    super.connectedCallback()
    const array = await this.api.query();
    for (const entry of array) {
      this.push('entries', entry);
    }
    console.log(this.entries);
  }

  _onInput() {
    this.$.submit.disabled = !this.$.url.value;
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
