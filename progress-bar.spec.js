import ProgressBar from './index.js';

describe('progress-bar', () => {
  let element;

  beforeEach(() => {
    element = new ProgressBar();
    element.setAttribute('percent', '33');
    element.textContent = 'testing';
    document.body.appendChild(element);
  });

  afterEach(() => {
    document.body.removeChild(element);
  });

  it('renders with percent attribute', () => {
    expect(element.getAttribute('percent')).toBe('33');
    expect(element.textContent).toBe('testing');
  });

  it('applies percent to bar width', () => {
    const bar = element.shadowRoot.querySelector('.bar');
    expect(bar.style.width).toBe('33%');
  });

  it('updates bar width when percent property is set', () => {
    element.percent = 66;
    const bar = element.shadowRoot.querySelector('.bar');
    expect(bar.style.width).toBe('66%');
  });

  it('updates bar width when percent attribute changes', () => {
    element.setAttribute('percent', '50');
    const bar = element.shadowRoot.querySelector('.bar');
    expect(bar.style.width).toBe('50%');
  });

  it('renders shadow DOM structure', () => {
    const bar = element.shadowRoot.querySelector('.bar');
    const text = element.shadowRoot.querySelector('.text');
    expect(bar).toBeTruthy();
    expect(text).toBeTruthy();
  });

  // The host paints the track background, so slotted text always has a
  // background-painting ancestor that axe-core can resolve for contrast.
  // jsdom can't compute :host background or run real contrast, so the actual
  // contrast guarantee is verified against a browser in scripts/a11y.mjs; here
  // we only guard the structural invariant: the fill and the slotted text are
  // siblings under the host, and the text is never nested inside the fill.
  it('keeps the fill and slotted text as siblings under the host, never nesting text inside the fill', () => {
    const sr = element.shadowRoot;
    const bar = sr.querySelector('.bar');
    const slot = sr.querySelector('slot');
    expect(sr.contains(bar)).toBe(true);
    expect(sr.contains(slot)).toBe(true);
    expect(bar.contains(slot)).toBe(false);
  });

  it('renders slotted content', () => {
    const slot = element.shadowRoot.querySelector('slot');
    expect(slot).toBeTruthy();
  });

  it('is indeterminate by default when percent is unset', () => {
    const newElement = new ProgressBar();
    document.body.appendChild(newElement);
    expect(newElement.percent).toBe(null);
    expect(newElement.indeterminate).toBe(true);
    expect(newElement.shadowRoot.querySelector('.bar').style.width).toBe('');
    expect(newElement.hasAttribute('aria-valuenow')).toBe(false);
    document.body.removeChild(newElement);
  });

  it('exposes progressbar ARIA semantics', () => {
    expect(element.getAttribute('role')).toBe('progressbar');
    expect(element.getAttribute('aria-valuemin')).toBe('0');
    expect(element.getAttribute('aria-valuemax')).toBe('100');
    expect(element.getAttribute('aria-valuenow')).toBe('33');
  });

  it('updates aria-valuenow alongside the bar width', () => {
    element.percent = 80;
    expect(element.getAttribute('aria-valuenow')).toBe('80');
  });

  it('clamps percent to the 0-100 range', () => {
    element.percent = 150;
    expect(element.percent).toBe(100);
    expect(element.shadowRoot.querySelector('.bar').style.width).toBe('100%');

    element.percent = -20;
    expect(element.percent).toBe(0);
    expect(element.shadowRoot.querySelector('.bar').style.width).toBe('0%');
  });

  it('throws on non-numeric percent rather than silently defaulting to 0', () => {
    expect(() => { element.percent = 'abc'; }).toThrow(TypeError);
  });

  describe('error state', () => {
    it('defaults to no error', () => {
      expect(element.error).toBe(false);
      expect(element.hasAttribute('error')).toBe(false);
    });

    it('reflects the error property to the error attribute', () => {
      element.error = true;
      expect(element.hasAttribute('error')).toBe(true);

      element.error = false;
      expect(element.hasAttribute('error')).toBe(false);
    });

    it('reflects the error attribute to the error property', () => {
      element.setAttribute('error', '');
      expect(element.error).toBe(true);

      element.removeAttribute('error');
      expect(element.error).toBe(false);
    });

    it('coerces truthy/falsy values when set via the property', () => {
      element.error = 'yes';
      expect(element.hasAttribute('error')).toBe(true);

      element.error = 0;
      expect(element.hasAttribute('error')).toBe(false);
    });
  });

  describe('indeterminate state', () => {
    it('is determinate with a live aria-valuenow once percent is set', () => {
      expect(element.indeterminate).toBe(false);
      expect(element.getAttribute('aria-valuenow')).toBe('33');
    });

    it('becomes indeterminate when percent is set to null', () => {
      element.percent = null;
      expect(element.indeterminate).toBe(true);
      expect(element.hasAttribute('percent')).toBe(false);
      expect(element.percent).toBe(null);
    });

    it('drops aria-valuenow and inline width while indeterminate', () => {
      element.percent = null;
      expect(element.hasAttribute('aria-valuenow')).toBe(false);
      expect(element.shadowRoot.querySelector('.bar').style.width).toBe('');
    });

    it('restores aria-valuenow and width when percent is set back to a number', () => {
      element.percent = null;
      element.percent = 33;
      expect(element.indeterminate).toBe(false);
      expect(element.getAttribute('aria-valuenow')).toBe('33');
      expect(element.shadowRoot.querySelector('.bar').style.width).toBe('33%');
    });
  });

  describe('circular mode', () => {
    let circular;

    beforeEach(() => {
      circular = new ProgressBar();
      circular.setAttribute('mode', 'circular');
      circular.setAttribute('percent', '0');
      document.body.appendChild(circular);
    });

    afterEach(() => {
      document.body.removeChild(circular);
    });

    it('renders an svg ring instead of a linear bar', () => {
      expect(circular.shadowRoot.querySelector('svg.ring')).toBeTruthy();
      expect(circular.shadowRoot.querySelector('circle.progress-ring')).toBeTruthy();
      expect(circular.shadowRoot.querySelector('.bar')).toBeFalsy();
    });

    it('includes an error-mark X in the ring for the failed/error state', () => {
      const mark = circular.shadowRoot.querySelector('path.error-mark');
      expect(mark).toBeTruthy();
      expect(mark.getAttribute('d')).toContain('L');
    });

    it('sets a full stroke-dashoffset at 0 percent', () => {
      // pathLength is normalized to 100, so the offset is on a 0-100 scale.
      const ring = circular.shadowRoot.querySelector('.progress-ring');
      expect(Number(ring.style.strokeDashoffset)).toBe(100);
    });

    it('shrinks the stroke-dashoffset as percent climbs', () => {
      circular.percent = 50;
      const ring = circular.shadowRoot.querySelector('.progress-ring');
      expect(Number(ring.style.strokeDashoffset)).toBe(50);
    });

    it('still keeps progressbar ARIA semantics', () => {
      circular.percent = 50;
      expect(circular.getAttribute('role')).toBe('progressbar');
      expect(circular.getAttribute('aria-valuenow')).toBe('50');
    });

    it('clears the inline stroke-dashoffset when percent is unset', () => {
      circular.percent = 50;
      circular.percent = null;
      const ring = circular.shadowRoot.querySelector('.progress-ring');
      expect(ring.style.strokeDashoffset).toBe('');
      expect(circular.hasAttribute('aria-valuenow')).toBe(false);
    });

    it('reflects the mode property to the attribute', () => {
      const el = new ProgressBar();
      el.mode = 'circular';
      expect(el.getAttribute('mode')).toBe('circular');
      expect(el.mode).toBe('circular');
    });
  });
});
