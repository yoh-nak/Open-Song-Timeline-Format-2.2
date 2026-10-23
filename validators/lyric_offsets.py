"""RC52: semantic lyric offset validation (declared code point mode only)."""
def check(doc):
    lyric=doc.get('lyrics',{})
    if lyric.get('indexUnit')!='unicodeCodePoint':return []
    errors=[]
    documents={x['id']:x for x in lyric.get('documents',[])}
    phrases={x['id']:x for x in lyric.get('phrases',[])}
    def err(path):errors.append({'code':'LYRIC_OFFSET','path':path})
    for i,d in enumerate(lyric.get('documents',[])):
        for j,seg in enumerate(d.get('segments',[])):
            base=f'lyrics/documents/{i}/segments/{j}'
            source=seg['source']; length=len(d.get(source,''))
            if not (0<=seg['start']<seg['end']<=length):err(base)
    for i,p in enumerate(lyric.get('phrases',[])):
        length=len(documents.get(p['documentId'],{}).get('text',''))
        if p['documentId'] not in documents or not (0<=p['startOffset']<=p['endOffset']<=length):err(f'lyrics/phrases/{i}')
    for i,u in enumerate(lyric.get('units',[])):
        p=phrases.get(u['phraseId']); valid=p is not None
        if valid:
            d=documents.get(p['documentId']);valid=d is not None
            if valid:
                start,end=u['startOffset'],u['endOffset']
                valid=(p['startOffset']<=start<=end<=p['endOffset'] and end<=len(d['text']))
        if not valid:err(f'lyrics/units/{i}')
    return errors
