"""OSTF 2.2 reference chord notation profile: conservative, explicit grammar."""
import re
ALIASES=[('major7',('maj7','M7','△7','Δ7')),('minorMajor7',('m(maj7)','mMaj7','mM7','m△7','mΔ7')),('minor7',('min7','m7','-7','−7')),('major6',('6',)),('majorSixNine',('6/9',)),('minorSixNine',('m6/9','min6/9','-6/9','−6/9')),('minor6',('m6','min6','-6','−6')),('dim7',('dim7','°7')),('halfDim7',('m7b5','m7♭5','ø7')),('aug',('aug','+')),('dim',('dim','°')),('dom7',('7',)),('minor',('min','m','-','−')),('major',('',))]
FORMATS={'standard':{'major7':'maj7','minorMajor7':'m(maj7)','minor7':'m7','major6':'6','majorSixNine':'6/9','minorSixNine':'m6/9','minor6':'m6','dim7':'dim7','halfDim7':'m7b5','aug':'aug','dim':'dim','dom7':'7','minor':'m','major':''},'jazz':{'major7':'△7','minorMajor7':'m△7','minor7':'−7','major6':'6','majorSixNine':'6/9','minorSixNine':'−6/9','minor6':'−6','dim7':'°7','halfDim7':'ø7','aug':'+','dim':'°','dom7':'7','minor':'−','major':''},'compact':{'major7':'M7','minorMajor7':'mM7','minor7':'m7','major6':'6','majorSixNine':'6/9','minorSixNine':'m6/9','minor6':'m6','dim7':'°7','halfDim7':'ø7','aug':'+','dim':'°','dom7':'7','minor':'m','major':''}}
DEGREE=re.compile(r'([b♭#♯]?)(9|11|13|5|3)')
OPERATIONS=re.compile(r'(add|omit|no)([b♭#♯]?)(2|3|4|5|6|9|11|13)')
BASE=re.compile(r'^(maj7|M7|△7|Δ7|m\(maj7\)|mMaj7|mM7|m△7|mΔ7|min7|m7|-7|−7|dim7|°7|m7b5|m7♭5|ø7|m6|min6|-6|−6|6|aug|dim|°|\+|7sus4|7sus2|sus4|sus2|sus|add[29]|7|9|11|13|min|m|-|−)?')

def norm(s):return s.replace('♯','#').replace('♭','b') if s is not None else None


def valid_delimiters(s):
 # The minor-major seventh token is atomic, not a grouping operator.
 s=s.replace('m(maj7)','mMaj7')
 if not s or not any(c in s for c in '(),'):
  return True
 if s.count('(')!=s.count(')') or s.count('(')>1:
  return False
 if '(' in s:
  left,sep,rest=s.partition('(')
  if not left or not rest.endswith(')') or ')' in rest[:-1]:return False
  inner=rest[:-1]
  if not inner or any(not re.fullmatch(r'(?:add|omit|no)?[b♭#♯]?(?:2|3|4|5|6|9|11|13)',t) for t in inner.split(',')):
   return False
  if not all(inner.split(',')):return False
  return True
 return False

def parse(t):
 if not isinstance(t,str):return {"status":"unknown","original":t}
 if t in ('N.C.','NC'):return {'status':'noChord','original':t}
 m=re.fullmatch(r'([A-G](?:[#b♯♭])?)(.*?)(?:/([A-G](?:[#b♯♭])?))?',t)
 if not m:return {'status':'unknown','original':t}
 root,suffix,bass=m.groups();quality=None;ops=[];susp=None
 # /9 belongs to the sixth/ninth quality; only a subsequent /NOTE is bass.
 six_nine=re.fullmatch(r'([A-G](?:[#b♯♭])?)(6/9|m6/9|min6/9|-6/9|−6/9)(?:/([A-G](?:[#b♯♭])?))?',t)
 if six_nine:root,suffix,bass=six_nine.groups()

 if '/' in suffix and suffix not in ('6/9','m6/9','min6/9','-6/9','−6/9'):return {'status':'unknown','original':t}
 if not valid_delimiters(suffix) or any(c.isspace() for c in t):return {'status':'unknown','original':t}
 for name,aliases in ALIASES:
  if suffix in aliases:quality=name;break
 if quality is None:
  q=re.fullmatch(r'(7sus[24]|sus[24]|sus|add[29]|9|11|13)(.*)',suffix)
  if q:
   head,tail=q.groups()
   if head.startswith('sus') or 'sus' in head:
    quality='dom7' if head.startswith('7') else 'major';susp=int(head[-1]) if head[-1].isdigit() else 4
   elif head.startswith('add'):quality='major';ops=[('add','',int(head[3:]))]
   else:quality='dom7';ops=[('extend','',int(head))]
  else:
   base=BASE.match(suffix);head=base.group(0) if base else ''
   quality=next((name for name,aliases in ALIASES if head in aliases),None)
   tail=suffix[len(head):] if quality is not None else suffix
   if quality is None or not tail:return {'status':'unknown','original':t}
  tail=tail.strip()
  while tail:
   if tail[0] in '(),':tail=tail[1:];continue
   op=OPERATIONS.match(tail)
   if op:kind,alt,deg=op.groups();ops.append(('omit' if kind=='no' else kind,norm(alt),int(deg)));tail=tail[op.end():];continue
   d=DEGREE.match(tail)
   if d and d.group(1):ops.append(('alter',norm(d.group(1)),int(d.group(2))));tail=tail[d.end():];continue
   return {'status':'unknown','original':t}
 if suffix.count('(')!=suffix.count(')') or suffix.endswith(('()',',')) or (any(c in suffix for c in '(),') and not ops and quality not in ('minorMajor7',)):
  return {'status':'unknown','original':t}
 # Reject impossible silent reinterpretations: omitted degree also altered or added,
 # and the 3rd cannot be both suspended and independently altered/added.
 if len(set(ops))!=len(ops):return {'status':'unknown','original':t}
 if susp is not None and any(deg==3 and k in ('alter','add') for k,alt,deg in ops):return {'status':'unknown','original':t}
 if any(k=='omit' and any(other_k in ('add','alter') and other_deg==deg for other_k,_,other_deg in ops) for k,_,deg in ops):return {'status':'unknown','original':t}
 # A degree may not be assigned incompatible modifiers by a single symbol.
 modifiers={}
 for kind,alt,degree in ops:
  if kind=='extend':continue
  previous=modifiers.setdefault(degree,(kind,alt))
  if previous!=(kind,alt):return {'status':'unknown','original':t}
 return {'status':'recognized','original':t,'root':norm(root),'quality':quality,'bass':norm(bass),'rootOriginal':root,'bassOriginal':bass,'suspension':susp,'operations':sorted(ops)}

def fmt(p,style):
 if style=='original' or p['status']!='recognized':return p['original']
 if style not in FORMATS:raise ValueError('unknown style')
 base=p['rootOriginal']+FORMATS[style][p['quality']]
 if p.get('suspension') is not None:base+='sus'+str(p['suspension'])
 for k,a,d in p.get('operations',[]):
  if k=='extend':
   if p['quality']!='dom7' or p.get('suspension') is not None:return p['original']
   base=p['rootOriginal']+str(d)
  elif k=='alter':base+=a+str(d)
  elif k in ('add','omit'):base+=k+a+str(d)
  else:return p['original']
 candidate=base+(('/'+p['bassOriginal']) if p['bassOriginal'] else '')
 # A formatter must never emit a different recognized chord meaning.
 return candidate if identical(p,parse(candidate)) else p['original']

def identical(a,b):return a['status']==b['status']=='recognized' and tuple(a.get(k) for k in ('root','quality','bass','suspension','operations'))==tuple(b.get(k) for k in ('root','quality','bass','suspension','operations'))


def format_checked(parsed, style):
    """Machine-readable result: never silently lose chord semantics."""
    if style not in ('original', *FORMATS):
        raise ValueError('unknown style')
    source=parsed['original']
    if style=='original':
        return {'text':source,'renderable':True,'reason':None}
    if parsed['status']!='recognized':
        return {'text':source,'renderable':False,'reason':'UNRECOGNIZED'}
    candidate=fmt(parsed,style)
    # An unchanged output can be a valid rendering only if this style
    # canonically produces exactly the source and round trips.
    renderable=identical(parsed,parse(candidate))
    return {'text':candidate if renderable else source,'renderable':renderable,
            'reason':None if renderable else 'UNREPRESENTABLE'}
