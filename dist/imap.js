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
 * How long close() waits for the socket's close/error event before tearing down anyway.
 *
 * An 'open' socket normally emits one of those as soon as we call close(), but a
 * half-open connection (peer vanished without FIN/RST) emits neither, and close()
 * would then never settle. That matters well beyond close() itself: _onError()
 * awaits close() before it re-surfaces the error to onerror, so a stuck close()
 * swallows the error entirely and any caller awaiting connect() or a command hangs
 * forever with no timeout left to save it.
 */
const TIMEOUT_SOCKET_CLOSE = 5000;

/**
 * How long logout() waits for the server to close the connection before forcing it.
 *
 * LOGOUT asks the *server* to hang up, so the only completion signal is the socket's
 * close/error event. A server that never closes -- or a half-open connection that
 * emits neither event -- leaves logout()'s promise pending forever, the same defect
 * TIMEOUT_SOCKET_CLOSE was added to fix in close(). Callers reach logout() on the way
 * out of a working session, so a stuck one strands whatever resource the caller still
 * holds with no other timeout left to save it. Bound the wait and fall through to the
 * forced close().
 */
const TIMEOUT_LOGOUT = 3000;

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
      if (!this.socket) {
        return tearDown();
      }
      if (this.socket.readyState !== 'open') {
        // Socket exists but isn't in the 'open' state (mid-handshake, errored,
        // or half-closed after a login-stage failure such as Gmail's "Too many
        // simultaneous connections"). Previously we merely dropped the reference
        // here, leaking the underlying TCP socket until GC / OS timeout -- which
        // keeps counting against the server's per-account connection limit and
        // can pin busy channels at the limit. Force the underlying socket closed
        // first, then tear down.
        try {
          this.socket.close();
        } catch (e) {
          // underlying socket already gone
        }
        return tearDown();
      }

      // Bound the wait: if the socket never reports closed (half-open connection),
      // tear down anyway so this promise always settles. See TIMEOUT_SOCKET_CLOSE.
      const closeTimer = setTimeout(tearDown, TIMEOUT_SOCKET_CLOSE);
      const onSocketClosed = () => {
        clearTimeout(closeTimer);
        tearDown();
      };
      this.socket.onclose = this.socket.onerror = onSocketClosed; // we don't really care about the error here
      this.socket.close();
    });
  }

  /**
   * Send LOGOUT to the server.
   *
   * Always settles: the server closing the connection, the socket erroring, a
   * failure to even enqueue the command, and the server simply never hanging up
   * all converge on the same forced close(). See TIMEOUT_LOGOUT.
   *
   * @returns {Promise} Resolves once the connection is closed, however that happened.
   */
  logout() {
    return new Promise((resolve, reject) => {
      let settled = false;

      // close() is itself bounded (TIMEOUT_SOCKET_CLOSE) and is safe to call with a
      // null socket, so routing every exit through it keeps teardown in one place.
      const finish = () => {
        if (settled) return;
        settled = true;
        clearTimeout(logoutTimer);
        this.close('Client logging out').then(resolve).catch(reject);
      };
      const logoutTimer = setTimeout(finish, TIMEOUT_LOGOUT);
      if (!this.socket) {
        return finish();
      }
      this.socket.onclose = this.socket.onerror = finish;
      try {
        // A rejected command means no close/error event is coming for us to wait
        // on, and an unhandled rejection here would surface as a process warning.
        const sent = this.enqueueCommand('LOGOUT');
        if (sent && typeof sent.catch === 'function') sent.catch(() => finish());
      } catch (e) {
        finish();
      }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJNRVNTQUdFX0lOSVRJQUxJWkVfV09SS0VSIiwiTUVTU0FHRV9JTkZMQVRFIiwiTUVTU0FHRV9JTkZMQVRFRF9EQVRBX1JFQURZIiwiTUVTU0FHRV9ERUZMQVRFIiwiTUVTU0FHRV9ERUZMQVRFRF9EQVRBX1JFQURZIiwiRU9MIiwiTElORV9GRUVEIiwiQ0FSUklBR0VfUkVUVVJOIiwiTEVGVF9DVVJMWV9CUkFDS0VUIiwiUklHSFRfQ1VSTFlfQlJBQ0tFVCIsIkFTQ0lJX1BMVVMiLCJCVUZGRVJfU1RBVEVfTElURVJBTCIsIkJVRkZFUl9TVEFURV9QT1NTSUJMWV9MSVRFUkFMX0xFTkdUSF8xIiwiQlVGRkVSX1NUQVRFX1BPU1NJQkxZX0xJVEVSQUxfTEVOR1RIXzIiLCJCVUZGRVJfU1RBVEVfREVGQVVMVCIsIlRJTUVPVVRfRU5URVJfSURMRSIsIlRJTUVPVVRfU09DS0VUX0NMT1NFIiwiVElNRU9VVF9MT0dPVVQiLCJUSU1FT1VUX1NPQ0tFVF9MT1dFUl9CT1VORCIsIlRJTUVPVVRfU09DS0VUX01VTFRJUExJRVIiLCJJbWFwIiwiY29uc3RydWN0b3IiLCJob3N0IiwicG9ydCIsIm9wdGlvbnMiLCJ0aW1lb3V0RW50ZXJJZGxlIiwidGltZW91dFNvY2tldExvd2VyQm91bmQiLCJ0aW1lb3V0U29ja2V0TXVsdGlwbGllciIsInVzZVNlY3VyZVRyYW5zcG9ydCIsInNlY3VyZU1vZGUiLCJfY29ubmVjdGlvblJlYWR5IiwiX2dsb2JhbEFjY2VwdFVudGFnZ2VkIiwiX2NsaWVudFF1ZXVlIiwiX2NhblNlbmQiLCJfdGFnQ291bnRlciIsIl9jdXJyZW50Q29tbWFuZCIsIl9pZGxlVGltZXIiLCJfc29ja2V0VGltZW91dFRpbWVyIiwiY29tcHJlc3NlZCIsIl9pbmNvbWluZ0J1ZmZlcnMiLCJfYnVmZmVyU3RhdGUiLCJfbGl0ZXJhbFJlbWFpbmluZyIsIm9uY2VydCIsIm9uZXJyb3IiLCJvbnJlYWR5Iiwib25pZGxlIiwiY29ubmVjdCIsIlNvY2tldCIsIlRDUFNvY2tldCIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0Iiwic29ja2V0Iiwib3BlbiIsImJpbmFyeVR5cGUiLCJjYSIsImNlcnQiLCJFIiwib25jbG9zZSIsIl9vbkVycm9yIiwiRXJyb3IiLCJvbmRhdGEiLCJldnQiLCJfb25EYXRhIiwiZXJyIiwiZSIsImRhdGEiLCJtZXNzYWdlIiwib25vcGVuIiwiY2xvc2UiLCJlcnJvciIsInRlYXJEb3duIiwiZm9yRWFjaCIsImNtZCIsImNhbGxiYWNrIiwiY2xlYXJUaW1lb3V0IiwiX2Rpc2FibGVDb21wcmVzc2lvbiIsInJlYWR5U3RhdGUiLCJjbG9zZVRpbWVyIiwic2V0VGltZW91dCIsIm9uU29ja2V0Q2xvc2VkIiwibG9nb3V0Iiwic2V0dGxlZCIsImZpbmlzaCIsImxvZ291dFRpbWVyIiwidGhlbiIsImNhdGNoIiwic2VudCIsImVucXVldWVDb21tYW5kIiwidXBncmFkZSIsInVwZ3JhZGVUb1NlY3VyZSIsInJlcXVlc3QiLCJhY2NlcHRVbnRhZ2dlZCIsImNvbW1hbmQiLCJjb25jYXQiLCJtYXAiLCJ1bnRhZ2dlZCIsInRvU3RyaW5nIiwidG9VcHBlckNhc2UiLCJ0cmltIiwidGFnIiwicGF5bG9hZCIsImxlbmd0aCIsInVuZGVmaW5lZCIsInJlc3BvbnNlIiwiaXNFcnJvciIsInByb3BPciIsImluY2x1ZGVzIiwiaHVtYW5SZWFkYWJsZSIsImNvZGUiLCJPYmplY3QiLCJrZXlzIiwia2V5IiwiaW5kZXgiLCJjdHgiLCJpbmRleE9mIiwic3BsaWNlIiwicHVzaCIsIl9zZW5kUmVxdWVzdCIsImdldFByZXZpb3VzbHlRdWV1ZWQiLCJjb21tYW5kcyIsInN0YXJ0SW5kZXgiLCJpIiwiaXNNYXRjaCIsInNlbmQiLCJzdHIiLCJidWZmZXIiLCJ0b1R5cGVkQXJyYXkiLCJfcmVzZXRTb2NrZXRUaW1lb3V0IiwiYnl0ZUxlbmd0aCIsIl9zZW5kQ29tcHJlc3NlZCIsInNldEhhbmRsZXIiLCJsb2dnZXIiLCJVaW50OEFycmF5IiwiX3BhcnNlSW5jb21pbmdDb21tYW5kcyIsIl9pdGVyYXRlSW5jb21pbmdCdWZmZXIiLCJidWYiLCJkaWZmIiwiTWF0aCIsIm1pbiIsIk51bWJlciIsImZyb21UeXBlZEFycmF5IiwiX2xlbmd0aEJ1ZmZlciIsInN0YXJ0IiwibGF0ZXN0Iiwic3ViYXJyYXkiLCJwcmV2QnVmIiwic2V0IiwibGVmdElkeCIsImxlZnRPZkxlZnRDdXJseSIsIkxGaWR4IiwiY29tbWFuZExlbmd0aCIsInJlZHVjZSIsInByZXYiLCJjdXJyIiwidWludDhBcnJheSIsInNoaWZ0IiwicmVtYWluaW5nTGVuZ3RoIiwiZXhjZXNzTGVuZ3RoIiwiX2NsZWFySWRsZSIsImNodW5rIiwiZXJyb3JSZXNwb25zZUV4cGVjdHNFbXB0eUxpbmUiLCJ2YWx1ZUFzU3RyaW5nIiwicGFyc2VyIiwiZGVidWciLCJjb21waWxlciIsIl9wcm9jZXNzUmVzcG9uc2UiLCJfaGFuZGxlUmVzcG9uc2UiLCJfZW50ZXJJZGxlIiwiX3Jlc3RhcnRRdWV1ZSIsInByZWNoZWNrIiwiY29udGV4dCIsIndhaXREcmFpbiIsImF0dHJpYnV0ZXMiLCJ0ZXN0IiwidHlwZSIsIm5yIiwidmFsdWUiLCJzZWN0aW9uIiwib3B0aW9uIiwiQXJyYXkiLCJpc0FycmF5IiwidG9Mb3dlckNhc2UiLCJwcm90b3R5cGUiLCJjYWxsIiwibWF0Y2giLCJlbmFibGVDb21wcmVzc2lvbiIsIl9zb2NrZXRPbkRhdGEiLCJ3aW5kb3ciLCJXb3JrZXIiLCJfY29tcHJlc3Npb25Xb3JrZXIiLCJVUkwiLCJjcmVhdGVPYmplY3RVUkwiLCJCbG9iIiwiQ29tcHJlc3Npb25CbG9iIiwib25tZXNzYWdlIiwicG9zdE1lc3NhZ2UiLCJjcmVhdGVNZXNzYWdlIiwiaW5mbGF0ZWRSZWFkeSIsImRlZmxhdGVkUmVhZHkiLCJfY29tcHJlc3Npb24iLCJDb21wcmVzc2lvbiIsImluZmxhdGUiLCJ0ZXJtaW5hdGUiLCJkZWZsYXRlIiwidGltZW91dCIsImZsb29yIl0sInNvdXJjZXMiOlsiLi4vc3JjL2ltYXAuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgcHJvcE9yIH0gZnJvbSAncmFtZGEnXG5pbXBvcnQgVENQU29ja2V0IGZyb20gJ2VtYWlsanMtdGNwLXNvY2tldCdcbmltcG9ydCB7IHRvVHlwZWRBcnJheSwgZnJvbVR5cGVkQXJyYXkgfSBmcm9tICcuL2NvbW1vbidcbmltcG9ydCB7IHBhcnNlciwgY29tcGlsZXIgfSBmcm9tICdlbWFpbGpzLWltYXAtaGFuZGxlcidcbmltcG9ydCBDb21wcmVzc2lvbiBmcm9tICcuL2NvbXByZXNzaW9uJ1xuaW1wb3J0IENvbXByZXNzaW9uQmxvYiBmcm9tICcuLi9yZXMvY29tcHJlc3Npb24ud29ya2VyLmJsb2InXG5cbi8vXG4vLyBjb25zdGFudHMgdXNlZCBmb3IgY29tbXVuaWNhdGlvbiB3aXRoIHRoZSB3b3JrZXJcbi8vXG5jb25zdCBNRVNTQUdFX0lOSVRJQUxJWkVfV09SS0VSID0gJ3N0YXJ0J1xuY29uc3QgTUVTU0FHRV9JTkZMQVRFID0gJ2luZmxhdGUnXG5jb25zdCBNRVNTQUdFX0lORkxBVEVEX0RBVEFfUkVBRFkgPSAnaW5mbGF0ZWRfcmVhZHknXG5jb25zdCBNRVNTQUdFX0RFRkxBVEUgPSAnZGVmbGF0ZSdcbmNvbnN0IE1FU1NBR0VfREVGTEFURURfREFUQV9SRUFEWSA9ICdkZWZsYXRlZF9yZWFkeSdcblxuY29uc3QgRU9MID0gJ1xcclxcbidcbmNvbnN0IExJTkVfRkVFRCA9IDEwXG5jb25zdCBDQVJSSUFHRV9SRVRVUk4gPSAxM1xuY29uc3QgTEVGVF9DVVJMWV9CUkFDS0VUID0gMTIzXG5jb25zdCBSSUdIVF9DVVJMWV9CUkFDS0VUID0gMTI1XG5cbmNvbnN0IEFTQ0lJX1BMVVMgPSA0M1xuXG4vLyBTdGF0ZSB0cmFja2luZyB3aGVuIGNvbnN0cnVjdGluZyBhbiBJTUFQIGNvbW1hbmQgZnJvbSBidWZmZXJzLlxuY29uc3QgQlVGRkVSX1NUQVRFX0xJVEVSQUwgPSAnbGl0ZXJhbCdcbmNvbnN0IEJVRkZFUl9TVEFURV9QT1NTSUJMWV9MSVRFUkFMX0xFTkdUSF8xID0gJ2xpdGVyYWxfbGVuZ3RoXzEnXG5jb25zdCBCVUZGRVJfU1RBVEVfUE9TU0lCTFlfTElURVJBTF9MRU5HVEhfMiA9ICdsaXRlcmFsX2xlbmd0aF8yJ1xuY29uc3QgQlVGRkVSX1NUQVRFX0RFRkFVTFQgPSAnZGVmYXVsdCdcblxuLyoqXG4gKiBIb3cgbXVjaCB0aW1lIHRvIHdhaXQgc2luY2UgdGhlIGxhc3QgcmVzcG9uc2UgdW50aWwgdGhlIGNvbm5lY3Rpb24gaXMgY29uc2lkZXJlZCBpZGxpbmdcbiAqL1xuY29uc3QgVElNRU9VVF9FTlRFUl9JRExFID0gMTAwMFxuXG4vKipcbiAqIEhvdyBsb25nIGNsb3NlKCkgd2FpdHMgZm9yIHRoZSBzb2NrZXQncyBjbG9zZS9lcnJvciBldmVudCBiZWZvcmUgdGVhcmluZyBkb3duIGFueXdheS5cbiAqXG4gKiBBbiAnb3Blbicgc29ja2V0IG5vcm1hbGx5IGVtaXRzIG9uZSBvZiB0aG9zZSBhcyBzb29uIGFzIHdlIGNhbGwgY2xvc2UoKSwgYnV0IGFcbiAqIGhhbGYtb3BlbiBjb25uZWN0aW9uIChwZWVyIHZhbmlzaGVkIHdpdGhvdXQgRklOL1JTVCkgZW1pdHMgbmVpdGhlciwgYW5kIGNsb3NlKClcbiAqIHdvdWxkIHRoZW4gbmV2ZXIgc2V0dGxlLiBUaGF0IG1hdHRlcnMgd2VsbCBiZXlvbmQgY2xvc2UoKSBpdHNlbGY6IF9vbkVycm9yKClcbiAqIGF3YWl0cyBjbG9zZSgpIGJlZm9yZSBpdCByZS1zdXJmYWNlcyB0aGUgZXJyb3IgdG8gb25lcnJvciwgc28gYSBzdHVjayBjbG9zZSgpXG4gKiBzd2FsbG93cyB0aGUgZXJyb3IgZW50aXJlbHkgYW5kIGFueSBjYWxsZXIgYXdhaXRpbmcgY29ubmVjdCgpIG9yIGEgY29tbWFuZCBoYW5nc1xuICogZm9yZXZlciB3aXRoIG5vIHRpbWVvdXQgbGVmdCB0byBzYXZlIGl0LlxuICovXG5jb25zdCBUSU1FT1VUX1NPQ0tFVF9DTE9TRSA9IDUwMDBcblxuLyoqXG4gKiBIb3cgbG9uZyBsb2dvdXQoKSB3YWl0cyBmb3IgdGhlIHNlcnZlciB0byBjbG9zZSB0aGUgY29ubmVjdGlvbiBiZWZvcmUgZm9yY2luZyBpdC5cbiAqXG4gKiBMT0dPVVQgYXNrcyB0aGUgKnNlcnZlciogdG8gaGFuZyB1cCwgc28gdGhlIG9ubHkgY29tcGxldGlvbiBzaWduYWwgaXMgdGhlIHNvY2tldCdzXG4gKiBjbG9zZS9lcnJvciBldmVudC4gQSBzZXJ2ZXIgdGhhdCBuZXZlciBjbG9zZXMgLS0gb3IgYSBoYWxmLW9wZW4gY29ubmVjdGlvbiB0aGF0XG4gKiBlbWl0cyBuZWl0aGVyIGV2ZW50IC0tIGxlYXZlcyBsb2dvdXQoKSdzIHByb21pc2UgcGVuZGluZyBmb3JldmVyLCB0aGUgc2FtZSBkZWZlY3RcbiAqIFRJTUVPVVRfU09DS0VUX0NMT1NFIHdhcyBhZGRlZCB0byBmaXggaW4gY2xvc2UoKS4gQ2FsbGVycyByZWFjaCBsb2dvdXQoKSBvbiB0aGUgd2F5XG4gKiBvdXQgb2YgYSB3b3JraW5nIHNlc3Npb24sIHNvIGEgc3R1Y2sgb25lIHN0cmFuZHMgd2hhdGV2ZXIgcmVzb3VyY2UgdGhlIGNhbGxlciBzdGlsbFxuICogaG9sZHMgd2l0aCBubyBvdGhlciB0aW1lb3V0IGxlZnQgdG8gc2F2ZSBpdC4gQm91bmQgdGhlIHdhaXQgYW5kIGZhbGwgdGhyb3VnaCB0byB0aGVcbiAqIGZvcmNlZCBjbG9zZSgpLlxuICovXG5jb25zdCBUSU1FT1VUX0xPR09VVCA9IDMwMDBcblxuLyoqXG4gKiBMb3dlciBCb3VuZCBmb3Igc29ja2V0IHRpbWVvdXQgdG8gd2FpdCBzaW5jZSB0aGUgbGFzdCBkYXRhIHdhcyB3cml0dGVuIHRvIGEgc29ja2V0XG4gKi9cbmNvbnN0IFRJTUVPVVRfU09DS0VUX0xPV0VSX0JPVU5EID0gMTAwMDBcblxuLyoqXG4gKiBNdWx0aXBsaWVyIGZvciBzb2NrZXQgdGltZW91dDpcbiAqXG4gKiBXZSBhc3N1bWUgYXQgbGVhc3QgYSBHUFJTIGNvbm5lY3Rpb24gd2l0aCAxMTUga2IvcyA9IDE0LDM3NSBrQi9zIHRvcHMsIHNvIDEwIEtCL3MgdG8gYmUgb25cbiAqIHRoZSBzYWZlIHNpZGUuIFdlIGNhbiB0aW1lb3V0IGFmdGVyIGEgbG93ZXIgYm91bmQgb2YgMTBzICsgKG4gS0IgLyAxMCBLQi9zKS4gQSAxIE1CIG1lc3NhZ2VcbiAqIHVwbG9hZCB3b3VsZCBiZSAxMTAgc2Vjb25kcyB0byB3YWl0IGZvciB0aGUgdGltZW91dC4gMTAgS0IvcyA9PT0gMC4xIHMvQlxuICovXG5jb25zdCBUSU1FT1VUX1NPQ0tFVF9NVUxUSVBMSUVSID0gMC4xXG5cbi8qKlxuICogQ3JlYXRlcyBhIGNvbm5lY3Rpb24gb2JqZWN0IHRvIGFuIElNQVAgc2VydmVyLiBDYWxsIGBjb25uZWN0YCBtZXRob2QgdG8gaW5pdGl0YXRlXG4gKiB0aGUgYWN0dWFsIGNvbm5lY3Rpb24sIHRoZSBjb25zdHJ1Y3RvciBvbmx5IGRlZmluZXMgdGhlIHByb3BlcnRpZXMgYnV0IGRvZXMgbm90IGFjdHVhbGx5IGNvbm5lY3QuXG4gKlxuICogQGNvbnN0cnVjdG9yXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IFtob3N0PSdsb2NhbGhvc3QnXSBIb3N0bmFtZSB0byBjb25lbmN0IHRvXG4gKiBAcGFyYW0ge051bWJlcn0gW3BvcnQ9MTQzXSBQb3J0IG51bWJlciB0byBjb25uZWN0IHRvXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdIE9wdGlvbmFsIG9wdGlvbnMgb2JqZWN0XG4gKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLnVzZVNlY3VyZVRyYW5zcG9ydF0gU2V0IHRvIHRydWUsIHRvIHVzZSBlbmNyeXB0ZWQgY29ubmVjdGlvblxuICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLmNvbXByZXNzaW9uV29ya2VyUGF0aF0gb2ZmbG9hZHMgZGUtL2NvbXByZXNzaW9uIGNvbXB1dGF0aW9uIHRvIGEgd2ViIHdvcmtlciwgdGhpcyBpcyB0aGUgcGF0aCB0byB0aGUgYnJvd3NlcmlmaWVkIGVtYWlsanMtY29tcHJlc3Nvci13b3JrZXIuanNcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSW1hcCB7XG4gIGNvbnN0cnVjdG9yIChob3N0LCBwb3J0LCBvcHRpb25zID0ge30pIHtcbiAgICB0aGlzLnRpbWVvdXRFbnRlcklkbGUgPSBUSU1FT1VUX0VOVEVSX0lETEVcbiAgICB0aGlzLnRpbWVvdXRTb2NrZXRMb3dlckJvdW5kID0gVElNRU9VVF9TT0NLRVRfTE9XRVJfQk9VTkRcbiAgICB0aGlzLnRpbWVvdXRTb2NrZXRNdWx0aXBsaWVyID0gVElNRU9VVF9TT0NLRVRfTVVMVElQTElFUlxuXG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9uc1xuXG4gICAgdGhpcy5wb3J0ID0gcG9ydCB8fCAodGhpcy5vcHRpb25zLnVzZVNlY3VyZVRyYW5zcG9ydCA/IDk5MyA6IDE0MylcbiAgICB0aGlzLmhvc3QgPSBob3N0IHx8ICdsb2NhbGhvc3QnXG5cbiAgICAvLyBVc2UgYSBUTFMgY29ubmVjdGlvbi4gUG9ydCA5OTMgYWxzbyBmb3JjZXMgVExTLlxuICAgIHRoaXMub3B0aW9ucy51c2VTZWN1cmVUcmFuc3BvcnQgPSAndXNlU2VjdXJlVHJhbnNwb3J0JyBpbiB0aGlzLm9wdGlvbnMgPyAhIXRoaXMub3B0aW9ucy51c2VTZWN1cmVUcmFuc3BvcnQgOiB0aGlzLnBvcnQgPT09IDk5M1xuXG4gICAgdGhpcy5zZWN1cmVNb2RlID0gISF0aGlzLm9wdGlvbnMudXNlU2VjdXJlVHJhbnNwb3J0IC8vIERvZXMgdGhlIGNvbm5lY3Rpb24gdXNlIFNTTC9UTFNcblxuICAgIHRoaXMuX2Nvbm5lY3Rpb25SZWFkeSA9IGZhbHNlIC8vIElzIHRoZSBjb25lY3Rpb24gZXN0YWJsaXNoZWQgYW5kIGdyZWV0aW5nIGlzIHJlY2VpdmVkIGZyb20gdGhlIHNlcnZlclxuXG4gICAgdGhpcy5fZ2xvYmFsQWNjZXB0VW50YWdnZWQgPSB7fSAvLyBHbG9iYWwgaGFuZGxlcnMgZm9yIHVucmVsYXRlZCByZXNwb25zZXMgKEVYUFVOR0UsIEVYSVNUUyBldGMuKVxuXG4gICAgdGhpcy5fY2xpZW50UXVldWUgPSBbXSAvLyBRdWV1ZSBvZiBvdXRnb2luZyBjb21tYW5kc1xuICAgIHRoaXMuX2NhblNlbmQgPSBmYWxzZSAvLyBJcyBpdCBPSyB0byBzZW5kIHNvbWV0aGluZyB0byB0aGUgc2VydmVyXG4gICAgdGhpcy5fdGFnQ291bnRlciA9IDAgLy8gQ291bnRlciB0byBhbGxvdyB1bmlxdWV1ZSBpbWFwIHRhZ3NcbiAgICB0aGlzLl9jdXJyZW50Q29tbWFuZCA9IGZhbHNlIC8vIEN1cnJlbnQgY29tbWFuZCB0aGF0IGlzIHdhaXRpbmcgZm9yIHJlc3BvbnNlIGZyb20gdGhlIHNlcnZlclxuXG4gICAgdGhpcy5faWRsZVRpbWVyID0gZmFsc2UgLy8gVGltZXIgd2FpdGluZyB0byBlbnRlciBpZGxlXG4gICAgdGhpcy5fc29ja2V0VGltZW91dFRpbWVyID0gZmFsc2UgLy8gVGltZXIgd2FpdGluZyB0byBkZWNsYXJlIHRoZSBzb2NrZXQgZGVhZCBzdGFydGluZyBmcm9tIHRoZSBsYXN0IHdyaXRlXG5cbiAgICB0aGlzLmNvbXByZXNzZWQgPSBmYWxzZSAvLyBJcyB0aGUgY29ubmVjdGlvbiBjb21wcmVzc2VkIGFuZCBuZWVkcyBpbmZsYXRpbmcvZGVmbGF0aW5nXG5cbiAgICAvL1xuICAgIC8vIEhFTFBFUlNcbiAgICAvL1xuXG4gICAgLy8gQXMgdGhlIHNlcnZlciBzZW5kcyBkYXRhIGluIGNodW5rcywgaXQgbmVlZHMgdG8gYmUgc3BsaXQgaW50byBzZXBhcmF0ZSBsaW5lcy4gSGVscHMgcGFyc2luZyB0aGUgaW5wdXQuXG4gICAgdGhpcy5faW5jb21pbmdCdWZmZXJzID0gW11cbiAgICB0aGlzLl9idWZmZXJTdGF0ZSA9IEJVRkZFUl9TVEFURV9ERUZBVUxUXG4gICAgdGhpcy5fbGl0ZXJhbFJlbWFpbmluZyA9IDBcblxuICAgIC8vXG4gICAgLy8gRXZlbnQgcGxhY2Vob2xkZXJzLCBtYXkgYmUgb3ZlcnJpZGVuIHdpdGggY2FsbGJhY2sgZnVuY3Rpb25zXG4gICAgLy9cbiAgICB0aGlzLm9uY2VydCA9IG51bGxcbiAgICB0aGlzLm9uZXJyb3IgPSBudWxsIC8vIElycmVjb3ZlcmFibGUgZXJyb3Igb2NjdXJyZWQuIENvbm5lY3Rpb24gdG8gdGhlIHNlcnZlciB3aWxsIGJlIGNsb3NlZCBhdXRvbWF0aWNhbGx5LlxuICAgIHRoaXMub25yZWFkeSA9IG51bGwgLy8gVGhlIGNvbm5lY3Rpb24gdG8gdGhlIHNlcnZlciBoYXMgYmVlbiBlc3RhYmxpc2hlZCBhbmQgZ3JlZXRpbmcgaXMgcmVjZWl2ZWRcbiAgICB0aGlzLm9uaWRsZSA9IG51bGwgLy8gVGhlcmUgYXJlIG5vIG1vcmUgY29tbWFuZHMgdG8gcHJvY2Vzc1xuICB9XG5cbiAgLy8gUFVCTElDIE1FVEhPRFNcblxuICAvKipcbiAgICogSW5pdGlhdGUgYSBjb25uZWN0aW9uIHRvIHRoZSBzZXJ2ZXIuIFdhaXQgZm9yIG9ucmVhZHkgZXZlbnRcbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IFNvY2tldFxuICAgKiAgICAgVEVTVElORyBPTkxZISBUaGUgVENQU29ja2V0IGhhcyBhIHByZXR0eSBub25zZW5zaWNhbCBjb252ZW5pZW5jZSBjb25zdHJ1Y3RvcixcbiAgICogICAgIHdoaWNoIG1ha2VzIGl0IGhhcmQgdG8gbW9jay4gRm9yIGRlcGVuZGVuY3ktaW5qZWN0aW9uIHB1cnBvc2VzLCB3ZSB1c2UgdGhlXG4gICAqICAgICBTb2NrZXQgcGFyYW1ldGVyIHRvIHBhc3MgaW4gYSBtb2NrIFNvY2tldCBpbXBsZW1lbnRhdGlvbi4gU2hvdWxkIGJlIGxlZnQgYmxhbmtcbiAgICogICAgIGluIHByb2R1Y3Rpb24gdXNlIVxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUmVzb2x2ZXMgd2hlbiBzb2NrZXQgaXMgb3BlbmVkXG4gICAqL1xuICBjb25uZWN0IChTb2NrZXQgPSBUQ1BTb2NrZXQpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgdGhpcy5zb2NrZXQgPSBTb2NrZXQub3Blbih0aGlzLmhvc3QsIHRoaXMucG9ydCwge1xuICAgICAgICBiaW5hcnlUeXBlOiAnYXJyYXlidWZmZXInLFxuICAgICAgICB1c2VTZWN1cmVUcmFuc3BvcnQ6IHRoaXMuc2VjdXJlTW9kZSxcbiAgICAgICAgY2E6IHRoaXMub3B0aW9ucy5jYVxuICAgICAgfSlcblxuICAgICAgLy8gYWxsb3dzIGNlcnRpZmljYXRlIGhhbmRsaW5nIGZvciBwbGF0Zm9ybSB3L28gbmF0aXZlIHRscyBzdXBwb3J0XG4gICAgICAvLyBvbmNlcnQgaXMgbm9uIHN0YW5kYXJkIHNvIHNldHRpbmcgaXQgbWlnaHQgdGhyb3cgaWYgdGhlIHNvY2tldCBvYmplY3QgaXMgaW1tdXRhYmxlXG4gICAgICB0cnkge1xuICAgICAgICB0aGlzLnNvY2tldC5vbmNlcnQgPSAoY2VydCkgPT4geyB0aGlzLm9uY2VydCAmJiB0aGlzLm9uY2VydChjZXJ0KSB9XG4gICAgICB9IGNhdGNoIChFKSB7IH1cblxuICAgICAgLy8gQ29ubmVjdGlvbiBjbG9zaW5nIHVuZXhwZWN0ZWQgaXMgYW4gZXJyb3JcbiAgICAgIHRoaXMuc29ja2V0Lm9uY2xvc2UgPSAoKSA9PiB0aGlzLl9vbkVycm9yKG5ldyBFcnJvcignU29ja2V0IGNsb3NlZCB1bmV4cGVjdGVkbHkhJykpXG4gICAgICB0aGlzLnNvY2tldC5vbmRhdGEgPSAoZXZ0KSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgdGhpcy5fb25EYXRhKGV2dClcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgdGhpcy5fb25FcnJvcihlcnIpXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gaWYgYW4gZXJyb3IgaGFwcGVucyBkdXJpbmcgY3JlYXRlIHRpbWUsIHJlamVjdCB0aGUgcHJvbWlzZVxuICAgICAgdGhpcy5zb2NrZXQub25lcnJvciA9IChlKSA9PiB7XG4gICAgICAgIHJlamVjdChuZXcgRXJyb3IoJ0NvdWxkIG5vdCBvcGVuIHNvY2tldDogJyArIGUuZGF0YS5tZXNzYWdlKSlcbiAgICAgIH1cblxuICAgICAgdGhpcy5zb2NrZXQub25vcGVuID0gKCkgPT4ge1xuICAgICAgICAvLyB1c2UgcHJvcGVyIFwiaXJyZWNvdmVyYWJsZSBlcnJvciwgdGVhciBkb3duIGV2ZXJ5dGhpbmdcIi1oYW5kbGVyIG9ubHkgYWZ0ZXIgc29ja2V0IGlzIG9wZW5cbiAgICAgICAgdGhpcy5zb2NrZXQub25lcnJvciA9IChlKSA9PiB0aGlzLl9vbkVycm9yKGUpXG4gICAgICAgIHJlc29sdmUoKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICAvKipcbiAgICogQ2xvc2VzIHRoZSBjb25uZWN0aW9uIHRvIHRoZSBzZXJ2ZXJcbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IFJlc29sdmVzIHdoZW4gdGhlIHNvY2tldCBpcyBjbG9zZWRcbiAgICovXG4gIGNsb3NlIChlcnJvcikge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgdmFyIHRlYXJEb3duID0gKCkgPT4ge1xuICAgICAgICAvLyBmdWxmaWxsIHBlbmRpbmcgcHJvbWlzZXNcbiAgICAgICAgdGhpcy5fY2xpZW50UXVldWUuZm9yRWFjaChjbWQgPT4gY21kLmNhbGxiYWNrKGVycm9yKSlcbiAgICAgICAgaWYgKHRoaXMuX2N1cnJlbnRDb21tYW5kKSB7XG4gICAgICAgICAgdGhpcy5fY3VycmVudENvbW1hbmQuY2FsbGJhY2soZXJyb3IpXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9jbGllbnRRdWV1ZSA9IFtdXG4gICAgICAgIHRoaXMuX2N1cnJlbnRDb21tYW5kID0gZmFsc2VcblxuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5faWRsZVRpbWVyKVxuICAgICAgICB0aGlzLl9pZGxlVGltZXIgPSBudWxsXG5cbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX3NvY2tldFRpbWVvdXRUaW1lcilcbiAgICAgICAgdGhpcy5fc29ja2V0VGltZW91dFRpbWVyID0gbnVsbFxuXG4gICAgICAgIGlmICh0aGlzLnNvY2tldCkge1xuICAgICAgICAgIC8vIHJlbW92ZSBhbGwgbGlzdGVuZXJzXG4gICAgICAgICAgdGhpcy5zb2NrZXQub25vcGVuID0gbnVsbFxuICAgICAgICAgIHRoaXMuc29ja2V0Lm9uY2xvc2UgPSBudWxsXG4gICAgICAgICAgdGhpcy5zb2NrZXQub25kYXRhID0gbnVsbFxuICAgICAgICAgIHRoaXMuc29ja2V0Lm9uZXJyb3IgPSBudWxsXG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHRoaXMuc29ja2V0Lm9uY2VydCA9IG51bGxcbiAgICAgICAgICB9IGNhdGNoIChFKSB7IH1cblxuICAgICAgICAgIHRoaXMuc29ja2V0ID0gbnVsbFxuICAgICAgICB9XG5cbiAgICAgICAgcmVzb2x2ZSgpXG4gICAgICB9XG5cbiAgICAgIHRoaXMuX2Rpc2FibGVDb21wcmVzc2lvbigpXG5cbiAgICAgIGlmICghdGhpcy5zb2NrZXQpIHtcbiAgICAgICAgcmV0dXJuIHRlYXJEb3duKClcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuc29ja2V0LnJlYWR5U3RhdGUgIT09ICdvcGVuJykge1xuICAgICAgICAvLyBTb2NrZXQgZXhpc3RzIGJ1dCBpc24ndCBpbiB0aGUgJ29wZW4nIHN0YXRlIChtaWQtaGFuZHNoYWtlLCBlcnJvcmVkLFxuICAgICAgICAvLyBvciBoYWxmLWNsb3NlZCBhZnRlciBhIGxvZ2luLXN0YWdlIGZhaWx1cmUgc3VjaCBhcyBHbWFpbCdzIFwiVG9vIG1hbnlcbiAgICAgICAgLy8gc2ltdWx0YW5lb3VzIGNvbm5lY3Rpb25zXCIpLiBQcmV2aW91c2x5IHdlIG1lcmVseSBkcm9wcGVkIHRoZSByZWZlcmVuY2VcbiAgICAgICAgLy8gaGVyZSwgbGVha2luZyB0aGUgdW5kZXJseWluZyBUQ1Agc29ja2V0IHVudGlsIEdDIC8gT1MgdGltZW91dCAtLSB3aGljaFxuICAgICAgICAvLyBrZWVwcyBjb3VudGluZyBhZ2FpbnN0IHRoZSBzZXJ2ZXIncyBwZXItYWNjb3VudCBjb25uZWN0aW9uIGxpbWl0IGFuZFxuICAgICAgICAvLyBjYW4gcGluIGJ1c3kgY2hhbm5lbHMgYXQgdGhlIGxpbWl0LiBGb3JjZSB0aGUgdW5kZXJseWluZyBzb2NrZXQgY2xvc2VkXG4gICAgICAgIC8vIGZpcnN0LCB0aGVuIHRlYXIgZG93bi5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICB0aGlzLnNvY2tldC5jbG9zZSgpXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAvLyB1bmRlcmx5aW5nIHNvY2tldCBhbHJlYWR5IGdvbmVcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGVhckRvd24oKVxuICAgICAgfVxuXG4gICAgICAvLyBCb3VuZCB0aGUgd2FpdDogaWYgdGhlIHNvY2tldCBuZXZlciByZXBvcnRzIGNsb3NlZCAoaGFsZi1vcGVuIGNvbm5lY3Rpb24pLFxuICAgICAgLy8gdGVhciBkb3duIGFueXdheSBzbyB0aGlzIHByb21pc2UgYWx3YXlzIHNldHRsZXMuIFNlZSBUSU1FT1VUX1NPQ0tFVF9DTE9TRS5cbiAgICAgIGNvbnN0IGNsb3NlVGltZXIgPSBzZXRUaW1lb3V0KHRlYXJEb3duLCBUSU1FT1VUX1NPQ0tFVF9DTE9TRSlcbiAgICAgIGNvbnN0IG9uU29ja2V0Q2xvc2VkID0gKCkgPT4ge1xuICAgICAgICBjbGVhclRpbWVvdXQoY2xvc2VUaW1lcilcbiAgICAgICAgdGVhckRvd24oKVxuICAgICAgfVxuXG4gICAgICB0aGlzLnNvY2tldC5vbmNsb3NlID0gdGhpcy5zb2NrZXQub25lcnJvciA9IG9uU29ja2V0Q2xvc2VkIC8vIHdlIGRvbid0IHJlYWxseSBjYXJlIGFib3V0IHRoZSBlcnJvciBoZXJlXG4gICAgICB0aGlzLnNvY2tldC5jbG9zZSgpXG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBTZW5kIExPR09VVCB0byB0aGUgc2VydmVyLlxuICAgKlxuICAgKiBBbHdheXMgc2V0dGxlczogdGhlIHNlcnZlciBjbG9zaW5nIHRoZSBjb25uZWN0aW9uLCB0aGUgc29ja2V0IGVycm9yaW5nLCBhXG4gICAqIGZhaWx1cmUgdG8gZXZlbiBlbnF1ZXVlIHRoZSBjb21tYW5kLCBhbmQgdGhlIHNlcnZlciBzaW1wbHkgbmV2ZXIgaGFuZ2luZyB1cFxuICAgKiBhbGwgY29udmVyZ2Ugb24gdGhlIHNhbWUgZm9yY2VkIGNsb3NlKCkuIFNlZSBUSU1FT1VUX0xPR09VVC5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9IFJlc29sdmVzIG9uY2UgdGhlIGNvbm5lY3Rpb24gaXMgY2xvc2VkLCBob3dldmVyIHRoYXQgaGFwcGVuZWQuXG4gICAqL1xuICBsb2dvdXQgKCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBsZXQgc2V0dGxlZCA9IGZhbHNlXG5cbiAgICAgIC8vIGNsb3NlKCkgaXMgaXRzZWxmIGJvdW5kZWQgKFRJTUVPVVRfU09DS0VUX0NMT1NFKSBhbmQgaXMgc2FmZSB0byBjYWxsIHdpdGggYVxuICAgICAgLy8gbnVsbCBzb2NrZXQsIHNvIHJvdXRpbmcgZXZlcnkgZXhpdCB0aHJvdWdoIGl0IGtlZXBzIHRlYXJkb3duIGluIG9uZSBwbGFjZS5cbiAgICAgIGNvbnN0IGZpbmlzaCA9ICgpID0+IHtcbiAgICAgICAgaWYgKHNldHRsZWQpIHJldHVyblxuICAgICAgICBzZXR0bGVkID0gdHJ1ZVxuICAgICAgICBjbGVhclRpbWVvdXQobG9nb3V0VGltZXIpXG4gICAgICAgIHRoaXMuY2xvc2UoJ0NsaWVudCBsb2dnaW5nIG91dCcpLnRoZW4ocmVzb2x2ZSkuY2F0Y2gocmVqZWN0KVxuICAgICAgfVxuXG4gICAgICBjb25zdCBsb2dvdXRUaW1lciA9IHNldFRpbWVvdXQoZmluaXNoLCBUSU1FT1VUX0xPR09VVClcblxuICAgICAgaWYgKCF0aGlzLnNvY2tldCkge1xuICAgICAgICByZXR1cm4gZmluaXNoKClcbiAgICAgIH1cblxuICAgICAgdGhpcy5zb2NrZXQub25jbG9zZSA9IHRoaXMuc29ja2V0Lm9uZXJyb3IgPSBmaW5pc2hcblxuICAgICAgdHJ5IHtcbiAgICAgICAgLy8gQSByZWplY3RlZCBjb21tYW5kIG1lYW5zIG5vIGNsb3NlL2Vycm9yIGV2ZW50IGlzIGNvbWluZyBmb3IgdXMgdG8gd2FpdFxuICAgICAgICAvLyBvbiwgYW5kIGFuIHVuaGFuZGxlZCByZWplY3Rpb24gaGVyZSB3b3VsZCBzdXJmYWNlIGFzIGEgcHJvY2VzcyB3YXJuaW5nLlxuICAgICAgICBjb25zdCBzZW50ID0gdGhpcy5lbnF1ZXVlQ29tbWFuZCgnTE9HT1VUJylcbiAgICAgICAgaWYgKHNlbnQgJiYgdHlwZW9mIHNlbnQuY2F0Y2ggPT09ICdmdW5jdGlvbicpIHNlbnQuY2F0Y2goKCkgPT4gZmluaXNoKCkpXG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGZpbmlzaCgpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBJbml0aWF0ZXMgVExTIGhhbmRzaGFrZVxuICAgKi9cbiAgdXBncmFkZSAoKSB7XG4gICAgdGhpcy5zZWN1cmVNb2RlID0gdHJ1ZVxuICAgIHRoaXMuc29ja2V0LnVwZ3JhZGVUb1NlY3VyZSgpXG4gIH1cblxuICAvKipcbiAgICogU2NoZWR1bGVzIGEgY29tbWFuZCB0byBiZSBzZW50IHRvIHRoZSBzZXJ2ZXIuXG4gICAqIFNlZSBodHRwczovL2dpdGh1Yi5jb20vZW1haWxqcy9lbWFpbGpzLWltYXAtaGFuZGxlciBmb3IgcmVxdWVzdCBzdHJ1Y3R1cmUuXG4gICAqIERvIG5vdCBwcm92aWRlIGEgdGFnIHByb3BlcnR5LCBpdCB3aWxsIGJlIHNldCBieSB0aGUgcXVldWUgbWFuYWdlci5cbiAgICpcbiAgICogVG8gY2F0Y2ggdW50YWdnZWQgcmVzcG9uc2VzIHVzZSBhY2NlcHRVbnRhZ2dlZCBwcm9wZXJ0eS4gRm9yIGV4YW1wbGUsIGlmXG4gICAqIHRoZSB2YWx1ZSBmb3IgaXQgaXMgJ0ZFVENIJyB0aGVuIHRoZSByZXBvbnNlIGluY2x1ZGVzICdwYXlsb2FkLkZFVENIJyBwcm9wZXJ0eVxuICAgKiB0aGF0IGlzIGFuIGFycmF5IGluY2x1ZGluZyBhbGwgbGlzdGVkICogRkVUQ0ggcmVzcG9uc2VzLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gcmVxdWVzdCBTdHJ1Y3R1cmVkIHJlcXVlc3Qgb2JqZWN0XG4gICAqIEBwYXJhbSB7QXJyYXl9IGFjY2VwdFVudGFnZ2VkIGEgbGlzdCBvZiB1bnRhZ2dlZCByZXNwb25zZXMgdGhhdCB3aWxsIGJlIGluY2x1ZGVkIGluICdwYXlsb2FkJyBwcm9wZXJ0eVxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdIE9wdGlvbmFsIGRhdGEgZm9yIHRoZSBjb21tYW5kIHBheWxvYWRcbiAgICogQHJldHVybnMge1Byb21pc2V9IFByb21pc2UgdGhhdCByZXNvbHZlcyB3aGVuIHRoZSBjb3JyZXNwb25kaW5nIHJlc3BvbnNlIHdhcyByZWNlaXZlZFxuICAgKi9cbiAgZW5xdWV1ZUNvbW1hbmQgKHJlcXVlc3QsIGFjY2VwdFVudGFnZ2VkLCBvcHRpb25zKSB7XG4gICAgaWYgKHR5cGVvZiByZXF1ZXN0ID09PSAnc3RyaW5nJykge1xuICAgICAgcmVxdWVzdCA9IHtcbiAgICAgICAgY29tbWFuZDogcmVxdWVzdFxuICAgICAgfVxuICAgIH1cblxuICAgIGFjY2VwdFVudGFnZ2VkID0gW10uY29uY2F0KGFjY2VwdFVudGFnZ2VkIHx8IFtdKS5tYXAoKHVudGFnZ2VkKSA9PiAodW50YWdnZWQgfHwgJycpLnRvU3RyaW5nKCkudG9VcHBlckNhc2UoKS50cmltKCkpXG5cbiAgICB2YXIgdGFnID0gJ1cnICsgKCsrdGhpcy5fdGFnQ291bnRlcilcbiAgICByZXF1ZXN0LnRhZyA9IHRhZ1xuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHZhciBkYXRhID0ge1xuICAgICAgICB0YWc6IHRhZyxcbiAgICAgICAgcmVxdWVzdDogcmVxdWVzdCxcbiAgICAgICAgcGF5bG9hZDogYWNjZXB0VW50YWdnZWQubGVuZ3RoID8ge30gOiB1bmRlZmluZWQsXG4gICAgICAgIGNhbGxiYWNrOiAocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICBpZiAodGhpcy5pc0Vycm9yKHJlc3BvbnNlKSkge1xuICAgICAgICAgICAgcmV0dXJuIHJlamVjdChyZXNwb25zZSlcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgY29tbWFuZCA9IHByb3BPcignJywgJ2NvbW1hbmQnLCByZXNwb25zZSkudG9VcHBlckNhc2UoKS50cmltKClcbiAgICAgICAgICAgIGlmIChbJ05PJywgJ0JBRCddLmluY2x1ZGVzKGNvbW1hbmQpKSB7XG4gICAgICAgICAgICAgIHZhciBlcnJvciA9IG5ldyBFcnJvcihyZXNwb25zZS5odW1hblJlYWRhYmxlIHx8ICdFcnJvcicpXG4gICAgICAgICAgICAgIGVycm9yLmNvbW1hbmQgPSBjb21tYW5kXG4gICAgICAgICAgICAgIGlmIChyZXNwb25zZS5jb2RlKSB7XG4gICAgICAgICAgICAgICAgZXJyb3IuY29kZSA9IHJlc3BvbnNlLmNvZGVcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZXR1cm4gcmVqZWN0KGVycm9yKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHJlc29sdmUocmVzcG9uc2UpXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gYXBwbHkgYW55IGFkZGl0aW9uYWwgb3B0aW9ucyB0byB0aGUgY29tbWFuZFxuICAgICAgT2JqZWN0LmtleXMob3B0aW9ucyB8fCB7fSkuZm9yRWFjaCgoa2V5KSA9PiB7IGRhdGFba2V5XSA9IG9wdGlvbnNba2V5XSB9KVxuXG4gICAgICBhY2NlcHRVbnRhZ2dlZC5mb3JFYWNoKChjb21tYW5kKSA9PiB7IGRhdGEucGF5bG9hZFtjb21tYW5kXSA9IFtdIH0pXG5cbiAgICAgIC8vIGlmIHdlJ3JlIGluIHByaW9yaXR5IG1vZGUgKGkuZS4gd2UgcmFuIGNvbW1hbmRzIGluIGEgcHJlY2hlY2spLFxuICAgICAgLy8gcXVldWUgYW55IGNvbW1hbmRzIEJFRk9SRSB0aGUgY29tbWFuZCB0aGF0IGNvbnRpYW5lZCB0aGUgcHJlY2hlY2ssXG4gICAgICAvLyBvdGhlcndpc2UganVzdCBxdWV1ZSBjb21tYW5kIGFzIHVzdWFsXG4gICAgICB2YXIgaW5kZXggPSBkYXRhLmN0eCA/IHRoaXMuX2NsaWVudFF1ZXVlLmluZGV4T2YoZGF0YS5jdHgpIDogLTFcbiAgICAgIGlmIChpbmRleCA+PSAwKSB7XG4gICAgICAgIGRhdGEudGFnICs9ICcucCdcbiAgICAgICAgZGF0YS5yZXF1ZXN0LnRhZyArPSAnLnAnXG4gICAgICAgIHRoaXMuX2NsaWVudFF1ZXVlLnNwbGljZShpbmRleCwgMCwgZGF0YSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2NsaWVudFF1ZXVlLnB1c2goZGF0YSlcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuX2NhblNlbmQpIHtcbiAgICAgICAgdGhpcy5fc2VuZFJlcXVlc3QoKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICAvKipcbiAgICpcbiAgICogQHBhcmFtIGNvbW1hbmRzXG4gICAqIEBwYXJhbSBjdHhcbiAgICogQHJldHVybnMgeyp9XG4gICAqL1xuICBnZXRQcmV2aW91c2x5UXVldWVkIChjb21tYW5kcywgY3R4KSB7XG4gICAgY29uc3Qgc3RhcnRJbmRleCA9IHRoaXMuX2NsaWVudFF1ZXVlLmluZGV4T2YoY3R4KSAtIDFcblxuICAgIC8vIHNlYXJjaCBiYWNrd2FyZHMgZm9yIHRoZSBjb21tYW5kcyBhbmQgcmV0dXJuIHRoZSBmaXJzdCBmb3VuZFxuICAgIGZvciAobGV0IGkgPSBzdGFydEluZGV4OyBpID49IDA7IGktLSkge1xuICAgICAgaWYgKGlzTWF0Y2godGhpcy5fY2xpZW50UXVldWVbaV0pKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9jbGllbnRRdWV1ZVtpXVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGFsc28gY2hlY2sgY3VycmVudCBjb21tYW5kIGlmIG5vIFNFTEVDVCBpcyBxdWV1ZWRcbiAgICBpZiAoaXNNYXRjaCh0aGlzLl9jdXJyZW50Q29tbWFuZCkpIHtcbiAgICAgIHJldHVybiB0aGlzLl9jdXJyZW50Q29tbWFuZFxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZVxuXG4gICAgZnVuY3Rpb24gaXNNYXRjaCAoZGF0YSkge1xuICAgICAgcmV0dXJuIGRhdGEgJiYgZGF0YS5yZXF1ZXN0ICYmIGNvbW1hbmRzLmluZGV4T2YoZGF0YS5yZXF1ZXN0LmNvbW1hbmQpID49IDBcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2VuZCBkYXRhIHRvIHRoZSBUQ1Agc29ja2V0XG4gICAqIEFybXMgYSB0aW1lb3V0IHdhaXRpbmcgZm9yIGEgcmVzcG9uc2UgZnJvbSB0aGUgc2VydmVyLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gc3RyIFBheWxvYWRcbiAgICovXG4gIHNlbmQgKHN0cikge1xuICAgIGNvbnN0IGJ1ZmZlciA9IHRvVHlwZWRBcnJheShzdHIpLmJ1ZmZlclxuICAgIHRoaXMuX3Jlc2V0U29ja2V0VGltZW91dChidWZmZXIuYnl0ZUxlbmd0aClcblxuICAgIGlmICh0aGlzLmNvbXByZXNzZWQpIHtcbiAgICAgIHRoaXMuX3NlbmRDb21wcmVzc2VkKGJ1ZmZlcilcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zb2NrZXQuc2VuZChidWZmZXIpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNldCBhIGdsb2JhbCBoYW5kbGVyIGZvciBhbiB1bnRhZ2dlZCByZXNwb25zZS4gSWYgY3VycmVudGx5IHByb2Nlc3NlZCBjb21tYW5kXG4gICAqIGhhcyBub3QgbGlzdGVkIHVudGFnZ2VkIGNvbW1hbmQgaXQgaXMgZm9yd2FyZGVkIHRvIHRoZSBnbG9iYWwgaGFuZGxlci4gVXNlZnVsXG4gICAqIHdpdGggRVhQVU5HRSwgRVhJU1RTIGV0Yy5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IGNvbW1hbmQgVW50YWdnZWQgY29tbWFuZCBuYW1lXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIENhbGxiYWNrIGZ1bmN0aW9uIHdpdGggcmVzcG9uc2Ugb2JqZWN0IGFuZCBjb250aW51ZSBjYWxsYmFjayBmdW5jdGlvblxuICAgKi9cbiAgc2V0SGFuZGxlciAoY29tbWFuZCwgY2FsbGJhY2spIHtcbiAgICB0aGlzLl9nbG9iYWxBY2NlcHRVbnRhZ2dlZFtjb21tYW5kLnRvVXBwZXJDYXNlKCkudHJpbSgpXSA9IGNhbGxiYWNrXG4gIH1cblxuICAvLyBJTlRFUk5BTCBFVkVOVFNcblxuICAvKipcbiAgICogRXJyb3IgaGFuZGxlciBmb3IgdGhlIHNvY2tldFxuICAgKlxuICAgKiBAZXZlbnRcbiAgICogQHBhcmFtIHtFdmVudH0gZXZ0IEV2ZW50IG9iamVjdC4gU2VlIGV2dC5kYXRhIGZvciB0aGUgZXJyb3JcbiAgICovXG4gIF9vbkVycm9yIChldnQpIHtcbiAgICB2YXIgZXJyb3JcbiAgICBpZiAodGhpcy5pc0Vycm9yKGV2dCkpIHtcbiAgICAgIGVycm9yID0gZXZ0XG4gICAgfSBlbHNlIGlmIChldnQgJiYgdGhpcy5pc0Vycm9yKGV2dC5kYXRhKSkge1xuICAgICAgZXJyb3IgPSBldnQuZGF0YVxuICAgIH0gZWxzZSB7XG4gICAgICBlcnJvciA9IG5ldyBFcnJvcigoZXZ0ICYmIGV2dC5kYXRhICYmIGV2dC5kYXRhLm1lc3NhZ2UpIHx8IGV2dC5kYXRhIHx8IGV2dCB8fCAnRXJyb3InKVxuICAgIH1cblxuICAgIHRoaXMubG9nZ2VyLmVycm9yKGVycm9yKVxuXG4gICAgLy8gYWx3YXlzIGNhbGwgb25lcnJvciBjYWxsYmFjaywgbm8gbWF0dGVyIGlmIGNsb3NlKCkgc3VjY2VlZHMgb3IgZmFpbHNcbiAgICB0aGlzLmNsb3NlKGVycm9yKS50aGVuKCgpID0+IHtcbiAgICAgIHRoaXMub25lcnJvciAmJiB0aGlzLm9uZXJyb3IoZXJyb3IpXG4gICAgfSwgKCkgPT4ge1xuICAgICAgdGhpcy5vbmVycm9yICYmIHRoaXMub25lcnJvcihlcnJvcilcbiAgICB9KVxuICB9XG5cbiAgLyoqXG4gICAqIEhhbmRsZXIgZm9yIGluY29taW5nIGRhdGEgZnJvbSB0aGUgc2VydmVyLiBUaGUgZGF0YSBpcyBzZW50IGluIGFyYml0cmFyeVxuICAgKiBjaHVua3MgYW5kIGNhbid0IGJlIHVzZWQgZGlyZWN0bHkgc28gdGhpcyBmdW5jdGlvbiBtYWtlcyBzdXJlIHRoZSBkYXRhXG4gICAqIGlzIHNwbGl0IGludG8gY29tcGxldGUgbGluZXMgYmVmb3JlIHRoZSBkYXRhIGlzIHBhc3NlZCB0byB0aGUgY29tbWFuZFxuICAgKiBoYW5kbGVyXG4gICAqXG4gICAqIEBwYXJhbSB7RXZlbnR9IGV2dFxuICAgKi9cbiAgX29uRGF0YSAoZXZ0KSB7XG4gICAgLy8gcmVzZXQgdGhlIHRpbWVvdXQgb24gZWFjaCBkYXRhIHBhY2tldFxuICAgIHRoaXMuX3Jlc2V0U29ja2V0VGltZW91dCgpXG5cbiAgICB0aGlzLl9pbmNvbWluZ0J1ZmZlcnMucHVzaChuZXcgVWludDhBcnJheShldnQuZGF0YSkpIC8vIGFwcGVuZCB0byB0aGUgaW5jb21pbmcgYnVmZmVyXG4gICAgdGhpcy5fcGFyc2VJbmNvbWluZ0NvbW1hbmRzKHRoaXMuX2l0ZXJhdGVJbmNvbWluZ0J1ZmZlcigpKSAvLyBDb25zdW1lIHRoZSBpbmNvbWluZyBidWZmZXJcbiAgfVxuXG4gICogX2l0ZXJhdGVJbmNvbWluZ0J1ZmZlciAoKSB7XG4gICAgbGV0IGJ1ZiA9IHRoaXMuX2luY29taW5nQnVmZmVyc1t0aGlzLl9pbmNvbWluZ0J1ZmZlcnMubGVuZ3RoIC0gMV0gfHwgW11cbiAgICBsZXQgaSA9IDBcblxuICAgIC8vIGxvb3AgaW52YXJpYW50OlxuICAgIC8vICAgdGhpcy5faW5jb21pbmdCdWZmZXJzIHN0YXJ0cyB3aXRoIHRoZSBiZWdpbm5pbmcgb2YgaW5jb21pbmcgY29tbWFuZC5cbiAgICAvLyAgIGJ1ZiBpcyBzaG9ydGhhbmQgZm9yIGxhc3QgZWxlbWVudCBvZiB0aGlzLl9pbmNvbWluZ0J1ZmZlcnMuXG4gICAgLy8gICBidWZbMC4uaS0xXSBpcyBwYXJ0IG9mIGluY29taW5nIGNvbW1hbmQuXG4gICAgd2hpbGUgKGkgPCBidWYubGVuZ3RoKSB7XG4gICAgICBzd2l0Y2ggKHRoaXMuX2J1ZmZlclN0YXRlKSB7XG4gICAgICAgIGNhc2UgQlVGRkVSX1NUQVRFX0xJVEVSQUw6XG4gICAgICAgICAgY29uc3QgZGlmZiA9IE1hdGgubWluKGJ1Zi5sZW5ndGggLSBpLCB0aGlzLl9saXRlcmFsUmVtYWluaW5nKVxuICAgICAgICAgIHRoaXMuX2xpdGVyYWxSZW1haW5pbmcgLT0gZGlmZlxuICAgICAgICAgIGkgKz0gZGlmZlxuICAgICAgICAgIGlmICh0aGlzLl9saXRlcmFsUmVtYWluaW5nID09PSAwKSB7XG4gICAgICAgICAgICB0aGlzLl9idWZmZXJTdGF0ZSA9IEJVRkZFUl9TVEFURV9ERUZBVUxUXG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnRpbnVlXG5cbiAgICAgICAgY2FzZSBCVUZGRVJfU1RBVEVfUE9TU0lCTFlfTElURVJBTF9MRU5HVEhfMjpcbiAgICAgICAgICBpZiAoaSA8IGJ1Zi5sZW5ndGgpIHtcbiAgICAgICAgICAgIGlmIChidWZbaV0gPT09IENBUlJJQUdFX1JFVFVSTikge1xuICAgICAgICAgICAgICB0aGlzLl9saXRlcmFsUmVtYWluaW5nID0gTnVtYmVyKGZyb21UeXBlZEFycmF5KHRoaXMuX2xlbmd0aEJ1ZmZlcikpICsgMiAvLyBmb3IgQ1JMRlxuICAgICAgICAgICAgICB0aGlzLl9idWZmZXJTdGF0ZSA9IEJVRkZFUl9TVEFURV9MSVRFUkFMXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0aGlzLl9idWZmZXJTdGF0ZSA9IEJVRkZFUl9TVEFURV9ERUZBVUxUXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkZWxldGUgdGhpcy5fbGVuZ3RoQnVmZmVyXG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnRpbnVlXG5cbiAgICAgICAgY2FzZSBCVUZGRVJfU1RBVEVfUE9TU0lCTFlfTElURVJBTF9MRU5HVEhfMTpcbiAgICAgICAgICBjb25zdCBzdGFydCA9IGlcbiAgICAgICAgICB3aGlsZSAoaSA8IGJ1Zi5sZW5ndGggJiYgYnVmW2ldID49IDQ4ICYmIGJ1ZltpXSA8PSA1NykgeyAvLyBkaWdpdHNcbiAgICAgICAgICAgIGkrK1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoc3RhcnQgIT09IGkpIHtcbiAgICAgICAgICAgIGNvbnN0IGxhdGVzdCA9IGJ1Zi5zdWJhcnJheShzdGFydCwgaSlcbiAgICAgICAgICAgIGNvbnN0IHByZXZCdWYgPSB0aGlzLl9sZW5ndGhCdWZmZXJcbiAgICAgICAgICAgIHRoaXMuX2xlbmd0aEJ1ZmZlciA9IG5ldyBVaW50OEFycmF5KHByZXZCdWYubGVuZ3RoICsgbGF0ZXN0Lmxlbmd0aClcbiAgICAgICAgICAgIHRoaXMuX2xlbmd0aEJ1ZmZlci5zZXQocHJldkJ1ZilcbiAgICAgICAgICAgIHRoaXMuX2xlbmd0aEJ1ZmZlci5zZXQobGF0ZXN0LCBwcmV2QnVmLmxlbmd0aClcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGkgPCBidWYubGVuZ3RoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fbGVuZ3RoQnVmZmVyLmxlbmd0aCA+IDAgJiYgYnVmW2ldID09PSBSSUdIVF9DVVJMWV9CUkFDS0VUKSB7XG4gICAgICAgICAgICAgIHRoaXMuX2J1ZmZlclN0YXRlID0gQlVGRkVSX1NUQVRFX1BPU1NJQkxZX0xJVEVSQUxfTEVOR1RIXzJcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9sZW5ndGhCdWZmZXJcbiAgICAgICAgICAgICAgdGhpcy5fYnVmZmVyU3RhdGUgPSBCVUZGRVJfU1RBVEVfREVGQVVMVFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaSsrXG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnRpbnVlXG5cbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAvLyBmaW5kIGxpdGVyYWwgbGVuZ3RoXG4gICAgICAgICAgY29uc3QgbGVmdElkeCA9IGJ1Zi5pbmRleE9mKExFRlRfQ1VSTFlfQlJBQ0tFVCwgaSlcbiAgICAgICAgICBpZiAobGVmdElkeCA+IC0xKSB7XG4gICAgICAgICAgICBjb25zdCBsZWZ0T2ZMZWZ0Q3VybHkgPSBuZXcgVWludDhBcnJheShidWYuYnVmZmVyLCBpLCBsZWZ0SWR4IC0gaSlcbiAgICAgICAgICAgIGlmIChsZWZ0T2ZMZWZ0Q3VybHkuaW5kZXhPZihMSU5FX0ZFRUQpID09PSAtMSkge1xuICAgICAgICAgICAgICBpID0gbGVmdElkeCArIDFcbiAgICAgICAgICAgICAgdGhpcy5fbGVuZ3RoQnVmZmVyID0gbmV3IFVpbnQ4QXJyYXkoMClcbiAgICAgICAgICAgICAgdGhpcy5fYnVmZmVyU3RhdGUgPSBCVUZGRVJfU1RBVEVfUE9TU0lCTFlfTElURVJBTF9MRU5HVEhfMVxuICAgICAgICAgICAgICBjb250aW51ZVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIGZpbmQgZW5kIG9mIGNvbW1hbmRcbiAgICAgICAgICBjb25zdCBMRmlkeCA9IGJ1Zi5pbmRleE9mKExJTkVfRkVFRCwgaSlcbiAgICAgICAgICBpZiAoTEZpZHggPiAtMSkge1xuICAgICAgICAgICAgaWYgKExGaWR4IDwgYnVmLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgdGhpcy5faW5jb21pbmdCdWZmZXJzW3RoaXMuX2luY29taW5nQnVmZmVycy5sZW5ndGggLSAxXSA9IG5ldyBVaW50OEFycmF5KGJ1Zi5idWZmZXIsIDAsIExGaWR4ICsgMSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGNvbW1hbmRMZW5ndGggPSB0aGlzLl9pbmNvbWluZ0J1ZmZlcnMucmVkdWNlKChwcmV2LCBjdXJyKSA9PiBwcmV2ICsgY3Vyci5sZW5ndGgsIDApIC0gMiAvLyAyIGZvciBDUkxGXG4gICAgICAgICAgICBjb25zdCBjb21tYW5kID0gbmV3IFVpbnQ4QXJyYXkoY29tbWFuZExlbmd0aClcbiAgICAgICAgICAgIGxldCBpbmRleCA9IDBcbiAgICAgICAgICAgIHdoaWxlICh0aGlzLl9pbmNvbWluZ0J1ZmZlcnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICBsZXQgdWludDhBcnJheSA9IHRoaXMuX2luY29taW5nQnVmZmVycy5zaGlmdCgpXG5cbiAgICAgICAgICAgICAgY29uc3QgcmVtYWluaW5nTGVuZ3RoID0gY29tbWFuZExlbmd0aCAtIGluZGV4XG4gICAgICAgICAgICAgIGlmICh1aW50OEFycmF5Lmxlbmd0aCA+IHJlbWFpbmluZ0xlbmd0aCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGV4Y2Vzc0xlbmd0aCA9IHVpbnQ4QXJyYXkubGVuZ3RoIC0gcmVtYWluaW5nTGVuZ3RoXG4gICAgICAgICAgICAgICAgdWludDhBcnJheSA9IHVpbnQ4QXJyYXkuc3ViYXJyYXkoMCwgLWV4Y2Vzc0xlbmd0aClcblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9pbmNvbWluZ0J1ZmZlcnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgdGhpcy5faW5jb21pbmdCdWZmZXJzID0gW11cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgY29tbWFuZC5zZXQodWludDhBcnJheSwgaW5kZXgpXG4gICAgICAgICAgICAgIGluZGV4ICs9IHVpbnQ4QXJyYXkubGVuZ3RoXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB5aWVsZCBjb21tYW5kXG4gICAgICAgICAgICBpZiAoTEZpZHggPCBidWYubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgICBidWYgPSBuZXcgVWludDhBcnJheShidWYuc3ViYXJyYXkoTEZpZHggKyAxKSlcbiAgICAgICAgICAgICAgdGhpcy5faW5jb21pbmdCdWZmZXJzLnB1c2goYnVmKVxuICAgICAgICAgICAgICBpID0gMFxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgLy8gY2xlYXIgdGhlIHRpbWVvdXQgd2hlbiBhbiBlbnRpcmUgY29tbWFuZCBoYXMgYXJyaXZlZFxuICAgICAgICAgICAgICAvLyBhbmQgbm90IHdhaXRpbmcgb24gbW9yZSBkYXRhIGZvciBuZXh0IGNvbW1hbmRcbiAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX3NvY2tldFRpbWVvdXRUaW1lcilcbiAgICAgICAgICAgICAgdGhpcy5fc29ja2V0VGltZW91dFRpbWVyID0gbnVsbFxuICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIFBSSVZBVEUgTUVUSE9EU1xuXG4gIC8qKlxuICAgKiBQcm9jZXNzZXMgYSBjb21tYW5kIGZyb20gdGhlIHF1ZXVlLiBUaGUgY29tbWFuZCBpcyBwYXJzZWQgYW5kIGZlZWRlZCB0byBhIGhhbmRsZXJcbiAgICovXG4gIF9wYXJzZUluY29taW5nQ29tbWFuZHMgKGNvbW1hbmRzKSB7XG4gICAgZm9yICh2YXIgY29tbWFuZCBvZiBjb21tYW5kcykge1xuICAgICAgdGhpcy5fY2xlYXJJZGxlKClcblxuICAgICAgLypcbiAgICAgICAqIFRoZSBcIitcIi10YWdnZWQgcmVzcG9uc2UgaXMgYSBzcGVjaWFsIGNhc2U6XG4gICAgICAgKiBFaXRoZXIgdGhlIHNlcnZlciBjYW4gYXNrcyBmb3IgdGhlIG5leHQgY2h1bmsgb2YgZGF0YSwgZS5nLiBmb3IgdGhlIEFVVEhFTlRJQ0FURSBjb21tYW5kLlxuICAgICAgICpcbiAgICAgICAqIE9yIHRoZXJlIHdhcyBhbiBlcnJvciBpbiB0aGUgWE9BVVRIMiBhdXRoZW50aWNhdGlvbiwgZm9yIHdoaWNoIFNBU0wgaW5pdGlhbCBjbGllbnQgcmVzcG9uc2UgZXh0ZW5zaW9uXG4gICAgICAgKiBkaWN0YXRlcyB0aGUgY2xpZW50IHNlbmRzIGFuIGVtcHR5IEVPTCByZXNwb25zZSB0byB0aGUgY2hhbGxlbmdlIGNvbnRhaW5pbmcgdGhlIGVycm9yIG1lc3NhZ2UuXG4gICAgICAgKlxuICAgICAgICogRGV0YWlscyBvbiBcIitcIi10YWdnZWQgcmVzcG9uc2U6XG4gICAgICAgKiAgIGh0dHBzOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmMzNTAxI3NlY3Rpb24tMi4yLjFcbiAgICAgICAqL1xuICAgICAgLy9cbiAgICAgIGlmIChjb21tYW5kWzBdID09PSBBU0NJSV9QTFVTKSB7XG4gICAgICAgIGlmICh0aGlzLl9jdXJyZW50Q29tbWFuZC5kYXRhLmxlbmd0aCkge1xuICAgICAgICAgIC8vIGZlZWQgdGhlIG5leHQgY2h1bmsgb2YgZGF0YVxuICAgICAgICAgIHZhciBjaHVuayA9IHRoaXMuX2N1cnJlbnRDb21tYW5kLmRhdGEuc2hpZnQoKVxuICAgICAgICAgIGNodW5rICs9ICghdGhpcy5fY3VycmVudENvbW1hbmQuZGF0YS5sZW5ndGggPyBFT0wgOiAnJykgLy8gRU9MIGlmIHRoZXJlJ3Mgbm90aGluZyBtb3JlIHRvIHNlbmRcbiAgICAgICAgICB0aGlzLnNlbmQoY2h1bmspXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5fY3VycmVudENvbW1hbmQuZXJyb3JSZXNwb25zZUV4cGVjdHNFbXB0eUxpbmUpIHtcbiAgICAgICAgICB0aGlzLnNlbmQoRU9MKSAvLyBYT0FVVEgyIGVtcHR5IHJlc3BvbnNlLCBlcnJvciB3aWxsIGJlIHJlcG9ydGVkIHdoZW4gc2VydmVyIGNvbnRpbnVlcyB3aXRoIE5PIHJlc3BvbnNlXG4gICAgICAgIH1cbiAgICAgICAgY29udGludWVcbiAgICAgIH1cblxuICAgICAgdmFyIHJlc3BvbnNlXG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCB2YWx1ZUFzU3RyaW5nID0gdGhpcy5fY3VycmVudENvbW1hbmQucmVxdWVzdCAmJiB0aGlzLl9jdXJyZW50Q29tbWFuZC5yZXF1ZXN0LnZhbHVlQXNTdHJpbmdcbiAgICAgICAgcmVzcG9uc2UgPSBwYXJzZXIoY29tbWFuZCwgeyB2YWx1ZUFzU3RyaW5nIH0pXG4gICAgICAgIHRoaXMubG9nZ2VyLmRlYnVnKCdTOicsICgpID0+IGNvbXBpbGVyKHJlc3BvbnNlLCBmYWxzZSwgdHJ1ZSkpXG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHRoaXMubG9nZ2VyLmVycm9yKCdFcnJvciBwYXJzaW5nIGltYXAgY29tbWFuZCEnLCByZXNwb25zZSlcbiAgICAgICAgcmV0dXJuIHRoaXMuX29uRXJyb3IoZSlcbiAgICAgIH1cblxuICAgICAgdGhpcy5fcHJvY2Vzc1Jlc3BvbnNlKHJlc3BvbnNlKVxuICAgICAgdGhpcy5faGFuZGxlUmVzcG9uc2UocmVzcG9uc2UpXG5cbiAgICAgIC8vIGZpcnN0IHJlc3BvbnNlIGZyb20gdGhlIHNlcnZlciwgY29ubmVjdGlvbiBpcyBub3cgdXNhYmxlXG4gICAgICBpZiAoIXRoaXMuX2Nvbm5lY3Rpb25SZWFkeSkge1xuICAgICAgICB0aGlzLl9jb25uZWN0aW9uUmVhZHkgPSB0cnVlXG4gICAgICAgIHRoaXMub25yZWFkeSAmJiB0aGlzLm9ucmVhZHkoKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBGZWVkcyBhIHBhcnNlZCByZXNwb25zZSBvYmplY3QgdG8gYW4gYXBwcm9wcmlhdGUgaGFuZGxlclxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gcmVzcG9uc2UgUGFyc2VkIGNvbW1hbmQgb2JqZWN0XG4gICAqL1xuICBfaGFuZGxlUmVzcG9uc2UgKHJlc3BvbnNlKSB7XG4gICAgdmFyIGNvbW1hbmQgPSBwcm9wT3IoJycsICdjb21tYW5kJywgcmVzcG9uc2UpLnRvVXBwZXJDYXNlKCkudHJpbSgpXG5cbiAgICBpZiAoIXRoaXMuX2N1cnJlbnRDb21tYW5kKSB7XG4gICAgICAvLyB1bnNvbGljaXRlZCB1bnRhZ2dlZCByZXNwb25zZVxuICAgICAgaWYgKHJlc3BvbnNlLnRhZyA9PT0gJyonICYmIGNvbW1hbmQgaW4gdGhpcy5fZ2xvYmFsQWNjZXB0VW50YWdnZWQpIHtcbiAgICAgICAgdGhpcy5fZ2xvYmFsQWNjZXB0VW50YWdnZWRbY29tbWFuZF0ocmVzcG9uc2UpXG4gICAgICAgIHRoaXMuX2NhblNlbmQgPSB0cnVlXG4gICAgICAgIHRoaXMuX3NlbmRSZXF1ZXN0KClcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHRoaXMuX2N1cnJlbnRDb21tYW5kLnBheWxvYWQgJiYgcmVzcG9uc2UudGFnID09PSAnKicgJiYgY29tbWFuZCBpbiB0aGlzLl9jdXJyZW50Q29tbWFuZC5wYXlsb2FkKSB7XG4gICAgICAvLyBleHBlY3RlZCB1bnRhZ2dlZCByZXNwb25zZVxuICAgICAgdGhpcy5fY3VycmVudENvbW1hbmQucGF5bG9hZFtjb21tYW5kXS5wdXNoKHJlc3BvbnNlKVxuICAgICAgLy8gc3RpbGwgZXhwZWN0aW5nIG1vcmUgZGF0YSBmb3IgdGhlIHJlc3BvbnNlIG9mIHRoZSBjdXJyZW50IGNvbW1hbmRcbiAgICAgIHRoaXMuX3Jlc2V0U29ja2V0VGltZW91dCgpXG4gICAgfSBlbHNlIGlmIChyZXNwb25zZS50YWcgPT09ICcqJyAmJiBjb21tYW5kIGluIHRoaXMuX2dsb2JhbEFjY2VwdFVudGFnZ2VkKSB7XG4gICAgICAvLyB1bmV4cGVjdGVkIHVudGFnZ2VkIHJlc3BvbnNlXG4gICAgICB0aGlzLl9nbG9iYWxBY2NlcHRVbnRhZ2dlZFtjb21tYW5kXShyZXNwb25zZSlcbiAgICAgIC8vIHN0aWxsIGV4cGVjdGluZyBtb3JlIGRhdGEgZm9yIHRoZSByZXNwb25zZSBvZiB0aGUgY3VycmVudCBjb21tYW5kXG4gICAgICB0aGlzLl9yZXNldFNvY2tldFRpbWVvdXQoKVxuICAgIH0gZWxzZSBpZiAocmVzcG9uc2UudGFnID09PSB0aGlzLl9jdXJyZW50Q29tbWFuZC50YWcpIHtcbiAgICAgIC8vIHRhZ2dlZCByZXNwb25zZVxuICAgICAgaWYgKHRoaXMuX2N1cnJlbnRDb21tYW5kLnBheWxvYWQgJiYgT2JqZWN0LmtleXModGhpcy5fY3VycmVudENvbW1hbmQucGF5bG9hZCkubGVuZ3RoKSB7XG4gICAgICAgIHJlc3BvbnNlLnBheWxvYWQgPSB0aGlzLl9jdXJyZW50Q29tbWFuZC5wYXlsb2FkXG4gICAgICB9XG4gICAgICB0aGlzLl9jdXJyZW50Q29tbWFuZC5jYWxsYmFjayhyZXNwb25zZSlcbiAgICAgIHRoaXMuX2NhblNlbmQgPSB0cnVlXG4gICAgICB0aGlzLl9zZW5kUmVxdWVzdCgpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNlbmRzIGEgY29tbWFuZCBmcm9tIGNsaWVudCBxdWV1ZSB0byB0aGUgc2VydmVyLlxuICAgKi9cbiAgX3NlbmRSZXF1ZXN0ICgpIHtcbiAgICBpZiAoIXRoaXMuX2NsaWVudFF1ZXVlLmxlbmd0aCkge1xuICAgICAgdGhpcy5fY3VycmVudENvbW1hbmQgPSBmYWxzZVxuICAgICAgcmV0dXJuIHRoaXMuX2VudGVySWRsZSgpXG4gICAgfVxuICAgIHRoaXMuX2NsZWFySWRsZSgpXG5cbiAgICAvLyBhbiBvcGVyYXRpb24gd2FzIG1hZGUgaW4gdGhlIHByZWNoZWNrLCBubyBuZWVkIHRvIHJlc3RhcnQgdGhlIHF1ZXVlIG1hbnVhbGx5XG4gICAgdGhpcy5fcmVzdGFydFF1ZXVlID0gZmFsc2VcblxuICAgIHZhciBjb21tYW5kID0gdGhpcy5fY2xpZW50UXVldWVbMF1cbiAgICBpZiAodHlwZW9mIGNvbW1hbmQucHJlY2hlY2sgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIC8vIHJlbWVtYmVyIHRoZSBjb250ZXh0XG4gICAgICB2YXIgY29udGV4dCA9IGNvbW1hbmRcbiAgICAgIHZhciBwcmVjaGVjayA9IGNvbnRleHQucHJlY2hlY2tcbiAgICAgIGRlbGV0ZSBjb250ZXh0LnByZWNoZWNrXG5cbiAgICAgIC8vIHdlIG5lZWQgdG8gcmVzdGFydCB0aGUgcXVldWUgaGFuZGxpbmcgaWYgbm8gb3BlcmF0aW9uIHdhcyBtYWRlIGluIHRoZSBwcmVjaGVja1xuICAgICAgdGhpcy5fcmVzdGFydFF1ZXVlID0gdHJ1ZVxuXG4gICAgICAvLyBpbnZva2UgdGhlIHByZWNoZWNrIGNvbW1hbmQgYW5kIHJlc3VtZSBub3JtYWwgb3BlcmF0aW9uIGFmdGVyIHRoZSBwcm9taXNlIHJlc29sdmVzXG4gICAgICBwcmVjaGVjayhjb250ZXh0KS50aGVuKCgpID0+IHtcbiAgICAgICAgLy8gd2UncmUgZG9uZSB3aXRoIHRoZSBwcmVjaGVja1xuICAgICAgICBpZiAodGhpcy5fcmVzdGFydFF1ZXVlKSB7XG4gICAgICAgICAgLy8gd2UgbmVlZCB0byByZXN0YXJ0IHRoZSBxdWV1ZSBoYW5kbGluZ1xuICAgICAgICAgIHRoaXMuX3NlbmRSZXF1ZXN0KClcbiAgICAgICAgfVxuICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAvLyBwcmVjaGVjayBmYWlsZWQsIHNvIHdlIHJlbW92ZSB0aGUgaW5pdGlhbCBjb21tYW5kXG4gICAgICAgIC8vIGZyb20gdGhlIHF1ZXVlLCBpbnZva2UgaXRzIGNhbGxiYWNrIGFuZCByZXN1bWUgbm9ybWFsIG9wZXJhdGlvblxuICAgICAgICBsZXQgY21kXG4gICAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5fY2xpZW50UXVldWUuaW5kZXhPZihjb250ZXh0KVxuICAgICAgICBpZiAoaW5kZXggPj0gMCkge1xuICAgICAgICAgIGNtZCA9IHRoaXMuX2NsaWVudFF1ZXVlLnNwbGljZShpbmRleCwgMSlbMF1cbiAgICAgICAgfVxuICAgICAgICBpZiAoY21kICYmIGNtZC5jYWxsYmFjaykge1xuICAgICAgICAgIGNtZC5jYWxsYmFjayhlcnIpXG4gICAgICAgICAgdGhpcy5fY2FuU2VuZCA9IHRydWVcbiAgICAgICAgICB0aGlzLl9wYXJzZUluY29taW5nQ29tbWFuZHModGhpcy5faXRlcmF0ZUluY29taW5nQnVmZmVyKCkpIC8vIENvbnN1bWUgdGhlIHJlc3Qgb2YgdGhlIGluY29taW5nIGJ1ZmZlclxuICAgICAgICAgIHRoaXMuX3NlbmRSZXF1ZXN0KCkgLy8gY29udGludWUgc2VuZGluZ1xuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgdGhpcy5fY2FuU2VuZCA9IGZhbHNlXG4gICAgdGhpcy5fY3VycmVudENvbW1hbmQgPSB0aGlzLl9jbGllbnRRdWV1ZS5zaGlmdCgpXG5cbiAgICB0cnkge1xuICAgICAgdGhpcy5fY3VycmVudENvbW1hbmQuZGF0YSA9IGNvbXBpbGVyKHRoaXMuX2N1cnJlbnRDb21tYW5kLnJlcXVlc3QsIHRydWUpXG4gICAgICB0aGlzLmxvZ2dlci5kZWJ1ZygnQzonLCAoKSA9PiBjb21waWxlcih0aGlzLl9jdXJyZW50Q29tbWFuZC5yZXF1ZXN0LCBmYWxzZSwgdHJ1ZSkpIC8vIGV4Y2x1ZGVzIHBhc3N3b3JkcyBldGMuXG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgdGhpcy5sb2dnZXIuZXJyb3IoJ0Vycm9yIGNvbXBpbGluZyBpbWFwIGNvbW1hbmQhJywgdGhpcy5fY3VycmVudENvbW1hbmQucmVxdWVzdClcbiAgICAgIHJldHVybiB0aGlzLl9vbkVycm9yKG5ldyBFcnJvcignRXJyb3IgY29tcGlsaW5nIGltYXAgY29tbWFuZCEnKSlcbiAgICB9XG5cbiAgICB2YXIgZGF0YSA9IHRoaXMuX2N1cnJlbnRDb21tYW5kLmRhdGEuc2hpZnQoKVxuXG4gICAgdGhpcy5zZW5kKGRhdGEgKyAoIXRoaXMuX2N1cnJlbnRDb21tYW5kLmRhdGEubGVuZ3RoID8gRU9MIDogJycpKVxuICAgIHJldHVybiB0aGlzLndhaXREcmFpblxuICB9XG5cbiAgLyoqXG4gICAqIEVtaXRzIG9uaWRsZSwgbm90aW5nIHRvIGRvIGN1cnJlbnRseVxuICAgKi9cbiAgX2VudGVySWRsZSAoKSB7XG4gICAgY2xlYXJUaW1lb3V0KHRoaXMuX2lkbGVUaW1lcilcbiAgICB0aGlzLl9pZGxlVGltZXIgPSBzZXRUaW1lb3V0KCgpID0+ICh0aGlzLm9uaWRsZSAmJiB0aGlzLm9uaWRsZSgpKSwgdGhpcy50aW1lb3V0RW50ZXJJZGxlKVxuICB9XG5cbiAgLyoqXG4gICAqIENhbmNlbCBpZGxlIHRpbWVyXG4gICAqL1xuICBfY2xlYXJJZGxlICgpIHtcbiAgICBjbGVhclRpbWVvdXQodGhpcy5faWRsZVRpbWVyKVxuICAgIHRoaXMuX2lkbGVUaW1lciA9IG51bGxcbiAgfVxuXG4gIC8qKlxuICAgKiBNZXRob2QgcHJvY2Vzc2VzIGEgcmVzcG9uc2UgaW50byBhbiBlYXNpZXIgdG8gaGFuZGxlIGZvcm1hdC5cbiAgICogQWRkIHVudGFnZ2VkIG51bWJlcmVkIHJlc3BvbnNlcyAoZS5nLiBGRVRDSCkgaW50byBhIG5pY2VseSBmZWFzaWJsZSBmb3JtXG4gICAqIENoZWNrcyBpZiBhIHJlc3BvbnNlIGluY2x1ZGVzIG9wdGlvbmFsIHJlc3BvbnNlIGNvZGVzXG4gICAqIGFuZCBjb3BpZXMgdGhlc2UgaW50byBzZXBhcmF0ZSBwcm9wZXJ0aWVzLiBGb3IgZXhhbXBsZSB0aGVcbiAgICogZm9sbG93aW5nIHJlc3BvbnNlIGluY2x1ZGVzIGEgY2FwYWJpbGl0eSBsaXN0aW5nIGFuZCBhIGh1bWFuXG4gICAqIHJlYWRhYmxlIG1lc3NhZ2U6XG4gICAqXG4gICAqICAgICAqIE9LIFtDQVBBQklMSVRZIElEIE5BTUVTUEFDRV0gQWxsIHJlYWR5XG4gICAqXG4gICAqIFRoaXMgbWV0aG9kIGFkZHMgYSAnY2FwYWJpbGl0eScgcHJvcGVydHkgd2l0aCBhbiBhcnJheSB2YWx1ZSBbJ0lEJywgJ05BTUVTUEFDRSddXG4gICAqIHRvIHRoZSByZXNwb25zZSBvYmplY3QuIEFkZGl0aW9uYWxseSAnQWxsIHJlYWR5JyBpcyBhZGRlZCBhcyAnaHVtYW5SZWFkYWJsZScgcHJvcGVydHkuXG4gICAqXG4gICAqIFNlZSBwb3NzaWJsZW0gSU1BUCBSZXNwb25zZSBDb2RlcyBhdCBodHRwczovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjNTUzMFxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gcmVzcG9uc2UgUGFyc2VkIHJlc3BvbnNlIG9iamVjdFxuICAgKi9cbiAgX3Byb2Nlc3NSZXNwb25zZSAocmVzcG9uc2UpIHtcbiAgICBjb25zdCBjb21tYW5kID0gcHJvcE9yKCcnLCAnY29tbWFuZCcsIHJlc3BvbnNlKS50b1VwcGVyQ2FzZSgpLnRyaW0oKVxuXG4gICAgLy8gbm8gYXR0cmlidXRlc1xuICAgIGlmICghcmVzcG9uc2UgfHwgIXJlc3BvbnNlLmF0dHJpYnV0ZXMgfHwgIXJlc3BvbnNlLmF0dHJpYnV0ZXMubGVuZ3RoKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICAvLyB1bnRhZ2dlZCByZXNwb25zZXMgdy8gc2VxdWVuY2UgbnVtYmVyc1xuICAgIGlmIChyZXNwb25zZS50YWcgPT09ICcqJyAmJiAvXlxcZCskLy50ZXN0KHJlc3BvbnNlLmNvbW1hbmQpICYmIHJlc3BvbnNlLmF0dHJpYnV0ZXNbMF0udHlwZSA9PT0gJ0FUT00nKSB7XG4gICAgICByZXNwb25zZS5uciA9IE51bWJlcihyZXNwb25zZS5jb21tYW5kKVxuICAgICAgcmVzcG9uc2UuY29tbWFuZCA9IChyZXNwb25zZS5hdHRyaWJ1dGVzLnNoaWZ0KCkudmFsdWUgfHwgJycpLnRvU3RyaW5nKCkudG9VcHBlckNhc2UoKS50cmltKClcbiAgICB9XG5cbiAgICAvLyBubyBvcHRpb25hbCByZXNwb25zZSBjb2RlXG4gICAgaWYgKFsnT0snLCAnTk8nLCAnQkFEJywgJ0JZRScsICdQUkVBVVRIJ10uaW5kZXhPZihjb21tYW5kKSA8IDApIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIC8vIElmIGxhc3QgZWxlbWVudCBvZiB0aGUgcmVzcG9uc2UgaXMgVEVYVCB0aGVuIHRoaXMgaXMgZm9yIGh1bWFuc1xuICAgIGlmIChyZXNwb25zZS5hdHRyaWJ1dGVzW3Jlc3BvbnNlLmF0dHJpYnV0ZXMubGVuZ3RoIC0gMV0udHlwZSA9PT0gJ1RFWFQnKSB7XG4gICAgICByZXNwb25zZS5odW1hblJlYWRhYmxlID0gcmVzcG9uc2UuYXR0cmlidXRlc1tyZXNwb25zZS5hdHRyaWJ1dGVzLmxlbmd0aCAtIDFdLnZhbHVlXG4gICAgfVxuXG4gICAgLy8gUGFyc2UgYW5kIGZvcm1hdCBBVE9NIHZhbHVlc1xuICAgIGlmIChyZXNwb25zZS5hdHRyaWJ1dGVzWzBdLnR5cGUgPT09ICdBVE9NJyAmJiByZXNwb25zZS5hdHRyaWJ1dGVzWzBdLnNlY3Rpb24pIHtcbiAgICAgIGNvbnN0IG9wdGlvbiA9IHJlc3BvbnNlLmF0dHJpYnV0ZXNbMF0uc2VjdGlvbi5tYXAoKGtleSkgPT4ge1xuICAgICAgICBpZiAoIWtleSkge1xuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KGtleSkpIHtcbiAgICAgICAgICByZXR1cm4ga2V5Lm1hcCgoa2V5KSA9PiAoa2V5LnZhbHVlIHx8ICcnKS50b1N0cmluZygpLnRyaW0oKSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gKGtleS52YWx1ZSB8fCAnJykudG9TdHJpbmcoKS50b1VwcGVyQ2FzZSgpLnRyaW0oKVxuICAgICAgICB9XG4gICAgICB9KVxuXG4gICAgICBjb25zdCBrZXkgPSBvcHRpb24uc2hpZnQoKVxuICAgICAgcmVzcG9uc2UuY29kZSA9IGtleVxuXG4gICAgICBpZiAob3B0aW9uLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICByZXNwb25zZVtrZXkudG9Mb3dlckNhc2UoKV0gPSBvcHRpb25bMF1cbiAgICAgIH0gZWxzZSBpZiAob3B0aW9uLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgcmVzcG9uc2Vba2V5LnRvTG93ZXJDYXNlKCldID0gb3B0aW9uXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiBhIHZhbHVlIGlzIGFuIEVycm9yIG9iamVjdFxuICAgKlxuICAgKiBAcGFyYW0ge01peGVkfSB2YWx1ZSBWYWx1ZSB0byBiZSBjaGVja2VkXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59IHJldHVybnMgdHJ1ZSBpZiB0aGUgdmFsdWUgaXMgYW4gRXJyb3JcbiAgICovXG4gIGlzRXJyb3IgKHZhbHVlKSB7XG4gICAgcmV0dXJuICEhT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKS5tYXRjaCgvRXJyb3JcXF0kLylcbiAgfVxuXG4gIC8vIENPTVBSRVNTSU9OIFJFTEFURUQgTUVUSE9EU1xuXG4gIC8qKlxuICAgKiBTZXRzIHVwIGRlZmxhdGUvaW5mbGF0ZSBmb3IgdGhlIElPXG4gICAqL1xuICBlbmFibGVDb21wcmVzc2lvbiAoKSB7XG4gICAgdGhpcy5fc29ja2V0T25EYXRhID0gdGhpcy5zb2NrZXQub25kYXRhXG4gICAgdGhpcy5jb21wcmVzc2VkID0gdHJ1ZVxuXG4gICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5Xb3JrZXIpIHtcbiAgICAgIHRoaXMuX2NvbXByZXNzaW9uV29ya2VyID0gbmV3IFdvcmtlcihVUkwuY3JlYXRlT2JqZWN0VVJMKG5ldyBCbG9iKFtDb21wcmVzc2lvbkJsb2JdKSkpXG4gICAgICB0aGlzLl9jb21wcmVzc2lvbldvcmtlci5vbm1lc3NhZ2UgPSAoZSkgPT4ge1xuICAgICAgICB2YXIgbWVzc2FnZSA9IGUuZGF0YS5tZXNzYWdlXG4gICAgICAgIHZhciBkYXRhID0gZS5kYXRhLmJ1ZmZlclxuXG4gICAgICAgIHN3aXRjaCAobWVzc2FnZSkge1xuICAgICAgICAgIGNhc2UgTUVTU0FHRV9JTkZMQVRFRF9EQVRBX1JFQURZOlxuICAgICAgICAgICAgdGhpcy5fc29ja2V0T25EYXRhKHsgZGF0YSB9KVxuICAgICAgICAgICAgYnJlYWtcblxuICAgICAgICAgIGNhc2UgTUVTU0FHRV9ERUZMQVRFRF9EQVRBX1JFQURZOlxuICAgICAgICAgICAgdGhpcy53YWl0RHJhaW4gPSB0aGlzLnNvY2tldC5zZW5kKGRhdGEpXG4gICAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX2NvbXByZXNzaW9uV29ya2VyLm9uZXJyb3IgPSAoZSkgPT4ge1xuICAgICAgICB0aGlzLl9vbkVycm9yKG5ldyBFcnJvcignRXJyb3IgaGFuZGxpbmcgY29tcHJlc3Npb24gd2ViIHdvcmtlcjogJyArIGUubWVzc2FnZSkpXG4gICAgICB9XG5cbiAgICAgIHRoaXMuX2NvbXByZXNzaW9uV29ya2VyLnBvc3RNZXNzYWdlKGNyZWF0ZU1lc3NhZ2UoTUVTU0FHRV9JTklUSUFMSVpFX1dPUktFUikpXG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGluZmxhdGVkUmVhZHkgPSAoYnVmZmVyKSA9PiB7IHRoaXMuX3NvY2tldE9uRGF0YSh7IGRhdGE6IGJ1ZmZlciB9KSB9XG4gICAgICBjb25zdCBkZWZsYXRlZFJlYWR5ID0gKGJ1ZmZlcikgPT4geyB0aGlzLndhaXREcmFpbiA9IHRoaXMuc29ja2V0LnNlbmQoYnVmZmVyKSB9XG4gICAgICB0aGlzLl9jb21wcmVzc2lvbiA9IG5ldyBDb21wcmVzc2lvbihpbmZsYXRlZFJlYWR5LCBkZWZsYXRlZFJlYWR5KVxuICAgIH1cblxuICAgIC8vIG92ZXJyaWRlIGRhdGEgaGFuZGxlciwgZGVjb21wcmVzcyBpbmNvbWluZyBkYXRhXG4gICAgdGhpcy5zb2NrZXQub25kYXRhID0gKGV2dCkgPT4ge1xuICAgICAgaWYgKCF0aGlzLmNvbXByZXNzZWQpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLl9jb21wcmVzc2lvbldvcmtlcikge1xuICAgICAgICB0aGlzLl9jb21wcmVzc2lvbldvcmtlci5wb3N0TWVzc2FnZShjcmVhdGVNZXNzYWdlKE1FU1NBR0VfSU5GTEFURSwgZXZ0LmRhdGEpLCBbZXZ0LmRhdGFdKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fY29tcHJlc3Npb24uaW5mbGF0ZShldnQuZGF0YSlcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVW5kb2VzIGFueSBjaGFuZ2VzIHJlbGF0ZWQgdG8gY29tcHJlc3Npb24uIFRoaXMgb25seSBiZSBjYWxsZWQgd2hlbiBjbG9zaW5nIHRoZSBjb25uZWN0aW9uXG4gICAqL1xuICBfZGlzYWJsZUNvbXByZXNzaW9uICgpIHtcbiAgICBpZiAoIXRoaXMuY29tcHJlc3NlZCkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgdGhpcy5jb21wcmVzc2VkID0gZmFsc2VcbiAgICB0aGlzLnNvY2tldC5vbmRhdGEgPSB0aGlzLl9zb2NrZXRPbkRhdGFcbiAgICB0aGlzLl9zb2NrZXRPbkRhdGEgPSBudWxsXG5cbiAgICBpZiAodGhpcy5fY29tcHJlc3Npb25Xb3JrZXIpIHtcbiAgICAgIC8vIHRlcm1pbmF0ZSB0aGUgd29ya2VyXG4gICAgICB0aGlzLl9jb21wcmVzc2lvbldvcmtlci50ZXJtaW5hdGUoKVxuICAgICAgdGhpcy5fY29tcHJlc3Npb25Xb3JrZXIgPSBudWxsXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIE91dGdvaW5nIHBheWxvYWQgbmVlZHMgdG8gYmUgY29tcHJlc3NlZCBhbmQgc2VudCB0byBzb2NrZXRcbiAgICpcbiAgICogQHBhcmFtIHtBcnJheUJ1ZmZlcn0gYnVmZmVyIE91dGdvaW5nIHVuY29tcHJlc3NlZCBhcnJheWJ1ZmZlclxuICAgKi9cbiAgX3NlbmRDb21wcmVzc2VkIChidWZmZXIpIHtcbiAgICAvLyBkZWZsYXRlXG4gICAgaWYgKHRoaXMuX2NvbXByZXNzaW9uV29ya2VyKSB7XG4gICAgICB0aGlzLl9jb21wcmVzc2lvbldvcmtlci5wb3N0TWVzc2FnZShjcmVhdGVNZXNzYWdlKE1FU1NBR0VfREVGTEFURSwgYnVmZmVyKSwgW2J1ZmZlcl0pXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2NvbXByZXNzaW9uLmRlZmxhdGUoYnVmZmVyKVxuICAgIH1cbiAgfVxuXG4gIF9yZXNldFNvY2tldFRpbWVvdXQgKGJ5dGVMZW5ndGgpIHtcbiAgICBjbGVhclRpbWVvdXQodGhpcy5fc29ja2V0VGltZW91dFRpbWVyKVxuICAgIGNvbnN0IHRpbWVvdXQgPSB0aGlzLnRpbWVvdXRTb2NrZXRMb3dlckJvdW5kICsgTWF0aC5mbG9vcigoYnl0ZUxlbmd0aCB8fCA0MDk2KSAqIHRoaXMudGltZW91dFNvY2tldE11bHRpcGxpZXIpIC8vIG1heCBwYWNrZXQgc2l6ZSBpcyA0MDk2IGJ5dGVzXG4gICAgdGhpcy5fc29ja2V0VGltZW91dFRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB0aGlzLl9vbkVycm9yKG5ldyBFcnJvcignIFNvY2tldCB0aW1lZCBvdXQhIFtTVE9fMDFdJykpLCB0aW1lb3V0KVxuICB9XG59XG5cbmNvbnN0IGNyZWF0ZU1lc3NhZ2UgPSAobWVzc2FnZSwgYnVmZmVyKSA9PiAoeyBtZXNzYWdlLCBidWZmZXIgfSlcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUF1QztBQUFBO0FBQUEscTF2Q0FHdkM7QUFDQTtBQUNBO0FBQ0EsTUFBTUEseUJBQXlCLEdBQUcsT0FBTztBQUN6QyxNQUFNQyxlQUFlLEdBQUcsU0FBUztBQUNqQyxNQUFNQywyQkFBMkIsR0FBRyxnQkFBZ0I7QUFDcEQsTUFBTUMsZUFBZSxHQUFHLFNBQVM7QUFDakMsTUFBTUMsMkJBQTJCLEdBQUcsZ0JBQWdCO0FBRXBELE1BQU1DLEdBQUcsR0FBRyxNQUFNO0FBQ2xCLE1BQU1DLFNBQVMsR0FBRyxFQUFFO0FBQ3BCLE1BQU1DLGVBQWUsR0FBRyxFQUFFO0FBQzFCLE1BQU1DLGtCQUFrQixHQUFHLEdBQUc7QUFDOUIsTUFBTUMsbUJBQW1CLEdBQUcsR0FBRztBQUUvQixNQUFNQyxVQUFVLEdBQUcsRUFBRTs7QUFFckI7QUFDQSxNQUFNQyxvQkFBb0IsR0FBRyxTQUFTO0FBQ3RDLE1BQU1DLHNDQUFzQyxHQUFHLGtCQUFrQjtBQUNqRSxNQUFNQyxzQ0FBc0MsR0FBRyxrQkFBa0I7QUFDakUsTUFBTUMsb0JBQW9CLEdBQUcsU0FBUzs7QUFFdEM7QUFDQTtBQUNBO0FBQ0Es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