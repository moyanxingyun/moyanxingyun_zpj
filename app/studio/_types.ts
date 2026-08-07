export type StudioTab = "radar" | "inspiration" | "actions";

export type ArtStyle = "风格化" | "半写实" | "写实" | "待确认";
export type WorkDirection = "美术方向" | "开发技术" | "混合方向";
export type ContentType = "AI 工具" | "制作案例" | "优秀作品" | "前沿研究";
export type ValueLevel = "立即尝试" | "值得关注" | "仅作参考";

export interface IntelItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  publishedAt: string;
  url: string;
  style: ArtStyle;
  direction: WorkDirection;
  type: ContentType;
  value: ValueLevel;
  signal: string;
  saved?: boolean;
  featured?: boolean;
}

export interface ActionItem {
  id: string;
  title: string;
  output: string;
  duration: "30 分钟" | "2 小时" | "1 天";
  skill: string;
  done: boolean;
}

