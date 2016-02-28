import Ember from 'ember';

export default Ember.Component.extend({
  tagName:'div',
  //classNames:[]
  socketService:Ember.inject.service('websockets'),
  socketRef:null,
  url:'',
  willRender(){
    const socket=this.get('socketService').socketFor(this.get('url'));
    socket.on('open', this.myOpenHandler, this);
    socket.on('message', this.myMessageHandler, this);
    socket.on('close', this.myCloseHandler, this);
    this.set('socketRef', socket);
  },
  willDestroyElement() {
    const socket = this.get('socketRef');
    socket.off('open', this.myOpenHandler);
    socket.off('message', this.myMessageHandler);
    socket.off('close', this.myCloseHandler);
  },
  myOpenHandler(event) {
    console.log(`On open event has been called: ${event}`);
  },
  myMessageHandler(event) {
    console.log(`Message: ${event.data}`);
  },
  myCloseHandler(event) {
    console.log(`On close event has been called: ${event}`);
  },
  /*actions: {
    sendMessage(message) {
      console.log(message);
      //const socket = this.get('socketRef');
      //socket.send(message);
    }
  }*/
});
