/* eslint-disable no-plusplus */
/* eslint-disable func-names */
/* eslint-disable prefer-rest-params */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
/**
 * Inherit the prototype methods from one constructor into another.
 *
 * Usage:
 * <pre>
 * function ParentClass(a, b) { }
 * ParentClass.prototype.foo = function(a) { };
 *
 * function ChildClass(a, b, c) {
 *   ChildClass.base(this, 'constructor', a, b);
 * }
 * goog.inherits(ChildClass, ParentClass);
 *
 * var child = new ChildClass('a', 'b', 'see');
 * child.foo(); // This works.
 * </pre>
 *
 * @source https://github.com/google/closure-library/blob/master/closure/goog/base.js
 * @param {!Function} childCtor Child class.
 * @param {!Function} parentCtor Parent class.
 * @suppress {strictMissingProperties} superClass_ and base is not defined on Function.
 */
module.exports = function inherits(ChildCtor, ParentCtor) {
  function TempCtor() {}
  TempCtor.prototype = ParentCtor.prototype;
  ChildCtor.superClass_ = ParentCtor.prototype;
  ChildCtor.prototype = new TempCtor();
  /** @override */
  ChildCtor.prototype.constructor = ChildCtor;

  /**
     * Calls superclass constructor/method.
     *
     * This function is only available if you use goog.inherits to
     * express inheritance relationships between classes.
     *
     * NOTE: This is a replacement for goog.base and for superClass_
     * property defined in childCtor.
     *
     * @param {!Object} me Should always be "this".
     * @param {string} methodName The method name to call. Calling
     *     superclass constructor can be done with the special string
     *     'constructor'.
     * @param {...*} var_args The arguments to pass to superclass
     *     method/constructor.
     * @return {*} The return value of the superclass method/constructor.
     */
  ChildCtor.base = function (me, methodName) {
    // Copying using loop to avoid deop due to passing arguments object to
    // function. This is faster in many JS engines as of late 2014.
    const args = new Array(arguments.length - 2);
    for (let i = 2; i < arguments.length; i++) {
      args[i - 2] = arguments[i];
    }
    return ParentCtor.prototype[methodName].apply(me, args);
  };
};
