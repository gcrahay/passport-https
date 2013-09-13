# Passport-HTTPS

[Passport](http://passportjs.org/) strategy for authenticating with a certificate provided by the client in a HTTPS connection.

This module lets you authenticate using a certificate subject field in your Node.js
applications which is used to build rest apis.By plugging into Passport, certificate authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

## Installation

    $ npm install passport-https

## Usage

#### Configure Strategy

The certificate authentication strategy authenticates users using a field in the certificate provided by the client.  
The strategy requires a `verify` callback, which accepts this
field and calls `done` providing a user.

    passport.use(new HttpsCertificateStrategy(
      function(name, authenticated, done) {
        User.findOne({ username: name }, function (err, user) {
          if (err) { return done(err); }
          if (!user) { return done(null, false); }
          return done(null, user);
        });
      }
    ));

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'https'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

    app.post('/api/authenticate', 
      passport.authenticate('https', { failureRedirect: '/api/unauthorized' }),
      function(req, res) {
        res.json({ message: "Authenticated" })
      });

## Examples

    curl -v -E cert.pem:password https://127.0.0.1:3000/api/authenticate

## Credits

  - [Gaetan Crahay](http://twitter.com/gcrahay)
  - Based on the [passport-localapikey](https://github.com/cholalabs/passport-localapikey) by [Sudhakar Mani](http://twitter.com/sudhakarmani)

## License

(The MIT License)

Copyright (c) 2012 Sudhakar Mani

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
