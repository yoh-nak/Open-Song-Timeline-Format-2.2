"""Conservative exact-alias registry with explicit collision status. No inferred transliteration."""
import json
from pathlib import Path
REGISTRY=json.loads((Path(__file__).parents[1]/'registry'/'terminology-2.2.json').read_text(encoding='utf-8'))['registry']
def resolve(token, domain):
    if not isinstance(token,str) or not isinstance(domain,str):
        return {'status':'invalid','original':token}
    matches=sorted(k for k,v in REGISTRY.items() if k.startswith(domain+'.') and token in v.get('aliases',[]))
    if len(matches)==1: return {'status':'recognized','id':matches[0]}
    return {'status':'ambiguous' if matches else 'unknown','original':token}
def audit_registry():
    collisions={}; invalid=[]
    for key,value in REGISTRY.items():
        if not isinstance(value.get('aliases'),list) or not value['aliases']:invalid.append(key+':aliases')
        if key.startswith('scale.'):
            intervals=value.get('intervals')
            if not isinstance(intervals,list) or not intervals or intervals[0]!=0 or any(type(x)!=int or x<0 or x>=12 for x in intervals) or sorted(set(intervals))!=intervals:invalid.append(key+':intervals')
        domain=key.partition('.')[0]
        for alias in value.get('aliases',[]):
            if not isinstance(alias,str) or not alias:invalid.append(key+':alias')
            collisions.setdefault((domain,alias),[]).append(key)
    return {'invalid':sorted(invalid),'collisions':{domain+'|'+term:sorted(keys) for (domain,term),keys in collisions.items() if len(keys)>1}}
