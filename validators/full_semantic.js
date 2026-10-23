// RC15 combined semantic validation. JSON Schema validation is NOT included.
const fs=require('fs');
const chord=require('./validate_rc2.js');
const scale=require('./scale_document.js');
function evaluate(doc){const a=chord.validate(doc).concat(scale.checkDocument(doc).map(s=>({code:'SCALE_SEMANTICS',path:s})));return a.sort((x,y)=>x.code.localeCompare(y.code,'en')||x.path.localeCompare(y.path,'en'));}
if(require.main===module){const o=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));const e=evaluate(o);console.log(JSON.stringify({valid:!e.length,errors:e}));process.exit(e.length?1:0);}
module.exports={evaluate};
