"use strict";
const registry=require('../registry/chord-dialects-2.2.json');
const {parse}=require('./chord_notation.js');
const {parsePolychord}=require('./polychord.js');
function interpret(text,dialect=null){
 if(dialect!==null&&typeof dialect!=='string')throw new TypeError('dialect must be string or null');
 const p=typeof text==='string'&&text.includes('|')?parsePolychord(text):parse(text);
 return {sourceDialect:dialect,grammar:['recognized','noChord'].includes(p.status)?registry.coreGrammar:null,status:p.status,meaning:p,original:text};
}
module.exports={interpret,registry};
if(require.main===module){let args=JSON.parse(process.argv[2]);console.log(JSON.stringify(args.map(([text,dialect])=>{let p=interpret(text,dialect);return [p.status,p.grammar,p.original]})));}
