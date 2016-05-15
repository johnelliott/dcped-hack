var redux = require('redux')
var vdom = require('virtual-dom')
var hyperx = require('hyperx')
var main = require('main-loop')

var reducer = require('./reducer')

// use browser native websockets
var socket = new WebSocket('ws://localhost:8080/websocket')
socket.addEventListener('connection', function(){console.log('io connection')});
socket.addEventListener('event', function(e){console.log('io event' + e)});
socket.addEventListener('disconnect', function(){console.log('io disconnect')});

socket.addEventListener('open', function open(ws) {
  this.send('something');
});

socket.addEventListener('message', function(message, flags) {
  // flags.binary will be set if a binary data is received.
  // flags.masked will be set if the data was masked.
  console.log('message', message)
  store.dispatch({ type: 'ADD', peds: message.data})
  store.dispatch({ type: 'INCREMENT', peds: message.data})
});

var hx = hyperx(vdom.h)
var store = redux.createStore(reducer)

var item = function (state) {
  //function onclick () {
  //  console.log('button clicked!')
  //}
  //<button onclick=${onclick}></button>
  return hx`<div><span>${JSON.stringify(state)}</span></div>`
}

var list = function (state) {
  return hx`<div><div>${state.count}</div><div>${state.peds.map(function (d) {return item(d)})}</div></div>`
}

var loop = main({ peds: [{}], count: 0 }, render, vdom)

document.body.appendChild(loop.target)

function render (state) {
  return list(state)
}

function update () {
  loop.update(store.getState())
}

store.subscribe(update)
