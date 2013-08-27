backbone-mongoose-crud
======================

Provide a REST API for Mongoose models, in order to use it with Backbone.

You can use it with [actionHeroJS](https://github.com/evantahler/actionHero) or [ExpressJS](https://github.com/visionmedia/express)

* Express version is tested with node 0.10.15. It may also work on 0.8+.
* Action Hero version, is tested with node 0.10.15 and [actionHero](https://github.com/evantahler/actionHero) v6.2.3.


## Install

```sh
npm install git+https://github.com/shootshoot/backbone-mongoose-crud.git
```

## Dependencies

* The shootshoot's [mongoose-helper](https://github.com/shootshoot/mongoose-helper)

## TODO

- [x] Refactor expressJS version
- [ ] Refactor actionHeroJS version to use the same base as the expressJS version

## How to use

You must define your mongoose models.

### with ExpressJS
```js
app.use('/CRUD', require('backbone-mongoose-crud').express);
```

### with ActionHeroJS

In an action file
```js
exports.action = require('backbone-mongoose-crud').actionhero('Posts');

exports.action.run = function(api, connection, next) {
    this.beforeRun(api, connection, next);
}
```

Replace 'Posts' by the mongoose model name. For the ActionHeroJS version you must create one action per model.

