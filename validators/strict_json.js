// Strict JSON gate for OSTF interchange. JSON Schema verification is a separate requirement.
const fs=require('fs');
function strictParse(s){
 let i=0;function ws(){while(/[\s]/.test(s[i]||'')&&i<s.length)i++}
 function str(){let st=i++;while(i<s.length){if(s[i]==='\\'){i+=2;continue}if(s[i++]==='"'){return JSON.parse(s.slice(st,i))}}throw Error('TRUNCATED_STRING')}
 function val(){ws();let c=s[i];if(c==='"')return str();if(c==='{'){i++;let out=Object.create(null),seen=new Set();ws();if(s[i]==='}'){i++;return out}while(i<s.length){ws();if(s[i]!=='"')throw Error('INVALID_OBJECT');let k=str();ws();if(s[i++]!==':')throw Error('INVALID_OBJECT');if(seen.has(k))throw Error('DUPLICATE_KEY');seen.add(k);out[k]=val();ws();let d=s[i++];if(d==='}')return out;if(d!==',')throw Error('INVALID_OBJECT')}throw Error('INVALID_OBJECT')}
 if(c==='['){i++;let a=[];ws();if(s[i]===']'){i++;return a}while(i<s.length){a.push(val());ws();let d=s[i++];if(d===']')return a;if(d!==',')throw Error('INVALID_ARRAY')}throw Error('INVALID_ARRAY')}
 let match=s.slice(i).match(/^(true|false|null|-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?)/);if(!match)throw Error('INVALID_VALUE');i+=match[0].length;let v=JSON.parse(match[0]);if(typeof v==='number'&&!Number.isFinite(v))throw Error('NONFINITE_NUMBER');return v;}
 const out=val();ws();if(i!==s.length)throw Error('TRAILING_DATA');return out;
}
if(require.main===module){try{let obj=strictParse(fs.readFileSync(process.argv[2],'utf8'));console.log(JSON.stringify({valid:true,keys:Object.keys(obj).length}));}catch(e){console.log(JSON.stringify({valid:false,code:e.message}));process.exitCode=1;}}
module.exports={strictParse};
