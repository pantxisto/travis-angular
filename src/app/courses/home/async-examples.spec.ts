import { fakeAsync, flush, flushMicrotasks, tick } from "@angular/core/testing";
import { of } from "rxjs";
import { delay } from "rxjs/operators";

describe("Async Testing Examples", () => {
  // With done() we  need to write assertions inside setTimeouts...
  it("Async test example with Jasmine done()", (done: DoneFn) => {
    let test = false;
    setTimeout(() => {
      console.log("Running assertions");
      test = true;
      expect(test).toBeTruthy();
      done();
    }, 1000);
  });

  // With fakeAsync we don't need to write assertions inside setTimeouts...
  it("Async test example - setTimeout()", fakeAsync(() => {
    let test = false;
    setTimeout(() => {
      console.log("Running assertions setTimeout()");
      test = true;
    }, 500);

    // How much we want to advance our clock?
    // tick(500);

    // We execute all the timeouts that were queued by the fakeAsync zone
    flush();
    expect(test).toBeTruthy();
  }));

  // A promise is considered a microtask and settimout a task or macrotask (settimeout,
  // setinterval, http request, mouse clicks...). Microtask and macrotasks have a separated queue.
  // Between the execution of microtask the browser will not get a chance to update the view,
  // between macrotasks yes.
  // Browser is going to execute any tasks that are present on the microtask queue before going over the main
  // macrotask queue
  it("Async test example - Plain Promises and settimeouts", fakeAsync(() => {
    let test = false;

    setTimeout(() => {
      console.log("setTimeout() first callback triggered.");
    });

    setTimeout(() => {
      console.log("setTimeout() second callback triggered.");
    });

    console.log("Creating promise");
    Promise.resolve()
      .then(() => {
        console.log("Promise first then() evaluated successfully");
        return Promise.resolve();
      })
      .then(() => {
        console.log("Promise second then() evaluated successfully");
        test = true;
      });

    flush();

    console.log("Running test assertions");
    expect(test).toBeTruthy();
  }));

  it("Async test example - Plain Promise", fakeAsync(() => {
    let test = false;

    console.log("Creating promise");
    Promise.resolve()
      .then(() => {
        console.log("Promise first then() evaluated successfully");
        test = true;
        return Promise.resolve();
      })
      .then(() => {
        console.log("Promise second then() evaluated successfully");
      });

    // All the pending microstasks are flushed
    flushMicrotasks();

    console.log("Running test assertions");
    expect(test).toBeTruthy();
  }));

  it("Async test example - Promise + setTimeout", fakeAsync(() => {
    let counter = 0;

    Promise.resolve().then(() => {
      counter += 10;

      setTimeout(() => {
        counter += 1;
      }, 1000);
    });

    expect(counter).toBe(0);

    // We flush the microtasks (promises)
    flushMicrotasks();

    expect(counter).toBe(10);

    // We pass enough time to allow executing setTimeout
    tick(1000);

    expect(counter).toBe(11);
  }));

  it("Async test example - Observables", fakeAsync(() => {
    let test = false;

    console.log("Creating observable");

    // const test$ = of(test);
    const test$ = of(test).pipe(delay(1000));

    // This code is synchronous and don't nweed fakeAsync
    test$.subscribe(() => {
      test = true;
    });

    // This tick is necesary for the delay observable which uses setTimeout internally
    tick(1000);
    console.log("Running test assertions");

    expect(test).toBeTruthy();
  }));
});
