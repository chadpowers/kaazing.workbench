/**
 * Created by pkhanal on 4/7/15.
 */

(function(global){

    var Kaazing = Kaazing || {};
    var Messaging = {};
    Kaazing.Messaging = Messaging;
    global.Kaazing = Kaazing;

    Messaging.newContext = function(providerUrl) {

        var _resolve, _reject;

        var contextPromise = new Promise(function(resolve, reject) {
            _resolve = resolve;
            _reject = reject;
        });

        try {
            var connectionFactory = new JmsConnectionFactory(providerUrl);
            var connectFuture = connectionFactory.createConnection(function() {
                // Tracer.setTrace(true);
                if (!connectFuture.exception) {
                    var internalConnection = connectFuture.getValue();
                    var session = internalConnection.createSession(false, Session.AUTO_ACKNOWLEDGE);
                    internalConnection.start(function() {
                        var context = new Messaging.Context(internalConnection, session);
                        _resolve(context);
                    });
                }
                else {
                    _reject(connectFuture.exception);
                }
            });
        }
        catch (error) {
            setTimeout(function(){
                _reject(error);
            }, 0);
        }
        finally {
            return contextPromise;
        }
    };

    var ObserverWrapper = (function(){
        var wrapper = function(session, channel) {
            this._session = session;
            var $this = this;
            this._observer = Rx.Observer.create(function(message){
                onNext(message, $this);
            }, function(error) {
                onError(error, $this);
            }, function() {
                onCompleted($this);
            });

            var destination = session.createTopic("/topic/" + channel);
            this._producer = session.createProducer(destination);
            this._messageQueue = [];
            this._sending = false;
        }

        function sendMessage(message, $this) {
            $this._sending = true;
            var sendFuture = $this._producer.send(message, function() {
               if (sendFuture.exception) {
                   // TODO: dispose observer?
               }
               else {
                   if ($this._messageQueue.length > 0) {
                       setTimeout(function() {
                           sendMessage($this._messageQueue.pop(), $this);
                       }, 0);
                   }
                   else {
                       $this._sending = false;
                   }
               }
            });
        }

        function onNext(message, $this) {
            // Send Text Message
            var textMessage = $this._session.createTextMessage(message);
            if ($this._sending) {
                $this._messageQueue.push(textMessage);
            }
            else {
                sendMessage(textMessage, $this);
            }
        }

        function onError(error, $this) {
            $this._producer.close();
        }

        function onCompleted($this) {
            $this._producer.close();
        }

        var $prototype = wrapper.prototype;

        $prototype.getObserver = function() {
            return this._observer;
        };

        $prototype.dispose = function() {
            this._observer.dispose();
        }

        return wrapper;

    })();

    var ObservableWrapper = (function(){

        var observableWrapper = function(session, channel) {
            this._channel = channel;
            this._session = session;
            this._observers = [];
            this._consumer = null;
            var $this = this;
            this._observable = Rx.Observable.createWithDisposable(function(observer){
                console.log("observer added");
                var $observer = observer;
                $this.attachObserver($observer);

                return Rx.Disposable.create(function () {
                    console.log('observer disposed');
                    $this.detachObserver($observer);
                });
            });
        }

        function createConsumer($this) {
            var topic = $this._session.createTopic("/topic/" + $this._channel);
            var consumer = $this._session.createConsumer(topic);
            consumer.setMessageListener(function(message) {
                if (message instanceof TextMessage) {
                    dispatchMessage(message.getText(), $this);
                }
                else if (message instanceof MapMessage) {
                    var keys = message.getMapNames();
                    var messageObj = {};
                    for (var i=0; i<keys.length; i++) {
                        var key = keys[i];
                        messageObj[key] = message.getObject(key);
                    }
                    dispatchMessage(JSON.stringify(messageObj), $this);
                }
            });
        }

        function dispatchMessage(message, $this) {
            for (var i = 0; i < $this._observers.length; i++) {
                $this._observers[i].onNext(message);
            }
        }

        var $prototype = observableWrapper.prototype;

        $prototype.getObservable = function() {
            return this._observable;
        }

        $prototype.attachObserver = function(observer) {
            this._observers.push(observer);
            if (this._observers.length == 1) {
                createConsumer(this);
            }
        }

        $prototype.detachObserver = function(observer) {
            var index = this._observers.indexOf(observer);
            if (index > -1) {
                this._observers.splice(index, 1);

                if (this._observers.length == 0) {
                    this._consumer.close(null);
                }
            }
        }

        $prototype.handleError = function(error) {
            this._observers.slice().forEach(function(observer) {
               observer.handleError(error);
            });
        }

        $prototype.dispose = function() {
            this._observers.slice().forEach(function(observer) {
                observer.dispose();
            });
        }

        return observableWrapper;

    })();

    Messaging.Context = (function(){
        var context = function(connection, session) {
            this._connection = connection;
            this._session = session;
            this._producers = [];
            this._consumers = [];
            this._connection.setExceptionListener(function(error) {
                if (error.getType() == "ConnectionDroppedException" ||
                    error.getType() == "ConnectionInterruptedException" ||
                    error.getType() == "ReconnectFailedException" ||
                    error.getType() == "ConnectionRestoredException" ||
                    error.getMessage().indexOf("Message acknowledgement did not receive receipt") > -1) {
                    // Do nothing
                    // Client library is internally trying to reconnect/restore connection
                }
                else {
                    this._consumers.foreach(function(consumer) {
                       consumer.handleError(error);
                    });

                    disposeConsumers();

                    disposeProducers();
                }
            });
        }

        function disposeProducers() {
            var producer;
            while (producer = this._producers.shift()) {
                producer.dispose();
            }
        }

        function disposeConsumers() {
            var consumer;
            while (consumer = this._consumers.shift()) {
                consumer.dispose();
            }
        }

        var $prototype = context.prototype;

        $prototype.newPublisher = function(channel) {
            var _resolve, _reject;

            var promise = new Promise(function(resolve, reject) {
                _resolve = resolve;
                _reject = reject;
            });

            var observerWrapper = new ObserverWrapper(this._session, channel);
            this._producers.push(observerWrapper);
            setTimeout(function() {
                _resolve(observerWrapper.getObserver());
            }, 0);
            return promise;
        };

        $prototype.newSubscriber = function(channel) {
            var _resolve, _reject;

            var promise = new Promise(function(resolve, reject) {
                _resolve = resolve;
                _reject = reject;
            });

            var observableWrapper = new ObservableWrapper(this._session, channel);
            this._consumers.push(observableWrapper);
            var observable = observableWrapper.getObservable();
            setTimeout(function() {
                _resolve(observable);
            }, 0);
            return promise;
        };

        $prototype.dispose = function() {
            var _resolve, _reject;

            var closePromise = new Promise(function(resolve, reject) {
                _resolve = resolve;
                _reject = reject;
            });

            try {
                disposeProducers();
                disposeConsumers();
                this._connection.close(function() {
                    _resolve();
                });
            }
            catch (error) {
                setTimeout(function(){
                    _reject(error);
                }, 0);
            }

            return closePromise;
        }

        return context;

    })();
})(window);