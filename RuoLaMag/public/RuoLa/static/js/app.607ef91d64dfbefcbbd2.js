webpackJsonp([1],{0:function(e,t){},EGi2:function(e,t){},NHnr:function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=s("Dd8w"),r=s.n(n),o=s("7+uW"),a=s("NYxO"),u=s("8+8L"),i=s("/ocq"),c=s("mvHQ"),S=s.n(c);o.default.use(a.a);var l=new a.a.Store({state:{user:{}},mutations:{changeUser:function(e,t){var s=r()({},t.user);e.user=s,f.setUserStorage(S()(e.user))},removeUser:function(e){e.user={},f.removeUserStorage()}},getters:{user:function(e){return e.user&&e.user.name?f.setUserStorage(S()(e.user)):"{}"==f.getUserStorage()&&f.removeUserStorage(),e.user}}}),f={setUserStorage:function(e){return sessionStorage.user=e,sessionStorage.user},getUserStorage:function(){return sessionStorage.user},removeUserStorage:function(){sessionStorage.removeItem("user")},checkLoginState:function(){return l.state.user.name},showTip:p,noLogonStatusCallBack:function(e){e.$store.commit("removeUser"),e.$router.push("/home"),p(e,"warning","YOUR LOGON STATUS EXPIRED! PLEASE LOGIN AGAIN!")}};function p(e,t,s){e.$message({message:s,type:t})}var d={};d.HOST="http://127.0.0.1:3001/service",d.SESSION_CONFIG_CROS={withCredentials:!0},d.REGFOREMAIL=/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;var v=d,h={name:"login",data:function(){return{}},methods:{getSession:function(){var e=this;this.$http.post(v.HOST+"/users/getSession",{},v.SESSION_CONFIG_CROS).then(function(t){var s=t.data;f.showTip(e,"success",S()(s))})},addSession:function(){var e=this;this.$http.post(v.HOST+"/users/addSession",{message:"123"},v.SESSION_CONFIG_CROS).then(function(t){f.showTip(e,"success","Successfully")})}}},g={render:function(){var e=this.$createElement,t=this._self._c||e;return t("div",[t("el-button",{attrs:{type:"primary"},on:{click:this.getSession}},[this._v("SHOW")]),this._v(" "),t("el-button",{attrs:{type:"primary"},on:{click:this.addSession}},[this._v("ADD")])],1)},staticRenderFns:[]};var m=s("VU/8")(h,g,!1,function(e){s("l7IT")},"data-v-1a470916",null).exports;s("VU/8")(null,null,!1,null,null,null).exports;o.default.use(i.a);var O=new i.a({routes:[{path:"/",component:m},{path:"/login",component:m},{path:"*",redirect:"/"}]}),U=s("zL8q"),_=s.n(U),E=(s("tvR6"),s("EGi2"),{render:function(){var e=this.$createElement,t=this._self._c||e;return t("div",{attrs:{id:"app"}},[t("router-view")],1)},staticRenderFns:[]});var I=s("VU/8")({name:"App",components:{}},E,!1,function(e){s("So1/")},"data-v-2a92e8ac",null).exports;o.default.config.productionTip=!1,o.default.use(u.a),o.default.use(_.a),o.default.use(a.a),new o.default(r()({el:"#app",store:l,router:O},I))},"So1/":function(e,t){},l7IT:function(e,t){},tvR6:function(e,t){}},["NHnr"]);