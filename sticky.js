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

    // DOM elements.
    self.elem = elem;
    elem.style.position = 'relative';
    var stuckElem =self.stuckElem = elem.querySelector(opts.stuckSelector || '.sticky__stuck');
    stuckElem.style.position = 'absolute';
    var contentElem = self.contentElem = elem.querySelector(opts.contentSelector || '.sticky__content');
    contentElem.style.overflow = 'auto';

    // Initialise.
    self.itemSelector = opts.itemSelector || '.sticky__item';
    self.init();

    // Bind to the `scroll` event.
    self.contentElem.addEventListener('scroll', function() {
      self.scroll();
    });

  }

  Sticky.prototype.scroll = function() {

    // Hide all the `clonedElems`.
    var self = this;
    var i = -1;
    var len = self.clonedElems.length;
    while (++i < len) {
      self.clonedElems[i].style.display = 'none';
    }

    // Compute how much we've scrolled in `contentElem`.
    var scrollTop = self.contentElem.scrollTop;

    // Determine the index of the element in `clonedElems` to show.
    var indexToShow = -1;
    var j = len;
    while (j-- > 0) {
      if (scrollTop >= self.offsets[j]) {
        indexToShow = j;
        break;
      }
    }

    if (indexToShow !== -1) {
      if (indexToShow > 0) {
        // In this case, 2 items in `clonedElems` are shown. Here we show the
        // the element in `clonedElems` at index `indexToShow` - 1, and adjust
        // the `top` position if needed.
        var top = Math.min(scrollTop - self.offsets[indexToShow], self.heights[indexToShow - 1]);
        console.log(top, indexToShow);
        self.clonedElems[indexToShow - 1].style.display = 'block';
        self.stuckElem.style.top = (-1 * top) + 'px';
      }
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

    var i = -1;
    var len = self.itemElems.length;
    while (++i < len) {
      // Height.
      var height = computeHeight(self.itemElems[i]);
      self.heights.push(height);
      // Offset.
      self.offsets.push(self.itemElems[i].offsetTop - (self.heights[i - 1] || 0));
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
