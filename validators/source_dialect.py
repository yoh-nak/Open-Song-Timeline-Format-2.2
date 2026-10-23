"""Normative OSTF 2.2 dialect dispatcher; no implicit vendor grammar."""
import json
from pathlib import Path
from chord_notation import parse,fmt
from polychord import parse_polychord,format_polychord
REGISTRY=json.loads((Path(__file__).resolve().parents[1]/'registry/chord-dialects-2.2.json').read_text(encoding='utf-8'))
DIALECTS={item['id']:item['grammar'] for item in REGISTRY['recognizedDialects']}
def interpret(text,dialect=None):
    if dialect is not None and not isinstance(dialect,str):raise TypeError('dialect must be string or null')
    # No vendor special casing until a vendor grammar has normative rules/tests.
    p=parse_polychord(text) if isinstance(text,str) and '|' in text else parse(text)
    return {'sourceDialect':dialect,'grammar':REGISTRY['coreGrammar'] if p['status'] in ('recognized','noChord') else None,'status':p['status'],'meaning':p,'original':text}
