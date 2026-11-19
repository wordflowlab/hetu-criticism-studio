# 文学评论

> 把原作引文、解释理由、不同读法与评论文章联系起来，让每次改稿都能回到依据。

## 简介

河图洛书的独立创作插件，由外部Codex通过河图CLI／MCP读取包内Skill并操作。故事分析诊断叙事结构，本包创作独立评论文章；纪实核实主张的事实依据，本包保留解释及竞争读法，不认证评论的唯一正确性、学术原创性或引用权利。没有独立资料抓取、查重服务或作者联系功能。

## 角色分流

- 作者使用 → [插件中心](https://hetu.limeai.run/plugins/criticism-studio/)
- Agent与功能Review → [功能清单](CAPABILITIES.md)
- 开发与维护 → [完整设计文档](docs/README.md)

## 快速上手

开发需要Node.js 25，安装与验收基线为河图0.12.6。

```bash
npm ci
npm run build
npm run check
npm run test:unit
npm run package
```

## 边界

专业成果沿固定来源与修订接续，正文采纳、定稿、费用和外发独立决定。发行及实际验收范围见[实施记录](docs/08-实施计划与验收记录.md)。
