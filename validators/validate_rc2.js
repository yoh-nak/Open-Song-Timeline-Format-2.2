// OSTF 2.2 semantic validator — use the independent RC5 grammar.
const fs=require('fs');const {parse,identical}=require('./chord_notation.js');const {parsePolychord}=require('./polychord.js');
const chordParse=x=>typeof x==='string'&&x.includes('|')?parsePolychord(x):parse(x);
const chordSame=(a,b)=>{if(a?.status!=='recognized'||b?.status!=='recognized')return false;if(a.upper||b.upper)return !!(a.upper&&b.upper&&identical(a.upper,b.upper)&&identical(a.lower,b.lower));return identical(a,b);};
function validate(obj){const errors=[];(obj.harmony||[]).forEach((ch,i)=>{const n=ch.chordNotation;if(!n)return;const path=`harmony/${i}`;
 if(n.input?.text!==ch.symbol)errors.push({code:'INPUT_MISMATCH',path});const p=chordParse(ch.symbol);const poly=n.polychord;
 if(poly!==undefined){if(p.status!=='recognized'||!p.upper||poly.composition!=='upper-over-lower'||!chordSame(p.upper,chordParse(poly.upper))||!chordSame(p.lower,chordParse(poly.lower)))errors.push({code:'POLYCHORD_STRUCTURE_MISMATCH',path});}
 else if(p.status==='recognized'&&p.upper&&n.interpretation?.status==='recognized')errors.push({code:'POLYCHORD_STRUCTURE_MISSING',path});
 if(n.interpretation?.status==='recognized'&&p.status!=='recognized')errors.push({code:'FALSE_RECOGNITION',path});
 if(n.interpretation?.status==='noChord'&&p.status!=='noChord')errors.push({code:'FALSE_NO_CHORD',path});
 if(n.interpretation?.status==='recognized'&&!n.interpretation.canonical)errors.push({code:'MISSING_CANONICAL',path});
 if(n.interpretation?.status!=='recognized'&&n.interpretation?.canonical)errors.push({code:'NONRECOGNIZED_CANONICAL',path});
 if(n.interpretation?.status==='noChord'&&n.rendering?.text&&chordParse(n.rendering.text).status!=='noChord')errors.push({code:'NOCHORD_RENDER_MISMATCH',path});
 if(['unknown','ambiguous','unresolved'].includes(n.interpretation?.status)&&n.rendering?.text&&n.rendering.text!==ch.symbol)errors.push({code:'UNRESOLVED_RENDER_CHANGED',path});

 if(n.interpretation?.status==='recognized'&&p.status==='recognized'&&n.interpretation.canonical&&!chordSame(p,chordParse(n.interpretation.canonical)))errors.push({code:'CANONICAL_MEANING_CHANGED',path});
 if(n.rendering?.style==='original'&&n.rendering.text&&n.rendering.text!==ch.symbol)errors.push({code:'ORIGINAL_RENDER_MISMATCH',path});
 if(p.status==='recognized'&&['standard','jazz','compact'].includes(n.rendering?.style)&&n.rendering?.text&&!chordSame(p,chordParse(n.rendering.text)))errors.push({code:'RENDER_MEANING_CHANGED',path});
 });return errors;}
if(require.main===module){const o=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));let errors=validate(o);console.log(JSON.stringify({valid:!errors.length,errors}));process.exit(errors.length?1:0);}
module.exports={parse,identical,validate};
