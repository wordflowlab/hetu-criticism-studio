import {names} from './terms.ts';
import { artifact } from './artifact.ts';
import { validateCriticism,validateCriticismTransition,targetDigest,readingsDigest,checkCriticism,claimReport,readingReport,quoteContext,applyVariant,articleText } from './criticism.ts';
export const validateDomain=validateCriticism;
export function validateTransition(next:any,prev?:any,_action?:string) { validateCriticismTransition(next,prev); }
export async function checkSources(_p:any,_sources:any[],..._rest:any[]){}
export async function pureAction(_a:string,_i:any) { return undefined; }
export async function writeProfessional(a:string,p:any,_sources:any[],i:any,..._rest:any[]) {
  if(a==='apply_variant') return applyVariant(p,i.variant_id);
  throw Error('未知专业写动作。');
}
export function summaries(p:any) {
  return [
    {title:'评论目标',lines:[p.brief]},
    {title:'完整评论',lines:[articleText(p)]},
    {title:'固定引文与出处',lines:p.evidence.map((q:any)=>q.label+'〔'+names[q.role]+'〕\n“'+q.quote+'”\n'+q.creator+' '+q.locator+'\n来源'+q.source_index+' 字节'+q.byte_start+'～'+q.byte_end)},
    {title:'解释、理由与范围',lines:p.readings.map((r:any)=>r.title+'\n'+r.interpretation+'\n理由：'+r.warrant+'\n范围：'+r.scope)},
    {title:'论证关系',lines:p.relations.map((r:any)=>r.from_id+' '+names[r.kind]+' '+r.to_id+'：'+r.reason)},
    {title:'文章主张',lines:p.claims.map((c:any)=>c.statement+'\n固定选区：'+c.excerpt+'\n解释：'+c.reading_ids.join('、'))},
    {title:'备选与理由',lines:p.variants.map((v:any)=>v.text+'\n'+v.rationale)},
    {title:'固定意见',lines:p.notes.map((n:any)=>n.comment+'；'+names[n.status]+' '+n.resolution)},
    {title:'待复核与缺口',lines:[JSON.stringify(checkCriticism(p),null,2)]}
  ];
}
export async function readProfessional(a:string,p:any,sources:any[],i:any,..._rest:any[]) {
  if(a==='target_digest') return {target_sha256:targetDigest(p,i.target_kind,i.target_id)};
  if(a==='check_criticism') return checkCriticism(p);
  if(a==='claim_report') return {claims:claimReport(p)};
  if(a==='claim_basis') return {reading_ids:i.reading_ids,readings_sha256:readingsDigest(p,i.reading_ids)};
  if(a==='argument_map') return {readings:p.readings,relations:p.relations,note:'关系是提交者的论证，不是软件的逻辑认证。'};
  if(a==='reading_report') return readingReport(p,i.reading_id);
  if(a==='quote_context') return quoteContext(p,sources,i.evidence_id,i.context_bytes);
  if(a==='compare_readings') return {from:readingReport(p,i.from_id),to:readingReport(p,i.to_id),note:'比较依据、范围与理由，不自动裁决正确读法。'};
  if(a==='export_article') return {...artifact(articleText(p),'文学评论.txt','text/plain',i),losses:['阅读本只含评论文章，完整引文、论证、意见及备选另见完整工程。']};
  if(a==='export_review') { const {reportHTML}=await import('./report.ts');return artifact(reportHTML({project:p}),'文学评论审核本.html','text/html',i); }
}
