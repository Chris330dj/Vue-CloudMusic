webpackJsonp([8],{ELjD:function(t,e){},YOyO:function(t,e,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=s("Dd8w"),a=s.n(r),c=s("2X+S"),i=s("6Xyt"),o=s("vhoT"),n=s("XEAW"),h=s("qwAB"),l=s("8stH"),u=s("T452"),f=s("NYxO"),v=s("F4+m"),d={mixins:[v.a,v.c],data:function(){return{hotSearch:[]}},computed:{shortcut:function(){return this.hotSearch.concat(this.searchHistory)}},watch:{query:function(t){var e=this;t||setTimeout(function(){e.$refs.shortcut.refresh()},20)}},created:function(){this._getHotSearch()},methods:a()({handlePlayList:function(t){var e=t.length>0?"60px":"";this.$refs.searchResult.style.bottom=e,this.$refs.suggest.refresh(),this.$refs.shortcutWrapper.style.bottom=e,this.$refs.shortcut.refresh()},showConfirm:function(){this.$refs.confirm.show()},_getHotSearch:function(){var t=this;Object(l.a)().then(function(e){e.status===u.a&&(t.hotSearch=e.data.result.hots)})}},Object(f.b)(["clearSearchHistory"])),components:{SearchBox:c.a,Suggest:i.a,SearchList:o.a,Confirm:n.a,Scroll:h.a}},y={render:function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"search"},[s("div",{staticClass:"search-box-wrapper"},[s("keep-alive",[s("search-box",{ref:"searchBox",on:{query:t.onQueryChange}})],1)],1),t._v(" "),s("div",{directives:[{name:"show",rawName:"v-show",value:!t.query.length,expression:"!query.length"}],ref:"shortcutWrapper",staticClass:"shortcut-wrapper"},[s("scroll",{ref:"shortcut",staticClass:"shortcut",attrs:{data:t.shortcut}},[s("div",[s("div",{staticClass:"hot-key"},[s("h1",{staticClass:"title"},[t._v("热门搜索")]),t._v(" "),s("ul",{staticClass:"hotKey-wrapper"},t._l(t.hotSearch,function(e,r){return s("li",{key:r,staticClass:"item",on:{click:function(s){return t.addQuery(e.first)}}},[s("span",[t._v(t._s(e.first))])])}),0)]),t._v(" "),s("div",{directives:[{name:"show",rawName:"v-show",value:t.searchHistory.length,expression:"searchHistory.length"}],staticClass:"search-history"},[s("h1",{staticClass:"title"},[s("span",{staticClass:"text"},[t._v("搜索历史")]),t._v(" "),s("span",{staticClass:"clear",on:{click:t.showConfirm}},[s("i",{staticClass:"icon-clear"})])]),t._v(" "),s("search-list",{attrs:{searches:t.searchHistory},on:{select:t.addQuery,delete:t.deleteSearchHistory}})],1)])])],1),t._v(" "),s("div",{directives:[{name:"show",rawName:"v-show",value:t.query,expression:"query"}],ref:"searchResult",staticClass:"search-result"},[s("suggest",{ref:"suggest",attrs:{query:t.query},on:{listScroll:t.blurInput,select:t.saveSearch}})],1),t._v(" "),s("confirm",{ref:"confirm",attrs:{text:"是否清空所有历史记录",confirmBtnText:"清 空"},on:{confirm:t.clearSearchHistory}})],1)},staticRenderFns:[]};var p=s("VU/8")(d,y,!1,function(t){s("ELjD")},"data-v-1b9cc71e",null);e.default=p.exports}});
//# sourceMappingURL=8.b23db6046b07b51338bd.js.map