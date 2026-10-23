const fs = require('fs');const path=require('path');
const REG=JSON.parse(fs.readFileSync(path.join(__dirname,'../registry/terminology-2.2.json'),'utf8')).registry;
const PC={C:0,D:2,E:4,F:5,G:7,A:9,B:11};
function checkScale(m){const a=[];if(m.status!=='recognized')return a;const e=REG[m.scaleId];if(!e||!e.intervals)return ['scaleId not in normative registry'];
if(JSON.stringify(m.intervals)!==JSON.stringify(e.intervals))a.push('intervals disagree with scaleId');
const t=m.tonic;let i=PC[t[0]]+(t.slice(1).match(/#/g)||[]).length-(t.slice(1).match(/b/g)||[]).length;
if(m.pitchClasses&&JSON.stringify(m.pitchClasses)!==JSON.stringify(m.intervals.map(x=>(i+x+120)%12)))a.push('pitchClasses disagree with tonic/intervals');
if(m.displaySpellings&&m.displaySpellings.length!==m.intervals.length)a.push('displaySpellings count mismatches intervals');return a;}
function checkDocument(d){let a=[];if(d.song?.scaleMeaning)a.push(...checkScale(d.song.scaleMeaning).map(x=>'song.scaleMeaning: '+x));
(d.timeline?.tonalChanges||[]).forEach((t,j)=>{if(t.scaleMeaning)a.push(...checkScale(t.scaleMeaning).map(x=>`tonalChanges[${j}].scaleMeaning: `+x));});return a;}
module.exports={checkScale,checkDocument};if(require.main===module){const d=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));const issues=checkDocument(d);console.log(JSON.stringify({ok:!issues.length,issues}));process.exit(issues.length?1:0);}
