const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  items.text = text;
  // console.log("dfdfdf", exports.dataDir)
  counter.getNextUniqueId((err, id) => {
    if (err) {
      callback(err, null);
    } else {
      fs.writeFile(exports.dataDir + '/' + id + '.txt', text, (err) => {
        if (err) {
          throw ('error writing file in create');
        } else {
          callback(null, { id, text });
        }

      });
    }
  });

};

exports.readAll = (callback) => {
  // let data = _.map(items, (text, id) => {
  //   return { id, text };
  // });
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      callback(err, null);
    } else {
      let data = _.map(files, (text, id) => {
        let num = text.split('.');
        text = num[0];
        id = text;
        return { id, text };
      });
      callback(null, data);
    }

  });

};

exports.readOne = (id, callback) => {
  // var text = items[id];
  fs.readFile(`${exports.dataDir}/${id}.txt`, (err, fileData) => {
    if (err) {
      // console.log('err from readOne');
      callback(new Error(`No item with id: ${id}`));
    } else {
      // fileData = fileData.toString();
      // if (!fileData) {
      //   callback(new Error(`No item with id: ${id}`));
      // } else {
      //   callback(null, { id, fileData });
      // }
      let data = { id: id, text: fileData.toString() };
      callback(null, data);
    }
  });

};

exports.update = (id, text, callback) => {
  // var item = items[id];
  // let updatedData = text
  if (fs.existsSync(`${exports.dataDir}/${id}.txt`)) {
    fs.writeFile(`${exports.dataDir}/${id}.txt`, text, (err) => {
      if (err) {
        callback(new Error(`No item with id: ${id}`));
      } else {
        callback(null, { id, text });
      }
    });
  } else {
    callback(new Error(`No item with id: ${id}`));
  }

  // if (!item) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   items[id] = text;
  //   callback(null, { id, text });
  // }
};

exports.delete = (id, callback) => {
  // var item = items[id];
  // delete items[id];
  fs.unlink(`${exports.dataDir}/${id}.txt`, (err) => {
    if (err) {
      console.log('err inside delete');
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback();
    }
  });
  // if (!item) {
  //   // report an error if item not found
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback();
  // }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
