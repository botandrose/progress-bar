# progress-bar

A minimal progress bar web component.

## Usage

### Via Script Tag

```html
<!DOCTYPE html>
<html>
<head>
  <script type="module" src="https://cdn.jsdelivr.net/npm/@botandrose/progress-bar@0.1.0/+esm"></script>
</head>
<body>
  <progress-bar percent="50">
    <a href="/download" download>file.pdf</a>
  </progress-bar>
</body>
</html>
```

### Via ES Module Import

```javascript
import ProgressBar from '@botandrose/progress-bar';

// Component auto-registers as <progress-bar>
const bar = document.querySelector('progress-bar');
bar.percent = 75;
```

## API

### Properties

- `percent` (number | null) - The progress percentage. Numeric values are clamped to 0-100; a non-numeric value throws. When unset — no `percent` attribute, or `percent = null` — the bar is **indeterminate**: the fill animates as a sweeping segment (a spinning arc in circular mode) and `aria-valuenow` is dropped, the standard signal for an indeterminate progressbar. Set a number to make it determinate. Default: indeterminate. Can be set as attribute or property.
- `error` (boolean) - Whether the bar is in an error state. In linear mode this recolors the fill to `--error-color`; in circular mode it drops the arc and renders a static full ring plus a centered X in `--error-color` — a "failed" glyph. Reflected between the `error` property and the `error` attribute, so `<progress-bar error>` and `el.error = true` are equivalent. Default: false.
- `indeterminate` (boolean, read-only) - Whether the bar is indeterminate, i.e. whether `percent` is unset. There is no `indeterminate` attribute — drive it through `percent` (omit it, or set the property to `null`).
- `mode` (string) - `"linear"` (default) renders the horizontal fill bar; `"circular"` renders an SVG ring whose arc tracks `percent`, with the slotted content centered. Both modes honor `error` and the indeterminate (no-percent) state.

```html
<progress-bar>working…</progress-bar>              <!-- indeterminate: no percent -->
<progress-bar percent="50">file.pdf</progress-bar>
<progress-bar mode="circular" percent="42">42%</progress-bar>
<progress-bar mode="circular"></progress-bar>      <!-- indeterminate -->
```

### Slots

- Default slot - Content displayed over the progress bar (e.g., filename, download link)

### Styling

Host-level appearance is plain CSS — style the element directly:

```css
progress-bar {
  background: #333;          /* unfilled track */
  border: 1px solid #999;
  border-radius: 4px;        /* the fill is clipped to match */
}
```

Custom properties are reserved for the sealed shadow internals that CSS can't otherwise reach:

```css
progress-bar {
  --progress-color: rgb(57, 137, 39); /* fill color */
  --error-color: #7a242f;             /* fill color when the element has the [error] attribute */
  --indeterminate-color: #999;        /* fill / arc color while indeterminate */
  --progress-duration: 120ms;         /* fill / dashoffset transition */
  --bar-height: 32px;                 /* minimum bar height (linear) */
  --bar-padding: 8px;                 /* padding around the label (linear) */
  --track-color: #333333;             /* unfilled ring color (circular) */
  --indeterminate-duration: 1.5s;     /* sweep / spin animation period */
  --circular-size: 64px;              /* ring diameter (circular) */
  --circular-thickness: 16;           /* ring stroke width (circular); radius auto-fits any value */
}
```

### Accessibility

The element exposes `role="progressbar"` with `aria-valuemin`, `aria-valuemax`, and a live `aria-valuenow`.
