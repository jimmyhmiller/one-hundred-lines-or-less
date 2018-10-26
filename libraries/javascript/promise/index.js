// This works for many common cases, but isn't actually correct.
// I think I might call this good enough.
// While it is buggy and wrong, correctness isn't exaclty the
// point of this series. Maybe a future episode cleaning it up
// would actually be instructive

function Promise(fn) {
  const state = {
    thenHandler: undefined,
    catchHandler: undefined,
    status: "pending",
    value: undefined
  }

  const handleCallbacks = () => {
    if (state.status === "resolved" && state.thenHandler) {
      state.thenHandler(state.value);
    } else if (state.status === "rejected" && state.catchHandler) {
      state.catchHandler(state.value);
    }
  }

  const resolve = (data) => {
    if (state.status === "pending") {
      state.status = "resolved";
      state.value = data;
    }
    handleCallbacks();
  }

  const reject = (e) => {
    if (state.status === "pending") {
      state.status = "rejected";
      state.value = e;
    }
    handleCallbacks();
  }

  const wrapCall = (resolve, reject) => f => data =>  {
    try {
      resolve(f(data))
    } catch (e) {
      reject(e)
    }
  }

  const then = (thenFn) => {
    const promise = new Promise((resolve, reject) => {
      state.thenHandler = wrapCall(resolve,reject)(thenFn)
    });
    handleCallbacks();
    return promise;
  }

  const _catch = (catchFn) => {
    const promise = new Promise((resolve, reject) => {
      state.catchHandler = wrapCall(resolve,reject)(catchFn)
    });
    handleCallbacks();
    return promise;
  }

  try {
    fn(resolve, reject)
  } catch (e) {}
  
  return {
    then,
    catch: _catch
  }
}

var promise1 = new Promise(function(resolve, reject) {
  setTimeout(function() {
    resolve('foo2'); // does handle setTimeout
  }, 300);
}).then(x => {
  console.log(x);
  return x;
})

promise1.then(function(value) {
  throw "Error"
})

// Doesn't handle multiple thens or catches
// promise1.then(function (value) {
//   console.log("Hello")
// })

.catch(e => {
  console.log("catch", e); 
  return "1"
})
.then(s => console.log("then", s))
.catch(e => console.log("thing", e)) // never gets call (good)

var promise2 = new Promise(function(resolve, reject) {
  resolve('foo1');
}).then(x => console.log(x))

// incorrect doesn't handle nested promises
var promise3 = new Promise(function(resolve, reject) {
  resolve(new Promise((resolve) => resolve(2)));
}).then(x => console.log("resolved", x))

