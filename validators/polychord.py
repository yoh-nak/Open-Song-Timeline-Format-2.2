"""Strict non-destructive polychord interpretation (upper|lower order)."""
try:
 from .chord_notation import parse,fmt,identical
except ImportError:
 from chord_notation import parse,fmt,identical

def parse_polychord(text):
 if not isinstance(text,str) or text.count('|') != 1:
  return {'status':'unknown','original':text}
 upper,lower=text.split('|')
 if not upper or not lower:
  return {'status':'unknown','original':text}
 a,b=parse(upper),parse(lower)
 if a['status']!='recognized' or b['status']!='recognized':
  return {'status':'unknown','original':text}
 return {'status':'recognized','original':text,'upper':a,'lower':b,'composition':'upper-over-lower'}

def format_polychord(p, style):
 if style=='original' or p['status']!='recognized':return p['original']
 if style not in ('standard','jazz','compact'):raise ValueError('unknown style')
 result=fmt(p['upper'],style)+'|'+fmt(p['lower'],style)
 check=parse_polychord(result)
 if check['status']!='recognized' or not identical(p['upper'],check['upper']) or not identical(p['lower'],check['lower']):return p['original']
 return result
