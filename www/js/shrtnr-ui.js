import {Element} from './external/@polymer/polymer/polymer-element.js';

export class ShrtnrUi extends Element {
  static get template() {
    return `
      <p>Hello, world!</p>
    `;
  }
}


customElements.define('shrtnr-ui', ShrtnrUi);
