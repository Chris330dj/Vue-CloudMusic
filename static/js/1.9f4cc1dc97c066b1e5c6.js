webpackJsonp([1],{"W1+L":function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var s=i("Dd8w"),n=i.n(s),r=i("GQaK"),a=i("3Q4o"),l={name:"slider",props:{loop:{type:Boolean,default:!0},autoPlay:{type:Boolean,default:!0},interval:{type:Number,default:4e3}},data:function(){return{currentPageIndex:0,dots:[]}},mounted:function(){var t=this;this.$nextTick(function(){t._setSliderWidth(),t._initSlider(),t._initDots(),t.autoPlay&&t._play()}),window.addEventListener("resize",function(){t.slider&&(t._setSliderWidth(!0),t.slider.refresh())})},activated:function(){this.autoPlay&&this._play()},deactivated:function(){clearTimeout(this.timer)},beforeDestroy:function(){clearTimeout(this.timer)},methods:{_setSliderWidth:function(t){this.children=this.$refs.sliderGroup.children;for(var e=0,i=this.$refs.slider.clientWidth,s=0;s<this.children.length;s++){var n=this.children[s];Object(a.a)(n,"slider-item"),n.style.width=i+"px",e+=i}this.loop&&!t&&(e+=2*i),this.$refs.sliderGroup.style.width=e+"px"},_initSlider:function(){var t=this;this.slider=new r.a(this.$refs.slider,{scrollX:!0,scrollY:!1,momentum:!1,snap:{loop:this.loop,threshold:.3,speed:400}}),this.slider.on("scrollEnd",function(){var e=t.slider.getCurrentPage().pageX;t.currentPageIndex=e,t.autoPlay&&(clearTimeout(t.timer),t._play())}),this.slider.on("beforeScrollStart",function(){t.autoPlay&&clearTimeout(t.timer)})},_play:function(){var t=this,e=this.currentPageIndex+1;e===this.children.length&&(e=0),this.timer=setTimeout(function(){t.slider.next()},this.interval)},_initDots:function(){this.dots=new Array(this.children.length)}}},c={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{ref:"slider",staticClass:"slider"},[i("div",{ref:"sliderGroup",staticClass:"slider-group"},[t._t("default")],2),t._v(" "),i("div",{staticClass:"dot-group"},t._l(t.dots,function(e,s){return i("span",{key:s,staticClass:"dot",class:{active:t.currentPageIndex===s}})}),0)])},staticRenderFns:[]};var o=i("VU/8")(l,c,!1,function(t){i("v7cg")},"data-v-04e2a004",null).exports,d=i("qwAB"),u=i("y/jF"),h=i("m40h"),v=i("T452"),f=i("F4+m"),m=i("NYxO"),p={mixins:[f.a],data:function(){return{banners:[],discList:[]}},components:{Slider:o,Scroll:d.a,Loading:u.a},created:function(){this._getBanner(),this._getDiscList()},methods:n()({handlePlayList:function(t){var e=t.length>0?"60px":"";this.$refs.recommend.style.bottom=e,this.$refs.scroll.refresh()},selectItem:function(t){this.$router.push({path:"/recommend/"+t.id}),this.setDisc(t)},_getBanner:function(){var t=this;Object(h.a)().then(function(e){e.status===v.a?t.banners=e.data.banners:console.error("Banner 获取失败")})},_getDiscList:function(){var t=this;Object(h.b)().then(function(e){e.status===v.a?t.discList=e.data.result:console.error("getRecommendList 获取失败")})}},Object(m.d)({setDisc:"SET_DISC"}))},_={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{ref:"recommend",staticClass:"recommend"},[i("scroll",{ref:"scroll",staticClass:"recommend-content"},[i("div",[t.banners.length?i("div",{staticClass:"decorate",attrs:{data:t.discList}}):t._e(),t._v(" "),t.banners.length?i("div",{ref:"sliderWrapper",staticClass:"slider-wrapper"},[i("slider",t._l(t.banners,function(t,e){return i("div",{key:e},[i("img",{attrs:{src:t.imageUrl}})])}),0)],1):t._e(),t._v(" "),i("div",{staticClass:"recommend-list"},[i("h1",{staticClass:"title"},[t._v("推荐歌单")]),t._v(" "),i("ul",t._l(t.discList,function(e){return i("li",{key:e.id,staticClass:"item",on:{click:function(i){return i.stopPropagation(),t.selectItem(e)}}},[i("div",{staticClass:"icon"},[i("div",{staticClass:"gradients"}),t._v(" "),i("img",{directives:[{name:"lazy",rawName:"v-lazy",value:e.picUrl,expression:"item.picUrl"}]})]),t._v(" "),i("div",{staticClass:"play-count"},[i("div",{staticClass:"music-icon"}),t._v("\n              "+t._s(Math.floor(e.playCount/1e4))+"万\n            ")]),t._v(" "),i("div",{staticClass:"text"},[i("p",{staticClass:"name"},[t._v(t._s(e.name))])])])}),0)])]),t._v(" "),i("div",{directives:[{name:"show",rawName:"v-show",value:!t.discList.length,expression:"!discList.length"}],staticClass:"loading-container"},[i("loading")],1)]),t._v(" "),i("router-view")],1)},staticRenderFns:[]};var g=i("VU/8")(p,_,!1,function(t){i("dCXy")},"data-v-34ccd1a7",null);e.default=g.exports},dCXy:function(t,e){},m40h:function(t,e,i){"use strict";e.a=function(){var t=r.b+"/banner";return n.a.get(t)},e.b=function(){var t=r.b+"/personalized";return n.a.get(t)},e.c=function(t){var e=r.b+"/playlist/detail?id="+t;return n.a.get(e)};var s=i("mtWM"),n=i.n(s),r=i("T452")},v7cg:function(t,e){}});
//# sourceMappingURL=1.9f4cc1dc97c066b1e5c6.js.map