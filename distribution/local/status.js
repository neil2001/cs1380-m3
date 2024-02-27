const id = require("../util/id");
const { fork } = require("child_process");
const path = require("path");

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
  // console.log("STOPPING SERVER");

  // if (global.server === null || global.server === undefined) {
  //   callback(null, null);
  //   return;
  // }

  setTimeout(() => {
    global.server.close();
    process.exit(0);
  }, 1000);

  // global.server.close(() => {
  //   setTimeout(() => {
  //     console.log("shutting down server");
  //     process.exit(0);
  //   });
  // }, 1);

  callback(null, null);
  // global.server.close();
};

// status.stop = (callback) => {
//   console.log("STOPPING");
//   try {

//     server.close();

//     console.log(global.distribution);
//     global.distribution.server.close(() => {
//       console.log("Server closed. No longer accepting connections.");

//       setTimeout(() => {
//         console.log("Exiting process.");
//         process.exit(0);
//       }, 1000);
//     });
//   } catch (error) {
//     callback(error, null);
//     return;
//   }

//   callback(null, null);
// };

status.spawn = (configuration, callback) => {
  const callbackRPC = wire.createRPC(callback);
  const newConfig = { ...configuration, onStart: callbackRPC };

  const file = path.join(__dirname, "../../", "distribution.js");
  const args = ["--config", serialization.serialize(newConfig)];

  const childProcess = fork(file, args);

  childProcess.on("close", (err) => {
    callback(err, null);
  });
};

// status.spawn = (configuration, callback) => {
//   try {
//     const callBackRPC = wire.createRPC(callback);

//     if (!("onStart" in configuration)) {
//       configuration.onStart = callBackRPC;
//     } else {
//       console.log("FUCKED RPC SHIT");
//       const onStartRPC = wire.createRPC(wire.toAsync(configuration.onStart));

//       const g = (s, cb) => {
//         onStartRPC(s, (err1, result1) => {
//           if (err1) {
//             console.log(err1);
//             cb(err1);
//           } else {
//             // console.log(result1);
//             callBackRPC((err2, result2) => {
//               if (err2) {
//                 cb(err2);
//               } else {
//                 // console.log(result2);
//                 console.log(err2);
//                 cb(null, result2);
//               }
//             });
//           }
//         });
//       };

//       configuration.onStart = g;
//     }

//     // console.log(__dirname);

//     const file = path.join(__dirname, "../../", "distribution.js");
//     const args = ["--config", serialization.serialize(configuration)];
//     // console.log(args);

//     const childProcess = fork(file, args);

//     // childProcess.on("close", () => {
//     //   callBackRPC();
//     // });
//     childProcess.on("close", (err) => {
//       callback(err, null);
//     });
//   } catch (error) {
//     callback(error, null);
//     return;
//   }

//   callback(null, null);
// };

module.exports = status;
