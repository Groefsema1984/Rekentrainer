import os,sys,glob,hashlib,json
d=os.path.dirname(os.path.abspath(__file__))
r=lambda f:open(os.path.join(d,f),encoding='utf-8').read()
# volgorde: kern, figuren, vraagmodel, engine, dan de vragenbanken per niveau, dan de schermen
basis=['core.js','svg.js','vraag.js','adaptief.js','grafiek.js']
niveaus=sorted(glob.glob(os.path.join(d,'niveaus','n*.js')))
app=['ui.js','herhalen.js','toets.js','fit.js','schatten.js','model.js','misconcepties.js','taal.js','rekenmachine.js','docent.js']
js='\n'.join([r(f) for f in basis]+[open(f,encoding='utf-8').read() for f in niveaus]+[r(f) for f in app])
css=r('app-basis.css')+'\n'+r('app.css')
out=r('shell.html').replace('/*CSS*/',css).replace('/*JS*/',js)
url=os.environ.get('ENDPOINT','')
if url: out=out.replace('const DATA_ENDPOINT_URL = "";','const DATA_ENDPOINT_URL = "%s";'%url)
bouw=hashlib.sha1(out.encode('utf-8')).hexdigest()[:10]
out=out.replace("const BOUW = '/*BOUW*/';","const BOUW = '%s';"%bouw)
dest=sys.argv[1] if len(sys.argv)>1 else os.path.join(d,'..','index.html')
open(dest,'w',encoding='utf-8').write(out); print(dest,len(out),bouw)
