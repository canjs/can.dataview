module can from "can";
module Bacon from "bacon";
import "can.bacon";

can.makeDataViewStreamFromStream = function(stream, map) {
  var mapping = [];
  var removeStream = stream.filter(function(ev) { return ev.how === "remove"; }).map(function(event) {
    var mappedIndex = findMappedIndex(mapping, event.index),
        mappedCount = findMappedCount(mapping, mappedIndex, event.value.length);
    mapping.splice(event.index, event.value.length).forEach(function(c) { c.unbind("change"); });
    return {
      how: "splice",
      howMany: mappedCount,
      index: mappedIndex,
      value: []
    };
  });
  var changeStream = stream.filter(function(ev) {
    return ~["add","set"].indexOf(ev.how);
  }).withHandler(function(event) {
    event = event.value();
    var handler = this;
    event.value.forEach(function(val, i) {
      var lastCount = 0;
      var compute = can.compute(function() {
        var newItems;
        if (map.length > 1) {
          newItems = [];
          map(val, function(val) { newItems.push(val); });
        } else {
          newItems = [map(val)];
        }
        handler.push(new Bacon.Next({
          how: "splice",
          howMany: lastCount,
          index: findMappedIndex(mapping, mapping.indexOf(compute)),
          value: newItems
        }));
        lastCount = newItems.length;
        return lastCount;
      });
      mapping
        .splice(event.index + i, event.how === "add" ? 0 : 1, compute)
        .forEach(function(c) { c.unbind("change"); });
      compute.bind("change", function(){});
    });
  });
  return removeStream.merge(changeStream);
};

can.List.prototype.toDataViewStream = function(mapper) {
  return can.makeDataViewStreamFromStream(
    this.bind("add")
      .merge(this.bind("remove"))
      .merge(this.bind("set")));
};

can.List.prototype.toDataViewList = function(mapper) {
  return this.toDataViewStream(mapper).toList(new can.List(this));
};

//
// Util
//
function findMappedIndex(mapping, index) {
  var mappedIndex = 0;
  for (var i = 0; i < index; i++) {
    mappedIndex += (mapping[i] || function(){return 0;})();
  }
  return mappedIndex;
}

function findMappedCount(mapping, mappedIndex, length) {
  var mappedCount = 0;
  for (var i = mappedIndex; i < mappedIndex + length; i++) {
    mappedCount += (mapping[i] || function(){return 0;})();
  }
  return mappedCount;
}
