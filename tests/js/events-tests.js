(function(expect) {
  describe('Events tests', function() {
    var func1 = function() { return '1'; },
        func2 = function() { return '2'; },
        func3 = function() { return '3'; },
        events;

    beforeEach(function() {
      events = new utils.Events();
    });

    describe('on', function() {
      it('regular call', function() {

        expect(events._queues).to.deep.equal({});

        events.on('eventA', func1);

        expect(events._queues).to.deep.equal({
          'eventA': [
            {
              callback: func1,
              once: false
            }
          ]
        });

        events.on('eventA', func2);

        expect(events._queues).to.deep.equal({
          'eventA': [
            {
              callback: func1,
              once: false
            },
            {
              callback: func2,
              once: false
            }
          ]
        });

        events.on('eventA', func1);

        expect(events._queues).to.deep.equal({
          'eventA': [
            {
              callback: func1,
              once: false
            },
            {
              callback: func2,
              once: false
            },
            {
              callback: func1,
              once: false
            }
          ]
        });

        events.on('eventB', func3);

        expect(events._queues).to.deep.equal({
          'eventA': [
            {
              callback: func1,
              once: false
            },
            {
              callback: func2,
              once: false
            },
            {
              callback: func1,
              once: false
            }
          ],
          'eventB': [
            {
              callback: func3,
              once: false
            }
          ]
        });

      });
    });

    describe('once', function() {

    });

    describe('emit', function() {

    });

    describe('removeListener', function() {

      it('a listener in a row of listeners', function() {
        events.on('eventA', func1);
        events.on('eventA', func2);
        events.on('eventB', func3);

        expect(events._queues['eventA'].length).to.equal(2);

        events.removeListener('eventA', func1);

        expect(events._queues['eventA'].length).to.equal(1);

        expect(events._queues['eventA']).to.deep.equal([
          {
            callback: func2,
            once: false
          }
        ]);
      });

      it('only 1 listener in a queue', function() {
        events.on('eventA', func1);
        events.on('eventA', func2);
        events.on('eventB', func3);

        expect(events._queues['eventA'].length).to.equal(2);

        events.removeListener('eventB', func3);

        expect(events._queues['eventB']).to.be.undefined;
      });

      it('non-existing listener', function() {
        events.on('eventA', func1);
        events.on('eventA', func2);
        events.on('eventB', func3);

        expect(events._queues['eventA'].length).to.equal(2);

        events.removeListener('eventB', func1);

        expect(events._queues['eventB'].length).to.equal(1);

        expect(events._queues['eventB']).to.deep.equal([
          {
            callback: func3,
            once: false
          }
        ]);
      });

    });

    describe('removeListeners', function() {

      it('non-existing queue in empty Events object', function() {
        events.removeListeners('eventA');

        expect(events._queues).to.deep.equal({});
      });

      it('non-existing queue in non-empty Events object', function() {

        events.on('eventA', func1);

        events.removeListeners('eventB');

        expect(events._queues).to.deep.equal({
          'eventA': [
            {
              callback: func1,
              once: false
            }
          ]
        });
      });

      it('full queue', function() {

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
              once: false
            }
          ]
        });
      });
    });

  });
})(chai.expect);