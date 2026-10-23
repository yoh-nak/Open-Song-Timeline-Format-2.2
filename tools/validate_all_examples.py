#!/usr/bin/env python3
"""Positive corpus semantic validation for OSTF 2.2.0."""
import json,sys,pathlib
root=pathlib.Path(__file__).resolve().parents[1]
sys.path.insert(0,str(root/'validators'))
from full_document import evaluate
bad=0
for f in sorted((root/'examples').glob('*.ostf')):
 try: errors=evaluate(json.loads(f.read_text(encoding='utf-8')))
 except Exception as e:errors=[{'code':'INPUT','detail':str(e)}]
 if errors:print('FAIL',f.name,errors);bad+=1
 else: print('PASS',f.name)
print('examples:',len(list((root/'examples').glob('*.ostf'))),'failures:',bad)
sys.exit(bool(bad))
