import { canonical, requireValue as need } from '../../vendor/project-store.ts';
import { digest, find, fixedHistory, ordered, unique, checkNotes } from './shared.ts';
import { span,sourceText } from './text.ts';

export interface Quotation { id:string; label:string; role:'primary'|'secondary'; creator:string; locator:string; source_index:number; byte_start:number; byte_end:number; quote:string }
export interface Reading { id:string; title:string; interpretation:string; evidence_ids:string[]; warrant:string; scope:string }
export interface Relation { id:string; from_id:string; to_id:string; kind:'supports'|'challenges'|'qualifies'; reason:string }
export interface Block { id:string; title:string; order:number; text:string }
export interface Claim { id:string; block_id:string; block_sha256:string; byte_start:number; byte_end:number; excerpt:string; statement:string; reading_ids:string[]; readings_sha256:string }
export interface Variant { id:string; block_id:string; block_sha256:string; text:string; rationale:string }
export interface Note { id:string; target_kind:'reading'|'block'|'claim'; target_id:string; target_sha256:string; origin:'author'|'agent'; comment:string; status:'open'|'resolved'; resolution:string }
export interface Criticism { format_version:1; title:string; brief:string; evidence:Quotation[]; readings:Reading[]; relations:Relation[]; blocks:Block[]; claims:Claim[]; variants:Variant[]; notes:Note[]; basis_refs:unknown[] }
export const blockDigest=(block:Block)=>digest(block);
export function readingsDigest(p:Criticism,ids:string[]) {
  unique(ids,'主张解释引用重复。');
  const relations=p.relations.filter(r=>ids.includes(r.from_id)||ids.includes(r.to_id)).slice().sort((a,b)=>a.id.localeCompare(b.id));
  const relatedIds=[...new Set(relations.flatMap(r=>[r.from_id,r.to_id]))].filter(id=>!ids.includes(id)).sort();
  return digest({readings:ids.map(id=>find(p.readings,id,'解释')),relations,related_readings:relatedIds.map(id=>find(p.readings,id,'相关解释'))});
}
export function targetDigest(p:Criticism,kind:string,id:string) {
  if(kind==='reading') return readingsDigest(p,[id]);
  if(kind==='block') return blockDigest(find(p.blocks,id,'段落'));
  need(kind==='claim','未知意见目标。');
  const c:Claim=find(p.claims,id,'主张');
  return digest({claim:c,current_block_sha256:blockDigest(find(p.blocks,c.block_id,'段落')),current_readings_sha256:readingsDigest(p,c.reading_ids)});
}
export function validateCriticism(p:Criticism) {
  for(const q of p.evidence) need(q.byte_end>q.byte_start,'引文字节范围为空或逆序。');
  for(const r of p.readings) {
    need(r.evidence_ids.length>0,'解释至少关联一条已固定引文。');
    unique(r.evidence_ids,'解释引文重复。');
    r.evidence_ids.forEach(id=>find(p.evidence,id,'引文'));
  }
  for(const r of p.relations) {
    find(p.readings,r.from_id,'起点解释');find(p.readings,r.to_id,'终点解释');
    need(r.from_id!==r.to_id,'论证关系不能自指。');
  }
  unique(p.relations.map(r=>canonical([r.from_id,r.to_id,r.kind])),'相同起终点及类型的论证关系重复。');
  unique(p.blocks.map(b=>b.order),'评论段落顺序重复。');
  for(const c of p.claims) {
    const block:Block=find(p.blocks,c.block_id,'段落');
    need(c.reading_ids.length>0,'文章主张至少关联一个解释。');
    readingsDigest(p,c.reading_ids);
    need(c.byte_end>c.byte_start,'文章锚点范围为空或逆序。');
    if(c.block_sha256===blockDigest(block)) need(span(block.text,c.byte_start,c.byte_end)===c.excerpt,'文章锚点与固定段落不符。');
  }
  for(const v of p.variants) find(p.blocks,v.block_id,'段落');
  checkNotes(p,(kind,id)=>targetDigest(p,kind,id));
}
export function validateCriticismTransition(next:Criticism,prev?:Criticism) {
  fixedHistory(next,prev,['evidence']);
  for(const c of next.claims) {
    const old=prev?.claims.find(x=>x.id===c.id),block:Block=find(next.blocks,c.block_id,'段落');
    const anchor=(v:Claim)=>canonical([v.block_id,v.block_sha256,v.byte_start,v.byte_end,v.excerpt]);
    if(!old||anchor(old)!==anchor(c)) need(c.block_sha256===blockDigest(block)&&span(block.text,c.byte_start,c.byte_end)===c.excerpt,'新建或调整的文章锚点必须匹配当前固定段落。','hetu.stale_evidence');
    if(!old||old.readings_sha256!==c.readings_sha256||canonical(old.reading_ids)!==canonical(c.reading_ids)) need(c.readings_sha256===readingsDigest(next,c.reading_ids),'主张解释组合摘要不符。','hetu.stale_evidence');
  }
  for(const v of next.variants) {
    const old=prev?.variants.find(x=>x.id===v.id);
    if(!old||old.block_id!==v.block_id||old.block_sha256!==v.block_sha256) need(v.block_sha256===blockDigest(find(next.blocks,v.block_id)),'备选的原段落已经变化。','hetu.stale_evidence');
  }
  for(const n of next.notes) {
    const old=prev?.notes.find(x=>x.id===n.id);
    if(!old||canonical([old.target_kind,old.target_id,old.target_sha256])!==canonical([n.target_kind,n.target_id,n.target_sha256])) need(n.target_sha256===targetDigest(next,n.target_kind,n.target_id),'意见的固定目标摘要不符。','hetu.stale_evidence');
  }
}
export function claimReport(p:Criticism) {
  return p.claims.map(c=>({claim:c,anchor_stale:c.block_sha256!==blockDigest(find(p.blocks,c.block_id)),readings_stale:c.readings_sha256!==readingsDigest(p,c.reading_ids),current_excerpt:c.block_sha256===blockDigest(find(p.blocks,c.block_id))?span(find(p.blocks,c.block_id).text,c.byte_start,c.byte_end):null}));
}
export function readingReport(p:Criticism,id:string) {
  const reading:Reading=find(p.readings,id,'解释');
  return {reading,evidence:reading.evidence_ids.map(id=>find(p.evidence,id,'引文')),relations:p.relations.filter(r=>r.from_id===id||r.to_id===id),claims:p.claims.filter(c=>c.reading_ids.includes(id)),note:'引文准确不等于解释成立；理由与适用范围由作者审阅。'};
}
export function checkCriticism(p:Criticism) {
  const claims=claimReport(p);
  return {
    stale_anchor_ids:claims.filter(c=>c.anchor_stale).map(c=>c.claim.id),
    stale_claim_basis_ids:claims.filter(c=>c.readings_stale).map(c=>c.claim.id),
    stale_variant_ids:p.variants.filter(v=>v.block_sha256!==blockDigest(find(p.blocks,v.block_id))).map(v=>v.id),
    stale_note_ids:p.notes.filter(n=>n.target_sha256!==targetDigest(p,n.target_kind,n.target_id)).map(n=>n.id),
    secondary_only_reading_ids:p.readings.filter(r=>!r.evidence_ids.some(id=>find(p.evidence,id).role==='primary')).map(r=>r.id),
    unanchored_block_ids:p.blocks.filter(b=>!p.claims.some(c=>c.block_id===b.id)).map(b=>b.id),
    unused_evidence_ids:p.evidence.filter(e=>!p.readings.some(r=>r.evidence_ids.includes(e.id))).map(e=>e.id),
    note:'检查揭示依据缺口，不评分解释真伪、原创性或文学品质。'
  };
}
export function quoteContext(p:Criticism,sources:any[],id:string,budget=256) {
  const q:Quotation=find(p.evidence,id,'引文'),text=sourceText(sources[q.source_index]),bytes=Buffer.from(text);
  let start=Math.max(0,q.byte_start-budget),end=Math.min(bytes.length,q.byte_end+budget);
  while(start<q.byte_start&&(bytes[start]&0xc0)===0x80) start++;
  while(end>q.byte_end&&end<bytes.length&&(bytes[end]&0xc0)===0x80) end--;
  return {evidence:q,byte_start:start,byte_end:end,before:span(text,start,q.byte_start),quote:q.quote,after:span(text,q.byte_end,end),total_source_bytes:bytes.length,complete:start===0&&end===bytes.length};
}
export function applyVariant(p:Criticism,id:string) {
  const v:Variant=find(p.variants,id,'备选'),block:Block=find(p.blocks,v.block_id,'段落');
  need(v.block_sha256===blockDigest(block),'原段落已经变化，请重新比较备选。','hetu.stale_evidence');
  block.text=v.text;
}
export const articleText=(p:Criticism)=>p.title+'\n\n'+ordered(p.blocks).map(b=>b.title+'\n\n'+b.text).join('\n\n');
