import {createHash} from 'node:crypto';
import {newProject} from '../../src/domain/model.ts';
export const original='雨停后，灯还亮着。她把没有寄出的信放回抽屉。\n评论者说：灯象征没有终结的等待。\n';
export const sha=(s:string|Uint8Array)=>createHash('sha256').update(s).digest('hex');
export const base=(r:any,key:string)=>({object_id:r.object.object_id,expected_revision:r.object.revision,expected_sha256:r.sha256,operation_key:key});
export const selection=(r:any)=>({object_id:r.object.object_id,revision:r.object.revision});
export const range=(quote:string)=>{const start=original.indexOf(quote);if(start<0)throw Error('fixture quote');return {source_index:0,byte_start:Buffer.byteLength(original.slice(0,start)),byte_end:Buffer.byteLength(original.slice(0,start+quote.length)),quote};};
export const sourceRef={kind:'resource',work_ref:{workspace_id:'workspace_test',kind:'novel',object_id:'novel_test'},resource_id:'resource_test',revision:1,sha256:sha(original)};
import {blockDigest,readingsDigest,targetDigest} from '../../src/domain/criticism.ts';
export function scenario():any {
 const p=newProject('一盏灯的两种读法');p.brief='准确引用旧站故事，对照等待与告别两种解释，不预设唯一结论。';
 p.evidence=[{id:'primary',label:'原作中的灯',role:'primary',creator:'演示作者',locator:'旧站片段第一句',...range('雨停后，灯还亮着。')},{id:'letter',label:'原作中的未寄信',role:'primary',creator:'演示作者',locator:'旧站片段第二句',...range('她把没有寄出的信放回抽屉。')},{id:'secondary',label:'二手评论的等待解读',role:'secondary',creator:'虚构评论者',locator:'演示评论',...range('评论者说：灯象征没有终结的等待。')}];
 p.readings=[{id:'waiting',title:'没有终结的等待',interpretation:'灯在雨后仍亮着，可读作叙述者没有结束的等待。',evidence_ids:['primary','secondary'],warrant:'仍然与时间延续相关；这是词语带来的解释，不是人物心理的事实证明。',scope:'仅讨论这两句话的修辞，不推断全书结局。'},{id:'leaving',title:'已经开始的告别',interpretation:'信放回抽屉，也可能标志叙述者主动停止寄送。',evidence_ids:['letter','primary'],warrant:'放回是一次主动动作，亮灯未必只指等待，也可能照着离开后的空处。',scope:'保留另一种可讨论的读法，不据此断言作者意图。'}];
 p.relations=[{id:'challenge',from_id:'leaving',to_id:'waiting',kind:'challenges',reason:'主动放回信的动作限制了单一等待解释。'}];
 p.blocks=[{id:'opening',title:'灯的延续',order:1,text:'灯还亮着，却没有告诉我们她是否仍在等待。这个停顿容得下两种方向。'},{id:'ending',title:'从等待到告别',order:2,text:'把信放回抽屉可以是放弃，也可以只是暂停。评论需要说明选择何种解释的理由。'}];
 const excerpt='灯还亮着，却没有告诉我们她是否仍在等待。';p.claims=[{id:'claim',block_id:'opening',block_sha256:blockDigest(p.blocks[0]),byte_start:0,byte_end:Buffer.byteLength(excerpt),excerpt,statement:'亮灯不唯一指向等待',reading_ids:['waiting','leaving'],readings_sha256:readingsDigest(p,['waiting','leaving'])}];
 p.variants=[{id:'variant',block_id:'opening',block_sha256:blockDigest(p.blocks[0]),text:'灯仍亮着，等待却只是其中一种读法。未寄出的信，也可能把叙述推向告别。',rationale:'先收窄结论，再把相反读法带入开头。'}];
 p.notes=[{id:'note',target_kind:'claim',target_id:'claim',target_sha256:targetDigest(p,'claim','claim'),origin:'agent',comment:'引用准确仍需解释推理，保留不同读法。',status:'open',resolution:''}];return p;
}
export function temporary(p:any):any {return {evidence:{...p.evidence[0],id:'temp-evidence'},reading:{...p.readings[0],id:'temp-reading'},relation:{id:'temp-relation',from_id:'waiting',to_id:'leaving',kind:'qualifies',reason:'临时限定关系，与原质疑记录区分。'},block:{...p.blocks[0],id:'temp-block',order:99},claim:{...p.claims[0],id:'temp-claim'},variant:{...p.variants[0],id:'temp-variant'},note:{...p.notes[0],id:'temp-note'}};}
