((DOMParser, fetch, document) => {
  'use strict';

  const fallback = () => {
    const title = 'Need ECMAscript module loading support';
    const href = 'https://browsehappy.com/';
    document.body.innerHTML = `
      <section id="module-loading-warning">
        <p>Please <a title="${title}" href=${href}>upgrade</a> your browser</p>
      </section>`;

    const style = document.createElement('style');
    const text = document.createTextNode(`
      #module-loading-warning {
        width: 100%;
        max-width: 20em;
        min-width: 15em;
        padding: .5em;
        border: 1px solid black;
        margin: 0 auto;
        display: block;
        transform: translateY(.5em);
      }

      #module-loading-warning p {
        text-align: center;
      }

      #module-loading-warning a {
        text-decoration: none;
      }

      #module-loading-warning a,
      #module-loading-warning a:hover,
      #module-loading-warning a:visited {
        color: #cc0000;
      }
    `);
    style.appendChild(text);
    document.head.appendChild(style);
  };

  const {readyState} = document;

  if (readyState === 'interactive' || readyState === 'complete') {
    fallback();
  } else {
    document.addEventListener('DOMContentLoaded', fallback);
  }
})(window.DOMParser, window.fetch, document);
