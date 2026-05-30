const STYLES = `
  :host {
    --progress-color: #2E7D32;
    --error-color: #7a242f;
    --progress-track-color: #333333;
    --progress-duration: 120ms;
    --bar-height: 32px;
    --bar-radius: 4px;
    --bar-padding: 8px;
    --bar-border-color: #999;
    display: block;
    background: var(--progress-track-color);
    border: 1px solid var(--bar-border-color);
    border-radius: var(--bar-radius);
  }

  .content {
    position: relative;
    display: flex;
    align-items: center;
    min-height: var(--bar-height);
    box-sizing: border-box;
    padding: var(--bar-padding);
    color: white;
    font-size: 13px;
    z-index: 0;
  }

  .bar {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 0%;
    background: var(--progress-color);
    transition: width var(--progress-duration) ease, opacity 60ms ease;
    border-radius: var(--bar-radius);
    z-index: -1;
  }

  :host(.error) .bar {
    background: var(--error-color);
  }
`;

let styleSheet = null;
function getStyleSheet() {
  if (!styleSheet) {
    styleSheet = new CSSStyleSheet();
    styleSheet.replaceSync(STYLES);
  }
  return styleSheet;
}

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
    this.shadowRoot.adoptedStyleSheets = [getStyleSheet()];
    this.shadowRoot.innerHTML = `
      <span class="content">
        <div class="bar"></div>
        <slot></slot>
      </span>
    `;
  }
}

if (!customElements.get('progress-bar')) {
  customElements.define('progress-bar', ProgressBar);
}

export default ProgressBar;
