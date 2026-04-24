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
    const content = element.shadowRoot.querySelector('.content');
    expect(bar).toBeTruthy();
    expect(content).toBeTruthy();
  });

  it('nests bar inside content so slotted text has a background ancestor for contrast detection', () => {
    const content = element.shadowRoot.querySelector('.content');
    const bar = element.shadowRoot.querySelector('.bar');
    const slot = element.shadowRoot.querySelector('slot');
    expect(content.contains(bar)).toBe(true);
    expect(content.contains(slot)).toBe(true);
  });

  it('renders slotted content', () => {
    const slot = element.shadowRoot.querySelector('slot');
    expect(slot).toBeTruthy();
  });

  it('defaults percent to 0', () => {
    const newElement = new ProgressBar();
    document.body.appendChild(newElement);
    const bar = newElement.shadowRoot.querySelector('.bar');
    expect(bar.style.width).toBe('0%');
    document.body.removeChild(newElement);
  });
});
