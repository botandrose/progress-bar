class ProgressBar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._percent = 0;
  }

  connectedCallback() {
    this.render();
    this.updateBar();
  }

  get percent() {
    return this._percent;
  }

  set percent(value) {
    this._percent = Number(value) || 0;
    this.setAttribute('percent', this._percent);
    this.updateBar();
  }

  static get observedAttributes() {
    return ['percent'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'percent') {
      this._percent = Number(newValue) || 0;
      this.updateBar();
    }
  }

  updateBar() {
    const bar = this.shadowRoot?.querySelector('.bar');
    if (bar) {
      bar.style.width = `${this._percent}%`;
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          --progress-color: rgb(57, 137, 39);
          --progress-duration: 120ms;
          --bar-height: 32px;
          --bar-radius: 4px;
          --bar-padding: 8px;
          --bar-border-color: #999;

          display: block;
          position: relative;
          padding: var(--bar-padding);
          border: 1px solid var(--bar-border-color);
          border-radius: var(--bar-radius);
        }

        .bar {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          background: var(--progress-color);
          width: 0%;
          transition: width var(--progress-duration) ease, opacity 60ms ease;
          border-radius: var(--bar-radius);
        }

        .content {
          position: relative;
          display: block;
          color: white;
          font-size: 13px;
          z-index: 1;
        }
      </style>

      <div class="bar"></div>
      <span class="content">
        <slot></slot>
      </span>
    `;
  }
}

if (!customElements.get('progress-bar')) {
  customElements.define('progress-bar', ProgressBar);
}

export default ProgressBar;
