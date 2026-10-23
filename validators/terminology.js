const {readFileSync}=require('fs');const {join}=require('path');
const registry=JSON.parse(readFileSync(join(__dirname,'..','registry','terminology-2.2.json'),'utf8')).registry;
function resolve(token,domain){if(typeof token!=='string'||typeof domain!=='string')return {status:'invalid',original:token};const m=Object.keys(registry).filter(k=>k.startsWith(domain+'.')&&registry[k].aliases.includes(token)).sort();return m.length===1?{status:'recognized',id:m[0]}:{status:m.length?'ambiguous':'unknown',original:token};}
if(require.main===module){const [token,domain]=process.argv.slice(2);process.stdout.write(JSON.stringify(resolve(token,domain)));}module.exports={resolve};
