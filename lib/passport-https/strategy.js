/**
 * Module dependencies.
 */
var passport = require('passport')
  , util = require('util')
  , BadRequestError = require('./errors/badrequesterror');


/**
 * `Strategy` constructor.
 *
 * The https certificate authentication strategy authenticates requests based on the
 * subject of a certificate passed to the HTTPS server.
 *
 * Applications must supply a `verify` callback which accepts `name` and
 * `authenticated` credentials, and then calls the `done` callback supplying a
 * `user`, which should be set to `false` if the credentials are not valid.
 * If an exception occured, `err` should be set.
 *
 * Optionally, `options` can be used to change the fields in which the
 * credentials are found in the `subject`.
 *
 * Options:
 *   - `subjectField`  field name where the username is found, defaults to _CN_
 *   - `passReqToCallback`  when `true`, `req` is the first argument to the verify callback (default: `false`)
 *
 * Examples:
 *
 *     passport.use(new HttpsCertificateStrategy(
 *       function(name, authenticated, done) {
 *         User.findOne({ username: name}, function (err, user) {
 *           done(err, user);
 *         });
 *       }
 *     ));
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, verify) {
  if (typeof options == 'function') {
    verify = options;
    options = {};
  }
  if (!verify) throw new Error('https authentication strategy requires a verify function');
  
  this._subjectField = options.subjectField || 'CN';
  
  passport.Strategy.call(this);
  this.name = 'https';
  this._verify = verify;
  this._passReqToCallback = options.passReqToCallback;
}

/**
 * Inherit from `passport.Strategy`.
 */
util.inherits(Strategy, passport.Strategy);

/**
 * Authenticate request based on the contents of HTTPS connection subject.
 *
 * @param {Object} req
 * @api protected
 */
Strategy.prototype.authenticate = function(req, options) {
  options = options || {};

  if(!req.connection.encrypted) {
    return this.fail(new BadRequestError(options.badRequestMessage || 'Unencrypted connection'));
  }

  var certificate = req.connection.getPeerCertificate();
  if(!certificate) {
    return this.fail(new BadRequestError(options.badRequestMessage || 'No client certificate'));
  }
  var name = lookup(certificate.subject, this._subjectField);
  
  if (!name) {
    return this.fail(new BadRequestError(options.badRequestMessage || 'Missing subject field'));
  }
  
  var self = this;
  
  function verified(err, user, info) {
    if (err) { return self.error(err); }
    if (!user) { return self.fail(info); }
    self.success(user, info);
  }
  
  if (self._passReqToCallback) {
    this._verify(req, apikey, verified);
  } else {
    this._verify(apikey, verified);
  }
  
  function lookup(obj, field) {
    if (!obj) { return null; }
    var chain = field.split(']').join('').split('[');
    for (var i = 0, len = chain.length; i < len; i++) {
      var prop = obj[chain[i]];
      if (typeof(prop) === 'undefined') { return null; }
      if (typeof(prop) !== 'object') { return prop; }
      obj = prop;
    }
    return null;
  }
}


/**
 * Expose `Strategy`.
 */ 
module.exports = Strategy;
