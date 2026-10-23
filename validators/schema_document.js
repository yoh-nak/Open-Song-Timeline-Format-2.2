// OSTF RC20: JSON Schema vocabulary subset used by the current OSTF schema; conditional and exclusive bounds included.
// Not a complete generic Draft 2020-12 implementation; see RC19_VALIDATION_SCOPE.md.
const fs=require('fs');
function readStrict(path){const b=fs.readFileSync(path);if(b.length>8388608)throw Error('JSON_TOO_LARGE');return require('./strict_json.js').strictParse(new TextDecoder('utf-8',{fatal:true}).decode(b));}
const semantic=require('./full_semantic.js');
const isObj=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
function canonical(v){
 if(Array.isArray(v))return '['+v.map(canonical).join(',')+']';
 if(isObj(v))return '{'+Object.keys(v).sort().map(k=>JSON.stringify(k)+':'+canonical(v[k])).join(',')+'}';
 return JSON.stringify(v);
}
const eq=(a,b)=>canonical(a)===canonical(b);
function schemaErrors(data,schema){
 const errors=[];
 function visit(v,s,p){
   if(!s||typeof s!=='object')return;
   if(s.allOf)for(const a of s.allOf)visit(v,a,p);
   if(s.if && !probe(v,s.if).length && s.then)visit(v,s.then,p);
   if(s.if && probe(v,s.if).length && s.else)visit(v,s.else,p);
   if(s.anyOf && !s.anyOf.some(a=>!probe(v,a).length))errors.push({code:'SCHEMA',path:p});
   if(s.not && !probe(v,s.not).length)errors.push({code:'SCHEMA',path:p});
   if(s.type){const kinds=Array.isArray(s.type)?s.type:[s.type];const valid=kinds.some(k=> k==='object'?isObj(v):k==='array'?Array.isArray(v):k==='integer'?Number.isSafeInteger(v):k==='number'?typeof v==='number'&&Number.isFinite(v):k==='null'?v===null:k==='boolean'?typeof v==='boolean':k==='string'?typeof v==='string':false);if(!valid){errors.push({code:'SCHEMA',path:p});return;}}
   if('const'in s&&!eq(v,s.const))errors.push({code:'SCHEMA',path:p});
   if(s.enum&&!s.enum.some(e=>eq(e,v)))errors.push({code:'SCHEMA',path:p});
   if(typeof v==='number'){if(s.minimum!==undefined&&v<s.minimum)errors.push({code:'SCHEMA',path:p});if(s.maximum!==undefined&&v>s.maximum)errors.push({code:'SCHEMA',path:p});if(s.exclusiveMinimum!==undefined&&v<=s.exclusiveMinimum)errors.push({code:'SCHEMA',path:p});if(s.exclusiveMaximum!==undefined&&v>=s.exclusiveMaximum)errors.push({code:'SCHEMA',path:p});}
   if(typeof v==='string'){const n=[...v].length;if(s.minLength!==undefined&&n<s.minLength)errors.push({code:'SCHEMA',path:p});if(s.maxLength!==undefined&&n>s.maxLength)errors.push({code:'SCHEMA',path:p});if(s.pattern&&!new RegExp(s.pattern,'u').test(v))errors.push({code:'SCHEMA',path:p});}
   if(Array.isArray(v)){if(s.minItems!==undefined&&v.length<s.minItems)errors.push({code:'SCHEMA',path:p});if(s.maxItems!==undefined&&v.length>s.maxItems)errors.push({code:'SCHEMA',path:p});if(s.uniqueItems&&new Set(v.map(canonical)).size!==v.length)errors.push({code:'SCHEMA',path:p});if(s.items)for(let i=0;i<v.length;i++)visit(v[i],s.items,p?`${p}/${i}`:String(i));}
   if(isObj(v)){for(const k of s.required||[])if(!(k in v))errors.push({code:'SCHEMA',path:p});for(const [k,x] of Object.entries(v)){if(s.properties&&k in s.properties)visit(x,s.properties[k],p?`${p}/${k}`:k);else if(s.additionalProperties===false)errors.push({code:'SCHEMA',path:p?`${p}/${k}`:k});else if(isObj(s.additionalProperties))visit(x,s.additionalProperties,p?`${p}/${k}`:k);}}
 }
 function probe(v,s){const initial=errors.length;visit(v,s,'');const r=errors.slice(initial);errors.length=initial;return r;}
 visit(data,schema,'');return errors;
}
function validate(data,schema){let errors=schemaErrors(data,schema);if(!errors.length){try{const r=semantic.evaluate(data);if(Array.isArray(r))errors.push(...r);else if(r&&Array.isArray(r.errors))errors.push(...r.errors);errors.push(...require('./lyric_offsets.js').check(data));}catch(e){errors.push({code:'SEMANTIC_INTERNAL',path:'',message:e.message})}}return errors;}
if(require.main===module){
 const [file,sp]=process.argv.slice(2);let errors=[];
 let data,s;
 try{data=readStrict(file);s=readStrict(sp);}
 catch(e){errors=[{code:'JSON_PARSE',path:'',message:String(e.message||e)}];}
 if(!errors.length){try{errors=validate(data,s);}catch(e){errors=[{code:'VALIDATOR_INTERNAL',path:'',message:String(e.message||e)}];}}
 console.log(JSON.stringify({valid:errors.length===0,errors}));process.exitCode=errors.length?1:0;
}
module.exports={schemaErrors,validate};
