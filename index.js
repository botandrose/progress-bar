const STYLES = `
  :host {
    --progress-color: #2E7D32;
    --error-color: #7a242f;
    --progress-duration: 120ms;
    --bar-height: 32px;
    --bar-padding: 8px;
    display: block;
    overflow: hidden;
    background: #333333;
    border: 1px solid #999;
    border-radius: 4px;
    min-height: var(--bar-height);
    padding: var(--bar-padding);
    font-size: 13px;
    color: white;
    align-content: center;
    box-sizing: border-box;
    position: relative;
  }
  .bar {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 0%;
    background: var(--progress-color);
    transition: width var(--progress-duration) ease;
    z-index: 1;
  }
  .text{position: relative; z-index: 2;}
  :host([error]) .bar {
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

function clampPercent(value) {
  const number = Number(value);
  if (Number.isNaN(number)) {
    throw new TypeError(`progress-bar: percent must be numeric, got ${JSON.stringify(value)}`);
  }
  return Math.min(100, Math.max(0, number));
}

class ProgressBar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._percent = 0;
    this._rendered = false;
  }

  connectedCallback() {
    if (!this._rendered) {
      this.render();
      this._rendered = true;
    }
    this.updateBar();
  }

  get percent() {
    return this._percent;
  }

  set percent(value) {
    this.setAttribute('percent', clampPercent(value));
  }

  get error() {
    return this.hasAttribute('error');
  }

  set error(value) {
    this.toggleAttribute('error', Boolean(value));
  }

  static get observedAttributes() {
    return ['percent'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'percent') {
      this._percent = clampPercent(newValue);
      this.updateBar();
    }
  }

  updateBar() {
    const bar = this.shadowRoot?.querySelector('.bar');
    if (bar) {
      bar.style.width = `${this._percent}%`;
    }
    this.setAttribute('aria-valuenow', String(this._percent));
  }

  render() {
    this.shadowRoot.adoptedStyleSheets = [getStyleSheet()];
    this.shadowRoot.innerHTML = `
      <div class="bar"></div>
      <div class="text"><slot></slot></div>
    `;
    this.setAttribute('role', 'progressbar');
    this.setAttribute('aria-valuemin', '0');
    this.setAttribute('aria-valuemax', '100');
  }
}

if (!customElements.get('progress-bar')) {
  customElements.define('progress-bar', ProgressBar);
}

export default ProgressBar;
