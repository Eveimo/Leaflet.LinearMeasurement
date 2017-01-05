var Utils={capString:function(o){return o.substring&&o.length&&(o=o.substring(0,1).toUpperCase()+o.substring(1)),o},hasClass:function(o,i){var t=L.DomUtil.hasClass;for(var n in i)if(t(o,i[n]))return!0;return!1},beginClass:function(o,i){if(o.className&&i&&o.className.indexOf&&o.className.indexOf(i)!==-1)return!0},getIconLabelHtml:function(o,i){var t=['<span style="color: '+i+';">'+o+"</span>"].join("");return t},getLayerById:function(o){var i=null;return this.mainLayer.eachLayer(function(t){if(t.options.id===o)return void(i=t)}),i},setUpColor:function(){this.options.color.indexOf("#")===-1&&(this.options.color="#"+this.options.color),this.options.fillColor.indexOf("#")===-1&&(this.options.fillColor="#"+this.options.fillColor),this.includeColor(this.options.color),this.includeColor(this.options.fillColor)},includeColor:function(o){var i=!1;for(var t in this.options.pallette)this.options.pallette[t]===o&&(i=!0);i||this.options.pallette.push(o)}};
!function(){L.Class.Feature=L.Class.extend({statics:{},includes:[Utils],initialize:function(t){this.options.color=t.options.color,this.core=t,this.a=t.a},destroy:function(){},isEnabled:function(){var t=this.options.name;return this[t+"Enable"]},enableFeature:function(){var t=this.options.name;this[t+"Enable"]=!0},disableFeature:function(){var t=this.options.name;this[t+"Enable"]=!1},resetFeature:function(){},onClick:function(t){this.core.layer||this.core.initLayer()},reorderFeatures:function(t,e){for(var i in e.featureList)if(e.featureList[i].options.name===t){e.featureList.splice(parseInt(i),1),e.featureList.unshift(this);break}},onDblClick:function(t){},onMove:function(t){},onDraw:function(t,e,i,n){},onRedraw:function(t,e,i){},onRenderNode:function(t,e,i){},onSelect:function(t){}})}(),function(){L.Class.ControlFeature=L.Class.Feature.extend({options:{type:"control"},initialize:function(t){L.Class.Feature.prototype.initialize.call(this,t);var e=this,i=this.options.name,n=this.disableFeature,o=this.enableFeature;this.capString(i);this.control=L.DomUtil.create("a","icon-"+i,t.container),this.control.href="#",this.control.title="",this.a=t.a,L.DomEvent.on(this.control,"click",function(){e[i+"Enable"]?n.call(e):o.call(e)})},destroy:function(){L.DomUtil.remove(this.control)},isEnabled:function(){var t=this.options.name;return this[t+"Enable"]},resetOtherControlFeatures:function(){var t=this.core.featureList;for(var e in t)"control"===t[e].options.type&&t[e].disableFeature()},enableFeature:function(){this.resetOtherControlFeatures(),L.Class.Feature.prototype.enableFeature.call(this),L.DomUtil.addClass(this.control,"sub-icon-active")},disableFeature:function(){L.Class.Feature.prototype.disableFeature.call(this),L.DomUtil.removeClass(this.control,"sub-icon-active")},onClick:function(t){this.core.layer.options.type=this.options.name,this.core.layer.options.title="Untitled",this.core.layer.options.description="...",this.core.selectedLayer=this.core.layer,L.Class.Feature.prototype.onClick.call(this,t);var e=t.originalEvent.target,i=t.originalEvent.target;return!this.beginClass(i,["icon-"])&&(!this.hasClass(i,["close"])&&(!this.hasClass(i,["tip-layer"])&&(!this.hasClass(i,["tip-input"])&&!this.hasClass(e,["leaflet-popup","total-popup-content"]))))}})}();
var Geo={repaintGeoJson:function(e){if(e){var s=e.options.id;this.mainLayer.removeLayer(e),this.deleteGeoJson(s),this.persistGeoJson(e,e.options.simple),this.plotGeoJsons(s)}},getGeoJsons:function(){return sessionStorage.geos?JSON.parse(sessionStorage.geos):[]},getGeoJson:function(e){var s=this.getGeoJsons();for(var o in s)if(s[o].properties.id===e)return s[o].index=parseInt(o),s[o];return null},deleteGeoJson:function(e){var s=this.getGeoJsons(),o=this.getGeoJson(e);o&&(s.splice(o.index,1),this.saveGeoJsons(s))},purgeGeoJsons:function(){this.saveGeoJsons([])},saveGeoJsons:function(e){e=JSON.stringify(e),sessionStorage.geos=e,this._map.fire("shape_changed")},updateGeoJson:function(e){this.deleteGeoJson(e.properties.id),this.insertGeoJson(e)},insertGeoJson:function(e){var s=this.getGeoJsons();s.push(e),this.saveGeoJsons(s)},persistGeoJson:function(e){var s,o,t=[],i=e.options.id?"update":"insert",n=e.options.id||(new Date).getTime();e.options.id=n,this.poly&&e.removeLayer(this.poly),e.eachLayer(function(e){o=e.toGeoJSON(),o.properties.styles=e.options,t.push(o)}),s={type:"FeatureCollection",properties:{id:n,hidden:!1,description:e.options.description,name:e.options.title,type:e.options.type,lastPoint:e.options.lastPoint},features:t},this[i+"GeoJson"](s)},plotGeoJsons:function(e){var s=this;this.resetRuler();var o,t=this.getGeoJsons(),i=function(e,o){var t;return t=e.properties.styles.label?s.nodeFeature.renderLabel(o,e.properties.styles.label,e.properties.styles,!1):s.nodeFeature.renderCircle(o,!1,!1,!1,!0,e.properties.styles)},n=function(e){return e.properties.styles},r=function(e){e.getLatLngs&&(multi=e)};for(var p in t)e&&e!==t[p].properties.id||t[p].properties.hidden||(props=t[p].properties,o=L.geoJson(t[p],{id:props.id,pointToLayer:i,style:n,hidden:props.hidden,description:props.description,title:props.name,lastPoint:props.lastPoint}).addTo(this.mainLayer),o.eachLayer(r),props.lastPoint&&this.labelFeature.drawTooltip(props.lastPoint,o,props.name))}};
!function(){L.Class.LabelFeature=L.Class.Feature.extend({options:{name:"paint"},initialize:function(t){L.Class.Feature.prototype.initialize.call(this,t),this.enableFeature()},onClick:function(t,e){e&&this.onDblClick(t)},onDblClick:function(t){var e=this.core.layer,i=e.options.title,l=!1;e.eachLayer(function(t){l=!0}),l&&this.drawTooltip(t.latlng,e,i)},drawTooltip:function(t,e,i){e.options.lastPoint=t;var l=this.core.options.color,o=this.getIconHtml(i,l);e.totalIcon=L.divIcon({className:"total-popup",html:o}),e.total=L.marker(t,{icon:e.totalIcon,clickable:!0,total:!0,type:"label"}).addTo(e),this.drawTooltipHandlers({latlng:t},e,i)},getIconHtml:function(t,e){var i="#fff"===e?"black":"#fff",l=['<div class="total-popup-content" style="background-color:'+e+"; color: "+i+';">','  <input class="tip-input hidden-el" type="text" style="color: '+i+'" />','  <div class="tip-layer">'+t+"</div>",'  <svg class="close" viewbox="0 0 45 35">','   <path class="close" style="stroke:'+i+'" d="M 10,10 L 30,30 M 30,10 L 10,30" />',"  </svg>","</div>"].join("");return l},drawTooltipHandlers:function(t,e,i){var l=this,o=e,n=i?i:"Untitled";isRuler=i&&(i.indexOf(" ft")!==-1||i.indexOf(" mi")!==-1);var s={latlng:t.latlng,total:this.measure,total_label:e.total,unit:this.UNIT_CONV,sub_unit:this.SUB_UNIT_CONV,workspace:o,rulerOn:isRuler},a=function(t){L.DomEvent.stop(t);var i=l.core._map;if(l.core.selectedLayer=o,o.fireEvent("selected",s),t.originalEvent&&L.DomUtil.hasClass(t.originalEvent.target,"close"))i.fire("shape_delete",{id:o.options.id}),i.fire("shape_changed");else{var a=t.target||e;if(isRuler)return;var r,c="",d=e.total._icon.children[0],p=d.children,u=function(t){L.DomUtil.addClass(r,"hidden-el"),L.DomUtil.removeClass(c,"hidden-el"),e.options.title=r.value,l.core.persistGeoJson(e),r.removeEventListener("blur",u),r.removeEventListener("keyup",v)},v=function(t){var e=r.value;c.innerHTML=e||"&nbsp;",a.title=e||"",n=e||"","Enter"===t.key?u():(c.innerHTML=r.value||"&nbsp;",h=c.offsetWidth+7,r.style.width=h+"px")};for(var f in p){if(!p[f].nodeName)return;L.DomUtil.hasClass(p[f],"tip-layer")?(c=p[f],L.DomUtil.addClass(c,"hidden-el")):L.DomUtil.hasClass(p[f],"tip-input")&&(r=p[f],r.value=n,L.DomUtil.removeClass(r,"hidden-el"),r.addEventListener("keyup",v),r.addEventListener("blur",u),r.focus())}var h=c.offsetWidth+7;r.style.width=h+"px"}};this.core.persistGeoJson(e),o.off("click"),o.on("click",a),o.on("selected",this.onSelect),o.fireEvent("click",a)}})}();
!function(){L.Class.NapFeature=L.Class.Feature.extend({options:{name:"nap"},initialize:function(e){L.Class.Feature.prototype.initialize.call(this,e),this.enableFeature();var n=this;setTimeout(function(){n.reorderFeatures("nap",e)},1e3)},onClick:function(e){this.checkSorroundings(e)},onMove:function(e){this.checkSorroundings(e)},checkSorroundings:function(e){var n=this,t=this.core.mainLayer;t.eachLayer(function(t){n.checkLayer(t,e)})},checkLayer:function(e,n){e.eachLayer(function(e){if("node"===e.options.type&&e.getLatLng().equals(n.latlng,.003))return n.latlng=e.getLatLng(),!0})}})}();
!function(){L.Class.DragFeature=L.Class.ControlFeature.extend({options:{name:"drag"},dx:0,dy:0,initialize:function(e){L.Class.ControlFeature.prototype.initialize.call(this,e);var t=this;setTimeout(function(){t.reorderFeatures("drag",e)},1e3)},enableFeature:function(){L.Class.ControlFeature.prototype.enableFeature.call(this),this.core._map.on("mousedown",this.startDragging,this),this.core._map.dragging.disable()},disableFeature:function(){L.Class.ControlFeature.prototype.disableFeature.call(this),this.core._map.off("mousedown",this.startDragging,this),this.core._map.dragging.enable()},onClick:function(e){if(L.DomUtil.hasClass(e.originalEvent.target,"icon-drag"))return!1},startDragging:function(e){this.core._map.dragging.disable();var t=this,n=function(e,n,a){if("node"===e.options.type){if(e.getLatLng().equals(n.latlng,.003))return void(t.selectedNode=e)}else if(e.getLatLngs){var o,r,i=t.getSegments(e.getLatLngs()),s=t.core._map.latLngToContainerPoint(n.latlng);for(var l in i)if(o=L.LineUtil.closestPointOnSegment(s,i[l][0],i[l][1]),r=t.core._map.containerPointToLatLng(o),r.equals(n.latlng,.003))return void(t.selectedLayer=a)}};this.checkSorroundings(e,n),this.core._map.on("mousemove",this.dragLayer,this),this.core._map.on("mouseup",this.stopDragging,this)},getSegments:function(e){var t,n,a=[];for(var o in e)n=this.core._map.latLngToContainerPoint(e[o]),t&&a.push([t,n]),t=n;return console.log(a),a},stopDragging:function(e){this.selectedNode=null,this.selectedLayer=null,this.core._map.off("mousemove",this.dragLayer,this),this.core._map.off("mouseup",this.stopDragging,this)},dragLayer:function(e){if(this.dx=e.originalEvent.movementX,this.dy=e.originalEvent.movementY,this.selectedNode&&"node"===this.selectedNode.options.type){var t=this.selectedNode.getLatLng();this.selectedNode.setLatLng(e.latlng),this.findNodeLines(t,e.latlng)}else if(this.selectedLayer){var n=this,a=(new L.Transformation(this.dx,1,this.dy,1),this.selectedLayer);a.eachLayer(function(e){if("line"===e.options.type){var t,a=e.getLatLngs();for(var o in a)t=n.core._map.latLngToContainerPoint(a[o]),t.x+=n.dx,t.y+=n.dy,a[o]=n.core._map.containerPointToLatLng(t);e.setLatLngs(a)}else e.getLatLng&&(t=n.core._map.latLngToContainerPoint(e.getLatLng()),t.x+=n.dx,t.y+=n.dy,e.setLatLng(n.core._map.containerPointToLatLng(t)))})}},findNodeLines:function(e,t){var n=this,a=function(e,a,o){var r=[];if("line"===e.options.type){r=e.getLatLngs();for(var i in r)if(r[i].equals(a)){r[i]=t,e.setLatLngs(r);break}"ruler"===e.options.stype?(n.core.rulerFeature.layer=o,n.core.rulerFeature.latlngs=r,n.core.rulerFeature.clearAll(o),n.core.rulerFeature.drawRulerLines(o,null),n.core.rulerFeature.layer=null,n.core.rulerFeature.latlngs=null):n.core.lineFeature.clearAll(o),n.core.labelFeature.drawTooltip(r[r.length-1],o,o.options.title)}};this.checkSorroundings(e,a)},checkSorroundings:function(e,t){var n=this,a=this.core.mainLayer;a.eachLayer(function(a){n.checkLayerGroup(a,e,t)})},checkLayerGroup:function(e,t,n){e.eachLayer(function(a){n&&n(a,t,e)})}})}();
!function(){L.Class.NodeFeature=L.Class.ControlFeature.extend({options:{name:"node"},onClick:function(t){var e=L.Class.ControlFeature.prototype.onClick.call(this,t);if(e){if(L.DomUtil.hasClass(t.originalEvent.target,"icon-node"))return!1;this.renderCircle(t.latlng,this.core.layer,"node","",!0)}return e},renderCircle:function(t,e,o,l,i,r){var n=this.options.color,a=this.core.options,c=3;o=o||"circle","node"!=o&&(c=1,n="blue");var a=r||{color:n,opacity:a.opacity,fillOpacity:a.fillOpacity,weight:a.weight,fill:a.fill,fillColor:a.fillColor,type:o},s=L.circleMarker(t,a);return s.setRadius(c),e&&s.addTo(e),i||this.renderLabel(t,l,a,e),s},renderLabel:function(t,e,o,l){var i,r=o.type,n=this.options.color,a=this.core._map.latLngToContainerPoint(t);if(p_latLng=this.core._map.containerPointToLatLng(a),e){var c=L.divIcon({className:"total-popup-label",html:this.getIconLabelHtml(e,n)});i=L.marker(p_latLng,{icon:c,type:r,label:e}),o.label=e,l&&i.addTo(l)}return i}})}();
!function(){L.Class.LineFeature=L.Class.NodeFeature.extend({options:{name:"line",doubleClickSpeed:300},latlngs:[],onClick:function(o){var t=L.Class.NodeFeature.prototype.onClick.call(this,o);if(t){if(L.DomUtil.hasClass(o.originalEvent.target,"icon-line"))return!1;this.latlngs.push(o.latlng)}return t},onMove:function(o,t){if(this.latlngs.length){var i=(this.core,this.latlngs.concat([o.latlng]));this.poly?this.poly.setLatLngs(i):this.poly=this.renderPolyline(i,t)}},onDblClick:function(o){this.poly=null,this.latlngs.length=0},renderPolyline:function(o,t){var i=this.core.options,l=L.polyline(o,{color:i.color,fill:"polygon"===t.options.type?i.fill:"",fillColor:i.fillColor,stroke:i.stroke,opacity:i.opacity,fillOpacity:i.fillOpacity,weight:i.weight,dashArray:i.dashArray,type:"line"});return l.addTo(t),l},renderMultiPolyline:function(o,t){var i;return i="polygon"===options.type?L.polygon(o,{color:options.color,fill:options.fill,fillColor:options.fillColor,stroke:options.stroke,opacity:options.opacity,fillOpacity:options.fillOpacity,weight:options.weight,dashArray:options.dashArray}):L.version.startsWith("0")?L.multiPolyline(o,{color:options.color,fill:"transparent",fillColor:options.fillColor,stroke:options.stroke,opacity:options.opacity,fillOpacity:options.fillOpacity,weight:options.weight,dashArray:options.dashArray}):L.polyline(o,{color:options.color,fill:"transparent",fillColor:options.fillColor,stroke:options.stroke,opacity:options.opacity,fillOpacity:options.fillOpacity,weight:options.weight,dashArray:options.dashArray}),i.addTo(t),i},clearAll:function(o){o&&o.eachLayer(function(t){(t.options&&"tmp"===t.options.type||"fixed"===t.options.type||"label"===t.options.type)&&o.removeLayer(t)})}})}();
!function(){L.Class.PolyFeature=L.Class.LineFeature.extend({options:{name:"polygon"},onClick:function(t){return!L.DomUtil.hasClass(t.originalEvent.target,"icon-polygon")&&L.Class.LineFeature.prototype.onClick.call(this,t)},onDblClick:function(t){this.latlngs.push(this.latlngs[0]),this.poly.setLatLngs(this.latlngs),L.Class.LineFeature.prototype.onDblClick.call(this,t)}})}();
!function(){L.Class.MeasurementFeature=L.Class.LineFeature.extend({options:{name:"ruler",unitSystem:"imperial"},initialize:function(t){L.Class.LineFeature.prototype.initialize.call(this,t),this.resetRuler()},enableFeature:function(){L.Class.LineFeature.prototype.enableFeature.call(this),this.core.napFeature.disableFeature()},disableFeature:function(){L.Class.LineFeature.prototype.disableFeature.call(this),this.core.napFeature.enableFeature()},onClick:function(t){L.DomUtil.hasClass(t.originalEvent.target,"icon-ruler")||L.Class.LineFeature.prototype.onClick.call(this,t)},onMove:function(t,e){L.Class.LineFeature.prototype.onMove.call(this,t,e),this.poly&&(this.poly.options.stype="ruler"),this.drawRulerLines(e,t)},onDblClick:function(t){this.fixMeasurements(this.core.layer);this.latlngs;this.core.layer.options.title=this.measure.scalar+" "+this.measure.unit,L.Class.LineFeature.prototype.onDblClick.call(this,t)},drawRulerLines:function(t,e){if(this.latlngs.length){var i,n=e?this.latlngs.concat([e.latlng]):this.latlngs,s=0,a=0;if(s=this.getStaticSum(n),this.cleanUpTmp(t),n.length>1)for(var o in n)i&&(a+=this.displayMarkers.apply(this,[[i,n[o]],!0,a,t,s])),i=n[o]}},displayMarkers:function(t,e,i,n,s){var a,o,r,l,u,h,c=t[1],p=t[0],f=p.distanceTo(c)/this.UNIT_CONV,m=f,y=n.measure||this.measure,C=this.core._map.latLngToContainerPoint(c),U=this.core._map.latLngToContainerPoint(p),N=1,T=s;s>1?y.unit="mi":(y.unit="ft",T=this.SUB_UNIT_CONV*s),h=this.getSeparation(T),y.scalar=T.toFixed(2),y.unit===this.SUB_UNIT&&(N=this.SUB_UNIT_CONV,m*=N);for(var g=i*N+m,_=i*N,F=y.unit,I=Math.floor(_);I<g;I++)l=(g-I)/m,I%h||I<_||(a=C.x-l*(C.x-U.x),o=C.y-l*(C.y-U.y),u=L.point(a,o),c=this.core._map.containerPointToLatLng(u),r=I+" "+F,I&&this.renderCircle(c,n,"tmp",r,!1,!1),this.last=g);return f},getSeparation:function(t){var e,i,n;return i=(parseInt(t)+"").length,n=Math.pow(10,i),e=n/10,5*e>t&&(e=parseInt(e/5)),e},getStaticSum:function(t){var e=0;if(t.length)if(t[0].length)for(var i in t)e+=this.countLine(t[i]);else e=this.countLine(t);else e=this.sum;return e},countLine:function(t){var e,i,n=0;for(var s in t)e=t[s],i&&(n+=i.distanceTo(e)/this.UNIT_CONV),i=t[s];return n},resetRuler:function(){this.sum=0,this.distance=0,this.separation=1,this.last=0,this.fixedLast=0,this.totalIcon=null,this.total=null,this.lastCircle=null,this.UNIT_CONV=1e3,this.SUB_UNIT_CONV=1e3,this.UNIT="km",this.SUB_UNIT="m","imperial"===this.options.unitSystem&&(this.UNIT_CONV=1609.344,this.SUB_UNIT_CONV=5280,this.UNIT="mi",this.SUB_UNIT="ft"),this.measure={scalar:0,unit:this.SUB_UNIT}},clearAll:function(t){t&&t.eachLayer(function(e){(e.options&&"tmp"===e.options.type||"fixed"===e.options.type||"label"===e.options.type)&&t.removeLayer(e)})},cleanUpTmp:function(t){t&&t.eachLayer(function(e){e.options&&"tmp"===e.options.type&&t.removeLayer(e)})},fixMeasurements:function(t){t&&t.eachLayer(function(t){"tmp"===t.options.type&&(t.options.type="fixed")})}})}();
!function(){L.Class.StyleFeature=L.Class.ControlFeature.extend({options:{name:"paint",pallette:["#FF0080","#4D90FE","red","blue","green","orange","black"],dashArrayOptions:["5, 5","5, 10","10, 5","5, 1","1, 5","0.9","15, 10, 5","15, 10, 5, 10","15, 10, 5, 10, 15","5, 5, 1, 5"]},enableFeature:function(){L.Class.ControlFeature.prototype.enableFeature.call(this),this.buildPaintPane()},disableFeature:function(){L.Class.ControlFeature.prototype.disableFeature.call(this),this.disablePaint()},enablePaint:function(){this.paintPane?L.DomUtil.removeClass(this.paintPane,"hidden-el"):this.buildPaintPane()},disablePaint:function(){this.paintPane&&L.DomUtil.addClass(this.paintPane,"hidden-el")},onPaintChange:function(t){this.affectSelectedLayer(t)},affectSelectedLayer:function(t){var e=this,i={};i[t]=e.core.options[t],this.core.selectedLayer&&(this.core.selectedLayer.eachLayer(function(n){if(n.setStyle)n.setStyle(i);else{var a=n.options.icon,o=i[t],s="";if(n.options.total&&"color"===t){s=e.core.selectedLayer.title;var l=e.getIconHtml(s,o);L.setOptions(a,{html:l}),n.setIcon(a)}else if("fixed"===n.options.type&&"color"===t){s=n.options.label;var l=e.getIconLabelHtml(s,o);L.setOptions(a,{html:l}),n.setIcon(a)}}}),this.core.persistGeoJson(this.core.selectedLayer,this.core.selectedLayer.options.simple))},getIconHtml:function(t,e){var i="#fff"===e?"black":"#fff",n=['<div class="total-popup-content" style="background-color:'+e+"; color: "+i+';">','  <input class="tip-input hidden-el" type="text" style="color: '+i+'" />','  <div class="tip-layer">'+t+"</div>",'  <svg class="close" viewbox="0 0 45 35">','   <path class="close" style="stroke:'+i+'" d="M 10,10 L 30,30 M 30,10 L 10,30" />',"  </svg>","</div>"].join("");return n},idealTextColor:function(t){var e=105,i=this.getRGBComponents(t),n=.299*i.R+.587*i.G+.114*i.B;return 255-n<e?"#000000":"#ffffff"},getRGBComponents:function(t){var e=t.substring(1,3),i=t.substring(3,5),n=t.substring(5,7);return{R:parseInt(e,16),G:parseInt(i,16),B:parseInt(n,16)}},buildPaintPane:function(){var t=this,e=this.core._map.getContainer();this.paintPane=L.DomUtil.create("div","paint-pane",e);var i=new L.Draggable(this.paintPane);i.enable(),this.buildPaneHeader(),this.buildPaneSection("color",function(){t.paintColor.addEventListener("click",function(e){if(L.DomEvent.stop(e),L.DomUtil.hasClass(e.target,"clickable")){var i="SPAN"===e.target.nodeName?e.target.parentElement:e.target,n=i.getAttribute("color"),a=i.parentElement,o=a.childNodes;for(var s in o)t.isElement(o[s])&&L.DomUtil.removeClass(o[s],"paint-color-selected");L.DomUtil.addClass(i,"paint-color-selected"),t.core.options.color=n,t.onPaintChange("color")}})}),this.buildPaneSection("fillColor",function(){t.paintFillColor.addEventListener("click",function(e){if(L.DomEvent.stop(e),L.DomUtil.hasClass(e.target,"clickable")){var i="SPAN"===e.target.nodeName?e.target.parentElement:e.target,n=i.getAttribute("color"),a=i.parentElement,o=a.childNodes;for(var s in o)t.isElement(o[s])&&L.DomUtil.removeClass(o[s],"paint-color-selected");L.DomUtil.addClass(i,"paint-color-selected"),t.core.options.fillColor=n,t.onPaintChange("fillColor")}})}),this.buildPaneSection("flags",function(){t.paintFlags.addEventListener("click",function(e){L.DomUtil.hasClass(e.target,"clickable")&&"INPUT"===e.target.nodeName&&(e.target.checked?(t.core.options[e.target.getAttribute("flag")]=!0,t.onPaintChange(e.target.getAttribute("flag"))):(t.core.options[e.target.getAttribute("flag")]=!1,t.onPaintChange(e.target.getAttribute("flag"))))})}),this.buildPaneSection("dashArray",function(){t.paintDashArray.addEventListener("click",function(e){if(L.DomEvent.stop(e),L.DomUtil.hasClass(e.target,"clickable")){var i="svg"===e.target.nodeName?e.target:e.target.parentElement,n=i.childNodes,a=Math.round((e.offsetY-10)/20);for(var o in n)(t.isElement(n[o])||n[o].nodeName)&&L.DomUtil.removeClass(n[o],"line-selected");var s=n[a];s&&(L.DomUtil.addClass(n[a],"line-selected"),t.core.options.dashArray=n[a].getAttribute("stroke-dasharray").replace(/,/g,""),t.onPaintChange("dashArray"))}})}),this.buildPaneSection("opacity",function(){t.paintOpacity.addEventListener("mousedown",function(e){L.DomEvent.stop(e),t.slidemove=!0}),t.paintOpacity.addEventListener("mousemove",function(e){L.DomEvent.stop(e),t.slidemove&&t.moveSlider(e)}),t.paintOpacity.addEventListener("mouseup",function(e){t.slidemove=!1,L.DomEvent.stop(e),t.moveSlider(e)}),t.paintOpacity.addEventListener("click",function(e){L.DomEvent.stop(e),t.moveSlider(e)})})},moveSlider:function(t){var e=this;if(L.DomUtil.hasClass(t.target,"clickable")&&"INPUT"===t.target.nodeName){var i=t.offsetX/t.target.clientWidth;"1"==t.target.getAttribute("step")&&(i*=10),t.target.value=i,e.core.options[t.target.getAttribute("flag")]=t.target.value,e.onPaintChange(t.target.getAttribute("flag"))}},buildPaneHeader:function(){var t=this,e=['<span>Styling Options</span><i class="close">x</i>'].join("");this.paintPaneHeader=L.DomUtil.create("div","paint-pane-header",this.paintPane),this.paintPaneHeader.innerHTML=e,this.paintPaneHeader.addEventListener("click",function(e){L.DomEvent.stop(e),"I"===e.target.nodeName&&t.disableFeature()})},buildPaneSection:function(t,e){var i=this.capString(t),n=this["build"+i+"Section"]();this["paint"+i]=L.DomUtil.create("div","paint-pane-section paint-pane-"+t,this.paintPane),this["paint"+i].innerHTML=n,e&&"function"==typeof e&&e()},buildColorSection:function(){var t=this.core.options.pallette,e="",i=[];for(var n in t)e=t[n]===this.core.options.color?"paint-color-selected":"",i.push('<li class="paint-color clickable '+e+'" color="'+t[n]+'"><span class="clickable" style="background-color: '+t[n]+';"></span></li>');var a=['<span class="section-header">Stroke</span>','<ul class="section-body paint-color-wrapper">',i.join(""),"</ul>"].join("");return a},buildFillColorSection:function(){var t=this.core.options.pallette,e="",i=[];for(var n in t)e=t[n]===this.core.options.fillColor?"paint-color-selected":"",i.push('<li class="paint-color clickable '+e+'" color="'+t[n]+'"><span class="clickable" style="background-color: '+t[n]+';"></span></li>');var a=['<span class="section-header">Fill Color</span>','<ul class="section-body paint-color-wrapper">',i.join(""),"</ul>"].join("");return a},buildFlagsSection:function(){var t=["stroke","fill"],e="",i=[];for(var n in t)e=this.core.options[t[n]]?"checked":"",i.push('<div><input value="'+t[n]+'" type="checkbox" '+e+' class="clickable" flag="'+t[n]+'"> Draw '+t[n]+"</div>");var a=['<span class="section-header">Options</span>','<div class="section-body">',i.join(""),"</div>"].join("");return a},buildDashArraySection:function(){var t=this.core.options.dashArrayOptions,e="",i=[],n=10;for(var a in t)e=this.core.options.dashArray===t[a]?"line-selected":"",i.push('<line class="clickable pain-lines '+e+'" stroke-dasharray="'+t[a]+'" x1="10" y1="'+n+'" x2="160" y2="'+n+'" />'),n+=20;var o=['<span class="section-header">Dash Array</span>','<svg class="section-body clickable" width="170" height="200" viewPort="0 0 200 160" version="1.1" xmlns="http://www.w3.org/2000/svg">',i.join(""),"</svg>"].join("");return o},buildOpacitySection:function(){var t=["opacity","fillOpacity","weight"],e=[],i=0,n=0;for(var a in t)"weight"===t[a]?(i=10,n=1):(i=1,n=.1),e.push('<span class="section-header">'+this.capString(t[a])+"</span>"),e.push('<div class="section-body">'),e.push(' <div><input value="'+this.core.options[t[a]]+'" type="range" min="0" max="'+i+'" step="'+n+'" class="clickable" flag="'+t[a]+'"></div>'),e.push("</div>");return e.join("")},isElement:function(t){try{return t instanceof HTMLElement}catch(e){return"object"==typeof t&&1===t.nodeType&&"object"==typeof t.style&&"object"==typeof t.ownerDocument}}})}();
!function(){L.Class.TrashFeature=L.Class.ControlFeature.extend({options:{name:"trash"},onClick:function(e){var r=this;this.core.mainLayer.eachLayer(function(e){r.core.mainLayer.removeLayer(e)}),this.core.purgeGeoJsons(),this.core._map.fire("shape_changed"),r.core.resetRuler(),setTimeout(function(){r.disableFeature()},100)}})}();
var Handlers={onDblClick:function(i,t,e){var n,s=this;for(var o in this.featureList)n=this.featureList[o],n.isEnabled()&&n.onDblClick(i);s.reset(i)},getMouseClickHandler:function(i){var t=!1;if(this.layer||this.initLayer(),L.DomEvent.stop(i),this.isDblClick())this.onDblClick(i);else{var e;for(var n in this.featureList)e=this.featureList[n],e.isEnabled()&&("node"===e.options.name&&(t=!0),e.onClick(i,t))}t&&this.reset(i)},getMouseMoveHandler:function(i){var t;for(var e in this.featureList)t=this.featureList[e],t.isEnabled()&&t.onMove(i,this.layer)},isDblClick:function(){var i=(new Date).getTime(),t=i-this.tik;return this.tik=i,t<this.options.doubleClickSpeed},onAdded:function(){},onSelect:function(i){}};
!function(){var e=[Utils,Geo,Handlers];L.Control.LinearCore=L.Control.extend({options:{position:"topleft",color:"#4D90FE",fillColor:"#fff",type:"node",features:["node","line","polygon","ruler","paint","drag","rotate","nodedrag","trash"],pallette:["#FF0080","#4D90FE","red","blue","green","orange","black"],dashArrayOptions:["5, 5","5, 10","10, 5","5, 1","1, 5","0.9","15, 10, 5","15, 10, 5, 10","15, 10, 5, 10, 15","5, 5, 1, 5"],fill:!0,stroke:!0,dashArray:"5, 5",weight:2,opacity:1,fillOpacity:.5,radius:3,unitSystem:"imperial",doubleClickSpeed:300},includes:e,tik:0,onAdd:function(e){var t=L.DomUtil.create("div","leaflet-control leaflet-bar"),i=e.getContainer(),s=this;return this.link=L.DomUtil.create("a","icon-draw",t),this.link.href="#",this.link.title="",this.container=t,e.on("linear_feature_on",function(e){s.active||(s.active=!0,s.initRuler(t),L.DomUtil.addClass(s.link,"icon-active"),L.DomUtil.addClass(i,"ruler-map"))}),L.DomEvent.on(s.link,"click",L.DomEvent.stop).on(s.link,"click",function(){L.DomUtil.hasClass(s.link,"icon-active")?(s.active=!1,s.resetRuler(!0),L.DomUtil.removeClass(s.link,"icon-active"),L.DomUtil.removeClass(i,"ruler-map")):(s.active=!0,s.initRuler(t),L.DomUtil.addClass(s.link,"icon-active"),L.DomUtil.addClass(i,"ruler-map"))}),this.setUpColor(),this.onAdded(),t},onRemove:function(e){this.resetRuler(!0)},initRuler:function(e){var t=this._map;this.features=this.options.features,this.featureList=[],this.nodeFeature=new L.Class.NodeFeature(this),this.featureList.push(this.nodeFeature),this.napFeature=new L.Class.NapFeature(this),this.featureList.push(this.napFeature),this.lineFeature=new L.Class.LineFeature(this),this.featureList.push(this.lineFeature),this.polyFeature=new L.Class.PolyFeature(this),this.featureList.push(this.polyFeature),this.rulerFeature=new L.Class.MeasurementFeature(this),this.featureList.push(this.rulerFeature),this.labelFeature=new L.Class.LabelFeature(this),this.featureList.push(this.labelFeature),this.featureList.push(new L.Class.StyleFeature(this)),this.featureList.push(new L.Class.TrashFeature(this)),this.featureList.push(new L.Class.DragFeature(this)),this.mainLayer=L.featureGroup(),this.mainLayer.addTo(this._map),t.touchZoom.disable(),t.doubleClickZoom.disable(),t.boxZoom.disable(),t.keyboard.disable(),t.tap&&t.tap.disable(),this.dblClickEventFn=function(e){L.DomEvent.stop(e)},t.on("click",this.getMouseClickHandler,this),t.on("dblclick",this.dblClickEventFn,t),t.on("mousemove",this.getMouseMoveHandler,this),this.mainLayer.on("dblclick",this.dblClickEventFn,this.mainLayer),this.shapeInit(),this.plotGeoJsons()},initLayer:function(){this.layer=L.geoJson(),this.layer.options.type=this.options.type,this.layer.options.title="Untitled",this.layer.options.description="...",this.layer.addTo(this.mainLayer),this.layer.on("selected",this.onSelect)},resetRuler:function(e){var t=this._map;if(e){t.off("click",this.clickEventFn,this),t.off("mousemove",this.moveEventFn,this),t.off("dblclick",this.dblClickEventFn,t),this.mainLayer.off("dblclick",this.dblClickEventFn,this.mainLayer),this.layer&&t.removeLayer(this.layer),this.mainLayer&&t.removeLayer(this.mainLayer),this.mainLayer=null,t.touchZoom.enable(),t.boxZoom.enable(),t.keyboard.enable(),t.tap&&t.tap.enable();for(var i in this.featureList)this.featureList[i].destroy()}this.layer=null,this.originalLatLng=null,this.prevLatlng=null,this.poly=null,this.multi=null,this.latlngs=null,this.latlngsList=[],this.nodes=[]},reset:function(e){this.layer&&(this.layer.off("dblclick"),L.DomEvent.stop(e),this.layer.removeLayer(this.poly),this.resetRuler(!1))},shapeInit:function(){var e=this,t=this._map;t.on("shape_toggle",function(t){var i=t.id,s=e.getGeoJson(i),a=e.getLayerById(i);s.properties.hidden=t.hidden,e.updateGeoJson(s),a&&t.hidden?e.mainLayer.removeLayer(a):t.hidden||e.plotGeoJsons(i)}),t.on("shape_delete",function(t){var i=t.id,s=e.getLayerById(i);s&&(e.mainLayer.removeLayer(s),e.deleteGeoJson(i))}),t.on("shape_focus",function(i){var s=i.id,a=e.getLayerById(s);a&&(e.selectedLayer=a,t.setView(a.getBounds().getCenter()))}),t.on("shape_update",function(t){var i=t.id,s=e.getGeoJson(i),a=e.getLayerById(i);e.mainLayer.removeLayer(a),s.properties.hidden=t.hidden,s.properties.name=t.name,s.properties.description=t.description,e.updateGeoJson(s),t.hidden||e.plotGeoJsons(i)})}})}();