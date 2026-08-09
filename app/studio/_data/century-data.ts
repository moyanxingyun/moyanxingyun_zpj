import type { CenturyDirection, CenturyJobSignal } from "../_types";

export const centuryJobs: CenturyJobSignal[] = [
  {
    id: "scene-concept",
    title: "场景原画 / 游戏美术设计",
    track: "美术岗位",
    locations: "北京 · 福州 · 上海 · 成都（以官网为准）",
    status: "重点匹配",
    requirements: ["造型、构图与色彩基础", "能覆盖场景并理解上下游制作", "关注 AIGC 等前沿美术技术"],
    portfolioEvidence: "一套完整场景设计：世界观母题、关键构图、拆件说明与最终游戏视角。",
    sourceUrl: "https://career.centurygames.cn/campus/jobs",
  },
  {
    id: "3d-environment",
    title: "3D 场景 / 3D 美术资产",
    track: "美术岗位",
    locations: "公开招聘曾覆盖北京等城市",
    status: "高度相关",
    requirements: ["风格化造型与移动端可读性", "模块化资产和材质复用", "引擎内最终表现与性能意识"],
    portfolioEvidence: "一组从概念到 UE5 落地的风格化场景，展示网格、材质、灯光和性能取舍。",
    sourceUrl: "https://career.centurygames.cn/",
  },
  {
    id: "aigc-application",
    title: "AIGC / AI 应用工程",
    track: "技术岗位",
    locations: "北京 · 上海等（以官网为准）",
    status: "能力加分",
    requirements: ["AI 工具与工作流敏感度", "能判断生成结果的可用边界", "把实验转化为稳定生产流程"],
    portfolioEvidence: "AI 生成 → 人工修正 → 引擎验证的对比案例，并量化节省时间与质量问题。",
    sourceUrl: "https://career.centurygames.cn/campus/jobs",
  },
];

export const centuryDirections: CenturyDirection[] = [
  {
    id: "global-slg",
    index: "01",
    title: "全球化 SLG 与题材包装",
    signal: "《Whiteout Survival》与《Kingshot》持续验证“题材切入 + SLG 长线运营”的产品路径。",
    opportunity: "场景不仅要好看，还要服务地图辨识、经营反馈、活动迭代和多文化用户理解。",
    action: "做一组“同一玩法、两种题材包装”的主城概念，并解释视觉信息层级。",
    sourceUrl: "https://www.sjhuatong.com/News/Info.aspx?ID=376214",
  },
  {
    id: "multi-category",
    index: "02",
    title: "多品类与风格化表达",
    signal: "公司公开信息覆盖休闲、角色扮演、策略游戏，并拥有 Roblox 平台产品经验。",
    opportunity: "更看重能跨题材迁移的风格判断、模块化制作与快速验证能力。",
    action: "选择休闲经营或风格化 SLG，完成一套可复用建筑套件与三种等级变化。",
    sourceUrl: "https://www.centurygames.cn/",
  },
  {
    id: "ai-cross-platform",
    index: "03",
    title: "AI、跨平台与前沿技术",
    signal: "官方明确提到正在探索人工智能、跨平台技术及 MR/VR 等前沿领域。",
    opportunity: "对场景美术而言，竞争力来自“会用 AI”与“知道如何进入生产”之间的差别。",
    action: "整理一页 AIGC 场景生产规范：输入、筛选、修正、版权记录和引擎验证。",
    sourceUrl: "https://www.centurygames.cn/",
  },
];

export const centuryProfile = {
  lastChecked: "2026.08.09",
  officialCareerUrl: "https://career.centurygames.cn/campus/jobs",
  companyUrl: "https://www.centurygames.cn/",
  targetScore: 82,
};
