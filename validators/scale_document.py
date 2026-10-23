import json, pathlib, sys
ROOT = pathlib.Path(__file__).resolve().parents[1]
REG = json.loads((ROOT/'registry/terminology-2.2.json').read_text(encoding='utf8'))['registry']
ROOT_PC={'C':0,'D':2,'E':4,'F':5,'G':7,'A':9,'B':11}
def check_scale(m):
    issues=[]
    if m['status'] != 'recognized': return issues
    entry=REG.get(m['scaleId'])
    if entry is None or 'intervals' not in entry: return ['scaleId not in normative registry']
    if m['intervals'] != entry['intervals']: issues.append('intervals disagree with scaleId')
    root=m['tonic']; i=ROOT_PC[root[0]] + root[1:].count('#') - root[1:].count('b')
    if m.get('pitchClasses') is not None and m['pitchClasses'] != [(i+x)%12 for x in m['intervals']]: issues.append('pitchClasses disagree with tonic/intervals')
    if m.get('displaySpellings') is not None and len(m['displaySpellings'])!=len(m['intervals']): issues.append('displaySpellings count mismatches intervals')
    return issues
def check_document(d):
    issues=[]
    if isinstance(d.get('song'),dict) and 'scaleMeaning' in d['song']:
        issues.extend('song.scaleMeaning: '+x for x in check_scale(d['song']['scaleMeaning']))
    for j,t in enumerate(d.get('timeline',{}).get('tonalChanges',[])):
        if 'scaleMeaning' in t: issues.extend(f'tonalChanges[{j}].scaleMeaning: '+x for x in check_scale(t['scaleMeaning']))
    return issues
if __name__=='__main__':
    d=json.loads(pathlib.Path(sys.argv[1]).read_text(encoding='utf8'))
    issues=check_document(d);print(json.dumps({'ok':not issues,'issues':issues},ensure_ascii=False));sys.exit(bool(issues))
