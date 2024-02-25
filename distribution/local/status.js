const id = require("../util/id");
const { fork } = require("child_process");
const serialization = require("../util/serialization");
const wire = require("../util/wire.js");

const status = {};

global.moreStatus = {
  sid: id.getSID(global.nodeConfig),
  nid: id.getNID(global.nodeConfig),
  counts: 0,
};

status.get = function (configuration, callback) {
  callback = callback || function () {};

  if (configuration in global.nodeConfig) {
    callback(null, global.nodeConfig[configuration]);
  } else if (configuration in moreStatus) {
    callback(null, moreStatus[configuration]);
  } else if (configuration === "heapTotal") {
    callback(null, process.memoryUsage().heapTotal);
  } else if (configuration === "heapUsed") {
    callback(null, process.memoryUsage().heapUsed);
  } else {
    callback(new Error("Status key not found"));
  }
};

status.stop = (callback) => {
  try {
    global.server.close(() => {
      console.log("Server closed. No longer accepting connections.");

      setTimeout(() => {
        console.log("Exiting process.");
        process.exit(0);
      }, 1000);
    });
  } catch (error) {
    callback(error, null);
    return;
  }

  callback(null, null);
};

status.spawn = (configuration, callback) => {
  try {
    const callBackRPC = wire.createRPC(wire.toAsync(callback));

    if (!("onStart" in configuration)) {
      configuration.onStart = callBackRPC;
    } else {
      const onStartRPC = wire.createRPC(wire.toAsync(configuration.onStart));

      const g = (s, cb) => {
        onStartRPC(s, (err1, result1) => {
          if (err1) {
            cb(err1);
          } else {
            // console.log(result1);
            callBackRPC((err2, result2) => {
              if (err2) {
                cb(err2);
              } else {
                // console.log(result2);
                cb(null, result2);
              }
            });
          }
        });
      };

      configuration.onStart = g;
    }

    const file = path.join(__dirname, "..", "distribution,js");
    const args = ["--config", serialization.serialize(configuration)];

    const childProcess = fork(file, args);
    childProcess.on("error", (err) => {
      callback(err, null);
    });
  } catch (error) {
    callback(error, null);
    return;
  }

  callback(null, null);
};

module.exports = status;
