# sticky.js [![npm Version](http://img.shields.io/npm/v/@yuanqing/sticky.svg?style=flat)](https://www.npmjs.com/package/@yuanqing/sticky) [![Build Status](https://img.shields.io/travis/yuanqing/sticky.svg?branch=master&style=flat)](https://travis-ci.org/yuanqing/sticky)

> Sticky items in a scrollable DOM element.

## Features

- Define custom selectors for the scrollable element, the items to make sticky, and the element to hold the &ldquo;stuck&rdquo; items
- Zero dependencies; 1.5 KB [minified](sticky.min.js) or 0.7 KB minified and gzipped

## Usage

> [**Editable demo**](http://jsfiddle.net/3ssst5u0/)

```html
<!DOCTYPE html>
<html>
  <head>
    <title>sticky</title>
    <meta charset="utf-8">
    <style>
      body, p {margin: 0; }
      .sticky {margin: 0 auto; width: 300px; }
      .sticky__content {height: 300px; }
      .sticky__item {background: yellow; }
    </style>
  </head>
  <body>
    <div class="sticky">
      <div class="sticky__stuck"></div>
      <div class="sticky__content">
        <p>Iuvaret intellegat nec at, duo illud conceptam te. Eos habeo omnium principes ne. Cu cum malis ludus equidem, mei nibh nobis ponderum ne, ei mea civibus adipisci. Clita invidunt definitiones duo in, est alii omnes gloriatur te. Mea utroque disputando an. Ne vidit euripidis omittantur per, sea ne iusto saperet, eu equidem maiorum denique vim. Sapientem abhorreant in eam, per ut nonumes accusata scribentur. Pro ea periculis posidonium, duo diceret constituam ea, consul putent cu nec.</p>
        <div class="sticky__item">Ius et aeque adversarium concludaturque eripuit denique et nam, ea mei impetus nominati.</div>
        <!-- ... -->
      </div>
    </div>
    <script src="path/to/sticky.min.js"></script>
    <script>
      var elem = document.querySelector('.sticky');
      var opts = {
        contentSelector: '.sticky__content',
        itemSelector: '.sticky__item',
        stuckSelector: '.sticky__stuck'
      };
      sticky(elem, opts);
    </script>
  </body>
</html>
```

In the browser, the `sticky` function is a global variable. In Node, do:

```js
var sticky = require('@yuanqing/sticky');
```

### var s = sticky(elem, opts)

- `elem` &mdash; A DOM element.

- `opts` &mdash; An object literal:

  Key | Description | Default
  :--|:--|:--
  `contentSelector` | Selector for the scrollable element | `.sticky__content`
  `itemSelector` | Selector for items we want to make sticky | `.sticky__item`
  `stuckSelector` | Selector for the element to hold the &ldquo;stuck&rdquo; items | `.sticky__stuck`

### s.init()

Re-initialises the component, ie. recomputes the items we want to make sticky. This is uesful if any changes were made to the contents of the given `elem`.

## Limitations

- Do not use an `id` attribute to style elements that match the `itemSelector`. (It is okay to add an `id` to these elements as a [fragment identifier](https://en.wikipedia.org/wiki/Fragment_identifier).)

## Installation

Install via [npm](https://www.npmjs.com):

```
$ npm i --save @yuanqing/sticky
```

Install via [bower](http://bower.io):

```
$ bower i --save yuanqing/sticky
```

## Changelog

- 0.1.0
  - Initial release

## License

[MIT](LICENSE)
