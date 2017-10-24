import {Element} from './external/@polymer/polymer/polymer-element.js';
import {GestureEventListeners} from './external/@polymer/polymer/lib/mixins/gesture-event-listeners.js';
import './external/@polymer/polymer/lib/elements/dom-repeat.js';

import Api from '../../lib/client/Api.js';

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
            <dl>
              <dt>{{item.full}}</dt>
              <dd>The full URL of the entry</dd>
              <dt>{{item.clicks}}</dt>
              <dd>The number of clicks the URL has received</dd>
              <dt>{{item.identifier}}</dt>
              <dd>The shortened identifier for the URL</dd>
            </dl>
          </template>
        </section>
      </article>
    `;
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
}


customElements.define('shrtnr-ui', ShrtnrUi);
