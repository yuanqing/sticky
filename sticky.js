(function(root) {

  'use strict';

  function computeDimension(elem, computeWidth) {
    return parseInt(root.getComputedStyle(elem)[computeWidth ? 'width' : 'height'], 10);
  }

  function Sticky(elem, opts) {

    // Allow `Sticky` to be called without the `new` keyword.
    var self = this;
    opts = opts || {};
    if (!(self instanceof Sticky)) {
      return new Sticky(elem, opts);
    }

    // DOM elements.
    self.elem = elem;
    elem.style.position = 'relative';
    var stuckElem = self.stuckElem = elem.querySelector(opts.stuckSelector ||
      '.sticky__stuck');
    stuckElem.style.position = 'absolute';
    self.contentElem = elem.querySelector(opts.contentSelector ||
      '.sticky__content');
    self.contentElem.style.overflow = 'auto';

    // Initialise.
    self.itemSelector = opts.itemSelector || '.sticky__item';
    self.init();

    // Bind to the `scroll` event.
    self.contentElem.addEventListener('scroll', function() {
      self.scroll();
    });

  }

  Sticky.prototype.scroll = function() {

    var self = this;
    var len = self.clonedElems.length;
    var i;

    // Compute how much we've scrolled in `contentElem`.
    var scrollTop = self.contentElem.scrollTop;

    // Determine the index of the element in `clonedElems` to show.
    var indexToShow = -1;
    i = len;
    while (i-- > 0) {
      if (scrollTop >= self.offsets[i]) {
        indexToShow = i;
        break;
      }
    }

    i = -1;
    while (++i < len) {
      if (i == indexToShow || i == indexToShow - 1) {
        continue;
      }
      self.clonedElems[i].style.display = 'none';
    }

    if (indexToShow !== -1) {
      var top = '0px';
      if (indexToShow > 0) {
        // In this case, two items in `clonedElems` are shown. Show the
        // the element in `clonedElems` at index `indexToShow` - 1, and compute
        // the `top` position for `stuckElem`.
        self.clonedElems[indexToShow - 1].style.display = 'block';
        top = (-1 * Math.min(scrollTop - self.offsets[indexToShow],
          self.heights[indexToShow - 1])) + 'px';
      }
      // Adjust the `top` position of `stuckElem`.
      self.stuckElem.style.top = top;
      // Show the element in `clonedElems` at `indexToShow`.
      self.clonedElems[indexToShow].style.display = 'block';
    }

  };

  Sticky.prototype.init = function() {

    var self = this;

    // Recompute `itemElems`.
    self.itemElems = [].slice.call(document.querySelectorAll(self.itemSelector));

    // Heights of each element in `itemElems`.
    self.heights = [];

    // The vertical scroll at which the element will start to be stuck.
    self.offsets = [];

    // Cloned versions of each element in `itemElems`.
    self.clonedElems = [];

    // Empty `stuckElem`.
    self.stuckElem.innerHTML = '';

    var i = -1;
    var len = self.itemElems.length;
    while (++i < len) {
      // Height.
      var height = computeDimension(self.itemElems[i]);
      self.heights.push(height);
      // Offset.
      self.offsets.push(self.itemElems[i].offsetTop -
        (self.heights[i - 1] || 0));
      // Cloned element.
      var clonedElem = self.itemElems[i].cloneNode(true);
      clonedElem.style.display = 'none';
      clonedElem.style.height = height;
      self.clonedElems.push(clonedElem);
      self.stuckElem.appendChild(clonedElem);
    }

    // Call the `scroll` handler once the above members have been initialised.
    self.scroll();

  };

  if (typeof module === 'object') {
    module.exports = Sticky;
  } else {
    root.sticky = Sticky;
  }

})(this);
