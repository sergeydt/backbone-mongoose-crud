backbone-mongoose-crud
======================

## Install

```sh
npm install git+https://github.com/shootshoot/backbone-mongoose-crud.git
```

## Dependencies

* npm install [git+https://github.com/shootshoot/mongoose-helper.git](https://github.com/shootshoot/mongoose-helper)

## How to use it with ExpressJS
```js
app.all('/CRUD/:modelName', require('backbone-mongoose-crud').express);
```

## How to use it with ActionHeroJS

In an action file
```js
exports.action = require('backbone-mongoose-crud').actionhero('Posts');

exports.action.run = function(api, connection, next) {
    this.beforeRun(api, connection, next);
}
```

