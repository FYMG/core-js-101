/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  return {
    width,
    height,
    getArea: () => width * height,
  };
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  return Object.setPrototypeOf(JSON.parse(json), proto);
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

const cssSelectorBuilder = {
  currentSelector: '',
  currentOrder: 0,
  currentSelectorType: '',

  stringify() {
    const { currentSelector } = this;
    this.currentSelector = '';
    return currentSelector;
  },

  checkCurrentOrder(object) {
    if (this.currentOrder === object.currentOrder && (
      object.currentSelectorType === 'element'
        || object.currentSelectorType === 'id'
        || object.currentSelectorType === 'pseudoElement'
    )) throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    if (this.currentOrder > object.currentOrder) throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
  },

  element(value) {
    const obj = {
      currentSelector: `${this.currentSelector}${value}`,
      currentOrder: 1,
      currentSelectorType: 'element',
    };
    Object.setPrototypeOf(obj, cssSelectorBuilder);
    this.checkCurrentOrder(obj);
    return obj;
  },

  id(value) {
    const obj = {
      currentSelector: `${this.currentSelector}#${value}`,
      currentOrder: 2,
      currentSelectorType: 'id',
    };
    Object.setPrototypeOf(obj, cssSelectorBuilder);
    this.checkCurrentOrder(obj);
    return obj;
  },

  class(value) {
    const obj = {
      currentSelector: `${this.currentSelector}.${value}`,
      currentOrder: 3,
      currentSelectorType: 'class',
    };
    Object.setPrototypeOf(obj, cssSelectorBuilder);
    this.checkCurrentOrder(obj);
    return obj;
  },

  attr(value) {
    const obj = {
      currentSelector: `${this.currentSelector}[${value}]`,
      currentOrder: 4,
      currentSelectorType: 'attr',
    };
    Object.setPrototypeOf(obj, cssSelectorBuilder);
    this.checkCurrentOrder(obj);
    return obj;
  },

  pseudoClass(value) {
    const obj = {
      currentSelector: `${this.currentSelector}:${value}`,
      currentOrder: 5,
      currentSelectorType: 'pseudoClass',
    };
    Object.setPrototypeOf(obj, cssSelectorBuilder);
    this.checkCurrentOrder(obj);
    return obj;
  },

  pseudoElement(value) {
    const obj = {
      currentSelector: `${this.currentSelector}::${value}`,
      currentOrder: 6,
      currentSelectorType: 'pseudoElement',
    };
    Object.setPrototypeOf(obj, cssSelectorBuilder);
    this.checkCurrentOrder(obj);
    return obj;
  },

  combine(selector1, combinator, selector2) {
    const obj = {
      currentSelector: `${selector1.currentSelector} ${combinator} ${selector2.currentSelector}`,
    };
    Object.setPrototypeOf(obj, cssSelectorBuilder);
    return obj;
  },
};

module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
