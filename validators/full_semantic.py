"""RC15 combined full-document semantic validation (NOT full schema validation)."""
import json,sys
from pathlib import Path
from validate_rc2 import validate,strict_load
from scale_document import check_document
from jsonschema import Draft202012Validator
ROOT=Path(__file__).resolve().parents[1]
def evaluate(doc):
    schema=json.loads((ROOT/'schema/ostf-2.2.schema.json').read_text(encoding='utf8'))
    chord=[e for e in validate(doc,schema) if e['code']!='SCHEMA']
    scales=[{'code':'SCALE_SEMANTICS','path':s} for s in check_document(doc)]
    return sorted(chord+scales,key=lambda e:(e['code'],e['path']))
if __name__=='__main__':
    doc=strict_load(sys.argv[1]); result=evaluate(doc)
    print(json.dumps({'valid':not result,'errors':result},ensure_ascii=False));sys.exit(bool(result))
