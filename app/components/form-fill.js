import Ember from 'ember';
var inputs=[{
  name:'score',
  label:'Credit Score',
  value:700,
  min:0,
  max:900
},{
  name:'balance',
  label:'Loan Amount',
  value:10000,
  min:0,
  max:10000000
},{
  name:'collateral',
  label:'Collateral Value',
  value:12000,
  min:0,
  max:10000000
},{
  name:'income',
  label:'Available income (monthly)',
  value:1000,
  min:0,
  max:10000000
},
{
  name:'term',
  label:'Years to maturity',
  value:5,
  min:0,
  max:60
}];
export default Ember.Component.extend({
  //tagName:'form',
  socketService:Ember.inject.service('websockets'),
  socketRef:null,
  url:'',
  PD:'',
  LGD:'',
  M:'',
  LIQ:'',
  showChart:'',
  chartOptions: {
    chart: {
        type: 'bar',
        height:50
    },
    credit:{
      enabled:false
    },
    legend:{
      enabled:false
    },
    plotOptions:{
      bar:{
           //color:'#000',
           shadow:false,
           borderWidth:0,
           edgeWidth:0,
           color:'#3F51B5'
       }
    },
    xAxis:{
      labels:{
        enabled:false
      },
      title: {
        enabled: false
      },
      lineWidth:0,
      tickWidth:0,
      gridLineWidth: 0,
      /*min:0,
      max:100*/
    },
    yAxis:{
      plotBands:[
        {from:0,to:25,color: '#00C853'},//very green
        {from:25,to:50,color: '#CDDC39'},
        {from:50,to:70,color: '#FFC107'},
        {from:70,to:85,color: '#D500F9'},
        {from:85,to:100,color: '#b71c1c'} //very red
      ],
      title: {
        enabled: false
      },
      labels:{
        enabled:false
      },
      gridLineWidth: 0,
      lineWidth:0,
      tickWidth:0,
      min:0,
      max:100
    },
    title: {
      text: ''
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
    //var series=[{/*color:'#c1c1c1',*/ pointStart:data.xmin, pointInterval:data.dx, data:data.y}];
    var key='';
    for(key in data){
      this.set(key, [{name:key, data:[data[key]]}]);
    }
    //this.set('chartData', series);
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
