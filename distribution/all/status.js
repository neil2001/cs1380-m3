const get = (context, configuration, callback) => {};

const stop = (context, callback) => {
  const message = [];
  const remote = {
    service: "status",
    method: "stop",
  };
  comm.send()
};

const spawn = (context, configuration, callback) => {};

let status = (config) => {
  let context = {};

  context.gid = config.gid || "all"; // contains a property named gid

  return { get: get.bind(null, context) };
};

module.exports = status;
