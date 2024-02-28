const id = require("../util/id");
const config = require("./config.js");

const commTemplate = require("../all/comm");
const groupsTemplate = require("../all/groups");
const routesTemplate = require("../all/routes");
const statusTemplate = require("../all/status");
const gossipTemplate = require("../all/gossip");

const groups = {};

const sid = global.moreStatus.sid;
groups.nodeGroups = {
  all: {
    [sid]: config,
  },
  local: {
    [sid]: config,
  },
};

groups.get = (group, callback) => {
  if (group in groups.nodeGroups) {
    callback(null, groups.nodeGroups[group]);
  } else {
    callback(new Error(`group ${group} not found`));
  }
};

groups.put = (groupName, nodes, callback) => {
  groups.nodeGroups[groupName] = nodes;

  const context = {
    gid: groupName,
  };

  global.distribution[groupName] = {
    comm: commTemplate(context),
    groups: groupsTemplate(context),
    status: statusTemplate(context),
    routes: routesTemplate(context),
    gossip: gossipTemplate(context),
  };

  callback(null, nodes);
};

groups.add = (groupName, node, callback) => {
  const nodeSID = id.getSID(node);
  if (!(groupName in groups.nodeGroups)) {
    callback(null, {});
    return;
  }

  groups.nodeGroups.all[nodeSID] = node;

  groups.nodeGroups[groupName][nodeSID] = node;
  callback(null, node);
};

groups.rem = (groupName, nodeId, callback) => {
  if (
    !(groupName in groups.nodeGroups) ||
    !(nodeId in groups.nodeGroups[groupName])
  ) {
    callback(null, {});
    return;
  }

  const nodeToDelete = groups.nodeGroups[groupName][nodeId];
  delete groups.nodeGroups[groupName][nodeId];

  callback(null, nodeToDelete);
};

groups.del = (groupName, callback) => {
  if (!(groupName in groups.nodeGroups)) {
    callback(new Error(`group ${groupName} not found`));
    return;
  }

  const groupToDelete = groups.nodeGroups[groupName];
  delete groups.nodeGroups[groupName];

  delete global.distribution[groupName];

  callback(null, groupToDelete);
};

module.exports = groups;
