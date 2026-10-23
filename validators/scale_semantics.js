// OSTF 2.2 candidate scale semantic resolver; no implicit note restrictions.
const fs=require('fs'); const path=require('path');
const registry=JSON.parse(fs.readFileSync(path.join(__dirname,'../registry/terminology-2.2.json'),'utf8')).registry;
const PITCH={C:0,D:2,E:4,F:5,G:7,A:9,B:11};
function resolveScale(root,name){
 const input={root,name};
 if(typeof root!=='string'||typeof name!=='string')return {status:'invalid',input};
 const ids=Object.keys(registry).filter(k=>k.startsWith('scale.')&&registry[k].aliases.includes(name)).sort();
 if(ids.length!==1)return {status:ids.length?'ambiguous':'unknown',input};
 const m=/^([A-G])([#b♯♭]?)$/.exec(root);
 if(!m)return {status:'unknown-root',input};
 const pc=(PITCH[m[1]]+(['#','♯'].includes(m[2])?1:['b','♭'].includes(m[2])?-1:0)+12)%12;
 const intervals=registry[ids[0]].intervals;
 return {status:'recognized',input,scaleId:ids[0],rootPitchClass:pc,intervals,pitchClasses:intervals.map(x=>(pc+x)%12),tuning:'12-TET'};
}
module.exports={resolveScale};
if(require.main===module)console.log(JSON.stringify(resolveScale(process.argv[2],process.argv[3])));
