import urllib.request,urllib.parse,json,time
out={}
def g(u): return json.load(urllib.request.urlopen(u+('&' if '?' in u else '?')+'mailto=noreply@anthropic.com',timeout=40))
for name in ['Tanio Tanev','Maya Dimitrova','Aleksandar Krastev','Neda Chehlarova']:
    try:
        j=g('https://api.openalex.org/authors?per-page=5&search='+urllib.parse.quote(name))
        out[name]=[{'n':a['display_name'],'inst':[i['display_name'] for i in a.get('last_known_institutions') or []],'works':a['works_count'],'id':a['id']} for a in j['results']]
    except Exception as e: out[name]=repr(e)
    time.sleep(1)
# работи на четиримата заедно
try:
    j=g('https://api.openalex.org/works?per-page=10&search='+urllib.parse.quote('Dimitrova Krastev Chehlarova Tanev'))
    out['joint']=[{'t':w['title'],'y':w['publication_year'],'auth':[(x['author']['display_name'],x.get('raw_affiliation_strings',[])[:1]) for x in w['authorships']]} for w in j['results']]
except Exception as e: out['joint']=repr(e)
try:
    j=g('https://api.openalex.org/works?per-page=5&search='+urllib.parse.quote('Educational Scenarios Robots Neuro Aware'))
    out['paper']=[{'t':w['title'],'y':w['publication_year'],'doi':w.get('doi'),'auth':[(x['author']['display_name'],x.get('raw_affiliation_strings',[])[:1]) for x in w['authorships']]} for w in j['results']]
except Exception as e: out['paper']=repr(e)
json.dump(out,open('aff.json','w'),ensure_ascii=False,indent=0)
