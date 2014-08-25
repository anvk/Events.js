# Events v0.1.3

> Tiny 1.5KB library which allows you to add an event based communication for your components.

## API

#### on(eventName, callback);

> Will add a listener to the event queue. Return value is an object which contains **remove()** method for the listener and its **token**.

#### once(eventName, callback);

> Will add a listener to the event queue. Listener will be fired only once and then removed from the queue. Return value is an object which contains **remove()** method for the listener and its **token**.

#### emit(eventName, args);

> Will trigger listeners attached to the event. Args is an array of arguments passed into listeners.

#### removeListener(eventName, token);

> Will remove listener with a specified token from the event queue.

#### removeListeners(eventName);

> Will remove any listener in the queue awaiting for event with eventName.


## Quick Start

```javascript
var events = new utils.Events();

var callback1 = function() {...};
var callback2 = function(arg1, arg2) {...};

events.on('event A', callback1);
events.on('event B', callback2);

events.emit('event A');
events.emit('event B', [var1, var2]);
```

## Release History

* 2014-08-25   v0.1.3   Fixed infinite loop error when invoking once(). Ensured once() and on() are triggered the right number of times.
* 2014-07-25   v0.1.2   Better error handling on some methods. Added more comprehensive tests.
* 2014-07-22   v0.1.1   Added tests. Refactored library to work based on tokens assigned to each listener
* 2014-07-21   v0.1.0   First working version of a library based on the Abdul's work

## License
The MIT License (MIT)

Copyright (c) 2014 Abdul Khan, Alexey Novak

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
