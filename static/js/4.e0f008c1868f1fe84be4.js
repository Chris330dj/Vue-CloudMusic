webpackJsonp([4],{Qu3F:function(t,s){},"qP2/":function(t,s,e){"use strict";Object.defineProperty(s,"__esModule",{value:!0});var i=e("Dd8w"),n=e.n(i),a=e("AyDw"),r=e("qwAB"),c=e("ZV4u"),l=e("tRvw"),o=e("NYxO"),u=e("F4+m"),v=e("PvFA"),h={mixins:[u.b,u.a],data:function(){return{switches:[{name:"我喜欢的"},{name:"最近播放"}],currentIndex:0}},computed:n()({noResult:function(){return 0===this.currentIndex?!this.favoriteList.length:!this.playHistory.length},noResultDesc:function(){return 0===this.currentIndex?"快去发掘你喜欢的歌曲吧~！":"快去听歌吧~！"}},Object(o.c)(["playHistory","favoriteList"])),methods:n()({switchItem:function(t){this.currentIndex=t},selectSong:function(t){this.insertSong(new v.b(t))},play:function(){var t=0===this.currentIndex?this.favoriteList:this.playHistory;0!==t.length&&(t=t.map(function(t){return new v.b(t)}),this.sequencePlay({list:t}))},handlePlayList:function(t){var s=t.length>0?"60px":"";this.$refs.listWrapper.style.bottom=s,this.$refs.favoriteList&&this.$refs.favoriteList.refresh(),this.$refs.playList&&this.$refs.playList.refresh()},back:function(){this.$router.back()}},Object(o.b)(["sequencePlay","insertSong"])),components:{Switches:a.a,Scroll:r.a,SongList:c.a,NoResult:l.a}},d={render:function(){var t=this,s=t.$createElement,e=t._self._c||s;return e("transition",{attrs:{name:"slide"}},[e("div",{staticClass:"user-center"},[e("div",{staticClass:"header"},[e("div",{staticClass:"back",on:{click:t.back}},[e("i",{staticClass:"icon-back"})]),t._v(" "),e("p",{staticClass:"text"},[t._v("用户中心")])]),t._v(" "),e("div",{staticClass:"switches-wrapper"},[e("switches",{attrs:{currentIndex:t.currentIndex,switches:t.switches},on:{switch:t.switchItem}})],1),t._v(" "),e("div",{staticClass:"playBtn",on:{click:t.play}},[e("i",{staticClass:"icon-play"}),t._v(" "),e("span",{staticClass:"text"},[t._v("播放全部")])]),t._v(" "),e("div",{ref:"listWrapper",staticClass:"list-wrapper"},[0===t.currentIndex?e("scroll",{ref:"favoriteList",staticClass:"list-scroll",attrs:{data:t.favoriteList}},[e("div",{staticClass:"list-inner"},[e("song-list",{attrs:{songs:t.favoriteList},on:{select:t.selectSong}})],1)]):t._e(),t._v(" "),1===t.currentIndex?e("scroll",{ref:"playList",staticClass:"list-scroll",attrs:{data:t.playHistory}},[e("div",{staticClass:"list-inner"},[e("song-list",{attrs:{songs:t.playHistory},on:{select:t.selectSong}})],1)]):t._e()],1),t._v(" "),e("div",{directives:[{name:"show",rawName:"v-show",value:t.noResult,expression:"noResult"}],staticClass:"no-result-wrapper"},[e("no-result",{attrs:{title:t.noResultDesc}})],1)])])},staticRenderFns:[]};var f=e("VU/8")(h,d,!1,function(t){e("Qu3F")},"data-v-76c0d975",null);s.default=f.exports}});
//# sourceMappingURL=4.e0f008c1868f1fe84be4.js.map