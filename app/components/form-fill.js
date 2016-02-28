import Ember from 'ember';
var inputs=[{
  name:'t',
  label:'Time Horizon',
  value:1,
  min:0.02,
  max:5
},{
  name:'x0',
  label:'X0',
  value:1,
  min:0.5,
  max:5
},{
  name:'alpha',
  label:'Speed',
  value:0.4,
  min:0.001,
  max:0.9
},{
  name:'sigma',
  label:'Volatility',
  value:0.3,
  min:0.001,
  max:0.5
},{
  name:'lambda',
  label:'Lambda',
  value:100,
  min:1,
  max:200
},{
  name:'alphaStable',
  label:'Alpha',
  value:1.1,
  min:1,
  max:2
},{
  name:'muStable',
  label:'Shift (Stable)',
  value:1300,
  min:1,
  max:2000
},{
  name:'cStable',
  label:'Scale (Stable)',
  value:100,
  min:1,
  max:200
},{
  name:'rho',
  label:'Correlation',
  value:0.9,
  min:0,
  max:0.99
},{
  name:'numODE',
  label:'Steps in ODE',
  value:128,
  min:32,
  max:256
},{
  name:'xNum',
  label:'Steps in X',
  value:1024,
  min:128,
  max:1024
},{
  name:'uNum',
  label:'Steps in U',
  value:256,
  min:32,
  max:256
}];
export default Ember.Component.extend({
  //tagName:'form',
  socketService:Ember.inject.service('websockets'),
  socketRef:null,
  url:'',
  chartData:'',
  showChart:'',
  chartOptions: {
    chart: {
        type: 'line'
    },
    legend:{
      enabled:false
    },
    title: {
      text: 'Distribution of Operational Risk Losses'
    }
  },
  inputs:inputs,
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
    var data=JSON.parse(event.data);
    var series=[{/*color:'#c1c1c1',*/ pointStart:data.xmin, pointInterval:data.dx, data:data.y}];
    this.set('chartData', series);
    this.set('showChart', true);
    //console.log(`Message: ${event.data}`);
  },
  myCloseHandler(event) {
    console.log(`On close event has been called: ${event}`);
  },
  actions:{
    submitInputs(obj){
      //console.log(obj);
      const socket = this.get('socketRef');
      socket.send(obj, true); //true stringifys it
    },
    toggleChart(){
      this.set('showChart', false);
    }
  }


});
