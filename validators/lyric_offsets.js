// RC52 lyric offset validation, explicitly declared Unicode code point indexing.
function check(doc){
 const lyric=doc.lyrics||{};if(lyric.indexUnit!=='unicodeCodePoint')return [];
 const errors=[];const documents=new Map((lyric.documents||[]).map(x=>[x.id,x]));const phrases=new Map((lyric.phrases||[]).map(x=>[x.id,x]));
 const err=path=>errors.push({code:'LYRIC_OFFSET',path});const len=s=>[...(s||'')].length;
 (lyric.documents||[]).forEach((d,i)=>(d.segments||[]).forEach((s,j)=>{if(!(0<=s.start&&s.start<s.end&&s.end<=len(d[s.source])))err(`lyrics/documents/${i}/segments/${j}`)}));
 (lyric.phrases||[]).forEach((p,i)=>{const d=documents.get(p.documentId);if(!d||!(0<=p.startOffset&&p.startOffset<=p.endOffset&&p.endOffset<=len(d.text)))err(`lyrics/phrases/${i}`)});
 (lyric.units||[]).forEach((u,i)=>{const p=phrases.get(u.phraseId),d=p&&documents.get(p.documentId);if(!d||!(p.startOffset<=u.startOffset&&u.startOffset<=u.endOffset&&u.endOffset<=p.endOffset&&u.endOffset<=len(d.text)))err(`lyrics/units/${i}`)});
 return errors;
}
module.exports={check};
