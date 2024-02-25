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
  global.distribution.local.groups.put(groupName, nodes, (e,v) => {});
  // console.log(global.distribution.local.groups);

  global.distribution[groupName] = nodes;

  // comm, groups, routes, status, gossip
  global.distribution[groupName].comm = comm({ gid: groupName });
  global.distribution[groupName].groups = groups({ gid: groupName });

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
