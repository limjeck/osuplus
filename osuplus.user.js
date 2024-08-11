// ==UserScript==
// @name         osuplus
// @namespace    https://osu.ppy.sh/u/1843447
// @version      2.3.12
// @description  show pp, selected mods ranking, friends ranking and other stuff
// @author       oneplusone
// @match        http://osu.ppy.sh/*
// @match        https://osu.ppy.sh/*
// @match        http://old.ppy.sh/*
// @match        https://old.ppy.sh/*
// @icon         https://osu.ppy.sh/favicon.ico
// @noframes
// @connect      ppy.sh
// @grant        GM.xmlHttpRequest
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @require      http://timeago.yarp.com/jquery.timeago.js
// ==/UserScript==

/*global GM, $, GM_xmlhttpRequest, GM_setValue, GM_getValue, unsafeWindow */

(() => {
    "use strict";

    var debug = false;

    // backwards compatible
    var GMX;
    if(typeof GM == "undefined"){
        GMX = {
            xmlHttpRequest: GM_xmlhttpRequest,
            setValue: function(name, value){
                return Promise.resolve(GM_setValue(name, value));
            },
            getValue: function(name, def){
                return Promise.resolve(GM_getValue(name, def));
            }
        };
    }else{
        GMX = GM;
    }

    /*eslint-disable*/
    var ojsama = (() => {
        // ojsama 2.2.0 (https://github.com/Francesco149/ojsama/)
        // https://github.com/Francesco149/ojsama/blob/d3631e35192fe30dfbf782f70f3c058a694f287e/ojsama.min.js
        var osu={};if(typeof exports!=="undefined"){osu=exports}(function(){osu.VERSION_MAJOR=2;osu.VERSION_MINOR=2;osu.VERSION_PATCH=0;var t={warn:Function.prototype};if(typeof exports!=="undefined"){t=console}var i=function(t,i){var s=new Array(t.length);for(var e=0;e<s.length;++e){s[e]=t[e].toFixed(i)}return s};function R(t){return typeof t==="undefined"}function s(t){this.time=t.time||0;this.ms_per_beat=t.ms_per_beat;if(this.ms_per_beat===undefined){this.ms_per_beat=600}this.change=t.change;if(this.change===undefined){this.change=true}}s.prototype.toString=function(){return"{ time: "+this.time.toFixed(2)+", "+"ms_per_beat: "+this.ms_per_beat.toFixed(2)+" }"};var u={circle:1<<0,slider:1<<1,spinner:1<<3};function e(t){this.pos=t.pos||[0,0]}e.prototype.toString=function(){return"pos: ["+i(this.pos,2)+"]"};function r(t){this.pos=t.pos||[0,0];this.distance=t.distance||0;this.repetitions=t.repetitions||1}r.prototype.toString=function(){return"pos: "+i(this.pos,2)+", "+"distance: "+this.distance.toFixed(2)+", "+"repetitions: "+this.repetitions};function a(t){this.time=t.time||0;this.type=t.type||0;if(!R(t.data))this.data=t.data}a.prototype.typestr=function(){var t="";if(this.type&u.circle)t+="circle | ";if(this.type&u.slider)t+="slider | ";if(this.type&u.spinner)t+="spinner | ";return t.substring(0,Math.max(0,t.length-3))};a.prototype.toString=function(){return"{ time: "+this.time.toFixed(2)+", "+"type: "+this.typestr()+(this.data?", "+this.data.toString():"")+" }"};var n={std:0};function o(){this.reset()}o.prototype.reset=function(){this.format_version=1;this.mode=n.std;this.title=this.title_unicode="";this.artist=this.artist_unicode="";this.creator="";this.version="";this.ar=undefined;this.cs=this.od=this.hp=5;this.sv=this.tick_rate=1;this.ncircles=this.nsliders=this.nspinners=0;if(!this.objects){this.objects=[]}else{this.objects.length=0}if(!this.timing_points){this.timing_points=[]}else{this.timing_points.length=0}return this};o.prototype.max_combo=function(){var t=this.ncircles+this.nspinners;var i=-1;var s=Number.NEGATIVE_INFINITY;var e=0;for(var r=0;r<this.objects.length;++r){var a=this.objects[r];if(!(a.type&u.slider)){continue}while(a.time>=s){++i;if(this.timing_points.length>i+1){s=this.timing_points[i+1].time}else{s=Number.POSITIVE_INFINITY}var n=this.timing_points[i];var o=1;if(!n.change&&n.ms_per_beat<0){o=-100/n.ms_per_beat}if(this.format_version<8){e=this.sv*100}else{e=this.sv*100*o}}var h=a.data;var p=h.distance*h.repetitions/e;var c=Math.ceil((p-.1)/h.repetitions*this.tick_rate);--c;c*=h.repetitions;c+=h.repetitions+1;t+=Math.max(0,c)}return t};o.prototype.toString=function(){var t=this.artist+" - "+this.title+" [";if(this.title_unicode||this.artist_unicode){t+="("+this.artist_unicode+" - "+this.title_unicode+")"}t+=this.version+"] mapped by "+this.creator+"\n"+"\n"+"AR"+parseFloat(this.ar.toFixed(2))+" "+"OD"+parseFloat(this.od.toFixed(2))+" "+"CS"+parseFloat(this.cs.toFixed(2))+" "+"HP"+parseFloat(this.hp.toFixed(2))+"\n"+this.ncircles+" circles, "+this.nsliders+" sliders, "+this.nspinners+" spinners"+"\n"+this.max_combo()+" max combo"+"\n";return t};function h(){this.map=new o;this.reset()}h.prototype.reset=function(){this.map.reset();this.nline=0;this.curline="";this.lastpos="";this.section="";return this};h.prototype.feed_line=function(t){this.curline=this.lastpos=t;++this.nline;if(t.startsWith(" ")||t.startsWith("_")){return this}t=this.curline=t.trim();if(t.length<=0){return this}if(t.startsWith("//")){return this}if(t.startsWith("[")){if(this.section=="Difficulty"&&R(this.map.ar)){this.map.ar=this.map.od}this.section=t.substring(1,t.length-1);return this}if(!t){return this}switch(this.section){case"Metadata":this._metadata();break;case"General":this._general();break;case"Difficulty":this._difficulty();break;case"TimingPoints":this._timing_points();break;case"HitObjects":this._objects();break;default:var i=t.indexOf("file format v");if(i<0){break}this.map.format_version=parseInt(t.substring(i+13));break}return this};h.prototype.feed=function(t){var i=i=t.split("\n");for(var s=0;s<i.length;++s){this.feed_line(i[s])}return this};h.prototype.toString=function(){return"at line "+this.nline+"\n"+this.curline+"\n"+"-> "+this.lastpos+" <-"};h.prototype._setpos=function(t){this.lastpos=t.trim();return this.lastpos};h.prototype._warn=function(){t.warn.apply(null,Array.prototype.slice.call(arguments));t.warn(this.toString())};h.prototype._property=function(){var t=this.curline.split(":",2);t[0]=t[0]&&this._setpos(t[0]);t[1]=t[1]&&this._setpos(t[1]);return t};h.prototype._metadata=function(){var t=this._property();switch(t[0]){case"Title":this.map.title=t[1];break;case"TitleUnicode":this.map.title_unicode=t[1];break;case"Artist":this.map.artist=t[1];break;case"ArtistUnicode":this.map.artist_unicode=t[1];break;case"Creator":this.map.creator=t[1];break;case"Version":this.map.version=t[1];break;case"BeatmapID":this.map.beatmapId=parseInt(t[1]);break;case"BeatmapSetID":this.map.beatmapsetId=parseInt(t[1]);break}};h.prototype._general=function(){var t=this._property();if(t[0]!=="Mode"){return}this.map.mode=parseInt(this._setpos(t[1]))};h.prototype._difficulty=function(){var t=this._property();switch(t[0]){case"CircleSize":this.map.cs=parseFloat(this._setpos(t[1]));break;case"OverallDifficulty":this.map.od=parseFloat(this._setpos(t[1]));break;case"ApproachRate":this.map.ar=parseFloat(this._setpos(t[1]));break;case"HPDrainRate":this.map.hp=parseFloat(this._setpos(t[1]));break;case"SliderMultiplier":this.map.sv=parseFloat(this._setpos(t[1]));break;case"SliderTickRate":this.map.tick_rate=parseFloat(this._setpos(t[1]));break}};h.prototype._timing_points=function(){var t=this.curline.split(",");if(t.length>8){this._warn("timing point with trailing values")}else if(t.length<2){this._warn("ignoring malformed timing point");return}var i=new s({time:parseFloat(this._setpos(t[0])),ms_per_beat:parseFloat(this._setpos(t[1]))});if(t.length>=7){i.change=t[6].trim()!=="0"}this.map.timing_points.push(i)};h.prototype._objects=function(){var t=this.curline.split(",");var i;if(t.length>11){this._warn("object with trailing values")}else if(t.length<4){this._warn("ignoring malformed hitobject");return}var s=new a({time:parseFloat(this._setpos(t[2])),type:parseInt(this._setpos(t[3]))});if(isNaN(s.time)||isNaN(s.type)){this._warn("ignoring malformed hitobject");return}if((s.type&u.circle)!=0){++this.map.ncircles;i=s.data=new e({pos:[parseFloat(this._setpos(t[0])),parseFloat(this._setpos(t[1]))]});if(isNaN(i.pos[0])||isNaN(i.pos[1])){this._warn("ignoring malformed circle");return}}else if((s.type&osu.objtypes.spinner)!=0){++this.map.nspinners}else if((s.type&osu.objtypes.slider)!=0){if(t.length<8){this._warn("ignoring malformed slider");return}++this.map.nsliders;i=s.data=new r({pos:[parseFloat(this._setpos(t[0])),parseFloat(this._setpos(t[1]))],repetitions:parseInt(this._setpos(t[6])),distance:parseFloat(this._setpos(t[7]))});if(isNaN(i.pos[0])||isNaN(i.pos[1])||isNaN(i.repetitions)||isNaN(i.distance)){this._warn("ignoring malformed slider");return}}this.map.objects.push(s)};var q={nomod:0,nf:1<<0,ez:1<<1,td:1<<2,hd:1<<3,hr:1<<4,dt:1<<6,ht:1<<8,nc:1<<9,fl:1<<10,so:1<<12};q.from_string=function(t){var i=0;t=t.toLowerCase();while(t!=""){var s=1;for(var e in q){if(e.length!=2){continue}if(!q.hasOwnProperty(e)){continue}if(t.startsWith(e)){i|=q[e];s=2;break}}t=t.slice(s)}return i};q.string=function(t){var i="";for(var s in q){if(s.length!=2){continue}if(!q.hasOwnProperty(s)){continue}if(t&q[s]){i+=s.toUpperCase()}}if(i.indexOf("DT")>=0&&i.indexOf("NC")>=0){i=i.replace("DT","")}return i};q.speed_changing=q.dt|q.ht|q.nc;q.map_changing=q.hr|q.ez|q.speed_changing;var p=80;var c=20;var m=1800;var l=1200;var f=450;var d=(p-c)/10;var _=(m-l)/5;var v=(l-f)/5;function g(t,i,s){var e=t;e*=s;var r=e<5?m-_*e:l-v*(e-5);r=Math.min(m,Math.max(f,r));r/=i;e=r>l?(m-r)/_:5+(l-r)/v;return e}function b(t,i,s){var e=t;e*=s;var r=p-Math.ceil(d*e);r=Math.min(p,Math.max(c,r));r/=i;e=(p-r)/d;return e}function z(t){this.ar=t.ar;this.od=t.od;this.hp=t.hp;this.cs=t.cs;this.speed_mul=1;this._mods_cache={}}z.prototype.with_mods=function(t){if(this._mods_cache[t]){return this._mods_cache[t]}var i=this._mods_cache[t]=new z(this);if(!(t&q.map_changing)){return i}if(t&(q.dt|q.nc)){i.speed_mul=1.5}if(t&q.ht){i.speed_mul*=.75}var s=1;if(t&q.hr)s=1.4;if(t&q.ez)s*=.5;if(i.ar){i.ar=g(i.ar,i.speed_mul,s)}if(i.od){i.od=b(i.od,i.speed_mul,s)}if(i.cs){if(t&q.hr)i.cs*=1.3;if(t&q.ez)i.cs*=.5;i.cs=Math.min(10,i.cs)}if(i.hp){i.hp*=s;i.hp=Math.min(10,i.hp)}return i};function y(t){this.obj=t;this.reset()}y.prototype.reset=function(){this.strains=[0,0];this.normpos=[0,0];this.angle=0;this.is_single=false;this.delta_time=0;this.d_distance=0;return this};y.prototype.toString=function(){return"{ strains: ["+i(this.strains,2)+"], normpos: ["+i(this.normpos,2)+"], is_single: "+this.is_single+" }"};function M(t,i){return[t[0]-i[0],t[1]-i[1]]}function w(t,i){return[t[0]*i[0],t[1]*i[1]]}function x(t){return Math.sqrt(t[0]*t[0]+t[1]*t[1])}function j(t,i){return t[0]*i[0]+t[1]*i[1]}var F=0;var N=1;var I=125;var k=[.3,.15];var S=[1400,26.25];var T=.9;var E=400;var O=30;var P=.0675;var A=[512,384];var D=w(A,[.5,.5]);var C=.5;function V(){this.objects=[];this.reset();this.map=undefined;this.mods=q.nomod;this.singletap_threshold=125}V.prototype.reset=function(){this.total=0;this.aim=0;this.aim_difficulty=0;this.aim_length_bonus=0;this.speed=0;this.speed_difficulty=0;this.speed_length_bonus=0;this.nsingles=0;this.nsingles_threshold=0};V.prototype._length_bonus=function(t,i){return.32+.5*(Math.log10(i+t)-Math.log10(t))};V.prototype.calc=function(t){var i=this.map=t.map||this.map;if(!i){throw new TypeError("no map given")}var s=this.mods=t.mods||this.mods;var e=this.singletap_threshold=t.singletap_threshold||e;var r=new z({cs:i.cs}).with_mods(s);var a=r.speed_mul;this._init_objects(this.objects,i,r.cs);var n=this._calc_individual(F,this.objects,a);this.speed=n.difficulty;this.speed_difficulty=n.total;var o=this._calc_individual(N,this.objects,a);this.aim=o.difficulty;this.aim_difficulty=o.total;this.aim_length_bonus=this._length_bonus(this.aim,this.aim_difficulty);this.speed_length_bonus=this._length_bonus(this.speed,this.speed_difficulty);this.aim=Math.sqrt(this.aim)*P;this.speed=Math.sqrt(this.speed)*P;if(s&q.td){this.aim=Math.pow(this.aim,.8)}this.total=this.aim+this.speed+Math.abs(this.speed-this.aim)*C;this.nsingles=0;this.nsingles_threshold=0;for(var h=1;h<this.objects.length;++h){var p=this.objects[h].obj;var c=this.objects[h-1].obj;if(this.objects[h].is_single){++this.nsingles}if(!(p.type&(u.circle|u.slider))){continue}var m=(p.time-c.time)/a;if(m>=e){++this.nsingles_threshold}}return this};V.prototype.toString=function(){return this.total.toFixed(2)+" stars ("+this.aim.toFixed(2)+" aim, "+this.speed.toFixed(2)+" speed)"};var W=75;var H=45;var U=90;var B=107;var G=5*Math.PI/6;var Y=Math.PI/3;V.prototype._spacing_weight=function(t,i,s,e,r,a){var n;var o=Math.max(s,50);switch(t){case N:{var h=Math.max(r,50);var p=0;if(a!==null&&a>Y){n=Math.sqrt(Math.max(e-U,0)*Math.pow(Math.sin(a-Y),2)*Math.max(i-U,0));p=1.5*Math.pow(Math.max(0,n),.99)/Math.max(B,h)}var c=Math.pow(i,.99);return Math.max(p+c/Math.max(B,o),c/o)}case F:{i=Math.min(i,I);s=Math.max(s,H);var m=1;if(s<W){m+=Math.pow((W-s)/40,2)}n=1;if(a!==null&&a<G){var l=Math.sin(1.5*(G-a));n+=Math.pow(l,2)/3.57;if(a<Math.PI/2){n=1.28;if(i<U&&a<Math.PI/4){n+=(1-n)*Math.min((U-i)/10,1)}else if(i<U){n+=(1-n)*Math.min((U-i)/10,1)*Math.sin((Math.PI/2-a)*4/Math.PI)}}}return(1+(m-1)*.75)*n*(.95+m*Math.pow(i/I,3.5))/o}}throw{name:"NotImplementedError",message:"this difficulty type does not exist"}};V.prototype._calc_strain=function(t,i,s,e){var r=i.obj;var a=s.obj;var n=0;var o=(r.time-a.time)/e;var h=Math.pow(k[t],o/1e3);i.delta_time=o;if((r.type&(u.slider|u.circle))!=0){var p=x(M(i.normpos,s.normpos));i.d_distance=p;if(t==F){i.is_single=p>I}n=this._spacing_weight(t,p,o,s.d_distance,s.delta_time,i.angle);n*=S[t]}i.strains[t]=s.strains[t]*h+n};V.prototype._calc_individual=function(t,i,s){var e=[];var r=E*s;var a=Math.ceil(i[0].obj.time/r)*r;var n=0;var o;for(o=0;o<i.length;++o){if(o>0){this._calc_strain(t,i[o],i[o-1],s)}while(i[o].obj.time>a){e.push(n);if(o>0){var h=Math.pow(k[t],(a-i[o-1].obj.time)/1e3);n=i[o-1].strains[t]*h}else{n=0}a+=r}n=Math.max(n,i[o].strains[t])}e.push(n);var p=1;var c=0;var m=0;e.sort(function(t,i){return i-t});for(o=0;o<e.length;++o){c+=Math.pow(e[o],1.2);m+=e[o]*p;p*=T}return{difficulty:m,total:c}};V.prototype._normalizer_vector=function(t){var i=A[0]/16*(1-.7*(t-5)/5);var s=52/i;if(i<O){s*=1+Math.min(O-i,5)/50}return[s,s]};V.prototype._init_objects=function(t,i,s){if(t.length!=i.objects.length){t.length=i.objects.length}var e=this._normalizer_vector(s);var r=w(D,e);for(var a=0;a<t.length;++a){if(!t[a]){t[a]=new y(i.objects[a])}else{t[a].reset()}var n;var o=t[a].obj;if(o.type&u.spinner){t[a].normpos=r.slice()}else if(o.type&(u.slider|u.circle)){t[a].normpos=w(o.data.pos,e)}if(a>=2){var h=t[a-1];var p=t[a-2];var c=M(p.normpos,h.normpos);var m=M(t[a].normpos,h.normpos);var l=j(c,m);var f=c[0]*m[1]-c[1]*m[0];t[a].angle=Math.abs(Math.atan2(f,l))}else{t[a].angle=null}}};function J(){this.calculators=[];this.map=undefined}J.prototype.calc=function(t){var i;var s=this.map=t.map||this.map;if(!s){throw new TypeError("no map given")}if(!this.calculators[s.mode]){switch(s.mode){case n.std:i=new V;break;default:throw{name:"NotImplementedError",message:"this gamemode is not yet supported"}}this.calculators[s.mode]=i}else{i=this.calculators[s.mode]}return i.calc(t)};function L(t){this.nmiss=t.nmiss||0;if(t.n300===undefined){this.n300=-1}else{this.n300=t.n300}this.n100=t.n100||0;this.n50=t.n50||0;var i;if(t.nobjects){var s=this.n300;i=t.nobjects;var e;if(s<0){s=Math.max(0,i-this.n100-this.n50-this.nmiss)}e=s+this.n100+this.n50+this.nmiss;if(e>i){s-=Math.min(s,e-i)}e=s+this.n100+this.n50+this.nmiss;if(e>i){this.n100-=Math.min(this.n100,e-i)}e=s+this.n100+this.n50+this.nmiss;if(e>i){this.n50-=Math.min(this.n50,e-i)}e=s+this.n100+this.n50+this.nmiss;if(e>i){this.nmiss-=Math.min(this.nmiss,e-i)}this.n300=i-this.n100-this.n50-this.nmiss}if(t.percent!==undefined){i=t.nobjects;if(i===undefined){throw new TypeError("nobjects is required when specifying percent")}var r=i-this.nmiss;var a=new L({n300:r,n100:0,n50:0,nmiss:this.nmiss}).value()*100;var n=t.percent;n=Math.max(0,Math.min(a,n));this.n100=Math.round(-3*((n*.01-1)*i+this.nmiss)*.5);if(this.n100>r){this.n100=0;this.n50=Math.round(-6*((n*.01-1)*i+this.nmiss)*.5);this.n50=Math.min(r,this.n50)}this.n300=i-this.n100-this.n50-this.nmiss}}L.prototype.value=function(t){var i=this.n300;if(i<0){if(!t){throw new TypeError("either n300 or nobjects must be specified")}i=t-this.n100-this.n50-this.nmiss}else{t=i+this.n100+this.n50+this.nmiss}var s=(i*300+this.n100*100+this.n50*50)/(t*300);return Math.max(0,Math.min(s,1))};L.prototype.toString=function(){return(this.value()*100).toFixed(2)+"% "+this.n100+"x100 "+this.n50+"x50 "+this.nmiss+"xmiss"};function K(){this.aim=0;this.speed=0;this.acc=0;this.computed_accuracy=undefined}K.prototype.calc=function(t){var i=t.stars;var s=t.map;var e,r,a,n,o,h;var p;var c,m;if(i){s=i.map}if(s){e=s.max_combo();r=s.nsliders;a=s.ncircles;n=s.objects.length;o=s.ar;h=s.od;if(!i){i=(new V).calc(t)}}else{e=t.max_combo;if(!e||e<0){throw new TypeError("max_combo must be > 0")}r=t.nsliders;a=t.ncircles;n=t.nobjects;if([r,a,n].some(isNaN)){throw new TypeError("nsliders, ncircles, nobjects are required (must be numbers) ")}if(n<r+a){throw new TypeError("nobjects must be >= nsliders + ncircles")}o=t.base_ar;if(R(o))o=5;h=t.base_od;if(R(h))h=5}if(i){p=i.mods;c=i.aim;m=i.speed}else{p=t.mods||q.nomod;c=t.aim_stars;m=t.speed_stars}if([c,m].some(isNaN)){throw new TypeError("aim and speed stars required (must be numbers)")}var l=t.nmiss||0;var f=t.n50||0;var u=t.n100||0;var d=t.n300;if(d===undefined){d=n-u-f-l}var _=t.combo;if(_===undefined){_=e-l}var v=t.score_version||1;var g=n/2e3;var b=.95+.4*Math.min(1,g);if(n>2e3){b+=Math.log10(g)*.5}var y=Math.pow(_,.8)/Math.pow(e,.8);var M=new z({ar:o,od:h}).with_mods(p);this.computed_accuracy=new L({percent:t.acc_percent,nobjects:n,n300:d,n100:u,n50:f,nmiss:l});d=this.computed_accuracy.n300;u=this.computed_accuracy.n100;f=this.computed_accuracy.n50;var w=Math.pow(.98,f<n/500?0:f-n/500);var x=this.computed_accuracy.value();var j=0;if(M.ar>10.33){j+=.4*(M.ar-10.33)}else if(M.ar<8){j+=.01*(8-M.ar)}j=1+Math.min(j,j*(n/1e3));var F=this._base(c);F*=b;if(l>0){F*=.97*Math.pow(1-Math.pow(l/n,.775),l)}F*=y;F*=j;var N=1;if(p&q.hd){N*=1+.04*(12-M.ar)}F*=N;if(p&q.fl){var I=1+.35*Math.min(1,n/200);if(n>200){I+=.3*Math.min(1,(n-200)/300)}if(n>500){I+=(n-500)/1200}F*=I}var k=.5+x/2;var S=Math.pow(M.od,2);var T=.98+S/2500;F*=k;F*=T;this.aim=F;var E=this._base(m);E*=b;if(l>0){E*=.97*Math.pow(1-Math.pow(l/n,.775),Math.pow(l,.875))}E*=w;E*=y;if(M.ar>10.33){E*=j}E*=N;E*=(.95+S/750)*Math.pow(x,(14.5-Math.max(M.od,8))/2);this.speed=E;var O=x;switch(v){case 1:var P=n-r-a;O=new L({n300:Math.max(0,d-r-P),n100:u,n50:f,nmiss:l}).value();O=Math.max(0,O);break;case 2:a=n;break;default:throw new{name:"NotImplementedError",message:"unsupported scorev"+v}}var A=Math.pow(1.52163,M.od)*Math.pow(O,24)*2.83;A*=Math.min(1.15,Math.pow(a/1e3,.3));if(p&q.hd)A*=1.08;if(p&q.fl)A*=1.02;this.acc=A;var D=1.12;if(p&q.nf)D*=Math.max(.9,1-.02*l);if(p&q.so)D*=1-Math.pow(P/n,.85);this.total=Math.pow(Math.pow(F,1.1)+Math.pow(E,1.1)+Math.pow(A,1.1),1/1.1)*D;return this};K.prototype.toString=function(){return this.total.toFixed(2)+" pp ("+this.aim.toFixed(2)+" aim, "+this.speed.toFixed(2)+" speed, "+this.acc.toFixed(2)+" acc)"};K.prototype._base=function(t){return Math.pow(5*Math.max(1,t/.0675)-4,3)/1e5};function Q(t){var i;if(t.map){i=t.map.mode}else{i=t.mode||n.std}switch(i){case n.std:return(new K).calc(t)}throw{name:"NotImplementedError",message:"this gamemode is not yet supported"}}osu.timing=s;osu.objtypes=u;osu.circle=e;osu.slider=r;osu.hitobject=a;osu.modes=n;osu.beatmap=o;osu.parser=h;osu.modbits=q;osu.std_beatmap_stats=z;osu.std_diff_hitobject=y;osu.std_diff=V;osu.diff=J;osu.std_accuracy=L;osu.std_ppv2=K;osu.ppv2=Q})();

        // avoid shadowing osu global in page!
        return osu;
    })();
    /*eslint-enable*/


    //https://i.imgur.com/87WeqCL.png
    var //FImg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAQCAYAAAAiYZ4HAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjYwNDg3Q0VFMDdDNTExRTZCRUNBQUJFQjU3NDhGRjk4IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjYwNDg3Q0VGMDdDNTExRTZCRUNBQUJFQjU3NDhGRjk4Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NjA0ODdDRUMwN0M1MTFFNkJFQ0FBQkVCNTc0OEZGOTgiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NjA0ODdDRUQwN0M1MTFFNkJFQ0FBQkVCNTc0OEZGOTgiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6y4WsfAAABoklEQVR42pSSyy8DURTGvzvTh3am1fFoqwjVVERYeHRpayMRsZfYSqwk/AcSOxsbiQUrsbDrgpVIEIKgIiH1aAijQyjVdtoxHXcmJSyYuMmX3HPP+eWeL/mIpmn4zyE6QAiBu1yItLeGe2U5l6rzCb46r6vJJzj9VQLnV54vC7NLG8snojppKYHlU2ODOyODHeRwZx1pWUNefkMu+4C8cot3RkQlp3XQuS8gp0hHmbXFKD8+l8SZhOMMcEeXFWmPXuGmmtcHP4GCpirZk+ssvy9hgdbDv3lgSlYaGgKCN/Go6sXKX6YNoMzhDFZwBKnXrF5ul3osiKPZyXu6vwPGStWCM1hmZdFZT4oY6JoJhVss9VX2tkafqzZzu4eJmY29mIjIF+Cv5EM2VgVnI0x/WO2DIwnx5h7RLQmnV/SexvmPH5oC7hBR0pheLWpH0sEufbqgSlDdUMWoNn8AjdW24FPqBceS0egxNe3hrN68LMNlgWQWDQPwu4oBKymAZWE3A4yVEvGYPcnIyGuoME2fHj7eitEaN+IWBkNms+S/8f4QYACrg5Lyg2EOtgAAAABJRU5ErkJggg==",
        //UImg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAMAAAANIilAAAAA1VBMVEUAAACioqKbm5vy8vLX19fv7+/Ozs6ioqK0tLTR0dHJycmqqqqzs7Ojo6Oamprb29vT09Ourq6mpqb///8mJiYzMzMxMTEsLCwpKSkvLy81NTUjIyMgICAeHh5JSUlISEhRUVFFRUUZGRkcHBympqZaWlqrq6s6Ojo+Pj5WVlbExMSjo6NCQkI3NzfY2Ni4uLivr695eXlycnJMTEze3t66urqoqKj8/Pz4+Pjg4ODa2tq+vr60tLSbm5t+fn5ra2vk5OTj4+OTk5OMjIyFhYVpaWlmZmaYnrJ3AAAAE3RSTlMAUlL+8f7nQ6np562iS0jy8aRXW3S7rwAAAbZJREFUSMft1dlymzAYhuGmxnaapOtnLLGvNjgBL+DsW/f7v6T+mrrIbQXKccJzAqPROyAxGl71er2X4PhoiH8N3hw+JX33AWrGWNu+vsLykeV+npDc9/0gEhbfvmA41rXA3E0YRSxJLJ9QSQI/PIWhbc88z+OMMb67TISsYMzc4qO2/VssOEFgekmFI01blpYrsdoScR4EgRNbGHa3bv25cqUFampZQKZxDHS2jnOPrSMNcZYkXkT7VmQOx6CjTWn6HJCtC6zixPZJlpk/MOpoJ4TiScOhOOEhifK8WOK4qyVriiWKvUzEtOgVjI5WGZ/zvA6FFS7ftrb8N4q5RLFZZgG5Az4p2wPZ8jlgNa0F3NEHm3CeAgfqc3SFC/bHV2DDdngF3DuEX6hbYmDNGj9Btc0EuxL3Ik5b20PcTK1GucW+JaNta2vJCBtLqh9v9tuIhlrfmQyQyzabzWbf0/NT4TatTBqat7YEmEohxdF0n2zVTy6amcVMKPWtXPODuWOHC8E3G7JVO8F1ZqroW2LgNrNVyrWmJeMhrh+i/9Jis8QltbragNp7Okd6J6OB8g/T6/WevV831F5ngplDwwAAAABJRU5ErkJggg==",
        FImgNew = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDIzLjAuMywgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCAzMiAxNiIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMzIgMTY7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPHN0eWxlIHR5cGU9InRleHQvY3NzIj4KCS5zdDB7ZmlsbDojQjlCOUI5O30KCS5zdDF7ZmlsbDojRkY1QTVBO2ZpbHRlcjp1cmwoI0Fkb2JlX09wYWNpdHlNYXNrRmlsdGVyKTt9Cgkuc3Qye21hc2s6dXJsKCNtYXNrMF8xXyk7fQoJLnN0M3tmaWxsOiNDNEM0QzQ7fQoJLnN0NHtmaWxsOiNBRkFGQUY7fQoJLnN0NXtmaWxsOiNBNEE0QTQ7fQoJLnN0NntmaWxsOiMzMzMzMzM7fQo8L3N0eWxlPgo8cGF0aCBjbGFzcz0ic3QwIiBkPSJNOCwwaDE2YzQuNCwwLDgsMy42LDgsOGwwLDBjMCw0LjQtMy42LDgtOCw4SDhjLTQuNCwwLTgtMy42LTgtOGwwLDBDMCwzLjYsMy42LDAsOCwweiIvPgo8ZGVmcz4KCTxmaWx0ZXIgaWQ9IkFkb2JlX09wYWNpdHlNYXNrRmlsdGVyIiBmaWx0ZXJVbml0cz0idXNlclNwYWNlT25Vc2UiIHg9Ii0xLjMiIHk9Ii05IiB3aWR0aD0iMzUuMyIgaGVpZ2h0PSIzMCI+CgkJPGZlQ29sb3JNYXRyaXggIHR5cGU9Im1hdHJpeCIgdmFsdWVzPSIxIDAgMCAwIDAgIDAgMSAwIDAgMCAgMCAwIDEgMCAwICAwIDAgMCAxIDAiLz4KCTwvZmlsdGVyPgo8L2RlZnM+CjxtYXNrIG1hc2tVbml0cz0idXNlclNwYWNlT25Vc2UiIHg9Ii0xLjMiIHk9Ii05IiB3aWR0aD0iMzUuMyIgaGVpZ2h0PSIzMCIgaWQ9Im1hc2swXzFfIj4KCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik04LDBoMTZjNC40LDAsOCwzLjYsOCw4bDAsMGMwLDQuNC0zLjYsOC04LDhIOGMtNC40LDAtOC0zLjYtOC04bDAsMEMwLDMuNiwzLjYsMCw4LDB6Ii8+CjwvbWFzaz4KPGcgY2xhc3M9InN0MiI+Cgk8cGF0aCBjbGFzcz0ic3QzIiBkPSJNMTYtOWwxNy4zLDMwSC0xLjNMMTYtOXoiLz4KCTxwYXRoIGNsYXNzPSJzdDQiIGQ9Ik0yNy41LDNMMzQsMTQuMkgyMUwyNy41LDN6Ii8+Cgk8cGF0aCBjbGFzcz0ic3Q1IiBkPSJNNy41LTJsMy45LDYuOEgzLjZMNy41LTJ6Ii8+Cgk8cGF0aCBjbGFzcz0ic3Q1IiBkPSJNOS41LDEzbDMuOSw2LjhINS42TDkuNSwxM3oiLz4KPC9nPgo8Zz4KCTxwb2x5Z29uIGNsYXNzPSJzdDYiIHBvaW50cz0iMTEsMy45IDIxLjMsMy45IDIxLjMsNS4yIDEyLjUsNS4yIDEyLjUsNy41IDIwLjgsNy41IDIwLjgsOC44IDEyLjUsOC44IDEyLjUsMTIuMyAxMSwxMi4zIAkiLz4KPC9nPgo8L3N2Zz4K",
        v2Img = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAgCAMAAACxWgF2AAAA4VBMVEVHcEwAAAAAAAAAAAD+yyEAAAAAAAAAAAAAAAAAAAANCwH3xiBIOQkAAADouh6HbBHarhz6yCD3xiDvvx+McBLLohruvh/muB6fgBS0kBfuvh/OpRsAAAD2xSD2xSAAAAA2KwephxYAAADFnhlkUA2FahHcsBzRpxuPchMtJAbbrxzhtB3tvh/qux6vjBfxwR8QDQKlhBUAAABiTgwWEgJxWg9FNwk5Lgf/zCFUVFTkuC2ag0X+yyHasTFkX1H2xSVzaE7uvyiBckvGozi8mzz7ySLQqjWOe0ixkz+mjELywyWzBV0HAAAAOHRSTlMAHQYI/Q0YIANgPNgQNOYIe/DKsR9TdaAUOsRdFPThJVCeLbppf9TIhlB+3unel9dOqlF+ZYVzcPZxy64AAAHkSURBVBgZhcCFQttQGAXgP2mSXmq4u7uz7Zy41Nj7P9B6I01hBT6pLG60LcxjtTcW5ZOtFXzgD1Bb2ZIPzFV84mOQ+CitmjJDrWOewQCldSW1Thvfa3dkSi3hJ0tKKmvL+MnympTMTWj+MPRQSJkB2SiM3xOUNk3JqW0LWuSRAbQh6WFELQxQsLaVaI0d5AYZ6UEbkcM+SS8lY5R2GjKhdlGKyDACkJAhUjIAUjJAaVeJSOcAFY/MAPTJd4QMAfTJPkoHHRF1g6mATAHEpIvMywCMyCEqN0rsR9RCMkFApiiMyThC5dEWx0JtTI7hkX3khiRdTFmOGBZqLhlHIRlBS0IyQ80yxLjHjJT0SA9alJLvmHFviPOAGRm1AJpHptB8FB4csVt3qEWciKH1yTCBNkDurmWLal5hhkdyjImAZN913QTwkbtqKhG7e4FaQDLBRMxSgMJF1xYR5ZxZqMUcQYtZCnxo1pmjZKJxcopa5CIXuYUEhdOThmhq72gfP9k/2lOSMw+P8SUfueNDU0p2q4fv9Vq2VJRxjpLvY55zQ8mU3b1Eyf87wH8uu7bUlHN9i6/dXjtKZpjNp+eehXms3vNT05QPGkbrZaHy9uf11+vvt4XCS8toyCfKdozmPIZjKyn9A+yZ82+JDdzhAAAAAElFTkSuQmCC",
        //RIP bloodcat
        //bloodcatBtnImg = "data:image/png;base64,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",

        loaderImg = "data:image/gif;base64,R0lGODlhEAAQAPIAAKmp/wAAAIGBwisrQgAAAEFBYlZWgmFhkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==",

        //subImg = "data:image/png;base64,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",
        //subbedImg = "data:image/png;base64,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",

        settingsImg = "data:image/png;base64,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",

        modIconImgs = {
            //http://puu.sh/n41q9/dd04d2b8b6.png
            "NM": "data:image/png;base64,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",

            //http://w.ppy.sh/2/22/No_Fail.png
            "NF": "data:image/png;base64,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",

            //http://w.ppy.sh/7/7a/Easy.png
            "EZ": "data:image/png;base64,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",

            //http://w.ppy.sh/b/b9/Hidden.png
            "HD": "data:image/png;base64,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",

            //http://w.ppy.sh/2/28/Hard_Rock.png
            "HR": "data:image/png;base64,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",

            //http://w.ppy.sh/c/c6/Sudden_Death.png
            "SD": "data:image/png;base64,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",

            //http://w.ppy.sh/1/16/Double_time.png
            "DT": "data:image/png;base64,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",

            //http://w.ppy.sh/b/bc/Half-time.png
            "HT": "data:image/png;base64,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",

            //http://w.ppy.sh/f/f9/Nightcore.png
            "NC": "data:image/png;base64,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",

            //http://w.ppy.sh/4/4d/Flashlight.png
            "FL": "data:image/png;base64,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",

            //http://w.ppy.sh/2/22/Spun_Out.png
            "SO": "data:image/png;base64,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",

            //http://w.ppy.sh/4/46/Perfect.png
            "PF": "data:image/png;base64,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",

            //http://w.ppy.sh/8/87/FadeIn.png
            "FI": "data:image/png;base64,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",

            //http://w.ppy.sh/1/12/4K.png
            "4K": "data:image/png;base64,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",

            //http://w.ppy.sh/0/0f/5k.png
            "5K": "data:image/png;base64,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",

            //http://w.ppy.sh/8/80/6k.png
            "6K": "data:image/png;base64,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",

            //http://w.ppy.sh/e/ea/7k.png
            "7K": "data:image/png;base64,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",

            //http://w.ppy.sh/e/e9/8k.png
            "8K": "data:image/png;base64,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",

            //http://w.ppy.sh/6/67/9k.png
            "9K": "data:image/png;base64,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",

            "TD": "data:image/png;base64,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",

            "MR": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEQAAABCCAMAAADZlICdAAACJVBMVEVHcEwPJBIADAAADgANIhAMHg4PJhMOIxEPJBHs+f4OIRAMIA4AEAAIFAoPJhIACgANIBD////2//8AEwIRKxULHQ0NIRASLRUTMBYRKRMQJxIJJQ30/v8EGQYHEgjx/P8CFgQXOhsHGgkVMhgJKQ0KLA8IIQsMKA/v+v8ONhP6//8WNhoPKxIFHwgOMhIJFgseTSMNJBANHw8OLhEYPRwaQB8ROhYiUygrbDPj6OQJMA78//+InoonHyIAGALu8u/i8fIsJSi2wrcrZzLb6uz4///q9/p4kIEBHgQZSB7q7usiHx5HX0w1UzkhJx5adV/W5eYhXifO4N8ySTbI29hmfWsdQyIrSC4TRBgFJQkeSSMudDaasKewxL76+vqqv7lOd1SLnJKQo5soXS4xfDofPCMjLSHF2NQ/akQSShh/l4ohZinA0c8wijvm9PcZWCAnQSkPPxQ6UD0sVTIdIho5ikL19vW7x7xSbFg7XkA1WzlGZUlLalAoNiiVrKIygTucvaqiyK+nubJAhkl3mH5jpGwmSytcf2MuPC83eD4/oUs+lkjGzseaqpyFoZGetavP19A0bjuPrpe4y8d7pYdyhXVDWEi12MGJs5Jsl3dTilsmdS9Gek5ziH2UqKGLp46o07BqiXI2lEFArk2msafV3daUt6Ger6Db4NxOhVdllm7i9OTJ1crC6M1Wj1ymuagYGBTQ6uFMtlhKyVpPyF6S2Jtvw3yo4SqrAAAAAXRSTlMAQObYZgAACRJJREFUWMPt2OdX28gWAPAoMW6bNZZQULMXhFxxWYI7xtgGjDEGTO+9994DoRxaElIgkATSe9/N7it/3xuNTQKE5J28/bIf3v0gy7Lvb+7cGc/hcObM3yp++fV/j0NDJPwLQUeNn2XivxIyiPz6f+RrBBHFQowgYjG8gXfi6Jv/EshxBBFSFI2IeYymaKFMKJQh4h9ExEJcqzVSiEgsAzdaHNdqtDTygwhCGa9vFYI8hNLubQUtxjsvxi7KfhTBzbfQ12ockRnZW2i2Xt2K7tVSMuRIyMAEEb5hfIhPQ2TG9TfvXetGmlJfmvJOj7LllVWkkQJTw7UUzmgpitLyV9AqLW5kDvt1HBEaxws+ujfUOK6+/v7jrRqrrcrGjnSai8o5/lpNWsii+SKLlsANI1znGCdDTkO0c1P/er+SQRBVrid3X4bse66e9VuZmU3Xq+A1Y3ba6/VmF5ktey8jL6fKNacjs03/flKwTlpm0LUnBeP2TLQlp8DlCs6Ng+vq3JzLFSnamHqzbs9scmXPcMhR5GexgA+RTHUJXVtDK+36F66OZe9cTSZ6cMXV1JKhH3e5W0ZHr6PzGWRGBH3c+xjNtjNg9WGe+AQyjx44C6Z7272/D+809QDktyveD3YDuV7woca67vqgJwmyyvWy/x4aycDFUeMEQqtm0Jbe36e234GXx009vRDJNpOW6oJsu32u6bUFpwnztHfxHnpJTceMr5C9pp7RCOjHm7rRpwCKIYQRIHquqOm1maAAUtABEK3sBCKS8gGQzKZZ+7rr7vtMvT4CkQOAWGJIp+uWHUynruDD8GOAIAJpNEQnkOveas782u2dtVjm0Q3Qk7fb3mw1YRwpyLZwqjbQCb0+iK4CvZD5BiJkXkyNGNUz6BZJaAvRSj1Y4vGpaRVOj0xNA6r6TdPq/GN0Om0UItLTEAHCtL7AKbozu5KhmLGtSnXlVlFVditDyTqzW7U4YSlaKfC6dupYe+XWGCM+HRHRjIaWCWkN2ALgShFGhiAYhkJkFKMFLSX11vGe8RqblSXVFC06iSTCAJsveiLxO5H/ycIAj8QyisIJ0sDaxh0jm1U2q4HEZbEkkBZD5NGIPgSLHQ2BIPZAJKYJkmNtVY7u3a6F+tLOLo4CKxzLOoHEpOhZCxRpInwiFcko0mCrcwzvYxvhuY/L1X4D8xMiOo4IjhpSESKjKYqm4aykiYlyKUITBpvDuTj5x8dqT0vSH+XhytszGlF0CLngawQYFEXwgYPjB0CCRPCEtKZduzq4614tLt5H7y6E+9A2k0j6LSRRgAgJzsCyrIEjCQKc+WJQGc7Z2q9N1lf4ijxdS+hOV/EN9JEGESQeRaTphyEXiGmcs3Z2poVC4FgzcAROi8EjQ13OpHMfvVns36xwPw137aANGqEomieNIvIjCIJzbE21f3v3Qakjrcpm4HCapghDnbMjpxubCXsK83Tznq5X6IqWEgtgovwEIpebTMX+8XcHnlnfckdHfY6jiuVAbwi2ztm/7x5Y8IcfpuaO8UizhZCdjqQj5YUL4afova7ie5K3HZOTk84qlsRxgk1zOrvR4IR/YsXdveAvbkBv60kKtPYUJGUhN3czvJF6d8FzKW+ptH7x2jWHjSMIkk3r38dyyz3+zTJ344S/+CY6YDUQiOAURJ5SnldSHp4f4ituzOspdXZMtlcZIOLsTh0oL/5UqAu0QqQ7jSVoWMoJRAoRT1EZFgmHI+jlUDtoZ52BJEg2tK+QSHJXytuwvDth/0Szu6LdxuGwlCjyS/pnZEzCF3EbvTEBCh+aTWuvhwjHOioAEuhuxXS+vc2JkZJA2TYshR8/hsTBkItS7iT5Lnn4tnX5J26gl2sczpw6FiDmp5hEIsHaGsFLat/NRp2i7EqpjaMQaXrcMSRdjmgKMd+8pziYCnrouZPnmw3lQIS0dYNCJJKHuTqJRBf0YZKksu0cUIqQL+UoAjaaZj4wNO8JRzBFJOwvbgSltIOvkqSqki8kqaKPp4Ye5oH7kh4nWDhKLD9eiVxEMTOBvEK+hkDbhP9TJOCbTQMIRxgG+GysYQVYupJgErjm9oCZ8qv8ubFwNoliXL3BI/6FCvcAtVnZrAtcDuU4WI6BhUiSgiUgPam7j0d8D+o7HFaSFh2bTrqAJvVPwUQ+FUsfBfLaWlEF+GpPqcPKaRvhbGAJEsXtNlCWbqilfhKsMnUMSZeLKW50FVM0FxY25OqS4MwlgQaAWKpz+WysuQH7/KLLe1t/1ckj8qOIQEawoV3wOfZoIACufXwfQNVpVtVMKgYUxY0KaF2Gdel+W/zzGkRiPYm7cCEuTkCRtuF72GH/sOZHcNylkJXsjDSU6QJDfXxtEkUb7LJi7dnVepakBXFxUeQCCIAY6vpfgc+xxkdwER7q+AGHeuycUaVvX1teeoXyBen6SvgPsHelYN2oi6CAKJICIu6ikXXcXwKIYqAVDhUsS4Jd4f8osaYNLjofrDaW6NxlN+C+wzbsLGm8+NOFlJQvyIWLFmv/4LIC7ik495s34dx9RWqjxRAC5/T9/tLtg53d5VQMUyhK1tVGrUADjChyDiKMhe24+oRvZm6QrzepLAiHDFTWao0kW//P588W6/tLh9PmWvqay7DWfEaj0fCZMUSZrFSmaIz6Z8/v8nl5wSE+WxfkfykSd3MtozWaQ1cHneDUDVntZlWtyTDGmUwgX6kEuRA5m5ycrEwxMeZQP0QOWwfWUoEllbSpNRpGa9bbraxdb1ZrGUZjUiaAcQEAI4YkAEWpUZkzbsOtGdsQFTtY2fJae4ZKYzJpGLVFDQANX8BhegKMKBIPb5OVplrVQHRPLgUUGOZrfHvQMThYY2ZMIMvEhzI2fMKxiCHnz/OMUpm1AvYq2Fa7vu6ld1f6799/9nzQrjZFx83K+jL6+SMRQ2JvEpLP3QkEMN/A5aLxmtHe4f77g8//MZxRm5/1ZdTzp0QUOQeDf69say0cMSXk59dmmPWjNb3Dw3qVKQuknvtOxJCzMPgH8fHxZxOysrLy8021teoMdS1fByDOfjuiyJnjz/iaQOFQys/P4o2z34vDfxbEH40YBSW+C4CI/078vf518h8h2o4bfZ5GmQAAAABJRU5ErkJggg==",

        };

    var OLDSITE = 0,
        NEWSITE = 1;

    var apikey = null,
        hasKey = false,
        siteType = OLDSITE,
        osuPink = "#cc2e8a";

    /* eslint-disable no-unused-vars */
    const GRAVEYARD = -2;
    const WIP = -1;
    const PENDING = 0;
    const RANKED = 1;
    const APPROVED = 2;
    const QUALIFIED = 3;
    const LOVED = 4;
    /* eslint-enable no-unused-vars */

    var modnames = [
            {val: 1, name: "No Fail", short: "NF"},
            {val: 2, name: "Easy", short: "EZ"},
            {val: 4, name: "Touch Device", short: "TD"},
            {val: 8, name: "Hidden", short: "HD"},
            {val: 16, name: "Hard Rock", short: "HR"},
            {val: 32, name: "Sudden Death", short: "SD"},
            {val: 64, name: "Double Time", short: "DT"},
            {val: 128, name: "Relax", short: "RX"},
            {val: 256, name: "Half Time", short: "HT"},
            {val: 512, name: "Nightcore", short: "NC"},
            {val: 1024, name: "Flashlight", short: "FL"},
            {val: 2048, name: "Autoplay", short: "AT"},
            {val: 4096, name: "Spun Out", short: "SO"},
            {val: 8192, name: "Relax2", short: "AP"},
            {val: 16384, name: "Perfect", short: "PF"},
            {val: 32768, name: "Key4", short: "4K"},
            {val: 65536, name: "Key5", short: "5K"},
            {val: 131072, name: "Key6", short: "6K"},
            {val: 262144, name: "Key7", short: "7K"},
            {val: 524288, name: "Key8", short: "8K"},
            {val: 1048576, name: "Fade In", short: "FI"},
            {val: 2097152, name: "Random", short: "RD"},
            {val: 4194304, name: "Last Mod", short: "LM"},
            {val: 16777216, name: "Key9", short: "9K"},
            {val: 33554432, name: "Key10", short: "10K"},
            {val: 67108864, name: "Key1", short: "1K"},
            {val: 134217728, name: "Key3", short: "3K"},
            {val: 268435456, name: "Key2", short: "2K"},
            {val: 536870912, name: "Score V2", short: "V2"},
            {val: 1073741824, name: "Mirror", short: "MR"}
        ],
        // if the first is set, the second has to be set also
        doublemods = [
            ["NC", "DT"],
            ["PF", "SD"]
        ],
        countryCodes = {"BD": "Bangladesh", "BE": "Belgium", "BF": "Burkina Faso", "BG": "Bulgaria", "BA": "Bosnia and Herzegovina", "BB": "Barbados", "WF": "Wallis and Futuna", "BL": "Saint Barthelemy", "BM": "Bermuda", "BN": "Brunei", "BO": "Bolivia", "BH": "Bahrain", "BI": "Burundi", "BJ": "Benin", "BT": "Bhutan", "JM": "Jamaica", "BV": "Bouvet Island", "BW": "Botswana", "WS": "Samoa", "BQ": "Bonaire, Saint Eustatius and Saba ", "BR": "Brazil", "BS": "Bahamas", "JE": "Jersey", "BY": "Belarus", "BZ": "Belize", "RU": "Russia", "RW": "Rwanda", "RS": "Serbia", "TL": "East Timor", "RE": "Reunion", "TM": "Turkmenistan", "TJ": "Tajikistan", "RO": "Romania", "TK": "Tokelau", "GW": "Guinea-Bissau", "GU": "Guam", "GT": "Guatemala", "GS": "South Georgia and the South Sandwich Islands", "GR": "Greece", "GQ": "Equatorial Guinea", "GP": "Guadeloupe", "JP": "Japan", "GY": "Guyana", "GG": "Guernsey", "GF": "French Guiana", "GE": "Georgia", "GD": "Grenada", "GB": "United Kingdom", "GA": "Gabon", "SV": "El Salvador", "GN": "Guinea", "GM": "Gambia", "GL": "Greenland", "GI": "Gibraltar", "GH": "Ghana", "OM": "Oman", "TN": "Tunisia", "JO": "Jordan", "HR": "Croatia", "HT": "Haiti", "HU": "Hungary", "HK": "Hong Kong", "HN": "Honduras", "HM": "Heard Island and McDonald Islands", "VE": "Venezuela", "PR": "Puerto Rico", "PS": "Palestinian Territory", "PW": "Palau", "PT": "Portugal", "SJ": "Svalbard and Jan Mayen", "PY": "Paraguay", "IQ": "Iraq", "PA": "Panama", "PF": "French Polynesia", "PG": "Papua New Guinea", "PE": "Peru", "PK": "Pakistan", "PH": "Philippines", "PN": "Pitcairn", "PL": "Poland", "PM": "Saint Pierre and Miquelon", "ZM": "Zambia", "EH": "Western Sahara", "EE": "Estonia", "EG": "Egypt", "ZA": "South Africa", "EC": "Ecuador", "IT": "Italy", "VN": "Vietnam", "SB": "Solomon Islands", "ET": "Ethiopia", "SO": "Somalia", "ZW": "Zimbabwe", "SA": "Saudi Arabia", "ES": "Spain", "ER": "Eritrea", "ME": "Montenegro", "MD": "Moldova", "MG": "Madagascar", "MF": "Saint Martin", "MA": "Morocco", "MC": "Monaco", "UZ": "Uzbekistan", "MM": "Myanmar", "ML": "Mali", "MO": "Macao", "MN": "Mongolia", "MH": "Marshall Islands", "MK": "Macedonia", "MU": "Mauritius", "MT": "Malta", "MW": "Malawi", "MV": "Maldives", "MQ": "Martinique", "MP": "Northern Mariana Islands", "MS": "Montserrat", "MR": "Mauritania", "IM": "Isle of Man", "UG": "Uganda", "TZ": "Tanzania", "MY": "Malaysia", "MX": "Mexico", "IL": "Israel", "FR": "France", "IO": "British Indian Ocean Territory", "SH": "Saint Helena", "FI": "Finland", "FJ": "Fiji", "FK": "Falkland Islands", "FM": "Micronesia", "FO": "Faroe Islands", "NI": "Nicaragua", "NL": "Netherlands", "NO": "Norway", "NA": "Namibia", "VU": "Vanuatu", "NC": "New Caledonia", "NE": "Niger", "NF": "Norfolk Island", "NG": "Nigeria", "NZ": "New Zealand", "NP": "Nepal", "NR": "Nauru", "NU": "Niue", "CK": "Cook Islands", "XK": "Kosovo", "CI": "Ivory Coast", "CH": "Switzerland", "CO": "Colombia", "CN": "China", "CM": "Cameroon", "CL": "Chile", "CC": "Cocos Islands", "CA": "Canada", "CG": "Republic of the Congo", "CF": "Central African Republic", "CD": "Democratic Republic of the Congo", "CZ": "Czech Republic", "CY": "Cyprus", "CX": "Christmas Island", "CR": "Costa Rica", "CW": "Curacao", "CV": "Cape Verde", "CU": "Cuba", "SZ": "Swaziland", "SY": "Syria", "SX": "Sint Maarten", "KG": "Kyrgyzstan", "KE": "Kenya", "SS": "South Sudan", "SR": "Suriname", "KI": "Kiribati", "KH": "Cambodia", "KN": "Saint Kitts and Nevis", "KM": "Comoros", "ST": "Sao Tome and Principe", "SK": "Slovakia", "KR": "South Korea", "SI": "Slovenia", "KP": "North Korea", "KW": "Kuwait", "SN": "Senegal", "SM": "San Marino", "SL": "Sierra Leone", "SC": "Seychelles", "KZ": "Kazakhstan", "KY": "Cayman Islands", "SG": "Singapore", "SE": "Sweden", "SD": "Sudan", "DO": "Dominican Republic", "DM": "Dominica", "DJ": "Djibouti", "DK": "Denmark", "VG": "British Virgin Islands", "DE": "Germany", "YE": "Yemen", "DZ": "Algeria", "US": "United States", "UY": "Uruguay", "YT": "Mayotte", "UM": "United States Minor Outlying Islands", "LB": "Lebanon", "LC": "Saint Lucia", "LA": "Laos", "TV": "Tuvalu", "TW": "Taiwan", "TT": "Trinidad and Tobago", "TR": "Turkey", "LK": "Sri Lanka", "LI": "Liechtenstein", "LV": "Latvia", "TO": "Tonga", "LT": "Lithuania", "LU": "Luxembourg", "LR": "Liberia", "LS": "Lesotho", "TH": "Thailand", "TF": "French Southern Territories", "TG": "Togo", "TD": "Chad", "TC": "Turks and Caicos Islands", "LY": "Libya", "VA": "Vatican", "VC": "Saint Vincent and the Grenadines", "AE": "United Arab Emirates", "AD": "Andorra", "AG": "Antigua and Barbuda", "AF": "Afghanistan", "AI": "Anguilla", "VI": "U.S. Virgin Islands", "IS": "Iceland", "IR": "Iran", "AM": "Armenia", "AL": "Albania", "AO": "Angola", "AQ": "Antarctica", "AS": "American Samoa", "AR": "Argentina", "AU": "Australia", "AT": "Austria", "AW": "Aruba", "IN": "India", "AX": "Aland Islands", "AZ": "Azerbaijan", "IE": "Ireland", "ID": "Indonesia", "UA": "Ukraine", "QA": "Qatar", "MZ": "Mozambique"},
        playerCountries = null;

    var defaultSettings = {
        showMirror: true,
        showMirror2: false,
        showMirror3: false,
        showMirror4: false,
        showMirror5: false,
        showMirror6: false,
        //showSubscribeMap: false,
        apikey: null,
        failedChecked: true,
        showDates: true,
        showPpRank: false,
        fetchPlayerCountries: true,
        showTop100: true,
        showDetailedHitCount: true,
        showHitsPerPlay: true,
        fetchUserpageMaxCombo: true,
        fetchFirstsInfo: true,
        rankingVisible: false,
        forceShowDifficulties: false,
        pp2dp: true,
        showSiteSwitcher: false,
        showMpGrades: true,
        showRecent: true,
        osupreview: true,
        osupreview2: true,
        showBWS: false
    };

    var settings = {};
    function initSettings(){
        var promises = [];
        //promises.push(GMX.setValue("apikey", null));
        //promises.push(GMX.setValue("playerCountries", "{}"));
        //promises.push(GMX.setValue("mapperSubList", "[]"));
        //promises.push(GMX.setValue("mapSubList", "[]"));
        var settings = {};
        for(let settingVar in defaultSettings){
            promises.push(GMX.getValue(settingVar, defaultSettings[settingVar]).then((result) => {
                settings[settingVar] = result;
            }));
        }
        promises.push(GMX.getValue("playerCountries", "{}").then((result) => {
            playerCountries = typeof(result) === "string" ? JSON.parse(result) : {};
        }));
        return Promise.all(promises).then(() => {
            settings.displayTopNum = settings.showTop100 ? 100 : 50;
            settings.apikey = nullIfBlankOrNull(settings.apikey);
            //settings.apikey = null;
            return settings;
        });
    }

    /*eslint-disable*/
    //peppy code
    (function($) {
        $.fn.textWidth = function() {
            var html_org = $(this).html();
            var html_calc = '<span>' + html_org + '</span>';
            $(this).html(html_calc);
            var width = $(this).find('span:first').width();
            $(this).html(html_org);
            return width;
        }
        ;
        $.fn.marquee = function(args) {
            var that = $(this);
            var textWidth = that.textWidth()
              , actualWidth = that.width()
              , offset = 0
              , width = 0
              , css = {
                'text-indent': that.css('text-indent'),
                'overflow': that.css('overflow'),
                'white-space': that.css('white-space')
            }
              , marqueeCss = {
                'text-indent': width,
                'overflow': 'hidden',
                'white-space': 'nowrap'
            }
              , args = $.extend(true, {
                count: -1,
                speed: 1e1,
                leftToRight: false
            }, args)
              , i = 0
              , stop = (actualWidth - textWidth)
              , dfd = $.Deferred();
            if (textWidth < actualWidth || that.attr('stop') == -1)
                return;
            that.attr('stop', -1);
            function go() {
                if (!that.length)
                    return dfd.reject();
                if (that.attr('stop') >= 0) {
                    that.css(css);
                    that.attr('stop', 0);
                    return dfd.resolve();
                }
                if (width == stop) {
                    i++;
                    if (i >= args.count) {
                        setTimeout(go, args.speed);
                        return;
                    }
                    if (args.leftToRight) {
                        width = textWidth * -1;
                    } else {
                        width = offset;
                    }
                }
                that.css('text-indent', width + 'px');
                if (args.leftToRight) {
                    width++;
                } else {
                    width--;
                }
                setTimeout(go, args.speed);
            }
            if (args.leftToRight) {
                width = textWidth * -1;
                width++;
                stop = offset;
            } else {
                width--;
            }
            that.css(marqueeCss);
            go();
            return dfd.promise();
        }
        ;
    })($);
    /*eslint-enable*/

    $(document).ready(reloadOsuplus);

    function reloadOsuplus(){
        initSettings().then((_settings) => {
            settings = _settings;
            var url = window.location.href;
            if(isOldSite(url)){
                siteType = OLDSITE;
            }else{
                siteType = NEWSITE;
            }
            if(siteType === OLDSITE){
                mainInit();
            }else{
                osuplusNew().init();
            }
        });
    }

    var getBeatmapsCache = (function(){
        var callbacks = {},
            beatmapsCache = {};

        function getBeatmapsCache(params, callback){
            var id = params.b;
            if(id in beatmapsCache){
                callback(beatmapsCache[id]);
            }else if(id in callbacks){
                callbacks[id].push(callback);
            }else{
                callbacks[id] = [callback];
                getBeatmaps(params, function(response){
                    beatmapsCache[id] = response;
                    callbacks[id].forEach(function(cb){
                        cb(response);
                    });
                    delete callbacks[id];
                });
            }
        }

        return getBeatmapsCache;
    })();

    function isOldSite(url){
        if(url.match(/^https?:\/\/(osu|old)\.ppy\.sh\/u\//) ||
           url.match(/^https?:\/\/(osu|old)\.ppy\.sh\/([bs]\/|p\/beatmap\?)/) ||
           url.match(/^https?:\/\/(osu|old)\.ppy\.sh\/p\/pp/) ||
           url.match(/^https?:\/\/(osu|old)\.ppy\.sh\/p\/beatmaplist/)){
            return true;
        }else{
            return false;
        }
    }

    function mainInit(){
        $(".osuplus").remove();
        apikey = settings.apikey;
        if(apikey !== null){
            hasKey = true;
        }else{
            hasKey = false;
            displayGetKey();
        }
        insertSettings();
    }

    function insertSettings(){
        function makeSettingRow(title, description, option){
            return `<tr class='row2'><td><b>${title}</b>
                    ${description ? `<br>${description}` : ""}
                    </td><td class='settingOption'>${option}</td></tr>`;
        }

        function makeCheckboxOption(property){
            return `<input type='checkbox' id='settings-${property}'
                    ${settings[property] ? " checked" : ""}>`;
        }

        if(!$(".osuplus-settings-style").length){
            $(document.head).append($("<style class='osuplus osuplus-settings-style'></style>").html(
                `#osuplusSettingsBtn {background:rgba(0,0,0,0.2) url(${settingsImg}) no-repeat 5px 10px; position:fixed; width:42px; height:47px; right:80px; cursor:pointer; z-index:10000;}
                #osuplusModalOverlay {position:fixed; top:0px; width:100%; height:100%; z-index:19999; background:rgba(0,0,0,0.5);}
                #osuplusModal {position:fixed; width:600px; z-index:20000; top:30px; background:white;
                    margin-left:-300px; left:50%; border-radius:10px; padding:15px;}
                .osuplusModalClose {position:absolute; right:15px; top:15px;}
                .osuplusSettingsContent {height:400px; overflow:auto; padding:10px; margin-bottom:10px;}
                .osuplusSettingsTable {border-collapse:collapse;}
                .osuplusSettingsTable tr {margin:1px;}
                .settingOption {text-align:right;}
                #osuplusModal {color:black;}
                #osuplusModal h1, #osuplusModal h2 {color:${osuPink};}`
            ));
        }

        $(document.body).prepend("<div id='osuplusSettingsBtn' class='osuplus'></div>");
        $(document.body).append(
            $("<div id='osuplusModalOverlay' class='osuplus' style='display:none;'></div>"),
            $("<div id='osuplusModal' class='osuplus' style='display:none;'></div>").append(
                "<h1>osuplus settings</h1>",
                "<button class='osuplusModalClose'>x</button>",
                $("<div class='osuplusSettingsContent'>").append(
                    $("<div>").append(
                        "<h2>General</h2>",
                        $("<table class='osuplusSettingsTable' width='100%'>").append(
                            makeSettingRow("API key", null, `<input type='text' style='display:none' id='settings-apikey' name='apikey' value='${settings.apikey}'>
                                                          <label><input type='checkbox' id='show-apikey'>Show</label>`),
                            makeSettingRow("Show Site Switcher", null, makeCheckboxOption("showSiteSwitcher"))
                        )
                    ),
                    $("<div>").append(
                        "<h2>Beatmaps page</h2>",
                        $("<table class='osuplusSettingsTable' width='100%'>").append(
                            makeSettingRow("Show Beatconnect mirror", null, makeCheckboxOption("showMirror")),
                            makeSettingRow("Show Sayobot mirror", null, makeCheckboxOption("showMirror2")),
                            makeSettingRow("Show NeriNyan mirror", null, makeCheckboxOption("showMirror3")),
                            makeSettingRow("Show Mino mirror", null, makeCheckboxOption("showMirror4")),
                            makeSettingRow("Show OMDB shortcut", null, makeCheckboxOption("showMirror5")),
                            makeSettingRow("Show dates", null, makeCheckboxOption("showDates")),
                            makeSettingRow("Show pp rank beside player", "scores may take longer to load", makeCheckboxOption("showPpRank")),
                            makeSettingRow("Fetch player countries outside top 50", "disable to load faster, but some players' countries won't be loaded", makeCheckboxOption("fetchPlayerCountries")),
                            makeSettingRow("Show top 100", "rather than top 50", makeCheckboxOption("showTop100")),
                            makeSettingRow("pp 2 decimal places", "rather than 0 dp", makeCheckboxOption("pp2dp")),
                            makeSettingRow("Show osu!preview", null, makeCheckboxOption("osupreview")),
                            makeSettingRow("Show osu! Web Beatmap Viewer", null, makeCheckboxOption("osupreview2"))
                        )
                    ),
                    $("<div>").append(
                        "<h2>Userpage</h2>",
                        $("<table class='osuplusSettingsTable' width='100%'>").append(
                            makeSettingRow("Show recent 24h", "", makeCheckboxOption("showRecent")),
                            makeSettingRow("Show failed scores", "", makeCheckboxOption("failedChecked")),
                            makeSettingRow("Show detailed hit count", "", makeCheckboxOption("showDetailedHitCount")),
                            makeSettingRow("Show hits per play", "", makeCheckboxOption("showHitsPerPlay")),
                            makeSettingRow("Show top ranks max possible combo", "may take longer to load", makeCheckboxOption("fetchUserpageMaxCombo")),
                            makeSettingRow("Show first places detailed info", "may take longer to load", makeCheckboxOption("fetchFirstsInfo")),
                            makeSettingRow("Show BWS rank", "", makeCheckboxOption("showBWS"))
                        )
                    ),
                    $("<div>").append(
                        "<h2>Performance ranking</h2>",
                        $("<table class='osuplusSettingsTable' width='100%'>").append(
                            makeSettingRow("Show global/country ranking", "", makeCheckboxOption("rankingVisible"))
                        )
                    ),
                    $("<div>").append(
                        "<h2>Beatmap Listing</h2>",
                        $("<table class='osuplusSettingsTable' width='100%'>").append(
                            makeSettingRow("Force show difficulties", "so no need to hover over maps (legacy setting, no effect on new site)", makeCheckboxOption("forceShowDifficulties"))
                        )
                    ),
                    $("<div>").append(
                        "<h2>Multiplayer</h2>",
                        $("<table class='osuplusSettingsTable' width='100%'>").append(
                            makeSettingRow("Show grades", "only for std", makeCheckboxOption("showMpGrades"))
                        )
                    )
                ),
                $("<button id='osuplusSettingsSaveBtn'>Save</button>").click(function(){
                    GMX.setValue("apikey", nullIfBlankOrNull($("#settings-apikey").val()));
                    var properties = [
                        "showMirror", "showMirror2", "showMirror3", "showMirror4", "showMirror5", "showDates", "showPpRank", "fetchPlayerCountries", "showTop100", "pp2dp", "failedChecked",
                        "showDetailedHitCount", "showHitsPerPlay", "fetchUserpageMaxCombo", "fetchFirstsInfo", "rankingVisible", "forceShowDifficulties", "showSiteSwitcher",
                        "showMpGrades", "showRecent", "osupreview", "osupreview2", "showBWS"
                    ];
                    for(let property of properties){
                        setBoolProperty(property);
                    }
                })
            )
        );

        function setBoolProperty(property){
            GMX.setValue(property, $(`#settings-${property}`).prop("checked"));
        }

        $("#show-apikey").click(function(){
            if(this.checked){
                $("#settings-apikey").show();
            }else{
                $("#settings-apikey").hide();
            }
        });

        function openModal(){
            $("#osuplusModal, #osuplusModalOverlay").fadeIn(200);
        }

        function closeModal(){
            $("#osuplusModalOverlay, #osuplusModal").fadeOut(200);
        }

        $("#osuplusModalOverlay, .osuplusModalClose, #osuplusSettingsSaveBtn").click(closeModal);

        dragElement($("#osuplusSettingsBtn"), openModal);
    }

    // draggable code
    function dragElement(ele, onclick){
        var cursorx = 0, elex = 0, moved = false;
        ele.mousedown((e) => {
            e.preventDefault();
            cursorx = e.clientX;
            elex = ele.position().left;
            moved = false;
            $(document).mousemove(dragmove);
            $(document).mouseup(dragup);
        });

        function dragmove(e){
            e.preventDefault();
            moved = true;
            var newcursorx = e.clientX;
            var newright = $(document).width() - elex - ele.width() + cursorx - newcursorx;
            ele.css("right", newright + "px");
        }

        function dragup(e){
            $(document).off("mousemove", dragmove);
            $(document).off("mouseup", dragup);
            if(!moved && onclick){
                onclick();
            }
        }
    }

    function osuplusNew(){
        var currentBody = null,
            currentOsuplus = {
                init: function(){},
                destroy: function(){}
            };

        function init(){
            // add site switcher
            if(settings.showSiteSwitcher){
                $(document.body).append("<script src='//s.ppy.sh/js/site-switcher.js'></script>");
            }

            function reInit(){
                currentBody = document.body;
                mainInit();
                var url = window.location.href;
                var pathname = window.location.pathname;
                if(pathname == "/beatmapsets"){
                    setNewOsuplus(osuplusNewBeatmapListing);
                }else if(url.match(/^https?:\/\/osu\.ppy\.sh\/beatmapsets\//)){
                    setNewOsuplus(osuplusNewBeatmap);
                }else if(url.match(/^https?:\/\/osu\.ppy\.sh\/users\//)){
                    setNewOsuplus(osuplusNewUserpage);
                }else if(url.match(/^https?:\/\/osu\.ppy\.sh\/rankings\//)){
                    setNewOsuplus(osuplusNewPpRanking);
                }else if(url.match(/^https?:\/\/osu\.ppy\.sh\/community\/matches/)){
                    setNewOsuplus(osuplusNewMp);
                }
            }

            setInterval(function(){
                if(currentBody != document.body){
                    reInit();
                }
            }, 1000);

            // handle back and forward history
            $(document).on("turbolinks:load", function(){
                reInit();
            });
        }

        function setNewOsuplus(newOsuplus){
            currentOsuplus.destroy();
            currentOsuplus = newOsuplus();
            currentOsuplus.init();
        }

        $(document).on("turbolinks:visit", function(){
            $("#osuplusloaded").remove();
        });

        $(window).unload(function(){
            currentOsuplus.destroy();
        });

        return {init: init};
    }


    function osuplusNewMp(){
        var jsonEvents = null,
            mpId = null,
            userMap = null,
            matches = null,
            userDict = null,
            mpDiv = null,
            observer = null;

        function addCss(){
            if(!$(".osuplus-new-mp-style").length){
                $(document.head).append($("<style class='osuplus-new-mp-style'></style>").html(
                    `#osuplus-mc {padding: 10px 0px;}
                    .osuplus-mp-body {background-color: hsl(var(--hsl-b4)); border-radius: 4px;}
                    .mc-settings {display: flex;}
                    .mc-maps-container {flex: 2;}
                    .mc-users-container {flex: 1;}
                    .mc-others-container {flex: 1;}
                    .mp-team-red, .mp-team-blue {height: 12px; width: 12px; border-radius: 50%; display: inline-block;}
                    .mp-label {text-transform: initial;}
                    .mp-team-red {background-color: #ff3c3c;}
                    .mp-team-blue {background-color: #3ca1ff;}
                    .mc-calculate-row {text-align: center;}
                    .mc-calculate-btn {color: black;}
                    .mc-results-header {text-align: center; margin: 20px 0px 0px 0px;}
                    .mc-teamresult {text-align: center;}
                    .mc-result {display: flex; justify-content: space-evenly;}
                    .mc-mc {display: inline-block; width: 50px; text-align: right;}
                    #mc-ez-mult, #mc-fl-mult {color: black;}
                    .mc-list {counter-reset: rownum;}
                    .mc-list-row {counter-increment: rownum;}
                    .mc-list-row td:first-child::before {content: counter(rownum) ". ";}
                    .mc-header-plays, .mc-header-tops {padding: 0px 2px;}
                    .mc-cell-mc {padding-right: 5px;}
                    .mc-cell-plays, .mc-cell-tops {text-align: center;}
                    .op-mp-grade {position: relative; width: 50px;}`
                ));
            }
        }

        function init(){
            if($("#osuplusloaded").length) return;
            $("body").append("<a hidden id='osuplusloaded' class='osuplus'></a>");
            addCss();
            jsonEvents = JSON.parse($("#json-events").text());
            mpId = jsonEvents.match.id;
            mpDiv = $(`<div class='osuplus osuplus-mp-container'>
                <div class='js-spoilerbox bbcode-spoilerbox'>
                    <a class='js-spoilerbox__link bbcode-spoilerbox__link' href='#'>
                        <span class="bbcode-spoilerbox__link-icon"></span>Match costs
                    </a>
                    <div class='js-spoilerbox__body bbcode-spoilerbox__body osuplus-mp-body'>
                        <div id='osuplus-mc'>
                            Loading...
                        </div>
                    </div>
                </div>
            </div>`).click(function(){
                var mcEle = $(this).find("#osuplus-mc");
                if(mcEle.data("loaded")) return;
                mcEle.data("loaded", true);
                getMpEvents(mpId).then((res) => {
                    jsonEvents = res;
                    userMap = getUserMap(jsonEvents.users);
                    matches = extractMatches(jsonEvents.events, userMap);
                    userDict = getUserDict(userMap, matches);
                    var teamval = {blue: 2, red: 1, none: 0};
                    var userData = Object.values(userDict).sort((a, b) => teamval[b.team] - teamval[a.team]);

                    mcEle.html(
                        `<div class='mc-settings'>
                            <div class='mc-maps-container'>
                                <div>Maps</div>
                                ${matches.map((match, index) =>
                                    `<input type='checkbox' id='mp-map-${match.id}' name='${index}' checked>
                                    <label for='mp-map-${match.id}' class='mp-label'>
                                        ${match.beatmap.title} [${match.beatmap.version}] ${match.mods.length == 0 ? "" : `+${match.mods.join(",")}`}
                                    </label><br>`
                                ).join("")}
                            </div>
                            <div class='mc-users-container'>
                                <div>Players</div>
                                ${userData.map((user) =>
                                    `<div class='mc-user'>
                                        <input type='checkbox' id='mp-user-${user.id}' name='${user.id}' checked>
                                        <label for='mp-user-${user.id}' class='mp-label'><span class='mp-team-${user.team}'></span> ${user.username}</label>
                                    </div>`
                                ).join("")}
                            </div>
                            <div class='mc-others-container'>
                                EZ mult: <input type='text' id='mc-ez-mult' value='1.00'><br>
                                FL mult: <input type='text' id='mc-fl-mult' value='1.00'><br>
                                <br>
                                <div class='mc-formulas'>
                                    Formula:
                                    <div class='mc-formula-box'>
                                        <input type='radio' id='mc-formula-osuplus' name='mc-formula' value='osuplus' checked>
                                        <label for='mc-formula-osuplus' class='mp-label'>osuplus</label> <a href='https://i.imgur.com/BJPOKDY.png' target='_blank'>?</a><br>
                                        <input type='radio' id='mc-formula-bathbot' name='mc-formula' value='bathbot'>
                                        <label for='mc-formula-bathbot' class='mp-label'>Bathbot</label> <a href='https://i.imgur.com/7KFwcUS.png' target='_blank'>?</a><br>
                                        <input type='radio' id='mc-formula-flashlight' name='mc-formula' value='flashlight'>
                                        <label for='mc-formula-flashlight' class='mp-label'>Flashlight</label> <a href='https://i.imgur.com/lNITeBx.png' target='_blank'>?</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class='mc-calculate-row'>
                            <button class='mc-calculate-btn'>Calculate match costs</button>
                        </div>
                        <div class='mc-results'>

                        </div>`
                    );
                    mcEle.find("button.mc-calculate-btn").click(() => {
                        var selectedMatches = $.map($(".mc-maps-container input:checked"), x => deepCopy(matches[x.name]));
                        var ezmult = parseFloat($("#mc-ez-mult").val());
                        if(isNaN(ezmult)) ezmult = 1;
                        var flmult = parseFloat($("#mc-fl-mult").val());
                        if(isNaN(flmult)) flmult = 1;
                        for(let match of selectedMatches){
                            for(let score of match.scores){
                                if(inArray(score.mods, "EZ")){
                                    score.score *= ezmult;
                                }
                                if(inArray(score.mods, "FL")){
                                    score.score *= flmult;
                                }
                            }
                        }

                        var selectedUsersList = $.map($(".mc-user input:checked"), x => x.name);
                        var selectedUsers = {};
                        for(let user in userMap){
                            selectedUsers[user] = false;
                        }
                        for(let user of selectedUsersList){
                            selectedUsers[user] = true;
                        }
                        var formula = $(".mc-formula-box input[name=mc-formula]:checked").val();
                        var result = matchCost(selectedMatches, selectedUsers, formula);
                        var teamresultDiv = "";
                        if(result.teamresult.none == 0){
                            teamresultDiv = `<span class='mp-team-blue'></span> ${result.teamresult.blue} - ${result.teamresult.red} <span class='mp-team-red'></span>`;
                        }
                        var mc = [];
                        for(let id in result.stats){
                            mc.push({
                                id: id,
                                username: userDict[id].username,
                                team: userDict[id].team,
                                stats: result.stats[id]
                            });
                        }
                        mc.sort((a, b) => b.stats.mc - a.stats.mc);
                        mcEle.find(".mc-results").empty().html(
                            `<div class='mc-results-header'>${jsonEvents.match.name}<br>Formula: ${formula}</div>
                            <div class='mc-teamresult'>${teamresultDiv}</div>
                            <div class='mc-result'>
                                <table class='mc-list'>
                                    <tr><th></th><th></th><th></th><th class='mc-header-plays'>#plays(${selectedMatches.length})</th><th class='mc-header-tops'>#tops</th></tr>
                                    ${mc.map(x =>
                                    `<tr class='mc-list-row'><td></td>
                                        <td class='mc-cell-mc'><span class='mc-mc'>${x.stats.mc.toFixed(3)}</span></td>
                                        <td class='mc-cell-player'><span class='mp-team-${x.team}'></span> ${x.username}</td>
                                        <td class='mc-cell-plays'>${x.stats.plays}</td>
                                        <td class='mc-cell-tops'>${x.stats.tops}</td>
                                    </tr>`
                                    ).join("")}

                                </ol>
                            </div>`
                        );
                    });
                });
            });
            $(".mp-history-content h3").after(mpDiv);

            // add grades
            if(settings.showMpGrades){
                var containers = $(".mp-history-game");
                $.map(containers, (container) => {
                    addGrades($(container));
                });
                observer = new MutationObserver((mutations, observer) => {
                    for(let mutation of mutations){
                        for(let node of mutation.addedNodes){
                            $.map($(node).find(".mp-history-game"), (container) => {
                                addGrades($(container));
                            });
                        }
                    }
                });
                observer.observe($(".js-react--mp-history")[0], {subtree: true, childList: true});
            }
        }

        function addGrades(container){
            if(container.find(".mp-history-game__stats-box").children().eq(1).text() == "osu!"){ // only for std for now
                $.map(container.find(".mp-history-player-score"), (playerdiv) => {
                    playerdiv = $(playerdiv);
                    var stats = playerdiv.find(".mp-history-player-score__stat-number--small");
                    var score = {
                        count300: decommarise(stats.eq(0).text()),
                        count100: decommarise(stats.eq(1).text()),
                        count50: decommarise(stats.eq(2).text()),
                        countmiss: decommarise(stats.eq(3).text()),
                        countgeki: 0,
                        countkatu: 0
                    };
                    var mods = $.map(playerdiv.find(".mp-history-player-score__mods").children(), (child) => {
                        return $(child).attr("class").split("mod--")[1];
                    });
                    var modnum = modArrayToNum(mods);
                    var grade = calcGrade(score, 0, modnum);
                    playerdiv.find(".mp-history-player-score__shapes").after(
                        `<div class='op-mp-grade'>
                            <div class='score-rank score-rank--full score-rank--${grade}'></div>
                        </div>`
                    );
                });
            }
        }

        function matchCost(selectedMatches, selectedUsers, formula){
            var userStats = {};
            for(let user in selectedUsers){
                if(selectedUsers[user]){
                    userStats[user] = {
                        plays: 0,
                        sum: 0,
                        sum_median: 0,
                        tbbonus: 0,
                        tops: 0,
                        modcombis: new Set()
                    };
                }
            }
            var teamresult = {blue: 0, red: 0, none: 0};
            for(let match of selectedMatches){
                var nplayers = 0;
                var totalscore = 0;
                var scorels = [];
                var teamscore = {blue: 0, red: 0, none: 0};
                var topscore = 1;
                for(let score of match.scores){
                    if(selectedUsers[score.user_id]){
                        nplayers += 1;
                        totalscore += score.score;
                        topscore = Math.max(topscore, score.score);
                        scorels.push(score.score);
                        teamscore[score.team] += score.score;
                        userStats[score.user_id].plays += 1;
                        var mods = deepCopy(score.mods);
                        removeFromArray(mods, "NF");
                        userStats[score.user_id].modcombis.add(mods.join(","));
                    }
                }
                if(totalscore == 0){ // prevent divide by 0 if everyone gets 0
                    totalscore = 1;
                }
                for(let score of match.scores){
                    if(score.score == topscore){
                        userStats[score.user_id].tops += 1;
                    }
                }
                var medianscore = median(scorels);
                for(let i in match.scores){
                    var score = match.scores[i];
                    if(selectedUsers[score.user_id]){
                        userStats[score.user_id].sum += score.score * nplayers / totalscore;
                        userStats[score.user_id].sum_median += score.score / medianscore;
                        if(i == match.scores.length - 1 && teamscore["blue"] == teamscore["red"]){ // TB
                            userStats[score.user_id].tbbonus = score.score * nplayers / totalscore;
                        }
                    }
                }
                if(teamscore["none"] > 0){
                    teamresult["none"] += 1;
                }else if(teamscore["blue"] + teamscore["red"] > 0){
                    if(teamscore["blue"] >= teamscore["red"]){
                        teamresult["blue"] += 1;
                    }else{
                        teamresult["red"] += 1;
                    }
                }
            }

            var mc;
            switch(formula){
            case "osuplus":
                mc = matchCostOsuplus(userStats, selectedMatches);
                break;
            case "bathbot":
                mc = matchCostBathbot(userStats, selectedMatches);
                break;
            case "flashlight":
                mc = matchCostFlashlight(userStats, selectedMatches);
                break;
            }
            var stats = {};
            for(let id in mc){
                stats[id] = {mc: mc[id], plays: userStats[id].plays, tops: userStats[id].tops};
            }
            return {stats: stats, teamresult: teamresult};
        }

        function matchCostOsuplus(userStats, selectedMatches){
            var ans = {};
            for(let id in userStats){
                ans[id] = 2 * userStats[id].sum / (userStats[id].plays + 2);
            }
            return ans;
        }

        function matchCostBathbot(userStats, selectedMatches){
            var ans = {};
            for(let id in userStats){
                let p = userStats[id].plays;
                if(p == 0){
                    ans[id] = 0;
                }else{
                    ans[id] = (userStats[id].sum + p*0.5 + userStats[id].tbbonus) / p * 1.4**(((p-1)/(selectedMatches.length-1))**0.6) * (1 + 0.02*Math.max(0, userStats[id].modcombis.size-2));
                }
            }
            return ans;
        }

        function matchCostFlashlight(userStats, selectedMatches){
            var ans = {};
            var plays = [];
            for(let id in userStats){
                if(userStats[id].plays > 0){
                    plays.push(userStats[id].plays);
                }
            }
            var medianplays = median(plays);
            for(let id in userStats){
                let p = userStats[id].plays;
                if(p == 0){
                    ans[id] = 0;
                }else{
                    ans[id] = userStats[id].sum_median / p * (p / medianplays)**(1/3);
                }
            }
            return ans;
        }

        function getUserDict(userMap, matches){
            var userDict = {};
            for(let id in userMap){
                userDict[id] = {
                    id: id,
                    username: userMap[id]
                };
            }
            for(let match of matches){
                for(let score of match.scores){
                    userDict[score.user_id].team = score.team;
                }
            }
            for(let id in userDict){
                if(userDict[id].team === undefined){
                    delete userDict[id];
                }
            }
            return userDict;
        }

        function extractMatches(events, userMap){
            var matches = [];
            for(let event of events){
                if(event.detail.type == "other"){
                    var match = {
                        beatmap: event.game.beatmap === undefined ? {
                            id: Math.floor(Math.random() * 1e12),
                            title: "deleted beatmap",
                            version: "rip"
                        } : {
                            id: event.game.beatmap.id,
                            title: event.game.beatmap.beatmapset.title,
                            version: event.game.beatmap.version
                        },
                        scores: event.game.scores.map((score) => ({
                            user_id: score.user_id,
                            username: userMap[score.user_id],
                            mods: score.mods,
                            team: score.match.team,
                            passed: score.passed,
                            score: score.score
                        })),
                        mods: event.game.mods,
                        id: event.game.id,
                        mode_int: event.game.mode_int
                    };
                    if(match.scores.length){
                        matches.push(match);
                    }
                }
            }
            return matches;
        }

        function getUserMap(users){
            var userMap = {};
            for(let user of users){
                userMap[user.id] = user.username;
            }
            return userMap;
        }

        function destroy(){
            $(".osuplus-new-mp-style").remove();
            observer.disconnect();
        }

        return {init: init, destroy: destroy};
    }

    function osuplusNewBeatmapListing(){
        // Nothing for now

        function addCss(){
            if(!$(".osuplus-new-beatmaplisting-style").length){
                $(document.head).append($("<style class='osuplus-new-beatmaplisting-style'></style>").html(
                    ""
                ));
            }
        }

        function init(){
            if($("#osuplusloaded").length) return;
            $("body").append("<a hidden id='osuplusloaded'></a>");
            addCss();
        }

        function destroy(){
            $(".osuplus-new-beatmaplisting-style").remove();
        }

        return {init: init, destroy: destroy};
    }

    function osuplusNewPpRanking(){
        var isGlobal = true,
            mode = null,
            tableLoadingNotice = null,
            playerInfo = [],
            destroyed = false;


        function addCss(){
            if(!$(".osuplus-new-ppranking-style").length){
                $(document.head).append($("<style class='osuplus-new-ppranking-style'></style>").html(
                    ".centered {display: block; margin-left: auto; margin-right: auto;}"
                ));
            }
        }

        function init(){
            if($("#osuplusloaded").length) return;
            $("body").append("<a hidden id='osuplusloaded' class='osuplus'></a>");
            var path = window.location.pathname.split("/");
            if(path[3] != "performance") return;

            addCss();
            mode = modeToInt(path[2]);
            var searchObj = searchParser(window.location.search);
            if(searchObj.country){
                isGlobal = false;
            }else{
                isGlobal = true;
            }

            //Add Loader
            tableLoadingNotice = $(`<div><img src='${loaderImg}' class='centered'></div>`).hide();
            $(".ranking-page-table").before(tableLoadingNotice);

            //Add global/country ranking
            if(settings.rankingVisible){
                tableLoadingNotice.show();

                //Get player list
                var playerList = $(".ranking-page-table__row").map(function(i, ele){
                    return $(ele).find(".ranking-page-table__user-link-text").attr("data-user-id");
                });
                var funs = [];
                playerInfo = [];
                playerList.each(function(index, id){
                    funs.push(function(donecb){
                        getUser({u: id, m: mode, type: "id"}, function(response){
                            playerInfo[index] = response[0];
                            donecb();
                        });
                    });
                });
                doManyFunc(funs, function(){
                    if(destroyed) return;
                    tableLoadingNotice.hide();

                    //Add new header
                    var newHeader = isGlobal ? "Country" : "Global";
                    $(".ranking-page-table th").first().after(`<th class='ranking-page-table__heading'>${newHeader}</th>`);

                    //Add new ranks
                    $(".ranking-page-table__row").each(function(index, row){
                        row = $(row);
                        var newRank = isGlobal ? playerInfo[index].pp_country_rank : playerInfo[index].pp_rank;
                        row.find(".ranking-page-table__column--rank").after(
                            `<td class='ranking-page-table__column ranking-page-table__column--rank'>#${newRank}</td>`
                        );
                    });
                });
            }
        }

        function searchParser(str){
            if(str[0] === "?") str = str.slice(1);
            var arr = str.split("&");
            var rtn = {};
            arr.forEach(function(x){
                var xsplit = x.split("=");
                if(xsplit.length > 1){
                    rtn[xsplit[0]] = xsplit[1];
                }
            });
            return rtn;
        }

        function destroy(){
            $(".osuplus-new-ppranking-style").remove();
            destroyed = true;
        }

        return {init: init, destroy: destroy};
    }

    function osuplusNewUserpage(){
        var jsonUser = null,
            gameMode = null,
            userBest = null,
            opModalContent = null;

        function addCss(){
            if(!$(".osuplus-new-userpage-style").length){
                $(document.head).append($("<style class='osuplus-new-userpage-style'></style>").html(
                    `.pc-display {text-align: right; font-size: 175%; color: #9492dc; text-shadow: #b5c6cb 2px 0px 3px; padding-right: 5px;}
                    .pc-img {width: 80px;}
                    .pc-imgcol {width: 90px;}
                    #opslider {width: 250px; display: inline-block; margin: 10px;}
                    .recentscore .play-detail__group--top, .recentscore .play-detail__score-detail, .recentscore .play-detail__pp:before {background-color: #009612;}
                    .recentscore {background-color: green;}
                    .star-display {text-align: right; color: #444444; padding-right: 5px;}
                    .prof-beatmap {position: relative;}
                    .modalBtn {position: absolute; right: -1px; top: -1px; background: white; padding: 3px; width: 22px; text-align: center; border-style: solid; border-width: 1px;}
                    .modalBtn:hover {cursor: pointer;}
                    .opModalCloseBtnDiv {position: absolute; right: 15px; top: 15px;}
                    .opModal {width: 800px; position: fixed; display: none;z-index: 10000;padding: 15px 20px 10px;-webkit-border-radius: 10px;-moz-border-radius: 10px;border-radius: 10px;background: #fff; left: 50%; top:50%; transform: translate(-50%, -50%);}
                    .opModalOverlay {position: fixed;top: 0;left: 0;bottom:0;right:0;width: 100%;height: 100%;z-index: 9999;background: #000;display: none;-ms-filter: 'alpha(Opacity=50)';-moz-opacity: .5;-khtml-opacity: .5;opacity: .5;}
                    .opModal-song-info {}
                    .opModal-song-info td {padding: 2px 7px;}
                    .tableAttr {width: 70px;}
                    .sub-button {width: 90px; margin-left: 30px;}
                    .score-rank--F {background-image: url('${FImgNew}');}
                    .play-detail__pp.play-detail__recent-pp {min-width: 0px; padding: 0px;}
                    .div-24h {margin-top: 50px;}
                    .modal-hr {color: red;}
                    .modal-ez {color: green;}
                    .opModal {color: black;}
                    .opModal h1 {color: ${osuPink};}
                    .mod--V2 {background-image: url('${v2Img}');}
                    .ppcalc-pp {cursor: pointer;}
                    .play-detail {position: relative;}
                    .op-relrank {position: absolute; height: 100%; width: 40px; margin-left: -40px; display: inline-flex; align-items: center; justify-content: center; font-size: 20px; opacity: 0;}
                    .play-detail:hover .op-relrank {opacity: 1;}
                    .op-badges-input {color: black; width: 45px;}`
                ));
            }
        }

        function init(){
            if($("#osuplusloaded").length) return;
            $("body").append("<a hidden id='osuplusloaded' class='osuplus'></a>");
            addCss();
            jsonUser = JSON.parse($(".js-react--profile-page").attr("data-initial-data")).user;
            gameMode = getGameMode();

            addDetailedTop();
            addGeneral();
            if(settings.showRecent){
                addRecent();
            }
            if(settings.showBWS){
                addBWS();
            }


            // Add modal
            $("body").append("<div class='opModalOverlay opModalOverride' id='opModalOverlay' style='display:none;'></div>");
            $("body").append("<div class='opModal' id='opModal' style='display:none;'></div>");
            opModalContent = $("<div id='opModalContent'>");
            $("#opModal").append(
                opModalContent,
                "<div class='opModalCloseBtnDiv' style='display: block;'><button class='opModalCloseBtn'>x</button></div>");
            $("#opModalOverlay, .opModalCloseBtn").click(function(){
                closeModal();
            });

            // :)
            if(jsonUser.id == 1843447){
                if($(".profile-info__title").length){
                    $(".profile-info__title").text("osuplus creator");
                }else{
                    $(".profile-info__name").after("<span class='profile-info__title'>osuplus creator</span>");
                }
            }
        }

        function destroy(){
            $(".osuplus-new-userpage-style").remove();
        }

        function getGameMode(){
            var modeStr = $(".game-mode-link--active").attr("href").split("/");
            modeStr = modeStr[modeStr.length-1];
            return modeToInt(modeStr);
        }

        function addDetailedTop(){
            var bestObserver = new MutationObserver(function(mutationList){
                for(var mutation of mutationList){
                    if(mutation.addedNodes.length){
                        addBestDetails(mutation.addedNodes[0]);
                    }
                }
            });
            var firstObserver = new MutationObserver(function(mutationList){
                for(var mutation of mutationList){
                    if(mutation.addedNodes.length){
                        addFirstDetails(mutation.addedNodes[0]);
                    }
                }
            });

            var lazyLoadedPromise = new Promise((resolve, reject) => {
                if($("div[data-page-id=top_ranks] .play-detail-list").length >= 3){
                    resolve();
                }else{
                    var lazyLoadObserver = new MutationObserver((mutationList) => {
                        if($("div[data-page-id=top_ranks] .play-detail-list").length >= 3){
                            lazyLoadObserver.disconnect();
                            resolve();
                        }
                    });

                    lazyLoadObserver.observe($("div[data-page-id=top_ranks]")[0], {childList: true, subtree: true});
                }
            });

            // Add bests details
            getUserBest({u: jsonUser.id, m: gameMode, type: "id", limit: 100}, function(scores){
                userBest = scores;
                lazyLoadedPromise.then(() => {
                    $("div[data-page-id=top_ranks] .play-detail-list").eq(1).find(".play-detail").each(function(i, ele){
                        addBestDetails(ele);
                    });
                    if($("div[data-page-id=top_ranks] .play-detail-list")[1]){
                        bestObserver.observe($("div[data-page-id=top_ranks] .play-detail-list")[1], {childList: true});
                    }
                });
            });

            lazyLoadedPromise.then(() => {
                // Add firsts details
                $("div[data-page-id=top_ranks] .play-detail-list").eq(2).find(".play-detail").each(function(i, ele){
                    addFirstDetails(ele);
                });
                firstObserver.observe($("div[data-page-id=top_ranks] .play-detail-list")[2], {childList: true});

                // Add pinned details
                $("div[data-page-id=top_ranks] .play-detail-list").eq(0).find(".play-detail").each(function(i, ele){
                    addFirstDetails(ele);
                });
                firstObserver.observe($("div[data-page-id=top_ranks] .play-detail-list")[0], {childList: true});

                // Add slider
                var sliderDiv = createSlider(function(val, checked){
                    if(checked){
                        var tops = $("div[data-page-id=top_ranks] .play-detail");
                        var curTime = new Date();
                        tops.each(function(index, top){
                            top = $(top);
                            var scoreTime = new Date(top.find("time").attr("datetime"));
                            var diff = (curTime - scoreTime) / (1000*60*60*24);
                            if(diff < val){
                                top.addClass("recentscore");
                            }else{
                                top.removeClass("recentscore");
                            }
                        });
                    }else{
                        $("div[data-page-id=top_ranks] .play-detail.recentscore").removeClass("recentscore");
                    }
                });
                $("div[data-page-id=top_ranks] .title.title--page-extra-small").first().before(sliderDiv);
            });
        }

        function addBestDetails(ele){
            // Only add once
            ele = $(ele);
            if(ele.find(".op-details-loaded").length){
                return;
            }
            ele.append("<div hidden class='op-details-loaded'></div>");

            addRelativeRank(ele);
            var beatmapId = beatmapIdOfDetailRow(ele);
            var score = null;
            for(var uscore of userBest){
                if(uscore.beatmap_id == beatmapId){
                    score = uscore;
                    break;
                }
            }
            if(score !== null){
                addDetails(ele, score, beatmapId);
            }
        }

        function addFirstDetails(ele){
            // Only add once
            ele = $(ele);
            if(ele.find(".op-details-loaded").length){
                return;
            }
            ele.append("<div hidden class='op-details-loaded'></div>");

            addRelativeRank(ele);
            // Obtain mods
            let mods = ele.find(".play-detail__score-detail--mods .mod").map((_, x) => $(x).attr("data-acronym")).get();
            let modnum = modArrayToNum(mods);

            if(settings.fetchFirstsInfo){
                var beatmapId = beatmapIdOfDetailRow(ele);
                if(beatmapId){ // may be undefined if you are moving pinned scores
                    getScores({b: beatmapId, u: jsonUser.id, type: "id", m: gameMode, a: 1, mods: modnum, limit: 1}, function(scores){
                        if(scores.length){
                            addDetails(ele, scores[0], beatmapId);
                        }
                    });
                }
            }
        }

        function beatmapIdOfDetailRow(ele){
            var href = ele.find(".play-detail__title").attr("href");
            if(href == undefined) return undefined;
            var temp = href.split("/");
            temp = temp[temp.length - 1];
            return temp.split("?")[0];
        }

        function addDetails(top, score, mapId){
            addModalBtn(top, mapId);
            if(settings.fetchUserpageMaxCombo){
                getBeatmapsCache({b: mapId, m: gameMode, a: 1}, function(beatmap){
                    if(beatmap.length){
                        detailify(top, score, beatmap[0]);
                    }
                });
            }else{
                detailify(top, score);
            }
        }

        function addRelativeRank(top){
            top.append("<div class='op-relrank'></div>");
            // Make it dynamic
            top.hover(function(){
                let relrank = $(this).index() + 1;
                $(this).find(".op-relrank").text(relrank);
            });

        }

        function detailify(top, score, beatmap){
            var maxmapcombo = $("<span></span>").css("color", "#b7b1e5");
            if(beatmap && beatmap.max_combo !== null){
                maxmapcombo.text(` (${beatmap.max_combo}x)`);
            }
            if(score.perfect === "1"){
                if(top.find(".play-detail__pp-weight").length){
                    top.find(".play-detail__pp-weight").prepend("<span class='play-detail__fc'>(FC) </span>");
                }else{
                    top.find(".play-detail__accuracy-and-weighted-pp").after("<div><span class='play-detail__fc'>(FC)</span></div>");
                }
            }
            top.find(".play-detail__title").after(makeScoreStats(score, maxmapcombo));
        }

        function makeScoreStats(score, maxmapcombo){
            return $("<div class='play-detail__opstats'></div>").append(
                $("<b></b>").append(
                    `${commarise(score.score)} / ${score.maxcombo}x`,
                    maxmapcombo
                ),
                gameMode <= 1 ? // Standard/Taiko
                    ` { ${score.count300} / ${score.count100} / ${score.count50} / ${score.countmiss} }` :
                    gameMode == 2 ? // CTB
                        ` { ${score.count300} / ${score.count100} / ${score.count50} / ${score.countkatu} / ${score.countmiss} }` :
                        // Mania
                        ` { ${score.countgeki} / ${score.count300} / ${score.countkatu} / ${score.count100} / ${score.count50} / ${score.countmiss} }`
            );
        }

        function addModalBtn(top, beatmap_id){
            var modalBtn = $("<a class='modalBtn'>?</a>").hide();
            modalBtn.click(function(){
                openModal($(this).parent().find("input:hidden").val());
            });
            top.append(modalBtn, $(`<input type=hidden class='identifier' value='${beatmap_id}'>`));

            top.hover(function(){
                $(this).find(".modalBtn").show();
            }, function(){
                $(this).find(".modalBtn").hide();
            });
            modalBtn.click(function(){
                openModal($(this).parent().find(".identifier").val());
            });
        }

        function openModal(id){
            if(id === undefined) return;
            var opModalContent = $("#opModalContent");
            opModalContent.empty();
            getBeatmapsCache({b: id, m: gameMode, a: 1}, function(beatmap){
                beatmap = beatmap[0];
                opModalContent.html(
                    `<h1>${beatmap.artist} - <a href=/beatmapsets/${beatmap.beatmapset_id}>${beatmap.title}</a> [<a href=/beatmaps/${beatmap.beatmap_id}>${beatmap.version}</a>]</h1>
                    <input type="radio" name="mods" value="none" checked="">Nomod
                    <input type="radio" name="mods" value="hr">HR
                    <input type="radio" name="mods" value="ez">EZ
                      <table class='opModal-song-info' style='width:100%;'>
                        <tr>
                          <td rowspan=5 style='width:1%'>
                            <a>
                              <img class='bmt' src=//b.ppy.sh/thumb/${beatmap.beatmapset_id}l.jpg>
                            </a>
                          </td>
                          <td class='tableAttr'>CS:</td><td>${beatmap.diff_size} <span class="modal-hr" hidden>(${Math.min(parseFloat(beatmap.diff_size)*1.3, 10).toFixed(2)})</span><span class="modal-ez" hidden>(${(parseFloat(beatmap.diff_size)/2).toFixed(2)})</span></td>
                          <td class='tableAttr'>AR:</td><td>${beatmap.diff_approach} <span class="modal-hr" hidden>(${Math.min(parseFloat(beatmap.diff_approach)*1.4, 10).toFixed(2)})</span><span class="modal-ez" hidden>(${(parseFloat(beatmap.diff_approach)/2).toFixed(2)})</span></td>
                        </tr>
                        <tr>
                          <td class='tableAttr'>HP:</td><td>${beatmap.diff_drain} <span class="modal-hr" hidden>(${Math.min(parseFloat(beatmap.diff_drain)*1.4, 10).toFixed(2)})</span><span class="modal-ez" hidden>(${(parseFloat(beatmap.diff_drain)/2).toFixed(2)})</span></td>
                          <td class='tableAttr'>Stars:</td><td>${beatmap.difficultyrating}</td>
                        </tr>
                        <tr>
                          <td class='tableAttr'>OD:</td><td>${beatmap.diff_overall} <span class="modal-hr" hidden>(${Math.min(parseFloat(beatmap.diff_overall)*1.4, 10).toFixed(2)})</span><span class="modal-ez" hidden>(${(parseFloat(beatmap.diff_overall)/2).toFixed(2)})</span></td>
                          <td class='tableAttr'>Length:</td>
                          <td>${secsToMins(parseInt(beatmap.total_length))} (${secsToMins(parseInt(beatmap.hit_length))} drain)${(beatmap.max_combo == null ? "" : `<br>${beatmap.max_combo}x combo`)}</td>
                        </tr>
                        <tr>
                          <td class='tableAttr'>Creator:</td><td>${beatmap.creator}</td>
                          <td class='tableAttr'>BPM:</td><td>${beatmap.bpm}</td>
                        </tr>
                        <tr>
                          <td colspan=4><a href=/beatmapsets/${beatmap.beatmapset_id}/download>Download</a>
                            <a href='https://beatconnect.io/b/${beatmap.beatmapset_id}'>Beatconnect mirror</a><br>
                            <a href='https://osu.sayobot.cn/home?search=${beatmap.beatmapset_id}' target='_blank'>Sayobot</a>
                          </td>
                        </tr>
                      </table>`
                );
                opModalContent.find("input[type=radio][name=mods]").change(function(){
                    if(this.value == "none"){
                        $(".modal-hr").hide();
                        $(".modal-ez").hide();
                    }else if(this.value == "hr"){
                        $(".modal-hr").css("display", "inline");
                        $(".modal-ez").hide();
                    }else{
                        $(".modal-hr").hide();
                        $(".modal-ez").css("display", "inline");
                    }
                });
            });
            $("#opModalOverlay").fadeIn(200);
            $("#opModal").fadeIn(200);
        }

        function closeModal(){
            $("#opModalOverlay").fadeOut(200);
            $("#opModal").fadeOut(200);
        }

        function addGeneral(){
            if(settings.showDetailedHitCount || settings.showHitsPerPlay){
                getUser({u: jsonUser.id, m: gameMode, type: "id"}, function(response){
                    var user = response[0];
                    var c300 = parseInt(user.count300), c100 = parseInt(user.count100), c50 = parseInt(user.count50),
                        ctotal = c300 + c100 + c50;

                    if(settings.showHitsPerPlay){
                        $(".profile-stats__entry").eq(4).after(
                            `<dl class="profile-stats__entry"><dt class="profile-stats__key">Hits per Play</dt>
                            <dd class="profile-stats__value">${(ctotal/parseInt(user.playcount)).toFixed(2)}</dd></dl>`
                        );
                    }
                    if(settings.showDetailedHitCount){
                        $(".profile-stats__entry").eq(4).after(
                            `<dl class="profile-stats__entry"><dt class="profile-stats__key">300x</dt>
                            <dd class="profile-stats__value">${commarise(c300)} (${(100*c300/ctotal).toFixed(2)}%)</dd></dl>
                            <dl class="profile-stats__entry"><dt class="profile-stats__key">100x</dt>
                            <dd class="profile-stats__value">${commarise(c100)} (${(100*c100/ctotal).toFixed(2)}%)</dd></dl>
                            <dl class="profile-stats__entry"><dt class="profile-stats__key">50x</dt>
                            <dd class="profile-stats__value">${commarise(c50)} (${(100*c50/ctotal).toFixed(2)}%)</dd></dl>`
                        );
                    }

                    // Fix overflowing rank chart
                    unsafeWindow.dispatchEvent(new Event("resize"));
                });
            }
        }

        function addRecent(){
            $("div[data-page-id=recent_activity] .page-extra").append(
                `<div class='div-24h'>
                    <div class="js-spoilerbox bbcode-spoilerbox">
                        <button class="js-spoilerbox__link bbcode-spoilerbox__link" type="button">
                            <span class="bbcode-spoilerbox__link-icon"></span>
                            <h2 class='title title--page-extra'>Recent 24h</h2>
                        </button>
                        <div class="js-spoilerbox__body bbcode-spoilerbox__body">
                            <div id='op-recent'>Loading...</div>
                        </div>
                    </div>
                </div>`
            );
            var container = $("#op-recent");

            getUserRecent({u: jsonUser.id, m: gameMode, limit: 50, type: "id"}, function(response){
                var userRecent = response;
                var failedCheckbox = $("<input type=checkbox id='failedCheckbox'/>"),
                    failedChecked = settings.failedChecked;

                failedCheckbox.prop("checked", failedChecked).click(function(){
                    var me = $(this);
                    failedChecked = me.prop("checked");
                    if(failedChecked){
                        $(".failedScore").show();
                    }else{
                        $(".failedScore").hide();
                    }
                });

                var subcontainer = $("<div class='op-recent-container'></div>");
                container.empty().append(
                    $("<label></label>").append(
                        failedCheckbox, "Show failed scores"
                    ),
                    subcontainer
                );

                userRecent.forEach(function(play){
                    var //modstr = getMods(play.enabled_mods),
                        acc = calcAcc(play, gameMode),
                        dateset = new Date(play.date.replace(" ","T") + "+0000"), // dates from API in GMT+0
                        maplink = $(`<a href="https://osu.ppy.sh/beatmaps/${play.beatmap_id}" class="play-detail__title u-ellipsis-overflow">
                            Loading...<small class="play-detail__artist"></small></a>`),
                        mapver = $("<span class='play-detail__beatmap'>Loading...</span>"),
                        maxmapcombo = $("<span></span>").css("color", "#b7b1e5"),
                        //starrating = $("<b>...&#9733;</b>"),
                        failClass = play.rank === "F" ? "failedScore" : "passScore",
                        ppUnitSpan = "<span class='play-detail__pp-unit'>pp</span>",
                        ppcalcData = makePpcalcData(gameMode, play, acc, play.beatmap_id);

                    var detailrow = $(`<div class='play-detail play-detail--highlightable play-detail--compact ${failClass}'>`).append(
                        $("<div class='play-detail__group play-detail__group--top'></div>").append(
                            `<div class="play-detail__icon play-detail__icon--main">
                                <div class="score-rank score-rank--full score-rank--${play.rank}"></div>
                            </div>`,
                            $("<div class='play-detail__detail'></div>").append(
                                maplink,
                                makeScoreStats(play, maxmapcombo),
                                $("<div class='play-detail__beatmap-and-time'></div>").append(
                                    mapver,
                                    `<span class="play-detail__time">
                                        <time class="timeago" datetime="${dateset.toISOString()}">${dateset.toLocaleString()}</time>
                                    </span>`
                                )
                            )
                        ),
                        `<div class="play-detail__group play-detail__group--bottom">
                            <div class="play-detail__score-detail play-detail__score-detail--score">
                                <div class="play-detail__score-detail-top-right">
                                    <div class="play-detail__accuracy-and-weighted-pp">
                                        <span class="play-detail__accuracy">${acc.toFixed(2)}%</span>
                                    </div>
                                    ${play.perfect == "1" ?
                                    "<div><span class='play-detail__fc'>(FC)</span></div>" : ""}
                                </div>
                            </div>
                            <div class="play-detail__score-detail play-detail__score-detail--mods">
                                ${getNewMods(play.enabled_mods)}
                            </div>
                            <div class="play-detail__pp${gameMode == 0 ? "" : " play-detail__recent-pp"}">
                                ${gameMode == 0 ?
                                `<span class='ppcalc-pp'>${ppUnitSpan}</span>
                                <a class='op-ppcalc-data' hidden>${JSON.stringify(ppcalcData)}</a>` : ""}
                            </div>
                            <div class="play-detail__more"></div>
                        </div>`
                    );
                    addModalBtn(detailrow, play.beatmap_id);
                    detailrow.find(".ppcalc-pp").click(function(event){
                        var me = $(this);
                        me.html(`...${ppUnitSpan}<br>(...)`);
                        var ppcalcData = JSON.parse(me.parent().find(".op-ppcalc-data").text());
                        doPpcalc(ppcalcData).then((result) => {
                            me.html(`${result.pp}${ppUnitSpan}<br>(${result.pp_fc}${ppUnitSpan} if FC)`);
                        });
                    });

                    subcontainer.append(detailrow);

                    getBeatmapsCache({b: play.beatmap_id, m: gameMode, a: 1}, function(response){
                        var r = response[0];
                        maplink.html(
                            `${r.title} <small class="play-detail__artist">by ${r.artist}</small>`
                        );
                        if(r.max_combo !== null){
                            maxmapcombo.text(` (${r.max_combo}x)`);
                        }
                        mapver.text(r.version);
                        detailrow.find(".identifier").val(r.beatmap_id);
                    });
                });
                subcontainer.children().each((id, row) => {
                    addRelativeRank($(row));
                });
                $(".timeago").timeago();
                if(failedChecked){
                    $(".failedScore").show();
                }else{
                    $(".failedScore").hide();
                }
            });
        }

        function addBWS(){
            let rank = decommarise($(".profile-detail__chart-numbers--top .value-display.value-display--rank").first().find(".value-display__value > div").text());
            let badges = 0;
            if($(".profile-badges").length){
                badges = $(".profile-badges").children().length;
            }
            let bws = calculateBWS(rank, badges);

            $(".profile-detail__chart-numbers--top .profile-detail__values").first().append(
                `<div class="value-display value-display--rank" title="rank ^ (0.9937 ^ (badges^2))">
                    <div class="value-display__label">BWS | Badges: <input type="number" class="op-badges-input" min=0 value=${badges}></div>
                    <div class="value-display__value">
                        <div class="op-bws-rank">#${commarise(bws)}</div>
                    </div>
                </div>`);

            $(".op-badges-input").on("input", function(){
                let badges = parseInt($(this).val());
                if(isNaN(badges)) badges = 0;
                let bws = calculateBWS(rank, badges);
                $(".op-bws-rank").text(`#${commarise(bws)}`);
            });
        }

        // BWS formula: rank ^ (0.9937 ^ (badges^2))
        function calculateBWS(rank, badges){
            return Math.round(rank ** (0.9937 ** (badges**2)));
        }

        return {init: init, destroy: destroy};
    }

    function osuplusNewBeatmap(){
        var mapID = null,
            scoresResult = null,
            mapMode = 0,
            jsonBeatmapset = null,
            //jsonCountries = null,
            maxCombo = null,
            //showDates = true,
            modsEnabled = true,
            timeDelay = 1000,
            timeoutID = null,
            friends = [],
            scoreReqs = [],
            tableLoadingNotice = null,
            tableWaiter = null,
            tableObserver = null,
            beatmapWaiter = null,
            beatmapObserver = null,
            currentUser = null;

        function addCss(){
            if(!$(".osuplus-new-beatmap-style").length){
                $(document.head).append($("<style class='osuplus-new-beatmap-style'></style>").html(
                    `.modIconGroup {display: inline-block; margin: 2px;}
                     .modIcon {overflow: hidden; position: relative; width: 46px; height: 46px;}
                     .modIconOption, .modIconOption img, .modIcon img { width: 100%; height: 100%; }
                     .modIconOption {overflow: hidden; position: absolute; transform: skewX(-45deg);}
                     .modIconOption:first-child {left: 0px; transform-origin: 100% 0;}
                     .modIconOption:last-child {right: 0px; transform-origin: 0 100%;}
                     .modIconOption img {transform: skewX(45deg); transform-origin: inherit;}
                     .notSelected {border: 3px solid transparent;}
                     .isSelected {border: 3px solid red;}
                     .partialSelected {border: 3px dashed red;}
                     .osupreview {width: 425px; height: 344px;}
                     .osupreview2 {width: 850px; height: 600px;}
                     #opslider {width: 250px; display: inline-block; margin: 10px;}
                     .recentscore > td {background-color: green !important;}
                     .centered {display: block; margin-left: auto; margin-right: auto;}
                     .greyedout {opacity: 0.5}
                     #rankingtype label {padding: 8px}
                     .search-beatmap-scoreboard-table__table {width: 100%; min-width: 800px; font-size: 12px;}
                     #searchuser {margin-bottom: 10px;}
                     .osupreview-container {padding: 30px;}
                     .beatmap-scoreboard-table__header--miss {max-width: 45px; min-width: 30px; width: auto;}
                     .beatmap-scoreboard-table__header a {cursor: pointer;}
                     .sub-button {background-image: none;}
                     .subbed {background-color: #ef77af;}
                     #searchusertxt {color: black;}
                     .beatmap-scoreboard-table__cell--grade {width: auto; height: auto; display: table-cell;}
                     .beatmap-scoreboard-table__cell--grade .score-rank {width: 100%;}
                     .ppcalc-pp {cursor: pointer;}
                     .osuplus-pp-cell {padding-right: 10px;}
                     .osuplus-pp-cell a {height: auto;}
                     .slider-export-container {display: flex;}
                     .export-container {flex: 1; text-align: right;}
                     .export-btn {cursor: pointer;}
                     .beatmap-scoreboard-table__cell-oprank {position: relative;}
                     .beatmap-scoreboard-table__cell-content--oprank {position: absolute; right: 0px; color: hsl(var(--hsl-l2));}`
                ));
            }
        }

        function init(){
            if($("#osuplusloaded").length) return;
            $("body").append("<a hidden id='osuplusloaded' class='osuplus'></a>");
            addCss();
            //jsonCountries = JSON.parse($("#json-countries").text());
            jsonBeatmapset = JSON.parse($("#json-beatmapset").text());
            //showDates = settings.showDates;
            currentUser = JSON.parse(JSON.stringify(unsafeWindow.currentUser));
            friends = extractFriends();

            beatmapWaiter = waitForEl(".beatmapset-beatmap-picker", function(el){
                addMirrors();
                refreshBeatmapsetHeader();
                beatmapObserver = whenBeatmapChange(() => {
                    refreshBeatmapsetHeader();
                });
                // only update scores if not in Lazer mode
                if(currentUser.user_preferences.legacy_score_only){
                    tableWaiter = waitForEl(".beatmap-scoreboard-table", function(el){
                        refreshTable();
                        tableObserver = whenScoreboardChange(refreshTable);
                    });
                }
            });
        }

        function whenBeatmapChange(callback){
            var obs = new MutationObserver(callback);
            obs.observe($(".beatmapset-beatmap-picker")[0], {attributes: true, subtree: true});
            return obs;
        }

        function whenScoreboardChange(onchange){
            var observer = new MutationObserver(function(mutationList, observer){
                for(var mutation of mutationList){
                    if(mutation.type == "childList" && mutation.addedNodes.length){
                        var ele = $(":not(.osuplus-table).beatmap-scoreboard-table__table")[0];
                        if(ele){
                            observer.observe(ele, {characterData: true, subtree: true});
                        }
                    }
                }
                onchange();
            });
            observer.observe($(":not(.osuplus-table).beatmap-scoreboard-table__table")[0], {characterData: true, subtree: true});
            observer.observe($(".beatmapset-scoreboard__main")[0], {childList: true});
            return observer;
        }

        function refreshBeatmapsetHeader(){
            $(".osuplus-header").remove();
            mapID = $(".beatmapset-beatmap-picker__beatmap--active").attr("href").split("/")[1];
            mapMode = getMapmode();
            addOsuPreview();
        }

        function refreshTable(){
            $(".osuplus-table").remove();
            maxCombo = getMaxCombo(jsonBeatmapset, mapID, mapMode);
            minePlayerCountries();

            if($(".page-tabs").children().first().hasClass("page-tabs__tab--active") &&
                ($(".beatmapset-scoreboard__mods--initial").length || $(".beatmapset-scoreboard__mods").length==0)){
                if(hasKey){
                    addSearchUser();
                    putRankingType();
                    putModButtons();
                    addSlider();
                    tableLoadingNotice = addTableLoadingNotice();
                    tableLoadingNotice.show();
                    replicateTable();
                    modifyTableHeaders();

                    getScoresWithPlayerInfo({b:mapID, m:mapMode, limit:settings.displayTopNum}, settings.showPpRank, function(response){
                        scoresResult = response;
                        updateScoresTable();
                    });
                }
            }else{
                $(".beatmap-scoreboard-table__table").show();
            }
        }

        function destroy(){
            if(tableObserver) tableObserver.disconnect();
            if(tableWaiter) tableWaiter.abort();
            if(beatmapObserver) beatmapObserver.disconnect();
            if(beatmapWaiter) beatmapWaiter.abort();
            $(".osuplus-new-beatmap-style").remove();
            GMX.setValue("playerCountries", JSON.stringify(playerCountries));
        }

        function getMaxCombo(jsonBeatmapset, mapID, mapMode){
            var beatmaps = jsonBeatmapset.beatmaps.filter(function(map){
                return map.id.toString() == mapID && map.mode_int == mapMode;
            });
            if(beatmaps.length){
                if(beatmaps[0].max_combo){
                    return beatmaps[0].max_combo;
                }
            }
            return null;
        }

        function replicateTable(){
            var oldTable = $(".beatmap-scoreboard-table__table");
            var newTable = $("<table class='osuplus-table beatmap-scoreboard-table__table'></table>");
            newTable.html(oldTable.html());
            oldTable.hide();
            oldTable.after(newTable);
        }

        function extractFriends(){
            return currentUser.friends.map((friend) => friend.target_id.toString());
        }

        function countryNameFromCode(code){
            if(countryCodes[code]){
                return countryCodes[code];
            }else{
                return "Unknown";
            }
        }

        function getMapmode(){
            var modeStr = $(".beatmapset-beatmap-picker__beatmap--active").attr("href").slice(1).split("/")[0];
            return modeToInt(modeStr);
        }

        function makeScoreTableRow(score, rankno, greyedout){
            var country = score.user.country.toLowerCase();
            var countryUpper = country.toUpperCase();
            var acc = calcAcc(score, mapMode);
            var mapModeStr = intToMode(mapMode);
            var rowclass;
            var datetime = score.date.replace(" ", "T") + "+0000"; // dates from API in GMT+0

            rowclass = "clickable-row beatmap-scoreboard-table__body-row beatmap-scoreboard-table__body-row--highlightable";
            if(currentUser !== null && currentUser.id.toString() === score.user_id){ // self
                rowclass += " beatmap-scoreboard-table__body-row--self";
            }else if(isFriend(score.user_id)){
                rowclass += " beatmap-scoreboard-table__body-row--friend";
            }
            if(rankno === 1){
                rowclass += " beatmap-scoreboard-table__body-row--first";
            }
            if(greyedout){
                rowclass += " greyedout";
            }

            var cellClass = "beatmap-scoreboard-table__cell";
            var scoreHref = `href='https://osu.ppy.sh/scores/${mapModeStr}/${score.score_id}'`;
            var countryName = countryNameFromCode(countryUpper);
            var countryImg = "";
            if(country !== ""){
                countryImg = `<a class='${cellClass}-content' href='/rankings/${mapModeStr}/performance?country=${countryUpper}'>
                        <div class='flag-country flag-country--flat' style='background-image: url(&quot;${getCountryUrl(countryUpper)}&quot;);' title='${countryName}'></div>
                    </a>`;
            }
            var pprank;
            if(score.user.pp_rank === undefined){
                pprank = " <span class='pprank'></span>";
            }else{
                pprank = ` <span class='pprank'>&nbsp;(#${score.user.pp_rank})</span>`;
            }
            var userhref = `<a class='${cellClass}-content ${cellClass}-content--user-link js-usercard' data-user-id='${score.user_id}' href='/users/${score.user_id}/${mapModeStr}'>${score.username} ${pprank}</a>`;

            var ppcalcData = makePpcalcData(mapMode, score, acc, mapID);

            function makeTdLink(modifiers, content){
                return `<td class=${cellClass}>
                        <a class='${cellClass}-content ${modifiers.map(x => `${cellClass}-content--${x}`).join(" ")}' ${scoreHref}>
                            ${content}
                        </a>
                    </td>`;
            }

            function makeZeroableEntry(num){
                return makeTdLink(num === "0" ? ["zero"] : [], commarise(num));
            }

            var row = $(`<tr class='${rowclass}'>
                    <td class='${cellClass} ${cellClass}-oprank'>
                        <a class='${cellClass}-content ${cellClass}-content--rank ${cellClass}-content--oprank'
                            ${score.replay_available == "1" ? `href='/scores/${intToMode(mapMode)}/${score.score_id}/download'` : ""}>
                            #${rankno}
                        </a>
                        <a class='${cellClass}-content' ${scoreHref}></a>
                    </td>
                    ${makeTdLink(["grade"], `
                        <div class='score-rank score-rank--tiny score-rank--${score.rank}'></div>`)}
                    ${makeTdLink(["score"], commarise(score.score))}
                    ${makeTdLink(acc == 100 ? ["perfect"] : [], `${acc.toFixed(2)}%`)}
                    <td class='${cellClass}'>${countryImg}</td>
                    <td class='${cellClass} u-relative'>
                        ${userhref}
                        <a class='${cellClass}-content' ${scoreHref}></a>
                    </td>
                    ${makeTdLink(score.perfect == "1" ? ["perfect"] : [], commarise(score.maxcombo) + "x")}
                    ${mapMode == 3 ?
                    // Mania
                    [
                        makeZeroableEntry(score.countgeki),
                        makeZeroableEntry(score.count300),
                        makeZeroableEntry(score.countkatu),
                        makeZeroableEntry(score.count100),
                        makeZeroableEntry(score.count50)
                    ].join("") :
                    mapMode == 1 ?
                    // Taiko
                    [
                        makeZeroableEntry(score.count300),
                        makeZeroableEntry(score.count100)
                    ].join("") :
                    mapMode == 2 ?
                    // CTB
                    [
                        makeZeroableEntry(score.count300),
                        makeZeroableEntry(score.count100),
                        makeZeroableEntry(score.countkatu)
                    ].join("") :
                    // Standard
                    [
                        makeZeroableEntry(score.count300),
                        makeZeroableEntry(score.count100),
                        makeZeroableEntry(score.count50)
                    ].join("")}
                    ${makeZeroableEntry(score.countmiss)}
                    <td class='${cellClass} osuplus-pp-cell${mapMode == 0 ? " ppcalc-pp" : ""}'>
                        <a class='${cellClass}-content'>
                            <span title="${score.pp}">${parseFloat(score.pp).toFixed(settings.pp2dp ? 2 : 0)}</span> <span class="if-fc-span"></span>
                        </a>
                    </td>
                    ${makeTdLink(["time"], `
                        <time class='js-tooltip-time' title='${datetime}'>
                            ${window.eval(`moment("${datetime}").locale("scoreboard").fromNow()`)}
                        </time>`)}
                    ${makeTdLink(["mods"], `
                        <div class='beatmap-scoreboard-table__mods'>
                            ${getNewMods(score.enabled_mods)}
                        </div>`)}
                    <!--<td class="beatmap-scoreboard-table__play-detail-menu"></td>-->
                    <td class='op-ppcalc-data' hidden>${JSON.stringify(ppcalcData)}</td>
                </tr>`);
            //doesn't work on greasemonkey, unfixable?
            //ReactDOM.render(React.createElement(_exported.PlayDetailMenu, {score: newify(score)}), row.find(".beatmap-scoreboard-table__play-detail-menu")[0]);

            //ppcalc, only for std
            if(mapMode == 0){
                row.find(".ppcalc-pp").click(function(event){
                    var me = $(this);
                    me.find(".if-fc-span").text("(...)");
                    var ppcalcData = JSON.parse(me.parent().find(".op-ppcalc-data").text());
                    doPpcalc(ppcalcData).then((result) => {
                        if([RANKED, QUALIFIED].includes(Number(result.approved))){
                            me.find(".if-fc-span").text(`(${result.pp_fc} if FC)`);
                        }else{
                            me.html(`<span class="if-fc-span">${result.pp} (${result.pp_fc} FC)</span>`);
                        }
                    });
                });
            }

            return row;
        }
        /*
        function newify(score){
            score.replay = (score.replay_available == "1");
            score.user = {username: score.username};
            score.beatmap = {mode: intToMode(mapMode)};
            score.id = score.score_id;
            return score;
        }*/

        function updateScoresTable(callback){
            var tableRows = [];
            var usedUsers = [];
            var rank = 0;
            for(var i=0; i<scoresResult.length; i++){
                var greyedout = false;
                if(inArray(usedUsers, scoresResult[i].user_id)){
                    greyedout = true;
                }else{
                    usedUsers.push(scoresResult[i].user_id);
                    rank += 1;
                }
                var tableRow = makeScoreTableRow(scoresResult[i], rank, greyedout);
                tableRows[i] = tableRow;
            }

            $(".osuplus-table.beatmap-scoreboard-table__table .beatmap-scoreboard-table__body-row").remove();
            $(".osuplus-table.beatmap-scoreboard-table__table .beatmap-scoreboard-table__body").append(tableRows);
            //$(".timeago").timeago();
            //updateShowDate();
            tableLoadingNotice.hide();
            if(callback) callback();
        }

        function putModButtons(){
            $("#mod-buttons").remove();
            function genModBtns(modArray){
                var modgroup = $("<div></div>").addClass("modIconGroup"),
                    modgroupArr = [];
                for(var i=0; i<modArray.length; i++){
                    var modinfo = modArray[i];
                    var modimg;
                    if(modinfo.mods.length === 1){
                        modimg = $("<div></div>")
                            .addClass("modIcon")
                            .append($("<img>").attr("src", modIconImgs[modinfo.mods[0]]))
                            .attr("value", modinfo.mods[0]);
                    }else{
                        modimg = $("<div></div>").addClass("modIcon").append(
                            $("<div></div>").addClass("modIconOption").append(
                                $("<img>").attr("src", modIconImgs[modinfo.mods[0]])
                            ),
                            $("<div></div>").addClass("modIconOption").append(
                                $("<img>").attr("src", modIconImgs[modinfo.mods[1]])
                            )
                        )
                            .attr("value", modinfo.mods.join(","));
                    }
                    if(i > 0) modimg.hide();

                    if(modinfo.mods[0] === "NM"){
                        modimg.click(nomodIconClick);
                        modimg.addClass("nomodIcon");
                    }else{
                        modimg.click(modIconClick);
                        modimg.contextmenu(modIconRightClick);
                    }

                    if(modinfo.selection === 0){
                        modimg.addClass("notSelected");
                        modimg.attr("value", "XX");
                    }else if(modinfo.selection === 1){
                        modimg.addClass("isSelected");
                        modimg.attr("value", modinfo.mods.join(","));
                    }else{ // modinfo.selection === 2
                        modimg.addClass("partialSelected");
                        modimg.attr("value", ["XX"].concat(modinfo.mods).join(","));
                    }
                    modgroupArr.push(modimg);
                }
                modgroup.html(modgroupArr);
                return modgroup;
            }

            $(".beatmap-scoreboard-table").before($("<div class='osuplus-table' id='mod-buttons'></div>").append(
                genModBtns([
                    {mods: ["NM"], selection: 0},
                    {mods: ["NM"], selection: 1}]),
                mapMode < 3 ? // HD for non-mania
                    genModBtns([
                        {mods: ["HD"], selection: 0},
                        {mods: ["HD"], selection: 1},
                        {mods: ["HD"], selection: 2}]) :
                    genModBtns([ // FI, HD for mania
                        {mods: ["FI"], selection: 0},
                        {mods: ["FI"], selection: 1},
                        {mods: ["HD"], selection: 1},
                        {mods: ["FI", "HD"], selection: 1},
                        {mods: ["FI", "HD"], selection: 2}]),
                genModBtns([
                    {mods: ["HR"], selection: 0},
                    {mods: ["HR"], selection: 1},
                    {mods: ["HR"], selection: 2},
                    {mods: ["EZ"], selection: 1},
                    {mods: ["EZ"], selection: 2}]),
                genModBtns([
                    {mods: ["DT"], selection: 0},
                    {mods: ["DT"], selection: 1},
                    {mods: ["NC"], selection: 1},
                    {mods: ["DT", "NC"], selection: 1},
                    {mods: ["DT", "NC"], selection: 2},
                    {mods: ["HT"], selection: 1},
                    {mods: ["HT"], selection: 2}]),
                genModBtns([
                    {mods: ["SD"], selection: 0},
                    {mods: ["SD"], selection: 1},
                    {mods: ["PF"], selection: 1},
                    {mods: ["SD", "PF"], selection: 1},
                    {mods: ["SD", "PF"], selection: 2},
                    {mods: ["NF"], selection: 1},
                    {mods: ["NF"], selection: 2}]),
                genModBtns([
                    {mods: ["FL"], selection: 0},
                    {mods: ["FL"], selection: 1},
                    {mods: ["FL"], selection: 2}]),
                mapMode < 3 ? [] : //mania keys
                    genModBtns([
                        {mods: ["4K"], selection: 0},
                        {mods: ["4K"], selection: 1},
                        {mods: ["5K"], selection: 1},
                        {mods: ["6K"], selection: 1},
                        {mods: ["7K"], selection: 1},
                        {mods: ["8K"], selection: 1},
                        {mods: ["9K"], selection: 1}]),
                mapMode < 3 ? [] : //mirror
                    genModBtns([
                        {mods: ["MR"], selection: 0},
                        {mods: ["MR"], selection: 1},
                        {mods: ["MR"], selection: 2}]),
                mapMode > 0 ? [] : //SO only for standard
                    [
                        genModBtns([
                            {mods: ["SO"], selection: 0},
                            {mods: ["SO"], selection: 1},
                            {mods: ["SO"], selection: 2}]),
                        genModBtns([
                            {mods: ["TD"], selection: 0},
                            {mods: ["TD"], selection: 1},
                            {mods: ["TD"], selection: 2}])
                    ]
            ));
        }

        function nomodIconClick(){
            if(!modsEnabled) return;
            $(".modIcon").each(function(){
                $(this).hide();
                $(this).parent().children().first().show();
            });
            modIconClick.bind(this)();
        }

        function modIconClick(){
            if(!modsEnabled) return;
            if(!$(this).hasClass("nomodIcon")){
                $(".nomodIcon").hide().parent().children().first().show();
            }
            var parent = $(this).parent();
            $(this).hide();
            if($(this).next().length === 0){
                parent.children().first().show();
            }else{
                $(this).next().show();
            }

            timeoutUpdate();
        }

        function modIconRightClick(){
            if(!modsEnabled) return;
            if(!$(this).hasClass("nomodIcon")){
                $(".nomodIcon").hide().parent().children().first().show();
            }
            var parent = $(this).parent();
            $(this).hide();
            if($(this).prev().length === 0){
                parent.children().last().show();
            }else{
                $(this).prev().show();
            }

            timeoutUpdate();
            return false;
        }

        function timeoutUpdate(){
            if(timeoutID !== null){
                clearTimeout(timeoutID);
            }
            timeoutID = setTimeout(function(){
                timeoutID = null;
                updateModScores();
            }, timeDelay);
        }

        function updateModScores(){
            clearScoresTable();
            abortReqs();

            var modvals = getSelectedMods();
            var funs = [];
            scoresResult = [];
            for(var i=0; i<modvals.length; i++){
                var modval = modvals[i];
                if(modval < 0){
                    funs.push(function(callback){
                        getScoresWithPlayerInfo({b:mapID, m:mapMode, limit:settings.displayTopNum}, settings.showPpRank, function(response){
                            scoresResult = scoresResult.concat(response);
                            callback();
                        }, scoreReqs);
                    });
                }else{
                    funs.push(function(modval){
                        return function(callback){
                            getScoresWithPlayerInfo({b:mapID, m:mapMode, limit:settings.displayTopNum, mods:modval}, settings.showPpRank, function(response){
                                scoresResult = scoresResult.concat(response);
                                callback();
                            }, scoreReqs);
                        };
                    }(modval));
                }
            }
            doManyFunc(funs, function(){
                sortResult("score");
                scoresResult.splice(settings.displayTopNum);
                updateScoresTable();
            });

        }

        function getSelectedMods(){
            var selected = [[]];
            $(".modIcon:visible").each(function(){
                var modarray = $(this).attr("value").split(",");
                selected = cartesianProd(selected, modarray);
            });

            // handle doublemods
            for(let si=0; si<selected.length; si++){
                for(let i=0; i<doublemods.length; i++){
                    if(selected[si].indexOf(doublemods[i][0]) >= 0){
                        if(selected[si].indexOf(doublemods[i][1]) < 0){
                            selected[si].push(doublemods[i][1]);
                        }
                    }
                }
            }

            var modvals = [];
            for(let si=0; si<selected.length; si++){
                var modval = 0;
                for(let i=0; i<modnames.length; i++){
                    if(selected[si].indexOf(modnames[i].short) >= 0){
                        modval += modnames[i].val;
                    }
                }
                modvals.push(modval);
            }
            if(selected.length === 1 && modvals[0] === 0 && selected[0].indexOf("NM") < 0){ //get all scores
                return [-1];
            }
            return modvals;
        }

        function putRankingType(){
            $(".beatmap-scoreboard-table").before(
                $("<div class='osuplus-table' id='rankingtype'></div>").append(
                    $("<label></label>").append(
                        $("<input>")
                            .attr({
                                type: "radio",
                                name: "rankingtype",
                                value: "global"})
                            .prop("checked", true)
                            .change(rankingTypeChanged),
                        "Global"),
                    $("<label></label>").append(
                        $("<input>")
                            .attr({
                                type: "radio",
                                name: "rankingtype",
                                value: "friends"})
                            .change(rankingTypeChanged),
                        "Friends"),
                    //Show date button
                    /*
                    $("<label></label>").append(
                        $("<input>")
                            .attr({
                                type: "checkbox",
                                id: "showdatebox"})
                            .change(showDateChanged)
                            .prop("checked", showDates),
                        "Show date")*/
                )
            );
        }
        /*
        function showDateChanged(){
            showDates = $("#showdatebox").prop("checked");
            updateShowDate();
        }

        function updateShowDate(){
            if(showDates) $(".datecol").show();
            else $(".datecol").hide();
        }*/

        function rankingTypeChanged(){
            var rankingType = $("input[name=rankingtype]:checked").val();

            if(rankingType == "global"){
                modsEnabled = true;
                if(timeoutID !== null) clearTimeout(timeoutID);
                updateModScores();
            }else if(rankingType == "friends"){
                modsEnabled = false;
                if(timeoutID !== null) clearTimeout(timeoutID);
                updateFriendsScores();
            }
        }

        function updateFriendsScores(){
            clearScoresTable();
            abortReqs();

            // Make copy of friends including yourself
            var friends2 = friends.slice(0);
            if(!inArray(friends2, currentUser.id.toString())){
                friends2.push(currentUser.id.toString());
            }

            var funs = [];
            for(var i=0; i<friends2.length; i++){
                funs.push(function(uid){
                    return function(callback){
                        getScoresWithPlayerInfo({b:mapID, u:uid, m:mapMode, type:"id"}, settings.showPpRank, function(response){
                            if(response.length > 0){
                                scoresResult = scoresResult.concat(response);
                            }
                            callback();
                        }, scoreReqs);
                    };
                }(friends2[i]));
            }
            doManyFunc(funs, function(){
                sortResult("score");
                updateScoresTable();
            });
        }

        function makeMirror(url, topName, bottomName, newTab){
            var mirror = `<a href="${url}" ${newTab ? "target='_blank'" : ""} data-turbolinks="false" class="btn-osu-big btn-osu-big--beatmapset-header js-beatmapset-download-link">
                <span class="btn-osu-big__content ">
                <span class="btn-osu-big__left">
                <span class="btn-osu-big__text-top">${topName}</span>
                ${bottomName === null ? "" : `<span class="btn-osu-big__text-bottom">${bottomName}</span>`}
                </span><span class="btn-osu-big__icon">
                <span class="fa-fw"><i class="fas fa-download"></i></span></span></span></a>`;
            if($(".beatmapset-header__more").length > 0){
                $(".beatmapset-header__more").before(mirror);
            }else{
                $(".beatmapset-header__buttons").append(mirror);
            }
        }

        function addMirrors(){
            if(settings.showMirror){
                makeMirror(`https://beatconnect.io/b/${jsonBeatmapset.id}`, "Beatconnect", null, false);
            }
            if(settings.showMirror2){
                makeMirror(`https://dl.sayobot.cn/beatmaps/download/full/${jsonBeatmapset.id}`, "Sayobot", null, false);
                makeMirror(`https://dl.sayobot.cn/beatmaps/download/novideo/${jsonBeatmapset.id}`, "Sayobot", "no Video", false);
            }
            if(settings.showMirror3){
                makeMirror(`https://api.nerinyan.moe/d/${jsonBeatmapset.id}`, "NeriNyan", null, false);
                makeMirror(`https://api.nerinyan.moe/d/${jsonBeatmapset.id}?nv=1`, "NeriNyan", "no Video", false);
            }
            if(settings.showMirror4){
                makeMirror(`https://catboy.best/d/${jsonBeatmapset.id}`, "Mino", null, false);
            }
            if(settings.showMirror5){
                makeMirror(`https://omdb.nyahh.net/mapset/${jsonBeatmapset.id}`, "OMDB", "click to rate", true);
            }
        }

        function addOsuPreview(){
            if(!settings.osupreview && !settings.osupreview2) return;
            $(".beatmapset-info").after(
                $("<div class='osupreview-container osuplus-header'><div class='js-spoilerbox bbcode-spoilerbox'>\
                    <a class='js-spoilerbox__link bbcode-spoilerbox__link' href='#'><span class='bbcode-spoilerbox__link-icon'></span>Preview</a>\
                    <div class='js-spoilerbox__body bbcode-spoilerbox__body'><div id='osupreview'></div></div></div>"
                ).click(function(){
                    var osupreviewEle = $(this).find("#osupreview");
                    if(osupreviewEle.data("loaded")) return;
                    osupreviewEle.html(
                        `${settings.osupreview ? `osu!preview (<a href='http://jmir.xyz/osu/preview.html#${mapID}' target='_blank'>open in new tab</a>)<br>
                        <iframe class='osupreview' src='https://jmir.xyz/osu/preview.html#${mapID}' allowfullscreen></iframe><br><br>` : ""}
                        ${settings.osupreview2 ? `<a href='https://github.com/FukutoTojido/beatmap-viewer-web'>osu! Web Beatmap Viewer</a> (<a href='https://preview.tryz.id.vn/?b=${mapID}' target='_blank'>open in new tab</a>)<br>
                        <iframe class='osupreview2' src='https://preview.tryz.id.vn/?b=${mapID}' allowfullscreen></iframe>` : ""}`
                    );
                    osupreviewEle.data("loaded", true);
                })
            );
        }

        function addSlider(){ // and export button
            $(".beatmap-scoreboard-table").before(
                $("<div class='osuplus-table slider-export-container'></div>").append(
                    createSlider(function(val, checked){
                        var rows = $(".osuplus-table.beatmap-scoreboard-table__table .beatmap-scoreboard-table__body-row");
                        if(checked){
                            var curTime = new Date();
                            rows.each(function(index, row){
                                row = $(row);
                                var scoreTime = row.find("time").attr("title") || row.find("time").attr("data-orig-title");
                                scoreTime = new Date(scoreTime);
                                var diff = (curTime - scoreTime) / (1000*60*60*24);
                                if(diff < val){
                                    row.addClass("recentscore");
                                }else{
                                    row.removeClass("recentscore");
                                }
                            });
                        }else{
                            rows.removeClass("recentscore");
                        }
                    }).addClass("slider-container"),
                    "<div class='export-container'><a class='export-btn'>export to csv</a></div>"
                )
            );
            $(".export-btn").click(function(){
                downloadFile(scoresToCsv(scoresResult, mapMode), "scores.csv");
            });
        }

        function abortReqs(){
            while(scoreReqs.length){
                scoreReqs.pop().abort();
            }
        }

        function sortResult(sortby){
            if(sortby === "score"){
                scoresResult.sort(function(a,b){
                    var ascore = parseInt(a.score),
                        bscore = parseInt(b.score);
                    if(ascore < bscore){
                        return 1;
                    }else if(ascore > bscore){
                        return -1;
                    }else{
                        return getTime(a.date) - getTime(b.date);
                    }
                });
            }else if(sortby === "pp"){
                scoresResult.sort(function(a,b){
                    var ascore = parseFloat(a.pp),
                        bscore = parseFloat(b.pp);
                    if(ascore < bscore){
                        return 1;
                    }else if(ascore > bscore){
                        return -1;
                    }else{
                        ascore = parseFloat(a.score);
                        bscore = parseFloat(b.score);
                        if(ascore < bscore){
                            return 1;
                        }else if(ascore > bscore){
                            return -1;
                        }else{
                            return getTime(a.date) - getTime(b.date);
                        }
                    }
                });
            }
        }

        function addTableLoadingNotice(){
            var tableLoadingNotice = $(`<div class='osuplus-table' id='table-loading-notice'><img src='${loaderImg}' class='centered'></div>`);
            $(".beatmap-scoreboard-table__table").before(tableLoadingNotice);
            return tableLoadingNotice;
        }

        function modifyTableHeaders(){
            // Add click scores/pp to sort
            $(".osuplus-table.beatmap-scoreboard-table__table .beatmap-scoreboard-table__header--score").text("").append(
                $("<a>Score</a>")
                    .click(function(){
                        sortResult("score");
                        updateScoresTable();
                    })
            );
            var ppheader = $(".osuplus-table.beatmap-scoreboard-table__table .beatmap-scoreboard-table__header--pp");
            if(ppheader.length == 0){
                ppheader = $("<th class='beatmap-scoreboard-table__header beatmap-scoreboard-table__header--pp'></th>");
                $(".osuplus-table.beatmap-scoreboard-table__table .beatmap-scoreboard-table__header--time").before(ppheader);
            }
            ppheader.text("").append(
                $("<a>pp</a>")
                    .click(function(){
                        sortResult("pp");
                        updateScoresTable();
                    })
            );

            // Add date column
            //$(".osuplus-table.beatmap-scoreboard-table__table thead tr").children().last().before("<th class='beatmap-scoreboard-table__header beatmap-scoreboard-table__header--date datecol'>Date</th>");
            //$(".search-beatmap-scoreboard-table__table thead tr").children().last().before("<th class='beatmap-scoreboard-table__header beatmap-scoreboard-table__header--date datecol'>Date</th>");

            // Add max combo
            $(".osuplus-table .beatmap-scoreboard-table__header--maxcombo").text(`Max Combo${maxCombo ? ` (${maxCombo})` : ""}`);
        }

        function clearScoresTable(){
            scoresResult = [];
            updateScoresTable(function(){
                tableLoadingNotice.show();
            });
        }

        function addSearchUser(){
            $(".beatmap-scoreboard-table").before(
                $("<div class='osuplus-table'></div>").attr("id", "searchuser")
                    .append(
                        $("<strong>Search user: </strong>"),
                        $("<input>")
                            .attr({type: "text", id: "searchusertxt"})
                            .val(currentUser.username)
                            .bind("enterKey", searchUserEnter)
                            .keyup(function(e){
                                if(e.keyCode == 13)
                                {
                                    $(this).trigger("enterKey");
                                }
                            }),
                        $("<div></div>").attr("id", "searchuserinfo").text("Searching...").hide(),
                        $("<div></div>").attr("class", "search-beatmap-scoreboard-table")
                            .attr("id", "searchuserresult")
                            .append(
                                $("<table class='search-beatmap-scoreboard-table__table'></table>").append(
                                    $("<thead></thead>").append(
                                        $(".beatmap-scoreboard-table__table thead tr").clone()
                                    )
                                ).append("<tbody class='beatmap-scoreboard-table__body'></tbody>")
                            ).hide()
                    )
            );
        }

        function searchUserEnter(){
            $("#searchuserinfo").text("Searching...").show();
            $("#searchuserresult").hide();
            var searchusernames = $("#searchusertxt").val().split(",");
            var promises = searchusernames.map((username) => new Promise(function(resolve, reject){
                getScoresWithPlayerInfo({b:mapID, u:username, m:mapMode, type:"string"}, settings.showPpRank, resolve);
            }));
            Promise.all(promises).then((responses) => {
                var response = [];
                for(let r of responses){
                    response = response.concat(r);
                }
                response.sort((a,b) => parseInt(b.score) - parseInt(a.score));
                if(response.length > 0){
                    $("#searchuserresult .beatmap-scoreboard-table__body").children().remove();
                    response.forEach(function(score, index){
                        var tableRow = makeScoreTableRow(score, index+1);
                        $("#searchuserresult .beatmap-scoreboard-table__body").append(tableRow);
                    });

                    //$(".timeago").timeago();
                    $("#searchuserinfo").hide();
                    $("#searchuserresult").show();
                }else{
                    $("#searchuserinfo").text("No scores found :(");
                }
            });
        }

        function isFriend(uid){
            var friends = currentUser.friends;
            for(var i=0; i<friends.length; i++){
                if(friends[i].target_id.toString() === uid) return true;
            }
            return false;
        }

        function minePlayerCountries(){
            $(".beatmap-scoreboard-table__body").children().each(function(index, ele){
                var country = $(ele).children().eq(4).children().first().attr("href").split("=")[1].toLowerCase();
                var uid = $(ele).find(".js-usercard").attr("data-user-id");
                savePlayerCountry(uid, country);
            });
        }

        return {init: init, destroy: destroy};
    }


    function getPlayerCountry(playerid, callback){
        if(playerid in playerCountries){
            callback(playerCountries[playerid]);
        }else{
            if(settings.fetchPlayerCountries){
                getUser({u:playerid, type:"id"}, function(response){
                    var country;
                    if(response.length){
                        country = response[0].country.toLowerCase();
                    }else{
                        country = "xx";
                    }
                    savePlayerCountry(playerid, country);
                    callback(country);
                });
            }else{
                callback("");
            }
        }
    }

    function savePlayerCountry(playerid, country){
        playerCountries[playerid] = country;
    }

    function createSlider(valueChange){
        var slider, sliderLbl, sliderCB;
        function getValue(){
            var rawval = slider.val();
            if(rawval <= 7){
                return rawval;
            }else if(rawval <= 9){
                return (rawval - 6) * 7;
            }else{
                return (rawval - 9) * 30;
            }
        }

        var changeFun = function(){
            sliderLbl.text(getValue());
            valueChange(getValue(), sliderCB.prop("checked"));
        };

        slider = $("<input type='range' min=1 max=21 id='opslider' value=7>").on("input", changeFun);
        sliderLbl = $("<span>7</span>");
        sliderCB = $("<input type=checkbox id='topcb'/>").change(changeFun);
        return $("<div></div>").append(
            slider,
            $("<label></label>").append(
                sliderCB, "Highlight past ", sliderLbl, " days"
            )
        );
    }

    function displayGetKey(){
        $(document.head).append($("<style class='osuplus-displaygetkey-style'></style>").html(
            `.op-getkey {text-align: center; background-color: red;}
            .op-getkey h1 {color: white;}
            .nav2-header {position: relative;}`
        ));
        $(document.body).prepend(
            `<div class="op-getkey">
                <h1 id="osuplusnotice">
                    [osuplus] Click <a class="a-promptKey">here</a> to use your osu!API key.<br>
                    Don't have API key? Get from <a href='https://osu.ppy.sh/p/api' target="_blank">here</a> or <a href='https://old.ppy.sh/p/api' target="_blank">here</a>
                </h1>
            </div>`
        );
        $(".a-promptKey").click(promptKey);
    }

    function promptKey(){
        var yourKey = prompt("Enter your API key");
        if(yourKey !== null){
            testKey(yourKey, function(islegit){
                if(islegit){
                    GMX.setValue("apikey", yourKey).then(() => {
                        apikey = yourKey;
                        hasKey = true;
                        alert("API key worked! Your page will now refresh");
                        location.reload();
                    });
                }else{
                    alert("API key failed :(");
                }
            });
        }
    }

    function testKey(key, callback){
        var url = "https://osu.ppy.sh/api/get_user?k=" + key;
        GetPage(url, function(response){
            var jresponse = JSON.parse(response);
            if("error" in jresponse){
                callback(false);
            }else{
                callback(true);
            }
        });
    }

    function scoresToCsv(scores, mapMode){
        var header = ["rank", "score", "accuracy", "country", "username", "user_id", "maxcombo", "perfect", "300", "100", "50", "geki", "katu", "miss", "pp", "date", "mods", "mods_int", "replay_available", "score_id"];
        var content = scores.map((score) => [
            score.rank,
            score.score,
            calcAcc(score, mapMode),
            score.user.country || "",
            score.username,
            score.user_id,
            score.maxcombo,
            score.perfect,
            score.count300,
            score.count100,
            score.count50,
            score.countgeki,
            score.countkatu,
            score.countmiss,
            score.pp,
            score.date,
            `"${getMods(score.enabled_mods)}"`,
            score.enabled_mods,
            score.replay_available,
            score.score_id
        ]);
        var table = [header].concat(content);
        return table.map((row) => row.join(",")).join("\n");
    }

    function getModsArray(modnum){
        modnum = parseInt(modnum);
        var mods = [];
        for(let mod of modnames){
            if(mod.val & modnum){
                mods.push(mod);
            }
        }
        // handle doublemods
        for(var i=0; i<doublemods.length; i++){
            for(var j=0; j<mods.length; j++){
                if(mods[j].short === doublemods[i][0]){
                    for(var k=0; k<mods.length; k++){
                        if(mods[k].short === doublemods[i][1]){
                            mods.splice(k, 1);
                            break;
                        }
                    }
                    break;
                }
            }
        }
        return mods;
    }

    function getMods(modnum){
        var modsArray = getModsArray(modnum);
        if(modsArray.length === 0) return "None";
        else{
            return modsArray.map(function(mod){ return mod.short; }).join(",");
        }
    }

    function getNewMods(modnum){
        var modsArray = getModsArray(modnum);
        var modsHtml = modsArray.map(function(mod){
            //return `<div class='mods__mod'><div class='mods__mod-image'><div class='mod mod--dynamic mod--${mod.short}' title='${mod.name}'></div></div></div>`;
            return `<div class='mod mod--${mod.short}' title='${mod.name}'></div>`;
        });
        return modsHtml.join("");
    }

    function modShortToNum(mod){ // e.g. "HD" -> 16
        for(let md of modnames){
            if(md.short == mod){
                return md.val;
            }
        }
    }

    function modArrayToNum(arr){ // e.g. ["HD", "HR"] -> 24
        let modnum = 0;
        for(let mod of arr){
            modnum |= modShortToNum(mod);
        }

        for(let doublemod of doublemods){
            let mod1num = modShortToNum(doublemod[0]);
            if(mod1num & modnum){
                let mod2num = modShortToNum(doublemod[1]);
                modnum |= mod2num;
            }
        }
        return modnum;
    }

    function calcAcc(score, mode){
        var c50   = parseInt(score.count50),
            c100  = parseInt(score.count100),
            c300  = parseInt(score.count300),
            cmiss = parseInt(score.countmiss),
            cgeki = parseInt(score.countgeki),
            ckatu = parseInt(score.countkatu);
        switch(mode){
        case 0: // Standard
            return 100.0 * (6*c300 + 2*c100 + c50) / (6*(c50 + c100 + c300 + cmiss));
        case 1: // Taiko
            return 100.0 * (2*c300 + c100) / (2*(c300 + c100 + cmiss));
        case 2: // CTB
            return 100.0 * (c300 + c100 + c50) / (c300 + c100 + c50 + ckatu + cmiss);
        case 3: // Mania
            return 100.0 * (6*cgeki + 6*c300 + 4*ckatu + 2*c100 + c50) / (6*(c50 + c100 + c300 + cmiss + cgeki + ckatu));
        }
    }

    function calcGrade(score, mode, mods){
        var c50   = parseInt(score.count50),
            c100  = parseInt(score.count100),
            c300  = parseInt(score.count300),
            cmiss = parseInt(score.countmiss);
            //cgeki = parseInt(score.countgeki),
            //ckatu = parseInt(score.countkatu);
        var ctotal;
        var acc = calcAcc(score, mode);
        var grade = "";
        switch(mode){
        case 0: // Standard
            ctotal = c50 + c100 + c300 + cmiss;
            if(ctotal == c300){
                grade = "X";
            }else if(c300 >= 0.9*ctotal && c50 <= 0.01*ctotal && cmiss == 0){
                grade = "S";
            }else if(c300 >= 0.8*ctotal && cmiss == 0 || c300 >= 0.9*ctotal){
                grade = "A";
            }else if(c300 >= 0.7*ctotal && cmiss == 0 || c300 >= 0.8*ctotal){
                grade = "B";
            }else if(c300 >= 0.6*ctotal){
                grade = "C";
            }else{
                grade = "D";
            }
            break;
        case 1: // Taiko
            // i have no idea and the wiki is inconsistent lol
            grade = "S";
            break;
        case 2: // CTB
            if(acc == 100){
                grade = "X";
            }else if(acc > 98){
                grade = "S";
            }else if(acc > 94){
                grade = "A";
            }else if(acc > 90){
                grade = "B";
            }else if(acc > 85){
                grade = "C";
            }else{
                grade = "D";
            }
            break;
        case 3: // Mania
            if(acc == 100){
                grade = "X";
            }else if(acc > 95){
                grade = "S";
            }else if(acc > 90){
                grade = "A";
            }else if(acc > 80){
                grade = "B";
            }else if(acc > 70){
                grade = "C";
            }else{
                grade = "D";
            }
        }
        var silverflag = (1<<3) + (1<<10) + (1<<20); // HD+FL+FI
        if(mods & silverflag){
            if(grade == "X" || grade == "S"){
                grade += "H";
            }
        }
        return grade;
    }

    function getTime(datestring){
        return new Date(datestring).getTime();
    }

    function getCountryUrl(code){
        var baseFileName = code.split("").map((c) => ((c.charCodeAt(0) + 127397).toString(16))).join("-");
        return `/assets/images/flags/${baseFileName}.svg`;
    }

    function commarise(num){
        num = num.toString();
        var numarray = [];
        while(num !== ""){
            numarray.push(num.slice(-3));
            num = num.slice(0,-3);
        }
        return numarray.reverse().join(",");
    }

    function decommarise(numstr){
        return parseInt(numstr.split("").filter(c => {
            return c >= "0" && c <= "9";
        }).join(""));
    }

    function secsToMins(secs){
        var s = "00"+(secs % 60);
        return (secs/60>>0) + ":" + s.substr(s.length-2);
    }

    /* old code used for old site
    function getRankImg(rank){
        var ranksrc;
        if(rank === "F"){
            ranksrc = FImg;
        }else{
            ranksrc = "//s.ppy.sh/images/" + rank + "_small.png";
        }
        return "<img src='" + ranksrc + "'>";
    }
    */

    function modeToInt(mode){
        switch(mode){
        case "osu":
            return 0;
        case "taiko":
            return 1;
        case "fruits":
            return 2;
        case "mania":
            return 3;
        default:
            return 0;
        }
    }

    function intToMode(modeint){
        switch(modeint){
        case 0:
            return "osu";
        case 1:
            return "taiko";
        case 2:
            return "fruits";
        case 3:
            return "mania";
        default:
            return "osu";
        }
    }

    // eslint-disable-next-line no-unused-vars
    function formatNumberSuffixed(num, precision){
        const suffixes = ["", "k", "m", "b", "t"];
        const k = 1000;

        const format = (n) => {
            var options = {minimumFractionDigits: 0, maximumFractionDigits: precision};
            return n.toLocaleString("en", options);
        };

        if (num < k) return format(num);
        const i = Math.min(suffixes.length - 1, Math.floor(Math.log(num) / Math.log(k)));

        return `${format(num / Math.pow(k, i))}${suffixes[i]}`;
    }

    // eslint-disable-next-line no-unused-vars
    function getDiffRating(rating){
        rating = parseFloat(rating);
        if (rating < 2) return "easy";
        if (rating < 2.7) return "normal";
        if (rating < 4) return "hard";
        if (rating < 5.3) return "insane";
        if (rating < 6.5) return "expert";
        return "expert-plus";
    }

    var getBeatmapFileCache = (() => {
        var callbacks = {},
            cache = {};

        function getBeatmapFileCache(id, callback){
            if(id in cache){
                callback(cache[id]);
            }else if(id in callbacks){
                callbacks[id].push(callback);
            }else{
                callbacks[id] = [callback];
                getBeatmapFile(id, function(response){
                    cache[id] = response;
                    callbacks[id].forEach(function(cb){
                        cb(response);
                    });
                    delete callbacks[id];
                });
            }
        }

        return getBeatmapFileCache;
    })();

    function makePpcalcData(modeInt, play, acc, beatmapId) {
        return {
            mode: modeInt,
            id: beatmapId,
            mods: Number(play.enabled_mods),
            combo: Number(play.maxcombo),
            n300: Number(play.count300),
            n100: Number(play.count100),
            n50: Number(play.count50),
            nmiss: Number(play.countmiss),
            acc: acc,
        };
    }

    function doPpcalc(ppcalcData) {
        if (ppcalcData.mode != 0)
            throw new Error(`mode not supported: ${ppcalcData.mode}`);

        var ppResult = new Promise(resolve => getBeatmapFileCache(ppcalcData.id, resolve))
            .then(beatmapFile => {
                var parser = new ojsama.parser().feed(beatmapFile);
                //debugValue(parser.toString());
                //debugValue(parser.map.toString());

                return {
                    pp: debugValue(ojsama.ppv2({
                        map: parser.map,
                        mode: ppcalcData.mode,
                        mods: ppcalcData.mods,
                        combo: ppcalcData.combo,
                        n300: ppcalcData.n300,
                        n100: ppcalcData.n100,
                        n50: ppcalcData.n50,
                        nmiss: ppcalcData.nmiss,
                    })),
                    // "pp if full combo" is defined here as max combo and every miss converted to 300.
                    // the new n300 is not always (n300 + nmiss), because the play may have failed early.
                    pp_fc: debugValue(ojsama.ppv2({
                        map: parser.map,
                        mode: ppcalcData.mode,
                        mods: ppcalcData.mods,
                        combo: parser.map.max_combo(),
                        n300: parser.map.objects.length - ppcalcData.n100 - ppcalcData.n50,
                        n100: ppcalcData.n100,
                        n50: ppcalcData.n50,
                        nmiss: 0,
                    })),
                };
            });

        var getBeatmapsResult = new Promise(resolve => getBeatmapsCache({
            b: ppcalcData.id,
            m: ppcalcData.mode,
            a: 1,
        }, resolve));

        return Promise.all([ppResult, getBeatmapsResult])
            .then(([{pp, pp_fc}, [{approved}]]) => {
                //debugValue([pp, pp_fc, approved]);
                return {
                    pp: Math.round(pp.total),
                    pp_fc: Math.round(pp_fc.total),
                    approved: approved,
                };
            });
    }

    function getRequest(url, callback, reqTracker){
        // reqTracker is a list of requests to keep track whether the request is ongoing, to allow abortion
        if(reqTracker){
            var req = GetPageJSON(url, function(response){
                removeFromArray(reqTracker, req);
                callback(response);
            });
            reqTracker.push(req);
        }else{
            GetPageJSON(url, callback);
        }
    }

    function getScoresWithPlayerInfo(params, showPpRank, callback, reqTracker){
        var mode = params.m || 0;
        getScores(params, function(response){
            var funs = [];
            response.forEach(function(score, index){
                if(showPpRank){
                    funs.push(function(donecb){
                        getUser({u: score.user_id, type: "id", m: mode}, function(userInfo){
                            response[index].user = userInfo[0];
                            savePlayerCountry(score.user_id, userInfo[0].country);
                            donecb();
                        }, reqTracker);
                    });
                }else{
                    funs.push(function(donecb){
                        getPlayerCountry(score.user_id, function(country){
                            response[index].user = {country: country};
                            donecb();
                        });
                    });
                }
            });
            doManyFunc(funs, function(){
                callback(response);
            });
        }, reqTracker);
    }

    function getMpEvents(mp){
        function doBefore(events, first, resolve){
            var id = events.events[0].id;
            var url2 = `https://osu.ppy.sh/community/matches/${mp}?before=${id}&limit=100`;
            $.get(url2, (res) => {
                if(debug) console.log(url2, res);
                events.events = res.events.concat(events.events);
                //combine users
                for(let u of res.users){
                    var isthere = false;
                    for(let v of events.users){
                        if(v.id === u.id){
                            isthere = true;
                            break;
                        }
                    }
                    if(!isthere){
                        events.users.push(u);
                    }
                }
                if(res.events.length && res.events[0].id > first){
                    doBefore(events, first, resolve);
                }else{
                    resolve(events);
                }
            }, "json");
        }

        return new Promise((resolve, reject) => {
            var url = `https://osu.ppy.sh/community/matches/${mp}`;
            $.get(url, (events) => {
                if(debug) console.log(url, events);
                var first = events.first_event_id;
                if(events.events.length && events.events[0].id > first){
                    doBefore(events, first, resolve);
                }else{
                    resolve(events);
                }
            }, "json");
        });
    }

    function getUserRecent(params, callback, reqTracker){
        /*
        k - api key (required).
        u - specify a user_id or a username to return recent plays from (required).
        m - mode (0 = osu!, 1 = Taiko, 2 = CtB, 3 = osu!mania). Optional, default value is 0.
        limit - amount of results (range between 1 and 50 - defaults to 10).
        type - specify if u is a user_id or a username. Use string for usernames or id for user_ids. Optional, default behavior is automatic recognition (may be problematic for usernames made up of digits only).
        */
        var url = "https://osu.ppy.sh/api/get_user_recent";
        params.k = apikey;
        getRequest(getUrl(url, params), callback, reqTracker);
    }
    //eslint-disable-next-line no-unused-vars
    function getReplay(params, callback, reqTracker){
        /*
        k - api key (required).
        m - the mode the score was played in (required).
        b - the beatmap ID (not beatmap set ID!) in which the replay was played (required).
        u - the user that has played the beatmap (required).
        */
        var url = "https://osu.ppy.sh/api/get_replay";
        params.k = apikey;
        getRequest(getUrl(url, params), callback, reqTracker);
    }

    function getBeatmaps(params, callback, reqTracker){
        /*
        k - api key (required).
        since - return all beatmaps ranked since this date. Must be a MySQL date.
        s - specify a beatmapset_id to return metadata from.
        b - specify a beatmap_id to return metadata from.
        u - specify a user_id or a username to return metadata from.
        type - specify if u is a user_id or a username. Use string for usernames or id for user_ids. Optional, default behaviour is automatic recognition (may be problematic for usernames made up of digits only).
        m - mode (0 = osu!, 1 = Taiko, 2 = CtB, 3 = osu!mania). Optional, maps of all modes are returned by default.
        a - specify whether converted beatmaps are included (0 = not included, 1 = included). Only has an effect if m is chosen and not 0. Converted maps show their converted difficulty rating. Optional, default is 0.
        h - the beatmap hash. It can be used, for instance, if you're trying to get what beatmap has a replay played in, as .osr replays only provide beatmap hashes (example of hash: a5b99395a42bd55bc5eb1d2411cbdf8b). Optional, by default all beatmaps are returned independently from the hash.
        limit - amount of results. Optional, default and maximum are 500.
        */
        var url = "https://osu.ppy.sh/api/get_beatmaps";
        params.k = apikey;
        getRequest(getUrl(url, params), callback, reqTracker);
    }

    function getScores(params, callback, reqTracker){
        /*
        k - api key (required).
        b - specify a beatmap_id to return score information from (required).
        u - specify a user_id or a username to return score information for.
        m - mode (0 = osu!, 1 = Taiko, 2 = CtB, 3 = osu!mania). Optional, default value is 0.
        mods - specify a mod or mod combination (See the bitwise enum)
        type - specify if u is a user_id or a username. Use string for usernames or id for user_ids. Optional, default behaviour is automatic recognition (may be problematic for usernames made up of digits only).
        limit - amount of results from the top (range between 1 and 100 - defaults to 50).
        */
        var url = "https://osu.ppy.sh/api/get_scores";
        params.k = apikey;
        getRequest(getUrl(url, params), callback, reqTracker);
    }

    function getUser(params, callback, reqTracker){
        /*
        k - api key (required).
        u - specify a user_id or a username to return metadata from (required).
        m - mode (0 = osu!, 1 = Taiko, 2 = CtB, 3 = osu!mania). Optional, default value is 0.
        type - specify if u is a user_id or a username. Use string for usernames or id for user_ids. Optional, default behaviour is automatic recognition (may be problematic for usernames made up of digits only).
        event_days - Max number of days between now and last event date. Range of 1-31. Optional, default value is 1.
        */
        var url = "https://osu.ppy.sh/api/get_user";
        params.k = apikey;
        getRequest(getUrl(url, params), callback, reqTracker);
    }

    function getUserBest(params, callback, reqTracker){
        /*
        k - api key (required).
        u - specify a user_id or a username to return best scores from (required).
        m - mode (0 = osu!, 1 = Taiko, 2 = CtB, 3 = osu!mania). Optional, default value is 0.
        limit - amount of results (range between 1 and 100 - defaults to 10).
        type - specify if u is a user_id or a username. Use string for usernames or id for user_ids. Optional, default behavior is automatic recognition (may be problematic for usernames made up of digits only).
        */
        var url = "https://osu.ppy.sh/api/get_user_best";
        params.k = apikey;
        getRequest(getUrl(url, params), callback, reqTracker);
    }

    function getBeatmapFile(beatmapId, callback, reqTracker){
        GetPage(`https://osu.ppy.sh/osu/${beatmapId}`, callback, reqTracker);
    }

    function getUrl(url, params){
        if(params){
            var paramarray = [];
            for(var k in params){
                paramarray.push(k + "=" + encodeURIComponent(params[k]));
            }
            return url + "?" + paramarray.join("&");
        }else{
            return url;
        }
    }

    function GetPageJSON(url, callback){
        return GetPage(url, (response) => {
            let responseJSON;
            try{
                responseJSON = JSON.parse(response);
                try{
                    callback(responseJSON);
                }catch(e){
                    // do nothing
                }
            }catch(e){
                if(debug) console.log(`error parsing JSON: ${response}`);
                callback(null);
            }
        });
    }

    var requestLimiter = {
        rate: 100, //time between requests, in ms
        interval: null,
        queue: [],
        loop: function(){
            if(this.queue.length > 0){
                var details = this.queue.shift();
                if(debug) console.log(details.url);
                GMX.xmlHttpRequest(details);
            }
        },
        makeRequest: function(details){
            if(this.interval === null){
                this.interval = setInterval(this.loop.bind(this), this.rate);
            }
            this.queue.push(details);
        }

    };

    function GetPage(url, callback) {
        return abortableXHR({
            method: "GET",
            url: url,
            synchronous: false,
            timeout: 10000,
            onload: function (resp) {
                callback(resp.responseText);
            },
            ontimeout: function () {
                if(debug) console.log("timeout!");
                callback(null);
            }
        });
    }

    function abortableXHR(details){
        var aborted = false;
        var abortableOnload = (resp) => {
            if(!aborted && details.onload){
                details.onload(resp);
            }
        };
        var abortableOntimeout = (resp) => {
            if(!aborted && details.ontimeout){
                details.ontimeout(resp);
            }
        };
        requestLimiter.makeRequest({
            method: details.method,
            url: details.url,
            synchronous: details.synchronous,
            timeout: details.timeout,
            onload: abortableOnload,
            ontimeout: abortableOntimeout
        });
        return {abort: () => { aborted = true; }};
    }

    //-------------------------------
    // javascript helper functions
    //-------------------------------

    function debugValue(x) {
        if (debug)
            console.log(x);
        return x;
    }

    function waitForEl(selector, callback){
        var poller = setInterval(() => {
            var el = $(selector);
            if(el.length){
                clearInterval(poller);
                callback(el);
            }
        }, 100);
        return {abort: () => { clearInterval(poller); }};
    }

    function inArray(arr, ele){
        for(var i=0; i<arr.length; i++){
            if(arr[i] == ele) return true;
        }
        return false;
    }

    function deepCopy(dict){
        return JSON.parse(JSON.stringify(dict));
    }

    function removeFromArray(arr, ele){
        var _index = arr.indexOf(ele);
        if(_index > -1) arr.splice(_index, 1);
    }

    function median(ls){
        if(ls.length === 0) return 0;
        ls = [...ls].sort((a, b) => a - b); //javascript will normally sort lexicographically
        var mid = Math.floor(ls.length / 2);
        return ls.length % 2 === 0 ? (ls[mid] + ls[mid-1]) / 2 : ls[mid];
    }

    // returns [a1.push(e) for a1 in arr1, e in arr2]
    function cartesianProd(arr1, arr2){
        var ans = [];
        for(var i=0; i<arr1.length; i++){
            for(var j=0; j<arr2.length; j++){
                ans.push(arr1[i].concat([arr2[j]]));
            }
        }
        return ans;
    }

    function nullIfBlankOrNull(stringValue) {
        return stringValue === null || stringValue.trim() === "" || stringValue === "null" ? null : stringValue;
    }

    // runs array of functions funs asynchronously and calls finalcallback() when all are done
    // each fun in funs must be function(callback) and must call callback() when done
    function doManyFunc(funs, finalcallback){
        var done = 0, total = funs.length;
        for(var i=0; i<total; i++){
            funs[i](function(){
                done++;
                if(done == total){
                    finalcallback();
                }
            });
        }
        if(total === 0){
            finalcallback();
        }
    }

    function downloadFile(data, filename){
        var link = document.createElement("a");
        link.download = filename;
        link.href = "data:application/octet-stream;base64," + btoa(data);
        link.dispatchEvent(new MouseEvent("click"));
    }
})();
