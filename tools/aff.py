import urllib.request,urllib.parse,json,time,re
norm=lambda s:re.sub(r'[^a-zа-я0-9]','',(s or '').lower())
def g(u):
    for k in range(3):
        try: return json.load(urllib.request.urlopen(u+('&' if '?' in u else '?')+'mailto=noreply@anthropic.com',timeout=40))
        except urllib.error.HTTPError as e:
            if e.code==404: return None
            time.sleep(3)
    return None
def auth(w): return [(x['author']['display_name'], (x.get('raw_affiliation_strings') or [''])[0], [i['display_name'] for i in x.get('institutions',[])]) for x in w.get('authorships',[])]
out=[]
for p in json.load(open('allp.json')):
    r={'t':p['t'],'y':p['y'],'doi':p.get('doi')}
    w=None
    if p.get('doi'): w=g('https://api.openalex.org/works/doi:'+urllib.parse.quote(p['doi'],safe='/'))
    if not w:
        for q in [p['t'], p.get('tr') or '']:
            if not q: continue
            j=g('https://api.openalex.org/works?per-page=5&search='+urllib.parse.quote(q[:200]))
            for c in (j or {}).get('results',[]):
                if norm(c.get('title'))[:45]==norm(q)[:45]: w=c; break
            if w: break
    if w:
        r['oa_doi']=(w.get('doi') or '').replace('https://doi.org/','') or None
        r['oa_title']=w.get('title'); r['auth']=auth(w)
    # Crossref по заглавие за DOI, ако няма
    if not p.get('doi') and not r.get('oa_doi'):
        j=g('https://api.crossref.org/works?rows=3&query.bibliographic='+urllib.parse.quote(p['t'][:200]))
        for c in ((j or {}).get('message') or {}).get('items',[]):
            if norm((c.get('title') or [''])[0])[:45]==norm(p['t'])[:45]:
                r['cr_doi']=c['DOI']; r['cr_auth']=[(f"{a.get('family','')}, {a.get('given','')}", '; '.join(x.get('name','') for x in a.get('affiliation',[]))) for a in c.get('author',[])]; break
    out.append(r); time.sleep(0.25)
json.dump(out,open('aff.json','w'),ensure_ascii=False,indent=0)
