// const node = global.config;

// const local = require('../local/local.js');

const send = (context, message, remote, callback) => {
//   console.log(`SENDING MESSAGE to nodes in: ${context.gid}`);

  const local = global.distribution.local;
  //   console.log(global.distribution);

  const responseValues = {};
  const responseErrors = {};
  const counter = { count: 0, numNodes: 0 };

  //   console.log(node);

  const continuation = (node, error, value) => {
    counter.count++;

    console.log(node, error, value);

    // Store the error or value in the appropriate map
    if (error) {
      responseErrors[node] = error;
    } else {
      responseValues[node] = value;
    }

    if (counter.count == counter.numNodes) {
      callback(responseErrors, responseValues);
    }
  };

  for (const [groupName, group] of Object.entries(local.groups.nodeGroups)) {
    counter.numNodes += Object.keys(group).length;
  }

  //   console.log(counter.numNodes);

  const promises = [];

  const allNodes = [];

  //   for (const [groupName, group] of Object.entries(local.groups.nodeGroups)) {
  console.log(local.groups.nodeGroups);

  for (const [nodeId, node] of Object.entries(
    local.groups.nodeGroups[context.gid]
  )) {
      console.log(`sending message to ${nodeId}`);

    const newRemote = {
      node: node,
      service: remote.service,
      method: remote.method,
    };

    //   allNodes.push(node);
    //   remote.node = node;
    local.comm.send(message, newRemote, continuation.bind(null, node));
    //   local.comm.send(remoteMethodArgs, remote, (e, v) => {
    //     continuation.bind(null, node);
    //   }); //continuation.bind(null, node)

    //   const r = {
    //     node: node,
    //     service: remote.service,
    //     method: remote.method,
    //   };

    //   promises.push(
    //     new Promise((resolve, reject) => {
    //       local.comm.send(message, r, (e, v) => {
    //         if (e) {
    //           resolve(e);
    //         } else {
    //           resolve(v);
    //         }
    //       });
    //     })
    //   );
  }
  //   }

  //   const results = await Promise.all(promises);

  //   for (let i=0; i < results.length; i++) {
  //     const res = results[i];
  //     const currNode = allNodes[i];
  //     if (res instanceof Error) {
  //         responseErrors[currNode] = res;
  //     } else {
  //         responseValues[currNode] = currNode;
  //     }
  //   }

  //   callback(responseErrors, responseValues);

  //   callback({}, {});
};

let comm = (config) => {
  let context = {};

  context.gid = config.gid || "all"; // contains a property named gid

  return { send: send.bind(null, context) };
};

module.exports = comm;
