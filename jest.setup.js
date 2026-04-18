if (typeof CSSStyleSheet !== "undefined" && !CSSStyleSheet.prototype.replaceSync) {
  CSSStyleSheet.prototype.replaceSync = function() {};
}
