describe("can.dataview", function() {
  describe("can.makeDataViewStreamFromStream", function() {
    it("accepts a stream and a function and returns a stream");
    it("reacts to 'add' events");
    it("reacts to 'set' events");
    it("reacts to 'remove' events");
    it("returns splice events");
    it("updates elements if items referenced in mapFn trigger changes");
  });
  describe("can.List#toDataViewStream", function() {
  });
  describe("can.List#toDataViewList", function() {
    it("returns a can.List");
  });
  describe("lazytest", function() {
    it("works", function() {
      var sourceList = new can.List();

      var targetList = sourceList.toDataViewList(function(todo, map) {
        if (!todo.attr("done")) {
          todo.attr("steps").forEach(map);
        }
      });

      sourceList.push({
        done: false,
        description: "Do the Bitovi Dance",
        steps: ["hop around", "do a little twirl"]
      });

      assert.deepEqual(targetList.attr(), ["hop around", "do a little twirl"], "synced");

      sourceList.push({
        done: true,
        description: "Assert opinion",
        steps: ["clear throat", "push up glasses",
                "raise index finger"]
      });
      assert.deepEqual(targetList.attr(), ["hop around", "do a little twirl"], "filtering");

      sourceList.push({
        done: false,
        description: "Do some open source",
        steps: ["Download Emacs.app", "grow a neckbeard", "make a PR on github"]
      });
      assert.deepEqual(
        targetList.attr(),
        ["hop around", "do a little twirl", "Download Emacs.app",
         "grow a neckbeard", "make a PR on github"]);

      sourceList.attr(0).attr("steps").pop();
      assert.deepEqual(targetList.attr(),
                       ["hop around", "Download Emacs.app", "grow a neckbeard",
                        "make a PR on github"]);

      sourceList.attr(0).attr("done", true);
      assert.deepEqual(targetList.attr(),
                        ["Download Emacs.app", "grow a neckbeard",
                         "make a PR on github"]);

      sourceList.shift();
      assert.deepEqual(targetList.attr(),
                       ["Download Emacs.app", "grow a neckbeard",
                        "make a PR on github"]);

      sourceList.shift();
      assert.deepEqual(targetList.attr(),
                       ["Download Emacs.app", "grow a neckbeard",
                        "make a PR on github"]);

      sourceList.shift();
      assert.deepEqual(targetList.attr(), []);
      
    });
  });
});

function bench() {
  window.mapperCalls = 0;
  window.sourceList = new can.List(),
  window.targetList = window.sourceList.toDataViewList(function(todo, map) {
    if (!todo.attr("done")) {
      todo.attr("steps").forEach(map);
    }
  });
  console.log("Benchmarking...");
  console.time("building");
  for (var i = 0; i < 200; i++) {
    sourceList.push({
      done: false,
      description: "Do the Bitovi Dance",
      steps: ["hop around", "do a little twirl"]
    });
  }
  console.timeEnd("building");
  console.time("done");
  sourceList.forEach(function(todo) { todo.attr("done", true); });
  console.timeEnd("done");
  console.time("todo");
  sourceList.forEach(function(todo) { todo.attr("done", false); });
  console.timeEnd("todo");
  console.time("removing");
  for (var i = 0; i < sourceList.length; i++) {
    sourceList.pop();
  }
  console.timeEnd("removing");
}
