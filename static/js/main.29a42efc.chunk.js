(this["webpackJsonpwebradio-react"]=this["webpackJsonpwebradio-react"]||[]).push([[0],{14:function(t,e,a){t.exports=a(22)},19:function(t,e,a){},22:function(t,e,a){"use strict";a.r(e);var n=a(0),r=a.n(n),i=a(11),s=a.n(i),o=(a(19),a(2)),c=a(3),u=a(6),l=a(5),h=a(1),f=a.n(h),p=a(4),d=a(13),v=function(){function t(e){Object(o.a)(this,t),this.query=void 0,this.offset=0,this.results=[],this.query=e,void 0==this.query.limit&&(this.query.limit=20)}return Object(c.a)(t,[{key:"search",value:function(){var t=Object(p.a)(f.a.mark((function t(){var e,a,n,r;return f.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return a="".concat(g,"/stations/search?name=").concat(this.query.name,"&order=votes&reverse=true&limit=").concat(this.query.limit,"&offset=").concat(this.offset),t.next=3,fetch(a).then((function(t){return t.json()}));case 3:n=t.sent,r=n.map((function(t){return{name:t.name,id:t.stationuuid,tags:t.tags,country:t.country,language:t.language,icon:t.favicon,votes:t.votes}})),(e=this.results).push.apply(e,Object(d.a)(r));case 6:case"end":return t.stop()}}),t,this)})));return function(){return t.apply(this,arguments)}}()}]),t}();function m(t){return y.apply(this,arguments)}function y(){return(y=Object(p.a)(f.a.mark((function t(e){var a,n;return f.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return a="".concat(g,"/url/").concat(e.id),t.next=3,fetch(a).then((function(t){return t.json()}));case 3:if(!(n=t.sent)||!n.ok){t.next=8;break}return t.abrupt("return",n.url);case 8:return t.abrupt("return",void 0);case 9:case"end":return t.stop()}}),t)})))).apply(this,arguments)}var b,g="https://de1.api.radio-browser.info/json",S=function(t){Object(u.a)(a,t);var e=Object(l.a)(a);function a(){return Object(o.a)(this,a),e.apply(this,arguments)}return Object(c.a)(a,[{key:"render",value:function(){var t=this,e=this.props.stations;return e?e.map((function(e){return r.a.createElement("div",{onClick:function(){var a,n;return null===(a=t.props)||void 0===a||null===(n=a.onStationSelected)||void 0===n?void 0:n.call(a,e)},key:e.id},r.a.createElement("h3",null,e.name),r.a.createElement("div",null,e.country),r.a.createElement("hr",null))})):null}}]),a}(r.a.Component),k=function(t){Object(u.a)(a,t);var e=Object(l.a)(a);function a(t){var n;return Object(o.a)(this,a),(n=e.call(this,t)).searchTimer=void 0,n.searchList=void 0,n.state={search:b,searching:!1},n.searchList=r.a.createRef(),n}return Object(c.a)(a,[{key:"searchTextChanged",value:function(){var t=Object(p.a)(f.a.mark((function t(e){var a;return f.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:a=e.target.value,this.scheduleSearch(a);case 2:case"end":return t.stop()}}),t,this)})));return function(e){return t.apply(this,arguments)}}()},{key:"scheduleSearch",value:function(){var t=Object(p.a)(f.a.mark((function t(e){var a=this;return f.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:this.searchTimer=clearTimeout(this.searchTimer),this.searchTimer=setTimeout(Object(p.a)(f.a.mark((function t(){var n;return f.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return n=new v({name:e}),b=n,a.setState({searching:!0}),t.next=5,n.search();case 5:a.searchList.current&&(a.searchList.current.scrollTop=0),a.setState({search:n,searching:!1});case 7:case"end":return t.stop()}}),t)}))),400);case 2:case"end":return t.stop()}}),t,this)})));return function(e){return t.apply(this,arguments)}}()},{key:"render",value:function(){var t,e,a,n=this,i=this.state.search;i&&(a=i.results);var s=this.state.searching?r.a.createElement("span",{className:"loading"},"Searching..."):void 0;return r.a.createElement("div",{className:"search flexible vertical "+(null!==(t=this.props.className)&&void 0!==t?t:"")},r.a.createElement("div",{className:"flexible horizontal"},r.a.createElement("input",{className:"flex1",defaultValue:i?i.query.name:"",onInput:function(t){n.searchTextChanged(t)}}),s),r.a.createElement("div",{className:"results flexible vertical",style:{flex:1}},r.a.createElement("div",{ref:this.searchList,className:"scrollable"},r.a.createElement(S,{stations:a,onStationSelected:null===(e=this.props)||void 0===e?void 0:e.onStationSelected}))))}}]),a}(r.a.Component),E=a(9),O=a(12);function j(t){localStorage.setItem("lastPlayed",JSON.stringify(t))}var w=function(){function t(){Object(o.a)(this,t),this.player=void 0,this.station=void 0,this.statusEmitter=[],this.loading=void 0}return Object(c.a)(t,[{key:"setStation",value:function(){var t=Object(p.a)(f.a.mark((function t(e){return f.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return this.player&&(this.player.off(),this.player.stop(),this.player.unload()),this.fireStatusChange("load","station"),this.station=e,j(e),this.loading=this.loadPlayer(e),t.abrupt("return",this.loading);case 6:case"end":return t.stop()}}),t,this)})));return function(e){return t.apply(this,arguments)}}()},{key:"loadPlayer",value:function(){var t=Object(p.a)(f.a.mark((function t(e){var a,n=this;return f.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,m(e);case 2:(a=t.sent)?(this.player=new O.Howl({src:a,autoplay:!1,html5:!0,preload:!1}),this.fireStatusChange("stop"),this.player.on("load",(function(){return n.fireStatusChange("load","start playing")})),this.player.on("play",(function(){return n.fireStatusChange("play")})),this.player.on("stop",(function(){return n.fireStatusChange("stop")})),this.player.on("pause",(function(){return n.fireStatusChange("stop")})),this.player.on("loaderror",(function(){return n.fireStatusChange("error","loading the stream failed")})),this.player.on("playerror",(function(){return n.fireStatusChange("error","playback error")}))):this.fireStatusChange("error","cannot resolve station url"),this.loading=void 0;case 5:case"end":return t.stop()}}),t,this)})));return function(e){return t.apply(this,arguments)}}()},{key:"play",value:function(){var t=Object(p.a)(f.a.mark((function t(){return f.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(!this.loading){t.next=3;break}return t.next=3,this.loading;case 3:this.player&&("unloaded"==this.player.state()&&this.fireStatusChange("load","stream"),this.player.play());case 4:case"end":return t.stop()}}),t,this)})));return function(){return t.apply(this,arguments)}}()},{key:"pause",value:function(){var t;null===this||void 0===this||null===(t=this.player)||void 0===t||t.pause()}},{key:"fireStatusChange",value:function(t,e){var a,n=Object(E.a)(this.statusEmitter);try{for(n.s();!(a=n.n()).done;){(0,a.value)(t,e)}}catch(r){n.e(r)}finally{n.f()}}},{key:"onStatusChanged",value:function(t){return this.statusEmitter.push(t),t}},{key:"offStatusChanged",value:function(t){var e=this.statusEmitter.findIndex((function(e){return t==e}));e>=0&&this.statusEmitter.splice(e,1)}}]),t}(),x=new(function(){function t(){Object(o.a)(this,t),this.stations=[],this.updateCbs=[]}return Object(c.a)(t,[{key:"add",value:function(t){this.isFavorite(t)||(this.stations.push(t),this.save())}},{key:"remove",value:function(t){var e=this.stations.findIndex((function(e){return e.id==t.id}));e>=0&&(this.stations.splice(e,1),this.save())}},{key:"isFavorite",value:function(t){return void 0!=this.stations.find((function(e){return e.id==t.id}))}},{key:"save",value:function(){localStorage.setItem("stations",JSON.stringify(this.stations)),this.changed()}},{key:"load",value:function(){var t=localStorage.getItem("stations");t&&(this.stations=JSON.parse(t),this.changed())}},{key:"onUpdated",value:function(t){return this.updateCbs.push(t),t}},{key:"changed",value:function(){var t,e=Object(E.a)(this.updateCbs);try{for(e.s();!(t=e.n()).done;){(0,t.value)()}}catch(a){e.e(a)}finally{e.f()}}},{key:"list",get:function(){return this.stations}}]),t}()),C=new w,N=function(t){Object(u.a)(a,t);var e=Object(l.a)(a);function a(){var t;Object(o.a)(this,a);for(var n=arguments.length,r=new Array(n),i=0;i<n;i++)r[i]=arguments[i];return(t=e.call.apply(e,[this].concat(r))).state={status:"stop"},t.statusChangeId=void 0,t}return Object(c.a)(a,[{key:"componentDidMount",value:function(){var t=this;this.statusChangeId=C.onStatusChanged((function(e,a){var n;C.station&&(null===(n=t.props.station)||void 0===n?void 0:n.id)==C.station.id&&t.setState({status:e,detail:a})}))}},{key:"componentWillUnmount",value:function(){this.statusChangeId&&C.offStatusChanged(this.statusChangeId)}},{key:"togglePlayback",value:function(){var t=Object(p.a)(f.a.mark((function t(){var e;return f.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(this.props.station){t.next=2;break}return t.abrupt("return");case 2:if("play"==this.getPlayStatus()){t.next=10;break}if((null===(e=C.station)||void 0===e?void 0:e.id)==this.props.station.id){t.next=7;break}return t.next=7,C.setStation(this.props.station);case 7:C.play(),t.next=11;break;case 10:C.pause();case 11:case"end":return t.stop()}}),t,this)})));return function(){return t.apply(this,arguments)}}()},{key:"getPlayStatus",value:function(){var t,e=this.state.status;return this.props.station&&this.props.station.id!=(null===(t=C.station)||void 0===t?void 0:t.id)&&(e="stop"),e}},{key:"toggleFavorite",value:function(){var t=this.props.station;t&&(x.isFavorite(t)?x.remove(t):x.add(t),this.setState({}))}},{key:"render",value:function(){var t,e,a=this,n=this.props.station;if(!n)return null;var i,s=this.getPlayStatus(),o=null!==(e={play:"Stop",stop:"Play",load:"Loading",error:"Error ".concat(null!==(t=this.state.detail)&&void 0!==t?t:"")}[s])&&void 0!==e?e:"Error";return this.state.detail&&(i=r.a.createElement("span",null,this.state.detail)),r.a.createElement("div",{className:this.props.className},r.a.createElement("h2",null,n.name),r.a.createElement("p",null,"in: ",n.country),r.a.createElement("p",null,"tags: ",n.tags),r.a.createElement("div",null,r.a.createElement("button",{onClick:function(t){return a.togglePlayback()}},o)," ",i),r.a.createElement("div",null,r.a.createElement("button",{onClick:function(){return a.toggleFavorite()}},x.isFavorite(n)?"Remove from favorites":"Add to favorites"),r.a.createElement("button",null,"Vote!")))}}]),a}(r.a.Component),T=function(t){Object(u.a)(a,t);var e=Object(l.a)(a);function a(){return Object(o.a)(this,a),e.apply(this,arguments)}return Object(c.a)(a,[{key:"render",value:function(){return r.a.createElement("div",{className:"about "+this.props.className},r.a.createElement("h2",null,"About"),r.a.createElement("p",null,"Open source webradio implementation using React."),r.a.createElement("p",null,"Uses the api provided by ",r.a.createElement("a",{href:"http://www.radio-browser.info"},"http://www.radio-browser.info")),r.a.createElement("p",null,"If you find any issues, or have feature requests please report them at the project's github page: ",r.a.createElement("a",{href:"https://github.com/bxantus/webradio"},"https://github.com/bxantus/webradio")))}}]),a}(r.a.Component),I=function(t){Object(u.a)(a,t);var e=Object(l.a)(a);function a(t){var n;return Object(o.a)(this,a),(n=e.call(this,t)).state={selectedTab:"Search"},x.load(),n}return Object(c.a)(a,[{key:"componentDidMount",value:function(){var t=this;x.onUpdated((function(){t.setState({})}));var e=function(){var t=localStorage.getItem("lastPlayed");if(t)return JSON.parse(t)}();e&&(C.setStation(e),this.stationSelected(e))}},{key:"changeTab",value:function(t){var e=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];this.setState({selectedTab:t.title}),e&&this.setState({selectedStation:C.station})}},{key:"stationSelected",value:function(t){this.setState({selectedStation:t}),this.changeTab(this.tabs[2],!1)}},{key:"render",value:function(){var t=this,e=this.tabs,a=this.state.selectedTab,n=e.find((function(t){return t.title===a})),i=e.map((function(e){return r.a.createElement("span",{className:e===n?"tab selected":"tab",key:e.title,onClick:function(a){return t.changeTab(e)}},e.title)})),s=e.map((function(t){return t.content(t==n?"visible":"hidden")}));return r.a.createElement("div",{className:"radio-App flexible vertical"},r.a.createElement("div",{className:"tabs"},i),s)}},{key:"tabs",get:function(){var t=this;return[{title:"Search",content:function(e){return r.a.createElement(k,{className:e,onStationSelected:function(e){return t.stationSelected(e)}},"Search content")}},{title:"Favorites",content:function(e){return r.a.createElement("div",{className:e},r.a.createElement(S,{stations:x.list,onStationSelected:function(e){return t.stationSelected(e)}}))}},{title:"Play",content:function(e){return r.a.createElement(N,{className:e,station:t.state.selectedStation})}},{title:"About",content:function(t){return r.a.createElement(T,{className:t})}}]}}]),a}(r.a.Component);s.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(I,null,"my text")),document.getElementById("root"))}},[[14,1,2]]]);
//# sourceMappingURL=main.29a42efc.chunk.js.map