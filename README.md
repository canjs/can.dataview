# can.dataview

`can.dataview` is a [CanJS](https://github.com/bitovi/canjs) plugin that
provides a simple API for creating and managing live-bound "views" based on
other CanJS data structures -- for example, maintaining a transformed array
based on some source array that maps/filters the original data and is
automatically updated whenever the source array changes.

`can.dataview` is
[hosted at Github](http://github.com/zkat/can.dataview). `can.dataview` is a
public domain work, dedicated using
[CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/). Feel free to do
whatever you want with it.

# Quickstart

### Install

`$ npm install can.dataview`
or
`$ bower install can.dataview`

Prebuilt releases are included in `dist`. These expect `CanJS` to be either
globally loaded, or available through `CommonJS` or `AMD` modules.

# Documentation

### `can.List#toViewList(mapFn(data[, outputFn]))`
### `can.List#toViewStream(mapFn(data[, outputFn]))`
### `can.makeViewStreamFromStream(stream, mapFn)`
