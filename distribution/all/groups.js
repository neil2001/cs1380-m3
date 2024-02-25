const comm = require("./comm");
const routes = require("./routes");
const status = require("./status");
const gossip = require("./gossip");

global.distribution["groups"] = new Set();

const groupObj = {};

const get = (groupName, callback) => {
  const getObjs = {};

  callback({}, getObjs);
};

const put = (groupName, nodes, callback) => {
  // call the local.groups.put calls
  // console.log(global.distribution.local.groups);
  global.distribution.local.groups.put(groupName, nodes, (e, v) => {});
  // console.log(global.distribution.local.groups);

  global.distribution[groupName] = {};

  // comm, groups, routes, status, gossip
  global.distribution[groupName].comm = comm({ gid: groupName });
  global.distribution[groupName].groups = groups({ gid: groupName });
  // global.distribution[groupName].groups

  callback({}, {});
};

const groups = (options) => {
  const context = {};
  context.gid = options.gid || "all";

  // global.distribution[groupId] = {};
  // global.distribution.groups.add(groupId);

  return {
    get: get,
    put: put,
  };
};

module.exports = groups;

// let comm = require('./comm');

// let groups = (config) => {
//     const gid = config.gid || 'all';
//     comm = comm(gid);

//     return {
//         get: function(name, cb) {
//             const message = [name];
//             const remote = {service: 'groups', method: 'get'};
//             comm.send(message, remote, cb);
//         },

//         put: function(name, nodes, cb) {
//             const message = [name, nodes];
//             const remote = {service: 'groups', method: 'put'};
//             comm.send(message, remote, cb);
//         },

//         del: function(name, cb) {
//             const message = [name];
//             const remote = {service: 'groups', method: 'del'};
//             comm.send(message, remote, cb);
//         },

//         add: function(name, n, cb) {
//             const message = [name, n];
//             const remote = {service: 'groups', method: 'add'};
//             comm.send(message, remote, cb);
//         },

//         rem: function(name, n, cb) {
//             const message = [name, n];
//             const remote = {service: 'groups', method: 'rem'};
//             comm.send(message, remote, cb);
//         },
//     }
// }

// module.exports = groups;
