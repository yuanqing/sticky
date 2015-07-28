(function(root) {

  'use strict';

  function computeHeight(elem) {
    return parseInt(root.getComputedStyle(elem).height, 10);
  }

  function Sticky(elem, opts) {

    // Allow `Sticky` to be called without the `new` keyword.
    var self = this;
    opts = opts || {};
    if (!(self instanceof Sticky)) {
      return new Sticky(elem, opts);
    }

    // The containing `elem`.
    elem.style.position = 'relative';

    // `stuckElem`.
    self.stuckElem = elem.querySelector(opts.stuckSelector ||
      '.sticky__stuck');
    self.stuckElem.style.position = 'absolute';

    // `contentElem`.
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

  Sticky.prototype.init = function() {

    var self = this;

    // Recompute `itemElems`.
    self.itemElems = [].slice.call(document.querySelectorAll(self.itemSelector));

    // Heights of each element in `itemElems`.
    self.heights = [];

    // Cloned versions of each element in `itemElems`.
    self.clonedElems = [];

    // The `scrollTop` at which the element will start to be stuck.
    self.offsets = [];

    // Empty `stuckElem`.
    self.stuckElem.innerHTML = '';

    var i = -1;
    var len = self.itemElems.length;
    while (++i < len) {
      // Heights.
      var height = computeHeight(self.itemElems[i]);
      self.heights.push(height);
      // Offsets.
      self.offsets.push(self.itemElems[i].offsetTop -
        (self.heights[i - 1] || 0));
      // Clone the item at index `i` of `itemElems`.
      var clonedElem = self.itemElems[i].cloneNode(true);
      clonedElem.style.display = 'none';
      clonedElem.style.height = height;
      // Remove the `id` attribute from the cloned element.
      clonedElem.removeAttribute('id');
      self.clonedElems.push(clonedElem);
      self.stuckElem.appendChild(clonedElem);
    }

    // Call the `scroll` handler once the above members have been initialised.
    self.scroll();

  };

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

    // Hide all elements not at indices `indexToShow` and `indexToShow - 1`.
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
        // element at index `indexToShow - 1` of `clonedElems`, and compute
        // the `top` position of `stuckElem`.
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

  if (typeof module === 'object') {
    module.exports = Sticky;
  } else {
    root.sticky = Sticky;
  }

})(this);
