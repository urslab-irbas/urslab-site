import urllib.request,urllib.parse,json,time
items=json.load(open('aff_items.json')); out=[]
for it in items:
    r={'t':it['t'][:70],'y':it['y'],'a':it['a']}
    try:
        if it['doi']:
            w=json.load(urllib.request.urlopen('https://api.openalex.org/works/doi:'+urllib.parse.quote(it['doi'],safe='/')+'?mailto=noreply@anthropic.com',timeout=40))
        else:
            j=json.load(urllib.request.urlopen('https://api.openalex.org/works?per-page=1&mailto=noreply@anthropic.com&search='+urllib.parse.quote(it['t'][:150]),timeout=40))
            w=j['results'][0] if j['results'] else None
            if w and w['title'] and w['title'].lower()[:30]!=it['t'].lower()[:30]: w=None
        if w: r['auth']=[(x['author']['display_name'], [i['display_name'] for i in x['institutions']], x.get('raw_affiliation_strings',[])[:1]) for x in w['authorships']]
    except Exception as e: r['err']=repr(e)[:100]
    out.append(r); time.sleep(0.3)
json.dump(out,open('aff.json','w'),ensure_ascii=False,indent=0)
