# confone-backoffice

## Start DB
* `cd db; docker-compose up`
   * db runs on _localhost:3306_, username-password: _abc/abc_, dbName: _db_
* alternatively you can create your own database based on _0-schema.sql_ and fill it using with fill-db.js
   * `cd db; yarn; node fill-db.js; cd ..`
   * _fill-db.js_ uses same credentials to access db