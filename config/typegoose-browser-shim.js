'use strict'

Object.defineProperty(exports, '__esModule', {value: true})
exports.dummyValue = ''

function dummyFn() {
}

exports.dummyFn = dummyFn

function dummyDecorator() {
  return dummyFn
}

exports.dummyDecorator = dummyDecorator
exports.prop = dummyDecorator
exports.arrayProp = dummyDecorator
exports.getModelForClass = dummyFn