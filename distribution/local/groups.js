const id = require("../util/id");
const config = require("./config.js");

const distribution = require("../../distribution");
const commTemplate = require("../all/comm.js");
const gossipTemplate = require("../all/gossip.js");
const groupsTemplate = require("../all/groups.js");
const routesTemplate = require("../all/routes.js");
const statusTemplate = require("../all/status.js");

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

distribution.all = {
  [sid]: config,
};

groups.get = (group, callback) => {
  // console.log(group);
  // console.log(groups.nodeGroups);

  if (group in groups.nodeGroups) {
    // console.log(groups.nodeGroups[group]);
    callback(null, groups.nodeGroups[group]);
  } else {
    callback(new Error(`group ${group} not found`));
  }
};

groups.put = (groupName, nodes, callback) => {
  // console.log(nodes);
  // var newGroup = {};
  // if (groupName in groups.nodeGroups) {
  //   newGroup = groups.nodeGroups[groupName];
  // }

  // for (const nodeId in nodes) {
  //   // console.log(nodeId);
  //   newGroup[nodeId] = nodes[nodeId];
  // }

  // console.log(newGroup);

  groups.nodeGroups[groupName] = nodes;

  distribution[groupName] = {
    comm: commTemplate({ gid: groupName }),
    groups: groupsTemplate({ gid: groupName }),
    // status: statusTemplate({gid: groupName}),
  };

  console.log(groups.nodeGroups);

  callback(null, nodes);
};

groups.add = (groupName, node, callback) => {
  const nodeSID = id.getSID(node);
  if (!(groupName in groups.nodeGroups)) {
    callback(null, {});
    return;
  }

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

  callback(null, groupToDelete);
};

module.exports = groups;
