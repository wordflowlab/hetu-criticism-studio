export const config = {
  "fields": {
    "evidence": "evidence",
    "reading": "readings",
    "relation": "relations",
    "block": "blocks",
    "claim": "claims",
    "variant": "variants",
    "note": "notes"
  },
  "defaults": {
    "brief": "",
    "evidence": [],
    "readings": [],
    "relations": [],
    "blocks": [],
    "claims": [],
    "variants": [],
    "notes": []
  },
  "tabs": [
    "评论阅读",
    "引文细读",
    "解释与论证",
    "备选与复核",
    "评论交付"
  ]
} as const;
