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

- `percent` (number) - The progress percentage (0-100). Default: 0. Can be set as attribute or property.

### Slots

- Default slot - Content displayed over the progress bar (e.g., filename, download link)

### CSS Variables

You can customize the appearance by overriding CSS on the host element:

```css
progress-bar {
  --progress-color: rgb(57, 137, 39);
  --progress-duration: 120ms;
  --bar-height: 32px;
  --bar-radius: 4px;
  --bar-padding: 8px;
}
```
