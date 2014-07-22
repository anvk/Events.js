// MIT licensed, Written by Abdul Khan and Alexey Novak, 2014

var utils = utils || {};

// Publish/Subscribe pattern adapted from http://davidwalsh.name/pubsub-javascript
(function() {

  utils.Events = function() {
    this._init = this._init.bind(this);

    this.on = this.on.bind(this);
    this.emit = this.emit.bind(this);
    this.removeListener = this.removeListener.bind(this);
    this.removeListeners = this.removeListeners.bind(this);

    this._init();
  };

  utils.Events.prototype = {
    _init: function Events__init() {
      this._queues = {};
    },
    _addListener: function Events__addListener(eventName, callback, once) {
      // Create the queue for an event if does not exist yet
      if (!this._queues[eventName]) {
        this._queues[eventName] = [];
      }

      // Add the listener to queue
      var index = this._queues[eventName].push({
        callback: callback,
        once: once
      }) - 1;

      // Provide handle back for removal of the listener
      return {
        remove: function() {
          delete this._queues[eventName][index];
        }.bind(this)
      };
    },
    on: function Events_subscribe(eventName, callback) {
      return this._addListener(eventName, callback, false);
    },
    once: function Events_once(eventName, callback) {
      return this._addListener(eventName, callback, true);
    },
    emit: function Events_publish(eventName, args) {
      // If the eventName doesn't exist, or there's no listeners in queue, just leave
      if (!this._queues[eventName] || !this._queues[eventName].length) {
        return;
      }

      // Cycle through event's queue and fire
      var items = this._queues[eventName],
          len = items.length;
      for (var i = 0; i < len; i++) {
        var listener = items[i];

        if (typeof listener.callback == 'function') {
          listener.callback.apply(undefined, args || []);

          // if it is a one time listener then it will remove itself after firing an event
          if (listener.once) {
            items.splice(i, 1);
            len--;
          }
        }
      }

      if (!items.length) {
        delete this._queues[eventName];
      }
    },
    removeListener: function Events_removeListener(eventName, callback) {
      // If the eventName doesn't exist, or there's no listeners in queue, just leave
      if (!this._queues[eventName] || !this._queues[eventName].length) {
        return;
      }

      // Cycle through event's queue and remove matching functions
      var items = this._queues[eventName],
          len = items.length;
      for (var i = 0; i < len; i++) {
        if (items[i].callback.toString() == callback.toString()) {
          items.splice(i, 1);
          len--;
        }
      }

      if (!items.length) {
        delete this._queues[eventName];
      }
    },
    removeListeners: function Events_removeListeners(eventName) {
      delete this._queues[eventName];
    },
    _queues: null
  };

})();