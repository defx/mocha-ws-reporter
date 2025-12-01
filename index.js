const connect = (opts = {}) => {
  return new Promise((resolve, reject) => {
    const { port = 7777 } = opts;
    const socket = new WebSocket(`ws://localhost:${port}`);
    socket.addEventListener("open", () => {
      resolve(socket);
    });
    socket.addEventListener("close", () => {
      reject();
    });
  });
};

export const wsReporter = (opts) => {
  let ws;

  let emit = (name, v) => {
    let args = v
      .map((v) => (v ? v : {}))
      .map((v) => (v.serialize ? v.serialize() : v));

    ws.send(JSON.stringify({ name, args }));
  };

  window.onload = function () {
    connect(opts)
      .then((socket) => (ws = socket))
      .then(() => mocha.run())
      .catch(console.error);
  };

  return function wsReporterInitFn(runner) {
    const {
      EVENT_RUN_BEGIN,
      EVENT_RUN_END,
      EVENT_TEST_PENDING,
      EVENT_TEST_FAIL,
      EVENT_TEST_PASS,
      EVENT_SUITE_BEGIN,
      EVENT_SUITE_END,
    } = Mocha.Runner.constants;

    runner
      .once(EVENT_RUN_BEGIN, (...args) => emit(EVENT_RUN_BEGIN, args))
      .on(EVENT_SUITE_BEGIN, (...args) => emit(EVENT_SUITE_BEGIN, args))
      .on(EVENT_SUITE_END, (...args) => emit(EVENT_SUITE_END, args))
      .on(EVENT_TEST_PENDING, (...args) => emit(EVENT_TEST_PENDING, args))
      .on(EVENT_TEST_PASS, (...args) => emit(EVENT_TEST_PASS, args))
      .on(EVENT_TEST_FAIL, (...args) => emit(EVENT_TEST_FAIL, args))
      .once(EVENT_RUN_END, (...args) => {
        emit(EVENT_RUN_END, args);
        if (ws) ws.close();
      });

    new Mocha.reporters.HTML(runner);
  };
};
