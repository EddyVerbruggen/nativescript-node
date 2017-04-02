/************************************************************************
 * (c) 2015, Master Technology
 * Licensed under the MIT license
 * Any questions please feel free to email me or put a issue up on github
 * Version 0.0.1
 ************************************************************************/

var FileSystemAccess = require("file-system/file-system-access").FileSystemAccess;
var Folder = require("file-system/file-system").Folder;
var File = require("file-system/file-system").File;
var FSN = require('./fs-native');

"use strict";

var fs = {
  // Node 0.12 Mode Constants
  F_OK: 0,
  X_OK: 1,
  W_OK: 2,
  R_OK: 4,

  rename: function (oldPath, newPath, callback) {
    var fa = new FileSystemAccess();
    fa.rename(oldPath, newPath, callback, callback);
  },
  renameSync: function (oldPath, newPath) {
    fs.rename(oldPath, newPath, null);
  },
  exists: function (path, callback) {
    callback(fs.existsSync(path));
  },
  existsSync: function (path) {
    var fa = new FileSystemAccess();
    return fa.fileExists(path);
  },
  access: function (path, mode, callback) {
    if (typeof mode === 'function') {
      callback = mode;
      mode = fs.F_OK;
    }

    if (!fs._accessSync(path, mode)) {
      callback("No Access");
    } else {
      callback();
    }
  },
  accessSync: function (path, mode) {
    if (!fs._accessSync(path, mode)) {
      throw new Error("No Access");
    }
  },
  _accessSync: function (path, mode) {
    var result = FSN.access(path);

    // F_OK
    if (result === -1) return false;

    // Check the other access modes
    return ((result & mode) == mode);
  },
  unlink: function (path, callback) {
    try {
      FSN.unlink(path);
    } catch (err) {
      return callback(err);
    }
    callback();
  },
  unlinkSync: function (path) {
    try {
      FSN.unlink(path);
    }
    catch (err) {
      return false;
    }
    return true;
  },


  truncate: function (path, len, callback) {
    throw new Error("Not Implemented");
  },
  truncateSync: function (path, len) {
    fs.truncate(path, len);
  },
  chown: function (path, uid, gid, callback) {
    throw new Error("Not Implemented");
  },
  chownSync: function (path, uid, gid) {
    fs.chown(path, uid, gid);
  },
  chmod: function (path, mode, callback) {
    throw new Error("Not Implemeted");
  },
  chmodSync: function (path, mode) {
    fs.chmod(path, mode, null);
  },
  stat: function (path, callback) {
    throw new Error("Not Implemented");
  },
  statSync: function (path) {
    fs.stat(path);
  },
  openSync: function (path, options) {
    console.log("openSync not implemented, called with params: " + path + ", " + options);
    // return FSN.getFile(path);
    return null;
  },
  closeSync: function (fd) {
    console.log("closeSync not implemented, called with param: " + fd);
    // return FSN.getFile(path);
  },
  futimesSync: function (fd, atime, mtime) {
    console.log("futimesSync not implemented, called with params: " + fd + ", " + atime + ", " + mtime);
  },
  // note that our impl expects text, doesn't do binary atm
  readFile: function (path, options, callback) {
    if (typeof options === "function" && !callback) {
      callback = options;
    }
    var fa = new FileSystemAccess();
    // fa.readText is synchronous
    var error = undefined;
    var contents = fa.readText(path, function (err) {
      error = err;
    });
    if (typeof callback === "function") {
      callback(error, contents);
    }
  },
  readFileSync: function (path) {
    var fa = new FileSystemAccess();
    return fa.readText(path);
  },
  write: function (file, data, position, encoding, callback) {
    fs.writeFile(file, data, null, callback);
  },
  // note that our impl expects text, doesn't do binary atm
  writeFile: function (path, data, options, callback) {
    if (typeof options === 'function' && !callback) {
      callback = options;
    }

    var fa = new FileSystemAccess();

    if (!fs.existsSync(path)) {
      File.fromPath(path);
    }

    // fa.writeText is synchronous
    var error = undefined;
    fa.writeText(path, data, function (err) {
      error = err;
    });
    if (typeof callback === "function") {
      callback(error);
    }
  },
  writeFileSync: function (file, data) {
    var fa = new FileSystemAccess();
    fa.writeText(file, data);
    return undefined;
  },
  mkdir: function (path, mode, callback) {
    if (typeof mode === "function" && !callback) {
      callback = mode;
    }
    try {
      var folder = Folder.fromPath(path);
      if (typeof callback === "function") {
        callback();
      }
    } catch (err) {
      if (typeof callback === "function") {
        callback(err);
      }
    }
  },
  // note that our impl expects text, doesn't do binary atm
  appendFile: function (path, data, options, callback) {
    if (typeof options === 'function' && !callback) {
      callback = options;
    }

    var fa = new FileSystemAccess();

    if (!fs.existsSync(path)) {
      File.fromPath(path);
    }

    var contents = fs.readFileSync(path);
    var newContents = contents ? contents + data : data;

    // fa.writeText is synchronous
    var error = undefined;
    fa.writeText(path, newContents, function (err) {
      error = err;
    });
    if (typeof callback === "function") {
      callback(error);
    }
  }
};

module.exports = fs;