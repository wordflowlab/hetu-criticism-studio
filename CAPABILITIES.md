# 文学评论功能清单

本包拥有专业能力；宿主拥有正文、来源与作者决定。

| 动作 | 用途 | 必填参数 | 效果 |
| --- | --- | --- | --- |
| list_projects | 查找专业工程 |  | read |
| get_project | 读取固定专业工程 | object_id | read |
| save_project | 保存完整专业工程 | expected_revision, expected_sha256, operation_key, content | managed_write |
| get_source | 分块读取固定来源 | object_id, source_index | read |
| get_basis | 读取固定专业依据 | object_id, basis_index | read |
| compare_versions | 比较固定专业修订 | object_id, from_revision, to_revision | read |
| export_project | 分块导出完整专业数据 | object_id, format | read |
| build_context | 准备有界创作上下文 | object_id, goal, max_chars | read |
| create_handoff | 准备本工程AI接续 | object_id, goal | read |
| get_operation | 回读原操作 | operation_key | read |
| put_evidence | 维护固定引文 | object_id, expected_revision, expected_sha256, operation_key, evidence | managed_write |
| put_reading | 维护解释方案 | object_id, expected_revision, expected_sha256, operation_key, reading | managed_write |
| remove_reading | 移除解释方案 | object_id, expected_revision, expected_sha256, operation_key, reading_id | managed_write |
| put_relation | 维护论证关系 | object_id, expected_revision, expected_sha256, operation_key, relation | managed_write |
| remove_relation | 移除论证关系 | object_id, expected_revision, expected_sha256, operation_key, relation_id | managed_write |
| put_block | 维护评论段落 | object_id, expected_revision, expected_sha256, operation_key, block | managed_write |
| remove_block | 移除评论段落 | object_id, expected_revision, expected_sha256, operation_key, block_id | managed_write |
| put_claim | 维护文章主张 | object_id, expected_revision, expected_sha256, operation_key, claim | managed_write |
| remove_claim | 移除文章主张 | object_id, expected_revision, expected_sha256, operation_key, claim_id | managed_write |
| put_variant | 维护局部备选 | object_id, expected_revision, expected_sha256, operation_key, variant | managed_write |
| remove_variant | 移除局部备选 | object_id, expected_revision, expected_sha256, operation_key, variant_id | managed_write |
| put_note | 维护固定意见 | object_id, expected_revision, expected_sha256, operation_key, note | managed_write |
| remove_note | 移除固定意见 | object_id, expected_revision, expected_sha256, operation_key, note_id | managed_write |
| target_digest | 读取固定目标摘要 | object_id, target_kind, target_id | read |
| apply_variant | 使用固定局部备选 | object_id, expected_revision, expected_sha256, operation_key, variant_id | managed_write |
| check_criticism | 检查引文论证与待复核 | object_id | read |
| argument_map | 读取解释与论证关系 | object_id | read |
| claim_report | 读取文章锚点与依据变化 | object_id | read |
| reading_report | 细读解释方案与竞争读法 | object_id, reading_id | read |
| claim_basis | 固定解释与相关论证组合 | object_id, reading_ids | read |
| quote_context | 回读固定引文上下文 | object_id, evidence_id | read |
| compare_readings | 比较两种解释范围与理由 | object_id, from_id, to_id | read |
| export_article | 导出专业阅读本 | object_id | read |
| export_review | 导出完整专业审核本 | object_id | read |

默认流程、边界及验收见 [docs](docs/README.md)。
