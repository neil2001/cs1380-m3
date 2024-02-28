const get = (context, configuration, callback) => {
  const message = [configuration];
  const remote = { service: "status", method: "get" };
  global.distribution[context.gid].comm.send(message, remote, callback);
};

const stop = (context, callback) => {
  const remote = { service: "status", method: "stop" };
  global.distribution[context.gid].comm.send([], remote, (e, v) => {
    global.distribution.local.status.stop(callback);
  });
};

const spawn = (context, nodeConfig, callback) => {
  global.distribution.local.status.spawn(nodeConfig, (e1, v1) => {
    console.log(e1);
    console.log(v1);
    
    global.distribution[context.gid].groups.add(context.gid, nodeConfig, (e2, v2) => {
      if (Object.keys(e2).length === 0) {
        callback(null, nodeConfig);
      } else {
        callback(
          new Error(
            `could not spawn node ${nodeConfig.ip}:${nodeConfig.port}`
          )
        );
      }
    });
  });
};

let status = (config) => {
  let context = {};

  context.gid = config.gid || "all"; // contains a property named gid

  return {
    get: get.bind(null, context),
    stop: stop.bind(null, context),
    spawn: spawn.bind(null, context),
  };
};

module.exports = status;
