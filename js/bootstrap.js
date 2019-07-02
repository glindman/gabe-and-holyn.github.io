/*!
  * Bootstrap v4.3.1 (https://getbootstrap.com/)
  * Copyright 2011-2019 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('jquery'), require('popper.js')) :
  typeof define === 'function' && define.amd ? define(['exports', 'jquery', 'popper.js'], factory) :
  (global = global || self, factory(global.bootstrap = {}, global.jQuery, global.Popper));
}(this, function (exports, $, Popper) { 'use strict';

  $ = $ && $.hasOwnProperty('default') ? $['default'] : $;
  Popper = Popper && Popper.hasOwnProperty('default') ? Popper['default'] : Popper;

  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function createClass(Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};
      var ownKeys = Object.keys(source);

      if (typeof Object.getOwnPropertySymbols === 'function') {
        ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }));
      }

      ownKeys.forEach(function (key) {
        defineProperty(target, key, source[key]);
      });
    }

    return target;
  }

  function inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    subClass.proto = superClass;
  }

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v4.3.1): util.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
   * --------------------------------------------------------------------------
   */
  /**
   * ------------------------------------------------------------------------
   * Private TransitionEnd Helpers
   * ------------------------------------------------------------------------
   */

  var TRANSITIONEND = 'transitionend';
  var MAXUID = 1000000;
  var MILLISECONDSMULTIPLIER = 1000; // Shoutout AngusCroll (https://goo.gl/pxwQGp)

  function toType(obj) {
    return {}.toString.call(obj).match(/\s([a-z]+)/i)[1].toLowerCase();
  }

  function getSpecialTransitionEndEvent() {
    return {
      bindType: TRANSITIONEND,
      delegateType: TRANSITIONEND,
      handle: function handle(event) {
        if ($(event.target).is(this)) {
          return event.handleObj.handler.apply(this, arguments); // eslint-disable-line prefer-rest-params
        }

        return undefined; // eslint-disable-line no-undefined
      }
    };
  }

  function transitionEndEmulator(duration) {
    var this = this;

    var called = false;
    $(this).one(Util.TRANSITIONEND, function () {
      called = true;
    });
    setTimeout(function () {
      if (!called) {
        Util.triggerTransitionEnd(this);
      }
    }, duration);
    return this;
  }

  function setTransitionEndSupport() {
    $.fn.emulateTransitionEnd = transitionEndEmulator;
    $.event.special[Util.TRANSITIONEND] = getSpecialTransitionEndEvent();
  }
  /**
   * --------------------------------------------------------------------------
   * Public Util Api
   * --------------------------------------------------------------------------
   */


  var Util = {
    TRANSITIONEND: 'bsTransitionEnd',
    getUID: function getUID(prefix) {
      do {
        // eslint-disable-next-line no-bitwise
        prefix += ~~(Math.random() * MAXUID); // "~~" acts like a faster Math.floor() here
      } while (document.getElementById(prefix));

      return prefix;
    },
    getSelectorFromElement: function getSelectorFromElement(element) {
      var selector = element.getAttribute('data-target');

      if (!selector || selector === '#') {
        var hrefAttr = element.getAttribute('href');
        selector = hrefAttr && hrefAttr !== '#' ? hrefAttr.trim() : '';
      }

      try {
        return document.querySelector(selector) ? selector : null;
      } catch (err) {
        return null;
      }
    },
    getTransitionDurationFromElement: function getTransitionDurationFromElement(element) {
      if (!element) {
        return 0;
      } // Get transition-duration of the element


      var transitionDuration = $(element).css('transition-duration');
      var transitionDelay = $(element).css('transition-delay');
      var floatTransitionDuration = parseFloat(transitionDuration);
      var floatTransitionDelay = parseFloat(transitionDelay); // Return 0 if element or transition duration is not found

      if (!floatTransitionDuration && !floatTransitionDelay) {
        return 0;
      } // If multiple durations are defined, take the first


      transitionDuration = transitionDuration.split(',')[0];
      transitionDelay = transitionDelay.split(',')[0];
      return (parseFloat(transitionDuration) + parseFloat(transitionDelay)) * MILLISECONDSMULTIPLIER;
    },
    reflow: function reflow(element) {
      return element.offsetHeight;
    },
    triggerTransitionEnd: function triggerTransitionEnd(element) {
      $(element).trigger(TRANSITIONEND);
    },
    // TODO: Remove in v5
    supportsTransitionEnd: function supportsTransitionEnd() {
      return Boolean(TRANSITIONEND);
    },
    isElement: function isElement(obj) {
      return (obj[0] || obj).nodeType;
    },
    typeCheckConfig: function typeCheckConfig(componentName, config, configTypes) {
      for (var property in configTypes) {
        if (Object.prototype.hasOwnProperty.call(configTypes, property)) {
          var expectedTypes = configTypes[property];
          var value = config[property];
          var valueType = value && Util.isElement(value) ? 'element' : toType(value);

          if (!new RegExp(expectedTypes).test(valueType)) {
            throw new Error(componentName.toUpperCase() + ": " + ("Option \"" + property + "\" provided type \"" + valueType + "\" ") + ("but expected type \"" + expectedTypes + "\"."));
          }
        }
      }
    },
    findShadowRoot: function findShadowRoot(element) {
      if (!document.documentElement.attachShadow) {
        return null;
      } // Can find the shadow root otherwise it'll return the document


      if (typeof element.getRootNode === 'function') {
        var root = element.getRootNode();
        return root instanceof ShadowRoot ? root : null;
      }

      if (element instanceof ShadowRoot) {
        return element;
      } // when we don't find a shadow root


      if (!element.parentNode) {
        return null;
      }

      return Util.findShadowRoot(element.parentNode);
    }
  };
  setTransitionEndSupport();

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  var NAME = 'alert';
  var VERSION = '4.3.1';
  var DATAKEY = 'bs.alert';
  var EVENTKEY = "." + DATAKEY;
  var DATAAPIKEY = '.data-api';
  var JQUERYNOCONFLICT = $.fn[NAME];
  var Selector = {
    DISMISS: '[data-dismiss="alert"]'
  };
  var Event = {
    CLOSE: "close" + EVENTKEY,
    CLOSED: "closed" + EVENTKEY,
    CLICKDATAAPI: "click" + EVENTKEY + DATAAPIKEY
  };
  var ClassName = {
    ALERT: 'alert',
    FADE: 'fade',
    SHOW: 'show'
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

  };

  var Alert =
  /*#PURE*/
  function () {
    function Alert(element) {
      this.element = element;
    } // Getters


    var proto = Alert.prototype;

    // Public
    proto.close = function close(element) {
      var rootElement = this.element;

      if (element) {
        rootElement = this.getRootElement(element);
      }

      var customEvent = this.triggerCloseEvent(rootElement);

      if (customEvent.isDefaultPrevented()) {
        return;
      }

      this.removeElement(rootElement);
    };

    proto.dispose = function dispose() {
      $.removeData(this.element, DATAKEY);
      this.element = null;
    } // Private
    ;

    proto.getRootElement = function getRootElement(element) {
      var selector = Util.getSelectorFromElement(element);
      var parent = false;

      if (selector) {
        parent = document.querySelector(selector);
      }

      if (!parent) {
        parent = $(element).closest("." + ClassName.ALERT)[0];
      }

      return parent;
    };

    proto.triggerCloseEvent = function triggerCloseEvent(element) {
      var closeEvent = $.Event(Event.CLOSE);
      $(element).trigger(closeEvent);
      return closeEvent;
    };

    proto.removeElement = function removeElement(element) {
      var this = this;

      $(element).removeClass(ClassName.SHOW);

      if (!$(element).hasClass(ClassName.FADE)) {
        this.destroyElement(element);

        return;
      }

      var transitionDuration = Util.getTransitionDurationFromElement(element);
      $(element).one(Util.TRANSITIONEND, function (event) {
        return this.destroyElement(element, event);
      }).emulateTransitionEnd(transitionDuration);
    };

    proto.destroyElement = function destroyElement(element) {
      $(element).detach().trigger(Event.CLOSED).remove();
    } // Static
    ;

    Alert.jQueryInterface = function jQueryInterface(config) {
      return this.each(function () {
        var $element = $(this);
        var data = $element.data(DATAKEY);

        if (!data) {
          data = new Alert(this);
          $element.data(DATAKEY, data);
        }

        if (config === 'close') {
          data[config](this);
        }
      });
    };

    Alert.handleDismiss = function handleDismiss(alertInstance) {
      return function (event) {
        if (event) {
          event.preventDefault();
        }

        alertInstance.close(this);
      };
    };

    createClass(Alert, null, [{
      key: "VERSION",
      get: function get() {
        return VERSION;
      }
    }]);

    return Alert;
  }();
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  $(document).on(Event.CLICKDATAAPI, Selector.DISMISS, Alert.handleDismiss(new Alert()));
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $.fn[NAME] = Alert.jQueryInterface;
  $.fn[NAME].Constructor = Alert;

  $.fn[NAME].noConflict = function () {
    $.fn[NAME] = JQUERYNOCONFLICT;
    return Alert.jQueryInterface;
  };

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  var NAME$1 = 'button';
  var VERSION$1 = '4.3.1';
  var DATAKEY$1 = 'bs.button';
  var EVENTKEY$1 = "." + DATAKEY$1;
  var DATAAPIKEY$1 = '.data-api';
  var JQUERYNOCONFLICT$1 = $.fn[NAME$1];
  var ClassName$1 = {
    ACTIVE: 'active',
    BUTTON: 'btn',
    FOCUS: 'focus'
  };
  var Selector$1 = {
    DATATOGGLECARROT: '[data-toggle^="button"]',
    DATATOGGLE: '[data-toggle="buttons"]',
    INPUT: 'input:not([type="hidden"])',
    ACTIVE: '.active',
    BUTTON: '.btn'
  };
  var Event$1 = {
    CLICKDATAAPI: "click" + EVENTKEY$1 + DATAAPIKEY$1,
    FOCUSBLURDATAAPI: "focus" + EVENTKEY$1 + DATAAPIKEY$1 + " " + ("blur" + EVENTKEY$1 + DATAAPIKEY$1)
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

  };

  var Button =
  /*#PURE*/
  function () {
    function Button(element) {
      this.element = element;
    } // Getters


    var proto = Button.prototype;

    // Public
    proto.toggle = function toggle() {
      var triggerChangeEvent = true;
      var addAriaPressed = true;
      var rootElement = $(this.element).closest(Selector$1.DATATOGGLE)[0];

      if (rootElement) {
        var input = this.element.querySelector(Selector$1.INPUT);

        if (input) {
          if (input.type === 'radio') {
            if (input.checked && this.element.classList.contains(ClassName$1.ACTIVE)) {
              triggerChangeEvent = false;
            } else {
              var activeElement = rootElement.querySelector(Selector$1.ACTIVE);

              if (activeElement) {
                $(activeElement).removeClass(ClassName$1.ACTIVE);
              }
            }
          }

          if (triggerChangeEvent) {
            if (input.hasAttribute('disabled') || rootElement.hasAttribute('disabled') || input.classList.contains('disabled') || rootElement.classList.contains('disabled')) {
              return;
            }

            input.checked = !this.element.classList.contains(ClassName$1.ACTIVE);
            $(input).trigger('change');
          }

          input.focus();
          addAriaPressed = false;
        }
      }

      if (addAriaPressed) {
        this.element.setAttribute('aria-pressed', !this.element.classList.contains(ClassName$1.ACTIVE));
      }

      if (triggerChangeEvent) {
        $(this.element).toggleClass(ClassName$1.ACTIVE);
      }
    };

    proto.dispose = function dispose() {
      $.removeData(this.element, DATAKEY$1);
      this.element = null;
    } // Static
    ;

    Button.jQueryInterface = function jQueryInterface(config) {
      return this.each(function () {
        var data = $(this).data(DATAKEY$1);

        if (!data) {
          data = new Button(this);
          $(this).data(DATAKEY$1, data);
        }

        if (config === 'toggle') {
          data[config]();
        }
      });
    };

    createClass(Button, null, [{
      key: "VERSION",
      get: function get() {
        return VERSION$1;
      }
    }]);

    return Button;
  }();
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  $(document).on(Event$1.CLICKDATAAPI, Selector$1.DATATOGGLECARROT, function (event) {
    event.preventDefault();
    var button = event.target;

    if (!$(button).hasClass(ClassName$1.BUTTON)) {
      button = $(button).closest(Selector$1.BUTTON);
    }

    Button.jQueryInterface.call($(button), 'toggle');
  }).on(Event$1.FOCUSBLURDATAAPI, Selector$1.DATATOGGLECARROT, function (event) {
    var button = $(event.target).closest(Selector$1.BUTTON)[0];
    $(button).toggleClass(ClassName$1.FOCUS, /^focus(in)?$/.test(event.type));
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $.fn[NAME$1] = Button.jQueryInterface;
  $.fn[NAME$1].Constructor = Button;

  $.fn[NAME$1].noConflict = function () {
    $.fn[NAME$1] = JQUERYNOCONFLICT$1;
    return Button.jQueryInterface;
  };

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  var NAME$2 = 'carousel';
  var VERSION$2 = '4.3.1';
  var DATAKEY$2 = 'bs.carousel';
  var EVENTKEY$2 = "." + DATAKEY$2;
  var DATAAPIKEY$2 = '.data-api';
  var JQUERYNOCONFLICT$2 = $.fn[NAME$2];
  var ARROWLEFTKEYCODE = 37; // KeyboardEvent.which value for left arrow key

  var ARROWRIGHTKEYCODE = 39; // KeyboardEvent.which value for right arrow key

  var TOUCHEVENTCOMPATWAIT = 500; // Time for mouse compat events to fire after touch

  var SWIPETHRESHOLD = 40;
  var Default = {
    interval: 5000,
    keyboard: true,
    slide: false,
    pause: 'hover',
    wrap: true,
    touch: true
  };
  var DefaultType = {
    interval: '(number|boolean)',
    keyboard: 'boolean',
    slide: '(boolean|string)',
    pause: '(string|boolean)',
    wrap: 'boolean',
    touch: 'boolean'
  };
  var Direction = {
    NEXT: 'next',
    PREV: 'prev',
    LEFT: 'left',
    RIGHT: 'right'
  };
  var Event$2 = {
    SLIDE: "slide" + EVENTKEY$2,
    SLID: "slid" + EVENTKEY$2,
    KEYDOWN: "keydown" + EVENTKEY$2,
    MOUSEENTER: "mouseenter" + EVENTKEY$2,
    MOUSELEAVE: "mouseleave" + EVENTKEY$2,
    TOUCHSTART: "touchstart" + EVENTKEY$2,
    TOUCHMOVE: "touchmove" + EVENTKEY$2,
    TOUCHEND: "touchend" + EVENTKEY$2,
    POINTERDOWN: "pointerdown" + EVENTKEY$2,
    POINTERUP: "pointerup" + EVENTKEY$2,
    DRAGSTART: "dragstart" + EVENTKEY$2,
    LOADDATAAPI: "load" + EVENTKEY$2 + DATAAPIKEY$2,
    CLICKDATAAPI: "click" + EVENTKEY$2 + DATAAPIKEY$2
  };
  var ClassName$2 = {
    CAROUSEL: 'carousel',
    ACTIVE: 'active',
    SLIDE: 'slide',
    RIGHT: 'carousel-item-right',
    LEFT: 'carousel-item-left',
    NEXT: 'carousel-item-next',
    PREV: 'carousel-item-prev',
    ITEM: 'carousel-item',
    POINTEREVENT: 'pointer-event'
  };
  var Selector$2 = {
    ACTIVE: '.active',
    ACTIVEITEM: '.active.carousel-item',
    ITEM: '.carousel-item',
    ITEMIMG: '.carousel-item img',
    NEXTPREV: '.carousel-item-next, .carousel-item-prev',
    INDICATORS: '.carousel-indicators',
    DATASLIDE: '[data-slide], [data-slide-to]',
    DATARIDE: '[data-ride="carousel"]'
  };
  var PointerType = {
    TOUCH: 'touch',
    PEN: 'pen'
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

  };

  var Carousel =
  /*#PURE*/
  function () {
    function Carousel(element, config) {
      this.items = null;
      this.interval = null;
      this.activeElement = null;
      this.isPaused = false;
      this.isSliding = false;
      this.touchTimeout = null;
      this.touchStartX = 0;
      this.touchDeltaX = 0;
      this.config = this.getConfig(config);
      this.element = element;
      this.indicatorsElement = this.element.querySelector(Selector$2.INDICATORS);
      this.touchSupported = 'ontouchstart' in document.documentElement || navigator.maxTouchPoints > 0;
      this.pointerEvent = Boolean(window.PointerEvent || window.MSPointerEvent);

      this.addEventListeners();
    } // Getters


    var proto = Carousel.prototype;

    // Public
    proto.next = function next() {
      if (!this.isSliding) {
        this.slide(Direction.NEXT);
      }
    };

    proto.nextWhenVisible = function nextWhenVisible() {
      // Don't call next when the page isn't visible
      // or the carousel or its parent isn't visible
      if (!document.hidden && $(this.element).is(':visible') && $(this.element).css('visibility') !== 'hidden') {
        this.next();
      }
    };

    proto.prev = function prev() {
      if (!this.isSliding) {
        this.slide(Direction.PREV);
      }
    };

    proto.pause = function pause(event) {
      if (!event) {
        this.isPaused = true;
      }

      if (this.element.querySelector(Selector$2.NEXTPREV)) {
        Util.triggerTransitionEnd(this.element);
        this.cycle(true);
      }

      clearInterval(this.interval);
      this.interval = null;
    };

    proto.cycle = function cycle(event) {
      if (!event) {
        this.isPaused = false;
      }

      if (this.interval) {
        clearInterval(this.interval);
        this.interval = null;
      }

      if (this.config.interval && !this.isPaused) {
        this.interval = setInterval((document.visibilityState ? this.nextWhenVisible : this.next).bind(this), this.config.interval);
      }
    };

    proto.to = function to(index) {
      var this = this;

      this.activeElement = this.element.querySelector(Selector$2.ACTIVEITEM);

      var activeIndex = this.getItemIndex(this.activeElement);

      if (index > this.items.length - 1 || index < 0) {
        return;
      }

      if (this.isSliding) {
        $(this.element).one(Event$2.SLID, function () {
          return this.to(index);
        });
        return;
      }

      if (activeIndex === index) {
        this.pause();
        this.cycle();
        return;
      }

      var direction = index > activeIndex ? Direction.NEXT : Direction.PREV;

      this.slide(direction, this.items[index]);
    };

    proto.dispose = function dispose() {
      $(this.element).off(EVENTKEY$2);
      $.removeData(this.element, DATAKEY$2);
      this.items = null;
      this.config = null;
      this.element = null;
      this.interval = null;
      this.isPaused = null;
      this.isSliding = null;
      this.activeElement = null;
      this.indicatorsElement = null;
    } // Private
    ;

    proto.getConfig = function getConfig(config) {
      config = objectSpread({}, Default, config);
      Util.typeCheckConfig(NAME$2, config, DefaultType);
      return config;
    };

    proto.handleSwipe = function handleSwipe() {
      var absDeltax = Math.abs(this.touchDeltaX);

      if (absDeltax <= SWIPETHRESHOLD) {
        return;
      }

      var direction = absDeltax / this.touchDeltaX; // swipe left

      if (direction > 0) {
        this.prev();
      } // swipe right


      if (direction < 0) {
        this.next();
      }
    };

    proto.addEventListeners = function addEventListeners() {
      var this2 = this;

      if (this.config.keyboard) {
        $(this.element).on(Event$2.KEYDOWN, function (event) {
          return this2.keydown(event);
        });
      }

      if (this.config.pause === 'hover') {
        $(this.element).on(Event$2.MOUSEENTER, function (event) {
          return this2.pause(event);
        }).on(Event$2.MOUSELEAVE, function (event) {
          return this2.cycle(event);
        });
      }

      if (this.config.touch) {
        this.addTouchEventListeners();
      }
    };

    proto.addTouchEventListeners = function addTouchEventListeners() {
      var this3 = this;

      if (!this.touchSupported) {
        return;
      }

      var start = function start(event) {
        if (this3.pointerEvent && PointerType[event.originalEvent.pointerType.toUpperCase()]) {
          this3.touchStartX = event.originalEvent.clientX;
        } else if (!this3.pointerEvent) {
          this3.touchStartX = event.originalEvent.touches[0].clientX;
        }
      };

      var move = function move(event) {
        // ensure swiping with one touch and not pinching
        if (event.originalEvent.touches && event.originalEvent.touches.length > 1) {
          this3.touchDeltaX = 0;
        } else {
          this3.touchDeltaX = event.originalEvent.touches[0].clientX - this3.touchStartX;
        }
      };

      var end = function end(event) {
        if (this3.pointerEvent && PointerType[event.originalEvent.pointerType.toUpperCase()]) {
          this3.touchDeltaX = event.originalEvent.clientX - this3.touchStartX;
        }

        this3.handleSwipe();

        if (this3.config.pause === 'hover') {
          // If it's a touch-enabled device, mouseenter/leave are fired as
          // part of the mouse compatibility events on first tap - the carousel
          // would stop cycling until user tapped out of it;
          // here, we listen for touchend, explicitly pause the carousel
          // (as if it's the second time we tap on it, mouseenter compat event
          // is NOT fired) and after a timeout (to allow for mouse compatibility
          // events to fire) we explicitly restart cycling
          this3.pause();

          if (this3.touchTimeout) {
            clearTimeout(this3.touchTimeout);
          }

          this3.touchTimeout = setTimeout(function (event) {
            return this3.cycle(event);
          }, TOUCHEVENTCOMPATWAIT + this3.config.interval);
        }
      };

      $(this.element.querySelectorAll(Selector$2.ITEMIMG)).on(Event$2.DRAGSTART, function (e) {
        return e.preventDefault();
      });

      if (this.pointerEvent) {
        $(this.element).on(Event$2.POINTERDOWN, function (event) {
          return start(event);
        });
        $(this.element).on(Event$2.POINTERUP, function (event) {
          return end(event);
        });

        this.element.classList.add(ClassName$2.POINTEREVENT);
      } else {
        $(this.element).on(Event$2.TOUCHSTART, function (event) {
          return start(event);
        });
        $(this.element).on(Event$2.TOUCHMOVE, function (event) {
          return move(event);
        });
        $(this.element).on(Event$2.TOUCHEND, function (event) {
          return end(event);
        });
      }
    };

    proto.keydown = function keydown(event) {
      if (/input|textarea/i.test(event.target.tagName)) {
        return;
      }

      switch (event.which) {
        case ARROWLEFTKEYCODE:
          event.preventDefault();
          this.prev();
          break;

        case ARROWRIGHTKEYCODE:
          event.preventDefault();
          this.next();
          break;

        default:
      }
    };

    proto.getItemIndex = function getItemIndex(element) {
      this.items = element && element.parentNode ? [].slice.call(element.parentNode.querySelectorAll(Selector$2.ITEM)) : [];
      return this.items.indexOf(element);
    };

    proto.getItemByDirection = function getItemByDirection(direction, activeElement) {
      var isNextDirection = direction === Direction.NEXT;
      var isPrevDirection = direction === Direction.PREV;

      var activeIndex = this.getItemIndex(activeElement);

      var lastItemIndex = this.items.length - 1;
      var isGoingToWrap = isPrevDirection && activeIndex === 0 || isNextDirection && activeIndex === lastItemIndex;

      if (isGoingToWrap && !this.config.wrap) {
        return activeElement;
      }

      var delta = direction === Direction.PREV ? -1 : 1;
      var itemIndex = (activeIndex + delta) % this.items.length;
      return itemIndex === -1 ? this.items[this.items.length - 1] : this.items[itemIndex];
    };

    proto.triggerSlideEvent = function triggerSlideEvent(relatedTarget, eventDirectionName) {
      var targetIndex = this.getItemIndex(relatedTarget);

      var fromIndex = this.getItemIndex(this.element.querySelector(Selector$2.ACTIVEITEM));

      var slideEvent = $.Event(Event$2.SLIDE, {
        relatedTarget: relatedTarget,
        direction: eventDirectionName,
        from: fromIndex,
        to: targetIndex
      });
      $(this.element).trigger(slideEvent);
      return slideEvent;
    };

    proto.setActiveIndicatorElement = function setActiveIndicatorElement(element) {
      if (this.indicatorsElement) {
        var indicators = [].slice.call(this.indicatorsElement.querySelectorAll(Selector$2.ACTIVE));
        $(indicators).removeClass(ClassName$2.ACTIVE);

        var nextIndicator = this.indicatorsElement.children[this.getItemIndex(element)];

        if (nextIndicator) {
          $(nextIndicator).addClass(ClassName$2.ACTIVE);
        }
      }
    };

    proto.slide = function slide(direction, element) {
      var this4 = this;

      var activeElement = this.element.querySelector(Selector$2.ACTIVEITEM);

      var activeElementIndex = this.getItemIndex(activeElement);

      var nextElement = element || activeElement && this.getItemByDirection(direction, activeElement);

      var nextElementIndex = this.getItemIndex(nextElement);

      var isCycling = Boolean(this.interval);
      var directionalClassName;
      var orderClassName;
      var eventDirectionName;

      if (direction === Direction.NEXT) {
        directionalClassName = ClassName$2.LEFT;
        orderClassName = ClassName$2.NEXT;
        eventDirectionName = Direction.LEFT;
      } else {
        directionalClassName = ClassName$2.RIGHT;
        orderClassName = ClassName$2.PREV;
        eventDirectionName = Direction.RIGHT;
      }

      if (nextElement && $(nextElement).hasClass(ClassName$2.ACTIVE)) {
        this.isSliding = false;
        return;
      }

      var slideEvent = this.triggerSlideEvent(nextElement, eventDirectionName);

      if (slideEvent.isDefaultPrevented()) {
        return;
      }

      if (!activeElement || !nextElement) {
        // Some weirdness is happening, so we bail
        return;
      }

      this.isSliding = true;

      if (isCycling) {
        this.pause();
      }

      this.setActiveIndicatorElement(nextElement);

      var slidEvent = $.Event(Event$2.SLID, {
        relatedTarget: nextElement,
        direction: eventDirectionName,
        from: activeElementIndex,
        to: nextElementIndex
      });

      if ($(this.element).hasClass(ClassName$2.SLIDE)) {
        $(nextElement).addClass(orderClassName);
        Util.reflow(nextElement);
        $(activeElement).addClass(directionalClassName);
        $(nextElement).addClass(directionalClassName);
        var nextElementInterval = parseInt(nextElement.getAttribute('data-interval'), 10);

        if (nextElementInterval) {
          this.config.defaultInterval = this.config.defaultInterval || this.config.interval;
          this.config.interval = nextElementInterval;
        } else {
          this.config.interval = this.config.defaultInterval || this.config.interval;
        }

        var transitionDuration = Util.getTransitionDurationFromElement(activeElement);
        $(activeElement).one(Util.TRANSITIONEND, function () {
          $(nextElement).removeClass(directionalClassName + " " + orderClassName).addClass(ClassName$2.ACTIVE);
          $(activeElement).removeClass(ClassName$2.ACTIVE + " " + orderClassName + " " + directionalClassName);
          this4.isSliding = false;
          setTimeout(function () {
            return $(this4.element).trigger(slidEvent);
          }, 0);
        }).emulateTransitionEnd(transitionDuration);
      } else {
        $(activeElement).removeClass(ClassName$2.ACTIVE);
        $(nextElement).addClass(ClassName$2.ACTIVE);
        this.isSliding = false;
        $(this.element).trigger(slidEvent);
      }

      if (isCycling) {
        this.cycle();
      }
    } // Static
    ;

    Carousel.jQueryInterface = function jQueryInterface(config) {
      return this.each(function () {
        var data = $(this).data(DATAKEY$2);

        var config = objectSpread({}, Default, $(this).data());

        if (typeof config === 'object') {
          config = objectSpread({}, config, config);
        }

        var action = typeof config === 'string' ? config : config.slide;

        if (!data) {
          data = new Carousel(this, config);
          $(this).data(DATAKEY$2, data);
        }

        if (typeof config === 'number') {
          data.to(config);
        } else if (typeof action === 'string') {
          if (typeof data[action] === 'undefined') {
            throw new TypeError("No method named \"" + action + "\"");
          }

          data[action]();
        } else if (config.interval && config.ride) {
          data.pause();
          data.cycle();
        }
      });
    };

    Carousel.dataApiClickHandler = function dataApiClickHandler(event) {
      var selector = Util.getSelectorFromElement(this);

      if (!selector) {
        return;
      }

      var target = $(selector)[0];

      if (!target || !$(target).hasClass(ClassName$2.CAROUSEL)) {
        return;
      }

      var config = objectSpread({}, $(target).data(), $(this).data());

      var slideIndex = this.getAttribute('data-slide-to');

      if (slideIndex) {
        config.interval = false;
      }

      Carousel.jQueryInterface.call($(target), config);

      if (slideIndex) {
        $(target).data(DATAKEY$2).to(slideIndex);
      }

      event.preventDefault();
    };

    createClass(Carousel, null, [{
      key: "VERSION",
      get: function get() {
        return VERSION$2;
      }
    }, {
      key: "Default",
      get: function get() {
        return Default;
      }
    }]);

    return Carousel;
  }();
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  $(document).on(Event$2.CLICKDATAAPI, Selector$2.DATASLIDE, Carousel.dataApiClickHandler);
  $(window).on(Event$2.LOADDATAAPI, function () {
    var carousels = [].slice.call(document.querySelectorAll(Selector$2.DATARIDE));

    for (var i = 0, len = carousels.length; i < len; i++) {
      var $carousel = $(carousels[i]);

      Carousel.jQueryInterface.call($carousel, $carousel.data());
    }
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $.fn[NAME$2] = Carousel.jQueryInterface;
  $.fn[NAME$2].Constructor = Carousel;

  $.fn[NAME$2].noConflict = function () {
    $.fn[NAME$2] = JQUERYNOCONFLICT$2;
    return Carousel.jQueryInterface;
  };

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  var NAME$3 = 'collapse';
  var VERSION$3 = '4.3.1';
  var DATAKEY$3 = 'bs.collapse';
  var EVENTKEY$3 = "." + DATAKEY$3;
  var DATAAPIKEY$3 = '.data-api';
  var JQUERYNOCONFLICT$3 = $.fn[NAME$3];
  var Default$1 = {
    toggle: true,
    parent: ''
  };
  var DefaultType$1 = {
    toggle: 'boolean',
    parent: '(string|element)'
  };
  var Event$3 = {
    SHOW: "show" + EVENTKEY$3,
    SHOWN: "shown" + EVENTKEY$3,
    HIDE: "hide" + EVENTKEY$3,
    HIDDEN: "hidden" + EVENTKEY$3,
    CLICKDATAAPI: "click" + EVENTKEY$3 + DATAAPIKEY$3
  };
  var ClassName$3 = {
    SHOW: 'show',
    COLLAPSE: 'collapse',
    COLLAPSING: 'collapsing',
    COLLAPSED: 'collapsed'
  };
  var Dimension = {
    WIDTH: 'width',
    HEIGHT: 'height'
  };
  var Selector$3 = {
    ACTIVES: '.show, .collapsing',
    DATATOGGLE: '[data-toggle="collapse"]'
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

  };

  var Collapse =
  /*#PURE*/
  function () {
    function Collapse(element, config) {
      this.isTransitioning = false;
      this.element = element;
      this.config = this.getConfig(config);
      this.triggerArray = [].slice.call(document.querySelectorAll("[data-toggle=\"collapse\"][href=\"#" + element.id + "\"]," + ("[data-toggle=\"collapse\"][data-target=\"#" + element.id + "\"]")));
      var toggleList = [].slice.call(document.querySelectorAll(Selector$3.DATATOGGLE));

      for (var i = 0, len = toggleList.length; i < len; i++) {
        var elem = toggleList[i];
        var selector = Util.getSelectorFromElement(elem);
        var filterElement = [].slice.call(document.querySelectorAll(selector)).filter(function (foundElem) {
          return foundElem === element;
        });

        if (selector !== null && filterElement.length > 0) {
          this.selector = selector;

          this.triggerArray.push(elem);
        }
      }

      this.parent = this.config.parent ? this.getParent() : null;

      if (!this.config.parent) {
        this.addAriaAndCollapsedClass(this.element, this.triggerArray);
      }

      if (this.config.toggle) {
        this.toggle();
      }
    } // Getters


    var proto = Collapse.prototype;

    // Public
    proto.toggle = function toggle() {
      if ($(this.element).hasClass(ClassName$3.SHOW)) {
        this.hide();
      } else {
        this.show();
      }
    };

    proto.show = function show() {
      var this = this;

      if (this.isTransitioning || $(this.element).hasClass(ClassName$3.SHOW)) {
        return;
      }

      var actives;
      var activesData;

      if (this.parent) {
        actives = [].slice.call(this.parent.querySelectorAll(Selector$3.ACTIVES)).filter(function (elem) {
          if (typeof this.config.parent === 'string') {
            return elem.getAttribute('data-parent') === this.config.parent;
          }

          return elem.classList.contains(ClassName$3.COLLAPSE);
        });

        if (actives.length === 0) {
          actives = null;
        }
      }

      if (actives) {
        activesData = $(actives).not(this.selector).data(DATAKEY$3);

        if (activesData && activesData.isTransitioning) {
          return;
        }
      }

      var startEvent = $.Event(Event$3.SHOW);
      $(this.element).trigger(startEvent);

      if (startEvent.isDefaultPrevented()) {
        return;
      }

      if (actives) {
        Collapse.jQueryInterface.call($(actives).not(this.selector), 'hide');

        if (!activesData) {
          $(actives).data(DATAKEY$3, null);
        }
      }

      var dimension = this.getDimension();

      $(this.element).removeClass(ClassName$3.COLLAPSE).addClass(ClassName$3.COLLAPSING);
      this.element.style[dimension] = 0;

      if (this.triggerArray.length) {
        $(this.triggerArray).removeClass(ClassName$3.COLLAPSED).attr('aria-expanded', true);
      }

      this.setTransitioning(true);

      var complete = function complete() {
        $(this.element).removeClass(ClassName$3.COLLAPSING).addClass(ClassName$3.COLLAPSE).addClass(ClassName$3.SHOW);
        this.element.style[dimension] = '';

        this.setTransitioning(false);

        $(this.element).trigger(Event$3.SHOWN);
      };

      var capitalizedDimension = dimension[0].toUpperCase() + dimension.slice(1);
      var scrollSize = "scroll" + capitalizedDimension;
      var transitionDuration = Util.getTransitionDurationFromElement(this.element);
      $(this.element).one(Util.TRANSITIONEND, complete).emulateTransitionEnd(transitionDuration);
      this.element.style[dimension] = this.element[scrollSize] + "px";
    };

    proto.hide = function hide() {
      var this2 = this;

      if (this.isTransitioning || !$(this.element).hasClass(ClassName$3.SHOW)) {
        return;
      }

      var startEvent = $.Event(Event$3.HIDE);
      $(this.element).trigger(startEvent);

      if (startEvent.isDefaultPrevented()) {
        return;
      }

      var dimension = this.getDimension();

      this.element.style[dimension] = this.element.getBoundingClientRect()[dimension] + "px";
      Util.reflow(this.element);
      $(this.element).addClass(ClassName$3.COLLAPSING).removeClass(ClassName$3.COLLAPSE).removeClass(ClassName$3.SHOW);
      var triggerArrayLength = this.triggerArray.length;

      if (triggerArrayLength > 0) {
        for (var i = 0; i < triggerArrayLength; i++) {
          var trigger = this.triggerArray[i];
          var selector = Util.getSelectorFromElement(trigger);

          if (selector !== null) {
            var $elem = $([].slice.call(document.querySelectorAll(selector)));

            if (!$elem.hasClass(ClassName$3.SHOW)) {
              $(trigger).addClass(ClassName$3.COLLAPSED).attr('aria-expanded', false);
            }
          }
        }
      }

      this.setTransitioning(true);

      var complete = function complete() {
        this2.setTransitioning(false);

        $(this2.element).removeClass(ClassName$3.COLLAPSING).addClass(ClassName$3.COLLAPSE).trigger(Event$3.HIDDEN);
      };

      this.element.style[dimension] = '';
      var transitionDuration = Util.getTransitionDurationFromElement(this.element);
      $(this.element).one(Util.TRANSITIONEND, complete).emulateTransitionEnd(transitionDuration);
    };

    proto.setTransitioning = function setTransitioning(isTransitioning) {
      this.isTransitioning = isTransitioning;
    };

    proto.dispose = function dispose() {
      $.removeData(this.element, DATAKEY$3);
      this.config = null;
      this.parent = null;
      this.element = null;
      this.triggerArray = null;
      this.isTransitioning = null;
    } // Private
    ;

    proto.getConfig = function getConfig(config) {
      config = objectSpread({}, Default$1, config);
      config.toggle = Boolean(config.toggle); // Coerce string values

      Util.typeCheckConfig(NAME$3, config, DefaultType$1);
      return config;
    };

    proto.getDimension = function getDimension() {
      var hasWidth = $(this.element).hasClass(Dimension.WIDTH);
      return hasWidth ? Dimension.WIDTH : Dimension.HEIGHT;
    };

    proto.getParent = function getParent() {
      var this3 = this;

      var parent;

      if (Util.isElement(this.config.parent)) {
        parent = this.config.parent; // It's a jQuery object

        if (typeof this.config.parent.jquery !== 'undefined') {
          parent = this.config.parent[0];
        }
      } else {
        parent = document.querySelector(this.config.parent);
      }

      var selector = "[data-toggle=\"collapse\"][data-parent=\"" + this.config.parent + "\"]";
      var children = [].slice.call(parent.querySelectorAll(selector));
      $(children).each(function (i, element) {
        this3.addAriaAndCollapsedClass(Collapse.getTargetFromElement(element), [element]);
      });
      return parent;
    };

    proto.addAriaAndCollapsedClass = function addAriaAndCollapsedClass(element, triggerArray) {
      var isOpen = $(element).hasClass(ClassName$3.SHOW);

      if (triggerArray.length) {
        $(triggerArray).toggleClass(ClassName$3.COLLAPSED, !isOpen).attr('aria-expanded', isOpen);
      }
    } // Static
    ;

    Collapse.getTargetFromElement = function getTargetFromElement(element) {
      var selector = Util.getSelectorFromElement(element);
      return selector ? document.querySelector(selector) : null;
    };

    Collapse.jQueryInterface = function jQueryInterface(config) {
      return this.each(function () {
        var $this = $(this);
        var data = $this.data(DATAKEY$3);

        var config = objectSpread({}, Default$1, $this.data(), typeof config === 'object' && config ? config : {});

        if (!data && config.toggle && /show|hide/.test(config)) {
          config.toggle = false;
        }

        if (!data) {
          data = new Collapse(this, config);
          $this.data(DATAKEY$3, data);
        }

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError("No method named \"" + config + "\"");
          }

          data[config]();
        }
      });
    };

    createClass(Collapse, null, [{
      key: "VERSION",
      get: function get() {
        return VERSION$3;
      }
    }, {
      key: "Default",
      get: function get() {
        return Default$1;
      }
    }]);

    return Collapse;
  }();
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  $(document).on(Event$3.CLICKDATAAPI, Selector$3.DATATOGGLE, function (event) {
    // preventDefault only for <a> elements (which change the URL) not inside the collapsible element
    if (event.currentTarget.tagName === 'A') {
      event.preventDefault();
    }

    var $trigger = $(this);
    var selector = Util.getSelectorFromElement(this);
    var selectors = [].slice.call(document.querySelectorAll(selector));
    $(selectors).each(function () {
      var $target = $(this);
      var data = $target.data(DATAKEY$3);
      var config = data ? 'toggle' : $trigger.data();

      Collapse.jQueryInterface.call($target, config);
    });
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $.fn[NAME$3] = Collapse.jQueryInterface;
  $.fn[NAME$3].Constructor = Collapse;

  $.fn[NAME$3].noConflict = function () {
    $.fn[NAME$3] = JQUERYNOCONFLICT$3;
    return Collapse.jQueryInterface;
  };

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  var NAME$4 = 'dropdown';
  var VERSION$4 = '4.3.1';
  var DATAKEY$4 = 'bs.dropdown';
  var EVENTKEY$4 = "." + DATAKEY$4;
  var DATAAPIKEY$4 = '.data-api';
  var JQUERYNOCONFLICT$4 = $.fn[NAME$4];
  var ESCAPEKEYCODE = 27; // KeyboardEvent.which value for Escape (Esc) key

  var SPACEKEYCODE = 32; // KeyboardEvent.which value for space key

  var TABKEYCODE = 9; // KeyboardEvent.which value for tab key

  var ARROWUPKEYCODE = 38; // KeyboardEvent.which value for up arrow key

  var ARROWDOWNKEYCODE = 40; // KeyboardEvent.which value for down arrow key

  var RIGHTMOUSEBUTTONWHICH = 3; // MouseEvent.which value for the right button (assuming a right-handed mouse)

  var REGEXPKEYDOWN = new RegExp(ARROWUPKEYCODE + "|" + ARROWDOWNKEYCODE + "|" + ESCAPEKEYCODE);
  var Event$4 = {
    HIDE: "hide" + EVENTKEY$4,
    HIDDEN: "hidden" + EVENTKEY$4,
    SHOW: "show" + EVENTKEY$4,
    SHOWN: "shown" + EVENTKEY$4,
    CLICK: "click" + EVENTKEY$4,
    CLICKDATAAPI: "click" + EVENTKEY$4 + DATAAPIKEY$4,
    KEYDOWNDATAAPI: "keydown" + EVENTKEY$4 + DATAAPIKEY$4,
    KEYUPDATAAPI: "keyup" + EVENTKEY$4 + DATAAPIKEY$4
  };
  var ClassName$4 = {
    DISABLED: 'disabled',
    SHOW: 'show',
    DROPUP: 'dropup',
    DROPRIGHT: 'dropright',
    DROPLEFT: 'dropleft',
    MENURIGHT: 'dropdown-menu-right',
    MENULEFT: 'dropdown-menu-left',
    POSITIONSTATIC: 'position-static'
  };
  var Selector$4 = {
    DATATOGGLE: '[data-toggle="dropdown"]',
    FORMCHILD: '.dropdown form',
    MENU: '.dropdown-menu',
    NAVBARNAV: '.navbar-nav',
    VISIBLEITEMS: '.dropdown-menu .dropdown-item:not(.disabled):not(:disabled)'
  };
  var AttachmentMap = {
    TOP: 'top-start',
    TOPEND: 'top-end',
    BOTTOM: 'bottom-start',
    BOTTOMEND: 'bottom-end',
    RIGHT: 'right-start',
    RIGHTEND: 'right-end',
    LEFT: 'left-start',
    LEFTEND: 'left-end'
  };
  var Default$2 = {
    offset: 0,
    flip: true,
    boundary: 'scrollParent',
    reference: 'toggle',
    display: 'dynamic'
  };
  var DefaultType$2 = {
    offset: '(number|string|function)',
    flip: 'boolean',
    boundary: '(string|element)',
    reference: '(string|element)',
    display: 'string'
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

  };

  var Dropdown =
  /*#PURE*/
  function () {
    function Dropdown(element, config) {
      this.element = element;
      this.popper = null;
      this.config = this.getConfig(config);
      this.menu = this.getMenuElement();
      this.inNavbar = this.detectNavbar();

      this.addEventListeners();
    } // Getters


    var proto = Dropdown.prototype;

    // Public
    proto.toggle = function toggle() {
      if (this.element.disabled || $(this.element).hasClass(ClassName$4.DISABLED)) {
        return;
      }

      var parent = Dropdown.getParentFromElement(this.element);

      var isActive = $(this.menu).hasClass(ClassName$4.SHOW);

      Dropdown.clearMenus();

      if (isActive) {
        return;
      }

      var relatedTarget = {
        relatedTarget: this.element
      };
      var showEvent = $.Event(Event$4.SHOW, relatedTarget);
      $(parent).trigger(showEvent);

      if (showEvent.isDefaultPrevented()) {
        return;
      } // Disable totally Popper.js for Dropdown in Navbar


      if (!this.inNavbar) {
        /**
         * Check for Popper dependency
         * Popper - https://popper.js.org
         */
        if (typeof Popper === 'undefined') {
          throw new TypeError('Bootstrap\'s dropdowns require Popper.js (https://popper.js.org/)');
        }

        var referenceElement = this.element;

        if (this.config.reference === 'parent') {
          referenceElement = parent;
        } else if (Util.isElement(this.config.reference)) {
          referenceElement = this.config.reference; // Check if it's jQuery element

          if (typeof this.config.reference.jquery !== 'undefined') {
            referenceElement = this.config.reference[0];
          }
        } // If boundary is not `scrollParent`, then set position to `static`
        // to allow the menu to "escape" the scroll parent's boundaries
        // https://github.com/twbs/bootstrap/issues/24251


        if (this.config.boundary !== 'scrollParent') {
          $(parent).addClass(ClassName$4.POSITIONSTATIC);
        }

        this.popper = new Popper(referenceElement, this.menu, this.getPopperConfig());
      } // If this is a touch-enabled device we add extra
      // empty mouseover listeners to the body's immediate children;
      // only needed because of broken event delegation on iOS
      // https://www.quirksmode.org/blog/archives/2014/02/mouseeventbub.html


      if ('ontouchstart' in document.documentElement && $(parent).closest(Selector$4.NAVBARNAV).length === 0) {
        $(document.body).children().on('mouseover', null, $.noop);
      }

      this.element.focus();

      this.element.setAttribute('aria-expanded', true);

      $(this.menu).toggleClass(ClassName$4.SHOW);
      $(parent).toggleClass(ClassName$4.SHOW).trigger($.Event(Event$4.SHOWN, relatedTarget));
    };

    proto.show = function show() {
      if (this.element.disabled || $(this.element).hasClass(ClassName$4.DISABLED) || $(this.menu).hasClass(ClassName$4.SHOW)) {
        return;
      }

      var relatedTarget = {
        relatedTarget: this.element
      };
      var showEvent = $.Event(Event$4.SHOW, relatedTarget);

      var parent = Dropdown.getParentFromElement(this.element);

      $(parent).trigger(showEvent);

      if (showEvent.isDefaultPrevented()) {
        return;
      }

      $(this.menu).toggleClass(ClassName$4.SHOW);
      $(parent).toggleClass(ClassName$4.SHOW).trigger($.Event(Event$4.SHOWN, relatedTarget));
    };

    proto.hide = function hide() {
      if (this.element.disabled || $(this.element).hasClass(ClassName$4.DISABLED) || !$(this.menu).hasClass(ClassName$4.SHOW)) {
        return;
      }

      var relatedTarget = {
        relatedTarget: this.element
      };
      var hideEvent = $.Event(Event$4.HIDE, relatedTarget);

      var parent = Dropdown.getParentFromElement(this.element);

      $(parent).trigger(hideEvent);

      if (hideEvent.isDefaultPrevented()) {
        return;
      }

      $(this.menu).toggleClass(ClassName$4.SHOW);
      $(parent).toggleClass(ClassName$4.SHOW).trigger($.Event(Event$4.HIDDEN, relatedTarget));
    };

    proto.dispose = function dispose() {
      $.removeData(this.element, DATAKEY$4);
      $(this.element).off(EVENTKEY$4);
      this.element = null;
      this.menu = null;

      if (this.popper !== null) {
        this.popper.destroy();

        this.popper = null;
      }
    };

    proto.update = function update() {
      this.inNavbar = this.detectNavbar();

      if (this.popper !== null) {
        this.popper.scheduleUpdate();
      }
    } // Private
    ;

    proto.addEventListeners = function addEventListeners() {
      var this = this;

      $(this.element).on(Event$4.CLICK, function (event) {
        event.preventDefault();
        event.stopPropagation();

        this.toggle();
      });
    };

    proto.getConfig = function getConfig(config) {
      config = objectSpread({}, this.constructor.Default, $(this.element).data(), config);
      Util.typeCheckConfig(NAME$4, config, this.constructor.DefaultType);
      return config;
    };

    proto.getMenuElement = function getMenuElement() {
      if (!this.menu) {
        var parent = Dropdown.getParentFromElement(this.element);

        if (parent) {
          this.menu = parent.querySelector(Selector$4.MENU);
        }
      }

      return this.menu;
    };

    proto.getPlacement = function getPlacement() {
      var $parentDropdown = $(this.element.parentNode);
      var placement = AttachmentMap.BOTTOM; // Handle dropup

      if ($parentDropdown.hasClass(ClassName$4.DROPUP)) {
        placement = AttachmentMap.TOP;

        if ($(this.menu).hasClass(ClassName$4.MENURIGHT)) {
          placement = AttachmentMap.TOPEND;
        }
      } else if ($parentDropdown.hasClass(ClassName$4.DROPRIGHT)) {
        placement = AttachmentMap.RIGHT;
      } else if ($parentDropdown.hasClass(ClassName$4.DROPLEFT)) {
        placement = AttachmentMap.LEFT;
      } else if ($(this.menu).hasClass(ClassName$4.MENURIGHT)) {
        placement = AttachmentMap.BOTTOMEND;
      }

      return placement;
    };

    proto.detectNavbar = function detectNavbar() {
      return $(this.element).closest('.navbar').length > 0;
    };

    proto.getOffset = function getOffset() {
      var this2 = this;

      var offset = {};

      if (typeof this.config.offset === 'function') {
        offset.fn = function (data) {
          data.offsets = objectSpread({}, data.offsets, this2.config.offset(data.offsets, this2.element) || {});
          return data;
        };
      } else {
        offset.offset = this.config.offset;
      }

      return offset;
    };

    proto.getPopperConfig = function getPopperConfig() {
      var popperConfig = {
        placement: this.getPlacement(),
        modifiers: {
          offset: this.getOffset(),
          flip: {
            enabled: this.config.flip
          },
          preventOverflow: {
            boundariesElement: this.config.boundary
          }
        } // Disable Popper.js if we have a static display

      };

      if (this.config.display === 'static') {
        popperConfig.modifiers.applyStyle = {
          enabled: false
        };
      }

      return popperConfig;
    } // Static
    ;

    Dropdown.jQueryInterface = function jQueryInterface(config) {
      return this.each(function () {
        var data = $(this).data(DATAKEY$4);

        var config = typeof config === 'object' ? config : null;

        if (!data) {
          data = new Dropdown(this, config);
          $(this).data(DATAKEY$4, data);
        }

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError("No method named \"" + config + "\"");
          }

          data[config]();
        }
      });
    };

    Dropdown.clearMenus = function clearMenus(event) {
      if (event && (event.which === RIGHTMOUSEBUTTONWHICH || event.type === 'keyup' && event.which !== TABKEYCODE)) {
        return;
      }

      var toggles = [].slice.call(document.querySelectorAll(Selector$4.DATATOGGLE));

      for (var i = 0, len = toggles.length; i < len; i++) {
        var parent = Dropdown.getParentFromElement(toggles[i]);

        var context = $(toggles[i]).data(DATAKEY$4);
        var relatedTarget = {
          relatedTarget: toggles[i]
        };

        if (event && event.type === 'click') {
          relatedTarget.clickEvent = event;
        }

        if (!context) {
          continue;
        }

        var dropdownMenu = context.menu;

        if (!$(parent).hasClass(ClassName$4.SHOW)) {
          continue;
        }

        if (event && (event.type === 'click' && /input|textarea/i.test(event.target.tagName) || event.type === 'keyup' && event.which === TABKEYCODE) && $.contains(parent, event.target)) {
          continue;
        }

        var hideEvent = $.Event(Event$4.HIDE, relatedTarget);
        $(parent).trigger(hideEvent);

        if (hideEvent.isDefaultPrevented()) {
          continue;
        } // If this is a touch-enabled device we remove the extra
        // empty mouseover listeners we added for iOS support


        if ('ontouchstart' in document.documentElement) {
          $(document.body).children().off('mouseover', null, $.noop);
        }

        toggles[i].setAttribute('aria-expanded', 'false');
        $(dropdownMenu).removeClass(ClassName$4.SHOW);
        $(parent).removeClass(ClassName$4.SHOW).trigger($.Event(Event$4.HIDDEN, relatedTarget));
      }
    };

    Dropdown.getParentFromElement = function getParentFromElement(element) {
      var parent;
      var selector = Util.getSelectorFromElement(element);

      if (selector) {
        parent = document.querySelector(selector);
      }

      return parent || element.parentNode;
    } // eslint-disable-next-line complexity
    ;

    Dropdown.dataApiKeydownHandler = function dataApiKeydownHandler(event) {
      // If not input/textarea:
      //  - And not a key in REGEXPKEYDOWN => not a dropdown command
      // If input/textarea:
      //  - If space key => not a dropdown command
      //  - If key is other than escape
      //    - If key is not up or down => not a dropdown command
      //    - If trigger inside the menu => not a dropdown command
      if (/input|textarea/i.test(event.target.tagName) ? event.which === SPACEKEYCODE || event.which !== ESCAPEKEYCODE && (event.which !== ARROWDOWNKEYCODE && event.which !== ARROWUPKEYCODE || $(event.target).closest(Selector$4.MENU).length) : !REGEXPKEYDOWN.test(event.which)) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      if (this.disabled || $(this).hasClass(ClassName$4.DISABLED)) {
        return;
      }

      var parent = Dropdown.getParentFromElement(this);

      var isActive = $(parent).hasClass(ClassName$4.SHOW);

      if (!isActive || isActive && (event.which === ESCAPEKEYCODE || event.which === SPACEKEYCODE)) {
        if (event.which === ESCAPEKEYCODE) {
          var toggle = parent.querySelector(Selector$4.DATATOGGLE);
          $(toggle).trigger('focus');
        }

        $(this).trigger('click');
        return;
      }

      var items = [].slice.call(parent.querySelectorAll(Selector$4.VISIBLEITEMS));

      if (items.length === 0) {
        return;
      }

      var index = items.indexOf(event.target);

      if (event.which === ARROWUPKEYCODE && index > 0) {
        // Up
        index--;
      }

      if (event.which === ARROWDOWNKEYCODE && index < items.length - 1) {
        // Down
        index++;
      }

      if (index < 0) {
        index = 0;
      }

      items[index].focus();
    };

    createClass(Dropdown, null, [{
      key: "VERSION",
      get: function get() {
        return VERSION$4;
      }
    }, {
      key: "Default",
      get: function get() {
        return Default$2;
      }
    }, {
      key: "DefaultType",
      get: function get() {
        return DefaultType$2;
      }
    }]);

    return Dropdown;
  }();
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  $(document).on(Event$4.KEYDOWNDATAAPI, Selector$4.DATATOGGLE, Dropdown.dataApiKeydownHandler).on(Event$4.KEYDOWNDATAAPI, Selector$4.MENU, Dropdown.dataApiKeydownHandler).on(Event$4.CLICKDATAAPI + " " + Event$4.KEYUPDATAAPI, Dropdown.clearMenus).on(Event$4.CLICKDATAAPI, Selector$4.DATATOGGLE, function (event) {
    event.preventDefault();
    event.stopPropagation();

    Dropdown.jQueryInterface.call($(this), 'toggle');
  }).on(Event$4.CLICKDATAAPI, Selector$4.FORMCHILD, function (e) {
    e.stopPropagation();
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $.fn[NAME$4] = Dropdown.jQueryInterface;
  $.fn[NAME$4].Constructor = Dropdown;

  $.fn[NAME$4].noConflict = function () {
    $.fn[NAME$4] = JQUERYNOCONFLICT$4;
    return Dropdown.jQueryInterface;
  };

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  var NAME$5 = 'modal';
  var VERSION$5 = '4.3.1';
  var DATAKEY$5 = 'bs.modal';
  var EVENTKEY$5 = "." + DATAKEY$5;
  var DATAAPIKEY$5 = '.data-api';
  var JQUERYNOCONFLICT$5 = $.fn[NAME$5];
  var ESCAPEKEYCODE$1 = 27; // KeyboardEvent.which value for Escape (Esc) key

  var Default$3 = {
    backdrop: true,
    keyboard: true,
    focus: true,
    show: true
  };
  var DefaultType$3 = {
    backdrop: '(boolean|string)',
    keyboard: 'boolean',
    focus: 'boolean',
    show: 'boolean'
  };
  var Event$5 = {
    HIDE: "hide" + EVENTKEY$5,
    HIDDEN: "hidden" + EVENTKEY$5,
    SHOW: "show" + EVENTKEY$5,
    SHOWN: "shown" + EVENTKEY$5,
    FOCUSIN: "focusin" + EVENTKEY$5,
    RESIZE: "resize" + EVENTKEY$5,
    CLICKDISMISS: "click.dismiss" + EVENTKEY$5,
    KEYDOWNDISMISS: "keydown.dismiss" + EVENTKEY$5,
    MOUSEUPDISMISS: "mouseup.dismiss" + EVENTKEY$5,
    MOUSEDOWNDISMISS: "mousedown.dismiss" + EVENTKEY$5,
    CLICKDATAAPI: "click" + EVENTKEY$5 + DATAAPIKEY$5
  };
  var ClassName$5 = {
    SCROLLABLE: 'modal-dialog-scrollable',
    SCROLLBARMEASURER: 'modal-scrollbar-measure',
    BACKDROP: 'modal-backdrop',
    OPEN: 'modal-open',
    FADE: 'fade',
    SHOW: 'show'
  };
  var Selector$5 = {
    DIALOG: '.modal-dialog',
    MODALBODY: '.modal-body',
    DATATOGGLE: '[data-toggle="modal"]',
    DATADISMISS: '[data-dismiss="modal"]',
    FIXEDCONTENT: '.fixed-top, .fixed-bottom, .is-fixed, .sticky-top',
    STICKYCONTENT: '.sticky-top'
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

  };

  var Modal =
  /*#PURE*/
  function () {
    function Modal(element, config) {
      this.config = this.getConfig(config);
      this.element = element;
      this.dialog = element.querySelector(Selector$5.DIALOG);
      this.backdrop = null;
      this.isShown = false;
      this.isBodyOverflowing = false;
      this.ignoreBackdropClick = false;
      this.isTransitioning = false;
      this.scrollbarWidth = 0;
    } // Getters


    var proto = Modal.prototype;

    // Public
    proto.toggle = function toggle(relatedTarget) {
      return this.isShown ? this.hide() : this.show(relatedTarget);
    };

    proto.show = function show(relatedTarget) {
      var this = this;

      if (this.isShown || this.isTransitioning) {
        return;
      }

      if ($(this.element).hasClass(ClassName$5.FADE)) {
        this.isTransitioning = true;
      }

      var showEvent = $.Event(Event$5.SHOW, {
        relatedTarget: relatedTarget
      });
      $(this.element).trigger(showEvent);

      if (this.isShown || showEvent.isDefaultPrevented()) {
        return;
      }

      this.isShown = true;

      this.checkScrollbar();

      this.setScrollbar();

      this.adjustDialog();

      this.setEscapeEvent();

      this.setResizeEvent();

      $(this.element).on(Event$5.CLICKDISMISS, Selector$5.DATADISMISS, function (event) {
        return this.hide(event);
      });
      $(this.dialog).on(Event$5.MOUSEDOWNDISMISS, function () {
        $(this.element).one(Event$5.MOUSEUPDISMISS, function (event) {
          if ($(event.target).is(this.element)) {
            this.ignoreBackdropClick = true;
          }
        });
      });

      this.showBackdrop(function () {
        return this.showElement(relatedTarget);
      });
    };

    proto.hide = function hide(event) {
      var this2 = this;

      if (event) {
        event.preventDefault();
      }

      if (!this.isShown || this.isTransitioning) {
        return;
      }

      var hideEvent = $.Event(Event$5.HIDE);
      $(this.element).trigger(hideEvent);

      if (!this.isShown || hideEvent.isDefaultPrevented()) {
        return;
      }

      this.isShown = false;
      var transition = $(this.element).hasClass(ClassName$5.FADE);

      if (transition) {
        this.isTransitioning = true;
      }

      this.setEscapeEvent();

      this.setResizeEvent();

      $(document).off(Event$5.FOCUSIN);
      $(this.element).removeClass(ClassName$5.SHOW);
      $(this.element).off(Event$5.CLICKDISMISS);
      $(this.dialog).off(Event$5.MOUSEDOWNDISMISS);

      if (transition) {
        var transitionDuration = Util.getTransitionDurationFromElement(this.element);
        $(this.element).one(Util.TRANSITIONEND, function (event) {
          return this2.hideModal(event);
        }).emulateTransitionEnd(transitionDuration);
      } else {
        this.hideModal();
      }
    };

    proto.dispose = function dispose() {
      [window, this.element, this.dialog].forEach(function (htmlElement) {
        return $(htmlElement).off(EVENTKEY$5);
      });
      /**
       * `document` has 2 events `Event.FOCUSIN` and `Event.CLICKDATAAPI`
       * Do not move `document` in `htmlElements` array
       * It will remove `Event.CLICKDATAAPI` event that should remain
       */

      $(document).off(Event$5.FOCUSIN);
      $.removeData(this.element, DATAKEY$5);
      this.config = null;
      this.element = null;
      this.dialog = null;
      this.backdrop = null;
      this.isShown = null;
      this.isBodyOverflowing = null;
      this.ignoreBackdropClick = null;
      this.isTransitioning = null;
      this.scrollbarWidth = null;
    };

    proto.handleUpdate = function handleUpdate() {
      this.adjustDialog();
    } // Private
    ;

    proto.getConfig = function getConfig(config) {
      config = objectSpread({}, Default$3, config);
      Util.typeCheckConfig(NAME$5, config, DefaultType$3);
      return config;
    };

    proto.showElement = function showElement(relatedTarget) {
      var this3 = this;

      var transition = $(this.element).hasClass(ClassName$5.FADE);

      if (!this.element.parentNode || this.element.parentNode.nodeType !== Node.ELEMENTNODE) {
        // Don't move modal's DOM position
        document.body.appendChild(this.element);
      }

      this.element.style.display = 'block';

      this.element.removeAttribute('aria-hidden');

      this.element.setAttribute('aria-modal', true);

      if ($(this.dialog).hasClass(ClassName$5.SCROLLABLE)) {
        this.dialog.querySelector(Selector$5.MODALBODY).scrollTop = 0;
      } else {
        this.element.scrollTop = 0;
      }

      if (transition) {
        Util.reflow(this.element);
      }

      $(this.element).addClass(ClassName$5.SHOW);

      if (this.config.focus) {
        this.enforceFocus();
      }

      var shownEvent = $.Event(Event$5.SHOWN, {
        relatedTarget: relatedTarget
      });

      var transitionComplete = function transitionComplete() {
        if (this3.config.focus) {
          this3.element.focus();
        }

        this3.isTransitioning = false;
        $(this3.element).trigger(shownEvent);
      };

      if (transition) {
        var transitionDuration = Util.getTransitionDurationFromElement(this.dialog);
        $(this.dialog).one(Util.TRANSITIONEND, transitionComplete).emulateTransitionEnd(transitionDuration);
      } else {
        transitionComplete();
      }
    };

    proto.enforceFocus = function enforceFocus() {
      var this4 = this;

      $(document).off(Event$5.FOCUSIN) // Guard against infinite focus loop
      .on(Event$5.FOCUSIN, function (event) {
        if (document !== event.target && this4.element !== event.target && $(this4.element).has(event.target).length === 0) {
          this4.element.focus();
        }
      });
    };

    proto.setEscapeEvent = function setEscapeEvent() {
      var this5 = this;

      if (this.isShown && this.config.keyboard) {
        $(this.element).on(Event$5.KEYDOWNDISMISS, function (event) {
          if (event.which === ESCAPEKEYCODE$1) {
            event.preventDefault();

            this5.hide();
          }
        });
      } else if (!this.isShown) {
        $(this.element).off(Event$5.KEYDOWNDISMISS);
      }
    };

    proto.setResizeEvent = function setResizeEvent() {
      var this6 = this;

      if (this.isShown) {
        $(window).on(Event$5.RESIZE, function (event) {
          return this6.handleUpdate(event);
        });
      } else {
        $(window).off(Event$5.RESIZE);
      }
    };

    proto.hideModal = function hideModal() {
      var this7 = this;

      this.element.style.display = 'none';

      this.element.setAttribute('aria-hidden', true);

      this.element.removeAttribute('aria-modal');

      this.isTransitioning = false;

      this.showBackdrop(function () {
        $(document.body).removeClass(ClassName$5.OPEN);

        this7.resetAdjustments();

        this7.resetScrollbar();

        $(this7.element).trigger(Event$5.HIDDEN);
      });
    };

    proto.removeBackdrop = function removeBackdrop() {
      if (this.backdrop) {
        $(this.backdrop).remove();
        this.backdrop = null;
      }
    };

    proto.showBackdrop = function showBackdrop(callback) {
      var this8 = this;

      var animate = $(this.element).hasClass(ClassName$5.FADE) ? ClassName$5.FADE : '';

      if (this.isShown && this.config.backdrop) {
        this.backdrop = document.createElement('div');
        this.backdrop.className = ClassName$5.BACKDROP;

        if (animate) {
          this.backdrop.classList.add(animate);
        }

        $(this.backdrop).appendTo(document.body);
        $(this.element).on(Event$5.CLICKDISMISS, function (event) {
          if (this8.ignoreBackdropClick) {
            this8.ignoreBackdropClick = false;
            return;
          }

          if (event.target !== event.currentTarget) {
            return;
          }

          if (this8.config.backdrop === 'static') {
            this8.element.focus();
          } else {
            this8.hide();
          }
        });

        if (animate) {
          Util.reflow(this.backdrop);
        }

        $(this.backdrop).addClass(ClassName$5.SHOW);

        if (!callback) {
          return;
        }

        if (!animate) {
          callback();
          return;
        }

        var backdropTransitionDuration = Util.getTransitionDurationFromElement(this.backdrop);
        $(this.backdrop).one(Util.TRANSITIONEND, callback).emulateTransitionEnd(backdropTransitionDuration);
      } else if (!this.isShown && this.backdrop) {
        $(this.backdrop).removeClass(ClassName$5.SHOW);

        var callbackRemove = function callbackRemove() {
          this8.removeBackdrop();

          if (callback) {
            callback();
          }
        };

        if ($(this.element).hasClass(ClassName$5.FADE)) {
          var backdropTransitionDuration = Util.getTransitionDurationFromElement(this.backdrop);

          $(this.backdrop).one(Util.TRANSITIONEND, callbackRemove).emulateTransitionEnd(backdropTransitionDuration);
        } else {
          callbackRemove();
        }
      } else if (callback) {
        callback();
      }
    } // ----------------------------------------------------------------------
    // the following methods are used to handle overflowing modals
    // todo (fat): these should probably be refactored out of modal.js
    // ----------------------------------------------------------------------
    ;

    proto.adjustDialog = function adjustDialog() {
      var isModalOverflowing = this.element.scrollHeight > document.documentElement.clientHeight;

      if (!this.isBodyOverflowing && isModalOverflowing) {
        this.element.style.paddingLeft = this.scrollbarWidth + "px";
      }

      if (this.isBodyOverflowing && !isModalOverflowing) {
        this.element.style.paddingRight = this.scrollbarWidth + "px";
      }
    };

    proto.resetAdjustments = function resetAdjustments() {
      this.element.style.paddingLeft = '';
      this.element.style.paddingRight = '';
    };

    proto.checkScrollbar = function checkScrollbar() {
      var rect = document.body.getBoundingClientRect();
      this.isBodyOverflowing = rect.left + rect.right < window.innerWidth;
      this.scrollbarWidth = this.getScrollbarWidth();
    };

    proto.setScrollbar = function setScrollbar() {
      var this9 = this;

      if (this.isBodyOverflowing) {
        // Note: DOMNode.style.paddingRight returns the actual value or '' if not set
        //   while $(DOMNode).css('padding-right') returns the calculated value or 0 if not set
        var fixedContent = [].slice.call(document.querySelectorAll(Selector$5.FIXEDCONTENT));
        var stickyContent = [].slice.call(document.querySelectorAll(Selector$5.STICKYCONTENT)); // Adjust fixed content padding

        $(fixedContent).each(function (index, element) {
          var actualPadding = element.style.paddingRight;
          var calculatedPadding = $(element).css('padding-right');
          $(element).data('padding-right', actualPadding).css('padding-right', parseFloat(calculatedPadding) + this9.scrollbarWidth + "px");
        }); // Adjust sticky content margin

        $(stickyContent).each(function (index, element) {
          var actualMargin = element.style.marginRight;
          var calculatedMargin = $(element).css('margin-right');
          $(element).data('margin-right', actualMargin).css('margin-right', parseFloat(calculatedMargin) - this9.scrollbarWidth + "px");
        }); // Adjust body padding

        var actualPadding = document.body.style.paddingRight;
        var calculatedPadding = $(document.body).css('padding-right');
        $(document.body).data('padding-right', actualPadding).css('padding-right', parseFloat(calculatedPadding) + this.scrollbarWidth + "px");
      }

      $(document.body).addClass(ClassName$5.OPEN);
    };

    proto.resetScrollbar = function resetScrollbar() {
      // Restore fixed content padding
      var fixedContent = [].slice.call(document.querySelectorAll(Selector$5.FIXEDCONTENT));
      $(fixedContent).each(function (index, element) {
        var padding = $(element).data('padding-right');
        $(element).removeData('padding-right');
        element.style.paddingRight = padding ? padding : '';
      }); // Restore sticky content

      var elements = [].slice.call(document.querySelectorAll("" + Selector$5.STICKYCONTENT));
      $(elements).each(function (index, element) {
        var margin = $(element).data('margin-right');

        if (typeof margin !== 'undefined') {
          $(element).css('margin-right', margin).removeData('margin-right');
        }
      }); // Restore body padding

      var padding = $(document.body).data('padding-right');
      $(document.body).removeData('padding-right');
      document.body.style.paddingRight = padding ? padding : '';
    };

    proto.getScrollbarWidth = function getScrollbarWidth() {
      // thx d.walsh
      var scrollDiv = document.createElement('div');
      scrollDiv.className = ClassName$5.SCROLLBARMEASURER;
      document.body.appendChild(scrollDiv);
      var scrollbarWidth = scrollDiv.getBoundingClientRect().width - scrollDiv.clientWidth;
      document.body.removeChild(scrollDiv);
      return scrollbarWidth;
    } // Static
    ;

    Modal.jQueryInterface = function jQueryInterface(config, relatedTarget) {
      return this.each(function () {
        var data = $(this).data(DATAKEY$5);

        var config = objectSpread({}, Default$3, $(this).data(), typeof config === 'object' && config ? config : {});

        if (!data) {
          data = new Modal(this, config);
          $(this).data(DATAKEY$5, data);
        }

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError("No method named \"" + config + "\"");
          }

          data[config](relatedTarget);
        } else if (config.show) {
          data.show(relatedTarget);
        }
      });
    };

    createClass(Modal, null, [{
      key: "VERSION",
      get: function get() {
        return VERSION$5;
      }
    }, {
      key: "Default",
      get: function get() {
        return Default$3;
      }
    }]);

    return Modal;
  }();
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  $(document).on(Event$5.CLICKDATAAPI, Selector$5.DATATOGGLE, function (event) {
    var this10 = this;

    var target;
    var selector = Util.getSelectorFromElement(this);

    if (selector) {
      target = document.querySelector(selector);
    }

    var config = $(target).data(DATAKEY$5) ? 'toggle' : objectSpread({}, $(target).data(), $(this).data());

    if (this.tagName === 'A' || this.tagName === 'AREA') {
      event.preventDefault();
    }

    var $target = $(target).one(Event$5.SHOW, function (showEvent) {
      if (showEvent.isDefaultPrevented()) {
        // Only register focus restorer if modal will actually get shown
        return;
      }

      $target.one(Event$5.HIDDEN, function () {
        if ($(this10).is(':visible')) {
          this10.focus();
        }
      });
    });

    Modal.jQueryInterface.call($(target), config, this);
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $.fn[NAME$5] = Modal.jQueryInterface;
  $.fn[NAME$5].Constructor = Modal;

  $.fn[NAME$5].noConflict = function () {
    $.fn[NAME$5] = JQUERYNOCONFLICT$5;
    return Modal.jQueryInterface;
  };

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v4.3.1): tools/sanitizer.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
   * --------------------------------------------------------------------------
   */
  var uriAttrs = ['background', 'cite', 'href', 'itemtype', 'longdesc', 'poster', 'src', 'xlink:href'];
  var ARIAATTRIBUTEPATTERN = /^aria-[\w-]*$/i;
  var DefaultWhitelist = {
    // Global attributes allowed on any supplied element below.
    '*': ['class', 'dir', 'id', 'lang', 'role', ARIAATTRIBUTEPATTERN],
    a: ['target', 'href', 'title', 'rel'],
    area: [],
    b: [],
    br: [],
    col: [],
    code: [],
    div: [],
    em: [],
    hr: [],
    h1: [],
    h2: [],
    h3: [],
    h4: [],
    h5: [],
    h6: [],
    i: [],
    img: ['src', 'alt', 'title', 'width', 'height'],
    li: [],
    ol: [],
    p: [],
    pre: [],
    s: [],
    small: [],
    span: [],
    sub: [],
    sup: [],
    strong: [],
    u: [],
    ul: []
    /**
     * A pattern that recognizes a commonly useful subset of URLs that are safe.
     *
     * Shoutout to Angular 7 https://github.com/angular/angular/blob/7.2.4/packages/core/src/sanitization/urlsanitizer.ts
     */

  };
  var SAFEURLPATTERN = /^(?:(?:https?|mailto|ftp|tel|file):|[^&:/?#]*(?:[/?#]|$))/gi;
  /**
   * A pattern that matches safe data URLs. Only matches image, video and audio types.
   *
   * Shoutout to Angular 7 https://github.com/angular/angular/blob/7.2.4/packages/core/src/sanitization/urlsanitizer.ts
   */

  var DATAURLPATTERN = /^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[a-z0-9+/]+=*$/i;

  function allowedAttribute(attr, allowedAttributeList) {
    var attrName = attr.nodeName.toLowerCase();

    if (allowedAttributeList.indexOf(attrName) !== -1) {
      if (uriAttrs.indexOf(attrName) !== -1) {
        return Boolean(attr.nodeValue.match(SAFEURLPATTERN) || attr.nodeValue.match(DATAURLPATTERN));
      }

      return true;
    }

    var regExp = allowedAttributeList.filter(function (attrRegex) {
      return attrRegex instanceof RegExp;
    }); // Check if a regular expression validates the attribute.

    for (var i = 0, l = regExp.length; i < l; i++) {
      if (attrName.match(regExp[i])) {
        return true;
      }
    }

    return false;
  }

  function sanitizeHtml(unsafeHtml, whiteList, sanitizeFn) {
    if (unsafeHtml.length === 0) {
      return unsafeHtml;
    }

    if (sanitizeFn && typeof sanitizeFn === 'function') {
      return sanitizeFn(unsafeHtml);
    }

    var domParser = new window.DOMParser();
    var createdDocument = domParser.parseFromString(unsafeHtml, 'text/html');
    var whitelistKeys = Object.keys(whiteList);
    var elements = [].slice.call(createdDocument.body.querySelectorAll('*'));

    var loop = function loop(i, len) {
      var el = elements[i];
      var elName = el.nodeName.toLowerCase();

      if (whitelistKeys.indexOf(el.nodeName.toLowerCase()) === -1) {
        el.parentNode.removeChild(el);
        return "continue";
      }

      var attributeList = [].slice.call(el.attributes);
      var whitelistedAttributes = [].concat(whiteList['*'] || [], whiteList[elName] || []);
      attributeList.forEach(function (attr) {
        if (!allowedAttribute(attr, whitelistedAttributes)) {
          el.removeAttribute(attr.nodeName);
        }
      });
    };

    for (var i = 0, len = elements.length; i < len; i++) {
      var ret = loop(i, len);

      if (ret === "continue") continue;
    }

    return createdDocument.body.innerHTML;
  }

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  var NAME$6 = 'tooltip';
  var VERSION$6 = '4.3.1';
  var DATAKEY$6 = 'bs.tooltip';
  var EVENTKEY$6 = "." + DATAKEY$6;
  var JQUERYNOCONFLICT$6 = $.fn[NAME$6];
  var CLASSPREFIX = 'bs-tooltip';
  var BSCLSPREFIXREGEX = new RegExp("(^|\\s)" + CLASSPREFIX + "\\S+", 'g');
  var DISALLOWEDATTRIBUTES = ['sanitize', 'whiteList', 'sanitizeFn'];
  var DefaultType$4 = {
    animation: 'boolean',
    template: 'string',
    title: '(string|element|function)',
    trigger: 'string',
    delay: '(number|object)',
    html: 'boolean',
    selector: '(string|boolean)',
    placement: '(string|function)',
    offset: '(number|string|function)',
    container: '(string|element|boolean)',
    fallbackPlacement: '(string|array)',
    boundary: '(string|element)',
    sanitize: 'boolean',
    sanitizeFn: '(null|function)',
    whiteList: 'object'
  };
  var AttachmentMap$1 = {
    AUTO: 'auto',
    TOP: 'top',
    RIGHT: 'right',
    BOTTOM: 'bottom',
    LEFT: 'left'
  };
  var Default$4 = {
    animation: true,
    template: '<div class="tooltip" role="tooltip">' + '<div class="arrow"></div>' + '<div class="tooltip-inner"></div></div>',
    trigger: 'hover focus',
    title: '',
    delay: 0,
    html: false,
    selector: false,
    placement: 'top',
    offset: 0,
    container: false,
    fallbackPlacement: 'flip',
    boundary: 'scrollParent',
    sanitize: true,
    sanitizeFn: null,
    whiteList: DefaultWhitelist
  };
  var HoverState = {
    SHOW: 'show',
    OUT: 'out'
  };
  var Event$6 = {
    HIDE: "hide" + EVENTKEY$6,
    HIDDEN: "hidden" + EVENTKEY$6,
    SHOW: "show" + EVENTKEY$6,
    SHOWN: "shown" + EVENTKEY$6,
    INSERTED: "inserted" + EVENTKEY$6,
    CLICK: "click" + EVENTKEY$6,
    FOCUSIN: "focusin" + EVENTKEY$6,
    FOCUSOUT: "focusout" + EVENTKEY$6,
    MOUSEENTER: "mouseenter" + EVENTKEY$6,
    MOUSELEAVE: "mouseleave" + EVENTKEY$6
  };
  var ClassName$6 = {
    FADE: 'fade',
    SHOW: 'show'
  };
  var Selector$6 = {
    TOOLTIP: '.tooltip',
    TOOLTIPINNER: '.tooltip-inner',
    ARROW: '.arrow'
  };
  var Trigger = {
    HOVER: 'hover',
    FOCUS: 'focus',
    CLICK: 'click',
    MANUAL: 'manual'
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

  };

  var Tooltip =
  /*#PURE*/
  function () {
    function Tooltip(element, config) {
      /**
       * Check for Popper dependency
       * Popper - https://popper.js.org
       */
      if (typeof Popper === 'undefined') {
        throw new TypeError('Bootstrap\'s tooltips require Popper.js (https://popper.js.org/)');
      } // private


      this.isEnabled = true;
      this.timeout = 0;
      this.hoverState = '';
      this.activeTrigger = {};
      this.popper = null; // Protected

      this.element = element;
      this.config = this.getConfig(config);
      this.tip = null;

      this.setListeners();
    } // Getters


    var proto = Tooltip.prototype;

    // Public
    proto.enable = function enable() {
      this.isEnabled = true;
    };

    proto.disable = function disable() {
      this.isEnabled = false;
    };

    proto.toggleEnabled = function toggleEnabled() {
      this.isEnabled = !this.isEnabled;
    };

    proto.toggle = function toggle(event) {
      if (!this.isEnabled) {
        return;
      }

      if (event) {
        var dataKey = this.constructor.DATAKEY;
        var context = $(event.currentTarget).data(dataKey);

        if (!context) {
          context = new this.constructor(event.currentTarget, this.getDelegateConfig());
          $(event.currentTarget).data(dataKey, context);
        }

        context.activeTrigger.click = !context.activeTrigger.click;

        if (context.isWithActiveTrigger()) {
          context.enter(null, context);
        } else {
          context.leave(null, context);
        }
      } else {
        if ($(this.getTipElement()).hasClass(ClassName$6.SHOW)) {
          this.leave(null, this);

          return;
        }

        this.enter(null, this);
      }
    };

    proto.dispose = function dispose() {
      clearTimeout(this.timeout);
      $.removeData(this.element, this.constructor.DATAKEY);
      $(this.element).off(this.constructor.EVENTKEY);
      $(this.element).closest('.modal').off('hide.bs.modal');

      if (this.tip) {
        $(this.tip).remove();
      }

      this.isEnabled = null;
      this.timeout = null;
      this.hoverState = null;
      this.activeTrigger = null;

      if (this.popper !== null) {
        this.popper.destroy();
      }

      this.popper = null;
      this.element = null;
      this.config = null;
      this.tip = null;
    };

    proto.show = function show() {
      var this = this;

      if ($(this.element).css('display') === 'none') {
        throw new Error('Please use show on visible elements');
      }

      var showEvent = $.Event(this.constructor.Event.SHOW);

      if (this.isWithContent() && this.isEnabled) {
        $(this.element).trigger(showEvent);
        var shadowRoot = Util.findShadowRoot(this.element);
        var isInTheDom = $.contains(shadowRoot !== null ? shadowRoot : this.element.ownerDocument.documentElement, this.element);

        if (showEvent.isDefaultPrevented() || !isInTheDom) {
          return;
        }

        var tip = this.getTipElement();
        var tipId = Util.getUID(this.constructor.NAME);
        tip.setAttribute('id', tipId);
        this.element.setAttribute('aria-describedby', tipId);
        this.setContent();

        if (this.config.animation) {
          $(tip).addClass(ClassName$6.FADE);
        }

        var placement = typeof this.config.placement === 'function' ? this.config.placement.call(this, tip, this.element) : this.config.placement;

        var attachment = this.getAttachment(placement);

        this.addAttachmentClass(attachment);

        var container = this.getContainer();

        $(tip).data(this.constructor.DATAKEY, this);

        if (!$.contains(this.element.ownerDocument.documentElement, this.tip)) {
          $(tip).appendTo(container);
        }

        $(this.element).trigger(this.constructor.Event.INSERTED);
        this.popper = new Popper(this.element, tip, {
          placement: attachment,
          modifiers: {
            offset: this.getOffset(),
            flip: {
              behavior: this.config.fallbackPlacement
            },
            arrow: {
              element: Selector$6.ARROW
            },
            preventOverflow: {
              boundariesElement: this.config.boundary
            }
          },
          onCreate: function onCreate(data) {
            if (data.originalPlacement !== data.placement) {
              this.handlePopperPlacementChange(data);
            }
          },
          onUpdate: function onUpdate(data) {
            return this.handlePopperPlacementChange(data);
          }
        });
        $(tip).addClass(ClassName$6.SHOW); // If this is a touch-enabled device we add extra
        // empty mouseover listeners to the body's immediate children;
        // only needed because of broken event delegation on iOS
        // https://www.quirksmode.org/blog/archives/2014/02/mouseeventbub.html

        if ('ontouchstart' in document.documentElement) {
          $(document.body).children().on('mouseover', null, $.noop);
        }

        var complete = function complete() {
          if (this.config.animation) {
            this.fixTransition();
          }

          var prevHoverState = this.hoverState;
          this.hoverState = null;
          $(this.element).trigger(this.constructor.Event.SHOWN);

          if (prevHoverState === HoverState.OUT) {
            this.leave(null, this);
          }
        };

        if ($(this.tip).hasClass(ClassName$6.FADE)) {
          var transitionDuration = Util.getTransitionDurationFromElement(this.tip);
          $(this.tip).one(Util.TRANSITIONEND, complete).emulateTransitionEnd(transitionDuration);
        } else {
          complete();
        }
      }
    };

    proto.hide = function hide(callback) {
      var this2 = this;

      var tip = this.getTipElement();
      var hideEvent = $.Event(this.constructor.Event.HIDE);

      var complete = function complete() {
        if (this2.hoverState !== HoverState.SHOW && tip.parentNode) {
          tip.parentNode.removeChild(tip);
        }

        this2.cleanTipClass();

        this2.element.removeAttribute('aria-describedby');

        $(this2.element).trigger(this2.constructor.Event.HIDDEN);

        if (this2.popper !== null) {
          this2.popper.destroy();
        }

        if (callback) {
          callback();
        }
      };

      $(this.element).trigger(hideEvent);

      if (hideEvent.isDefaultPrevented()) {
        return;
      }

      $(tip).removeClass(ClassName$6.SHOW); // If this is a touch-enabled device we remove the extra
      // empty mouseover listeners we added for iOS support

      if ('ontouchstart' in document.documentElement) {
        $(document.body).children().off('mouseover', null, $.noop);
      }

      this.activeTrigger[Trigger.CLICK] = false;
      this.activeTrigger[Trigger.FOCUS] = false;
      this.activeTrigger[Trigger.HOVER] = false;

      if ($(this.tip).hasClass(ClassName$6.FADE)) {
        var transitionDuration = Util.getTransitionDurationFromElement(tip);
        $(tip).one(Util.TRANSITIONEND, complete).emulateTransitionEnd(transitionDuration);
      } else {
        complete();
      }

      this.hoverState = '';
    };

    proto.update = function update() {
      if (this.popper !== null) {
        this.popper.scheduleUpdate();
      }
    } // Protected
    ;

    proto.isWithContent = function isWithContent() {
      return Boolean(this.getTitle());
    };

    proto.addAttachmentClass = function addAttachmentClass(attachment) {
      $(this.getTipElement()).addClass(CLASSPREFIX + "-" + attachment);
    };

    proto.getTipElement = function getTipElement() {
      this.tip = this.tip || $(this.config.template)[0];
      return this.tip;
    };

    proto.setContent = function setContent() {
      var tip = this.getTipElement();
      this.setElementContent($(tip.querySelectorAll(Selector$6.TOOLTIPINNER)), this.getTitle());
      $(tip).removeClass(ClassName$6.FADE + " " + ClassName$6.SHOW);
    };

    proto.setElementContent = function setElementContent($element, content) {
      if (typeof content === 'object' && (content.nodeType || content.jquery)) {
        // Content is a DOM node or a jQuery
        if (this.config.html) {
          if (!$(content).parent().is($element)) {
            $element.empty().append(content);
          }
        } else {
          $element.text($(content).text());
        }

        return;
      }

      if (this.config.html) {
        if (this.config.sanitize) {
          content = sanitizeHtml(content, this.config.whiteList, this.config.sanitizeFn);
        }

        $element.html(content);
      } else {
        $element.text(content);
      }
    };

    proto.getTitle = function getTitle() {
      var title = this.element.getAttribute('data-original-title');

      if (!title) {
        title = typeof this.config.title === 'function' ? this.config.title.call(this.element) : this.config.title;
      }

      return title;
    } // Private
    ;

    proto.getOffset = function getOffset() {
      var this3 = this;

      var offset = {};

      if (typeof this.config.offset === 'function') {
        offset.fn = function (data) {
          data.offsets = objectSpread({}, data.offsets, this3.config.offset(data.offsets, this3.element) || {});
          return data;
        };
      } else {
        offset.offset = this.config.offset;
      }

      return offset;
    };

    proto.getContainer = function getContainer() {
      if (this.config.container === false) {
        return document.body;
      }

      if (Util.isElement(this.config.container)) {
        return $(this.config.container);
      }

      return $(document).find(this.config.container);
    };

    proto.getAttachment = function getAttachment(placement) {
      return AttachmentMap$1[placement.toUpperCase()];
    };

    proto.setListeners = function setListeners() {
      var this4 = this;

      var triggers = this.config.trigger.split(' ');
      triggers.forEach(function (trigger) {
        if (trigger === 'click') {
          $(this4.element).on(this4.constructor.Event.CLICK, this4.config.selector, function (event) {
            return this4.toggle(event);
          });
        } else if (trigger !== Trigger.MANUAL) {
          var eventIn = trigger === Trigger.HOVER ? this4.constructor.Event.MOUSEENTER : this4.constructor.Event.FOCUSIN;
          var eventOut = trigger === Trigger.HOVER ? this4.constructor.Event.MOUSELEAVE : this4.constructor.Event.FOCUSOUT;
          $(this4.element).on(eventIn, this4.config.selector, function (event) {
            return this4.enter(event);
          }).on(eventOut, this4.config.selector, function (event) {
            return this4.leave(event);
          });
        }
      });
      $(this.element).closest('.modal').on('hide.bs.modal', function () {
        if (this4.element) {
          this4.hide();
        }
      });

      if (this.config.selector) {
        this.config = objectSpread({}, this.config, {
          trigger: 'manual',
          selector: ''
        });
      } else {
        this.fixTitle();
      }
    };

    proto.fixTitle = function fixTitle() {
      var titleType = typeof this.element.getAttribute('data-original-title');

      if (this.element.getAttribute('title') || titleType !== 'string') {
        this.element.setAttribute('data-original-title', this.element.getAttribute('title') || '');
        this.element.setAttribute('title', '');
      }
    };

    proto.enter = function enter(event, context) {
      var dataKey = this.constructor.DATAKEY;
      context = context || $(event.currentTarget).data(dataKey);

      if (!context) {
        context = new this.constructor(event.currentTarget, this.getDelegateConfig());
        $(event.currentTarget).data(dataKey, context);
      }

      if (event) {
        context.activeTrigger[event.type === 'focusin' ? Trigger.FOCUS : Trigger.HOVER] = true;
      }

      if ($(context.getTipElement()).hasClass(ClassName$6.SHOW) || context.hoverState === HoverState.SHOW) {
        context.hoverState = HoverState.SHOW;
        return;
      }

      clearTimeout(context.timeout);
      context.hoverState = HoverState.SHOW;

      if (!context.config.delay || !context.config.delay.show) {
        context.show();
        return;
      }

      context.timeout = setTimeout(function () {
        if (context.hoverState === HoverState.SHOW) {
          context.show();
        }
      }, context.config.delay.show);
    };

    proto.leave = function leave(event, context) {
      var dataKey = this.constructor.DATAKEY;
      context = context || $(event.currentTarget).data(dataKey);

      if (!context) {
        context = new this.constructor(event.currentTarget, this.getDelegateConfig());
        $(event.currentTarget).data(dataKey, context);
      }

      if (event) {
        context.activeTrigger[event.type === 'focusout' ? Trigger.FOCUS : Trigger.HOVER] = false;
      }

      if (context.isWithActiveTrigger()) {
        return;
      }

      clearTimeout(context.timeout);
      context.hoverState = HoverState.OUT;

      if (!context.config.delay || !context.config.delay.hide) {
        context.hide();
        return;
      }

      context.timeout = setTimeout(function () {
        if (context.hoverState === HoverState.OUT) {
          context.hide();
        }
      }, context.config.delay.hide);
    };

    proto.isWithActiveTrigger = function isWithActiveTrigger() {
      for (var trigger in this.activeTrigger) {
        if (this.activeTrigger[trigger]) {
          return true;
        }
      }

      return false;
    };

    proto.getConfig = function getConfig(config) {
      var dataAttributes = $(this.element).data();
      Object.keys(dataAttributes).forEach(function (dataAttr) {
        if (DISALLOWEDATTRIBUTES.indexOf(dataAttr) !== -1) {
          delete dataAttributes[dataAttr];
        }
      });
      config = objectSpread({}, this.constructor.Default, dataAttributes, typeof config === 'object' && config ? config : {});

      if (typeof config.delay === 'number') {
        config.delay = {
          show: config.delay,
          hide: config.delay
        };
      }

      if (typeof config.title === 'number') {
        config.title = config.title.toString();
      }

      if (typeof config.content === 'number') {
        config.content = config.content.toString();
      }

      Util.typeCheckConfig(NAME$6, config, this.constructor.DefaultType);

      if (config.sanitize) {
        config.template = sanitizeHtml(config.template, config.whiteList, config.sanitizeFn);
      }

      return config;
    };

    proto.getDelegateConfig = function getDelegateConfig() {
      var config = {};

      if (this.config) {
        for (var key in this.config) {
          if (this.constructor.Default[key] !== this.config[key]) {
            config[key] = this.config[key];
          }
        }
      }

      return config;
    };

    proto.cleanTipClass = function cleanTipClass() {
      var $tip = $(this.getTipElement());
      var tabClass = $tip.attr('class').match(BSCLSPREFIXREGEX);

      if (tabClass !== null && tabClass.length) {
        $tip.removeClass(tabClass.join(''));
      }
    };

    proto.handlePopperPlacementChange = function handlePopperPlacementChange(popperData) {
      var popperInstance = popperData.instance;
      this.tip = popperInstance.popper;

      this.cleanTipClass();

      this.addAttachmentClass(this.getAttachment(popperData.placement));
    };

    proto.fixTransition = function fixTransition() {
      var tip = this.getTipElement();
      var initConfigAnimation = this.config.animation;

      if (tip.getAttribute('x-placement') !== null) {
        return;
      }

      $(tip).removeClass(ClassName$6.FADE);
      this.config.animation = false;
      this.hide();
      this.show();
      this.config.animation = initConfigAnimation;
    } // Static
    ;

    Tooltip.jQueryInterface = function jQueryInterface(config) {
      return this.each(function () {
        var data = $(this).data(DATAKEY$6);

        var config = typeof config === 'object' && config;

        if (!data && /dispose|hide/.test(config)) {
          return;
        }

        if (!data) {
          data = new Tooltip(this, config);
          $(this).data(DATAKEY$6, data);
        }

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError("No method named \"" + config + "\"");
          }

          data[config]();
        }
      });
    };

    createClass(Tooltip, null, [{
      key: "VERSION",
      get: function get() {
        return VERSION$6;
      }
    }, {
      key: "Default",
      get: function get() {
        return Default$4;
      }
    }, {
      key: "NAME",
      get: function get() {
        return NAME$6;
      }
    }, {
      key: "DATAKEY",
      get: function get() {
        return DATAKEY$6;
      }
    }, {
      key: "Event",
      get: function get() {
        return Event$6;
      }
    }, {
      key: "EVENTKEY",
      get: function get() {
        return EVENTKEY$6;
      }
    }, {
      key: "DefaultType",
      get: function get() {
        return DefaultType$4;
      }
    }]);

    return Tooltip;
  }();
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */


  $.fn[NAME$6] = Tooltip.jQueryInterface;
  $.fn[NAME$6].Constructor = Tooltip;

  $.fn[NAME$6].noConflict = function () {
    $.fn[NAME$6] = JQUERYNOCONFLICT$6;
    return Tooltip.jQueryInterface;
  };

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  var NAME$7 = 'popover';
  var VERSION$7 = '4.3.1';
  var DATAKEY$7 = 'bs.popover';
  var EVENTKEY$7 = "." + DATAKEY$7;
  var JQUERYNOCONFLICT$7 = $.fn[NAME$7];
  var CLASSPREFIX$1 = 'bs-popover';
  var BSCLSPREFIXREGEX$1 = new RegExp("(^|\\s)" + CLASSPREFIX$1 + "\\S+", 'g');

  var Default$5 = objectSpread({}, Tooltip.Default, {
    placement: 'right',
    trigger: 'click',
    content: '',
    template: '<div class="popover" role="tooltip">' + '<div class="arrow"></div>' + '<h3 class="popover-header"></h3>' + '<div class="popover-body"></div></div>'
  });

  var DefaultType$5 = objectSpread({}, Tooltip.DefaultType, {
    content: '(string|element|function)'
  });

  var ClassName$7 = {
    FADE: 'fade',
    SHOW: 'show'
  };
  var Selector$7 = {
    TITLE: '.popover-header',
    CONTENT: '.popover-body'
  };
  var Event$7 = {
    HIDE: "hide" + EVENTKEY$7,
    HIDDEN: "hidden" + EVENTKEY$7,
    SHOW: "show" + EVENTKEY$7,
    SHOWN: "shown" + EVENTKEY$7,
    INSERTED: "inserted" + EVENTKEY$7,
    CLICK: "click" + EVENTKEY$7,
    FOCUSIN: "focusin" + EVENTKEY$7,
    FOCUSOUT: "focusout" + EVENTKEY$7,
    MOUSEENTER: "mouseenter" + EVENTKEY$7,
    MOUSELEAVE: "mouseleave" + EVENTKEY$7
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

  };

  var Popover =
  /*#PURE*/
  function (Tooltip) {
    inheritsLoose(Popover, Tooltip);

    function Popover() {
      return Tooltip.apply(this, arguments) || this;
    }

    var proto = Popover.prototype;

    // Overrides
    proto.isWithContent = function isWithContent() {
      return this.getTitle() || this.getContent();
    };

    proto.addAttachmentClass = function addAttachmentClass(attachment) {
      $(this.getTipElement()).addClass(CLASSPREFIX$1 + "-" + attachment);
    };

    proto.getTipElement = function getTipElement() {
      this.tip = this.tip || $(this.config.template)[0];
      return this.tip;
    };

    proto.setContent = function setContent() {
      var $tip = $(this.getTipElement()); // We use append for html objects to maintain js events

      this.setElementContent($tip.find(Selector$7.TITLE), this.getTitle());

      var content = this.getContent();

      if (typeof content === 'function') {
        content = content.call(this.element);
      }

      this.setElementContent($tip.find(Selector$7.CONTENT), content);
      $tip.removeClass(ClassName$7.FADE + " " + ClassName$7.SHOW);
    } // Private
    ;

    proto.getContent = function getContent() {
      return this.element.getAttribute('data-content') || this.config.content;
    };

    proto.cleanTipClass = function cleanTipClass() {
      var $tip = $(this.getTipElement());
      var tabClass = $tip.attr('class').match(BSCLSPREFIXREGEX$1);

      if (tabClass !== null && tabClass.length > 0) {
        $tip.removeClass(tabClass.join(''));
      }
    } // Static
    ;

    Popover.jQueryInterface = function jQueryInterface(config) {
      return this.each(function () {
        var data = $(this).data(DATAKEY$7);

        var config = typeof config === 'object' ? config : null;

        if (!data && /dispose|hide/.test(config)) {
          return;
        }

        if (!data) {
          data = new Popover(this, config);
          $(this).data(DATAKEY$7, data);
        }

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError("No method named \"" + config + "\"");
          }

          data[config]();
        }
      });
    };

    createClass(Popover, null, [{
      key: "VERSION",
      // Getters
      get: function get() {
        return VERSION$7;
      }
    }, {
      key: "Default",
      get: function get() {
        return Default$5;
      }
    }, {
      key: "NAME",
      get: function get() {
        return NAME$7;
      }
    }, {
      key: "DATAKEY",
      get: function get() {
        return DATAKEY$7;
      }
    }, {
      key: "Event",
      get: function get() {
        return Event$7;
      }
    }, {
      key: "EVENTKEY",
      get: function get() {
        return EVENTKEY$7;
      }
    }, {
      key: "DefaultType",
      get: function get() {
        return DefaultType$5;
      }
    }]);

    return Popover;
  }(Tooltip);
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */


  $.fn[NAME$7] = Popover.jQueryInterface;
  $.fn[NAME$7].Constructor = Popover;

  $.fn[NAME$7].noConflict = function () {
    $.fn[NAME$7] = JQUERYNOCONFLICT$7;
    return Popover.jQueryInterface;
  };

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  var NAME$8 = 'scrollspy';
  var VERSION$8 = '4.3.1';
  var DATAKEY$8 = 'bs.scrollspy';
  var EVENTKEY$8 = "." + DATAKEY$8;
  var DATAAPIKEY$6 = '.data-api';
  var JQUERYNOCONFLICT$8 = $.fn[NAME$8];
  var Default$6 = {
    offset: 10,
    method: 'auto',
    target: ''
  };
  var DefaultType$6 = {
    offset: 'number',
    method: 'string',
    target: '(string|element)'
  };
  var Event$8 = {
    ACTIVATE: "activate" + EVENTKEY$8,
    SCROLL: "scroll" + EVENTKEY$8,
    LOADDATAAPI: "load" + EVENTKEY$8 + DATAAPIKEY$6
  };
  var ClassName$8 = {
    DROPDOWNITEM: 'dropdown-item',
    DROPDOWNMENU: 'dropdown-menu',
    ACTIVE: 'active'
  };
  var Selector$8 = {
    DATASPY: '[data-spy="scroll"]',
    ACTIVE: '.active',
    NAVLISTGROUP: '.nav, .list-group',
    NAVLINKS: '.nav-link',
    NAVITEMS: '.nav-item',
    LISTITEMS: '.list-group-item',
    DROPDOWN: '.dropdown',
    DROPDOWNITEMS: '.dropdown-item',
    DROPDOWNTOGGLE: '.dropdown-toggle'
  };
  var OffsetMethod = {
    OFFSET: 'offset',
    POSITION: 'position'
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

  };

  var ScrollSpy =
  /*#PURE*/
  function () {
    function ScrollSpy(element, config) {
      var this = this;

      this.element = element;
      this.scrollElement = element.tagName === 'BODY' ? window : element;
      this.config = this.getConfig(config);
      this.selector = this.config.target + " " + Selector$8.NAVLINKS + "," + (this.config.target + " " + Selector$8.LISTITEMS + ",") + (this.config.target + " " + Selector$8.DROPDOWNITEMS);
      this.offsets = [];
      this.targets = [];
      this.activeTarget = null;
      this.scrollHeight = 0;
      $(this.scrollElement).on(Event$8.SCROLL, function (event) {
        return this.process(event);
      });
      this.refresh();

      this.process();
    } // Getters


    var proto = ScrollSpy.prototype;

    // Public
    proto.refresh = function refresh() {
      var this2 = this;

      var autoMethod = this.scrollElement === this.scrollElement.window ? OffsetMethod.OFFSET : OffsetMethod.POSITION;
      var offsetMethod = this.config.method === 'auto' ? autoMethod : this.config.method;
      var offsetBase = offsetMethod === OffsetMethod.POSITION ? this.getScrollTop() : 0;
      this.offsets = [];
      this.targets = [];
      this.scrollHeight = this.getScrollHeight();
      var targets = [].slice.call(document.querySelectorAll(this.selector));
      targets.map(function (element) {
        var target;
        var targetSelector = Util.getSelectorFromElement(element);

        if (targetSelector) {
          target = document.querySelector(targetSelector);
        }

        if (target) {
          var targetBCR = target.getBoundingClientRect();

          if (targetBCR.width || targetBCR.height) {
            // TODO (fat): remove sketch reliance on jQuery position/offset
            return [$(target)[offsetMethod]().top + offsetBase, targetSelector];
          }
        }

        return null;
      }).filter(function (item) {
        return item;
      }).sort(function (a, b) {
        return a[0] - b[0];
      }).forEach(function (item) {
        this2.offsets.push(item[0]);

        this2.targets.push(item[1]);
      });
    };

    proto.dispose = function dispose() {
      $.removeData(this.element, DATAKEY$8);
      $(this.scrollElement).off(EVENTKEY$8);
      this.element = null;
      this.scrollElement = null;
      this.config = null;
      this.selector = null;
      this.offsets = null;
      this.targets = null;
      this.activeTarget = null;
      this.scrollHeight = null;
    } // Private
    ;

    proto.getConfig = function getConfig(config) {
      config = objectSpread({}, Default$6, typeof config === 'object' && config ? config : {});

      if (typeof config.target !== 'string') {
        var id = $(config.target).attr('id');

        if (!id) {
          id = Util.getUID(NAME$8);
          $(config.target).attr('id', id);
        }

        config.target = "#" + id;
      }

      Util.typeCheckConfig(NAME$8, config, DefaultType$6);
      return config;
    };

    proto.getScrollTop = function getScrollTop() {
      return this.scrollElement === window ? this.scrollElement.pageYOffset : this.scrollElement.scrollTop;
    };

    proto.getScrollHeight = function getScrollHeight() {
      return this.scrollElement.scrollHeight || Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    };

    proto.getOffsetHeight = function getOffsetHeight() {
      return this.scrollElement === window ? window.innerHeight : this.scrollElement.getBoundingClientRect().height;
    };

    proto.process = function process() {
      var scrollTop = this.getScrollTop() + this.config.offset;

      var scrollHeight = this.getScrollHeight();

      var maxScroll = this.config.offset + scrollHeight - this.getOffsetHeight();

      if (this.scrollHeight !== scrollHeight) {
        this.refresh();
      }

      if (scrollTop >= maxScroll) {
        var target = this.targets[this.targets.length - 1];

        if (this.activeTarget !== target) {
          this.activate(target);
        }

        return;
      }

      if (this.activeTarget && scrollTop < this.offsets[0] && this.offsets[0] > 0) {
        this.activeTarget = null;

        this.clear();

        return;
      }

      var offsetLength = this.offsets.length;

      for (var i = offsetLength; i--;) {
        var isActiveTarget = this.activeTarget !== this.targets[i] && scrollTop >= this.offsets[i] && (typeof this.offsets[i + 1] === 'undefined' || scrollTop < this.offsets[i + 1]);

        if (isActiveTarget) {
          this.activate(this.targets[i]);
        }
      }
    };

    proto.activate = function activate(target) {
      this.activeTarget = target;

      this.clear();

      var queries = this.selector.split(',').map(function (selector) {
        return selector + "[data-target=\"" + target + "\"]," + selector + "[href=\"" + target + "\"]";
      });

      var $link = $([].slice.call(document.querySelectorAll(queries.join(','))));

      if ($link.hasClass(ClassName$8.DROPDOWNITEM)) {
        $link.closest(Selector$8.DROPDOWN).find(Selector$8.DROPDOWNTOGGLE).addClass(ClassName$8.ACTIVE);
        $link.addClass(ClassName$8.ACTIVE);
      } else {
        // Set triggered link as active
        $link.addClass(ClassName$8.ACTIVE); // Set triggered links parents as active
        // With both <ul> and <nav> markup a parent is the previous sibling of any nav ancestor

        $link.parents(Selector$8.NAVLISTGROUP).prev(Selector$8.NAVLINKS + ", " + Selector$8.LISTITEMS).addClass(ClassName$8.ACTIVE); // Handle special case when .nav-link is inside .nav-item

        $link.parents(Selector$8.NAVLISTGROUP).prev(Selector$8.NAVITEMS).children(Selector$8.NAVLINKS).addClass(ClassName$8.ACTIVE);
      }

      $(this.scrollElement).trigger(Event$8.ACTIVATE, {
        relatedTarget: target
      });
    };

    proto.clear = function clear() {
      [].slice.call(document.querySelectorAll(this.selector)).filter(function (node) {
        return node.classList.contains(ClassName$8.ACTIVE);
      }).forEach(function (node) {
        return node.classList.remove(ClassName$8.ACTIVE);
      });
    } // Static
    ;

    ScrollSpy.jQueryInterface = function jQueryInterface(config) {
      return this.each(function () {
        var data = $(this).data(DATAKEY$8);

        var config = typeof config === 'object' && config;

        if (!data) {
          data = new ScrollSpy(this, config);
          $(this).data(DATAKEY$8, data);
        }

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError("No method named \"" + config + "\"");
          }

          data[config]();
        }
      });
    };

    createClass(ScrollSpy, null, [{
      key: "VERSION",
      get: function get() {
        return VERSION$8;
      }
    }, {
      key: "Default",
      get: function get() {
        return Default$6;
      }
    }]);

    return ScrollSpy;
  }();
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  $(window).on(Event$8.LOADDATAAPI, function () {
    var scrollSpys = [].slice.call(document.querySelectorAll(Selector$8.DATASPY));
    var scrollSpysLength = scrollSpys.length;

    for (var i = scrollSpysLength; i--;) {
      var $spy = $(scrollSpys[i]);

      ScrollSpy.jQueryInterface.call($spy, $spy.data());
    }
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $.fn[NAME$8] = ScrollSpy.jQueryInterface;
  $.fn[NAME$8].Constructor = ScrollSpy;

  $.fn[NAME$8].noConflict = function () {
    $.fn[NAME$8] = JQUERYNOCONFLICT$8;
    return ScrollSpy.jQueryInterface;
  };

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  var NAME$9 = 'tab';
  var VERSION$9 = '4.3.1';
  var DATAKEY$9 = 'bs.tab';
  var EVENTKEY$9 = "." + DATAKEY$9;
  var DATAAPIKEY$7 = '.data-api';
  var JQUERYNOCONFLICT$9 = $.fn[NAME$9];
  var Event$9 = {
    HIDE: "hide" + EVENTKEY$9,
    HIDDEN: "hidden" + EVENTKEY$9,
    SHOW: "show" + EVENTKEY$9,
    SHOWN: "shown" + EVENTKEY$9,
    CLICKDATAAPI: "click" + EVENTKEY$9 + DATAAPIKEY$7
  };
  var ClassName$9 = {
    DROPDOWNMENU: 'dropdown-menu',
    ACTIVE: 'active',
    DISABLED: 'disabled',
    FADE: 'fade',
    SHOW: 'show'
  };
  var Selector$9 = {
    DROPDOWN: '.dropdown',
    NAVLISTGROUP: '.nav, .list-group',
    ACTIVE: '.active',
    ACTIVEUL: '> li > .active',
    DATATOGGLE: '[data-toggle="tab"], [data-toggle="pill"], [data-toggle="list"]',
    DROPDOWNTOGGLE: '.dropdown-toggle',
    DROPDOWNACTIVECHILD: '> .dropdown-menu .active'
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

  };

  var Tab =
  /*#PURE*/
  function () {
    function Tab(element) {
      this.element = element;
    } // Getters


    var proto = Tab.prototype;

    // Public
    proto.show = function show() {
      var this = this;

      if (this.element.parentNode && this.element.parentNode.nodeType === Node.ELEMENTNODE && $(this.element).hasClass(ClassName$9.ACTIVE) || $(this.element).hasClass(ClassName$9.DISABLED)) {
        return;
      }

      var target;
      var previous;
      var listElement = $(this.element).closest(Selector$9.NAVLISTGROUP)[0];
      var selector = Util.getSelectorFromElement(this.element);

      if (listElement) {
        var itemSelector = listElement.nodeName === 'UL' || listElement.nodeName === 'OL' ? Selector$9.ACTIVEUL : Selector$9.ACTIVE;
        previous = $.makeArray($(listElement).find(itemSelector));
        previous = previous[previous.length - 1];
      }

      var hideEvent = $.Event(Event$9.HIDE, {
        relatedTarget: this.element
      });
      var showEvent = $.Event(Event$9.SHOW, {
        relatedTarget: previous
      });

      if (previous) {
        $(previous).trigger(hideEvent);
      }

      $(this.element).trigger(showEvent);

      if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) {
        return;
      }

      if (selector) {
        target = document.querySelector(selector);
      }

      this.activate(this.element, listElement);

      var complete = function complete() {
        var hiddenEvent = $.Event(Event$9.HIDDEN, {
          relatedTarget: this.element
        });
        var shownEvent = $.Event(Event$9.SHOWN, {
          relatedTarget: previous
        });
        $(previous).trigger(hiddenEvent);
        $(this.element).trigger(shownEvent);
      };

      if (target) {
        this.activate(target, target.parentNode, complete);
      } else {
        complete();
      }
    };

    proto.dispose = function dispose() {
      $.removeData(this.element, DATAKEY$9);
      this.element = null;
    } // Private
    ;

    proto.activate = function activate(element, container, callback) {
      var this2 = this;

      var activeElements = container && (container.nodeName === 'UL' || container.nodeName === 'OL') ? $(container).find(Selector$9.ACTIVEUL) : $(container).children(Selector$9.ACTIVE);
      var active = activeElements[0];
      var isTransitioning = callback && active && $(active).hasClass(ClassName$9.FADE);

      var complete = function complete() {
        return this2.transitionComplete(element, active, callback);
      };

      if (active && isTransitioning) {
        var transitionDuration = Util.getTransitionDurationFromElement(active);
        $(active).removeClass(ClassName$9.SHOW).one(Util.TRANSITIONEND, complete).emulateTransitionEnd(transitionDuration);
      } else {
        complete();
      }
    };

    proto.transitionComplete = function transitionComplete(element, active, callback) {
      if (active) {
        $(active).removeClass(ClassName$9.ACTIVE);
        var dropdownChild = $(active.parentNode).find(Selector$9.DROPDOWNACTIVECHILD)[0];

        if (dropdownChild) {
          $(dropdownChild).removeClass(ClassName$9.ACTIVE);
        }

        if (active.getAttribute('role') === 'tab') {
          active.setAttribute('aria-selected', false);
        }
      }

      $(element).addClass(ClassName$9.ACTIVE);

      if (element.getAttribute('role') === 'tab') {
        element.setAttribute('aria-selected', true);
      }

      Util.reflow(element);

      if (element.classList.contains(ClassName$9.FADE)) {
        element.classList.add(ClassName$9.SHOW);
      }

      if (element.parentNode && $(element.parentNode).hasClass(ClassName$9.DROPDOWNMENU)) {
        var dropdownElement = $(element).closest(Selector$9.DROPDOWN)[0];

        if (dropdownElement) {
          var dropdownToggleList = [].slice.call(dropdownElement.querySelectorAll(Selector$9.DROPDOWNTOGGLE));
          $(dropdownToggleList).addClass(ClassName$9.ACTIVE);
        }

        element.setAttribute('aria-expanded', true);
      }

      if (callback) {
        callback();
      }
    } // Static
    ;

    Tab.jQueryInterface = function jQueryInterface(config) {
      return this.each(function () {
        var $this = $(this);
        var data = $this.data(DATAKEY$9);

        if (!data) {
          data = new Tab(this);
          $this.data(DATAKEY$9, data);
        }

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError("No method named \"" + config + "\"");
          }

          data[config]();
        }
      });
    };

    createClass(Tab, null, [{
      key: "VERSION",
      get: function get() {
        return VERSION$9;
      }
    }]);

    return Tab;
  }();
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  $(document).on(Event$9.CLICKDATAAPI, Selector$9.DATATOGGLE, function (event) {
    event.preventDefault();

    Tab.jQueryInterface.call($(this), 'show');
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $.fn[NAME$9] = Tab.jQueryInterface;
  $.fn[NAME$9].Constructor = Tab;

  $.fn[NAME$9].noConflict = function () {
    $.fn[NAME$9] = JQUERYNOCONFLICT$9;
    return Tab.jQueryInterface;
  };

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  var NAME$a = 'toast';
  var VERSION$a = '4.3.1';
  var DATAKEY$a = 'bs.toast';
  var EVENTKEY$a = "." + DATAKEY$a;
  var JQUERYNOCONFLICT$a = $.fn[NAME$a];
  var Event$a = {
    CLICKDISMISS: "click.dismiss" + EVENTKEY$a,
    HIDE: "hide" + EVENTKEY$a,
    HIDDEN: "hidden" + EVENTKEY$a,
    SHOW: "show" + EVENTKEY$a,
    SHOWN: "shown" + EVENTKEY$a
  };
  var ClassName$a = {
    FADE: 'fade',
    HIDE: 'hide',
    SHOW: 'show',
    SHOWING: 'showing'
  };
  var DefaultType$7 = {
    animation: 'boolean',
    autohide: 'boolean',
    delay: 'number'
  };
  var Default$7 = {
    animation: true,
    autohide: true,
    delay: 500
  };
  var Selector$a = {
    DATADISMISS: '[data-dismiss="toast"]'
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

  };

  var Toast =
  /*#PURE*/
  function () {
    function Toast(element, config) {
      this.element = element;
      this.config = this.getConfig(config);
      this.timeout = null;

      this.setListeners();
    } // Getters


    var proto = Toast.prototype;

    // Public
    proto.show = function show() {
      var this = this;

      $(this.element).trigger(Event$a.SHOW);

      if (this.config.animation) {
        this.element.classList.add(ClassName$a.FADE);
      }

      var complete = function complete() {
        this.element.classList.remove(ClassName$a.SHOWING);

        this.element.classList.add(ClassName$a.SHOW);

        $(this.element).trigger(Event$a.SHOWN);

        if (this.config.autohide) {
          this.hide();
        }
      };

      this.element.classList.remove(ClassName$a.HIDE);

      this.element.classList.add(ClassName$a.SHOWING);

      if (this.config.animation) {
        var transitionDuration = Util.getTransitionDurationFromElement(this.element);
        $(this.element).one(Util.TRANSITIONEND, complete).emulateTransitionEnd(transitionDuration);
      } else {
        complete();
      }
    };

    proto.hide = function hide(withoutTimeout) {
      var this2 = this;

      if (!this.element.classList.contains(ClassName$a.SHOW)) {
        return;
      }

      $(this.element).trigger(Event$a.HIDE);

      if (withoutTimeout) {
        this.close();
      } else {
        this.timeout = setTimeout(function () {
          this2.close();
        }, this.config.delay);
      }
    };

    proto.dispose = function dispose() {
      clearTimeout(this.timeout);
      this.timeout = null;

      if (this.element.classList.contains(ClassName$a.SHOW)) {
        this.element.classList.remove(ClassName$a.SHOW);
      }

      $(this.element).off(Event$a.CLICKDISMISS);
      $.removeData(this.element, DATAKEY$a);
      this.element = null;
      this.config = null;
    } // Private
    ;

    proto.getConfig = function getConfig(config) {
      config = objectSpread({}, Default$7, $(this.element).data(), typeof config === 'object' && config ? config : {});
      Util.typeCheckConfig(NAME$a, config, this.constructor.DefaultType);
      return config;
    };

    proto.setListeners = function setListeners() {
      var this3 = this;

      $(this.element).on(Event$a.CLICKDISMISS, Selector$a.DATADISMISS, function () {
        return this3.hide(true);
      });
    };

    proto.close = function close() {
      var this4 = this;

      var complete = function complete() {
        this4.element.classList.add(ClassName$a.HIDE);

        $(this4.element).trigger(Event$a.HIDDEN);
      };

      this.element.classList.remove(ClassName$a.SHOW);

      if (this.config.animation) {
        var transitionDuration = Util.getTransitionDurationFromElement(this.element);
        $(this.element).one(Util.TRANSITIONEND, complete).emulateTransitionEnd(transitionDuration);
      } else {
        complete();
      }
    } // Static
    ;

    Toast.jQueryInterface = function jQueryInterface(config) {
      return this.each(function () {
        var $element = $(this);
        var data = $element.data(DATAKEY$a);

        var config = typeof config === 'object' && config;

        if (!data) {
          data = new Toast(this, config);
          $element.data(DATAKEY$a, data);
        }

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError("No method named \"" + config + "\"");
          }

          data[config](this);
        }
      });
    };

    createClass(Toast, null, [{
      key: "VERSION",
      get: function get() {
        return VERSION$a;
      }
    }, {
      key: "DefaultType",
      get: function get() {
        return DefaultType$7;
      }
    }, {
      key: "Default",
      get: function get() {
        return Default$7;
      }
    }]);

    return Toast;
  }();
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */


  $.fn[NAME$a] = Toast.jQueryInterface;
  $.fn[NAME$a].Constructor = Toast;

  $.fn[NAME$a].noConflict = function () {
    $.fn[NAME$a] = JQUERYNOCONFLICT$a;
    return Toast.jQueryInterface;
  };

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v4.3.1): index.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
   * --------------------------------------------------------------------------
   */

  (function () {
    if (typeof $ === 'undefined') {
      throw new TypeError('Bootstrap\'s JavaScript requires jQuery. jQuery must be included before Bootstrap\'s JavaScript.');
    }

    var version = $.fn.jquery.split(' ')[0].split('.');
    var minMajor = 1;
    var ltMajor = 2;
    var minMinor = 9;
    var minPatch = 1;
    var maxMajor = 4;

    if (version[0] < ltMajor && version[1] < minMinor || version[0] === minMajor && version[1] === minMinor && version[2] < minPatch || version[0] >= maxMajor) {
      throw new Error('Bootstrap\'s JavaScript requires at least jQuery v1.9.1 but less than v4.0.0');
    }
  })();

  exports.Util = Util;
  exports.Alert = Alert;
  exports.Button = Button;
  exports.Carousel = Carousel;
  exports.Collapse = Collapse;
  exports.Dropdown = Dropdown;
  exports.Modal = Modal;
  exports.Popover = Popover;
  exports.Scrollspy = ScrollSpy;
  exports.Tab = Tab;
  exports.Toast = Toast;
  exports.Tooltip = Tooltip;

  Object.defineProperty(exports, 'esModule', { value: true });

}));
//# sourceMappingURL=bootstrap.js.map
