// Ръководство „Цитирания“ (само за членовете с акаунт): guide.html → public/docs/URSlab-citirania.pdf
// Пускане: node scripts/citation-guide/pdf.js "$PWD/scripts/citation-guide" && cp scripts/citation-guide/URSlab-citirania.pdf public/docs/
// Снимките (s*.png) са от изградения сайт; обновете ги при промяна на формата.
const {chromium}=require('playwright');
(async()=>{const d=process.argv[2];const b=await chromium.launch();const p=await b.newPage();
await p.goto('file://'+d+'/guide.html',{waitUntil:'networkidle'});
await p.pdf({path:d+'/URSlab-citirania.pdf',format:'A4',printBackground:true,displayHeaderFooter:true,headerTemplate:'<span></span>',footerTemplate:'<div style="font-size:7pt;color:#8ea3b6;width:100%;text-align:right;padding-right:16mm">URSlab · Цитирания · <span class="pageNumber"></span>/<span class="totalPages"></span></div>',margin:{top:'16mm',bottom:'18mm',left:'16mm',right:'16mm'}});
await b.close();})();
