let onInputFocus = function(el) {
  if (el.value)
    el.classList.add('no-empty');
  el.classList.toggle('active');
}
