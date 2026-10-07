import urllib.request,urllib.parse,json,time
out=[]
for it in json.load(open('raw_items.json')):
    r={'t':it['t']}
    try:
        w=json.load(urllib.request.urlopen('https://api.openalex.org/works/doi:'+urllib.parse.quote(it['doi'],safe='/')+'?mailto=noreply@anthropic.com',timeout=40)) if it['doi'] else None
        if w: r['auth']=[(x['author']['display_name'], x.get('raw_affiliation_strings') or [], [i['display_name'] for i in x.get('institutions',[])]) for x in w['authorships']]
        if it['doi'] and not it['doi'].startswith('10.5281'):
            c=json.load(urllib.request.urlopen('https://api.crossref.org/works/'+urllib.parse.quote(it['doi'],safe='/'),timeout=40))['message']
            r['crossref']=[(f"{a.get('given','')} {a.get('family','')}", [x.get('name') for x in a.get('affiliation',[])]) for a in c.get('author',[])]
    except Exception as e: r['err']=repr(e)[:100]
    out.append(r); time.sleep(0.5)
json.dump(out,open('aff2.json','w'),ensure_ascii=False,indent=0)
