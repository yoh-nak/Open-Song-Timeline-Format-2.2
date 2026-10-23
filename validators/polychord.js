"use strict";
const {parse,format,identical}=require('./chord_notation');
function parsePolychord(text){
 if(typeof text!=="string"||text.split('|').length!==2)return {status:'unknown',original:text};
 const [upper,lower]=text.split('|');
 if(!upper||!lower)return {status:'unknown',original:text};
 const a=parse(upper),b=parse(lower);
 if(a.status!=='recognized'||b.status!=='recognized')return {status:'unknown',original:text};
 return {status:'recognized',original:text,upper:a,lower:b,composition:'upper-over-lower'};
}
function formatPolychord(p,style){
 if(style==='original'||p.status!=='recognized')return p.original;
 if(!['standard','jazz','compact'].includes(style))throw Error('unknown style');
 const candidate=format(p.upper,style)+'|'+format(p.lower,style);
 const parsed=parsePolychord(candidate);
 return parsed.status==='recognized'&&identical(parsed.upper,p.upper)&&identical(parsed.lower,p.lower)?candidate:p.original;
}
module.exports={parsePolychord,formatPolychord};
if(require.main===module){const fs=require('fs');const inputs=JSON.parse(fs.readFileSync(0,'utf8'));console.log(JSON.stringify(inputs.map(t=>{const p=parsePolychord(t);return {status:p.status,formats:['original','standard','jazz','compact'].map(s=>formatPolychord(p,s))}})));}
