// const node = global.config;

// const local = require('../local/local.js');

const send = (context, message, remote, callback) => {
  const local = global.distribution.local;

  local.groups.get(context.gid, (e, v) => {
    const allNodes = v;
    const nodesToErrors = {};
    const nodesToValues = {};
    const counter = { count: 0 };

    for (const [sid, node] of Object.entries(allNodes)) {
      local.comm.send(message, { node, ...remote }, (e2, v2) => {
        // console.log(e2, v2);
        if (e2) {
          nodesToErrors[sid] = e2;
        } else {
          nodesToValues[sid] = v2;
        }

        counter.count++;

        if (counter.count === Object.keys(allNodes).length) {
          callback(nodesToErrors, nodesToValues);
        }
      });
    }
  });
};

let comm = (config) => {
  let context = {};

  context.gid = config.gid || "all";

  return { send: send.bind(null, context) };
};

module.exports = comm;
