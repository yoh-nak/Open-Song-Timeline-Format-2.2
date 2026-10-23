"""OSTF 2.2 document validation: structural failures short-circuit semantic checks."""
import json, sys
from pathlib import Path
from jsonschema import Draft202012Validator
from validate_rc2 import strict_load,validate as chord_validate
from scale_document import check_document
from lyric_offsets import check as check_lyrics
ROOT=Path(__file__).resolve().parents[1]
SCHEMA=json.loads((ROOT/'schema/ostf-2.2.schema.json').read_text(encoding='utf-8'))
def evaluate(doc):
    structural=[{'code':'SCHEMA','path':'/'.join(map(str,e.absolute_path))} for e in Draft202012Validator(SCHEMA).iter_errors(doc)]
    if structural:
        return sorted(structural,key=lambda e:(e['code'],e['path']))
    chord=[e for e in chord_validate(doc,SCHEMA) if e['code']!='SCHEMA']
    scales=[{'code':'SCALE_SEMANTICS','path':s} for s in check_document(doc)]
    return sorted(chord+scales+check_lyrics(doc),key=lambda e:(e['code'],e['path']))
if __name__=='__main__':
    try:
        doc=strict_load(sys.argv[1])
    except (ValueError, OSError, UnicodeError) as exc:
        errors=[{'code':'JSON_PARSE','path':'','message':str(exc)}]
    else:
        try:
            errors=evaluate(doc)
        except Exception as exc:
            errors=[{'code':'VALIDATOR_INTERNAL','path':'','message':str(exc)}]
    print(json.dumps({'valid':not errors,'errors':errors},ensure_ascii=False));sys.exit(bool(errors))
