"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _ramda = require("ramda");
var _emailjsTcpSocket = _interopRequireDefault(require("emailjs-tcp-socket"));
var _common = require("./common");
var _emailjsImapHandler = require("emailjs-imap-handler");
var _compression = _interopRequireDefault(require("./compression"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* babel-plugin-inline-import '../res/compression.worker.blob' */
const CompressionBlob = "!function(e){var t={};function a(n){if(t[n])return t[n].exports;var i=t[n]={i:n,l:!1,exports:{}};return e[n].call(i.exports,i,i.exports,a),i.l=!0,i.exports}a.m=e,a.c=t,a.d=function(e,t,n){a.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},a.r=function(e){\"undefined\"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:\"Module\"}),Object.defineProperty(e,\"__esModule\",{value:!0})},a.t=function(e,t){if(1&t&&(e=a(e)),8&t)return e;if(4&t&&\"object\"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(a.r(n),Object.defineProperty(n,\"default\",{enumerable:!0,value:e}),2&t&&\"string\"!=typeof e)for(var i in e)a.d(n,i,function(t){return e[t]}.bind(null,i));return n},a.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return a.d(t,\"a\",t),t},a.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},a.p=\"\",a(a.s=11)}([function(e,t,a){\"use strict\";e.exports={Z_NO_FLUSH:0,Z_PARTIAL_FLUSH:1,Z_SYNC_FLUSH:2,Z_FULL_FLUSH:3,Z_FINISH:4,Z_BLOCK:5,Z_TREES:6,Z_OK:0,Z_STREAM_END:1,Z_NEED_DICT:2,Z_ERRNO:-1,Z_STREAM_ERROR:-2,Z_DATA_ERROR:-3,Z_BUF_ERROR:-5,Z_NO_COMPRESSION:0,Z_BEST_SPEED:1,Z_BEST_COMPRESSION:9,Z_DEFAULT_COMPRESSION:-1,Z_FILTERED:1,Z_HUFFMAN_ONLY:2,Z_RLE:3,Z_FIXED:4,Z_DEFAULT_STRATEGY:0,Z_BINARY:0,Z_TEXT:1,Z_UNKNOWN:2,Z_DEFLATED:8}},function(e,t,a){\"use strict\";e.exports={2:\"need dictionary\",1:\"stream end\",0:\"\",\"-1\":\"file error\",\"-2\":\"stream error\",\"-3\":\"data error\",\"-4\":\"insufficient memory\",\"-5\":\"buffer error\",\"-6\":\"incompatible version\"}},function(e,t,a){\"use strict\";var n=\"undefined\"!=typeof Uint8Array&&\"undefined\"!=typeof Uint16Array&&\"undefined\"!=typeof Int32Array;function i(e,t){return Object.prototype.hasOwnProperty.call(e,t)}t.assign=function(e){for(var t=Array.prototype.slice.call(arguments,1);t.length;){var a=t.shift();if(a){if(\"object\"!=typeof a)throw new TypeError(a+\"must be non-object\");for(var n in a)i(a,n)&&(e[n]=a[n])}}return e},t.shrinkBuf=function(e,t){return e.length===t?e:e.subarray?e.subarray(0,t):(e.length=t,e)};var r={arraySet:function(e,t,a,n,i){if(t.subarray&&e.subarray)e.set(t.subarray(a,a+n),i);else for(var r=0;r<n;r++)e[i+r]=t[a+r]},flattenChunks:function(e){var t,a,n,i,r,s;for(n=0,t=0,a=e.length;t<a;t++)n+=e[t].length;for(s=new Uint8Array(n),i=0,t=0,a=e.length;t<a;t++)r=e[t],s.set(r,i),i+=r.length;return s}},s={arraySet:function(e,t,a,n,i){for(var r=0;r<n;r++)e[i+r]=t[a+r]},flattenChunks:function(e){return[].concat.apply([],e)}};t.setTyped=function(e){e?(t.Buf8=Uint8Array,t.Buf16=Uint16Array,t.Buf32=Int32Array,t.assign(t,r)):(t.Buf8=Array,t.Buf16=Array,t.Buf32=Array,t.assign(t,s))},t.setTyped(n)},function(e,t,a){\"use strict\";e.exports=function(){this.input=null,this.next_in=0,this.avail_in=0,this.total_in=0,this.output=null,this.next_out=0,this.avail_out=0,this.total_out=0,this.msg=\"\",this.state=null,this.data_type=2,this.adler=0}},function(e,t,a){\"use strict\";var n,i=a(2),r=a(8),s=a(6),l=a(7),o=a(1);function h(e,t){return e.msg=o[t],t}function d(e){return(e<<1)-(e>4?9:0)}function _(e){for(var t=e.length;--t>=0;)e[t]=0}function f(e){var t=e.state,a=t.pending;a>e.avail_out&&(a=e.avail_out),0!==a&&(i.arraySet(e.output,t.pending_buf,t.pending_out,a,e.next_out),e.next_out+=a,t.pending_out+=a,e.total_out+=a,e.avail_out-=a,t.pending-=a,0===t.pending&&(t.pending_out=0))}function u(e,t){r._tr_flush_block(e,e.block_start>=0?e.block_start:-1,e.strstart-e.block_start,t),e.block_start=e.strstart,f(e.strm)}function c(e,t){e.pending_buf[e.pending++]=t}function b(e,t){e.pending_buf[e.pending++]=t>>>8&255,e.pending_buf[e.pending++]=255&t}function g(e,t){var a,n,i=e.max_chain_length,r=e.strstart,s=e.prev_length,l=e.nice_match,o=e.strstart>e.w_size-262?e.strstart-(e.w_size-262):0,h=e.window,d=e.w_mask,_=e.prev,f=e.strstart+258,u=h[r+s-1],c=h[r+s];e.prev_length>=e.good_match&&(i>>=2),l>e.lookahead&&(l=e.lookahead);do{if(h[(a=t)+s]===c&&h[a+s-1]===u&&h[a]===h[r]&&h[++a]===h[r+1]){r+=2,a++;do{}while(h[++r]===h[++a]&&h[++r]===h[++a]&&h[++r]===h[++a]&&h[++r]===h[++a]&&h[++r]===h[++a]&&h[++r]===h[++a]&&h[++r]===h[++a]&&h[++r]===h[++a]&&r<f);if(n=258-(f-r),r=f-258,n>s){if(e.match_start=t,s=n,n>=l)break;u=h[r+s-1],c=h[r+s]}}}while((t=_[t&d])>o&&0!=--i);return s<=e.lookahead?s:e.lookahead}function m(e){var t,a,n,r,o,h,d,_,f,u,c=e.w_size;do{if(r=e.window_size-e.lookahead-e.strstart,e.strstart>=c+(c-262)){i.arraySet(e.window,e.window,c,c,0),e.match_start-=c,e.strstart-=c,e.block_start-=c,t=a=e.hash_size;do{n=e.head[--t],e.head[t]=n>=c?n-c:0}while(--a);t=a=c;do{n=e.prev[--t],e.prev[t]=n>=c?n-c:0}while(--a);r+=c}if(0===e.strm.avail_in)break;if(h=e.strm,d=e.window,_=e.strstart+e.lookahead,f=r,u=void 0,(u=h.avail_in)>f&&(u=f),a=0===u?0:(h.avail_in-=u,i.arraySet(d,h.input,h.next_in,u,_),1===h.state.wrap?h.adler=s(h.adler,d,u,_):2===h.state.wrap&&(h.adler=l(h.adler,d,u,_)),h.next_in+=u,h.total_in+=u,u),e.lookahead+=a,e.lookahead+e.insert>=3)for(o=e.strstart-e.insert,e.ins_h=e.window[o],e.ins_h=(e.ins_h<<e.hash_shift^e.window[o+1])&e.hash_mask;e.insert&&(e.ins_h=(e.ins_h<<e.hash_shift^e.window[o+3-1])&e.hash_mask,e.prev[o&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=o,o++,e.insert--,!(e.lookahead+e.insert<3)););}while(e.lookahead<262&&0!==e.strm.avail_in)}function w(e,t){for(var a,n;;){if(e.lookahead<262){if(m(e),e.lookahead<262&&0===t)return 1;if(0===e.lookahead)break}if(a=0,e.lookahead>=3&&(e.ins_h=(e.ins_h<<e.hash_shift^e.window[e.strstart+3-1])&e.hash_mask,a=e.prev[e.strstart&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=e.strstart),0!==a&&e.strstart-a<=e.w_size-262&&(e.match_length=g(e,a)),e.match_length>=3)if(n=r._tr_tally(e,e.strstart-e.match_start,e.match_length-3),e.lookahead-=e.match_length,e.match_length<=e.max_lazy_match&&e.lookahead>=3){e.match_length--;do{e.strstart++,e.ins_h=(e.ins_h<<e.hash_shift^e.window[e.strstart+3-1])&e.hash_mask,a=e.prev[e.strstart&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=e.strstart}while(0!=--e.match_length);e.strstart++}else e.strstart+=e.match_length,e.match_length=0,e.ins_h=e.window[e.strstart],e.ins_h=(e.ins_h<<e.hash_shift^e.window[e.strstart+1])&e.hash_mask;else n=r._tr_tally(e,0,e.window[e.strstart]),e.lookahead--,e.strstart++;if(n&&(u(e,!1),0===e.strm.avail_out))return 1}return e.insert=e.strstart<2?e.strstart:2,4===t?(u(e,!0),0===e.strm.avail_out?3:4):e.last_lit&&(u(e,!1),0===e.strm.avail_out)?1:2}function p(e,t){for(var a,n,i;;){if(e.lookahead<262){if(m(e),e.lookahead<262&&0===t)return 1;if(0===e.lookahead)break}if(a=0,e.lookahead>=3&&(e.ins_h=(e.ins_h<<e.hash_shift^e.window[e.strstart+3-1])&e.hash_mask,a=e.prev[e.strstart&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=e.strstart),e.prev_length=e.match_length,e.prev_match=e.match_start,e.match_length=2,0!==a&&e.prev_length<e.max_lazy_match&&e.strstart-a<=e.w_size-262&&(e.match_length=g(e,a),e.match_length<=5&&(1===e.strategy||3===e.match_length&&e.strstart-e.match_start>4096)&&(e.match_length=2)),e.prev_length>=3&&e.match_length<=e.prev_length){i=e.strstart+e.lookahead-3,n=r._tr_tally(e,e.strstart-1-e.prev_match,e.prev_length-3),e.lookahead-=e.prev_length-1,e.prev_length-=2;do{++e.strstart<=i&&(e.ins_h=(e.ins_h<<e.hash_shift^e.window[e.strstart+3-1])&e.hash_mask,a=e.prev[e.strstart&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=e.strstart)}while(0!=--e.prev_length);if(e.match_available=0,e.match_length=2,e.strstart++,n&&(u(e,!1),0===e.strm.avail_out))return 1}else if(e.match_available){if((n=r._tr_tally(e,0,e.window[e.strstart-1]))&&u(e,!1),e.strstart++,e.lookahead--,0===e.strm.avail_out)return 1}else e.match_available=1,e.strstart++,e.lookahead--}return e.match_available&&(n=r._tr_tally(e,0,e.window[e.strstart-1]),e.match_available=0),e.insert=e.strstart<2?e.strstart:2,4===t?(u(e,!0),0===e.strm.avail_out?3:4):e.last_lit&&(u(e,!1),0===e.strm.avail_out)?1:2}function v(e,t,a,n,i){this.good_length=e,this.max_lazy=t,this.nice_length=a,this.max_chain=n,this.func=i}function k(){this.strm=null,this.status=0,this.pending_buf=null,this.pending_buf_size=0,this.pending_out=0,this.pending=0,this.wrap=0,this.gzhead=null,this.gzindex=0,this.method=8,this.last_flush=-1,this.w_size=0,this.w_bits=0,this.w_mask=0,this.window=null,this.window_size=0,this.prev=null,this.head=null,this.ins_h=0,this.hash_size=0,this.hash_bits=0,this.hash_mask=0,this.hash_shift=0,this.block_start=0,this.match_length=0,this.prev_match=0,this.match_available=0,this.strstart=0,this.match_start=0,this.lookahead=0,this.prev_length=0,this.max_chain_length=0,this.max_lazy_match=0,this.level=0,this.strategy=0,this.good_match=0,this.nice_match=0,this.dyn_ltree=new i.Buf16(1146),this.dyn_dtree=new i.Buf16(122),this.bl_tree=new i.Buf16(78),_(this.dyn_ltree),_(this.dyn_dtree),_(this.bl_tree),this.l_desc=null,this.d_desc=null,this.bl_desc=null,this.bl_count=new i.Buf16(16),this.heap=new i.Buf16(573),_(this.heap),this.heap_len=0,this.heap_max=0,this.depth=new i.Buf16(573),_(this.depth),this.l_buf=0,this.lit_bufsize=0,this.last_lit=0,this.d_buf=0,this.opt_len=0,this.static_len=0,this.matches=0,this.insert=0,this.bi_buf=0,this.bi_valid=0}function y(e){var t;return e&&e.state?(e.total_in=e.total_out=0,e.data_type=2,(t=e.state).pending=0,t.pending_out=0,t.wrap<0&&(t.wrap=-t.wrap),t.status=t.wrap?42:113,e.adler=2===t.wrap?0:1,t.last_flush=0,r._tr_init(t),0):h(e,-2)}function x(e){var t,a=y(e);return 0===a&&((t=e.state).window_size=2*t.w_size,_(t.head),t.max_lazy_match=n[t.level].max_lazy,t.good_match=n[t.level].good_length,t.nice_match=n[t.level].nice_length,t.max_chain_length=n[t.level].max_chain,t.strstart=0,t.block_start=0,t.lookahead=0,t.insert=0,t.match_length=t.prev_length=2,t.match_available=0,t.ins_h=0),a}function z(e,t,a,n,r,s){if(!e)return-2;var l=1;if(-1===t&&(t=6),n<0?(l=0,n=-n):n>15&&(l=2,n-=16),r<1||r>9||8!==a||n<8||n>15||t<0||t>9||s<0||s>4)return h(e,-2);8===n&&(n=9);var o=new k;return e.state=o,o.strm=e,o.wrap=l,o.gzhead=null,o.w_bits=n,o.w_size=1<<o.w_bits,o.w_mask=o.w_size-1,o.hash_bits=r+7,o.hash_size=1<<o.hash_bits,o.hash_mask=o.hash_size-1,o.hash_shift=~~((o.hash_bits+3-1)/3),o.window=new i.Buf8(2*o.w_size),o.head=new i.Buf16(o.hash_size),o.prev=new i.Buf16(o.w_size),o.lit_bufsize=1<<r+6,o.pending_buf_size=4*o.lit_bufsize,o.pending_buf=new i.Buf8(o.pending_buf_size),o.d_buf=1*o.lit_bufsize,o.l_buf=3*o.lit_bufsize,o.level=t,o.strategy=s,o.method=a,x(e)}n=[new v(0,0,0,0,(function(e,t){var a=65535;for(a>e.pending_buf_size-5&&(a=e.pending_buf_size-5);;){if(e.lookahead<=1){if(m(e),0===e.lookahead&&0===t)return 1;if(0===e.lookahead)break}e.strstart+=e.lookahead,e.lookahead=0;var n=e.block_start+a;if((0===e.strstart||e.strstart>=n)&&(e.lookahead=e.strstart-n,e.strstart=n,u(e,!1),0===e.strm.avail_out))return 1;if(e.strstart-e.block_start>=e.w_size-262&&(u(e,!1),0===e.strm.avail_out))return 1}return e.insert=0,4===t?(u(e,!0),0===e.strm.avail_out?3:4):(e.strstart>e.block_start&&(u(e,!1),e.strm.avail_out),1)})),new v(4,4,8,4,w),new v(4,5,16,8,w),new v(4,6,32,32,w),new v(4,4,16,16,p),new v(8,16,32,32,p),new v(8,16,128,128,p),new v(8,32,128,256,p),new v(32,128,258,1024,p),new v(32,258,258,4096,p)],t.deflateInit=function(e,t){return z(e,t,8,15,8,0)},t.deflateInit2=z,t.deflateReset=x,t.deflateResetKeep=y,t.deflateSetHeader=function(e,t){return e&&e.state?2!==e.state.wrap?-2:(e.state.gzhead=t,0):-2},t.deflate=function(e,t){var a,i,s,o;if(!e||!e.state||t>5||t<0)return e?h(e,-2):-2;if(i=e.state,!e.output||!e.input&&0!==e.avail_in||666===i.status&&4!==t)return h(e,0===e.avail_out?-5:-2);if(i.strm=e,a=i.last_flush,i.last_flush=t,42===i.status)if(2===i.wrap)e.adler=0,c(i,31),c(i,139),c(i,8),i.gzhead?(c(i,(i.gzhead.text?1:0)+(i.gzhead.hcrc?2:0)+(i.gzhead.extra?4:0)+(i.gzhead.name?8:0)+(i.gzhead.comment?16:0)),c(i,255&i.gzhead.time),c(i,i.gzhead.time>>8&255),c(i,i.gzhead.time>>16&255),c(i,i.gzhead.time>>24&255),c(i,9===i.level?2:i.strategy>=2||i.level<2?4:0),c(i,255&i.gzhead.os),i.gzhead.extra&&i.gzhead.extra.length&&(c(i,255&i.gzhead.extra.length),c(i,i.gzhead.extra.length>>8&255)),i.gzhead.hcrc&&(e.adler=l(e.adler,i.pending_buf,i.pending,0)),i.gzindex=0,i.status=69):(c(i,0),c(i,0),c(i,0),c(i,0),c(i,0),c(i,9===i.level?2:i.strategy>=2||i.level<2?4:0),c(i,3),i.status=113);else{var g=8+(i.w_bits-8<<4)<<8;g|=(i.strategy>=2||i.level<2?0:i.level<6?1:6===i.level?2:3)<<6,0!==i.strstart&&(g|=32),g+=31-g%31,i.status=113,b(i,g),0!==i.strstart&&(b(i,e.adler>>>16),b(i,65535&e.adler)),e.adler=1}if(69===i.status)if(i.gzhead.extra){for(s=i.pending;i.gzindex<(65535&i.gzhead.extra.length)&&(i.pending!==i.pending_buf_size||(i.gzhead.hcrc&&i.pending>s&&(e.adler=l(e.adler,i.pending_buf,i.pending-s,s)),f(e),s=i.pending,i.pending!==i.pending_buf_size));)c(i,255&i.gzhead.extra[i.gzindex]),i.gzindex++;i.gzhead.hcrc&&i.pending>s&&(e.adler=l(e.adler,i.pending_buf,i.pending-s,s)),i.gzindex===i.gzhead.extra.length&&(i.gzindex=0,i.status=73)}else i.status=73;if(73===i.status)if(i.gzhead.name){s=i.pending;do{if(i.pending===i.pending_buf_size&&(i.gzhead.hcrc&&i.pending>s&&(e.adler=l(e.adler,i.pending_buf,i.pending-s,s)),f(e),s=i.pending,i.pending===i.pending_buf_size)){o=1;break}o=i.gzindex<i.gzhead.name.length?255&i.gzhead.name.charCodeAt(i.gzindex++):0,c(i,o)}while(0!==o);i.gzhead.hcrc&&i.pending>s&&(e.adler=l(e.adler,i.pending_buf,i.pending-s,s)),0===o&&(i.gzindex=0,i.status=91)}else i.status=91;if(91===i.status)if(i.gzhead.comment){s=i.pending;do{if(i.pending===i.pending_buf_size&&(i.gzhead.hcrc&&i.pending>s&&(e.adler=l(e.adler,i.pending_buf,i.pending-s,s)),f(e),s=i.pending,i.pending===i.pending_buf_size)){o=1;break}o=i.gzindex<i.gzhead.comment.length?255&i.gzhead.comment.charCodeAt(i.gzindex++):0,c(i,o)}while(0!==o);i.gzhead.hcrc&&i.pending>s&&(e.adler=l(e.adler,i.pending_buf,i.pending-s,s)),0===o&&(i.status=103)}else i.status=103;if(103===i.status&&(i.gzhead.hcrc?(i.pending+2>i.pending_buf_size&&f(e),i.pending+2<=i.pending_buf_size&&(c(i,255&e.adler),c(i,e.adler>>8&255),e.adler=0,i.status=113)):i.status=113),0!==i.pending){if(f(e),0===e.avail_out)return i.last_flush=-1,0}else if(0===e.avail_in&&d(t)<=d(a)&&4!==t)return h(e,-5);if(666===i.status&&0!==e.avail_in)return h(e,-5);if(0!==e.avail_in||0!==i.lookahead||0!==t&&666!==i.status){var w=2===i.strategy?function(e,t){for(var a;;){if(0===e.lookahead&&(m(e),0===e.lookahead)){if(0===t)return 1;break}if(e.match_length=0,a=r._tr_tally(e,0,e.window[e.strstart]),e.lookahead--,e.strstart++,a&&(u(e,!1),0===e.strm.avail_out))return 1}return e.insert=0,4===t?(u(e,!0),0===e.strm.avail_out?3:4):e.last_lit&&(u(e,!1),0===e.strm.avail_out)?1:2}(i,t):3===i.strategy?function(e,t){for(var a,n,i,s,l=e.window;;){if(e.lookahead<=258){if(m(e),e.lookahead<=258&&0===t)return 1;if(0===e.lookahead)break}if(e.match_length=0,e.lookahead>=3&&e.strstart>0&&(n=l[i=e.strstart-1])===l[++i]&&n===l[++i]&&n===l[++i]){s=e.strstart+258;do{}while(n===l[++i]&&n===l[++i]&&n===l[++i]&&n===l[++i]&&n===l[++i]&&n===l[++i]&&n===l[++i]&&n===l[++i]&&i<s);e.match_length=258-(s-i),e.match_length>e.lookahead&&(e.match_length=e.lookahead)}if(e.match_length>=3?(a=r._tr_tally(e,1,e.match_length-3),e.lookahead-=e.match_length,e.strstart+=e.match_length,e.match_length=0):(a=r._tr_tally(e,0,e.window[e.strstart]),e.lookahead--,e.strstart++),a&&(u(e,!1),0===e.strm.avail_out))return 1}return e.insert=0,4===t?(u(e,!0),0===e.strm.avail_out?3:4):e.last_lit&&(u(e,!1),0===e.strm.avail_out)?1:2}(i,t):n[i.level].func(i,t);if(3!==w&&4!==w||(i.status=666),1===w||3===w)return 0===e.avail_out&&(i.last_flush=-1),0;if(2===w&&(1===t?r._tr_align(i):5!==t&&(r._tr_stored_block(i,0,0,!1),3===t&&(_(i.head),0===i.lookahead&&(i.strstart=0,i.block_start=0,i.insert=0))),f(e),0===e.avail_out))return i.last_flush=-1,0}return 4!==t?0:i.wrap<=0?1:(2===i.wrap?(c(i,255&e.adler),c(i,e.adler>>8&255),c(i,e.adler>>16&255),c(i,e.adler>>24&255),c(i,255&e.total_in),c(i,e.total_in>>8&255),c(i,e.total_in>>16&255),c(i,e.total_in>>24&255)):(b(i,e.adler>>>16),b(i,65535&e.adler)),f(e),i.wrap>0&&(i.wrap=-i.wrap),0!==i.pending?0:1)},t.deflateEnd=function(e){var t;return e&&e.state?42!==(t=e.state.status)&&69!==t&&73!==t&&91!==t&&103!==t&&113!==t&&666!==t?h(e,-2):(e.state=null,113===t?h(e,-3):0):-2},t.deflateSetDictionary=function(e,t){var a,n,r,l,o,h,d,f,u=t.length;if(!e||!e.state)return-2;if(2===(l=(a=e.state).wrap)||1===l&&42!==a.status||a.lookahead)return-2;for(1===l&&(e.adler=s(e.adler,t,u,0)),a.wrap=0,u>=a.w_size&&(0===l&&(_(a.head),a.strstart=0,a.block_start=0,a.insert=0),f=new i.Buf8(a.w_size),i.arraySet(f,t,u-a.w_size,a.w_size,0),t=f,u=a.w_size),o=e.avail_in,h=e.next_in,d=e.input,e.avail_in=u,e.next_in=0,e.input=t,m(a);a.lookahead>=3;){n=a.strstart,r=a.lookahead-2;do{a.ins_h=(a.ins_h<<a.hash_shift^a.window[n+3-1])&a.hash_mask,a.prev[n&a.w_mask]=a.head[a.ins_h],a.head[a.ins_h]=n,n++}while(--r);a.strstart=n,a.lookahead=2,m(a)}return a.strstart+=a.lookahead,a.block_start=a.strstart,a.insert=a.lookahead,a.lookahead=0,a.match_length=a.prev_length=2,a.match_available=0,e.next_in=h,e.input=d,e.avail_in=o,a.wrap=l,0},t.deflateInfo=\"pako deflate (from Nodeca project)\"},function(e,t,a){\"use strict\";var n=a(2),i=a(6),r=a(7),s=a(9),l=a(10);function o(e){return(e>>>24&255)+(e>>>8&65280)+((65280&e)<<8)+((255&e)<<24)}function h(){this.mode=0,this.last=!1,this.wrap=0,this.havedict=!1,this.flags=0,this.dmax=0,this.check=0,this.total=0,this.head=null,this.wbits=0,this.wsize=0,this.whave=0,this.wnext=0,this.window=null,this.hold=0,this.bits=0,this.length=0,this.offset=0,this.extra=0,this.lencode=null,this.distcode=null,this.lenbits=0,this.distbits=0,this.ncode=0,this.nlen=0,this.ndist=0,this.have=0,this.next=null,this.lens=new n.Buf16(320),this.work=new n.Buf16(288),this.lendyn=null,this.distdyn=null,this.sane=0,this.back=0,this.was=0}function d(e){var t;return e&&e.state?(t=e.state,e.total_in=e.total_out=t.total=0,e.msg=\"\",t.wrap&&(e.adler=1&t.wrap),t.mode=1,t.last=0,t.havedict=0,t.dmax=32768,t.head=null,t.hold=0,t.bits=0,t.lencode=t.lendyn=new n.Buf32(852),t.distcode=t.distdyn=new n.Buf32(592),t.sane=1,t.back=-1,0):-2}function _(e){var t;return e&&e.state?((t=e.state).wsize=0,t.whave=0,t.wnext=0,d(e)):-2}function f(e,t){var a,n;return e&&e.state?(n=e.state,t<0?(a=0,t=-t):(a=1+(t>>4),t<48&&(t&=15)),t&&(t<8||t>15)?-2:(null!==n.window&&n.wbits!==t&&(n.window=null),n.wrap=a,n.wbits=t,_(e))):-2}function u(e,t){var a,n;return e?(n=new h,e.state=n,n.window=null,0!==(a=f(e,t))&&(e.state=null),a):-2}var c,b,g=!0;function m(e){if(g){var t;for(c=new n.Buf32(512),b=new n.Buf32(32),t=0;t<144;)e.lens[t++]=8;for(;t<256;)e.lens[t++]=9;for(;t<280;)e.lens[t++]=7;for(;t<288;)e.lens[t++]=8;for(l(1,e.lens,0,288,c,0,e.work,{bits:9}),t=0;t<32;)e.lens[t++]=5;l(2,e.lens,0,32,b,0,e.work,{bits:5}),g=!1}e.lencode=c,e.lenbits=9,e.distcode=b,e.distbits=5}function w(e,t,a,i){var r,s=e.state;return null===s.window&&(s.wsize=1<<s.wbits,s.wnext=0,s.whave=0,s.window=new n.Buf8(s.wsize)),i>=s.wsize?(n.arraySet(s.window,t,a-s.wsize,s.wsize,0),s.wnext=0,s.whave=s.wsize):((r=s.wsize-s.wnext)>i&&(r=i),n.arraySet(s.window,t,a-i,r,s.wnext),(i-=r)?(n.arraySet(s.window,t,a-i,i,0),s.wnext=i,s.whave=s.wsize):(s.wnext+=r,s.wnext===s.wsize&&(s.wnext=0),s.whave<s.wsize&&(s.whave+=r))),0}t.inflateReset=_,t.inflateReset2=f,t.inflateResetKeep=d,t.inflateInit=function(e){return u(e,15)},t.inflateInit2=u,t.inflate=function(e,t){var a,h,d,_,f,u,c,b,g,p,v,k,y,x,z,S,E,A,Z,O,R,B,T,N,D=0,U=new n.Buf8(4),I=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];if(!e||!e.state||!e.output||!e.input&&0!==e.avail_in)return-2;12===(a=e.state).mode&&(a.mode=13),f=e.next_out,d=e.output,c=e.avail_out,_=e.next_in,h=e.input,u=e.avail_in,b=a.hold,g=a.bits,p=u,v=c,B=0;e:for(;;)switch(a.mode){case 1:if(0===a.wrap){a.mode=13;break}for(;g<16;){if(0===u)break e;u--,b+=h[_++]<<g,g+=8}if(2&a.wrap&&35615===b){a.check=0,U[0]=255&b,U[1]=b>>>8&255,a.check=r(a.check,U,2,0),b=0,g=0,a.mode=2;break}if(a.flags=0,a.head&&(a.head.done=!1),!(1&a.wrap)||(((255&b)<<8)+(b>>8))%31){e.msg=\"incorrect header check\",a.mode=30;break}if(8!=(15&b)){e.msg=\"unknown compression method\",a.mode=30;break}if(g-=4,R=8+(15&(b>>>=4)),0===a.wbits)a.wbits=R;else if(R>a.wbits){e.msg=\"invalid window size\",a.mode=30;break}a.dmax=1<<R,e.adler=a.check=1,a.mode=512&b?10:12,b=0,g=0;break;case 2:for(;g<16;){if(0===u)break e;u--,b+=h[_++]<<g,g+=8}if(a.flags=b,8!=(255&a.flags)){e.msg=\"unknown compression method\",a.mode=30;break}if(57344&a.flags){e.msg=\"unknown header flags set\",a.mode=30;break}a.head&&(a.head.text=b>>8&1),512&a.flags&&(U[0]=255&b,U[1]=b>>>8&255,a.check=r(a.check,U,2,0)),b=0,g=0,a.mode=3;case 3:for(;g<32;){if(0===u)break e;u--,b+=h[_++]<<g,g+=8}a.head&&(a.head.time=b),512&a.flags&&(U[0]=255&b,U[1]=b>>>8&255,U[2]=b>>>16&255,U[3]=b>>>24&255,a.check=r(a.check,U,4,0)),b=0,g=0,a.mode=4;case 4:for(;g<16;){if(0===u)break e;u--,b+=h[_++]<<g,g+=8}a.head&&(a.head.xflags=255&b,a.head.os=b>>8),512&a.flags&&(U[0]=255&b,U[1]=b>>>8&255,a.check=r(a.check,U,2,0)),b=0,g=0,a.mode=5;case 5:if(1024&a.flags){for(;g<16;){if(0===u)break e;u--,b+=h[_++]<<g,g+=8}a.length=b,a.head&&(a.head.extra_len=b),512&a.flags&&(U[0]=255&b,U[1]=b>>>8&255,a.check=r(a.check,U,2,0)),b=0,g=0}else a.head&&(a.head.extra=null);a.mode=6;case 6:if(1024&a.flags&&((k=a.length)>u&&(k=u),k&&(a.head&&(R=a.head.extra_len-a.length,a.head.extra||(a.head.extra=new Array(a.head.extra_len)),n.arraySet(a.head.extra,h,_,k,R)),512&a.flags&&(a.check=r(a.check,h,k,_)),u-=k,_+=k,a.length-=k),a.length))break e;a.length=0,a.mode=7;case 7:if(2048&a.flags){if(0===u)break e;k=0;do{R=h[_+k++],a.head&&R&&a.length<65536&&(a.head.name+=String.fromCharCode(R))}while(R&&k<u);if(512&a.flags&&(a.check=r(a.check,h,k,_)),u-=k,_+=k,R)break e}else a.head&&(a.head.name=null);a.length=0,a.mode=8;case 8:if(4096&a.flags){if(0===u)break e;k=0;do{R=h[_+k++],a.head&&R&&a.length<65536&&(a.head.comment+=String.fromCharCode(R))}while(R&&k<u);if(512&a.flags&&(a.check=r(a.check,h,k,_)),u-=k,_+=k,R)break e}else a.head&&(a.head.comment=null);a.mode=9;case 9:if(512&a.flags){for(;g<16;){if(0===u)break e;u--,b+=h[_++]<<g,g+=8}if(b!==(65535&a.check)){e.msg=\"header crc mismatch\",a.mode=30;break}b=0,g=0}a.head&&(a.head.hcrc=a.flags>>9&1,a.head.done=!0),e.adler=a.check=0,a.mode=12;break;case 10:for(;g<32;){if(0===u)break e;u--,b+=h[_++]<<g,g+=8}e.adler=a.check=o(b),b=0,g=0,a.mode=11;case 11:if(0===a.havedict)return e.next_out=f,e.avail_out=c,e.next_in=_,e.avail_in=u,a.hold=b,a.bits=g,2;e.adler=a.check=1,a.mode=12;case 12:if(5===t||6===t)break e;case 13:if(a.last){b>>>=7&g,g-=7&g,a.mode=27;break}for(;g<3;){if(0===u)break e;u--,b+=h[_++]<<g,g+=8}switch(a.last=1&b,g-=1,3&(b>>>=1)){case 0:a.mode=14;break;case 1:if(m(a),a.mode=20,6===t){b>>>=2,g-=2;break e}break;case 2:a.mode=17;break;case 3:e.msg=\"invalid block type\",a.mode=30}b>>>=2,g-=2;break;case 14:for(b>>>=7&g,g-=7&g;g<32;){if(0===u)break e;u--,b+=h[_++]<<g,g+=8}if((65535&b)!=(b>>>16^65535)){e.msg=\"invalid stored block lengths\",a.mode=30;break}if(a.length=65535&b,b=0,g=0,a.mode=15,6===t)break e;case 15:a.mode=16;case 16:if(k=a.length){if(k>u&&(k=u),k>c&&(k=c),0===k)break e;n.arraySet(d,h,_,k,f),u-=k,_+=k,c-=k,f+=k,a.length-=k;break}a.mode=12;break;case 17:for(;g<14;){if(0===u)break e;u--,b+=h[_++]<<g,g+=8}if(a.nlen=257+(31&b),b>>>=5,g-=5,a.ndist=1+(31&b),b>>>=5,g-=5,a.ncode=4+(15&b),b>>>=4,g-=4,a.nlen>286||a.ndist>30){e.msg=\"too many length or distance symbols\",a.mode=30;break}a.have=0,a.mode=18;case 18:for(;a.have<a.ncode;){for(;g<3;){if(0===u)break e;u--,b+=h[_++]<<g,g+=8}a.lens[I[a.have++]]=7&b,b>>>=3,g-=3}for(;a.have<19;)a.lens[I[a.have++]]=0;if(a.lencode=a.lendyn,a.lenbits=7,T={bits:a.lenbits},B=l(0,a.lens,0,19,a.lencode,0,a.work,T),a.lenbits=T.bits,B){e.msg=\"invalid code lengths set\",a.mode=30;break}a.have=0,a.mode=19;case 19:for(;a.have<a.nlen+a.ndist;){for(;S=(D=a.lencode[b&(1<<a.lenbits)-1])>>>16&255,E=65535&D,!((z=D>>>24)<=g);){if(0===u)break e;u--,b+=h[_++]<<g,g+=8}if(E<16)b>>>=z,g-=z,a.lens[a.have++]=E;else{if(16===E){for(N=z+2;g<N;){if(0===u)break e;u--,b+=h[_++]<<g,g+=8}if(b>>>=z,g-=z,0===a.have){e.msg=\"invalid bit length repeat\",a.mode=30;break}R=a.lens[a.have-1],k=3+(3&b),b>>>=2,g-=2}else if(17===E){for(N=z+3;g<N;){if(0===u)break e;u--,b+=h[_++]<<g,g+=8}g-=z,R=0,k=3+(7&(b>>>=z)),b>>>=3,g-=3}else{for(N=z+7;g<N;){if(0===u)break e;u--,b+=h[_++]<<g,g+=8}g-=z,R=0,k=11+(127&(b>>>=z)),b>>>=7,g-=7}if(a.have+k>a.nlen+a.ndist){e.msg=\"invalid bit length repeat\",a.mode=30;break}for(;k--;)a.lens[a.have++]=R}}if(30===a.mode)break;if(0===a.lens[256]){e.msg=\"invalid code -- missing end-of-block\",a.mode=30;break}if(a.lenbits=9,T={bits:a.lenbits},B=l(1,a.lens,0,a.nlen,a.lencode,0,a.work,T),a.lenbits=T.bits,B){e.msg=\"invalid literal/lengths set\",a.mode=30;break}if(a.distbits=6,a.distcode=a.distdyn,T={bits:a.distbits},B=l(2,a.lens,a.nlen,a.ndist,a.distcode,0,a.work,T),a.distbits=T.bits,B){e.msg=\"invalid distances set\",a.mode=30;break}if(a.mode=20,6===t)break e;case 20:a.mode=21;case 21:if(u>=6&&c>=258){e.next_out=f,e.avail_out=c,e.next_in=_,e.avail_in=u,a.hold=b,a.bits=g,s(e,v),f=e.next_out,d=e.output,c=e.avail_out,_=e.next_in,h=e.input,u=e.avail_in,b=a.hold,g=a.bits,12===a.mode&&(a.back=-1);break}for(a.back=0;S=(D=a.lencode[b&(1<<a.lenbits)-1])>>>16&255,E=65535&D,!((z=D>>>24)<=g);){if(0===u)break e;u--,b+=h[_++]<<g,g+=8}if(S&&0==(240&S)){for(A=z,Z=S,O=E;S=(D=a.lencode[O+((b&(1<<A+Z)-1)>>A)])>>>16&255,E=65535&D,!(A+(z=D>>>24)<=g);){if(0===u)break e;u--,b+=h[_++]<<g,g+=8}b>>>=A,g-=A,a.back+=A}if(b>>>=z,g-=z,a.back+=z,a.length=E,0===S){a.mode=26;break}if(32&S){a.back=-1,a.mode=12;break}if(64&S){e.msg=\"invalid literal/length code\",a.mode=30;break}a.extra=15&S,a.mode=22;case 22:if(a.extra){for(N=a.extra;g<N;){if(0===u)break e;u--,b+=h[_++]<<g,g+=8}a.length+=b&(1<<a.extra)-1,b>>>=a.extra,g-=a.extra,a.back+=a.extra}a.was=a.length,a.mode=23;case 23:for(;S=(D=a.distcode[b&(1<<a.distbits)-1])>>>16&255,E=65535&D,!((z=D>>>24)<=g);){if(0===u)break e;u--,b+=h[_++]<<g,g+=8}if(0==(240&S)){for(A=z,Z=S,O=E;S=(D=a.distcode[O+((b&(1<<A+Z)-1)>>A)])>>>16&255,E=65535&D,!(A+(z=D>>>24)<=g);){if(0===u)break e;u--,b+=h[_++]<<g,g+=8}b>>>=A,g-=A,a.back+=A}if(b>>>=z,g-=z,a.back+=z,64&S){e.msg=\"invalid distance code\",a.mode=30;break}a.offset=E,a.extra=15&S,a.mode=24;case 24:if(a.extra){for(N=a.extra;g<N;){if(0===u)break e;u--,b+=h[_++]<<g,g+=8}a.offset+=b&(1<<a.extra)-1,b>>>=a.extra,g-=a.extra,a.back+=a.extra}if(a.offset>a.dmax){e.msg=\"invalid distance too far back\",a.mode=30;break}a.mode=25;case 25:if(0===c)break e;if(k=v-c,a.offset>k){if((k=a.offset-k)>a.whave&&a.sane){e.msg=\"invalid distance too far back\",a.mode=30;break}k>a.wnext?(k-=a.wnext,y=a.wsize-k):y=a.wnext-k,k>a.length&&(k=a.length),x=a.window}else x=d,y=f-a.offset,k=a.length;k>c&&(k=c),c-=k,a.length-=k;do{d[f++]=x[y++]}while(--k);0===a.length&&(a.mode=21);break;case 26:if(0===c)break e;d[f++]=a.length,c--,a.mode=21;break;case 27:if(a.wrap){for(;g<32;){if(0===u)break e;u--,b|=h[_++]<<g,g+=8}if(v-=c,e.total_out+=v,a.total+=v,v&&(e.adler=a.check=a.flags?r(a.check,d,v,f-v):i(a.check,d,v,f-v)),v=c,(a.flags?b:o(b))!==a.check){e.msg=\"incorrect data check\",a.mode=30;break}b=0,g=0}a.mode=28;case 28:if(a.wrap&&a.flags){for(;g<32;){if(0===u)break e;u--,b+=h[_++]<<g,g+=8}if(b!==(4294967295&a.total)){e.msg=\"incorrect length check\",a.mode=30;break}b=0,g=0}a.mode=29;case 29:B=1;break e;case 30:B=-3;break e;case 31:return-4;case 32:default:return-2}return e.next_out=f,e.avail_out=c,e.next_in=_,e.avail_in=u,a.hold=b,a.bits=g,(a.wsize||v!==e.avail_out&&a.mode<30&&(a.mode<27||4!==t))&&w(e,e.output,e.next_out,v-e.avail_out)?(a.mode=31,-4):(p-=e.avail_in,v-=e.avail_out,e.total_in+=p,e.total_out+=v,a.total+=v,a.wrap&&v&&(e.adler=a.check=a.flags?r(a.check,d,v,e.next_out-v):i(a.check,d,v,e.next_out-v)),e.data_type=a.bits+(a.last?64:0)+(12===a.mode?128:0)+(20===a.mode||15===a.mode?256:0),(0===p&&0===v||4===t)&&0===B&&(B=-5),B)},t.inflateEnd=function(e){if(!e||!e.state)return-2;var t=e.state;return t.window&&(t.window=null),e.state=null,0},t.inflateGetHeader=function(e,t){var a;return e&&e.state?0==(2&(a=e.state).wrap)?-2:(a.head=t,t.done=!1,0):-2},t.inflateSetDictionary=function(e,t){var a,n=t.length;return e&&e.state?0!==(a=e.state).wrap&&11!==a.mode?-2:11===a.mode&&i(1,t,n,0)!==a.check?-3:w(e,t,n,n)?(a.mode=31,-4):(a.havedict=1,0):-2},t.inflateInfo=\"pako inflate (from Nodeca project)\"},function(e,t,a){\"use strict\";e.exports=function(e,t,a,n){for(var i=65535&e|0,r=e>>>16&65535|0,s=0;0!==a;){a-=s=a>2e3?2e3:a;do{r=r+(i=i+t[n++]|0)|0}while(--s);i%=65521,r%=65521}return i|r<<16|0}},function(e,t,a){\"use strict\";var n=function(){for(var e,t=[],a=0;a<256;a++){e=a;for(var n=0;n<8;n++)e=1&e?3988292384^e>>>1:e>>>1;t[a]=e}return t}();e.exports=function(e,t,a,i){var r=n,s=i+a;e^=-1;for(var l=i;l<s;l++)e=e>>>8^r[255&(e^t[l])];return-1^e}},function(e,t,a){\"use strict\";var n=a(2);function i(e){for(var t=e.length;--t>=0;)e[t]=0}var r=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0],s=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13],l=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7],o=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],h=new Array(576);i(h);var d=new Array(60);i(d);var _=new Array(512);i(_);var f=new Array(256);i(f);var u=new Array(29);i(u);var c,b,g,m=new Array(30);function w(e,t,a,n,i){this.static_tree=e,this.extra_bits=t,this.extra_base=a,this.elems=n,this.max_length=i,this.has_stree=e&&e.length}function p(e,t){this.dyn_tree=e,this.max_code=0,this.stat_desc=t}function v(e){return e<256?_[e]:_[256+(e>>>7)]}function k(e,t){e.pending_buf[e.pending++]=255&t,e.pending_buf[e.pending++]=t>>>8&255}function y(e,t,a){e.bi_valid>16-a?(e.bi_buf|=t<<e.bi_valid&65535,k(e,e.bi_buf),e.bi_buf=t>>16-e.bi_valid,e.bi_valid+=a-16):(e.bi_buf|=t<<e.bi_valid&65535,e.bi_valid+=a)}function x(e,t,a){y(e,a[2*t],a[2*t+1])}function z(e,t){var a=0;do{a|=1&e,e>>>=1,a<<=1}while(--t>0);return a>>>1}function S(e,t,a){var n,i,r=new Array(16),s=0;for(n=1;n<=15;n++)r[n]=s=s+a[n-1]<<1;for(i=0;i<=t;i++){var l=e[2*i+1];0!==l&&(e[2*i]=z(r[l]++,l))}}function E(e){var t;for(t=0;t<286;t++)e.dyn_ltree[2*t]=0;for(t=0;t<30;t++)e.dyn_dtree[2*t]=0;for(t=0;t<19;t++)e.bl_tree[2*t]=0;e.dyn_ltree[512]=1,e.opt_len=e.static_len=0,e.last_lit=e.matches=0}function A(e){e.bi_valid>8?k(e,e.bi_buf):e.bi_valid>0&&(e.pending_buf[e.pending++]=e.bi_buf),e.bi_buf=0,e.bi_valid=0}function Z(e,t,a,n){var i=2*t,r=2*a;return e[i]<e[r]||e[i]===e[r]&&n[t]<=n[a]}function O(e,t,a){for(var n=e.heap[a],i=a<<1;i<=e.heap_len&&(i<e.heap_len&&Z(t,e.heap[i+1],e.heap[i],e.depth)&&i++,!Z(t,n,e.heap[i],e.depth));)e.heap[a]=e.heap[i],a=i,i<<=1;e.heap[a]=n}function R(e,t,a){var n,i,l,o,h=0;if(0!==e.last_lit)do{n=e.pending_buf[e.d_buf+2*h]<<8|e.pending_buf[e.d_buf+2*h+1],i=e.pending_buf[e.l_buf+h],h++,0===n?x(e,i,t):(x(e,(l=f[i])+256+1,t),0!==(o=r[l])&&y(e,i-=u[l],o),x(e,l=v(--n),a),0!==(o=s[l])&&y(e,n-=m[l],o))}while(h<e.last_lit);x(e,256,t)}function B(e,t){var a,n,i,r=t.dyn_tree,s=t.stat_desc.static_tree,l=t.stat_desc.has_stree,o=t.stat_desc.elems,h=-1;for(e.heap_len=0,e.heap_max=573,a=0;a<o;a++)0!==r[2*a]?(e.heap[++e.heap_len]=h=a,e.depth[a]=0):r[2*a+1]=0;for(;e.heap_len<2;)r[2*(i=e.heap[++e.heap_len]=h<2?++h:0)]=1,e.depth[i]=0,e.opt_len--,l&&(e.static_len-=s[2*i+1]);for(t.max_code=h,a=e.heap_len>>1;a>=1;a--)O(e,r,a);i=o;do{a=e.heap[1],e.heap[1]=e.heap[e.heap_len--],O(e,r,1),n=e.heap[1],e.heap[--e.heap_max]=a,e.heap[--e.heap_max]=n,r[2*i]=r[2*a]+r[2*n],e.depth[i]=(e.depth[a]>=e.depth[n]?e.depth[a]:e.depth[n])+1,r[2*a+1]=r[2*n+1]=i,e.heap[1]=i++,O(e,r,1)}while(e.heap_len>=2);e.heap[--e.heap_max]=e.heap[1],function(e,t){var a,n,i,r,s,l,o=t.dyn_tree,h=t.max_code,d=t.stat_desc.static_tree,_=t.stat_desc.has_stree,f=t.stat_desc.extra_bits,u=t.stat_desc.extra_base,c=t.stat_desc.max_length,b=0;for(r=0;r<=15;r++)e.bl_count[r]=0;for(o[2*e.heap[e.heap_max]+1]=0,a=e.heap_max+1;a<573;a++)(r=o[2*o[2*(n=e.heap[a])+1]+1]+1)>c&&(r=c,b++),o[2*n+1]=r,n>h||(e.bl_count[r]++,s=0,n>=u&&(s=f[n-u]),l=o[2*n],e.opt_len+=l*(r+s),_&&(e.static_len+=l*(d[2*n+1]+s)));if(0!==b){do{for(r=c-1;0===e.bl_count[r];)r--;e.bl_count[r]--,e.bl_count[r+1]+=2,e.bl_count[c]--,b-=2}while(b>0);for(r=c;0!==r;r--)for(n=e.bl_count[r];0!==n;)(i=e.heap[--a])>h||(o[2*i+1]!==r&&(e.opt_len+=(r-o[2*i+1])*o[2*i],o[2*i+1]=r),n--)}}(e,t),S(r,h,e.bl_count)}function T(e,t,a){var n,i,r=-1,s=t[1],l=0,o=7,h=4;for(0===s&&(o=138,h=3),t[2*(a+1)+1]=65535,n=0;n<=a;n++)i=s,s=t[2*(n+1)+1],++l<o&&i===s||(l<h?e.bl_tree[2*i]+=l:0!==i?(i!==r&&e.bl_tree[2*i]++,e.bl_tree[32]++):l<=10?e.bl_tree[34]++:e.bl_tree[36]++,l=0,r=i,0===s?(o=138,h=3):i===s?(o=6,h=3):(o=7,h=4))}function N(e,t,a){var n,i,r=-1,s=t[1],l=0,o=7,h=4;for(0===s&&(o=138,h=3),n=0;n<=a;n++)if(i=s,s=t[2*(n+1)+1],!(++l<o&&i===s)){if(l<h)do{x(e,i,e.bl_tree)}while(0!=--l);else 0!==i?(i!==r&&(x(e,i,e.bl_tree),l--),x(e,16,e.bl_tree),y(e,l-3,2)):l<=10?(x(e,17,e.bl_tree),y(e,l-3,3)):(x(e,18,e.bl_tree),y(e,l-11,7));l=0,r=i,0===s?(o=138,h=3):i===s?(o=6,h=3):(o=7,h=4)}}i(m);var D=!1;function U(e,t,a,i){y(e,0+(i?1:0),3),function(e,t,a,i){A(e),i&&(k(e,a),k(e,~a)),n.arraySet(e.pending_buf,e.window,t,a,e.pending),e.pending+=a}(e,t,a,!0)}t._tr_init=function(e){D||(!function(){var e,t,a,n,i,o=new Array(16);for(a=0,n=0;n<28;n++)for(u[n]=a,e=0;e<1<<r[n];e++)f[a++]=n;for(f[a-1]=n,i=0,n=0;n<16;n++)for(m[n]=i,e=0;e<1<<s[n];e++)_[i++]=n;for(i>>=7;n<30;n++)for(m[n]=i<<7,e=0;e<1<<s[n]-7;e++)_[256+i++]=n;for(t=0;t<=15;t++)o[t]=0;for(e=0;e<=143;)h[2*e+1]=8,e++,o[8]++;for(;e<=255;)h[2*e+1]=9,e++,o[9]++;for(;e<=279;)h[2*e+1]=7,e++,o[7]++;for(;e<=287;)h[2*e+1]=8,e++,o[8]++;for(S(h,287,o),e=0;e<30;e++)d[2*e+1]=5,d[2*e]=z(e,5);c=new w(h,r,257,286,15),b=new w(d,s,0,30,15),g=new w(new Array(0),l,0,19,7)}(),D=!0),e.l_desc=new p(e.dyn_ltree,c),e.d_desc=new p(e.dyn_dtree,b),e.bl_desc=new p(e.bl_tree,g),e.bi_buf=0,e.bi_valid=0,E(e)},t._tr_stored_block=U,t._tr_flush_block=function(e,t,a,n){var i,r,s=0;e.level>0?(2===e.strm.data_type&&(e.strm.data_type=function(e){var t,a=4093624447;for(t=0;t<=31;t++,a>>>=1)if(1&a&&0!==e.dyn_ltree[2*t])return 0;if(0!==e.dyn_ltree[18]||0!==e.dyn_ltree[20]||0!==e.dyn_ltree[26])return 1;for(t=32;t<256;t++)if(0!==e.dyn_ltree[2*t])return 1;return 0}(e)),B(e,e.l_desc),B(e,e.d_desc),s=function(e){var t;for(T(e,e.dyn_ltree,e.l_desc.max_code),T(e,e.dyn_dtree,e.d_desc.max_code),B(e,e.bl_desc),t=18;t>=3&&0===e.bl_tree[2*o[t]+1];t--);return e.opt_len+=3*(t+1)+5+5+4,t}(e),i=e.opt_len+3+7>>>3,(r=e.static_len+3+7>>>3)<=i&&(i=r)):i=r=a+5,a+4<=i&&-1!==t?U(e,t,a,n):4===e.strategy||r===i?(y(e,2+(n?1:0),3),R(e,h,d)):(y(e,4+(n?1:0),3),function(e,t,a,n){var i;for(y(e,t-257,5),y(e,a-1,5),y(e,n-4,4),i=0;i<n;i++)y(e,e.bl_tree[2*o[i]+1],3);N(e,e.dyn_ltree,t-1),N(e,e.dyn_dtree,a-1)}(e,e.l_desc.max_code+1,e.d_desc.max_code+1,s+1),R(e,e.dyn_ltree,e.dyn_dtree)),E(e),n&&A(e)},t._tr_tally=function(e,t,a){return e.pending_buf[e.d_buf+2*e.last_lit]=t>>>8&255,e.pending_buf[e.d_buf+2*e.last_lit+1]=255&t,e.pending_buf[e.l_buf+e.last_lit]=255&a,e.last_lit++,0===t?e.dyn_ltree[2*a]++:(e.matches++,t--,e.dyn_ltree[2*(f[a]+256+1)]++,e.dyn_dtree[2*v(t)]++),e.last_lit===e.lit_bufsize-1},t._tr_align=function(e){y(e,2,3),x(e,256,h),function(e){16===e.bi_valid?(k(e,e.bi_buf),e.bi_buf=0,e.bi_valid=0):e.bi_valid>=8&&(e.pending_buf[e.pending++]=255&e.bi_buf,e.bi_buf>>=8,e.bi_valid-=8)}(e)}},function(e,t,a){\"use strict\";e.exports=function(e,t){var a,n,i,r,s,l,o,h,d,_,f,u,c,b,g,m,w,p,v,k,y,x,z,S,E;a=e.state,n=e.next_in,S=e.input,i=n+(e.avail_in-5),r=e.next_out,E=e.output,s=r-(t-e.avail_out),l=r+(e.avail_out-257),o=a.dmax,h=a.wsize,d=a.whave,_=a.wnext,f=a.window,u=a.hold,c=a.bits,b=a.lencode,g=a.distcode,m=(1<<a.lenbits)-1,w=(1<<a.distbits)-1;e:do{c<15&&(u+=S[n++]<<c,c+=8,u+=S[n++]<<c,c+=8),p=b[u&m];t:for(;;){if(u>>>=v=p>>>24,c-=v,0===(v=p>>>16&255))E[r++]=65535&p;else{if(!(16&v)){if(0==(64&v)){p=b[(65535&p)+(u&(1<<v)-1)];continue t}if(32&v){a.mode=12;break e}e.msg=\"invalid literal/length code\",a.mode=30;break e}k=65535&p,(v&=15)&&(c<v&&(u+=S[n++]<<c,c+=8),k+=u&(1<<v)-1,u>>>=v,c-=v),c<15&&(u+=S[n++]<<c,c+=8,u+=S[n++]<<c,c+=8),p=g[u&w];a:for(;;){if(u>>>=v=p>>>24,c-=v,!(16&(v=p>>>16&255))){if(0==(64&v)){p=g[(65535&p)+(u&(1<<v)-1)];continue a}e.msg=\"invalid distance code\",a.mode=30;break e}if(y=65535&p,c<(v&=15)&&(u+=S[n++]<<c,(c+=8)<v&&(u+=S[n++]<<c,c+=8)),(y+=u&(1<<v)-1)>o){e.msg=\"invalid distance too far back\",a.mode=30;break e}if(u>>>=v,c-=v,y>(v=r-s)){if((v=y-v)>d&&a.sane){e.msg=\"invalid distance too far back\",a.mode=30;break e}if(x=0,z=f,0===_){if(x+=h-v,v<k){k-=v;do{E[r++]=f[x++]}while(--v);x=r-y,z=E}}else if(_<v){if(x+=h+_-v,(v-=_)<k){k-=v;do{E[r++]=f[x++]}while(--v);if(x=0,_<k){k-=v=_;do{E[r++]=f[x++]}while(--v);x=r-y,z=E}}}else if(x+=_-v,v<k){k-=v;do{E[r++]=f[x++]}while(--v);x=r-y,z=E}for(;k>2;)E[r++]=z[x++],E[r++]=z[x++],E[r++]=z[x++],k-=3;k&&(E[r++]=z[x++],k>1&&(E[r++]=z[x++]))}else{x=r-y;do{E[r++]=E[x++],E[r++]=E[x++],E[r++]=E[x++],k-=3}while(k>2);k&&(E[r++]=E[x++],k>1&&(E[r++]=E[x++]))}break}}break}}while(n<i&&r<l);n-=k=c>>3,u&=(1<<(c-=k<<3))-1,e.next_in=n,e.next_out=r,e.avail_in=n<i?i-n+5:5-(n-i),e.avail_out=r<l?l-r+257:257-(r-l),a.hold=u,a.bits=c}},function(e,t,a){\"use strict\";var n=a(2),i=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,0,0],r=[16,16,16,16,16,16,16,16,17,17,17,17,18,18,18,18,19,19,19,19,20,20,20,20,21,21,21,21,16,72,78],s=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577,0,0],l=[16,16,16,16,17,17,18,18,19,19,20,20,21,21,22,22,23,23,24,24,25,25,26,26,27,27,28,28,29,29,64,64];e.exports=function(e,t,a,o,h,d,_,f){var u,c,b,g,m,w,p,v,k,y=f.bits,x=0,z=0,S=0,E=0,A=0,Z=0,O=0,R=0,B=0,T=0,N=null,D=0,U=new n.Buf16(16),I=new n.Buf16(16),F=null,L=0;for(x=0;x<=15;x++)U[x]=0;for(z=0;z<o;z++)U[t[a+z]]++;for(A=y,E=15;E>=1&&0===U[E];E--);if(A>E&&(A=E),0===E)return h[d++]=20971520,h[d++]=20971520,f.bits=1,0;for(S=1;S<E&&0===U[S];S++);for(A<S&&(A=S),R=1,x=1;x<=15;x++)if(R<<=1,(R-=U[x])<0)return-1;if(R>0&&(0===e||1!==E))return-1;for(I[1]=0,x=1;x<15;x++)I[x+1]=I[x]+U[x];for(z=0;z<o;z++)0!==t[a+z]&&(_[I[t[a+z]]++]=z);if(0===e?(N=F=_,w=19):1===e?(N=i,D-=257,F=r,L-=257,w=256):(N=s,F=l,w=-1),T=0,z=0,x=S,m=d,Z=A,O=0,b=-1,g=(B=1<<A)-1,1===e&&B>852||2===e&&B>592)return 1;for(;;){p=x-O,_[z]<w?(v=0,k=_[z]):_[z]>w?(v=F[L+_[z]],k=N[D+_[z]]):(v=96,k=0),u=1<<x-O,S=c=1<<Z;do{h[m+(T>>O)+(c-=u)]=p<<24|v<<16|k|0}while(0!==c);for(u=1<<x-1;T&u;)u>>=1;if(0!==u?(T&=u-1,T+=u):T=0,z++,0==--U[x]){if(x===E)break;x=t[a+_[z]]}if(x>A&&(T&g)!==b){for(0===O&&(O=A),m+=S,R=1<<(Z=x-O);Z+O<E&&!((R-=U[Z+O])<=0);)Z++,R<<=1;if(B+=1<<Z,1===e&&B>852||2===e&&B>592)return 1;h[b=T&g]=A<<24|Z<<16|m-d|0}}return 0!==T&&(h[m+T]=x-O<<24|64<<16|0),f.bits=A,0}},function(e,t,a){\"use strict\";a.r(t);var n=a(3),i=a.n(n),r=a(4),s=a(5),l=a(1),o=a.n(l),h=a(0);function d(e,t){var a=this;this.inflatedReady=e,this.deflatedReady=t,this._inflate=function(e){var t=new i.a,a=Object(s.inflateInit2)(t,15);if(a!==h.Z_OK)throw new Error(\"Problem initializing inflate stream: \"+o.a[a]);return function(a){if(void 0===a)return e();var n,i,r;t.input=a,t.next_in=0,t.avail_in=t.input.length;var l=!0;do{if(0===t.avail_out&&(t.output=new Uint8Array(16384),n=t.next_out=0,t.avail_out=16384),(i=Object(s.inflate)(t,h.Z_NO_FLUSH))!==h.Z_STREAM_END&&i!==h.Z_OK)throw new Error(\"inflate problem: \"+o.a[i]);t.next_out&&(0!==t.avail_out&&i!==h.Z_STREAM_END||(r=t.output.subarray(n,n=t.next_out),l=e(r)))}while(t.avail_in>0&&i!==h.Z_STREAM_END);return t.next_out>n&&(r=t.output.subarray(n,n=t.next_out),l=e(r)),l}}((function(e){return a.inflatedReady(e.buffer.slice(e.byteOffset,e.byteOffset+e.length))})),this._deflate=function(e){var t=new i.a,a=Object(r.deflateInit2)(t,h.Z_DEFAULT_COMPRESSION,h.Z_DEFLATED,15,8,h.Z_DEFAULT_STRATEGY);if(a!==h.Z_OK)throw new Error(\"Problem initializing deflate stream: \"+o.a[a]);return function(a){if(void 0===a)return e();var n,i,s;t.input=a,t.next_in=0,t.avail_in=t.input.length;var l=!0;do{if(0===t.avail_out&&(t.output=new Uint8Array(16384),s=t.next_out=0,t.avail_out=16384),(n=Object(r.deflate)(t,h.Z_SYNC_FLUSH))!==h.Z_STREAM_END&&n!==h.Z_OK)throw new Error(\"Deflate problem: \"+o.a[n]);0===t.avail_out&&t.next_out>s&&(i=t.output.subarray(s,s=t.next_out),l=e(i))}while((t.avail_in>0||0===t.avail_out)&&n!==h.Z_STREAM_END);return t.next_out>s&&(i=t.output.subarray(s,s=t.next_out),l=e(i)),l}}((function(e){return a.deflatedReady(e.buffer.slice(e.byteOffset,e.byteOffset+e.length))}))}d.prototype.inflate=function(e){this._inflate(new Uint8Array(e))},d.prototype.deflate=function(e){this._deflate(new Uint8Array(e))};var _=function(e,t){return{message:e,buffer:t}},f=new d((function(e){return self.postMessage(_(\"inflated_ready\",e),[e])}),(function(e){return self.postMessage(_(\"deflated_ready\",e),[e])}));self.onmessage=function(e){var t=e.data.message,a=e.data.buffer;switch(t){case\"start\":break;case\"inflate\":f.inflate(a);break;case\"deflate\":f.deflate(a)}}}]);"; //
// constants used for communication with the worker
//
const MESSAGE_INITIALIZE_WORKER = 'start';
const MESSAGE_INFLATE = 'inflate';
const MESSAGE_INFLATED_DATA_READY = 'inflated_ready';
const MESSAGE_DEFLATE = 'deflate';
const MESSAGE_DEFLATED_DATA_READY = 'deflated_ready';
const EOL = '\r\n';
const LINE_FEED = 10;
const CARRIAGE_RETURN = 13;
const LEFT_CURLY_BRACKET = 123;
const RIGHT_CURLY_BRACKET = 125;
const ASCII_PLUS = 43;

// State tracking when constructing an IMAP command from buffers.
const BUFFER_STATE_LITERAL = 'literal';
const BUFFER_STATE_POSSIBLY_LITERAL_LENGTH_1 = 'literal_length_1';
const BUFFER_STATE_POSSIBLY_LITERAL_LENGTH_2 = 'literal_length_2';
const BUFFER_STATE_DEFAULT = 'default';

/**
 * How much time to wait since the last response until the connection is considered idling
 */
const TIMEOUT_ENTER_IDLE = 1000;

/**
 * Lower Bound for socket timeout to wait since the last data was written to a socket
 */
const TIMEOUT_SOCKET_LOWER_BOUND = 10000;

/**
 * Multiplier for socket timeout:
 *
 * We assume at least a GPRS connection with 115 kb/s = 14,375 kB/s tops, so 10 KB/s to be on
 * the safe side. We can timeout after a lower bound of 10s + (n KB / 10 KB/s). A 1 MB message
 * upload would be 110 seconds to wait for the timeout. 10 KB/s === 0.1 s/B
 */
const TIMEOUT_SOCKET_MULTIPLIER = 0.1;

/**
 * Creates a connection object to an IMAP server. Call `connect` method to inititate
 * the actual connection, the constructor only defines the properties but does not actually connect.
 *
 * @constructor
 *
 * @param {String} [host='localhost'] Hostname to conenct to
 * @param {Number} [port=143] Port number to connect to
 * @param {Object} [options] Optional options object
 * @param {Boolean} [options.useSecureTransport] Set to true, to use encrypted connection
 * @param {String} [options.compressionWorkerPath] offloads de-/compression computation to a web worker, this is the path to the browserified emailjs-compressor-worker.js
 */
class Imap {
  constructor(host, port, options = {}) {
    this.timeoutEnterIdle = TIMEOUT_ENTER_IDLE;
    this.timeoutSocketLowerBound = TIMEOUT_SOCKET_LOWER_BOUND;
    this.timeoutSocketMultiplier = TIMEOUT_SOCKET_MULTIPLIER;
    this.options = options;
    this.port = port || (this.options.useSecureTransport ? 993 : 143);
    this.host = host || 'localhost';

    // Use a TLS connection. Port 993 also forces TLS.
    this.options.useSecureTransport = 'useSecureTransport' in this.options ? !!this.options.useSecureTransport : this.port === 993;
    this.secureMode = !!this.options.useSecureTransport; // Does the connection use SSL/TLS

    this._connectionReady = false; // Is the conection established and greeting is received from the server

    this._globalAcceptUntagged = {}; // Global handlers for unrelated responses (EXPUNGE, EXISTS etc.)

    this._clientQueue = []; // Queue of outgoing commands
    this._canSend = false; // Is it OK to send something to the server
    this._tagCounter = 0; // Counter to allow uniqueue imap tags
    this._currentCommand = false; // Current command that is waiting for response from the server

    this._idleTimer = false; // Timer waiting to enter idle
    this._socketTimeoutTimer = false; // Timer waiting to declare the socket dead starting from the last write

    this.compressed = false; // Is the connection compressed and needs inflating/deflating

    //
    // HELPERS
    //

    // As the server sends data in chunks, it needs to be split into separate lines. Helps parsing the input.
    this._incomingBuffers = [];
    this._bufferState = BUFFER_STATE_DEFAULT;
    this._literalRemaining = 0;

    //
    // Event placeholders, may be overriden with callback functions
    //
    this.oncert = null;
    this.onerror = null; // Irrecoverable error occurred. Connection to the server will be closed automatically.
    this.onready = null; // The connection to the server has been established and greeting is received
    this.onidle = null; // There are no more commands to process
  }

  // PUBLIC METHODS

  /**
   * Initiate a connection to the server. Wait for onready event
   *
   * @param {Object} Socket
   *     TESTING ONLY! The TCPSocket has a pretty nonsensical convenience constructor,
   *     which makes it hard to mock. For dependency-injection purposes, we use the
   *     Socket parameter to pass in a mock Socket implementation. Should be left blank
   *     in production use!
   * @returns {Promise} Resolves when socket is opened
   */
  connect(Socket = _emailjsTcpSocket.default) {
    return new Promise((resolve, reject) => {
      this.socket = Socket.open(this.host, this.port, {
        binaryType: 'arraybuffer',
        useSecureTransport: this.secureMode,
        ca: this.options.ca
      });

      // allows certificate handling for platform w/o native tls support
      // oncert is non standard so setting it might throw if the socket object is immutable
      try {
        this.socket.oncert = cert => {
          this.oncert && this.oncert(cert);
        };
      } catch (E) {}

      // Connection closing unexpected is an error
      this.socket.onclose = () => this._onError(new Error('Socket closed unexpectedly!'));
      this.socket.ondata = evt => {
        try {
          this._onData(evt);
        } catch (err) {
          this._onError(err);
        }
      };

      // if an error happens during create time, reject the promise
      this.socket.onerror = e => {
        reject(new Error('Could not open socket: ' + e.data.message));
      };
      this.socket.onopen = () => {
        // use proper "irrecoverable error, tear down everything"-handler only after socket is open
        this.socket.onerror = e => this._onError(e);
        resolve();
      };
    });
  }

  /**
   * Closes the connection to the server
   *
   * @returns {Promise} Resolves when the socket is closed
   */
  close(error) {
    return new Promise(resolve => {
      var tearDown = () => {
        // fulfill pending promises
        this._clientQueue.forEach(cmd => cmd.callback(error));
        if (this._currentCommand) {
          this._currentCommand.callback(error);
        }
        this._clientQueue = [];
        this._currentCommand = false;
        clearTimeout(this._idleTimer);
        this._idleTimer = null;
        clearTimeout(this._socketTimeoutTimer);
        this._socketTimeoutTimer = null;
        if (this.socket) {
          // remove all listeners
          this.socket.onopen = null;
          this.socket.onclose = null;
          this.socket.ondata = null;
          this.socket.onerror = null;
          try {
            this.socket.oncert = null;
          } catch (E) {}
          this.socket = null;
        }
        resolve();
      };
      this._disableCompression();
      if (!this.socket || this.socket.readyState !== 'open') {
        return tearDown();
      }
      this.socket.onclose = this.socket.onerror = tearDown; // we don't really care about the error here
      this.socket.close();
    });
  }

  /**
   * Send LOGOUT to the server.
   *
   * Use is discouraged!
   *
   * @returns {Promise} Resolves when connection is closed by server.
   */
  logout() {
    return new Promise((resolve, reject) => {
      this.socket.onclose = this.socket.onerror = () => {
        this.close('Client logging out').then(resolve).catch(reject);
      };
      this.enqueueCommand('LOGOUT');
    });
  }

  /**
   * Initiates TLS handshake
   */
  upgrade() {
    this.secureMode = true;
    this.socket.upgradeToSecure();
  }

  /**
   * Schedules a command to be sent to the server.
   * See https://github.com/emailjs/emailjs-imap-handler for request structure.
   * Do not provide a tag property, it will be set by the queue manager.
   *
   * To catch untagged responses use acceptUntagged property. For example, if
   * the value for it is 'FETCH' then the reponse includes 'payload.FETCH' property
   * that is an array including all listed * FETCH responses.
   *
   * @param {Object} request Structured request object
   * @param {Array} acceptUntagged a list of untagged responses that will be included in 'payload' property
   * @param {Object} [options] Optional data for the command payload
   * @returns {Promise} Promise that resolves when the corresponding response was received
   */
  enqueueCommand(request, acceptUntagged, options) {
    if (typeof request === 'string') {
      request = {
        command: request
      };
    }
    acceptUntagged = [].concat(acceptUntagged || []).map(untagged => (untagged || '').toString().toUpperCase().trim());
    var tag = 'W' + ++this._tagCounter;
    request.tag = tag;
    return new Promise((resolve, reject) => {
      var data = {
        tag: tag,
        request: request,
        payload: acceptUntagged.length ? {} : undefined,
        callback: response => {
          if (this.isError(response)) {
            return reject(response);
          } else {
            const command = (0, _ramda.propOr)('', 'command', response).toUpperCase().trim();
            if (['NO', 'BAD'].includes(command)) {
              var error = new Error(response.humanReadable || 'Error');
              error.command = command;
              if (response.code) {
                error.code = response.code;
              }
              return reject(error);
            }
          }
          resolve(response);
        }
      };

      // apply any additional options to the command
      Object.keys(options || {}).forEach(key => {
        data[key] = options[key];
      });
      acceptUntagged.forEach(command => {
        data.payload[command] = [];
      });

      // if we're in priority mode (i.e. we ran commands in a precheck),
      // queue any commands BEFORE the command that contianed the precheck,
      // otherwise just queue command as usual
      var index = data.ctx ? this._clientQueue.indexOf(data.ctx) : -1;
      if (index >= 0) {
        data.tag += '.p';
        data.request.tag += '.p';
        this._clientQueue.splice(index, 0, data);
      } else {
        this._clientQueue.push(data);
      }
      if (this._canSend) {
        this._sendRequest();
      }
    });
  }

  /**
   *
   * @param commands
   * @param ctx
   * @returns {*}
   */
  getPreviouslyQueued(commands, ctx) {
    const startIndex = this._clientQueue.indexOf(ctx) - 1;

    // search backwards for the commands and return the first found
    for (let i = startIndex; i >= 0; i--) {
      if (isMatch(this._clientQueue[i])) {
        return this._clientQueue[i];
      }
    }

    // also check current command if no SELECT is queued
    if (isMatch(this._currentCommand)) {
      return this._currentCommand;
    }
    return false;
    function isMatch(data) {
      return data && data.request && commands.indexOf(data.request.command) >= 0;
    }
  }

  /**
   * Send data to the TCP socket
   * Arms a timeout waiting for a response from the server.
   *
   * @param {String} str Payload
   */
  send(str) {
    const buffer = (0, _common.toTypedArray)(str).buffer;
    this._resetSocketTimeout(buffer.byteLength);
    if (this.compressed) {
      this._sendCompressed(buffer);
    } else {
      this.socket.send(buffer);
    }
  }

  /**
   * Set a global handler for an untagged response. If currently processed command
   * has not listed untagged command it is forwarded to the global handler. Useful
   * with EXPUNGE, EXISTS etc.
   *
   * @param {String} command Untagged command name
   * @param {Function} callback Callback function with response object and continue callback function
   */
  setHandler(command, callback) {
    this._globalAcceptUntagged[command.toUpperCase().trim()] = callback;
  }

  // INTERNAL EVENTS

  /**
   * Error handler for the socket
   *
   * @event
   * @param {Event} evt Event object. See evt.data for the error
   */
  _onError(evt) {
    var error;
    if (this.isError(evt)) {
      error = evt;
    } else if (evt && this.isError(evt.data)) {
      error = evt.data;
    } else {
      error = new Error(evt && evt.data && evt.data.message || evt.data || evt || 'Error');
    }
    this.logger.error(error);

    // always call onerror callback, no matter if close() succeeds or fails
    this.close(error).then(() => {
      this.onerror && this.onerror(error);
    }, () => {
      this.onerror && this.onerror(error);
    });
  }

  /**
   * Handler for incoming data from the server. The data is sent in arbitrary
   * chunks and can't be used directly so this function makes sure the data
   * is split into complete lines before the data is passed to the command
   * handler
   *
   * @param {Event} evt
   */
  _onData(evt) {
    // reset the timeout on each data packet
    this._resetSocketTimeout();
    this._incomingBuffers.push(new Uint8Array(evt.data)); // append to the incoming buffer
    this._parseIncomingCommands(this._iterateIncomingBuffer()); // Consume the incoming buffer
  }

  *_iterateIncomingBuffer() {
    let buf = this._incomingBuffers[this._incomingBuffers.length - 1] || [];
    let i = 0;

    // loop invariant:
    //   this._incomingBuffers starts with the beginning of incoming command.
    //   buf is shorthand for last element of this._incomingBuffers.
    //   buf[0..i-1] is part of incoming command.
    while (i < buf.length) {
      switch (this._bufferState) {
        case BUFFER_STATE_LITERAL:
          const diff = Math.min(buf.length - i, this._literalRemaining);
          this._literalRemaining -= diff;
          i += diff;
          if (this._literalRemaining === 0) {
            this._bufferState = BUFFER_STATE_DEFAULT;
          }
          continue;
        case BUFFER_STATE_POSSIBLY_LITERAL_LENGTH_2:
          if (i < buf.length) {
            if (buf[i] === CARRIAGE_RETURN) {
              this._literalRemaining = Number((0, _common.fromTypedArray)(this._lengthBuffer)) + 2; // for CRLF
              this._bufferState = BUFFER_STATE_LITERAL;
            } else {
              this._bufferState = BUFFER_STATE_DEFAULT;
            }
            delete this._lengthBuffer;
          }
          continue;
        case BUFFER_STATE_POSSIBLY_LITERAL_LENGTH_1:
          const start = i;
          while (i < buf.length && buf[i] >= 48 && buf[i] <= 57) {
            // digits
            i++;
          }
          if (start !== i) {
            const latest = buf.subarray(start, i);
            const prevBuf = this._lengthBuffer;
            this._lengthBuffer = new Uint8Array(prevBuf.length + latest.length);
            this._lengthBuffer.set(prevBuf);
            this._lengthBuffer.set(latest, prevBuf.length);
          }
          if (i < buf.length) {
            if (this._lengthBuffer.length > 0 && buf[i] === RIGHT_CURLY_BRACKET) {
              this._bufferState = BUFFER_STATE_POSSIBLY_LITERAL_LENGTH_2;
            } else {
              delete this._lengthBuffer;
              this._bufferState = BUFFER_STATE_DEFAULT;
            }
            i++;
          }
          continue;
        default:
          // find literal length
          const leftIdx = buf.indexOf(LEFT_CURLY_BRACKET, i);
          if (leftIdx > -1) {
            const leftOfLeftCurly = new Uint8Array(buf.buffer, i, leftIdx - i);
            if (leftOfLeftCurly.indexOf(LINE_FEED) === -1) {
              i = leftIdx + 1;
              this._lengthBuffer = new Uint8Array(0);
              this._bufferState = BUFFER_STATE_POSSIBLY_LITERAL_LENGTH_1;
              continue;
            }
          }

          // find end of command
          const LFidx = buf.indexOf(LINE_FEED, i);
          if (LFidx > -1) {
            if (LFidx < buf.length - 1) {
              this._incomingBuffers[this._incomingBuffers.length - 1] = new Uint8Array(buf.buffer, 0, LFidx + 1);
            }
            const commandLength = this._incomingBuffers.reduce((prev, curr) => prev + curr.length, 0) - 2; // 2 for CRLF
            const command = new Uint8Array(commandLength);
            let index = 0;
            while (this._incomingBuffers.length > 0) {
              let uint8Array = this._incomingBuffers.shift();
              const remainingLength = commandLength - index;
              if (uint8Array.length > remainingLength) {
                const excessLength = uint8Array.length - remainingLength;
                uint8Array = uint8Array.subarray(0, -excessLength);
                if (this._incomingBuffers.length > 0) {
                  this._incomingBuffers = [];
                }
              }
              command.set(uint8Array, index);
              index += uint8Array.length;
            }
            yield command;
            if (LFidx < buf.length - 1) {
              buf = new Uint8Array(buf.subarray(LFidx + 1));
              this._incomingBuffers.push(buf);
              i = 0;
            } else {
              // clear the timeout when an entire command has arrived
              // and not waiting on more data for next command
              clearTimeout(this._socketTimeoutTimer);
              this._socketTimeoutTimer = null;
              return;
            }
          } else {
            return;
          }
      }
    }
  }

  // PRIVATE METHODS

  /**
   * Processes a command from the queue. The command is parsed and feeded to a handler
   */
  _parseIncomingCommands(commands) {
    for (var command of commands) {
      this._clearIdle();

      /*
       * The "+"-tagged response is a special case:
       * Either the server can asks for the next chunk of data, e.g. for the AUTHENTICATE command.
       *
       * Or there was an error in the XOAUTH2 authentication, for which SASL initial client response extension
       * dictates the client sends an empty EOL response to the challenge containing the error message.
       *
       * Details on "+"-tagged response:
       *   https://tools.ietf.org/html/rfc3501#section-2.2.1
       */
      //
      if (command[0] === ASCII_PLUS) {
        if (this._currentCommand.data.length) {
          // feed the next chunk of data
          var chunk = this._currentCommand.data.shift();
          chunk += !this._currentCommand.data.length ? EOL : ''; // EOL if there's nothing more to send
          this.send(chunk);
        } else if (this._currentCommand.errorResponseExpectsEmptyLine) {
          this.send(EOL); // XOAUTH2 empty response, error will be reported when server continues with NO response
        }

        continue;
      }
      var response;
      try {
        const valueAsString = this._currentCommand.request && this._currentCommand.request.valueAsString;
        response = (0, _emailjsImapHandler.parser)(command, {
          valueAsString
        });
        this.logger.debug('S:', () => (0, _emailjsImapHandler.compiler)(response, false, true));
      } catch (e) {
        this.logger.error('Error parsing imap command!', response);
        return this._onError(e);
      }
      this._processResponse(response);
      this._handleResponse(response);

      // first response from the server, connection is now usable
      if (!this._connectionReady) {
        this._connectionReady = true;
        this.onready && this.onready();
      }
    }
  }

  /**
   * Feeds a parsed response object to an appropriate handler
   *
   * @param {Object} response Parsed command object
   */
  _handleResponse(response) {
    var command = (0, _ramda.propOr)('', 'command', response).toUpperCase().trim();
    if (!this._currentCommand) {
      // unsolicited untagged response
      if (response.tag === '*' && command in this._globalAcceptUntagged) {
        this._globalAcceptUntagged[command](response);
        this._canSend = true;
        this._sendRequest();
      }
    } else if (this._currentCommand.payload && response.tag === '*' && command in this._currentCommand.payload) {
      // expected untagged response
      this._currentCommand.payload[command].push(response);
      // still expecting more data for the response of the current command
      this._resetSocketTimeout();
    } else if (response.tag === '*' && command in this._globalAcceptUntagged) {
      // unexpected untagged response
      this._globalAcceptUntagged[command](response);
      // still expecting more data for the response of the current command
      this._resetSocketTimeout();
    } else if (response.tag === this._currentCommand.tag) {
      // tagged response
      if (this._currentCommand.payload && Object.keys(this._currentCommand.payload).length) {
        response.payload = this._currentCommand.payload;
      }
      this._currentCommand.callback(response);
      this._canSend = true;
      this._sendRequest();
    }
  }

  /**
   * Sends a command from client queue to the server.
   */
  _sendRequest() {
    if (!this._clientQueue.length) {
      this._currentCommand = false;
      return this._enterIdle();
    }
    this._clearIdle();

    // an operation was made in the precheck, no need to restart the queue manually
    this._restartQueue = false;
    var command = this._clientQueue[0];
    if (typeof command.precheck === 'function') {
      // remember the context
      var context = command;
      var precheck = context.precheck;
      delete context.precheck;

      // we need to restart the queue handling if no operation was made in the precheck
      this._restartQueue = true;

      // invoke the precheck command and resume normal operation after the promise resolves
      precheck(context).then(() => {
        // we're done with the precheck
        if (this._restartQueue) {
          // we need to restart the queue handling
          this._sendRequest();
        }
      }).catch(err => {
        // precheck failed, so we remove the initial command
        // from the queue, invoke its callback and resume normal operation
        let cmd;
        const index = this._clientQueue.indexOf(context);
        if (index >= 0) {
          cmd = this._clientQueue.splice(index, 1)[0];
        }
        if (cmd && cmd.callback) {
          cmd.callback(err);
          this._canSend = true;
          this._parseIncomingCommands(this._iterateIncomingBuffer()); // Consume the rest of the incoming buffer
          this._sendRequest(); // continue sending
        }
      });

      return;
    }
    this._canSend = false;
    this._currentCommand = this._clientQueue.shift();
    try {
      this._currentCommand.data = (0, _emailjsImapHandler.compiler)(this._currentCommand.request, true);
      this.logger.debug('C:', () => (0, _emailjsImapHandler.compiler)(this._currentCommand.request, false, true)); // excludes passwords etc.
    } catch (e) {
      this.logger.error('Error compiling imap command!', this._currentCommand.request);
      return this._onError(new Error('Error compiling imap command!'));
    }
    var data = this._currentCommand.data.shift();
    this.send(data + (!this._currentCommand.data.length ? EOL : ''));
    return this.waitDrain;
  }

  /**
   * Emits onidle, noting to do currently
   */
  _enterIdle() {
    clearTimeout(this._idleTimer);
    this._idleTimer = setTimeout(() => this.onidle && this.onidle(), this.timeoutEnterIdle);
  }

  /**
   * Cancel idle timer
   */
  _clearIdle() {
    clearTimeout(this._idleTimer);
    this._idleTimer = null;
  }

  /**
   * Method processes a response into an easier to handle format.
   * Add untagged numbered responses (e.g. FETCH) into a nicely feasible form
   * Checks if a response includes optional response codes
   * and copies these into separate properties. For example the
   * following response includes a capability listing and a human
   * readable message:
   *
   *     * OK [CAPABILITY ID NAMESPACE] All ready
   *
   * This method adds a 'capability' property with an array value ['ID', 'NAMESPACE']
   * to the response object. Additionally 'All ready' is added as 'humanReadable' property.
   *
   * See possiblem IMAP Response Codes at https://tools.ietf.org/html/rfc5530
   *
   * @param {Object} response Parsed response object
   */
  _processResponse(response) {
    const command = (0, _ramda.propOr)('', 'command', response).toUpperCase().trim();

    // no attributes
    if (!response || !response.attributes || !response.attributes.length) {
      return;
    }

    // untagged responses w/ sequence numbers
    if (response.tag === '*' && /^\d+$/.test(response.command) && response.attributes[0].type === 'ATOM') {
      response.nr = Number(response.command);
      response.command = (response.attributes.shift().value || '').toString().toUpperCase().trim();
    }

    // no optional response code
    if (['OK', 'NO', 'BAD', 'BYE', 'PREAUTH'].indexOf(command) < 0) {
      return;
    }

    // If last element of the response is TEXT then this is for humans
    if (response.attributes[response.attributes.length - 1].type === 'TEXT') {
      response.humanReadable = response.attributes[response.attributes.length - 1].value;
    }

    // Parse and format ATOM values
    if (response.attributes[0].type === 'ATOM' && response.attributes[0].section) {
      const option = response.attributes[0].section.map(key => {
        if (!key) {
          return;
        }
        if (Array.isArray(key)) {
          return key.map(key => (key.value || '').toString().trim());
        } else {
          return (key.value || '').toString().toUpperCase().trim();
        }
      });
      const key = option.shift();
      response.code = key;
      if (option.length === 1) {
        response[key.toLowerCase()] = option[0];
      } else if (option.length > 1) {
        response[key.toLowerCase()] = option;
      }
    }
  }

  /**
   * Checks if a value is an Error object
   *
   * @param {Mixed} value Value to be checked
   * @return {Boolean} returns true if the value is an Error
   */
  isError(value) {
    return !!Object.prototype.toString.call(value).match(/Error\]$/);
  }

  // COMPRESSION RELATED METHODS

  /**
   * Sets up deflate/inflate for the IO
   */
  enableCompression() {
    this._socketOnData = this.socket.ondata;
    this.compressed = true;
    if (typeof window !== 'undefined' && window.Worker) {
      this._compressionWorker = new Worker(URL.createObjectURL(new Blob([CompressionBlob])));
      this._compressionWorker.onmessage = e => {
        var message = e.data.message;
        var data = e.data.buffer;
        switch (message) {
          case MESSAGE_INFLATED_DATA_READY:
            this._socketOnData({
              data
            });
            break;
          case MESSAGE_DEFLATED_DATA_READY:
            this.waitDrain = this.socket.send(data);
            break;
        }
      };
      this._compressionWorker.onerror = e => {
        this._onError(new Error('Error handling compression web worker: ' + e.message));
      };
      this._compressionWorker.postMessage(createMessage(MESSAGE_INITIALIZE_WORKER));
    } else {
      const inflatedReady = buffer => {
        this._socketOnData({
          data: buffer
        });
      };
      const deflatedReady = buffer => {
        this.waitDrain = this.socket.send(buffer);
      };
      this._compression = new _compression.default(inflatedReady, deflatedReady);
    }

    // override data handler, decompress incoming data
    this.socket.ondata = evt => {
      if (!this.compressed) {
        return;
      }
      if (this._compressionWorker) {
        this._compressionWorker.postMessage(createMessage(MESSAGE_INFLATE, evt.data), [evt.data]);
      } else {
        this._compression.inflate(evt.data);
      }
    };
  }

  /**
   * Undoes any changes related to compression. This only be called when closing the connection
   */
  _disableCompression() {
    if (!this.compressed) {
      return;
    }
    this.compressed = false;
    this.socket.ondata = this._socketOnData;
    this._socketOnData = null;
    if (this._compressionWorker) {
      // terminate the worker
      this._compressionWorker.terminate();
      this._compressionWorker = null;
    }
  }

  /**
   * Outgoing payload needs to be compressed and sent to socket
   *
   * @param {ArrayBuffer} buffer Outgoing uncompressed arraybuffer
   */
  _sendCompressed(buffer) {
    // deflate
    if (this._compressionWorker) {
      this._compressionWorker.postMessage(createMessage(MESSAGE_DEFLATE, buffer), [buffer]);
    } else {
      this._compression.deflate(buffer);
    }
  }
  _resetSocketTimeout(byteLength) {
    //console.log(`_resetSocketTimeout called. byteLength: ${byteLength}`);
    clearTimeout(this._socketTimeoutTimer);
    const timeout = this.timeoutSocketLowerBound + Math.floor((byteLength || 4096) * this.timeoutSocketMultiplier); // max packet size is 4096 bytes
    this._socketTimeoutTimer = setTimeout(() => this._onError(new Error(' Socket timed out! [STO_01]')), timeout);
  }
}
exports.default = Imap;
const createMessage = (message, buffer) => ({
  message,
  buffer
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJNRVNTQUdFX0lOSVRJQUxJWkVfV09SS0VSIiwiTUVTU0FHRV9JTkZMQVRFIiwiTUVTU0FHRV9JTkZMQVRFRF9EQVRBX1JFQURZIiwiTUVTU0FHRV9ERUZMQVRFIiwiTUVTU0FHRV9ERUZMQVRFRF9EQVRBX1JFQURZIiwiRU9MIiwiTElORV9GRUVEIiwiQ0FSUklBR0VfUkVUVVJOIiwiTEVGVF9DVVJMWV9CUkFDS0VUIiwiUklHSFRfQ1VSTFlfQlJBQ0tFVCIsIkFTQ0lJX1BMVVMiLCJCVUZGRVJfU1RBVEVfTElURVJBTCIsIkJVRkZFUl9TVEFURV9QT1NTSUJMWV9MSVRFUkFMX0xFTkdUSF8xIiwiQlVGRkVSX1NUQVRFX1BPU1NJQkxZX0xJVEVSQUxfTEVOR1RIXzIiLCJCVUZGRVJfU1RBVEVfREVGQVVMVCIsIlRJTUVPVVRfRU5URVJfSURMRSIsIlRJTUVPVVRfU09DS0VUX0xPV0VSX0JPVU5EIiwiVElNRU9VVF9TT0NLRVRfTVVMVElQTElFUiIsIkltYXAiLCJjb25zdHJ1Y3RvciIsImhvc3QiLCJwb3J0Iiwib3B0aW9ucyIsInRpbWVvdXRFbnRlcklkbGUiLCJ0aW1lb3V0U29ja2V0TG93ZXJCb3VuZCIsInRpbWVvdXRTb2NrZXRNdWx0aXBsaWVyIiwidXNlU2VjdXJlVHJhbnNwb3J0Iiwic2VjdXJlTW9kZSIsIl9jb25uZWN0aW9uUmVhZHkiLCJfZ2xvYmFsQWNjZXB0VW50YWdnZWQiLCJfY2xpZW50UXVldWUiLCJfY2FuU2VuZCIsIl90YWdDb3VudGVyIiwiX2N1cnJlbnRDb21tYW5kIiwiX2lkbGVUaW1lciIsIl9zb2NrZXRUaW1lb3V0VGltZXIiLCJjb21wcmVzc2VkIiwiX2luY29taW5nQnVmZmVycyIsIl9idWZmZXJTdGF0ZSIsIl9saXRlcmFsUmVtYWluaW5nIiwib25jZXJ0Iiwib25lcnJvciIsIm9ucmVhZHkiLCJvbmlkbGUiLCJjb25uZWN0IiwiU29ja2V0IiwiVENQU29ja2V0IiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJzb2NrZXQiLCJvcGVuIiwiYmluYXJ5VHlwZSIsImNhIiwiY2VydCIsIkUiLCJvbmNsb3NlIiwiX29uRXJyb3IiLCJFcnJvciIsIm9uZGF0YSIsImV2dCIsIl9vbkRhdGEiLCJlcnIiLCJlIiwiZGF0YSIsIm1lc3NhZ2UiLCJvbm9wZW4iLCJjbG9zZSIsImVycm9yIiwidGVhckRvd24iLCJmb3JFYWNoIiwiY21kIiwiY2FsbGJhY2siLCJjbGVhclRpbWVvdXQiLCJfZGlzYWJsZUNvbXByZXNzaW9uIiwicmVhZHlTdGF0ZSIsImxvZ291dCIsInRoZW4iLCJjYXRjaCIsImVucXVldWVDb21tYW5kIiwidXBncmFkZSIsInVwZ3JhZGVUb1NlY3VyZSIsInJlcXVlc3QiLCJhY2NlcHRVbnRhZ2dlZCIsImNvbW1hbmQiLCJjb25jYXQiLCJtYXAiLCJ1bnRhZ2dlZCIsInRvU3RyaW5nIiwidG9VcHBlckNhc2UiLCJ0cmltIiwidGFnIiwicGF5bG9hZCIsImxlbmd0aCIsInVuZGVmaW5lZCIsInJlc3BvbnNlIiwiaXNFcnJvciIsInByb3BPciIsImluY2x1ZGVzIiwiaHVtYW5SZWFkYWJsZSIsImNvZGUiLCJPYmplY3QiLCJrZXlzIiwia2V5IiwiaW5kZXgiLCJjdHgiLCJpbmRleE9mIiwic3BsaWNlIiwicHVzaCIsIl9zZW5kUmVxdWVzdCIsImdldFByZXZpb3VzbHlRdWV1ZWQiLCJjb21tYW5kcyIsInN0YXJ0SW5kZXgiLCJpIiwiaXNNYXRjaCIsInNlbmQiLCJzdHIiLCJidWZmZXIiLCJ0b1R5cGVkQXJyYXkiLCJfcmVzZXRTb2NrZXRUaW1lb3V0IiwiYnl0ZUxlbmd0aCIsIl9zZW5kQ29tcHJlc3NlZCIsInNldEhhbmRsZXIiLCJsb2dnZXIiLCJVaW50OEFycmF5IiwiX3BhcnNlSW5jb21pbmdDb21tYW5kcyIsIl9pdGVyYXRlSW5jb21pbmdCdWZmZXIiLCJidWYiLCJkaWZmIiwiTWF0aCIsIm1pbiIsIk51bWJlciIsImZyb21UeXBlZEFycmF5IiwiX2xlbmd0aEJ1ZmZlciIsInN0YXJ0IiwibGF0ZXN0Iiwic3ViYXJyYXkiLCJwcmV2QnVmIiwic2V0IiwibGVmdElkeCIsImxlZnRPZkxlZnRDdXJseSIsIkxGaWR4IiwiY29tbWFuZExlbmd0aCIsInJlZHVjZSIsInByZXYiLCJjdXJyIiwidWludDhBcnJheSIsInNoaWZ0IiwicmVtYWluaW5nTGVuZ3RoIiwiZXhjZXNzTGVuZ3RoIiwiX2NsZWFySWRsZSIsImNodW5rIiwiZXJyb3JSZXNwb25zZUV4cGVjdHNFbXB0eUxpbmUiLCJ2YWx1ZUFzU3RyaW5nIiwicGFyc2VyIiwiZGVidWciLCJjb21waWxlciIsIl9wcm9jZXNzUmVzcG9uc2UiLCJfaGFuZGxlUmVzcG9uc2UiLCJfZW50ZXJJZGxlIiwiX3Jlc3RhcnRRdWV1ZSIsInByZWNoZWNrIiwiY29udGV4dCIsIndhaXREcmFpbiIsInNldFRpbWVvdXQiLCJhdHRyaWJ1dGVzIiwidGVzdCIsInR5cGUiLCJuciIsInZhbHVlIiwic2VjdGlvbiIsIm9wdGlvbiIsIkFycmF5IiwiaXNBcnJheSIsInRvTG93ZXJDYXNlIiwicHJvdG90eXBlIiwiY2FsbCIsIm1hdGNoIiwiZW5hYmxlQ29tcHJlc3Npb24iLCJfc29ja2V0T25EYXRhIiwid2luZG93IiwiV29ya2VyIiwiX2NvbXByZXNzaW9uV29ya2VyIiwiVVJMIiwiY3JlYXRlT2JqZWN0VVJMIiwiQmxvYiIsIkNvbXByZXNzaW9uQmxvYiIsIm9ubWVzc2FnZSIsInBvc3RNZXNzYWdlIiwiY3JlYXRlTWVzc2FnZSIsImluZmxhdGVkUmVhZHkiLCJkZWZsYXRlZFJlYWR5IiwiX2NvbXByZXNzaW9uIiwiQ29tcHJlc3Npb24iLCJpbmZsYXRlIiwidGVybWluYXRlIiwiZGVmbGF0ZSIsImNvbnNvbGUiLCJsb2ciLCJ0aW1lb3V0IiwiZmxvb3IiXSwic291cmNlcyI6WyIuLi9zcmMvaW1hcC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBwcm9wT3IgfSBmcm9tICdyYW1kYSdcbmltcG9ydCBUQ1BTb2NrZXQgZnJvbSAnZW1haWxqcy10Y3Atc29ja2V0J1xuaW1wb3J0IHsgdG9UeXBlZEFycmF5LCBmcm9tVHlwZWRBcnJheSB9IGZyb20gJy4vY29tbW9uJ1xuaW1wb3J0IHsgcGFyc2VyLCBjb21waWxlciB9IGZyb20gJ2VtYWlsanMtaW1hcC1oYW5kbGVyJ1xuaW1wb3J0IENvbXByZXNzaW9uIGZyb20gJy4vY29tcHJlc3Npb24nXG5pbXBvcnQgQ29tcHJlc3Npb25CbG9iIGZyb20gJy4uL3Jlcy9jb21wcmVzc2lvbi53b3JrZXIuYmxvYidcblxuLy9cbi8vIGNvbnN0YW50cyB1c2VkIGZvciBjb21tdW5pY2F0aW9uIHdpdGggdGhlIHdvcmtlclxuLy9cbmNvbnN0IE1FU1NBR0VfSU5JVElBTElaRV9XT1JLRVIgPSAnc3RhcnQnXG5jb25zdCBNRVNTQUdFX0lORkxBVEUgPSAnaW5mbGF0ZSdcbmNvbnN0IE1FU1NBR0VfSU5GTEFURURfREFUQV9SRUFEWSA9ICdpbmZsYXRlZF9yZWFkeSdcbmNvbnN0IE1FU1NBR0VfREVGTEFURSA9ICdkZWZsYXRlJ1xuY29uc3QgTUVTU0FHRV9ERUZMQVRFRF9EQVRBX1JFQURZID0gJ2RlZmxhdGVkX3JlYWR5J1xuXG5jb25zdCBFT0wgPSAnXFxyXFxuJ1xuY29uc3QgTElORV9GRUVEID0gMTBcbmNvbnN0IENBUlJJQUdFX1JFVFVSTiA9IDEzXG5jb25zdCBMRUZUX0NVUkxZX0JSQUNLRVQgPSAxMjNcbmNvbnN0IFJJR0hUX0NVUkxZX0JSQUNLRVQgPSAxMjVcblxuY29uc3QgQVNDSUlfUExVUyA9IDQzXG5cbi8vIFN0YXRlIHRyYWNraW5nIHdoZW4gY29uc3RydWN0aW5nIGFuIElNQVAgY29tbWFuZCBmcm9tIGJ1ZmZlcnMuXG5jb25zdCBCVUZGRVJfU1RBVEVfTElURVJBTCA9ICdsaXRlcmFsJ1xuY29uc3QgQlVGRkVSX1NUQVRFX1BPU1NJQkxZX0xJVEVSQUxfTEVOR1RIXzEgPSAnbGl0ZXJhbF9sZW5ndGhfMSdcbmNvbnN0IEJVRkZFUl9TVEFURV9QT1NTSUJMWV9MSVRFUkFMX0xFTkdUSF8yID0gJ2xpdGVyYWxfbGVuZ3RoXzInXG5jb25zdCBCVUZGRVJfU1RBVEVfREVGQVVMVCA9ICdkZWZhdWx0J1xuXG4vKipcbiAqIEhvdyBtdWNoIHRpbWUgdG8gd2FpdCBzaW5jZSB0aGUgbGFzdCByZXNwb25zZSB1bnRpbCB0aGUgY29ubmVjdGlvbiBpcyBjb25zaWRlcmVkIGlkbGluZ1xuICovXG5jb25zdCBUSU1FT1VUX0VOVEVSX0lETEUgPSAxMDAwXG5cbi8qKlxuICogTG93ZXIgQm91bmQgZm9yIHNvY2tldCB0aW1lb3V0IHRvIHdhaXQgc2luY2UgdGhlIGxhc3QgZGF0YSB3YXMgd3JpdHRlbiB0byBhIHNvY2tldFxuICovXG5jb25zdCBUSU1FT1VUX1NPQ0tFVF9MT1dFUl9CT1VORCA9IDEwMDAwXG5cbi8qKlxuICogTXVsdGlwbGllciBmb3Igc29ja2V0IHRpbWVvdXQ6XG4gKlxuICogV2UgYXNzdW1lIGF0IGxlYXN0IGEgR1BSUyBjb25uZWN0aW9uIHdpdGggMTE1IGtiL3MgPSAxNCwzNzUga0IvcyB0b3BzLCBzbyAxMCBLQi9zIHRvIGJlIG9uXG4gKiB0aGUgc2FmZSBzaWRlLiBXZSBjYW4gdGltZW91dCBhZnRlciBhIGxvd2VyIGJvdW5kIG9mIDEwcyArIChuIEtCIC8gMTAgS0IvcykuIEEgMSBNQiBtZXNzYWdlXG4gKiB1cGxvYWQgd291bGQgYmUgMTEwIHNlY29uZHMgdG8gd2FpdCBmb3IgdGhlIHRpbWVvdXQuIDEwIEtCL3MgPT09IDAuMSBzL0JcbiAqL1xuY29uc3QgVElNRU9VVF9TT0NLRVRfTVVMVElQTElFUiA9IDAuMVxuXG4vKipcbiAqIENyZWF0ZXMgYSBjb25uZWN0aW9uIG9iamVjdCB0byBhbiBJTUFQIHNlcnZlci4gQ2FsbCBgY29ubmVjdGAgbWV0aG9kIHRvIGluaXRpdGF0ZVxuICogdGhlIGFjdHVhbCBjb25uZWN0aW9uLCB0aGUgY29uc3RydWN0b3Igb25seSBkZWZpbmVzIHRoZSBwcm9wZXJ0aWVzIGJ1dCBkb2VzIG5vdCBhY3R1YWxseSBjb25uZWN0LlxuICpcbiAqIEBjb25zdHJ1Y3RvclxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBbaG9zdD0nbG9jYWxob3N0J10gSG9zdG5hbWUgdG8gY29uZW5jdCB0b1xuICogQHBhcmFtIHtOdW1iZXJ9IFtwb3J0PTE0M10gUG9ydCBudW1iZXIgdG8gY29ubmVjdCB0b1xuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXSBPcHRpb25hbCBvcHRpb25zIG9iamVjdFxuICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy51c2VTZWN1cmVUcmFuc3BvcnRdIFNldCB0byB0cnVlLCB0byB1c2UgZW5jcnlwdGVkIGNvbm5lY3Rpb25cbiAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5jb21wcmVzc2lvbldvcmtlclBhdGhdIG9mZmxvYWRzIGRlLS9jb21wcmVzc2lvbiBjb21wdXRhdGlvbiB0byBhIHdlYiB3b3JrZXIsIHRoaXMgaXMgdGhlIHBhdGggdG8gdGhlIGJyb3dzZXJpZmllZCBlbWFpbGpzLWNvbXByZXNzb3Itd29ya2VyLmpzXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEltYXAge1xuICBjb25zdHJ1Y3RvciAoaG9zdCwgcG9ydCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgdGhpcy50aW1lb3V0RW50ZXJJZGxlID0gVElNRU9VVF9FTlRFUl9JRExFXG4gICAgdGhpcy50aW1lb3V0U29ja2V0TG93ZXJCb3VuZCA9IFRJTUVPVVRfU09DS0VUX0xPV0VSX0JPVU5EXG4gICAgdGhpcy50aW1lb3V0U29ja2V0TXVsdGlwbGllciA9IFRJTUVPVVRfU09DS0VUX01VTFRJUExJRVJcblxuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnNcblxuICAgIHRoaXMucG9ydCA9IHBvcnQgfHwgKHRoaXMub3B0aW9ucy51c2VTZWN1cmVUcmFuc3BvcnQgPyA5OTMgOiAxNDMpXG4gICAgdGhpcy5ob3N0ID0gaG9zdCB8fCAnbG9jYWxob3N0J1xuXG4gICAgLy8gVXNlIGEgVExTIGNvbm5lY3Rpb24uIFBvcnQgOTkzIGFsc28gZm9yY2VzIFRMUy5cbiAgICB0aGlzLm9wdGlvbnMudXNlU2VjdXJlVHJhbnNwb3J0ID0gJ3VzZVNlY3VyZVRyYW5zcG9ydCcgaW4gdGhpcy5vcHRpb25zID8gISF0aGlzLm9wdGlvbnMudXNlU2VjdXJlVHJhbnNwb3J0IDogdGhpcy5wb3J0ID09PSA5OTNcblxuICAgIHRoaXMuc2VjdXJlTW9kZSA9ICEhdGhpcy5vcHRpb25zLnVzZVNlY3VyZVRyYW5zcG9ydCAvLyBEb2VzIHRoZSBjb25uZWN0aW9uIHVzZSBTU0wvVExTXG5cbiAgICB0aGlzLl9jb25uZWN0aW9uUmVhZHkgPSBmYWxzZSAvLyBJcyB0aGUgY29uZWN0aW9uIGVzdGFibGlzaGVkIGFuZCBncmVldGluZyBpcyByZWNlaXZlZCBmcm9tIHRoZSBzZXJ2ZXJcblxuICAgIHRoaXMuX2dsb2JhbEFjY2VwdFVudGFnZ2VkID0ge30gLy8gR2xvYmFsIGhhbmRsZXJzIGZvciB1bnJlbGF0ZWQgcmVzcG9uc2VzIChFWFBVTkdFLCBFWElTVFMgZXRjLilcblxuICAgIHRoaXMuX2NsaWVudFF1ZXVlID0gW10gLy8gUXVldWUgb2Ygb3V0Z29pbmcgY29tbWFuZHNcbiAgICB0aGlzLl9jYW5TZW5kID0gZmFsc2UgLy8gSXMgaXQgT0sgdG8gc2VuZCBzb21ldGhpbmcgdG8gdGhlIHNlcnZlclxuICAgIHRoaXMuX3RhZ0NvdW50ZXIgPSAwIC8vIENvdW50ZXIgdG8gYWxsb3cgdW5pcXVldWUgaW1hcCB0YWdzXG4gICAgdGhpcy5fY3VycmVudENvbW1hbmQgPSBmYWxzZSAvLyBDdXJyZW50IGNvbW1hbmQgdGhhdCBpcyB3YWl0aW5nIGZvciByZXNwb25zZSBmcm9tIHRoZSBzZXJ2ZXJcblxuICAgIHRoaXMuX2lkbGVUaW1lciA9IGZhbHNlIC8vIFRpbWVyIHdhaXRpbmcgdG8gZW50ZXIgaWRsZVxuICAgIHRoaXMuX3NvY2tldFRpbWVvdXRUaW1lciA9IGZhbHNlIC8vIFRpbWVyIHdhaXRpbmcgdG8gZGVjbGFyZSB0aGUgc29ja2V0IGRlYWQgc3RhcnRpbmcgZnJvbSB0aGUgbGFzdCB3cml0ZVxuXG4gICAgdGhpcy5jb21wcmVzc2VkID0gZmFsc2UgLy8gSXMgdGhlIGNvbm5lY3Rpb24gY29tcHJlc3NlZCBhbmQgbmVlZHMgaW5mbGF0aW5nL2RlZmxhdGluZ1xuXG4gICAgLy9cbiAgICAvLyBIRUxQRVJTXG4gICAgLy9cblxuICAgIC8vIEFzIHRoZSBzZXJ2ZXIgc2VuZHMgZGF0YSBpbiBjaHVua3MsIGl0IG5lZWRzIHRvIGJlIHNwbGl0IGludG8gc2VwYXJhdGUgbGluZXMuIEhlbHBzIHBhcnNpbmcgdGhlIGlucHV0LlxuICAgIHRoaXMuX2luY29taW5nQnVmZmVycyA9IFtdXG4gICAgdGhpcy5fYnVmZmVyU3RhdGUgPSBCVUZGRVJfU1RBVEVfREVGQVVMVFxuICAgIHRoaXMuX2xpdGVyYWxSZW1haW5pbmcgPSAwXG5cbiAgICAvL1xuICAgIC8vIEV2ZW50IHBsYWNlaG9sZGVycywgbWF5IGJlIG92ZXJyaWRlbiB3aXRoIGNhbGxiYWNrIGZ1bmN0aW9uc1xuICAgIC8vXG4gICAgdGhpcy5vbmNlcnQgPSBudWxsXG4gICAgdGhpcy5vbmVycm9yID0gbnVsbCAvLyBJcnJlY292ZXJhYmxlIGVycm9yIG9jY3VycmVkLiBDb25uZWN0aW9uIHRvIHRoZSBzZXJ2ZXIgd2lsbCBiZSBjbG9zZWQgYXV0b21hdGljYWxseS5cbiAgICB0aGlzLm9ucmVhZHkgPSBudWxsIC8vIFRoZSBjb25uZWN0aW9uIHRvIHRoZSBzZXJ2ZXIgaGFzIGJlZW4gZXN0YWJsaXNoZWQgYW5kIGdyZWV0aW5nIGlzIHJlY2VpdmVkXG4gICAgdGhpcy5vbmlkbGUgPSBudWxsIC8vIFRoZXJlIGFyZSBubyBtb3JlIGNvbW1hbmRzIHRvIHByb2Nlc3NcbiAgfVxuXG4gIC8vIFBVQkxJQyBNRVRIT0RTXG5cbiAgLyoqXG4gICAqIEluaXRpYXRlIGEgY29ubmVjdGlvbiB0byB0aGUgc2VydmVyLiBXYWl0IGZvciBvbnJlYWR5IGV2ZW50XG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBTb2NrZXRcbiAgICogICAgIFRFU1RJTkcgT05MWSEgVGhlIFRDUFNvY2tldCBoYXMgYSBwcmV0dHkgbm9uc2Vuc2ljYWwgY29udmVuaWVuY2UgY29uc3RydWN0b3IsXG4gICAqICAgICB3aGljaCBtYWtlcyBpdCBoYXJkIHRvIG1vY2suIEZvciBkZXBlbmRlbmN5LWluamVjdGlvbiBwdXJwb3Nlcywgd2UgdXNlIHRoZVxuICAgKiAgICAgU29ja2V0IHBhcmFtZXRlciB0byBwYXNzIGluIGEgbW9jayBTb2NrZXQgaW1wbGVtZW50YXRpb24uIFNob3VsZCBiZSBsZWZ0IGJsYW5rXG4gICAqICAgICBpbiBwcm9kdWN0aW9uIHVzZSFcbiAgICogQHJldHVybnMge1Byb21pc2V9IFJlc29sdmVzIHdoZW4gc29ja2V0IGlzIG9wZW5lZFxuICAgKi9cbiAgY29ubmVjdCAoU29ja2V0ID0gVENQU29ja2V0KSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHRoaXMuc29ja2V0ID0gU29ja2V0Lm9wZW4odGhpcy5ob3N0LCB0aGlzLnBvcnQsIHtcbiAgICAgICAgYmluYXJ5VHlwZTogJ2FycmF5YnVmZmVyJyxcbiAgICAgICAgdXNlU2VjdXJlVHJhbnNwb3J0OiB0aGlzLnNlY3VyZU1vZGUsXG4gICAgICAgIGNhOiB0aGlzLm9wdGlvbnMuY2FcbiAgICAgIH0pXG5cbiAgICAgIC8vIGFsbG93cyBjZXJ0aWZpY2F0ZSBoYW5kbGluZyBmb3IgcGxhdGZvcm0gdy9vIG5hdGl2ZSB0bHMgc3VwcG9ydFxuICAgICAgLy8gb25jZXJ0IGlzIG5vbiBzdGFuZGFyZCBzbyBzZXR0aW5nIGl0IG1pZ2h0IHRocm93IGlmIHRoZSBzb2NrZXQgb2JqZWN0IGlzIGltbXV0YWJsZVxuICAgICAgdHJ5IHtcbiAgICAgICAgdGhpcy5zb2NrZXQub25jZXJ0ID0gKGNlcnQpID0+IHsgdGhpcy5vbmNlcnQgJiYgdGhpcy5vbmNlcnQoY2VydCkgfVxuICAgICAgfSBjYXRjaCAoRSkgeyB9XG5cbiAgICAgIC8vIENvbm5lY3Rpb24gY2xvc2luZyB1bmV4cGVjdGVkIGlzIGFuIGVycm9yXG4gICAgICB0aGlzLnNvY2tldC5vbmNsb3NlID0gKCkgPT4gdGhpcy5fb25FcnJvcihuZXcgRXJyb3IoJ1NvY2tldCBjbG9zZWQgdW5leHBlY3RlZGx5IScpKVxuICAgICAgdGhpcy5zb2NrZXQub25kYXRhID0gKGV2dCkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHRoaXMuX29uRGF0YShldnQpXG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgIHRoaXMuX29uRXJyb3IoZXJyKVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIGlmIGFuIGVycm9yIGhhcHBlbnMgZHVyaW5nIGNyZWF0ZSB0aW1lLCByZWplY3QgdGhlIHByb21pc2VcbiAgICAgIHRoaXMuc29ja2V0Lm9uZXJyb3IgPSAoZSkgPT4ge1xuICAgICAgICByZWplY3QobmV3IEVycm9yKCdDb3VsZCBub3Qgb3BlbiBzb2NrZXQ6ICcgKyBlLmRhdGEubWVzc2FnZSkpXG4gICAgICB9XG5cbiAgICAgIHRoaXMuc29ja2V0Lm9ub3BlbiA9ICgpID0+IHtcbiAgICAgICAgLy8gdXNlIHByb3BlciBcImlycmVjb3ZlcmFibGUgZXJyb3IsIHRlYXIgZG93biBldmVyeXRoaW5nXCItaGFuZGxlciBvbmx5IGFmdGVyIHNvY2tldCBpcyBvcGVuXG4gICAgICAgIHRoaXMuc29ja2V0Lm9uZXJyb3IgPSAoZSkgPT4gdGhpcy5fb25FcnJvcihlKVxuICAgICAgICByZXNvbHZlKClcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgLyoqXG4gICAqIENsb3NlcyB0aGUgY29ubmVjdGlvbiB0byB0aGUgc2VydmVyXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBSZXNvbHZlcyB3aGVuIHRoZSBzb2NrZXQgaXMgY2xvc2VkXG4gICAqL1xuICBjbG9zZSAoZXJyb3IpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgIHZhciB0ZWFyRG93biA9ICgpID0+IHtcbiAgICAgICAgLy8gZnVsZmlsbCBwZW5kaW5nIHByb21pc2VzXG4gICAgICAgIHRoaXMuX2NsaWVudFF1ZXVlLmZvckVhY2goY21kID0+IGNtZC5jYWxsYmFjayhlcnJvcikpXG4gICAgICAgIGlmICh0aGlzLl9jdXJyZW50Q29tbWFuZCkge1xuICAgICAgICAgIHRoaXMuX2N1cnJlbnRDb21tYW5kLmNhbGxiYWNrKGVycm9yKVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fY2xpZW50UXVldWUgPSBbXVxuICAgICAgICB0aGlzLl9jdXJyZW50Q29tbWFuZCA9IGZhbHNlXG5cbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX2lkbGVUaW1lcilcbiAgICAgICAgdGhpcy5faWRsZVRpbWVyID0gbnVsbFxuXG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLl9zb2NrZXRUaW1lb3V0VGltZXIpXG4gICAgICAgIHRoaXMuX3NvY2tldFRpbWVvdXRUaW1lciA9IG51bGxcblxuICAgICAgICBpZiAodGhpcy5zb2NrZXQpIHtcbiAgICAgICAgICAvLyByZW1vdmUgYWxsIGxpc3RlbmVyc1xuICAgICAgICAgIHRoaXMuc29ja2V0Lm9ub3BlbiA9IG51bGxcbiAgICAgICAgICB0aGlzLnNvY2tldC5vbmNsb3NlID0gbnVsbFxuICAgICAgICAgIHRoaXMuc29ja2V0Lm9uZGF0YSA9IG51bGxcbiAgICAgICAgICB0aGlzLnNvY2tldC5vbmVycm9yID0gbnVsbFxuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICB0aGlzLnNvY2tldC5vbmNlcnQgPSBudWxsXG4gICAgICAgICAgfSBjYXRjaCAoRSkgeyB9XG5cbiAgICAgICAgICB0aGlzLnNvY2tldCA9IG51bGxcbiAgICAgICAgfVxuXG4gICAgICAgIHJlc29sdmUoKVxuICAgICAgfVxuXG4gICAgICB0aGlzLl9kaXNhYmxlQ29tcHJlc3Npb24oKVxuXG4gICAgICBpZiAoIXRoaXMuc29ja2V0IHx8IHRoaXMuc29ja2V0LnJlYWR5U3RhdGUgIT09ICdvcGVuJykge1xuICAgICAgICByZXR1cm4gdGVhckRvd24oKVxuICAgICAgfVxuXG4gICAgICB0aGlzLnNvY2tldC5vbmNsb3NlID0gdGhpcy5zb2NrZXQub25lcnJvciA9IHRlYXJEb3duIC8vIHdlIGRvbid0IHJlYWxseSBjYXJlIGFib3V0IHRoZSBlcnJvciBoZXJlXG4gICAgICB0aGlzLnNvY2tldC5jbG9zZSgpXG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBTZW5kIExPR09VVCB0byB0aGUgc2VydmVyLlxuICAgKlxuICAgKiBVc2UgaXMgZGlzY291cmFnZWQhXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfSBSZXNvbHZlcyB3aGVuIGNvbm5lY3Rpb24gaXMgY2xvc2VkIGJ5IHNlcnZlci5cbiAgICovXG4gIGxvZ291dCAoKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHRoaXMuc29ja2V0Lm9uY2xvc2UgPSB0aGlzLnNvY2tldC5vbmVycm9yID0gKCkgPT4ge1xuICAgICAgICB0aGlzLmNsb3NlKCdDbGllbnQgbG9nZ2luZyBvdXQnKS50aGVuKHJlc29sdmUpLmNhdGNoKHJlamVjdClcbiAgICAgIH1cblxuICAgICAgdGhpcy5lbnF1ZXVlQ29tbWFuZCgnTE9HT1VUJylcbiAgICB9KVxuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpYXRlcyBUTFMgaGFuZHNoYWtlXG4gICAqL1xuICB1cGdyYWRlICgpIHtcbiAgICB0aGlzLnNlY3VyZU1vZGUgPSB0cnVlXG4gICAgdGhpcy5zb2NrZXQudXBncmFkZVRvU2VjdXJlKClcbiAgfVxuXG4gIC8qKlxuICAgKiBTY2hlZHVsZXMgYSBjb21tYW5kIHRvIGJlIHNlbnQgdG8gdGhlIHNlcnZlci5cbiAgICogU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9lbWFpbGpzL2VtYWlsanMtaW1hcC1oYW5kbGVyIGZvciByZXF1ZXN0IHN0cnVjdHVyZS5cbiAgICogRG8gbm90IHByb3ZpZGUgYSB0YWcgcHJvcGVydHksIGl0IHdpbGwgYmUgc2V0IGJ5IHRoZSBxdWV1ZSBtYW5hZ2VyLlxuICAgKlxuICAgKiBUbyBjYXRjaCB1bnRhZ2dlZCByZXNwb25zZXMgdXNlIGFjY2VwdFVudGFnZ2VkIHByb3BlcnR5LiBGb3IgZXhhbXBsZSwgaWZcbiAgICogdGhlIHZhbHVlIGZvciBpdCBpcyAnRkVUQ0gnIHRoZW4gdGhlIHJlcG9uc2UgaW5jbHVkZXMgJ3BheWxvYWQuRkVUQ0gnIHByb3BlcnR5XG4gICAqIHRoYXQgaXMgYW4gYXJyYXkgaW5jbHVkaW5nIGFsbCBsaXN0ZWQgKiBGRVRDSCByZXNwb25zZXMuXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSByZXF1ZXN0IFN0cnVjdHVyZWQgcmVxdWVzdCBvYmplY3RcbiAgICogQHBhcmFtIHtBcnJheX0gYWNjZXB0VW50YWdnZWQgYSBsaXN0IG9mIHVudGFnZ2VkIHJlc3BvbnNlcyB0aGF0IHdpbGwgYmUgaW5jbHVkZWQgaW4gJ3BheWxvYWQnIHByb3BlcnR5XG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc10gT3B0aW9uYWwgZGF0YSBmb3IgdGhlIGNvbW1hbmQgcGF5bG9hZFxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUHJvbWlzZSB0aGF0IHJlc29sdmVzIHdoZW4gdGhlIGNvcnJlc3BvbmRpbmcgcmVzcG9uc2Ugd2FzIHJlY2VpdmVkXG4gICAqL1xuICBlbnF1ZXVlQ29tbWFuZCAocmVxdWVzdCwgYWNjZXB0VW50YWdnZWQsIG9wdGlvbnMpIHtcbiAgICBpZiAodHlwZW9mIHJlcXVlc3QgPT09ICdzdHJpbmcnKSB7XG4gICAgICByZXF1ZXN0ID0ge1xuICAgICAgICBjb21tYW5kOiByZXF1ZXN0XG4gICAgICB9XG4gICAgfVxuXG4gICAgYWNjZXB0VW50YWdnZWQgPSBbXS5jb25jYXQoYWNjZXB0VW50YWdnZWQgfHwgW10pLm1hcCgodW50YWdnZWQpID0+ICh1bnRhZ2dlZCB8fCAnJykudG9TdHJpbmcoKS50b1VwcGVyQ2FzZSgpLnRyaW0oKSlcblxuICAgIHZhciB0YWcgPSAnVycgKyAoKyt0aGlzLl90YWdDb3VudGVyKVxuICAgIHJlcXVlc3QudGFnID0gdGFnXG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgdmFyIGRhdGEgPSB7XG4gICAgICAgIHRhZzogdGFnLFxuICAgICAgICByZXF1ZXN0OiByZXF1ZXN0LFxuICAgICAgICBwYXlsb2FkOiBhY2NlcHRVbnRhZ2dlZC5sZW5ndGggPyB7fSA6IHVuZGVmaW5lZCxcbiAgICAgICAgY2FsbGJhY2s6IChyZXNwb25zZSkgPT4ge1xuICAgICAgICAgIGlmICh0aGlzLmlzRXJyb3IocmVzcG9uc2UpKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVqZWN0KHJlc3BvbnNlKVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBjb21tYW5kID0gcHJvcE9yKCcnLCAnY29tbWFuZCcsIHJlc3BvbnNlKS50b1VwcGVyQ2FzZSgpLnRyaW0oKVxuICAgICAgICAgICAgaWYgKFsnTk8nLCAnQkFEJ10uaW5jbHVkZXMoY29tbWFuZCkpIHtcbiAgICAgICAgICAgICAgdmFyIGVycm9yID0gbmV3IEVycm9yKHJlc3BvbnNlLmh1bWFuUmVhZGFibGUgfHwgJ0Vycm9yJylcbiAgICAgICAgICAgICAgZXJyb3IuY29tbWFuZCA9IGNvbW1hbmRcbiAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLmNvZGUpIHtcbiAgICAgICAgICAgICAgICBlcnJvci5jb2RlID0gcmVzcG9uc2UuY29kZVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJldHVybiByZWplY3QoZXJyb3IpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmVzb2x2ZShyZXNwb25zZSlcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBhcHBseSBhbnkgYWRkaXRpb25hbCBvcHRpb25zIHRvIHRoZSBjb21tYW5kXG4gICAgICBPYmplY3Qua2V5cyhvcHRpb25zIHx8IHt9KS5mb3JFYWNoKChrZXkpID0+IHsgZGF0YVtrZXldID0gb3B0aW9uc1trZXldIH0pXG5cbiAgICAgIGFjY2VwdFVudGFnZ2VkLmZvckVhY2goKGNvbW1hbmQpID0+IHsgZGF0YS5wYXlsb2FkW2NvbW1hbmRdID0gW10gfSlcblxuICAgICAgLy8gaWYgd2UncmUgaW4gcHJpb3JpdHkgbW9kZSAoaS5lLiB3ZSByYW4gY29tbWFuZHMgaW4gYSBwcmVjaGVjayksXG4gICAgICAvLyBxdWV1ZSBhbnkgY29tbWFuZHMgQkVGT1JFIHRoZSBjb21tYW5kIHRoYXQgY29udGlhbmVkIHRoZSBwcmVjaGVjayxcbiAgICAgIC8vIG90aGVyd2lzZSBqdXN0IHF1ZXVlIGNvbW1hbmQgYXMgdXN1YWxcbiAgICAgIHZhciBpbmRleCA9IGRhdGEuY3R4ID8gdGhpcy5fY2xpZW50UXVldWUuaW5kZXhPZihkYXRhLmN0eCkgOiAtMVxuICAgICAgaWYgKGluZGV4ID49IDApIHtcbiAgICAgICAgZGF0YS50YWcgKz0gJy5wJ1xuICAgICAgICBkYXRhLnJlcXVlc3QudGFnICs9ICcucCdcbiAgICAgICAgdGhpcy5fY2xpZW50UXVldWUuc3BsaWNlKGluZGV4LCAwLCBkYXRhKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fY2xpZW50UXVldWUucHVzaChkYXRhKVxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5fY2FuU2VuZCkge1xuICAgICAgICB0aGlzLl9zZW5kUmVxdWVzdCgpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0gY29tbWFuZHNcbiAgICogQHBhcmFtIGN0eFxuICAgKiBAcmV0dXJucyB7Kn1cbiAgICovXG4gIGdldFByZXZpb3VzbHlRdWV1ZWQgKGNvbW1hbmRzLCBjdHgpIHtcbiAgICBjb25zdCBzdGFydEluZGV4ID0gdGhpcy5fY2xpZW50UXVldWUuaW5kZXhPZihjdHgpIC0gMVxuXG4gICAgLy8gc2VhcmNoIGJhY2t3YXJkcyBmb3IgdGhlIGNvbW1hbmRzIGFuZCByZXR1cm4gdGhlIGZpcnN0IGZvdW5kXG4gICAgZm9yIChsZXQgaSA9IHN0YXJ0SW5kZXg7IGkgPj0gMDsgaS0tKSB7XG4gICAgICBpZiAoaXNNYXRjaCh0aGlzLl9jbGllbnRRdWV1ZVtpXSkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NsaWVudFF1ZXVlW2ldXG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gYWxzbyBjaGVjayBjdXJyZW50IGNvbW1hbmQgaWYgbm8gU0VMRUNUIGlzIHF1ZXVlZFxuICAgIGlmIChpc01hdGNoKHRoaXMuX2N1cnJlbnRDb21tYW5kKSkge1xuICAgICAgcmV0dXJuIHRoaXMuX2N1cnJlbnRDb21tYW5kXG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlXG5cbiAgICBmdW5jdGlvbiBpc01hdGNoIChkYXRhKSB7XG4gICAgICByZXR1cm4gZGF0YSAmJiBkYXRhLnJlcXVlc3QgJiYgY29tbWFuZHMuaW5kZXhPZihkYXRhLnJlcXVlc3QuY29tbWFuZCkgPj0gMFxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZW5kIGRhdGEgdG8gdGhlIFRDUCBzb2NrZXRcbiAgICogQXJtcyBhIHRpbWVvdXQgd2FpdGluZyBmb3IgYSByZXNwb25zZSBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgUGF5bG9hZFxuICAgKi9cbiAgc2VuZCAoc3RyKSB7XG4gICAgY29uc3QgYnVmZmVyID0gdG9UeXBlZEFycmF5KHN0cikuYnVmZmVyXG4gICAgdGhpcy5fcmVzZXRTb2NrZXRUaW1lb3V0KGJ1ZmZlci5ieXRlTGVuZ3RoKVxuXG4gICAgaWYgKHRoaXMuY29tcHJlc3NlZCkge1xuICAgICAgdGhpcy5fc2VuZENvbXByZXNzZWQoYnVmZmVyKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNvY2tldC5zZW5kKGJ1ZmZlcilcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2V0IGEgZ2xvYmFsIGhhbmRsZXIgZm9yIGFuIHVudGFnZ2VkIHJlc3BvbnNlLiBJZiBjdXJyZW50bHkgcHJvY2Vzc2VkIGNvbW1hbmRcbiAgICogaGFzIG5vdCBsaXN0ZWQgdW50YWdnZWQgY29tbWFuZCBpdCBpcyBmb3J3YXJkZWQgdG8gdGhlIGdsb2JhbCBoYW5kbGVyLiBVc2VmdWxcbiAgICogd2l0aCBFWFBVTkdFLCBFWElTVFMgZXRjLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY29tbWFuZCBVbnRhZ2dlZCBjb21tYW5kIG5hbWVcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgQ2FsbGJhY2sgZnVuY3Rpb24gd2l0aCByZXNwb25zZSBvYmplY3QgYW5kIGNvbnRpbnVlIGNhbGxiYWNrIGZ1bmN0aW9uXG4gICAqL1xuICBzZXRIYW5kbGVyIChjb21tYW5kLCBjYWxsYmFjaykge1xuICAgIHRoaXMuX2dsb2JhbEFjY2VwdFVudGFnZ2VkW2NvbW1hbmQudG9VcHBlckNhc2UoKS50cmltKCldID0gY2FsbGJhY2tcbiAgfVxuXG4gIC8vIElOVEVSTkFMIEVWRU5UU1xuXG4gIC8qKlxuICAgKiBFcnJvciBoYW5kbGVyIGZvciB0aGUgc29ja2V0XG4gICAqXG4gICAqIEBldmVudFxuICAgKiBAcGFyYW0ge0V2ZW50fSBldnQgRXZlbnQgb2JqZWN0LiBTZWUgZXZ0LmRhdGEgZm9yIHRoZSBlcnJvclxuICAgKi9cbiAgX29uRXJyb3IgKGV2dCkge1xuICAgIHZhciBlcnJvclxuICAgIGlmICh0aGlzLmlzRXJyb3IoZXZ0KSkge1xuICAgICAgZXJyb3IgPSBldnRcbiAgICB9IGVsc2UgaWYgKGV2dCAmJiB0aGlzLmlzRXJyb3IoZXZ0LmRhdGEpKSB7XG4gICAgICBlcnJvciA9IGV2dC5kYXRhXG4gICAgfSBlbHNlIHtcbiAgICAgIGVycm9yID0gbmV3IEVycm9yKChldnQgJiYgZXZ0LmRhdGEgJiYgZXZ0LmRhdGEubWVzc2FnZSkgfHwgZXZ0LmRhdGEgfHwgZXZ0IHx8ICdFcnJvcicpXG4gICAgfVxuXG4gICAgdGhpcy5sb2dnZXIuZXJyb3IoZXJyb3IpXG5cbiAgICAvLyBhbHdheXMgY2FsbCBvbmVycm9yIGNhbGxiYWNrLCBubyBtYXR0ZXIgaWYgY2xvc2UoKSBzdWNjZWVkcyBvciBmYWlsc1xuICAgIHRoaXMuY2xvc2UoZXJyb3IpLnRoZW4oKCkgPT4ge1xuICAgICAgdGhpcy5vbmVycm9yICYmIHRoaXMub25lcnJvcihlcnJvcilcbiAgICB9LCAoKSA9PiB7XG4gICAgICB0aGlzLm9uZXJyb3IgJiYgdGhpcy5vbmVycm9yKGVycm9yKVxuICAgIH0pXG4gIH1cblxuICAvKipcbiAgICogSGFuZGxlciBmb3IgaW5jb21pbmcgZGF0YSBmcm9tIHRoZSBzZXJ2ZXIuIFRoZSBkYXRhIGlzIHNlbnQgaW4gYXJiaXRyYXJ5XG4gICAqIGNodW5rcyBhbmQgY2FuJ3QgYmUgdXNlZCBkaXJlY3RseSBzbyB0aGlzIGZ1bmN0aW9uIG1ha2VzIHN1cmUgdGhlIGRhdGFcbiAgICogaXMgc3BsaXQgaW50byBjb21wbGV0ZSBsaW5lcyBiZWZvcmUgdGhlIGRhdGEgaXMgcGFzc2VkIHRvIHRoZSBjb21tYW5kXG4gICAqIGhhbmRsZXJcbiAgICpcbiAgICogQHBhcmFtIHtFdmVudH0gZXZ0XG4gICAqL1xuICBfb25EYXRhIChldnQpIHtcbiAgICAvLyByZXNldCB0aGUgdGltZW91dCBvbiBlYWNoIGRhdGEgcGFja2V0XG4gICAgdGhpcy5fcmVzZXRTb2NrZXRUaW1lb3V0KClcblxuICAgIHRoaXMuX2luY29taW5nQnVmZmVycy5wdXNoKG5ldyBVaW50OEFycmF5KGV2dC5kYXRhKSkgLy8gYXBwZW5kIHRvIHRoZSBpbmNvbWluZyBidWZmZXJcbiAgICB0aGlzLl9wYXJzZUluY29taW5nQ29tbWFuZHModGhpcy5faXRlcmF0ZUluY29taW5nQnVmZmVyKCkpIC8vIENvbnN1bWUgdGhlIGluY29taW5nIGJ1ZmZlclxuICB9XG5cbiAgKiBfaXRlcmF0ZUluY29taW5nQnVmZmVyICgpIHtcbiAgICBsZXQgYnVmID0gdGhpcy5faW5jb21pbmdCdWZmZXJzW3RoaXMuX2luY29taW5nQnVmZmVycy5sZW5ndGggLSAxXSB8fCBbXVxuICAgIGxldCBpID0gMFxuXG4gICAgLy8gbG9vcCBpbnZhcmlhbnQ6XG4gICAgLy8gICB0aGlzLl9pbmNvbWluZ0J1ZmZlcnMgc3RhcnRzIHdpdGggdGhlIGJlZ2lubmluZyBvZiBpbmNvbWluZyBjb21tYW5kLlxuICAgIC8vICAgYnVmIGlzIHNob3J0aGFuZCBmb3IgbGFzdCBlbGVtZW50IG9mIHRoaXMuX2luY29taW5nQnVmZmVycy5cbiAgICAvLyAgIGJ1ZlswLi5pLTFdIGlzIHBhcnQgb2YgaW5jb21pbmcgY29tbWFuZC5cbiAgICB3aGlsZSAoaSA8IGJ1Zi5sZW5ndGgpIHtcbiAgICAgIHN3aXRjaCAodGhpcy5fYnVmZmVyU3RhdGUpIHtcbiAgICAgICAgY2FzZSBCVUZGRVJfU1RBVEVfTElURVJBTDpcbiAgICAgICAgICBjb25zdCBkaWZmID0gTWF0aC5taW4oYnVmLmxlbmd0aCAtIGksIHRoaXMuX2xpdGVyYWxSZW1haW5pbmcpXG4gICAgICAgICAgdGhpcy5fbGl0ZXJhbFJlbWFpbmluZyAtPSBkaWZmXG4gICAgICAgICAgaSArPSBkaWZmXG4gICAgICAgICAgaWYgKHRoaXMuX2xpdGVyYWxSZW1haW5pbmcgPT09IDApIHtcbiAgICAgICAgICAgIHRoaXMuX2J1ZmZlclN0YXRlID0gQlVGRkVSX1NUQVRFX0RFRkFVTFRcbiAgICAgICAgICB9XG4gICAgICAgICAgY29udGludWVcblxuICAgICAgICBjYXNlIEJVRkZFUl9TVEFURV9QT1NTSUJMWV9MSVRFUkFMX0xFTkdUSF8yOlxuICAgICAgICAgIGlmIChpIDwgYnVmLmxlbmd0aCkge1xuICAgICAgICAgICAgaWYgKGJ1ZltpXSA9PT0gQ0FSUklBR0VfUkVUVVJOKSB7XG4gICAgICAgICAgICAgIHRoaXMuX2xpdGVyYWxSZW1haW5pbmcgPSBOdW1iZXIoZnJvbVR5cGVkQXJyYXkodGhpcy5fbGVuZ3RoQnVmZmVyKSkgKyAyIC8vIGZvciBDUkxGXG4gICAgICAgICAgICAgIHRoaXMuX2J1ZmZlclN0YXRlID0gQlVGRkVSX1NUQVRFX0xJVEVSQUxcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRoaXMuX2J1ZmZlclN0YXRlID0gQlVGRkVSX1NUQVRFX0RFRkFVTFRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9sZW5ndGhCdWZmZXJcbiAgICAgICAgICB9XG4gICAgICAgICAgY29udGludWVcblxuICAgICAgICBjYXNlIEJVRkZFUl9TVEFURV9QT1NTSUJMWV9MSVRFUkFMX0xFTkdUSF8xOlxuICAgICAgICAgIGNvbnN0IHN0YXJ0ID0gaVxuICAgICAgICAgIHdoaWxlIChpIDwgYnVmLmxlbmd0aCAmJiBidWZbaV0gPj0gNDggJiYgYnVmW2ldIDw9IDU3KSB7IC8vIGRpZ2l0c1xuICAgICAgICAgICAgaSsrXG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChzdGFydCAhPT0gaSkge1xuICAgICAgICAgICAgY29uc3QgbGF0ZXN0ID0gYnVmLnN1YmFycmF5KHN0YXJ0LCBpKVxuICAgICAgICAgICAgY29uc3QgcHJldkJ1ZiA9IHRoaXMuX2xlbmd0aEJ1ZmZlclxuICAgICAgICAgICAgdGhpcy5fbGVuZ3RoQnVmZmVyID0gbmV3IFVpbnQ4QXJyYXkocHJldkJ1Zi5sZW5ndGggKyBsYXRlc3QubGVuZ3RoKVxuICAgICAgICAgICAgdGhpcy5fbGVuZ3RoQnVmZmVyLnNldChwcmV2QnVmKVxuICAgICAgICAgICAgdGhpcy5fbGVuZ3RoQnVmZmVyLnNldChsYXRlc3QsIHByZXZCdWYubGVuZ3RoKVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoaSA8IGJ1Zi5sZW5ndGgpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9sZW5ndGhCdWZmZXIubGVuZ3RoID4gMCAmJiBidWZbaV0gPT09IFJJR0hUX0NVUkxZX0JSQUNLRVQpIHtcbiAgICAgICAgICAgICAgdGhpcy5fYnVmZmVyU3RhdGUgPSBCVUZGRVJfU1RBVEVfUE9TU0lCTFlfTElURVJBTF9MRU5HVEhfMlxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgZGVsZXRlIHRoaXMuX2xlbmd0aEJ1ZmZlclxuICAgICAgICAgICAgICB0aGlzLl9idWZmZXJTdGF0ZSA9IEJVRkZFUl9TVEFURV9ERUZBVUxUXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpKytcbiAgICAgICAgICB9XG4gICAgICAgICAgY29udGludWVcblxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIC8vIGZpbmQgbGl0ZXJhbCBsZW5ndGhcbiAgICAgICAgICBjb25zdCBsZWZ0SWR4ID0gYnVmLmluZGV4T2YoTEVGVF9DVVJMWV9CUkFDS0VULCBpKVxuICAgICAgICAgIGlmIChsZWZ0SWR4ID4gLTEpIHtcbiAgICAgICAgICAgIGNvbnN0IGxlZnRPZkxlZnRDdXJseSA9IG5ldyBVaW50OEFycmF5KGJ1Zi5idWZmZXIsIGksIGxlZnRJZHggLSBpKVxuICAgICAgICAgICAgaWYgKGxlZnRPZkxlZnRDdXJseS5pbmRleE9mKExJTkVfRkVFRCkgPT09IC0xKSB7XG4gICAgICAgICAgICAgIGkgPSBsZWZ0SWR4ICsgMVxuICAgICAgICAgICAgICB0aGlzLl9sZW5ndGhCdWZmZXIgPSBuZXcgVWludDhBcnJheSgwKVxuICAgICAgICAgICAgICB0aGlzLl9idWZmZXJTdGF0ZSA9IEJVRkZFUl9TVEFURV9QT1NTSUJMWV9MSVRFUkFMX0xFTkdUSF8xXG4gICAgICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gZmluZCBlbmQgb2YgY29tbWFuZFxuICAgICAgICAgIGNvbnN0IExGaWR4ID0gYnVmLmluZGV4T2YoTElORV9GRUVELCBpKVxuICAgICAgICAgIGlmIChMRmlkeCA+IC0xKSB7XG4gICAgICAgICAgICBpZiAoTEZpZHggPCBidWYubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgICB0aGlzLl9pbmNvbWluZ0J1ZmZlcnNbdGhpcy5faW5jb21pbmdCdWZmZXJzLmxlbmd0aCAtIDFdID0gbmV3IFVpbnQ4QXJyYXkoYnVmLmJ1ZmZlciwgMCwgTEZpZHggKyAxKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgY29tbWFuZExlbmd0aCA9IHRoaXMuX2luY29taW5nQnVmZmVycy5yZWR1Y2UoKHByZXYsIGN1cnIpID0+IHByZXYgKyBjdXJyLmxlbmd0aCwgMCkgLSAyIC8vIDIgZm9yIENSTEZcbiAgICAgICAgICAgIGNvbnN0IGNvbW1hbmQgPSBuZXcgVWludDhBcnJheShjb21tYW5kTGVuZ3RoKVxuICAgICAgICAgICAgbGV0IGluZGV4ID0gMFxuICAgICAgICAgICAgd2hpbGUgKHRoaXMuX2luY29taW5nQnVmZmVycy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgIGxldCB1aW50OEFycmF5ID0gdGhpcy5faW5jb21pbmdCdWZmZXJzLnNoaWZ0KClcblxuICAgICAgICAgICAgICBjb25zdCByZW1haW5pbmdMZW5ndGggPSBjb21tYW5kTGVuZ3RoIC0gaW5kZXhcbiAgICAgICAgICAgICAgaWYgKHVpbnQ4QXJyYXkubGVuZ3RoID4gcmVtYWluaW5nTGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZXhjZXNzTGVuZ3RoID0gdWludDhBcnJheS5sZW5ndGggLSByZW1haW5pbmdMZW5ndGhcbiAgICAgICAgICAgICAgICB1aW50OEFycmF5ID0gdWludDhBcnJheS5zdWJhcnJheSgwLCAtZXhjZXNzTGVuZ3RoKVxuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2luY29taW5nQnVmZmVycy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICB0aGlzLl9pbmNvbWluZ0J1ZmZlcnMgPSBbXVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBjb21tYW5kLnNldCh1aW50OEFycmF5LCBpbmRleClcbiAgICAgICAgICAgICAgaW5kZXggKz0gdWludDhBcnJheS5sZW5ndGhcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHlpZWxkIGNvbW1hbmRcbiAgICAgICAgICAgIGlmIChMRmlkeCA8IGJ1Zi5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgIGJ1ZiA9IG5ldyBVaW50OEFycmF5KGJ1Zi5zdWJhcnJheShMRmlkeCArIDEpKVxuICAgICAgICAgICAgICB0aGlzLl9pbmNvbWluZ0J1ZmZlcnMucHVzaChidWYpXG4gICAgICAgICAgICAgIGkgPSAwXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAvLyBjbGVhciB0aGUgdGltZW91dCB3aGVuIGFuIGVudGlyZSBjb21tYW5kIGhhcyBhcnJpdmVkXG4gICAgICAgICAgICAgIC8vIGFuZCBub3Qgd2FpdGluZyBvbiBtb3JlIGRhdGEgZm9yIG5leHQgY29tbWFuZFxuICAgICAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5fc29ja2V0VGltZW91dFRpbWVyKVxuICAgICAgICAgICAgICB0aGlzLl9zb2NrZXRUaW1lb3V0VGltZXIgPSBudWxsXG4gICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gUFJJVkFURSBNRVRIT0RTXG5cbiAgLyoqXG4gICAqIFByb2Nlc3NlcyBhIGNvbW1hbmQgZnJvbSB0aGUgcXVldWUuIFRoZSBjb21tYW5kIGlzIHBhcnNlZCBhbmQgZmVlZGVkIHRvIGEgaGFuZGxlclxuICAgKi9cbiAgX3BhcnNlSW5jb21pbmdDb21tYW5kcyAoY29tbWFuZHMpIHtcbiAgICBmb3IgKHZhciBjb21tYW5kIG9mIGNvbW1hbmRzKSB7XG4gICAgICB0aGlzLl9jbGVhcklkbGUoKVxuXG4gICAgICAvKlxuICAgICAgICogVGhlIFwiK1wiLXRhZ2dlZCByZXNwb25zZSBpcyBhIHNwZWNpYWwgY2FzZTpcbiAgICAgICAqIEVpdGhlciB0aGUgc2VydmVyIGNhbiBhc2tzIGZvciB0aGUgbmV4dCBjaHVuayBvZiBkYXRhLCBlLmcuIGZvciB0aGUgQVVUSEVOVElDQVRFIGNvbW1hbmQuXG4gICAgICAgKlxuICAgICAgICogT3IgdGhlcmUgd2FzIGFuIGVycm9yIGluIHRoZSBYT0FVVEgyIGF1dGhlbnRpY2F0aW9uLCBmb3Igd2hpY2ggU0FTTCBpbml0aWFsIGNsaWVudCByZXNwb25zZSBleHRlbnNpb25cbiAgICAgICAqIGRpY3RhdGVzIHRoZSBjbGllbnQgc2VuZHMgYW4gZW1wdHkgRU9MIHJlc3BvbnNlIHRvIHRoZSBjaGFsbGVuZ2UgY29udGFpbmluZyB0aGUgZXJyb3IgbWVzc2FnZS5cbiAgICAgICAqXG4gICAgICAgKiBEZXRhaWxzIG9uIFwiK1wiLXRhZ2dlZCByZXNwb25zZTpcbiAgICAgICAqICAgaHR0cHM6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzM1MDEjc2VjdGlvbi0yLjIuMVxuICAgICAgICovXG4gICAgICAvL1xuICAgICAgaWYgKGNvbW1hbmRbMF0gPT09IEFTQ0lJX1BMVVMpIHtcbiAgICAgICAgaWYgKHRoaXMuX2N1cnJlbnRDb21tYW5kLmRhdGEubGVuZ3RoKSB7XG4gICAgICAgICAgLy8gZmVlZCB0aGUgbmV4dCBjaHVuayBvZiBkYXRhXG4gICAgICAgICAgdmFyIGNodW5rID0gdGhpcy5fY3VycmVudENvbW1hbmQuZGF0YS5zaGlmdCgpXG4gICAgICAgICAgY2h1bmsgKz0gKCF0aGlzLl9jdXJyZW50Q29tbWFuZC5kYXRhLmxlbmd0aCA/IEVPTCA6ICcnKSAvLyBFT0wgaWYgdGhlcmUncyBub3RoaW5nIG1vcmUgdG8gc2VuZFxuICAgICAgICAgIHRoaXMuc2VuZChjaHVuaylcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLl9jdXJyZW50Q29tbWFuZC5lcnJvclJlc3BvbnNlRXhwZWN0c0VtcHR5TGluZSkge1xuICAgICAgICAgIHRoaXMuc2VuZChFT0wpIC8vIFhPQVVUSDIgZW1wdHkgcmVzcG9uc2UsIGVycm9yIHdpbGwgYmUgcmVwb3J0ZWQgd2hlbiBzZXJ2ZXIgY29udGludWVzIHdpdGggTk8gcmVzcG9uc2VcbiAgICAgICAgfVxuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuXG4gICAgICB2YXIgcmVzcG9uc2VcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHZhbHVlQXNTdHJpbmcgPSB0aGlzLl9jdXJyZW50Q29tbWFuZC5yZXF1ZXN0ICYmIHRoaXMuX2N1cnJlbnRDb21tYW5kLnJlcXVlc3QudmFsdWVBc1N0cmluZ1xuICAgICAgICByZXNwb25zZSA9IHBhcnNlcihjb21tYW5kLCB7IHZhbHVlQXNTdHJpbmcgfSlcbiAgICAgICAgdGhpcy5sb2dnZXIuZGVidWcoJ1M6JywgKCkgPT4gY29tcGlsZXIocmVzcG9uc2UsIGZhbHNlLCB0cnVlKSlcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgdGhpcy5sb2dnZXIuZXJyb3IoJ0Vycm9yIHBhcnNpbmcgaW1hcCBjb21tYW5kIScsIHJlc3BvbnNlKVxuICAgICAgICByZXR1cm4gdGhpcy5fb25FcnJvcihlKVxuICAgICAgfVxuXG4gICAgICB0aGlzLl9wcm9jZXNzUmVzcG9uc2UocmVzcG9uc2UpXG4gICAgICB0aGlzLl9oYW5kbGVSZXNwb25zZShyZXNwb25zZSlcblxuICAgICAgLy8gZmlyc3QgcmVzcG9uc2UgZnJvbSB0aGUgc2VydmVyLCBjb25uZWN0aW9uIGlzIG5vdyB1c2FibGVcbiAgICAgIGlmICghdGhpcy5fY29ubmVjdGlvblJlYWR5KSB7XG4gICAgICAgIHRoaXMuX2Nvbm5lY3Rpb25SZWFkeSA9IHRydWVcbiAgICAgICAgdGhpcy5vbnJlYWR5ICYmIHRoaXMub25yZWFkeSgpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEZlZWRzIGEgcGFyc2VkIHJlc3BvbnNlIG9iamVjdCB0byBhbiBhcHByb3ByaWF0ZSBoYW5kbGVyXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSByZXNwb25zZSBQYXJzZWQgY29tbWFuZCBvYmplY3RcbiAgICovXG4gIF9oYW5kbGVSZXNwb25zZSAocmVzcG9uc2UpIHtcbiAgICB2YXIgY29tbWFuZCA9IHByb3BPcignJywgJ2NvbW1hbmQnLCByZXNwb25zZSkudG9VcHBlckNhc2UoKS50cmltKClcblxuICAgIGlmICghdGhpcy5fY3VycmVudENvbW1hbmQpIHtcbiAgICAgIC8vIHVuc29saWNpdGVkIHVudGFnZ2VkIHJlc3BvbnNlXG4gICAgICBpZiAocmVzcG9uc2UudGFnID09PSAnKicgJiYgY29tbWFuZCBpbiB0aGlzLl9nbG9iYWxBY2NlcHRVbnRhZ2dlZCkge1xuICAgICAgICB0aGlzLl9nbG9iYWxBY2NlcHRVbnRhZ2dlZFtjb21tYW5kXShyZXNwb25zZSlcbiAgICAgICAgdGhpcy5fY2FuU2VuZCA9IHRydWVcbiAgICAgICAgdGhpcy5fc2VuZFJlcXVlc3QoKVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodGhpcy5fY3VycmVudENvbW1hbmQucGF5bG9hZCAmJiByZXNwb25zZS50YWcgPT09ICcqJyAmJiBjb21tYW5kIGluIHRoaXMuX2N1cnJlbnRDb21tYW5kLnBheWxvYWQpIHtcbiAgICAgIC8vIGV4cGVjdGVkIHVudGFnZ2VkIHJlc3BvbnNlXG4gICAgICB0aGlzLl9jdXJyZW50Q29tbWFuZC5wYXlsb2FkW2NvbW1hbmRdLnB1c2gocmVzcG9uc2UpXG4gICAgICAvLyBzdGlsbCBleHBlY3RpbmcgbW9yZSBkYXRhIGZvciB0aGUgcmVzcG9uc2Ugb2YgdGhlIGN1cnJlbnQgY29tbWFuZFxuICAgICAgdGhpcy5fcmVzZXRTb2NrZXRUaW1lb3V0KClcbiAgICB9IGVsc2UgaWYgKHJlc3BvbnNlLnRhZyA9PT0gJyonICYmIGNvbW1hbmQgaW4gdGhpcy5fZ2xvYmFsQWNjZXB0VW50YWdnZWQpIHtcbiAgICAgIC8vIHVuZXhwZWN0ZWQgdW50YWdnZWQgcmVzcG9uc2VcbiAgICAgIHRoaXMuX2dsb2JhbEFjY2VwdFVudGFnZ2VkW2NvbW1hbmRdKHJlc3BvbnNlKVxuICAgICAgLy8gc3RpbGwgZXhwZWN0aW5nIG1vcmUgZGF0YSBmb3IgdGhlIHJlc3BvbnNlIG9mIHRoZSBjdXJyZW50IGNvbW1hbmRcbiAgICAgIHRoaXMuX3Jlc2V0U29ja2V0VGltZW91dCgpXG4gICAgfSBlbHNlIGlmIChyZXNwb25zZS50YWcgPT09IHRoaXMuX2N1cnJlbnRDb21tYW5kLnRhZykge1xuICAgICAgLy8gdGFnZ2VkIHJlc3BvbnNlXG4gICAgICBpZiAodGhpcy5fY3VycmVudENvbW1hbmQucGF5bG9hZCAmJiBPYmplY3Qua2V5cyh0aGlzLl9jdXJyZW50Q29tbWFuZC5wYXlsb2FkKS5sZW5ndGgpIHtcbiAgICAgICAgcmVzcG9uc2UucGF5bG9hZCA9IHRoaXMuX2N1cnJlbnRDb21tYW5kLnBheWxvYWRcbiAgICAgIH1cbiAgICAgIHRoaXMuX2N1cnJlbnRDb21tYW5kLmNhbGxiYWNrKHJlc3BvbnNlKVxuICAgICAgdGhpcy5fY2FuU2VuZCA9IHRydWVcbiAgICAgIHRoaXMuX3NlbmRSZXF1ZXN0KClcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2VuZHMgYSBjb21tYW5kIGZyb20gY2xpZW50IHF1ZXVlIHRvIHRoZSBzZXJ2ZXIuXG4gICAqL1xuICBfc2VuZFJlcXVlc3QgKCkge1xuICAgIGlmICghdGhpcy5fY2xpZW50UXVldWUubGVuZ3RoKSB7XG4gICAgICB0aGlzLl9jdXJyZW50Q29tbWFuZCA9IGZhbHNlXG4gICAgICByZXR1cm4gdGhpcy5fZW50ZXJJZGxlKClcbiAgICB9XG4gICAgdGhpcy5fY2xlYXJJZGxlKClcblxuICAgIC8vIGFuIG9wZXJhdGlvbiB3YXMgbWFkZSBpbiB0aGUgcHJlY2hlY2ssIG5vIG5lZWQgdG8gcmVzdGFydCB0aGUgcXVldWUgbWFudWFsbHlcbiAgICB0aGlzLl9yZXN0YXJ0UXVldWUgPSBmYWxzZVxuXG4gICAgdmFyIGNvbW1hbmQgPSB0aGlzLl9jbGllbnRRdWV1ZVswXVxuICAgIGlmICh0eXBlb2YgY29tbWFuZC5wcmVjaGVjayA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgLy8gcmVtZW1iZXIgdGhlIGNvbnRleHRcbiAgICAgIHZhciBjb250ZXh0ID0gY29tbWFuZFxuICAgICAgdmFyIHByZWNoZWNrID0gY29udGV4dC5wcmVjaGVja1xuICAgICAgZGVsZXRlIGNvbnRleHQucHJlY2hlY2tcblxuICAgICAgLy8gd2UgbmVlZCB0byByZXN0YXJ0IHRoZSBxdWV1ZSBoYW5kbGluZyBpZiBubyBvcGVyYXRpb24gd2FzIG1hZGUgaW4gdGhlIHByZWNoZWNrXG4gICAgICB0aGlzLl9yZXN0YXJ0UXVldWUgPSB0cnVlXG5cbiAgICAgIC8vIGludm9rZSB0aGUgcHJlY2hlY2sgY29tbWFuZCBhbmQgcmVzdW1lIG5vcm1hbCBvcGVyYXRpb24gYWZ0ZXIgdGhlIHByb21pc2UgcmVzb2x2ZXNcbiAgICAgIHByZWNoZWNrKGNvbnRleHQpLnRoZW4oKCkgPT4ge1xuICAgICAgICAvLyB3ZSdyZSBkb25lIHdpdGggdGhlIHByZWNoZWNrXG4gICAgICAgIGlmICh0aGlzLl9yZXN0YXJ0UXVldWUpIHtcbiAgICAgICAgICAvLyB3ZSBuZWVkIHRvIHJlc3RhcnQgdGhlIHF1ZXVlIGhhbmRsaW5nXG4gICAgICAgICAgdGhpcy5fc2VuZFJlcXVlc3QoKVxuICAgICAgICB9XG4gICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgIC8vIHByZWNoZWNrIGZhaWxlZCwgc28gd2UgcmVtb3ZlIHRoZSBpbml0aWFsIGNvbW1hbmRcbiAgICAgICAgLy8gZnJvbSB0aGUgcXVldWUsIGludm9rZSBpdHMgY2FsbGJhY2sgYW5kIHJlc3VtZSBub3JtYWwgb3BlcmF0aW9uXG4gICAgICAgIGxldCBjbWRcbiAgICAgICAgY29uc3QgaW5kZXggPSB0aGlzLl9jbGllbnRRdWV1ZS5pbmRleE9mKGNvbnRleHQpXG4gICAgICAgIGlmIChpbmRleCA+PSAwKSB7XG4gICAgICAgICAgY21kID0gdGhpcy5fY2xpZW50UXVldWUuc3BsaWNlKGluZGV4LCAxKVswXVxuICAgICAgICB9XG4gICAgICAgIGlmIChjbWQgJiYgY21kLmNhbGxiYWNrKSB7XG4gICAgICAgICAgY21kLmNhbGxiYWNrKGVycilcbiAgICAgICAgICB0aGlzLl9jYW5TZW5kID0gdHJ1ZVxuICAgICAgICAgIHRoaXMuX3BhcnNlSW5jb21pbmdDb21tYW5kcyh0aGlzLl9pdGVyYXRlSW5jb21pbmdCdWZmZXIoKSkgLy8gQ29uc3VtZSB0aGUgcmVzdCBvZiB0aGUgaW5jb21pbmcgYnVmZmVyXG4gICAgICAgICAgdGhpcy5fc2VuZFJlcXVlc3QoKSAvLyBjb250aW51ZSBzZW5kaW5nXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICB0aGlzLl9jYW5TZW5kID0gZmFsc2VcbiAgICB0aGlzLl9jdXJyZW50Q29tbWFuZCA9IHRoaXMuX2NsaWVudFF1ZXVlLnNoaWZ0KClcblxuICAgIHRyeSB7XG4gICAgICB0aGlzLl9jdXJyZW50Q29tbWFuZC5kYXRhID0gY29tcGlsZXIodGhpcy5fY3VycmVudENvbW1hbmQucmVxdWVzdCwgdHJ1ZSlcbiAgICAgIHRoaXMubG9nZ2VyLmRlYnVnKCdDOicsICgpID0+IGNvbXBpbGVyKHRoaXMuX2N1cnJlbnRDb21tYW5kLnJlcXVlc3QsIGZhbHNlLCB0cnVlKSkgLy8gZXhjbHVkZXMgcGFzc3dvcmRzIGV0Yy5cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICB0aGlzLmxvZ2dlci5lcnJvcignRXJyb3IgY29tcGlsaW5nIGltYXAgY29tbWFuZCEnLCB0aGlzLl9jdXJyZW50Q29tbWFuZC5yZXF1ZXN0KVxuICAgICAgcmV0dXJuIHRoaXMuX29uRXJyb3IobmV3IEVycm9yKCdFcnJvciBjb21waWxpbmcgaW1hcCBjb21tYW5kIScpKVxuICAgIH1cblxuICAgIHZhciBkYXRhID0gdGhpcy5fY3VycmVudENvbW1hbmQuZGF0YS5zaGlmdCgpXG5cbiAgICB0aGlzLnNlbmQoZGF0YSArICghdGhpcy5fY3VycmVudENvbW1hbmQuZGF0YS5sZW5ndGggPyBFT0wgOiAnJykpXG4gICAgcmV0dXJuIHRoaXMud2FpdERyYWluXG4gIH1cblxuICAvKipcbiAgICogRW1pdHMgb25pZGxlLCBub3RpbmcgdG8gZG8gY3VycmVudGx5XG4gICAqL1xuICBfZW50ZXJJZGxlICgpIHtcbiAgICBjbGVhclRpbWVvdXQodGhpcy5faWRsZVRpbWVyKVxuICAgIHRoaXMuX2lkbGVUaW1lciA9IHNldFRpbWVvdXQoKCkgPT4gKHRoaXMub25pZGxlICYmIHRoaXMub25pZGxlKCkpLCB0aGlzLnRpbWVvdXRFbnRlcklkbGUpXG4gIH1cblxuICAvKipcbiAgICogQ2FuY2VsIGlkbGUgdGltZXJcbiAgICovXG4gIF9jbGVhcklkbGUgKCkge1xuICAgIGNsZWFyVGltZW91dCh0aGlzLl9pZGxlVGltZXIpXG4gICAgdGhpcy5faWRsZVRpbWVyID0gbnVsbFxuICB9XG5cbiAgLyoqXG4gICAqIE1ldGhvZCBwcm9jZXNzZXMgYSByZXNwb25zZSBpbnRvIGFuIGVhc2llciB0byBoYW5kbGUgZm9ybWF0LlxuICAgKiBBZGQgdW50YWdnZWQgbnVtYmVyZWQgcmVzcG9uc2VzIChlLmcuIEZFVENIKSBpbnRvIGEgbmljZWx5IGZlYXNpYmxlIGZvcm1cbiAgICogQ2hlY2tzIGlmIGEgcmVzcG9uc2UgaW5jbHVkZXMgb3B0aW9uYWwgcmVzcG9uc2UgY29kZXNcbiAgICogYW5kIGNvcGllcyB0aGVzZSBpbnRvIHNlcGFyYXRlIHByb3BlcnRpZXMuIEZvciBleGFtcGxlIHRoZVxuICAgKiBmb2xsb3dpbmcgcmVzcG9uc2UgaW5jbHVkZXMgYSBjYXBhYmlsaXR5IGxpc3RpbmcgYW5kIGEgaHVtYW5cbiAgICogcmVhZGFibGUgbWVzc2FnZTpcbiAgICpcbiAgICogICAgICogT0sgW0NBUEFCSUxJVFkgSUQgTkFNRVNQQUNFXSBBbGwgcmVhZHlcbiAgICpcbiAgICogVGhpcyBtZXRob2QgYWRkcyBhICdjYXBhYmlsaXR5JyBwcm9wZXJ0eSB3aXRoIGFuIGFycmF5IHZhbHVlIFsnSUQnLCAnTkFNRVNQQUNFJ11cbiAgICogdG8gdGhlIHJlc3BvbnNlIG9iamVjdC4gQWRkaXRpb25hbGx5ICdBbGwgcmVhZHknIGlzIGFkZGVkIGFzICdodW1hblJlYWRhYmxlJyBwcm9wZXJ0eS5cbiAgICpcbiAgICogU2VlIHBvc3NpYmxlbSBJTUFQIFJlc3BvbnNlIENvZGVzIGF0IGh0dHBzOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmM1NTMwXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSByZXNwb25zZSBQYXJzZWQgcmVzcG9uc2Ugb2JqZWN0XG4gICAqL1xuICBfcHJvY2Vzc1Jlc3BvbnNlIChyZXNwb25zZSkge1xuICAgIGNvbnN0IGNvbW1hbmQgPSBwcm9wT3IoJycsICdjb21tYW5kJywgcmVzcG9uc2UpLnRvVXBwZXJDYXNlKCkudHJpbSgpXG5cbiAgICAvLyBubyBhdHRyaWJ1dGVzXG4gICAgaWYgKCFyZXNwb25zZSB8fCAhcmVzcG9uc2UuYXR0cmlidXRlcyB8fCAhcmVzcG9uc2UuYXR0cmlidXRlcy5sZW5ndGgpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIC8vIHVudGFnZ2VkIHJlc3BvbnNlcyB3LyBzZXF1ZW5jZSBudW1iZXJzXG4gICAgaWYgKHJlc3BvbnNlLnRhZyA9PT0gJyonICYmIC9eXFxkKyQvLnRlc3QocmVzcG9uc2UuY29tbWFuZCkgJiYgcmVzcG9uc2UuYXR0cmlidXRlc1swXS50eXBlID09PSAnQVRPTScpIHtcbiAgICAgIHJlc3BvbnNlLm5yID0gTnVtYmVyKHJlc3BvbnNlLmNvbW1hbmQpXG4gICAgICByZXNwb25zZS5jb21tYW5kID0gKHJlc3BvbnNlLmF0dHJpYnV0ZXMuc2hpZnQoKS52YWx1ZSB8fCAnJykudG9TdHJpbmcoKS50b1VwcGVyQ2FzZSgpLnRyaW0oKVxuICAgIH1cblxuICAgIC8vIG5vIG9wdGlvbmFsIHJlc3BvbnNlIGNvZGVcbiAgICBpZiAoWydPSycsICdOTycsICdCQUQnLCAnQllFJywgJ1BSRUFVVEgnXS5pbmRleE9mKGNvbW1hbmQpIDwgMCkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgLy8gSWYgbGFzdCBlbGVtZW50IG9mIHRoZSByZXNwb25zZSBpcyBURVhUIHRoZW4gdGhpcyBpcyBmb3IgaHVtYW5zXG4gICAgaWYgKHJlc3BvbnNlLmF0dHJpYnV0ZXNbcmVzcG9uc2UuYXR0cmlidXRlcy5sZW5ndGggLSAxXS50eXBlID09PSAnVEVYVCcpIHtcbiAgICAgIHJlc3BvbnNlLmh1bWFuUmVhZGFibGUgPSByZXNwb25zZS5hdHRyaWJ1dGVzW3Jlc3BvbnNlLmF0dHJpYnV0ZXMubGVuZ3RoIC0gMV0udmFsdWVcbiAgICB9XG5cbiAgICAvLyBQYXJzZSBhbmQgZm9ybWF0IEFUT00gdmFsdWVzXG4gICAgaWYgKHJlc3BvbnNlLmF0dHJpYnV0ZXNbMF0udHlwZSA9PT0gJ0FUT00nICYmIHJlc3BvbnNlLmF0dHJpYnV0ZXNbMF0uc2VjdGlvbikge1xuICAgICAgY29uc3Qgb3B0aW9uID0gcmVzcG9uc2UuYXR0cmlidXRlc1swXS5zZWN0aW9uLm1hcCgoa2V5KSA9PiB7XG4gICAgICAgIGlmICgha2V5KSB7XG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoa2V5KSkge1xuICAgICAgICAgIHJldHVybiBrZXkubWFwKChrZXkpID0+IChrZXkudmFsdWUgfHwgJycpLnRvU3RyaW5nKCkudHJpbSgpKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiAoa2V5LnZhbHVlIHx8ICcnKS50b1N0cmluZygpLnRvVXBwZXJDYXNlKCkudHJpbSgpXG4gICAgICAgIH1cbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IGtleSA9IG9wdGlvbi5zaGlmdCgpXG4gICAgICByZXNwb25zZS5jb2RlID0ga2V5XG5cbiAgICAgIGlmIChvcHRpb24ubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIHJlc3BvbnNlW2tleS50b0xvd2VyQ2FzZSgpXSA9IG9wdGlvblswXVxuICAgICAgfSBlbHNlIGlmIChvcHRpb24ubGVuZ3RoID4gMSkge1xuICAgICAgICByZXNwb25zZVtrZXkudG9Mb3dlckNhc2UoKV0gPSBvcHRpb25cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIGEgdmFsdWUgaXMgYW4gRXJyb3Igb2JqZWN0XG4gICAqXG4gICAqIEBwYXJhbSB7TWl4ZWR9IHZhbHVlIFZhbHVlIHRvIGJlIGNoZWNrZWRcbiAgICogQHJldHVybiB7Qm9vbGVhbn0gcmV0dXJucyB0cnVlIGlmIHRoZSB2YWx1ZSBpcyBhbiBFcnJvclxuICAgKi9cbiAgaXNFcnJvciAodmFsdWUpIHtcbiAgICByZXR1cm4gISFPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpLm1hdGNoKC9FcnJvclxcXSQvKVxuICB9XG5cbiAgLy8gQ09NUFJFU1NJT04gUkVMQVRFRCBNRVRIT0RTXG5cbiAgLyoqXG4gICAqIFNldHMgdXAgZGVmbGF0ZS9pbmZsYXRlIGZvciB0aGUgSU9cbiAgICovXG4gIGVuYWJsZUNvbXByZXNzaW9uICgpIHtcbiAgICB0aGlzLl9zb2NrZXRPbkRhdGEgPSB0aGlzLnNvY2tldC5vbmRhdGFcbiAgICB0aGlzLmNvbXByZXNzZWQgPSB0cnVlXG5cbiAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93Lldvcmtlcikge1xuICAgICAgdGhpcy5fY29tcHJlc3Npb25Xb3JrZXIgPSBuZXcgV29ya2VyKFVSTC5jcmVhdGVPYmplY3RVUkwobmV3IEJsb2IoW0NvbXByZXNzaW9uQmxvYl0pKSlcbiAgICAgIHRoaXMuX2NvbXByZXNzaW9uV29ya2VyLm9ubWVzc2FnZSA9IChlKSA9PiB7XG4gICAgICAgIHZhciBtZXNzYWdlID0gZS5kYXRhLm1lc3NhZ2VcbiAgICAgICAgdmFyIGRhdGEgPSBlLmRhdGEuYnVmZmVyXG5cbiAgICAgICAgc3dpdGNoIChtZXNzYWdlKSB7XG4gICAgICAgICAgY2FzZSBNRVNTQUdFX0lORkxBVEVEX0RBVEFfUkVBRFk6XG4gICAgICAgICAgICB0aGlzLl9zb2NrZXRPbkRhdGEoeyBkYXRhIH0pXG4gICAgICAgICAgICBicmVha1xuXG4gICAgICAgICAgY2FzZSBNRVNTQUdFX0RFRkxBVEVEX0RBVEFfUkVBRFk6XG4gICAgICAgICAgICB0aGlzLndhaXREcmFpbiA9IHRoaXMuc29ja2V0LnNlbmQoZGF0YSlcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5fY29tcHJlc3Npb25Xb3JrZXIub25lcnJvciA9IChlKSA9PiB7XG4gICAgICAgIHRoaXMuX29uRXJyb3IobmV3IEVycm9yKCdFcnJvciBoYW5kbGluZyBjb21wcmVzc2lvbiB3ZWIgd29ya2VyOiAnICsgZS5tZXNzYWdlKSlcbiAgICAgIH1cblxuICAgICAgdGhpcy5fY29tcHJlc3Npb25Xb3JrZXIucG9zdE1lc3NhZ2UoY3JlYXRlTWVzc2FnZShNRVNTQUdFX0lOSVRJQUxJWkVfV09SS0VSKSlcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgaW5mbGF0ZWRSZWFkeSA9IChidWZmZXIpID0+IHsgdGhpcy5fc29ja2V0T25EYXRhKHsgZGF0YTogYnVmZmVyIH0pIH1cbiAgICAgIGNvbnN0IGRlZmxhdGVkUmVhZHkgPSAoYnVmZmVyKSA9PiB7IHRoaXMud2FpdERyYWluID0gdGhpcy5zb2NrZXQuc2VuZChidWZmZXIpIH1cbiAgICAgIHRoaXMuX2NvbXByZXNzaW9uID0gbmV3IENvbXByZXNzaW9uKGluZmxhdGVkUmVhZHksIGRlZmxhdGVkUmVhZHkpXG4gICAgfVxuXG4gICAgLy8gb3ZlcnJpZGUgZGF0YSBoYW5kbGVyLCBkZWNvbXByZXNzIGluY29taW5nIGRhdGFcbiAgICB0aGlzLnNvY2tldC5vbmRhdGEgPSAoZXZ0KSA9PiB7XG4gICAgICBpZiAoIXRoaXMuY29tcHJlc3NlZCkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuX2NvbXByZXNzaW9uV29ya2VyKSB7XG4gICAgICAgIHRoaXMuX2NvbXByZXNzaW9uV29ya2VyLnBvc3RNZXNzYWdlKGNyZWF0ZU1lc3NhZ2UoTUVTU0FHRV9JTkZMQVRFLCBldnQuZGF0YSksIFtldnQuZGF0YV0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9jb21wcmVzc2lvbi5pbmZsYXRlKGV2dC5kYXRhKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBVbmRvZXMgYW55IGNoYW5nZXMgcmVsYXRlZCB0byBjb21wcmVzc2lvbi4gVGhpcyBvbmx5IGJlIGNhbGxlZCB3aGVuIGNsb3NpbmcgdGhlIGNvbm5lY3Rpb25cbiAgICovXG4gIF9kaXNhYmxlQ29tcHJlc3Npb24gKCkge1xuICAgIGlmICghdGhpcy5jb21wcmVzc2VkKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICB0aGlzLmNvbXByZXNzZWQgPSBmYWxzZVxuICAgIHRoaXMuc29ja2V0Lm9uZGF0YSA9IHRoaXMuX3NvY2tldE9uRGF0YVxuICAgIHRoaXMuX3NvY2tldE9uRGF0YSA9IG51bGxcblxuICAgIGlmICh0aGlzLl9jb21wcmVzc2lvbldvcmtlcikge1xuICAgICAgLy8gdGVybWluYXRlIHRoZSB3b3JrZXJcbiAgICAgIHRoaXMuX2NvbXByZXNzaW9uV29ya2VyLnRlcm1pbmF0ZSgpXG4gICAgICB0aGlzLl9jb21wcmVzc2lvbldvcmtlciA9IG51bGxcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogT3V0Z29pbmcgcGF5bG9hZCBuZWVkcyB0byBiZSBjb21wcmVzc2VkIGFuZCBzZW50IHRvIHNvY2tldFxuICAgKlxuICAgKiBAcGFyYW0ge0FycmF5QnVmZmVyfSBidWZmZXIgT3V0Z29pbmcgdW5jb21wcmVzc2VkIGFycmF5YnVmZmVyXG4gICAqL1xuICBfc2VuZENvbXByZXNzZWQgKGJ1ZmZlcikge1xuICAgIC8vIGRlZmxhdGVcbiAgICBpZiAodGhpcy5fY29tcHJlc3Npb25Xb3JrZXIpIHtcbiAgICAgIHRoaXMuX2NvbXByZXNzaW9uV29ya2VyLnBvc3RNZXNzYWdlKGNyZWF0ZU1lc3NhZ2UoTUVTU0FHRV9ERUZMQVRFLCBidWZmZXIpLCBbYnVmZmVyXSlcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fY29tcHJlc3Npb24uZGVmbGF0ZShidWZmZXIpXG4gICAgfVxuICB9XG5cbiAgX3Jlc2V0U29ja2V0VGltZW91dCAoYnl0ZUxlbmd0aCkge1xuICAgIGNvbnNvbGUubG9nKGBfcmVzZXRTb2NrZXRUaW1lb3V0IGNhbGxlZC4gYnl0ZUxlbmd0aDogJHtieXRlTGVuZ3RofWApO1xuICAgIGNsZWFyVGltZW91dCh0aGlzLl9zb2NrZXRUaW1lb3V0VGltZXIpXG4gICAgY29uc3QgdGltZW91dCA9IHRoaXMudGltZW91dFNvY2tldExvd2VyQm91bmQgKyBNYXRoLmZsb29yKChieXRlTGVuZ3RoIHx8IDQwOTYpICogdGhpcy50aW1lb3V0U29ja2V0TXVsdGlwbGllcikgLy8gbWF4IHBhY2tldCBzaXplIGlzIDQwOTYgYnl0ZXNcbiAgICB0aGlzLl9zb2NrZXRUaW1lb3V0VGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHRoaXMuX29uRXJyb3IobmV3IEVycm9yKCcgU29ja2V0IHRpbWVkIG91dCEgW1NUT18wMV0nKSksIHRpbWVvdXQpXG4gIH1cbn1cblxuY29uc3QgY3JlYXRlTWVzc2FnZSA9IChtZXNzYWdlLCBidWZmZXIpID0+ICh7IG1lc3NhZ2UsIGJ1ZmZlciB9KVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQXVDO0FBQUE7QUFBQSxxMXZDQUd2QztBQUNBO0FBQ0E7QUFDQSxNQUFNQSx5QkFBeUIsR0FBRyxPQUFPO0FBQ3pDLE1BQU1DLGVBQWUsR0FBRyxTQUFTO0FBQ2pDLE1BQU1DLDJCQUEyQixHQUFHLGdCQUFnQjtBQUNwRCxNQUFNQyxlQUFlLEdBQUcsU0FBUztBQUNqQyxNQUFNQywyQkFBMkIsR0FBRyxnQkFBZ0I7QUFFcEQsTUFBTUMsR0FBRyxHQUFHLE1BQU07QUFDbEIsTUFBTUMsU0FBUyxHQUFH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