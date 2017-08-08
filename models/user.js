/**************************************************************** 
  * Copyright (c) 2017 Rudd Johnson, Daniel Eynis, Justin Moore *
  * This program is licensed under the "MIT License".           *
  * Please see the file COPYING in the source                   *
  * distribution of this software for license terms.            *
/****************************************************************/

var mongoose = require('mongoose');

module.exports = mongoose.model('User', {
  username: String,
  password: String,
  email: String,
  pics: [Buffer]
});