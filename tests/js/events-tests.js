(function(expect) {
  describe('Events tests', function() {
    var func1 = function() { return '1'; },
        func2 = function() { return '2'; },
        func3 = function() { return '3'; },
        events;

    beforeEach(function() {
      events = new utils.Events();
    });

    var _generateTokenStub = function() {
      return '11111111-2222-3333-4444-555555555555';
    };

    describe('_generateToken()', function() {
      it('checking string', function() {
        var re = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        expect(events._generateToken().match(re)).to.be.true;
      });
    });

    describe('_addListener()', function() {

      it('regular call', function() {
        events._generateToken = _generateTokenStub;

        expect(events._queues).to.deep.equal({});

        events._addListener('eventA', func1, false);

        expect(events._queues).to.deep.equal({
          'eventA': [
            {
              callback: func1,
              once: false,
              increment: 0,
              token: '11111111-2222-3333-4444-555555555555'
            }
          ]
        });

        events._addListener('eventA', func2, false);

        expect(events._queues).to.deep.equal({
          'eventA': [
            {
              callback: func1,
              once: false,
              increment: 0,
              token: '11111111-2222-3333-4444-555555555555'
            },
            {
              callback: func2,
              once: false,
              increment: 0,
              token: '11111111-2222-3333-4444-555555555555'
            }
          ]
        });

        events._addListener('eventA', func1, true);

        expect(events._queues).to.deep.equal({
          'eventA': [
            {
              callback: func1,
              once: false,
              increment: 0,
              token: '11111111-2222-3333-4444-555555555555'
            },
            {
              callback: func2,
              once: false,
              increment: 0,
              token: '11111111-2222-3333-4444-555555555555'
            },
            {
              callback: func1,
              once: true,
              increment: 0,
              token: '11111111-2222-3333-4444-555555555555'
            }
          ]
        });

        events._addListener('eventB', func3, false);

        expect(events._queues).to.deep.equal({
          'eventA': [
            {
              callback: func1,
              once: false,
              increment: 0,
              token: '11111111-2222-3333-4444-555555555555'
            },
            {
              callback: func2,
              once: false,
              increment: 0,
              token: '11111111-2222-3333-4444-555555555555'
            },
            {
              callback: func1,
              once: true,
              increment: 0,
              token: '11111111-2222-3333-4444-555555555555'
            }
          ],
          'eventB': [
            {
              callback: func3,
              once: false,
              increment: 0,
              token: '11111111-2222-3333-4444-555555555555'
            }
          ]
        });
      });

      it('removal of the freshly created listener', function() {
        events._queues['eventA'] = [
          {
            callback: func1,
            once: false,
            increment: 0,
            token: '11111111-2222-3333-xxxx-555555555555'
          }
        ];

        var listener = events._addListener('eventA', func1);

        expect(events._queues['eventA'].length).to.equal(2);

        listener.remove();

        expect(events._queues['eventA'].length).to.equal(1);
      });

      it('removal of the freshly created listener in empty queue', function() {
        events._generateToken = _generateTokenStub;

        var listener = events._addListener('eventA', func1);

        expect(events._queues['eventA'].length).to.equal(1);
        expect(listener.token).to.equal('11111111-2222-3333-4444-555555555555');

        listener.remove();

        expect(events._queues['eventA']).to.be.undefined;
      });

    });

    describe('on() & once()', function() {

      var test = function(oneTimeListener) {
        var testIndex = 0;

        events._addListener = function(var1, var2, flag) {
          expect(flag).to.equal(oneTimeListener);
          testIndex++;
        };

        events[oneTimeListener ? 'once' : 'on']('eventA', func1);

        expect(testIndex).to.equal(1);
      };

      it('on', function() {
        test(false);
      });

      it('once', function() {
        test(true);
      });
    });

    describe('emit()', function() {
      var func1 = function() { testIndex++; },
          func2 = function() { testIndex++; },
          func3 = function() { testIndex++; },
          testIndex;

      var func4 = function(arg1, arg2, arg3) {
        expect(arg1 + arg2).to.equal(arg3);
        testIndex++;
      };

      beforeEach(function() {
        testIndex = 0;

        events._queues = {
          'eventA': [
            {
              callback: func1,
              once: false,
              increment: 1,
              token: '11111111-2222-3333-xxxx-555555555555'
            },
            {
              callback: func2,
              once: false,
              increment: 0,
              token: '11111111-2222-3333-yyyy-555555555555'
            },
            {
              callback: func1,
              once: false,
              increment: 1,
              token: '11111111-2222-3333-zzzz-555555555555'
            }
          ],
          'eventB': [
            {
              callback: func1,
              once: true,
              increment: 0,
              token: '11111111-2222-3333-aaaa-555555555555'
            }
          ],
          'eventC': [
            {
              callback: func4,
              once: false,
              increment: 0,
              token: '11111111-2222-3333-wwww-555555555555'
            }
          ]
        };
      });

      it('regular event', function() {
        events.emit('eventA');

        expect(events._queues['eventA']).to.deep.equal([
          {
            callback: func1,
            once: false,
            increment: 2,
            token: '11111111-2222-3333-xxxx-555555555555'
          },
          {
            callback: func2,
            once: false,
            increment: 1,
            token: '11111111-2222-3333-yyyy-555555555555'
          },
          {
            callback: func1,
            once: false,
            increment: 2,
            token: '11111111-2222-3333-zzzz-555555555555'
          }
        ]);

        expect(testIndex).to.equal(3);
      });

      it('non-existing event', function() {
        events.emit('eventX');

        expect(testIndex).to.equal(0);
      });

      it('event with one time listener', function() {
        events.emit('eventB');

        expect(events._queues['eventB']).to.be.undefined;

        expect(testIndex).to.equal(1);
      });

      it('event with arguments', function() {
        events.emit('eventC', [9, 1, 10]);

        expect(testIndex).to.equal(1);
      });
    });

    describe('removeListener()', function() {

      beforeEach(function() {
        events._queues = {
          'eventA': [
            {
              callback: func1,
              once: false,
              increment: 0,
              token: '11111111-2222-3333-xxxx-555555555555'
            },
            {
              callback: func2,
              once: false,
              increment: 0,
              token: '11111111-2222-3333-yyyy-555555555555'
            },
            {
              callback: func1,
              once: true,
              increment: 0,
              token: '11111111-2222-3333-zzzz-555555555555'
            }
          ],
          'eventB': [
            {
              callback: func1,
              once: false,
              increment: 0,
              token: '11111111-2222-3333-aaaa-555555555555'
            }
          ]
        };
      });

      it('a listener in a row of listeners', function() {
        expect(events._queues['eventA'].length).to.equal(3);

        events.removeListener('eventA', '11111111-2222-3333-yyyy-555555555555');

        expect(events._queues['eventA'].length).to.equal(2);

        expect(events._queues['eventA']).to.deep.equal([
          {
            callback: func1,
            once: false,
            increment: 0,
            token: '11111111-2222-3333-xxxx-555555555555'
          },
          {
            callback: func1,
            once: true,
            increment: 0,
            token: '11111111-2222-3333-zzzz-555555555555'
          }
        ]);
      });

      it('only 1 listener in a queue', function() {
        expect(events._queues['eventB'].length).to.equal(1);

        events.removeListener('eventB', '11111111-2222-3333-aaaa-555555555555');

        expect(events._queues['eventB']).to.be.undefined;
      });

      it('non-existing listener', function() {
        expect(events._queues['eventA'].length).to.equal(3);
        expect(events._queues['eventB'].length).to.equal(1);

        events.removeListener('eventB', 'Fraking cylons!');

        expect(events._queues['eventA'].length).to.equal(3);
        expect(events._queues['eventB'].length).to.equal(1);
      });

    });

    describe('removeListeners()', function() {

      it('non-existing queue in empty Events object', function() {
        events.removeListeners('eventA');

        expect(events._queues).to.deep.equal({});
      });

      it('non-existing queue in non-empty Events object', function() {
        events._generateToken = _generateTokenStub;
        events.on('eventA', func1);

        events.removeListeners('eventB');

        expect(events._queues).to.deep.equal({
          'eventA': [
            {
              callback: func1,
              once: false,
              increment: 0,
              token: '11111111-2222-3333-4444-555555555555'
            }
          ]
        });
      });

      it('full queue', function() {
        events._generateToken = _generateTokenStub;
        events.on('eventA', func1);
        events.on('eventA', func2);
        events.on('eventB', func3);

        expect(events._queues['eventA'].length).to.equal(2);

        events.removeListeners('eventA');

        expect(events._queues['eventA']).to.be.undefined;

        expect(events._queues).to.deep.equal({
          'eventB': [
            {
              callback: func3,
              once: false,
              increment: 0,
              token: '11111111-2222-3333-4444-555555555555'
            }
          ]
        });
      });
    });

  });
})(chai.expect);