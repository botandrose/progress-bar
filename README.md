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

- `percent` (number) - The progress percentage. Values are clamped to 0-100; a non-numeric value throws. Default: 0. Can be set as attribute or property.

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
  --error-color: #7a242f;             /* fill color when the element has class "error" */
  --progress-duration: 120ms;         /* fill width transition */
  --bar-height: 32px;                 /* minimum bar height */
  --bar-padding: 8px;                 /* padding around the label */
}
```

### Accessibility

The element exposes `role="progressbar"` with `aria-valuemin`, `aria-valuemax`, and a live `aria-valuenow`.
