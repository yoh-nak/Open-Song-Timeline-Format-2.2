"use strict";
// OSTF 2.2 candidate chord grammar, independent JS implementation.
const ALIASES=[['major7',['maj7','M7','△7','Δ7']],['minorMajor7',['m(maj7)','mMaj7','mM7','m△7','mΔ7']],['minor7',['min7','m7','-7','−7']],['major6',['6']],['majorSixNine',['6/9']],['minorSixNine',['m6/9','min6/9','-6/9','−6/9']],['minor6',['m6','min6','-6','−6']],['dim7',['dim7','°7']],['halfDim7',['m7b5','m7♭5','ø7']],['aug',['aug','+']],['dim',['dim','°']],['dom7',['7']],['minor',['min','m','-','−']],['major',['']]];
const FORMATS={standard:{major7:'maj7',minorMajor7:'m(maj7)',minor7:'m7',major6:'6',majorSixNine:'6/9',minorSixNine:'m6/9',minor6:'m6',dim7:'dim7',halfDim7:'m7b5',aug:'aug',dim:'dim',dom7:'7',minor:'m',major:''},jazz:{major7:'△7',minorMajor7:'m△7',minor7:'−7',major6:'6',majorSixNine:'6/9',minorSixNine:'−6/9',minor6:'−6',dim7:'°7',halfDim7:'ø7',aug:'+',dim:'°',dom7:'7',minor:'−',major:''},compact:{major7:'M7',minorMajor7:'mM7',minor7:'m7',major6:'6',majorSixNine:'6/9',minorSixNine:'m6/9',minor6:'m6',dim7:'°7',halfDim7:'ø7',aug:'+',dim:'°',dom7:'7',minor:'m',major:''}};
const normalize=s=>s==null?null:s.replace(/♯/g,'#').replace(/♭/g,'b');
const BASE=/^(maj7|M7|△7|Δ7|m\(maj7\)|mMaj7|mM7|m△7|mΔ7|min7|m7|-7|−7|dim7|°7|m7b5|m7♭5|ø7|m6|min6|-6|−6|6|aug|dim|°|\+|7sus4|7sus2|sus4|sus2|sus|add[29]|7|9|11|13|min|m|-|−)?/;
const OPERATIONS=/^(add|omit|no)([b♭#♯]?)(2|3|4|5|6|9|11|13)/;
const DEGREE=/^([b♭#♯]?)(9|11|13|5|3)/;
function validDelimiters(s){
 s=s.replace('m(maj7)','mMaj7');
 if(!/[(),]/.test(s))return true;
 if((s.match(/\(/g)||[]).length!==(s.match(/\)/g)||[]).length||(s.match(/\(/g)||[]).length>1)return false;
 if(!s.includes('('))return false;
 const i=s.indexOf('(');if(i===0||!s.endsWith(')')||s.slice(i+1,-1).includes(')'))return false;
 const tokens=s.slice(i+1,-1).split(',');
 return tokens.every(t=>/^(?:add|omit|no)?[b♭#♯]?(?:2|3|4|5|6|9|11|13)$/.test(t));
}
function parse(t){
 if(typeof t!=="string")return {status:"unknown",original:t};
 if(t==='NC'||t==='N.C.')return {status:'noChord',original:t};
 const m=/^([A-G][#b♯♭]?)(.*?)(?:\/([A-G][#b♯♭]?))?$/.exec(t||'');

 if(!m)return {status:'unknown',original:t};
 const sixNine=/^([A-G][#b♯♭]?)(6\/9|m6\/9|min6\/9|-6\/9|−6\/9)(?:\/([A-G][#b♯♭]?))?$/.exec(t);
 const root=sixNine?sixNine[1]:m[1],suffix=sixNine?sixNine[2]:m[2],bass=sixNine?(sixNine[3]||null):(m[3]||null);if(suffix.includes('/')&&!['6/9','m6/9','min6/9','-6/9','−6/9'].includes(suffix))return {status:'unknown',original:t};if(!validDelimiters(suffix)||/\s/u.test(t))return {status:"unknown",original:t};let quality=null,ops=[],susp=null,tail='';
 for(const [q,names] of ALIASES){if(names.includes(suffix)){quality=q;break;}}
 if(quality===null){
  const match=/^(7sus[24]|sus[24]|sus|add[29]|9|11|13)(.*)$/.exec(suffix);
  if(match){const head=match[1];tail=match[2];if(head.includes('sus')){quality=head.startsWith('7')?'dom7':'major';susp=/[24]$/.test(head)?Number(head.slice(-1)):4;}else if(head.startsWith('add')){quality='major';ops.push(['add','',Number(head.slice(3))]);}else{quality='dom7';ops.push(['extend','',Number(head)]);}}
  else{const first=(BASE.exec(suffix)||[''])[0];quality=ALIASES.find(([q,names])=>names.includes(first))?.[0]??null;tail=quality===null?suffix:suffix.slice(first.length);if(quality===null||!tail)return {status:'unknown',original:t};}
  tail=tail.trim();
  while(tail){if('(),'.includes(tail[0])){tail=tail.slice(1);continue;}let op=OPERATIONS.exec(tail);if(op){ops.push([op[1]==='no'?'omit':op[1],normalize(op[2]),Number(op[3])]);tail=tail.slice(op[0].length);continue;}let d=DEGREE.exec(tail);if(d&&d[1]){ops.push(['alter',normalize(d[1]),Number(d[2])]);tail=tail.slice(d[0].length);continue;}return {status:'unknown',original:t};}
 }
 if((suffix.match(/\(/g)||[]).length!==(suffix.match(/\)/g)||[]).length||(suffix.endsWith('()')||suffix.endsWith(','))||( /[(),]/.test(suffix)&&ops.length===0&&quality!=='minorMajor7'))return {status:'unknown',original:t};
 if(new Set(ops.map(x=>JSON.stringify(x))).size!==ops.length)return {status:'unknown',original:t};
 if(susp!==null&&ops.some(([k,a,d])=>d===3&&(k==='alter'||k==='add')))return {status:'unknown',original:t};
 if(ops.some(([k,a,d])=>k==='omit'&&ops.some(([j,b,e])=>e===d&&(j==='add'||j==='alter'))))return {status:'unknown',original:t};
 const modifiers=new Map();for(const [kind,alt,degree] of ops){if(kind==='extend')continue;const modifier=kind+':'+alt;if(modifiers.has(degree)&&modifiers.get(degree)!==modifier)return {status:'unknown',original:t};modifiers.set(degree,modifier);}
 ops.sort((a,b)=>a[0]===b[0]?(a[1]===b[1]?a[2]-b[2]:(a[1]<b[1]?-1:1)):(a[0]<b[0]?-1:1));
 return {status:'recognized',original:t,root:normalize(root),quality,bass:normalize(bass),rootOriginal:root,bassOriginal:bass,suspension:susp,operations:ops};
}
function format(p,style){if(style==='original'||p.status!=='recognized')return p.original;if(!FORMATS[style])throw Error('unknown style');let s=p.rootOriginal+FORMATS[style][p.quality];if(p.suspension!==null)s+='sus'+p.suspension;for(const [k,a,d] of p.operations){if(k==='extend'){if(p.quality!=='dom7'||p.suspension!==null)return p.original;s=p.rootOriginal+String(d);}else if(k==='alter')s+=a+d;else if(k==='add'||k==='omit')s+=k+a+d;else return p.original;}const candidate=s+(p.bassOriginal?'/'+p.bassOriginal:'');return identical(p,parse(candidate))?candidate:p.original;}
function meaning(p){if(p.status!=='recognized')return null;return JSON.stringify([p.root,p.quality,p.bass,p.suspension,[...p.operations].sort((a,b)=>a[0]===b[0]?(a[1]===b[1]?a[2]-b[2]:(a[1]<b[1]?-1:1)):(a[0]<b[0]?-1:1))]);}
function identical(a,b){return a.status==='recognized'&&b.status==='recognized'&&meaning(a)===meaning(b);}
module.exports={parse,format,identical,meaning};
if(require.main===module){let data=JSON.parse(require('fs').readFileSync(0,'utf8'));console.log(JSON.stringify(data.map(x=>{const p=parse(x);return {input:x,parsed:p,formats:Object.fromEntries(['standard','jazz','compact'].map(s=>[s,format(p,s)]))}})));}


function formatChecked(parsed, style) {
  if (!['original','standard','jazz','compact'].includes(style)) throw Error('unknown style');
  if (style === 'original') return {text:parsed.original, renderable:true, reason:null};
  if (parsed.status !== 'recognized') return {text:parsed.original, renderable:false, reason:'UNRECOGNIZED'};
  const candidate=format(parsed,style);
  const renderable=identical(parsed,parse(candidate));
  return {text:renderable?candidate:parsed.original, renderable, reason:renderable?null:'UNREPRESENTABLE'};
}
module.exports.formatChecked = formatChecked;
