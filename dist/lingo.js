/*!
 * Lingo
 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * Library version.
 *
 * @type String
 */
(function () {
  var lingo = function (str, plural, lang) {
    var tool = lingo[lang];
    if (!(tool instanceof Language)) {
      tool = lingo.en;
    }
    if (plural > 1 || plural === true) {
      return tool.isPlural(str) ? str : tool.pluralize(str);
    } else {
      return tool.isSingular(str) ? str : tool.singularize(str);
    }
  };
  lingo.version = '0.0.6';

  /**
   * Expose `Language`.
   *
   * @type Function
   */

  /**
   * Initialize a new `Language` with the given `code` and `name`.
   *
   * @param {String} code
   * @param {String} name
   * @api public
   */

  var Language = lingo.Language = function(code, name) {
    this.code = code;
    this.name = name;
    this.translations = {};
    this.rules = {
        plural: []
      , singular: []
      , uncountable: {}
      , irregular: { plural: {}, singular: {}}
    };
    lingo[code] = this;
  };

  /**
   * Translate the given `str` with optional `params`.
   *
   * @param {String} str
   * @param {Object} params
   * @return {String}
   * @api public
   */

  Language.prototype.translate = function(str, params){
    str = this.translations[str] || str;
    if (params) {
      str = str.replace(/\{([^}]+)\}/g, function(_, key){
        return params[key];
      });
    }
    return str;
  };

  /**
   * Extend `Language` with inflection rules.
   */


  /*!
   * Lingo - inflection
   * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
   * MIT Licensed
   */

  /**
   * Module dependencies.
   */

  /**
   * Check if a `word` is uncountable.
   *
   * @param {String} word
   * @return {Boolean}
   * @api public
   */

  Language.prototype.isUncountable = function(word){
    return !!this.rules.uncountable[word];
  };

  /**
   * Add an uncountable `word`.
   *
   * @param {String} word
   * @return {Language} for chaining
   * @api public
   */

  Language.prototype.uncountable = function(word){
    this.rules.uncountable[word] = word;
    return this;
  };

  /**
   * Add an irreglar `singular` / `plural` map.
   *
   * @param {String} singular
   * @param {String} plural
   * @return {Language} for chaining
   * @api public
   */

  Language.prototype.irregular = function(singular, plural){
    this.rules.irregular.plural[singular] = plural;
    this.rules.irregular.singular[plural] = singular;
    return this;
  };

  /**
   * Add a pluralization `rule` for numbers
   *
   * @param {RegExp} rule
   * @return {Language} for chaining
   * @api public
   */

  Language.prototype.pluralNumbers = function(rule){
    this.rules.pluralNumbers = rule;
    return this;
  };

  /**
   * Add a pluralization `rule` with the given `substitution`.
   *
   * @param {RegExp} rule
   * @param {String} substitution
   * @return {Language} for chaining
   * @api public
   */

  Language.prototype.plural = function(rule, substitution){
    this.rules.plural.unshift([rule, substitution]);
    return this;
  };

  /**
   * Add a singularization `rule` with the given `substitution`.
   *
   * @param {RegExp} rule
   * @param {String} substitution
   * @return {Language} for chaining
   * @api public
   */

  Language.prototype.singular = function(rule, substitution){
    this.rules.singular.unshift([rule, substitution]);
    return this;
  };

  /**
   * Pluralize the given `word`.
   *
   * @param {String} word
   * @return {String}
   * @api public
   */

  Language.prototype.pluralize = function(word){
    return this.inflect(word, 'plural');
  };

  /**
   * Check if `word` is plural.
   *
   * @param {String or Number} word
   * @return {Boolean}
   * @api public
   */

  Language.prototype.isPlural = function (word) {
    if ('number' == typeof word) {
        return (this.rules.pluralNumbers || /.*/).test(word);
    } else {
        return word == this.pluralize(this.singularize(word));
    }
  };

  /**
   * Singularize the given `word`.
   *
   * @param {String} word
   * @return {String}
   * @api public
   */

  Language.prototype.singularize = function (word) {
    return this.inflect(word, 'singular');
  };

  /**
   * Check if `word` is singular.
   *
   * @param {String or Number} word
   * @return {Boolean}
   * @api public
   */

  Language.prototype.isSingular = function (word) {
    return !this.isPlural(word);
  };


  /**
   * Tableize the given `str`.
   *
   * Examples:
   *
   *    lingo.tableize('UserAccount');
   *    // => "user_accounts"
   *
   *    lingo.tableize('User');
   *    // => "users"
   *
   * @param {String} str
   * @return {String}
   * @api public
   */

  lingo.tableize = function(str){
    var underscored = lingo.underscore(word);
    return Language.pluralize(underscored);
  };

  /**
   * Perform `type` inflection rules on the given `word`.
   *
   * @param {String} word
   * @param {String} type
   * @return {String}
   * @api private
   */

  Language.prototype.inflect = function(word, type) {
    if (this.isUncountable(word)) return word;

    var irregular = this.rules.irregular[type][word];
    if (irregular) return irregular;

    for (var i = 0, len = this.rules[type].length; i < len; ++i) {
      var rule = this.rules[type][i]
        , regexp = rule[0]
        , sub = rule[1];
      if (regexp.test(word)) {
        return word.replace(regexp, sub);
      }
    }

    return word;
  }


  /**
   * Auto-require languages.
   */

  /*!
   * Lingo - languages - English
   * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
   * MIT Licensed
   */

  /**
   * Module dependencies.
   */


  /**
   * English.
   */

  var en = lingo.en = new Language('en', 'English');

  /**
   * Number pluraluzation rule
   */
  en.pluralNumbers(/[^1]/);

  /**
   * Default pluralization rules.
   */

  en.plural(/$/, "s")
    .plural(/(s|ss|sh|ch|x|o)$/i, "$1es")
    .plural(/y$/i, "ies")
    .plural(/(o|e)y$/i, "$1ys")
    .plural(/(octop|vir)us$/i, "$1i")
    .plural(/(alias|status)$/i, "$1es")
    .plural(/(bu)s$/i, "$1ses")
    .plural(/([ti])um$/i, "$1a")
    .plural(/sis$/i, "ses")
    .plural(/(?:([^f])fe|([lr])f)$/i, "$1$2ves")
    .plural(/([^aeiouy]|qu)y$/i, "$1ies")
    .plural(/(matr|vert|ind)(?:ix|ex)$/i, "$1ices")
    .plural(/([m|l])ouse$/i, "$1ice")
    .plural(/^(ox)$/i, "$1en")
    .plural(/(quiz)$/i, "$1zes");

  /**
   * Default singularization rules.
   */

  en.singular(/s$/i, "")
    .singular(/(bu|mis|kis)s$/i, "$1s")
    .singular(/([ti])a$/i, "$1um")
    .singular(/((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)ses$/i, "$1$2sis")
    .singular(/(^analy)ses$/i, "$1sis")
    .singular(/([^f])ves$/i, "$1fe")
    .singular(/([lr])ves$/i, "$1f")
    .singular(/ies$/i, "ie")
    .singular(/([^aeiouy]|qu)ies$/i, "$1y")
    .singular(/(series)$/i, "$1")
    .singular(/(mov)ies$/i, "$1ie")
    .singular(/(x|ch|ss|sh)es$/i, "$1")
    .singular(/([m|l])ice$/i, "$1ouse")
    .singular(/(bus)es$/i, "$1")
    .singular(/(o)es$/i, "$1")
    .singular(/(shoe)s$/i, "$1")
    .singular(/(cris|ax|test)es$/i, "$1is")
    .singular(/(octop|vir)i$/i, "$1us")
    .singular(/(alias|status)es$/i, "$1")
    .singular(/^(ox)en/i, "$1")
    .singular(/(vert|ind)ices$/i, "$1ex")
    .singular(/(matr)ices$/i, "$1ix")
    .singular(/(quiz)zes$/i, "$1");

  /**
   * Default irregular word mappings.
   */

  en.irregular('i', 'we')
    .irregular('person', 'people')
    .irregular('man', 'men')
    .irregular('child', 'children')
    .irregular('move', 'moves')
    .irregular('she', 'they')
    .irregular('he', 'they')
    .irregular('myself', 'ourselves')
    .irregular('yourself', 'yourselves')
    .irregular('himself', 'themselves')
    .irregular('herself', 'themselves')
    .irregular('themself', 'themselves')
    .irregular('mine', 'ours')
    .irregular('hers', 'theirs')
    .irregular('his', 'theirs')
    .irregular('its', 'theirs')
    .irregular('theirs', 'theirs')
    .irregular('sex', 'sexes')
    .irregular('photo', 'photos')
    .irregular('video', 'videos')
    .irregular('rodeo', 'rodeos');

  /**
   * Default uncountables.
   */

  en.uncountable('advice')
    .uncountable('enegery')
    .uncountable('excretion')
    .uncountable('digestion')
    .uncountable('cooperation')
    .uncountable('health')
    .uncountable('justice')
    .uncountable('jeans')
    .uncountable('labour')
    .uncountable('machinery')
    .uncountable('equipment')
    .uncountable('information')
    .uncountable('pollution')
    .uncountable('sewage')
    .uncountable('paper')
    .uncountable('money')
    .uncountable('species')
    .uncountable('series')
    .uncountable('rain')
    .uncountable('rice')
    .uncountable('fish')
    .uncountable('sheep')
    .uncountable('moose')
    .uncountable('deer')
    .uncountable('bison')
    .uncountable('proceedings')
    .uncountable('shears')
    .uncountable('pincers')
    .uncountable('breeches')
    .uncountable('hijinks')
    .uncountable('clippers')
    .uncountable('chassis')
    .uncountable('innings')
    .uncountable('elk')
    .uncountable('rhinoceros')
    .uncountable('swine')
    .uncountable('you')
    .uncountable('news');

  /**
   * Capitalize the first word of `str` or optionally `allWords`.
   *
   * Examples:
   *
   *    lingo.capitalize('hello there');
   *    // => "Hello there"
   *
   *    lingo.capitalize('hello there', true);
   *    // => "Hello There"
   *
   * @param {String} str
   * @param {Boolean} allWords
   * @return {String}
   * @api public
   */

  lingo.capitalize = function(str, allWords){
    if (allWords) {
      return str.split(' ').map(function(word){
        return lingo.capitalize(word);
      }).join(' ');
    }
    return str.charAt(0).toUpperCase() + str.substr(1);
  };

  /**
   * Camel-case the given `str`.
   *
   * Examples:
   *
   *    lingo.camelcase('foo bar');
   *    // => "fooBar"
   *
   *    lingo.camelcase('foo bar baz', true);
   *    // => "FooBarBaz"
   *
   * @param {String} str
   * @param {Boolean} uppercaseFirst
   * @return {String}
   * @api public
   */

  lingo.camelcase = function(str, uppercaseFirst, split){
    split = split || ' ';
    return str.replace(/[^\S]+/g, ' ').split(split).map(function(word, i){
      if (i || (0 == i && uppercaseFirst)) {
        word = lingo.capitalize(word);
      }
      return word;
    }).join('');
  };

  /**
   * Underscore the given `str`.
   *
   * Examples:
   *
   *    lingo.underscore('UserAccount');
   *    // => "user_account"
   *
   *    lingo.underscore('User');
   *    // => "user"
   *
   * @param {String} str
   * @return {String}
   * @api public
   */

  lingo.underscore = function(str){
    return str.replace(/([a-z\d])([A-Z])/g, '$1_$2').toLowerCase();
  };

  /**
   * Join an array with the given `last` string
   * which defaults to "and".
   *
   * Examples:
   *
   *    lingo.join(['fruits', 'veggies', 'sugar']);
   *    // => "fruits, veggies and sugar"
   *
   *    lingo.join(['fruits', 'veggies', 'sugar'], 'or');
   *    // => "fruits, veggies or sugar"
   *
   * @param {Array} arr
   * @param {String} last
   * @return {String}
   * @api public
   */

  lingo.join = function(arr, last){
    var str = arr.pop()
      , last = last || 'and';
    if (arr.length) {
      str = arr.join(', ') + ' ' + last + ' ' + str;
    }
    return str;
  };

  if (typeof define === 'function') {
      define(function () {
          return lingo;
      });
  }
  if (typeof window === 'object') {
      window.lingo = lingo;
  }
})();