"""Strict JSON ingestion; never eval document contents."""
import json, math

def _unique(pairs):
    out={}
    for key,value in pairs:
        if key in out: raise ValueError('DUPLICATE_JSON_KEY: '+key)
        out[key]=value
    return out

def _finite(token): raise ValueError('NONFINITE_NUMBER: '+token)

def loads(raw, max_bytes=8_388_608):
    if isinstance(raw,bytes):
        if len(raw)>max_bytes: raise ValueError('JSON_TOO_LARGE')
        raw=raw.decode('utf-8')
    elif len(raw.encode('utf-8'))>max_bytes: raise ValueError('JSON_TOO_LARGE')
    return json.loads(raw,object_pairs_hook=_unique,parse_constant=_finite,parse_float=lambda t: _checked_float(t))

def _checked_float(token):
    v=float(token)
    if not math.isfinite(v):raise ValueError('NONFINITE_NUMBER: '+token)
    return v
