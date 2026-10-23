import json,sys
from pathlib import Path
from jsonschema import Draft202012Validator
from chord_notation import parse,fmt,identical
from polychord import parse_polychord

def strict_load(path):
 from secure_json import loads
 return loads(Path(path).read_bytes())

def chord_parse(text):
 return parse_polychord(text) if isinstance(text,str) and '|' in text else parse(text)
def chord_same(a,b):
 if a.get('status')!='recognized' or b.get('status')!='recognized':return False
 if 'upper' in a or 'upper' in b:
  return 'upper' in a and 'upper' in b and identical(a['upper'],b['upper']) and identical(a['lower'],b['lower'])
 return identical(a,b)

def validate(obj,schema):
 errors=[{'code':'SCHEMA','path':'/'.join(map(str,e.absolute_path))} for e in Draft202012Validator(schema).iter_errors(obj)]
 for i,ch in enumerate(obj.get('harmony',[])):
  n=ch.get('chordNotation')
  if n:
   if n.get('input',{}).get('text')!=ch.get('symbol'):errors.append({'code':'INPUT_MISMATCH','path':f'harmony/{i}'})
   p=chord_parse(ch.get('symbol',''))
   poly=n.get('polychord')
   if poly is not None:
    if p['status']!='recognized' or 'upper' not in p or not isinstance(poly,dict) or poly.get('composition')!='upper-over-lower' or not chord_same(p['upper'],chord_parse(poly.get('upper',''))) or not chord_same(p['lower'],chord_parse(poly.get('lower',''))):
     errors.append({'code':'POLYCHORD_STRUCTURE_MISMATCH','path':f'harmony/{i}'})
   elif p['status']=='recognized' and 'upper' in p and n.get('interpretation',{}).get('status')=='recognized':
    errors.append({'code':'POLYCHORD_STRUCTURE_MISSING','path':f'harmony/{i}'})
   interp=n.get('interpretation',{})
   status=interp.get('status')
   if status=='recognized' and p['status']!='recognized':errors.append({'code':'FALSE_RECOGNITION','path':f'harmony/{i}'})
   if status=='noChord' and p['status']!='noChord':errors.append({'code':'FALSE_NO_CHORD','path':f'harmony/{i}'})
   if status=='recognized' and not interp.get('canonical'):errors.append({'code':'MISSING_CANONICAL','path':f'harmony/{i}'})
   if status!='recognized' and interp.get('canonical'):errors.append({'code':'NONRECOGNIZED_CANONICAL','path':f'harmony/{i}'})
   if status=='noChord' and n.get('rendering',{}).get('text') and parse(n['rendering']['text'])['status']!='noChord':errors.append({'code':'NOCHORD_RENDER_MISMATCH','path':f'harmony/{i}'})
   if status in ('unknown','ambiguous','unresolved') and n.get('rendering',{}).get('text') and n['rendering']['text']!=ch.get('symbol'):errors.append({'code':'UNRESOLVED_RENDER_CHANGED','path':f'harmony/{i}'})

   if status=='recognized' and p['status']=='recognized' and interp.get('canonical'):
    if not chord_same(p,chord_parse(interp['canonical'])):errors.append({'code':'CANONICAL_MEANING_CHANGED','path':f'harmony/{i}'})
   if rend:=n.get('rendering',{}):
    if rend.get('style')=='original' and rend.get('text') and rend['text']!=ch.get('symbol'):errors.append({'code':'ORIGINAL_RENDER_MISMATCH','path':f'harmony/{i}'})
   rend=n.get('rendering',{})
   if p['status']=='recognized' and rend.get('style') in ('standard','jazz','compact') and rend.get('text'):
    q=chord_parse(rend['text'])
    if not chord_same(p,q):errors.append({'code':'RENDER_MEANING_CHANGED','path':f'harmony/{i}'})
 return errors

if __name__=='__main__':
 root=Path(__file__).resolve().parents[1]
 schema=json.loads((root/'schema/ostf-2.2.schema.json').read_text())
 obj=strict_load(sys.argv[1]);errors=validate(obj,schema)
 print(json.dumps({'valid':not errors,'errors':errors},ensure_ascii=False));sys.exit(bool(errors))
