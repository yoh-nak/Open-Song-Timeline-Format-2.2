"""OSTF 2.2 candidate: conservative 12-TET named-scale semantic resolution.
This is a reference helper, not an instruction to constrain song notes.
"""
from terminology import resolve, REGISTRY
PITCH={'C':0,'D':2,'E':4,'F':5,'G':7,'A':9,'B':11}
def resolve_scale(root, name):
    raw={'root':root,'name':name}
    if not isinstance(root,str) or not isinstance(name,str):
        return {'status':'invalid','input':raw}
    result=resolve(name,'scale')
    if result['status']!='recognized':
        return {'status':result['status'],'input':raw}
    import re
    m=re.fullmatch(r'([A-G])([#b♯♭]?)',root)
    if not m:
        return {'status':'unknown-root','input':raw}
    pitch=(PITCH[m[1]] + (1 if m[2] in ('#','♯') else -1 if m[2] in ('b','♭') else 0))%12
    intervals=REGISTRY[result['id']]['intervals']
    return {'status':'recognized','input':raw,'scaleId':result['id'],'rootPitchClass':pitch,'intervals':intervals,'pitchClasses':[(pitch+n)%12 for n in intervals],'tuning':'12-TET'}
