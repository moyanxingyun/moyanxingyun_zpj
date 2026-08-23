"use client";

import { useEffect, useMemo, useState } from "react";

type View = "overview" | "jobs" | "resume" | "pipeline";
type JobStatus = "收藏" | "准备中" | "已投递" | "笔试/测试" | "面试";
type CampaignStatus = "正在招聘" | "实习可转正" | "持续开放" | "入口关注" | "当前无美术岗" | "已结束参考";
type OpportunityType = "正式校招" | "实习生" | "日常实习" | "校招关注";
type ScaleTier = "大型企业" | "中型企业" | "小型/独立团队";
type UploadState = "idle" | "parsing" | "success" | "error";
type DetailLevel = "具体岗位" | "招聘批次" | "公司级监控";

type Job = {
  id: number;
  company: string;
  initials: string;
  role: string;
  city: string;
  deadline: string;
  daysLeft: number;
  match: number;
  status: JobStatus;
  tags: string[];
  business: string;
  scale: string;
  project: string;
  source: string;
  sourceUrl: string;
  campaign: CampaignStatus;
  opportunityType?: OpportunityType;
  scaleTier?: ScaleTier;
  verifiedAt: string;
  requirements: string[];
  responsibilities?: string[];
  portfolioRequirements?: string[];
  publishedAt?: string;
  availabilityNote?: string;
  reasons: string[];
  missing: string[];
  accent: string;
};

const demoJobs: Job[] = [
  {
    id: 1,
    company: "网易游戏（互娱）",
    initials: "NE",
    role: "2027届校园招聘｜游戏美术方向",
    city: "广州/杭州/上海",
    deadline: "官网未公布统一截止日",
    daysLeft: 99,
    match: 94,
    status: "准备中",
    opportunityType: "正式校招",
    scaleTier: "大型企业",
    tags: ["27届正式校招", "游戏美术", "3D场景", "作品集"],
    business: "游戏研发、全球发行与长线运营",
    scale: "大型上市互联网与游戏公司",
    project: "多品类自研游戏与全球化项目",
    source: "网易游戏校园招聘官网",
    sourceUrl: "https://game.campus.163.com/",
    campaign: "正在招聘",
    verifiedAt: "2026-08-19",
    publishedAt: "2026-07-21",
    availabilityNote: "官方2027届校招已于2026-07-21开放｜面向2026-09至2027-08毕业生｜广州、杭州、上海均有岗位｜官网未公布统一截止日",
    requirements: ["面向2027届毕业生，毕业区间为2026年9月至2027年8月", "艺术与设计类岗位需按职位详情提交作品集", "可同时投递2个志愿，进入流程前可修改或增加志愿", "具体场景制作、技术美术等职位以官方实时岗位列表为准"],
    reasons: ["2027届校园招聘已经公开启动", "游戏美术方向与数字媒体艺术专业高度相关", "你的 UE5 场景搭建和 PBR 流程可作为主投作品"],
    missing: ["需要针对不同工作室调整作品集风格", "建议补充性能优化数据与引擎内拆解"],
    accent: "#b83c36",
  },
  {
    id: 2,
    company: "腾讯游戏",
    initials: "TG",
    role: "2027届游戏美术设计实习生",
    city: "深圳/成都/上海",
    deadline: "滚动招募",
    daysLeft: 99,
    match: 93,
    status: "收藏",
    tags: ["3D场景", "技术美术", "原画", "可转正"],
    business: "游戏研发、发行、电竞与全球化内容业务",
    scale: "大型综合互联网集团",
    project: "天美、光子、魔方及其他游戏工作室群",
    source: "腾讯招聘官网及公开校招宣讲",
    sourceUrl: "https://hr.tencent.com/zh-cn/campus/",
    campaign: "实习可转正",
    verifiedAt: "2026-08-07",
    requirements: ["面向2027届，细分方向包含3D场景与技术美术", "作品集链接需随简历提交", "具备美术资源制作、优化和团队协作能力"],
    reasons: ["岗位明确覆盖3D场景制作方向", "你的场景建模和UE5地编能力可直接对应", "实习转正路径适合提前锁定秋招机会"],
    missing: ["建议增加一项多人协作案例", "需要为不同工作室准备写实与风格化两个版本"],
    accent: "#2f75b5",
  },
  {
    id: 3,
    company: "完美世界游戏",
    initials: "PW",
    role: "2027届实习生｜美术设计类",
    city: "北京/上海/苏州",
    deadline: "招满即止",
    daysLeft: 99,
    match: 91,
    status: "已投递",
    tags: ["27届实习", "美术设计", "作品集", "MMO"],
    business: "游戏研发、发行及电竞相关业务",
    scale: "大型上市游戏公司",
    project: "MMO、主机与多端游戏项目",
    source: "完美世界校园招聘官网",
    sourceUrl: "https://recruit.games.wanmei.com/",
    campaign: "实习可转正",
    verifiedAt: "2026-08-09",
    requirements: ["2027届实习面向2026年9月至2027年8月毕业生", "美术设计类岗位必须上传作品集", "每位候选人最多可投递两个职位"],
    reasons: ["官方明确开放2027届实习项目", "大型3D项目对场景资产与引擎能力需求稳定", "你的完整场景案例适合作为第一志愿材料"],
    missing: ["需要明确展示三角面、贴图规格和优化思路", "建议强化写实建筑与模块化资产案例"],
    accent: "#7258a5",
  },
  {
    id: 4,
    company: "叠纸游戏",
    initials: "PG",
    role: "2027届秋招｜美术设计 / 动画CG方向",
    city: "上海",
    deadline: "2026-10-31",
    daysLeft: 71,
    match: 90,
    status: "准备中",
    opportunityType: "正式校招",
    scaleTier: "大型企业",
    tags: ["27届秋招", "美术设计", "动画CG", "作品集"],
    business: "原创游戏、动画与IP内容研发",
    scale: "大型精品游戏研发公司",
    project: "暖暖系列、恋与系列及开放世界项目",
    source: "叠纸游戏招聘官方公众号及校园招聘官网",
    sourceUrl: "https://career.papegames.com/campus/position/list",
    campaign: "正在招聘",
    verifiedAt: "2026-08-21",
    publishedAt: "2026-08-05",
    availabilityNote: "官方2027届秋招正在招聘｜面向2026-09至2027-08毕业生｜网申截止2026-10-31｜原NOVA训练营已结束，现已切换为秋招正式批",
    requirements: ["面向2027届毕业生，毕业区间为2026年9月至2027年8月", "开放美术设计类与动画CG类职位，具体场景方向以官方实时列表为准", "每人最多同时投递2个岗位", "美术岗位须随简历附作品集；压缩包不超过300MB，超出时需提供可访问的云端链接"],
    reasons: ["2027届秋招正式批已启动，不再是已结束的NOVA训练营", "叠纸的开放世界与高品质3D项目重视场景、灯光和引擎表现", "你的风格化场景、PBR和UE5能力适合用于美术设计类岗位筛选"],
    missing: ["投递前需在官方实时列表确认具体场景岗位名称与JD", "建议增加更精致的风格化材质和环境叙事案例", "作品集云端链接需提前检查访问权限"],
    accent: "#c7819a",
  },
  {
    id: 5,
    company: "巨人网络",
    initials: "ZT",
    role: "游戏3D场景设计师（校招）",
    city: "上海",
    deadline: "持续开放",
    daysLeft: 99,
    match: 89,
    status: "收藏",
    tags: ["3D场景", "技术美术", "Maya", "ZBrush"],
    business: "网络游戏研发与发行",
    scale: "大型上市游戏公司",
    project: "征途系列及多品类研发项目",
    source: "巨人网络校园招聘官网",
    sourceUrl: "https://hr.ztgame.com/campus/",
    campaign: "正在招聘",
    verifiedAt: "2026-08-19",
    availabilityNote: "官方岗位页当前仍展示游戏3D场景设计师｜官网未公布统一截止日｜投递前请在职位详情再次确认批次与毕业届别",
    requirements: ["美术相关专业，掌握两款以上主流美术软件", "根据原画和技术规范完成3D模型及材质", "重视造型、色彩、学习能力和协作意识"],
    reasons: ["官网当前展示3D场景和美术向TA岗位", "你的Maya、ZBrush与PBR技能直接匹配", "校招岗位类别清晰，适合重点投递"],
    missing: ["需要将软件技能转化为可量化的项目成果", "TA方向需额外补充脚本或Shader基础"],
    accent: "#d15b44",
  },
  {
    id: 47,
    company: "巨人网络",
    initials: "ZT",
    role: "游戏3D场景实习生",
    city: "上海",
    deadline: "官网未公布统一截止日",
    daysLeft: 99,
    match: 94,
    status: "准备中",
    opportunityType: "实习生",
    scaleTier: "大型企业",
    tags: ["实习", "3D场景", "二次元", "U3D/UE4"],
    business: "网络游戏研发与发行",
    scale: "大型上市游戏公司",
    project: "征途系列、球球大作战、太空杀、超自然行动组等",
    source: "巨人网络校园招聘官网及官方投递入口",
    sourceUrl: "https://app.mokahr.com/campus-recruitment/ztgame/92438",
    campaign: "正在招聘",
    verifiedAt: "2026-08-19",
    availabilityNote: "巨人网络官网当前列出游戏3D场景实习生并开放实习生投递｜官网未公开统一截止日｜第三方HR职位页显示上海岗位仍在投递期，截止日期以官方系统为准",
    requirements: ["制作标准化工业流程的二次元场景模型", "对二次元模型造型、材质表现和环境灯光有基础理解", "了解U3D或UE4引擎可作为加分项", "具体实习周期、作品集格式与截止时间以官方投递系统为准"],
    reasons: ["岗位与游戏场景建模和材质制作方向直接匹配", "你的Maya、ZBrush、Substance Painter与UE5流程可覆盖核心要求", "二次元场景与环境灯光要求适合用完整引擎场景证明能力"],
    missing: ["建议补充二次元场景模型、材质和灯光的一体化案例", "投递前确认每周到岗天数、实习周期及作品集附件限制"],
    accent: "#d15b44",
  },
  {
    id: 6, company: "米哈游", initials: "MHY", role: "2027届秋招｜场景模型师", city: "上海", deadline: "2026-10-31", daysLeft: 82, match: 96, status: "准备中", opportunityType: "正式校招", scaleTier: "大型企业",
    tags: ["27届秋招", "场景模型", "3D场景", "作品集"], business: "原创IP游戏与多元内容研发", scale: "官网披露约5000人", project: "原神、崩坏：星穹铁道、绝区零等", source: "米哈游2027届校园招聘官方职位列表", sourceUrl: "https://jobs.mihoyo.com/#/campus/position?jobName=%E5%9C%BA%E6%99%AF&projectIds%5B0%5D=13&competencyTypes%5B0%5D=2", campaign: "正在招聘", verifiedAt: "2026-08-10", availabilityNote: "官方当前在招｜2027届应届生职位117个｜美术&表现类30个｜应届生截止2026-10-31",
    requirements: ["官方职位列表当前显示场景模型师为上海全职岗位", "面向2027届毕业生，毕业区间为2026年9月至2027年8月", "应届生职位仅能投递1个，需在场景模型与其他方向之间慎重选择", "具体制作要求、测试安排与作品集格式以登录后的职位详情和邮件通知为准"], reasons: ["官方当前存在明确的场景模型师职位，不再只是公司级关注", "岗位与3D场景建模、PBR材质和引擎落地方向高度匹配", "上海同时开放关卡美术和技术美术，可横向比较后选择唯一志愿"], missing: ["建议强化风格化场景完成度与引擎内最终效果", "投递前需在官方详情中再次核对作品集格式和美术测试要求"], accent: "#5d81bb",
  },
  {
    id: 45, company: "米哈游", initials: "MHY", role: "2027届秋招｜关卡美术设计师", city: "上海", deadline: "2026-10-31", daysLeft: 82, match: 95, status: "准备中", opportunityType: "正式校招", scaleTier: "大型企业",
    tags: ["27届秋招", "关卡美术", "场景地编", "开放世界"], business: "原创IP游戏与多元内容研发", scale: "官网披露约5000人", project: "原神、崩坏：星穹铁道、绝区零等", source: "米哈游2027届校园招聘官方职位列表", sourceUrl: "https://jobs.mihoyo.com/#/campus/position?jobName=%E5%9C%BA%E6%99%AF&projectIds%5B0%5D=13&competencyTypes%5B0%5D=2", campaign: "正在招聘", verifiedAt: "2026-08-10", availabilityNote: "官方当前在招｜场景关键词筛选共6个结果｜应届生截止2026-10-31",
    requirements: ["官方职位列表当前显示关卡美术设计师为上海全职岗位", "面向2027届毕业生，毕业区间为2026年9月至2027年8月", "应届生职位仅能投递1个，不能同时投递场景模型师", "具体职责、作品集和专业测试要求以官方职位详情为准"], reasons: ["岗位名称与游戏场景地编和关卡落地方向直接对应", "UE5地编、模块化资产、环境叙事和动线设计可作为核心作品证据", "适合用完整场景从灰盒到最终画面的流程说明进行定向投递"], missing: ["建议补充灰盒、动线、视线引导和资产复用拆解", "需明确展示画面质量与关卡可玩性的平衡过程"], accent: "#5d81bb",
  },
  {
    id: 46, company: "米哈游", initials: "MHY", role: "2027届秋招｜技术美术-多方向", city: "上海", deadline: "2026-10-31", daysLeft: 82, match: 92, status: "收藏", opportunityType: "正式校招", scaleTier: "大型企业",
    tags: ["27届秋招", "技术美术", "渲染/工具", "性能优化/PCG"], business: "原创IP游戏与多元内容研发", scale: "官网披露约5000人", project: "原神、崩坏：星穹铁道、绝区零等", source: "米哈游2027届校园招聘官方职位列表", sourceUrl: "https://jobs.mihoyo.com/#/campus/position?projectIds%5B0%5D=13&competencyTypes%5B0%5D=2", campaign: "正在招聘", verifiedAt: "2026-08-10", availabilityNote: "官方当前在招｜方向包含渲染、动画、工具、特效、性能优化与PCG｜应届生截止2026-10-31",
    requirements: ["官方职位列表当前显示技术美术-多方向为上海全职岗位", "公开方向标签包含渲染、动画、工具、特效、性能优化和PCG", "面向2027届毕业生，毕业区间为2026年9月至2027年8月", "应届生职位仅能投递1个，建议先比较TA与纯场景美术的作品匹配度"], reasons: ["地编流程、材质节点、性能优化和PCG能力可以向TA方向延伸", "可用工具化、批量资产生产与性能对比展示差异化", "岗位方向覆盖面较广，适合已有引擎技术积累的场景美术学生"], missing: ["需要至少一项可运行的Shader、工具、PCG或性能优化案例", "如果技术证明不足，应优先投递场景模型师或关卡美术"], accent: "#5d81bb",
  },
  {
    id: 7, company: "莉莉丝游戏", initials: "LLS", role: "校园招聘｜游戏美术方向", city: "上海", deadline: "关注岗位更新", daysLeft: 99, match: 86, status: "收藏",
    tags: ["全球发行", "风格化", "场景", "策略游戏"], business: "游戏自研与全球发行", scale: "大型精品游戏公司", project: "多款全球化策略与角色扮演游戏", source: "莉莉丝游戏招聘官网", sourceUrl: "https://jobs.lilith.com/", campaign: "入口关注", verifiedAt: "2026-08-07",
    requirements: ["校园招聘岗位随批次更新", "美术岗位重视艺术基础、软件能力和游戏理解", "全球化项目强调风格适配与跨团队协作"], reasons: ["你的场景氛围能力适合全球化风格项目", "招聘官网设有独立校园招聘入口", "策略与RPG项目需要大量环境资产"], missing: ["建议增加移动端可读性和性能预算说明", "作品集需要更突出风格研究"], accent: "#8a3b63",
  },
  {
    id: 8, company: "西山居", initials: "XJ", role: "校园招聘｜3D场景 / 场景关卡", city: "珠海/广州/成都", deadline: "关注岗位更新", daysLeft: 99, match: 87, status: "收藏",
    tags: ["3D场景", "场景关卡", "国风", "技术美术"], business: "网络游戏与多端游戏研发运营", scale: "大型老牌游戏研发公司", project: "剑网3系列及多品类在研项目", source: "西山居官网招聘入口", sourceUrl: "https://www.xishanju.com/", campaign: "入口关注", verifiedAt: "2026-08-07",
    requirements: ["往期校招明确包含3D角色/场景、场景关卡与技术美术", "岗位分布珠海、广州、武汉、成都等地", "具体2027届批次需以官网最新公告为准"], reasons: ["岗位方向与你的场景建模和地编高度一致", "国风项目适合补充建筑与自然场景研究", "城市选择范围较多"], missing: ["需要补充国风建筑结构和文化参考", "建议展示关卡动线与地编逻辑"], accent: "#b07e43",
  },
  {
    id: 9, company: "吉比特 & 雷霆游戏", initials: "GB", role: "校园招聘｜美术设计方向", city: "厦门/深圳", deadline: "持续关注", daysLeft: 99, match: 83, status: "收藏",
    tags: ["美术设计", "风格化", "研发发行", "校招"], business: "游戏研发、运营与发行", scale: "上市游戏公司", project: "问道手游、一念逍遥、奥比岛等", source: "吉比特雷霆校园招聘官网", sourceUrl: "https://hr.g-bits.com/", campaign: "持续开放", verifiedAt: "2026-08-07",
    requirements: ["官网提供独立校园招聘职位入口", "岗位覆盖美术、策划、技术和发行方向", "具体美术细分岗位以实时列表为准"], reasons: ["风格化与多品类项目覆盖面较广", "你的完整场景案例可适配美术设计岗", "研发与发行一体有利于理解生产流程"], missing: ["建议增加更鲜明的风格化作品", "需要关注厦门和深圳的地点偏好"], accent: "#da6b3d",
  },
  {
    id: 10, company: "三七互娱", initials: "37", role: "2027届秋招｜场景原画 / 2D场景编辑", city: "广州/上海/北京", deadline: "招满即止", daysLeft: 99, match: 86, status: "准备中", opportunityType: "正式校招", scaleTier: "大型企业",
    tags: ["27届秋招", "场景原画", "2D场景编辑", "作品集"], business: "游戏研发、运营与全球发行", scale: "1000–5000人（高校官方招聘页披露）", project: "斗罗大陆：魂师对决、Puzzles & Survival、寻道大千等", source: "三七互娱官方招聘入口及高校就业网招聘简章", sourceUrl: "https://zhaopin.37.com/", campaign: "正在招聘", verifiedAt: "2026-08-22", publishedAt: "2026-08-14", availabilityNote: "2027届秋招已于2026-08-14开放｜场景相关岗位包含场景原画与2D场景编辑｜岗位招满即止｜未标注城市的岗位默认广州",
    responsibilities: ["参与项目场景视觉方向的设计与生产，依据项目风格完成场景原画或2D场景编辑工作。", "与策划、程序及其他美术岗位协作，跟进场景资源在游戏中的最终落地效果。", "根据版本反馈持续迭代画面，保证风格统一、信息可读与制作质量。"],
    requirements: ["面向2027届毕业生，毕业时间为2026年9月至2027年8月", "公开美术岗位包含场景原画师与2D场景编辑师；当前正式批未列出3D场景模型或地编岗", "每位同学可投递2个志愿，岗位招满即止", "具体作品集格式、测试题与岗位余量以官方投递系统为准"],
    portfolioRequirements: ["场景美术岗位应随简历附作品集，并清楚标注个人职责。", "建议把构图、色彩、空间层次与场景叙事过程放在前部。", "你的3D场景作品可转化为场景设计证据，但需补充2D设计稿、氛围草图或paint-over过程。"],
    reasons: ["正式秋招已开启，且有明确的场景原画与2D场景编辑岗位", "UE5场景与模块化资产能力可作为空间设计和落地能力证明", "全球发行项目重视风格适配与移动端画面可读性"], missing: ["当前批次没有公开3D场景模型或地编岗位，不应误标为3D方向", "如果缺少2D场景设计过程，应优先补充草图、构图与色彩方案"], accent: "#d39b28",
  },
  {
    id: 49, company: "乐狗游戏", initials: "LG", role: "2027届秋招｜游戏场景原画设计", city: "成都", deadline: "2026-09-11", daysLeft: 20, match: 84, status: "准备中", opportunityType: "正式校招", scaleTier: "中型企业",
    tags: ["27届秋招", "场景原画", "欧美卡通", "SLG"], business: "策略游戏研发与全球市场产品开发", scale: "中型精品游戏研发公司（官网未披露人数）", project: "万国觉醒、万龙觉醒", source: "乐狗游戏官方校招专场职位页", sourceUrl: "https://www.nowcoder.com/jobs/company-project?projectId=2638&urlSource=sitemap", campaign: "正在招聘", verifiedAt: "2026-08-22", publishedAt: "2026-08-17", availabilityNote: "2027届秋招已于2026-08-17启动｜简历投递截止2026-09-11｜远程面试2026-08-24至09-30｜9月中旬起陆续发放Offer",
    responsibilities: ["根据游戏整体风格完成场景原画设计与绘制。", "负责项目宣传所需插图，并为UI设计提供必要的原画内容支持。", "按项目负责人安排完成其他相关美术工作并配合团队迭代。"],
    requirements: ["2027届本科及以上学历，美术、设计等相关专业", "具备扎实的手绘、造型与色彩能力，能适应多种绘画风格", "熟悉电脑绘图流程并熟练使用Photoshop等2D设计软件", "了解游戏中不同风格的定位与差异，对欧美卡通风格有热情", "简历中需备注个人游戏经历"],
    portfolioRequirements: ["申请时必须上传个人作品集，擅长欧美卡通风格更佳。", "建议展示场景构图、色彩稿、建筑设计与最终氛围图的完整过程。", "如果以3D场景作品申请，需补充前期设计稿和对欧美卡通风格的转译说明。"],
    reasons: ["这是当前明确开放并设有准确截止日的中型游戏公司场景美术岗位", "万国觉醒与万龙觉醒的SLG项目需要清晰的建筑层级和场景叙事", "你的3D场景能力可证明空间设计与最终落地能力"], missing: ["岗位核心偏2D场景原画，并非3D场景建模或地编", "需重点补充欧美卡通场景的手绘、造型与色彩能力"], accent: "#4e7d63",
  },
  {
    id: 11, company: "库洛游戏", initials: "KU", role: "校园招聘关注｜3D场景 / 地编", city: "广州/上海", deadline: "等待27届批次", daysLeft: 99, match: 89, status: "收藏",
    tags: ["开放世界", "3D场景", "地编", "二次元"], business: "二次元动作游戏研发与全球发行", scale: "大型游戏研发公司", project: "鸣潮、战双帕弥什", source: "库洛游戏招聘入口", sourceUrl: "https://www.kurogames.com/", campaign: "入口关注", verifiedAt: "2026-08-07",
    requirements: ["往届校招明确包含3D/2D场景、地编和技术美术", "2027届正式批次尚需等待官方确认", "开放世界项目重视地形、植被、灯光和性能控制"], reasons: ["你的UE5地编方向与开放世界环境需求高度相关", "目标项目的场景规模适合你的职业规划", "应作为秋招重点监控公司"], missing: ["需要强化大型场景优化与植被系统", "建议增加开放世界地编拆解图"], accent: "#242b34",
  },
  {
    id: 12, company: "游卡", initials: "YK", role: "2027届实习｜场景设计 / 3D建模", city: "杭州/上海/广州/成都", deadline: "招满即止", daysLeft: 99, match: 85, status: "收藏",
    tags: ["27届实习", "场景设计", "3D建模", "多城市"], business: "桌游、线上游戏、音视频与电竞内容", scale: "公开招聘信息称近2500人", project: "三国杀IP及多场景文化娱乐产品", source: "高校就业网公开招聘简章", sourceUrl: "https://www.yokaverse.com/", campaign: "正在招聘", verifiedAt: "2026-08-07",
    requirements: ["面向2027届毕业生", "美术表现类包含场景设计与3D建模", "工作地点覆盖杭州、上海、广州和成都"], reasons: ["岗位明确包含场景设计和3D建模", "城市选择较多", "适合用完整场景作品直接投递"], missing: ["需要到官方渠道二次确认具体职位余量", "建议准备偏国风或卡牌叙事的作品排序"], accent: "#956344",
  },
  {
    id: 13, company: "灵犀互娱", initials: "LX", role: "2027届秋招｜游戏3D场景", city: "广州", deadline: "官网未公布统一截止日", daysLeft: 99, match: 94, status: "准备中", opportunityType: "正式校招", scaleTier: "大型企业",
    tags: ["27届秋招", "游戏3D场景", "建筑/场景氛围", "作品集"], business: "阿里巴巴旗下游戏研发与发行品牌", scale: "大型互联网集团游戏业务", project: "SLG、MMO、卡牌与箱庭等项目", source: "阿里巴巴2027届应届生官方职位页", sourceUrl: "https://campus-talent.alibaba.com/campus/position/199907680020?deptCodes=YQNHYU", campaign: "正在招聘", verifiedAt: "2026-08-08", publishedAt: "2026-08-06", availabilityNote: "官方当前在招｜职位更新于 2026-08-06｜毕业区间 2026-11-01 至 2027-10-31",
    responsibilities: ["根据项目世界观构思、设计并落地游戏场景，为玩家建立完整的视觉体验。", "参与宏大游戏世界的场景画面构建，并在团队协作中持续深化个人专项能力。", "入职后接受规范培训和导师指导，向美术设计业务骨干方向成长。"],
    requirements: ["具备扎实的专业技术、审美、沟通协作与自驱能力，有游戏行业实习经验更佳", "熟练使用 Unity、3ds Max、Maya、Substance Painter、Photoshop、ZBrush 等常用工具", "了解中国历史，对建筑、场景氛围和地理环境设计有一定理解", "热爱游戏，关注玩法与创新体验"],
    portfolioRequirements: ["简历必须附作品，接受 PDF 附件或作品网页链接。", "官方明确要求不要使用网盘链接。", "建议突出建筑结构、场景氛围、地理环境研究与个人职责。"],
    reasons: ["官方职位与游戏场景建模和地编方向直接匹配", "数字媒体艺术专业与岗位工具链高度相关", "中国建筑和环境叙事可转化为作品集差异化优势"], missing: ["官网没有披露统一截止日，岗位可能滚动关闭", "建议补充中国建筑史研究与可落地的场景设计说明"], accent: "#e77b28",
  },
  {
    id: 14, company: "英雄游戏", initials: "YX", role: "2027届实习生｜游戏美术类", city: "北京/上海", deadline: "招满即止", daysLeft: 99, match: 80, status: "收藏",
    tags: ["27届实习", "游戏美术", "研发发行"], business: "游戏研发、发行与电竞相关业务", scale: "大型游戏公司", project: "多品类移动与主机游戏项目", source: "高校就业网招聘公告", sourceUrl: "https://www.yingxiong.com/", campaign: "正在招聘", verifiedAt: "2026-08-07",
    requirements: ["2027届实习项目公开包含美术类岗位", "具体场景岗位需以实时职位列表为准", "建议准备作品集与可持续实习时间说明"], reasons: ["适合作为大厂之外的重点补充投递", "研发与发行项目覆盖多个美术方向", "可积累真实游戏生产经验"], missing: ["当前公开信息未细分到场景岗位", "投递前需再次核验职位名称和地点"], accent: "#315d82",
  },
  {
    id: 15, company: "鹰角网络", initials: "HG", role: "2027届秋招｜场景模型", city: "上海", deadline: "2026-10-31", daysLeft: 83, match: 96, status: "准备中", opportunityType: "正式校招", scaleTier: "大型企业",
    tags: ["27届秋招", "场景模型", "模块化建筑", "植被/地编"], business: "原创游戏与文化内容研发", scale: "头部精品游戏研发公司", project: "明日方舟及多款在研项目", source: "鹰角网络2027届秋招官方职位页", sourceUrl: "https://app.mokahr.com/campus-recruitment/hypergryph/26326#/job/fa56465b-87ce-498e-b26a-4b38286af876", campaign: "正在招聘", verifiedAt: "2026-08-09", publishedAt: "2026-08-07", availabilityNote: "官方当前在招｜网申期 2026-08-07 至 2026-10-31｜每人最多投递2次",
    responsibilities: ["制作植被、山石、地形、建筑、部件和道具等游戏场景模型资源。", "独立完成高模、低模、UV、贴图全流程，并掌握生态与建筑物件的材质表现。", "控制面数与视觉效果，使用模块化建筑思路平衡资源复用性和独特性。"],
    requirements: ["美术、动画、数字媒体、环境艺术等相关专业优先", "熟练使用 3ds Max 或 Maya，并掌握 Photoshop、Substance Painter、ZBrush", "理解自然生态形态、建筑结构、机械构造及不同地域和时代风格", "PBR、SpeedTree、地编流程或建筑史知识属于加分项"],
    portfolioRequirements: ["投递时必须附作品集，官方优先接收 PDF。", "作品集中需标明使用软件、制作日期和制作时间，并尽可能包含近期素描。", "建议完整展示高低模、UV、贴图、模块化拆分、植被和性能优化。"],
    reasons: ["岗位职责与场景建模、模块化资产和地编方向高度重合", "Maya、ZBrush、Substance Painter 与现有技能直接对应", "明确写入地编、SpeedTree、PBR和性能优化加分项"], missing: ["建议补充植被或自然生态专项作品", "需要在作品集中写清面数、贴图规格和模块复用策略"], accent: "#202326",
  },
  {
    id: 16, company: "搜狐畅游", initials: "CY", role: "2027届暑期实习｜游戏美术类", city: "北京", deadline: "招满即止", daysLeft: 99, match: 87, status: "收藏", opportunityType: "实习生",
    tags: ["27届实习", "可转正", "3D场景", "技术美术"], business: "网络游戏研发与运营", scale: "大型老牌游戏公司", project: "天龙八部系列及多款在研项目", source: "畅游校园招聘官网", sourceUrl: "https://campus.changyou.com/", campaign: "实习可转正", verifiedAt: "2026-08-07",
    requirements: ["暑期实习面向2027届毕业生并提供转正机会", "游戏美术大类岗位以官网开放情况为准", "日常实习也向其他年级在校生开放"], reasons: ["岗位体系包含3D场景与技术美术方向", "实习转正路径清晰", "你的数字媒体艺术背景符合美术岗位偏好"], missing: ["需要准备稳定的实习时间说明", "建议增加写实MMO环境资产"], accent: "#1d77b7",
  },
  {
    id: 44, company: "搜狐畅游", initials: "CY", role: "2027届秋招提前批｜3D场景设计师", city: "北京", deadline: "2026-09-14", daysLeft: 36, match: 95, status: "准备中", opportunityType: "正式校招", scaleTier: "大型企业",
    tags: ["27届秋招", "3D场景", "Maya/3ds Max", "PBR/手绘"], business: "网络游戏研发、发行与运营", scale: "大型老牌游戏公司", project: "武侠、国风、科幻、欧美等多风格项目", source: "搜狐畅游官方校园招聘职位页", sourceUrl: "https://app.mokahr.com/campus-recruitment/cyou-inc/42233#/job/9549790e-834d-41f4-9e71-adc1560f5c3e", campaign: "正在招聘", verifiedAt: "2026-08-09", publishedAt: "2026-07-27", availabilityNote: "官方当前在招｜职位发布于 2026-07-27｜网申截止 2026-09-14",
    responsibilities: ["负责游戏场景模型、场景布局、气氛渲染或资源整合设计中的一个主要方向，并随能力成长承担更多3D美术工作。", "与原画和策划沟通需求、确认可行方案，并与协作岗位共同保证最终效果还原。", "根据项目需要适配武侠、国风、科幻、欧美等不同美术风格。"],
    requirements: ["面向2027届，游戏设计、数字媒体、动漫、美术相关专业优先", "具备美术基础和审美能力", "掌握 3ds Max / Maya / ZBrush / Substance Painter / Photoshop，岗位包含手绘与PBR方向", "能够按时保质完成任务，具备责任心、学习能力和团队沟通能力", "热爱游戏且游戏经历丰富者优先"],
    portfolioRequirements: ["投递时必须附能够证明3D场景能力的作品集链接。", "可附 ArtStation、站酷等作品主页；大文件可按官方JD发送至 cyzuopin@vip.163.com。", "作品需标注个人职责、使用软件、制作流程及最终效果。"],
    reasons: ["这是畅游官方当前在招的2027届3D场景具体岗位", "数字媒体艺术专业和软件技能要求与你的方向直接匹配", "同时接受手绘与PBR方向，作品集适配空间较大"], missing: ["建议增加武侠或国风环境资产", "需要明确标注每个项目的个人职责和软件流程"], accent: "#176da6",
  },
  {
    id: 48, company: "搜狐畅游", initials: "CY", role: "2027届秋招｜技术美术（场景）", city: "北京", deadline: "官网未公布统一截止日", daysLeft: 99, match: 92, status: "准备中", opportunityType: "正式校招", scaleTier: "大型企业",
    tags: ["27届秋招", "技术美术", "Unity", "Shader/性能优化"], business: "网络游戏研发、发行与运营", scale: "大型老牌游戏公司", project: "大型次世代游戏及多款在研项目", source: "搜狐畅游2027校园招聘官方职位页", sourceUrl: "https://zhaopin.changyou.com/wt/changyou/web/index/webPosition210!getOnePosition?brandCode=1&columnId=1&importPost=0&positionType=0%2F1227%2F100402&postIdEnc=62b65ba357adf0a4&recruitType=1", campaign: "正在招聘", verifiedAt: "2026-08-20", availabilityNote: "官方2027校园招聘页当前列出并开放申请｜工作地点北京｜官网未显示统一截止日，第三方日期不得作为官方截止时间",
    responsibilities: ["研究游戏美术内容制作与引擎应用工具，制定资源制作规范和工作流程。", "负责资源导入导出、画面与资源性能优化，并为美术环节提供技术解决方案。", "协同引擎工程师研发高级美术效果，编写插件、脚本和Shader以提升制作效率。", "优化不同硬件配置下的游戏表现，降低性能门槛。"],
    requirements: ["具备美术专业能力和审美能力", "熟悉Unity编辑器、灯光氛围营造与烘焙渲染", "深入理解PBR和卡通渲染，熟悉3ds Max、Maya、ZBrush、Photoshop、Substance Painter", "熟悉Shader编辑、脚本语言或编程语言", "具备大型次世代游戏项目开发经验者优先"],
    reasons: ["岗位同时覆盖场景表现、灯光、资源流程和性能优化，与场景地编方向高度相关", "现有PBR、UE5和场景资产经验可迁移到TA作品案例", "官方JD明确需要美术与技术协作能力"], missing: ["需要至少补充一个Shader、工具脚本或性能优化案例", "建议展示高低配置对比、烘焙参数和优化数据", "该岗位偏Unity，需补充Unity灯光与资源管线经验"], accent: "#176da6",
  },
  {
    id: 17, company: "FunPlus", initials: "FP", role: "转正实习｜游戏美术方向", city: "北京/上海/广州", deadline: "关注实时岗位", daysLeft: 99, match: 84, status: "收藏", opportunityType: "实习生",
    tags: ["转正实习", "全球发行", "SLG", "游戏美术"], business: "游戏研发与全球发行", scale: "大型全球化游戏公司", project: "SLG与多品类全球化游戏", source: "FunPlus校园招聘官网", sourceUrl: "https://campus.funplus.com.cn/", campaign: "实习可转正", verifiedAt: "2026-08-07",
    requirements: ["官网公开春招补录与转正实习项目", "具体毕业区间和美术岗位以当期列表为准", "全球化项目重视风格适配和协作能力"], reasons: ["SLG项目需要大量场景与环境资产", "全球化方向有利于扩展作品风格", "转正实习可提前进入校招流程"], missing: ["建议增加移动端场景可读性展示", "需要补充英文软件与项目说明"], accent: "#e05a35",
  },
  {
    id: 18, company: "心动网络", initials: "XD", role: "校园招聘关注｜游戏美术 / 3D方向", city: "上海", deadline: "关注岗位更新", daysLeft: 99, match: 85, status: "收藏", opportunityType: "校招关注",
    tags: ["TapTap", "自研游戏", "美术", "实习关注"], business: "游戏研发发行与TapTap平台", scale: "上市游戏与平台公司", project: "心动小镇、火炬之光等", source: "心动网络招聘入口", sourceUrl: "https://www.xd.com/join", campaign: "入口关注", verifiedAt: "2026-08-07",
    requirements: ["校招和实习岗位以官网实时列表为准", "自研项目覆盖多种美术风格", "作品集应突出个人职责与引擎内效果"], reasons: ["项目风格跨度适合场景美术方向", "上海岗位与你的目标城市匹配", "可同步关注TapTap招聘动态"], missing: ["尚未确认当前27届场景岗位余量", "建议设置每周官网检查提醒"], accent: "#3d8bdb",
  },
  {
    id: 19, company: "游族网络", initials: "YZ", role: "校园招聘关注｜3D场景 / 游戏美术", city: "上海", deadline: "关注岗位更新", daysLeft: 99, match: 82, status: "收藏", opportunityType: "校招关注",
    tags: ["全球化卡牌", "3D场景", "美术", "校招"], business: "游戏研发与全球发行", scale: "上市游戏公司", project: "全球化卡牌与策略游戏", source: "游族网络校园招聘官网", sourceUrl: "https://campus.yoozoo.com/", campaign: "入口关注", verifiedAt: "2026-08-07",
    requirements: ["官网保留独立校园招聘入口", "具体27届岗位需等待实时更新", "全球化项目重视多风格适应能力"], reasons: ["策略与卡牌项目具有稳定环境资产需求", "上海地点符合求职偏好", "适合作为第二梯队重点监控"], missing: ["需要补充卡牌场景与叙事构图", "当前岗位开放状态待确认"], accent: "#92643f",
  },
  {
    id: 20, company: "盛趣游戏", initials: "SQ", role: "2027届实习｜原画 / 3D模型美术", city: "上海", deadline: "招满即止", daysLeft: 99, match: 86, status: "准备中", opportunityType: "实习生", scaleTier: "大型企业",
    tags: ["27届实习", "原画", "3D模型", "实习转正"], business: "网络游戏研发、发行与运营", scale: "大型老牌游戏研发与运营公司（官网未披露人数）", project: "传奇世界、最终幻想14、龙之谷等", source: "盛趣游戏2027校园招聘官方页面", sourceUrl: "https://app.mokahr.com/campus-recruitment/shengqu/96336", campaign: "实习可转正", verifiedAt: "2026-08-22", publishedAt: "2026-08-03", availabilityNote: "官方2027秋招与实习批次已开放｜热招美术实习包含原画、UI、动画、2D特效与3D模型｜上海岗位｜实习表现优秀可获得校招转正机会｜岗位招满即止",
    requirements: ["部分实习岗位面向2027届及2028届海内外高校毕业生", "官方当前明确列出原画与3D模型等美术实习方向", "工作地点为上海，具体出勤天数、实习周期和作品集要求以实时职位页为准", "校招内推活动为2026-08-03至2026-11-30，但这不是所有实习岗位的统一截止日"], reasons: ["官方批次已明确开放3D模型美术实习，不再只是公司级关注", "老牌MMO和多品类项目需要大量角色、场景与环境资产", "实习表现优秀可进入2027届校招转正通道"], missing: ["官方批次公告未说明当前3D模型岗位具体偏角色还是场景，投递前必须查看实时JD", "若职位详情未写场景制作，不应将其当作3D场景岗", "建议准备高低模、UV、PBR材质和引擎展示的完整流程"], accent: "#b03039",
  },
  {
    id: 21, company: "多益网络", initials: "DY", role: "校园招聘关注｜技术美术 / 美术设计", city: "广州/成都", deadline: "等待27届批次", daysLeft: 99, match: 81, status: "收藏", opportunityType: "校招关注",
    tags: ["技术美术", "原画", "特效", "校招"], business: "互联网游戏研发与运营", scale: "大型游戏研发公司", project: "神武、梦想世界等", source: "多益网络校园招聘官网", sourceUrl: "https://xz.duoyi.com/", campaign: "入口关注", verifiedAt: "2026-08-07",
    requirements: ["往届校招持续开放技术美术、原画、特效等岗位", "2027届批次需等待官网确认", "不同岗位可能包含线上笔试或作品测试"], reasons: ["技术美术方向可作为能力扩展", "广州和成都均是游戏岗位集中城市", "官网招聘体系完整"], missing: ["纯3D场景岗位开放情况待确认", "TA方向需补充脚本或Shader基础"], accent: "#e56b2f",
  },
  {
    id: 22, company: "祖龙娱乐", initials: "ZL", role: "校园招聘关注｜3D美术 / 技术美术", city: "北京/苏州", deadline: "关注实时岗位", daysLeft: 99, match: 88, status: "收藏", opportunityType: "校招关注",
    tags: ["UE4/UE5", "次世代", "3D场景", "MMORPG"], business: "精品3D游戏研发与全球发行", scale: "大型上市游戏公司", project: "龙族幻想、以闪亮之名等", source: "祖龙娱乐官方网站校招入口", sourceUrl: "http://campus.zulong.com/", campaign: "入口关注", verifiedAt: "2026-08-07",
    requirements: ["官方设有独立校招站与校园招聘邮箱", "美术岗位需附个人作品", "次世代3D项目重视引擎和资产制作能力"], reasons: ["UE与次世代场景方向高度匹配", "大型3D项目适合你的长期发展方向", "官网保留校招网申入口"], missing: ["需要增加大型写实场景作品", "当前27届岗位需实时确认"], accent: "#8055aa",
  },
  {
    id: 23, company: "友塔游戏", initials: "YT", role: "校园招聘关注｜游戏美术 / TA", city: "上海", deadline: "关注岗位更新", daysLeft: 99, match: 80, status: "收藏", opportunityType: "校招关注",
    tags: ["SLG", "全球发行", "技术美术", "校招"], business: "移动游戏研发与全球发行", scale: "大型出海游戏公司", project: "全球化SLG与模拟经营项目", source: "友塔游戏校园招聘官网", sourceUrl: "https://www.yottagames.com.cn/zh/campus", campaign: "入口关注", verifiedAt: "2026-08-07",
    requirements: ["官网保留校园招聘职位入口", "历史校招包含技术美术与美术工具方向", "具体27届岗位以实时页面为准"], reasons: ["全球化SLG有大量环境与建筑资产", "上海地点适合集中投递", "TA岗位可作为场景美术的延伸"], missing: ["当前页面仍有往届信息，需核对岗位年份", "建议补充批量资产生产思路"], accent: "#173d5d",
  },
  {
    id: 24, company: "沐瞳科技", initials: "MT", role: "校园招聘关注｜美术 / 全球化游戏", city: "上海", deadline: "关注岗位更新", daysLeft: 99, match: 82, status: "收藏", opportunityType: "校招关注",
    tags: ["全球化", "MOBA", "游戏美术", "出海"], business: "全球化游戏研发、发行与电竞", scale: "大型全球化游戏公司", project: "Mobile Legends: Bang Bang", source: "沐瞳科技官网", sourceUrl: "https://cn.moonton.com/", campaign: "入口关注", verifiedAt: "2026-08-07",
    requirements: ["往届春招开放美术类岗位", "具体27届批次和投递入口需关注官网更新", "全球化项目重视跨文化审美与协作"], reasons: ["全球项目可以扩展作品集竞争力", "上海游戏美术岗位集中", "适合作为出海方向重点监控"], missing: ["当前官网未展示明确27届场景岗位", "建议准备英文版作品说明"], accent: "#2a63b7",
  },
  {
    id: 25, company: "朝夕光年", initials: "NVS", role: "招聘入口关注｜游戏美术 / 3D场景", city: "北京/上海/杭州", deadline: "关注岗位更新", daysLeft: 99, match: 81, status: "收藏", opportunityType: "校招关注",
    tags: ["游戏美术", "开放世界", "国风", "招聘官网"], business: "游戏研发与全球发行", scale: "大型游戏业务品牌", project: "多品类自研与发行项目", source: "朝夕光年招聘官网", sourceUrl: "https://www.nvsgames.cn/hire.html", campaign: "入口关注", verifiedAt: "2026-08-07",
    requirements: ["官网提供独立招聘职位入口", "具体校招和实习岗位以实时列表为准", "项目方向覆盖写实、国风与二次元"], reasons: ["美术风格覆盖范围广", "可能开放场景与技术美术相关岗位", "适合作为补录和日常实习监控入口"], missing: ["当前27届校园批次未明确", "投递前需确认具体业务线"], accent: "#111c2b",
  },
  {
    id: 26, company: "IGG", initials: "IGG", role: "招聘关注｜游戏3D美术 / GUI / 场景", city: "福州/上海", deadline: "持续关注", daysLeft: 99, match: 79, status: "收藏", opportunityType: "日常实习",
    tags: ["全球发行", "3D美术", "SLG", "日常机会"], business: "移动游戏研发与全球发行", scale: "上市全球化游戏公司", project: "王国纪元等全球化游戏", source: "IGG中国招聘官网", sourceUrl: "https://cn-jobs.igg.com/", campaign: "持续开放", verifiedAt: "2026-08-07",
    requirements: ["招聘官网持续发布中国区职位", "美术岗位需准备作品集", "校招与实习属性需以职位详情为准"], reasons: ["全球化SLG需要大量场景和建筑资产", "可作为日常实习与社招储备入口", "适合补充海外项目经验"], missing: ["需筛选明确接受应届生的岗位", "建议准备英文作品集页面"], accent: "#cf3238",
  },
  {
    id: 27, company: "乐牛游戏", initials: "LN", role: "校园招聘｜游戏美术类", city: "广州", deadline: "关注岗位更新", daysLeft: 99, match: 78, status: "收藏", opportunityType: "正式校招",
    tags: ["美术类", "MMO", "广州", "校招入口"], business: "移动游戏研发与运营", scale: "中大型游戏公司", project: "MMO与多品类移动游戏", source: "乐牛游戏校园招聘官网", sourceUrl: "https://campus.leniu.com/", campaign: "持续开放", verifiedAt: "2026-08-07",
    requirements: ["校园招聘官网设有美术类职位入口", "具体岗位与毕业年份以实时页面为准", "美术岗位通常要求提交作品"], reasons: ["广州适合与其他公司组合投递", "MMO项目与场景资产方向相关", "可作为扩展投递池的重要补充"], missing: ["当前细分场景岗位需进一步核验", "建议增加批量资产和协作规范说明"], accent: "#ef863d",
  },
  {
    id: 28, company: "点点互动（Century Games）", initials: "CG", role: "2027届 Elite Program+｜当前无美术岗位", city: "北京/上海/广州/深圳", deadline: "未公布统一截止日", daysLeft: 99, match: 35, status: "收藏", opportunityType: "校招关注", scaleTier: "大型企业",
    tags: ["27届校招", "策划/程序", "市场/数据", "无美术岗"], business: "全球化游戏研发、发行与长线运营", scale: "大型全球化游戏公司（公开信息为上千人）", project: "无尽冬日、奔奔王国等全球化项目", source: "点点互动官方 Elite Program+ 实时职位列表", sourceUrl: "https://career.centurygames.cn/4/jobs", campaign: "当前无美术岗", verifiedAt: "2026-08-09", publishedAt: "2026-07-12", availabilityNote: "重要纠正：官方当前12个Elite Program+职位中没有美术类或3D场景岗位",
    requirements: ["截至2026-08-09，官方列表显示12个Elite Program+在招职位", "当前职位仅分布在策划类、程序类、市场类和数据类", "美术类筛选项存在，但当前实际职位数量为0"], reasons: ["当前不建议作为游戏美术方向投递目标", "仅保留为后续是否新增美术岗位的监控项"], missing: ["不要把Elite Program+项目启动误判为美术岗位开放", "后续只有官方列表出现实际美术职位后才重新提高匹配度"], accent: "#9a5a4b",
  },
  {
    id: 29, company: "4399游戏", initials: "4399", role: "2027届秋招｜3D场景设计师", city: "广州", deadline: "官网未公布统一截止日", daysLeft: 99, match: 94, status: "准备中", opportunityType: "正式校招", scaleTier: "大型企业",
    tags: ["27届秋招", "3D场景", "地编", "U3D/UE"], business: "游戏平台、游戏研发、发行与运营", scale: "千人精英研运团队（官方校招简章披露）", project: "冒险大作战、文明与征服、狩猎使命等", source: "4399游戏2027届秋招官方校招信息及同名官方职位页", sourceUrl: "https://web.4399.com/campus", campaign: "正在招聘", verifiedAt: "2026-08-23", publishedAt: "2026-08-04", availabilityNote: "官方2027届秋招已启动｜网申自2026-07-31开放｜美术类明确包含3D场景设计师｜面试8月起陆续开展｜官网未公布统一截止日",
    responsibilities: ["结合游戏品类、题材与美术风格，提出地编规划或优化方案并合理规划地图资源。", "基于场景概念或参考搭建整体游戏场景，构建氛围并统一美术风格。", "与策划、程序和相关美术环节协作，对引擎内地编效果进行把控与调优。", "参与审核外包资源并反馈质量问题；具体校招职责以登录后的2027职位详情为准。"],
    requirements: ["广州4399游戏2027届秋招当前明确开放3D场景设计师", "校招简章公开网申、笔试、面试与Offer流程，但未披露统一网申截止日", "同名官方职位页强调3D场景全流程、场景还原、氛围营造及U3D/UE地编能力", "2027届具体学历、专业、作品集大小与测试要求以校招投递页为准，不沿用社招经验年限"],
    portfolioRequirements: ["投递时应附个人作品压缩包或可访问的个人主页、作品链接。", "建议展示建筑、山石植被、材质、灯光、地编与引擎最终效果。", "用一页拆解地图资源规划、动线、模块复用和性能优化，直接回应官方同名岗位职责。"],
    reasons: ["正式批次已确认，不再只是入口关注", "岗位同时覆盖3D场景搭建、氛围营造与引擎地编，和你的主修方向高度一致", "千人规模、多项目研发环境能提供较完整的美术生产流程"], missing: ["官网未公布统一截止日，岗位可能滚动关闭", "投递前需登录校招系统核对具体学历、测试题和作品集文件限制"], accent: "#ef7925",
  },
  {
    id: 30, company: "乐元素", initials: "HE", role: "校园招聘关注｜游戏美术 / 场景设计", city: "北京/上海", deadline: "关注岗位更新", daysLeft: 99, match: 82, status: "收藏", opportunityType: "校招关注", scaleTier: "中型企业",
    tags: ["休闲游戏", "二次元", "场景设计", "原创IP"], business: "移动游戏研发运营、原创IP与动画内容", scale: "中大型互动娱乐公司", project: "开心消消乐、偶像梦幻祭等", source: "乐元素校园招聘入口", sourceUrl: "https://app.mokahr.com/campus_apply/leyuansu/2357", campaign: "入口关注", verifiedAt: "2026-08-07",
    requirements: ["校园招聘入口持续维护", "美术岗位以当期职位列表和作品集要求为准", "休闲和二次元项目重视色彩、构图与风格统一"], reasons: ["适合风格化场景和色彩能力展示", "中型公司岗位职责通常更综合", "可扩展原创IP项目经验"], missing: ["当前27届岗位尚需实时确认", "建议补充休闲游戏场景与UI协同案例"], accent: "#f2a12d",
  },
  {
    id: 31, company: "蛮啾网络", initials: "MJ", role: "校园招聘｜游戏美术 / 二次元场景", city: "上海", deadline: "关注实时岗位", daysLeft: 99, match: 84, status: "收藏", opportunityType: "正式校招", scaleTier: "中型企业",
    tags: ["碧蓝航线", "二次元", "美术", "校园招聘"], business: "二次元游戏研发与全球发行", scale: "中型精品游戏研发公司", project: "碧蓝航线及在研项目", source: "蛮啾网络官方招聘官网", sourceUrl: "https://career.manjuu.com/", campaign: "持续开放", verifiedAt: "2026-08-07",
    requirements: ["官方招聘官网设有独立校园招聘入口", "美术岗位需以实时列表和作品集要求为准", "二次元项目强调风格还原与精细度"], reasons: ["精品项目便于积累高完成度作品经验", "场景方向可展示风格化和叙事能力", "上海岗位便于集中投递"], missing: ["需补充二次元场景专项作品", "具体27届岗位余量待官网确认"], accent: "#4588b8",
  },
  {
    id: 32, company: "波克城市", initials: "BOKE", role: "校招 / 实习入口｜游戏美术方向", city: "上海", deadline: "持续关注", daysLeft: 99, match: 78, status: "收藏", opportunityType: "日常实习", scaleTier: "中型企业",
    tags: ["校招", "实习", "休闲游戏", "UI设计"], business: "游戏研发运营与游戏化应用", scale: "中大型游戏科技公司", project: "捕鱼达人、爆炒江湖等多品类项目", source: "波克城市官方招聘页", sourceUrl: "https://www.boke.com/join.html", campaign: "持续开放", verifiedAt: "2026-08-07",
    requirements: ["官网同时提供社会招聘、校园招聘和实习生入口", "职位需进入官方招聘系统实时筛选", "美术岗位通常需要作品集"], reasons: ["中厂岗位可补充完整生产流程经验", "上海地点与多家公司可组合投递", "休闲项目适合展示风格化资产"], missing: ["当前27届岗位名称需进一步核验", "建议准备轻量化移动端场景案例"], accent: "#3f6c4f",
  },
  {
    id: 33, company: "诗悦网络", initials: "SY", role: "校园招聘｜游戏美术 / 3D方向", city: "广州", deadline: "关注实时岗位", daysLeft: 99, match: 80, status: "收藏", opportunityType: "正式校招", scaleTier: "中型企业",
    tags: ["校园招聘", "MMO", "3D美术", "广州"], business: "精品游戏研发、运营与发行", scale: "中型游戏研发公司", project: "多款MMO与移动游戏项目", source: "诗悦网络官方校园招聘入口", sourceUrl: "https://campus.shiyue.com/", campaign: "持续开放", verifiedAt: "2026-08-07",
    requirements: ["官方网站明确提供校园招聘入口", "具体美术岗位与毕业年份以实时页面为准", "研发岗位重视项目落地与团队协作"], reasons: ["广州中型厂商适合作为重点补充", "MMO项目具有稳定场景资产需求", "岗位职责可能覆盖更完整的制作流程"], missing: ["当前27届岗位余量未明确", "需要强化MMO写实场景案例"], accent: "#ad3737",
  },
  {
    id: 34, company: "电魂网络", initials: "DH", role: "校园招聘入口关注｜游戏美术", city: "杭州", deadline: "等待页面更新", daysLeft: 99, match: 77, status: "收藏", opportunityType: "校招关注", scaleTier: "中型企业",
    tags: ["校园招聘", "美术作品", "杭州", "上市公司"], business: "网络游戏研发、运营与电竞", scale: "中型上市游戏公司", project: "梦三国系列及多品类游戏", source: "电魂网络官方校园招聘页", sourceUrl: "https://www.dianhun.cn/jobs.aspx?classid=206", campaign: "入口关注", verifiedAt: "2026-08-07",
    requirements: ["官网保留校园招聘和简历投递入口", "策划、美术类岗位明确要求附作品", "页面部分文案仍为旧届次，必须核验最新岗位"], reasons: ["杭州游戏公司投递池的重要补充", "中型公司有机会接触更完整的项目环节", "官方提供直接简历投递渠道"], missing: ["官网校招文案更新较慢", "暂不能确认2027届场景岗位已经开放"], accent: "#b54835",
  },
  {
    id: 35, company: "紫龙游戏", initials: "ZLG", role: "招聘入口关注｜设计类 / 3D场景", city: "北京/上海", deadline: "关注岗位更新", daysLeft: 99, match: 81, status: "收藏", opportunityType: "校招关注", scaleTier: "中型企业",
    tags: ["设计类", "3D游戏", "全球发行", "RPG"], business: "游戏研发与全球发行", scale: "中型全球化游戏公司", project: "梦幻模拟战、天地劫等", source: "紫龙游戏官方网站招聘入口", sourceUrl: "https://zilongame.com/html/contact.html", campaign: "入口关注", verifiedAt: "2026-08-07",
    requirements: ["官方网站招聘入口包含设计类和研发类", "是否接受应届生需查看具体职位详情", "3D项目重视角色场景表现与引擎能力"], reasons: ["次世代与RPG项目适合3D场景方向", "中厂岗位可作为大厂之外的重要选择", "北京和上海均有相关项目机会"], missing: ["尚未确认独立2027校园批次", "投递前需确认岗位是否接受无经验毕业生"], accent: "#5f54a6",
  },
  {
    id: 36, company: "友谊时光", initials: "FT", role: "招聘关注｜游戏美术 / 场景设计", city: "苏州", deadline: "持续关注", daysLeft: 99, match: 76, status: "收藏", opportunityType: "校招关注", scaleTier: "中型企业",
    tags: ["女性向", "古风", "场景设计", "苏州"], business: "女性向游戏研发与全球发行", scale: "中型上市游戏公司", project: "浮生为卿歌、凌云诺等", source: "友谊时光官方网站招聘页", sourceUrl: "https://www.friendtimes.cn/careers/index.html", campaign: "入口关注", verifiedAt: "2026-08-07",
    requirements: ["官网设有人才招聘页面", "具体校招、实习属性以职位详情为准", "古风与女性向项目重视审美和细节表达"], reasons: ["适合补充古风环境和叙事场景作品", "苏州是上海周边可扩展城市", "中厂竞争结构与大厂不同"], missing: ["当前未确认2027届专场", "需要准备更贴近女性向审美的作品"], accent: "#c66d8c",
  },
  {
    id: 37, company: "柠檬微趣", initials: "MF", role: "校园招聘｜游戏美术 / 休闲场景", city: "北京", deadline: "关注实时岗位", daysLeft: 99, match: 79, status: "收藏", opportunityType: "正式校招", scaleTier: "中型企业",
    tags: ["校园招聘", "合成游戏", "休闲美术", "出海"], business: "休闲游戏研发与全球发行", scale: "中型出海游戏公司", project: "Gossip Harbor、Seaside Escape等", source: "柠檬微趣校园招聘入口", sourceUrl: "https://app.mokahr.com/apply/microfunhr/75944", campaign: "持续开放", verifiedAt: "2026-08-07",
    requirements: ["官方招聘系统设有校园招聘入口", "实时岗位可能随业务需求调整", "休闲游戏美术重视色彩、叙事和移动端表现"], reasons: ["全球化休闲游戏提供不同于MMO的作品方向", "中型公司更重视综合执行能力", "适合风格化场景作品"], missing: ["需要补充休闲合成类场景研究", "具体27届岗位需实时核验"], accent: "#f08e4a",
  },
  {
    id: 38, company: "智明星通（ELEX）", initials: "ELEX", role: "日常实习关注｜游戏美术 / 全球化项目", city: "北京", deadline: "持续开放", daysLeft: 99, match: 75, status: "收藏", opportunityType: "日常实习", scaleTier: "中型企业",
    tags: ["日常实习", "SLG", "全球发行", "作品集"], business: "游戏研发、发行与海外运营", scale: "中大型全球化游戏公司", project: "列王的纷争等全球化策略游戏", source: "智明星通官方校园招聘网站", sourceUrl: "https://elex.com/campus.php", campaign: "持续开放", verifiedAt: "2026-08-07",
    requirements: ["官网说明2026年8月后毕业学生可投递日常实习", "当前校招专题主要仍为2026届", "美术方向以实时职位列表为准"], reasons: ["2027届可优先关注日常实习", "全球化SLG具有环境资产需求", "可积累英文项目协作经验"], missing: ["正式2027校招批次尚未确认", "需筛选明确开放的美术实习岗位"], accent: "#294f86",
  },
  {
    id: 39, company: "途游游戏", initials: "TY", role: "校园招聘关注｜3D美术 / 灯光场景", city: "北京", deadline: "等待27届批次", daysLeft: 99, match: 78, status: "收藏", opportunityType: "校招关注", scaleTier: "中型企业",
    tags: ["3D美术", "灯光", "场景", "校园招聘"], business: "游戏研发、发行与平台运营", scale: "中大型游戏公司", project: "棋牌游戏、休闲与多品类项目", source: "途游游戏官方校园招聘页", sourceUrl: "https://www.tuyoo.com/job/campus?site=campus", campaign: "入口关注", verifiedAt: "2026-08-07",
    requirements: ["官方设有独立校园招聘页面", "历史校招包含3D动作、场景资产与灯光氛围方向", "2027届正式批次需等待更新"], reasons: ["场景灯光与你的UE5能力相关", "北京中厂岗位的重要补充", "可展示从资产到氛围的完整能力"], missing: ["当前公开项目仍以2026届为主", "需要补充灯光分层和PBR说明"], accent: "#2d83bd",
  },
  {
    id: 40, company: "帕斯亚科技", initials: "PAT", role: "招聘 / 实习关注｜3D场景与独立游戏", city: "重庆", deadline: "持续关注", daysLeft: 99, match: 85, status: "收藏", opportunityType: "日常实习", scaleTier: "中型企业",
    tags: ["主机游戏", "3D场景", "独立游戏", "重庆"], business: "PC、主机与跨平台原创游戏研发", scale: "中型原创游戏团队（官网披露超过260人）", project: "波西亚时光、沙石镇时光等", source: "帕斯亚科技官方网站", sourceUrl: "https://patheagames.com/", campaign: "持续开放", verifiedAt: "2026-08-07",
    requirements: ["官网设有加入我们入口", "具体应届和实习岗位以实时招聘页为准", "跨平台项目重视完整3D场景生产能力"], reasons: ["你的场景建模和地编方向高度匹配", "项目覆盖PC与主机平台", "中型原创团队更适合展示综合能力"], missing: ["需要准备更完整的开放区域场景", "需确认岗位是否接受2027届"], accent: "#b45b34",
  },
  {
    id: 41, company: "凉屋游戏", initials: "CR", role: "日常招聘 / 实习｜游戏美术方向", city: "深圳", deadline: "持续开放", daysLeft: 99, match: 72, status: "收藏", opportunityType: "日常实习", scaleTier: "小型/独立团队",
    tags: ["独立团队", "原创玩法", "美术作品集", "实习"], business: "原创独立游戏研发与运营", scale: "小型独立游戏团队", project: "元气骑士、战魂铭人等", source: "凉屋游戏官方加入我们页面", sourceUrl: "https://www.chillyroom.com/zh/about-us", campaign: "持续开放", verifiedAt: "2026-08-07",
    requirements: ["官网持续展示招聘职位和实习岗位", "美术岗位无作品集不予考虑", "独立团队重视综合能力和玩法理解"], reasons: ["可以接触更完整的游戏制作流程", "原创项目有利于培养跨职能协作", "适合作为小型团队投递样本"], missing: ["当前美术细分岗位需在官网核验", "你的作品偏3D，需要证明能适配项目风格"], accent: "#3d915c",
  },
  {
    id: 42, company: "椰岛游戏", initials: "CI", role: "招聘入口关注｜游戏美术 / 独立游戏", city: "上海", deadline: "邮件长期接收", daysLeft: 99, match: 74, status: "收藏", opportunityType: "校招关注", scaleTier: "小型/独立团队",
    tags: ["独立游戏", "原创内容", "PC/主机", "邮件投递"], business: "原创游戏研发、发行与独立游戏孵化", scale: "小型独立游戏厂牌", project: "多款PC、主机与移动原创游戏", source: "椰岛游戏官方网站加入我们信息", sourceUrl: "https://www.coconut.is/article/about", campaign: "入口关注", verifiedAt: "2026-08-07",
    requirements: ["官网公开加入团队邮箱 jobs@coconut.is", "具体校招和实习岗位未单独列出", "独立游戏团队通常要求作品与项目高度匹配"], reasons: ["适合寻找更具创作空间的小团队机会", "上海地点便于集中投递", "PC与主机项目可扩展作品集方向"], missing: ["没有明确2027届专场", "建议先准备定向求职邮件和小型作品集"], accent: "#ef5a4f",
  },
  {
    id: 43, company: "Curaxuan独立工作室", initials: "CX", role: "游戏像素美术实习生", city: "远程/项目制", deadline: "招满即止", daysLeft: 99, match: 62, status: "收藏", opportunityType: "实习生", scaleTier: "小型/独立团队",
    tags: ["像素美术", "Unity", "独立游戏", "实习"], business: "叙事驱动独立游戏研发", scale: "小型独立游戏工作室", project: "Go Groundshel! 叙事解谜项目", source: "Curaxuan官方招聘页面", sourceUrl: "https://curaxuan.com/join-us/", campaign: "正在招聘", verifiedAt: "2026-08-07",
    requirements: ["官方正在招聘游戏像素美术实习生", "需要使用Aseprite或Photoshop制作像素资产", "需与策划和程序协作并在Unity中落地"], reasons: ["这是明确开放的小型团队美术实习", "可体验完整的独立游戏制作流程", "适合拓展风格与跨团队协作能力"], missing: ["与你的3D场景主方向并非完全一致", "需要额外准备像素美术样例后再投递"], accent: "#7a5db4",
  },
];

const navItems: { key: View; label: string; icon: string }[] = [
  { key: "overview", label: "今日总览", icon: "⌂" },
  { key: "jobs", label: "校招职位库", icon: "◎" },
  { key: "resume", label: "简历诊断", icon: "✦" },
  { key: "pipeline", label: "投递看板", icon: "▦" },
];

const statusOrder: JobStatus[] = ["收藏", "准备中", "已投递", "笔试/测试", "面试"];

function Donut({ value }: { value: number }) {
  return <span className="donut" style={{ "--score": `${value * 3.6}deg` } as React.CSSProperties}><b>{value}</b><small>%</small></span>;
}

const campaignTone: Record<CampaignStatus, string> = {
  "正在招聘": "live",
  "实习可转正": "intern",
  "持续开放": "open",
  "入口关注": "watch",
  "当前无美术岗": "mismatch",
  "已结束参考": "closed",
};

const getOpportunityType = (job: Job): OpportunityType => job.opportunityType ?? (
  job.role.includes("实习") || job.role.includes("训练营") ? "实习生" : job.campaign === "入口关注" ? "校招关注" : "正式校招"
);

const getScaleTier = (job: Job): ScaleTier => job.scaleTier ?? (
  job.scale.includes("小型") || job.scale.includes("独立") ? "小型/独立团队" : job.scale.includes("中型") ? "中型企业" : "大型企业"
);

type DeadlineProfile = {
  batch: string;
  opened: string;
  closes: string;
  rule: string;
  urgency: "open" | "rolling" | "watch" | "closed";
};

type StructuredJd = {
  level: DetailLevel;
  responsibilities: string[];
  qualifications: string[];
  portfolio: string[];
  process: string[];
  note: string;
};

type CountdownInfo = {
  label: string;
  dateLabel: string;
  tone: "active" | "soon" | "urgent" | "rolling" | "watch" | "closed";
  days: number | null;
};

const deadlineOverrides: Record<number, Partial<DeadlineProfile>> = {
  1: { batch: "2027届秋季校园招聘", opened: "2026年7月已公开启动", closes: "官网未公布统一截止日", rule: "各工作室独立滚动筛选，岗位可能提前关闭；建议发现具体岗位后立即投递。", urgency: "rolling" },
  2: { batch: "2027届游戏美术实习招聘", opened: "2026年春季已启动", closes: "招满即止，无统一日期", rule: "面向毕业时间为2026年9月至2027年12月31日的学生；具体工作室岗位随招随关。", urgency: "rolling" },
  3: { batch: "2027届实习生项目", opened: "2026年春季已启动", closes: "招满即止", rule: "官网未披露所有美术岗位的统一截止日；每人最多投递两个职位。", urgency: "rolling" },
  4: { batch: "叠纸游戏2027届秋季校园招聘", opened: "2026-08-05", closes: "2026-10-31", rule: "正式秋招面向2026年9月至2027年8月毕业生，每人最多同时投递2个岗位；原NOVA训练营已结束。", urgency: "open" },
  5: { batch: "校园招聘常规批次", opened: "官网岗位页持续开放", closes: "以具体职位页为准", rule: "当前入口同时保留多类岗位；投递前必须确认职位仍标注为校园招聘。", urgency: "open" },
  6: { batch: "米哈游2027届秋季校园招聘", opened: "2026年8月起", closes: "2026-10-31", rule: "官网显示应届生职位仅能投递1个；场景模型、关卡美术和技术美术需要择一投递。", urgency: "open" },
  10: { batch: "三七互娱2027届秋季校园招聘", opened: "2026-08-14", closes: "招满即止", rule: "每位同学可投递2个志愿；当前公开场景相关岗位为场景原画与2D场景编辑，岗位可能在招满后提前关闭。", urgency: "rolling" },
  11: { batch: "2027届校园招聘监控", opened: "正式批次尚未确认", closes: "尚未公布", rule: "目前仅作为公司级监控项，不能视为已开放的具体3D场景岗位。", urgency: "watch" },
  13: { batch: "阿里巴巴2027届应届生｜灵犀互娱", opened: "职位于2026-08-06更新", closes: "官网未公布统一截止日", rule: "官方当前显示在招；毕业时间要求为2026-11-01至2027-10-31，岗位可能滚动关闭，建议尽早投递。", urgency: "rolling" },
  15: { batch: "鹰角网络2027届秋季校园招聘", opened: "2026-08-07", closes: "2026-10-31", rule: "2027届应届生在网申期内最多投递2次；场景模型岗位当前可申请。", urgency: "open" },
  16: { batch: "2027届暑期实习", opened: "2026年春季已启动", closes: "招满即止", rule: "实习提供转正机会；美术细分职位和关闭时间以官网实时列表为准。", urgency: "rolling" },
  20: { batch: "盛趣游戏2027届实习招聘", opened: "2026-08-03", closes: "招满即止", rule: "官方批次列出原画与3D模型等美术实习；内推活动持续至11月30日，但该日期不是所有实习岗位的统一截止日。", urgency: "rolling" },
  28: { batch: "2027 Elite Program+", opened: "12个职位于2026-07-12发布", closes: "未公布统一截止日", rule: "当前12个实际职位仅覆盖策划、程序、市场和数据，未开放美术类；仅保留监控，不建议投递。", urgency: "watch" },
  29: { batch: "4399游戏2027届秋季校园招聘", opened: "2026-07-31", closes: "官网未公布统一截止日", rule: "官方校招简章确认3D场景设计师正在本批次招聘；8月起陆续面试，岗位可能滚动关闭，建议尽早投递。", urgency: "rolling" },
  44: { batch: "2027届秋招提前批", opened: "职位发布：2026-07-27；网申开放：2026-08-06", closes: "2026-09-14", rule: "官方流程页明确网申期为8月6日至9月14日；2027届秋招最多投递两个职位，建议优先投递3D场景。", urgency: "open" },
  45: { batch: "米哈游2027届秋季校园招聘", opened: "2026年8月起", closes: "2026-10-31", rule: "官网显示应届生职位仅能投递1个；关卡美术与场景模型、技术美术不能同时投递。", urgency: "open" },
  46: { batch: "米哈游2027届秋季校园招聘", opened: "2026年8月起", closes: "2026-10-31", rule: "官网显示应届生职位仅能投递1个；技术美术方向覆盖渲染、工具、性能优化和PCG等分支。", urgency: "open" },
  49: { batch: "乐狗游戏2027届秋季校园招聘", opened: "2026-08-17", closes: "2026-09-11", rule: "校招专场职位页显示9月11日截止；场景原画岗位要求上传作品集，并在简历中备注个人游戏经历。", urgency: "open" },
};

function getDetailLevel(job: Job): DetailLevel {
  if (job.campaign === "当前无美术岗") return "招聘批次";
  if (job.campaign === "入口关注" || job.role.includes("关注") || job.role.includes("机会")) return "公司级监控";
  if (job.role.includes("方向") || job.role.includes("类") || job.role.includes("训练营")) return "招聘批次";
  return "具体岗位";
}

function getDeadlineProfile(job: Job): DeadlineProfile {
  const base: DeadlineProfile = {
    batch: `${getOpportunityType(job)}招聘`,
    opened: job.campaign === "已结束参考" ? "历史批次" : "以官网职位发布时间为准",
    closes: job.deadline,
    rule: job.deadline.includes("招满") || job.deadline.includes("滚动") ? "没有统一截止日期，岗位会在招满后提前关闭。" : "官网未披露统一日期时，以具体职位页显示为准。",
    urgency: job.campaign === "已结束参考" ? "closed" : job.campaign === "入口关注" || job.campaign === "当前无美术岗" ? "watch" : job.deadline.includes("招满") || job.deadline.includes("滚动") ? "rolling" : "open",
  };
  return { ...base, ...deadlineOverrides[job.id] };
}

function getCountdownInfo(profile: DeadlineProfile, todayKey: string): CountdownInfo {
  const dateMatch = profile.closes.match(/(20\d{2})-(\d{2})-(\d{2})/);
  if (dateMatch) {
    const target = Date.UTC(Number(dateMatch[1]), Number(dateMatch[2]) - 1, Number(dateMatch[3]));
    const [todayYear, todayMonth, todayDay] = todayKey.split("-").map(Number);
    const today = Date.UTC(todayYear, todayMonth - 1, todayDay);
    const days = Math.ceil((target - today) / 86400000);
    if (days < 0) return { label: "已截止", dateLabel: dateMatch[0], tone: "closed", days };
    if (days === 0) return { label: "今天截止", dateLabel: dateMatch[0], tone: "urgent", days };
    if (days <= 3) return { label: `仅剩 ${days} 天`, dateLabel: dateMatch[0], tone: "urgent", days };
    if (days <= 14) return { label: `剩余 ${days} 天`, dateLabel: dateMatch[0], tone: "soon", days };
    return { label: `剩余 ${days} 天`, dateLabel: dateMatch[0], tone: "active", days };
  }
  if (profile.urgency === "closed") return { label: "已截止", dateLabel: profile.closes, tone: "closed", days: null };
  if (profile.urgency === "rolling") return { label: "滚动招聘", dateLabel: profile.closes, tone: "rolling", days: null };
  if (profile.urgency === "watch") return { label: "时间待公布", dateLabel: profile.closes, tone: "watch", days: null };
  return { label: "持续开放", dateLabel: profile.closes, tone: "active", days: null };
}

function formatTodayLabel(todayKey: string) {
  const [year, month, day] = todayKey.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  const weekdays = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  return `${weekdays[date.getUTCDay()]} · ${months[month - 1]} ${String(day).padStart(2, "0")}`;
}

function getPipelineDeadlineLabel(job: Job, todayKey: string) {
  return getCountdownInfo(getDeadlineProfile(job), todayKey).label;
}

function getStructuredJd(job: Job): StructuredJd {
  const text = `${job.role}${job.tags.join("")}`.toLowerCase();
  const level = getDetailLevel(job);
  if (job.campaign === "当前无美术岗") {
    return {
      level,
      responsibilities: ["当前Elite Program+共12个职位：系统/数值策划、客户端/AI/数据工程、广告创意与投放。", "当前官方列表没有美术类、3D场景、场景原画或技术美术职位。"],
      qualifications: job.requirements,
      portfolio: ["当前没有可对应的美术岗位，因此不建议为该批次制作定向美术作品集。", "后续只有官方职位列表出现实际美术职位后，再根据具体JD准备作品。"],
      process: ["暂不投递美术方向", "持续监控官方Elite Program+职位列表", "出现实际美术职位后重新核验JD与截止时间"],
      note: "已纠正：Elite Program+项目正在招聘，不等于美术岗位正在招聘。当前官方12个职位中美术类为0。",
    };
  }
  let responsibilities: string[];
  let qualifications: string[];
  let portfolio: string[];

  if (text.includes("像素")) {
    responsibilities = ["根据策划需求制作角色、场景、道具等像素美术资源。", "与策划、程序协作，将资源导入 Unity 并跟进游戏内最终效果。", "按照项目规范完成切图、动画帧和资源迭代。"];
    qualifications = ["能够使用 Aseprite 或 Photoshop 完成像素资产。", "理解像素比例、色板控制、轮廓可读性与基础动画规律。", "能够接受远程或项目制协作并按节点交付。"];
    portfolio = ["提交像素角色、场景和至少一组动画帧。", "标注使用工具、个人职责和资源在 Unity 中的最终效果。"];
  } else if (text.includes("技术美术") || text.includes("ta") || text.includes("shader") || text.includes("蓝图")) {
    responsibilities = ["连接美术与程序团队，定位并解决资产、材质、渲染和性能问题。", "参与 Shader、材质模板、自动化工具或美术生产管线的制作与维护。", "制定资源规范，分析 Draw Call、显存、帧率等指标并推动优化落地。"];
    qualifications = ["熟悉 UE / Unity 至少一种引擎及其材质、渲染和资源管理流程。", "具备 Shader、蓝图、Python 或其他脚本能力中的至少一项。", "能清楚解释美术效果与性能成本之间的取舍。"];
    portfolio = ["至少展示一个可运行的材质、Shader、工具或优化案例。", "必须提供问题、实现思路、性能前后对比和你负责的代码/节点部分。"];
  } else if (text.includes("地编") || text.includes("关卡") || text.includes("开放世界")) {
    responsibilities = ["依据世界观、关卡灰盒和玩法需求完成地形、道路、建筑、植被与环境资产布置。", "与关卡策划协作调整动线、视线引导、探索节奏和战斗空间。", "在引擎中完成灯光、氛围、LOD、流送与性能检查，保证画面和玩法落地。"];
    qualifications = ["熟悉 UE5 地形、植被、PCG / Foliage、灯光和关卡组织方式。", "具备空间构图、自然规律、模块化搭建和环境叙事能力。", "了解开放世界分区、资源复用及基础性能预算。"];
    portfolio = ["提供灰盒到最终画面的完整过程，而不只展示最终截图。", "补充俯视动线图、资产复用图、植被规则、性能数据及个人职责。"];
  } else if (text.includes("3d") || text.includes("场景") || text.includes("建模") || text.includes("次世代")) {
    responsibilities = ["根据概念图和项目风格完成建筑、道具、地形等3D场景资产。", "负责高低模、拓扑、UV、烘焙、PBR材质及引擎内效果还原。", "遵循命名、面数、贴图和LOD规范，并与原画、关卡、TA协作完成优化。"];
    qualifications = ["熟悉 Maya / Blender、ZBrush、Substance Painter 等主流工具。", "理解造型、比例、色彩、PBR材质、灯光和模块化资产流程。", "能够在 UE / Unity 中完成资源导入、材质设置和基础性能检查。"];
    portfolio = ["建议包含写实或风格化完整场景，以及不少于一组资产拆解。", "每个项目标注面数、贴图规格、制作周期、软件流程和个人贡献。", "必须提供线框、UV、材质通道、引擎截图；团队项目需区分个人职责。"];
  } else {
    responsibilities = ["参与游戏角色、场景、道具、UI或特效等美术资源的设计与制作。", "根据项目风格和技术规范持续迭代，并跟进资源在游戏中的最终表现。", "与策划、程序及其他美术岗位协作完成版本目标。"];
    qualifications = ["具备造型、构图、色彩和审美基础，能够匹配项目风格。", "至少熟练掌握一个目标美术方向的核心软件和完整制作流程。", "具备学习能力、沟通能力和对游戏产品的理解。"];
    portfolio = ["作品集需聚焦申请方向，避免混入大量无关作业。", "标注个人职责、制作过程和最终落地效果。"];
  }

  return {
    level,
    responsibilities: job.responsibilities ?? responsibilities,
    qualifications: [...job.requirements, ...qualifications].slice(0, 6),
    portfolio: job.portfolioRequirements ?? portfolio,
    process: ["官网网申 / 简历与作品集筛选", "美术测试或专业面试（是否设置以职位通知为准）", "业务面试 / HR沟通", "录用或实习转正评估"],
    note: level === "公司级监控" ? "当前公开信息尚未形成可直接投递的具体岗位JD；以下为对应方向的准备标准，不代表该公司已经开放该职位。" : "以下内容由公开招聘要求按职责、能力和作品集结构归纳；最终以官网具体职位页和邮件通知为准。",
  };
}

type ResumeAdvice = {
  title: string;
  detail: string;
  action: string;
};

type ResumeReport = {
  overall: number;
  skillScore: number;
  projectScore: number;
  expressionScore: number;
  hitKeywords: string[];
  missingKeywords: string[];
  strengths: string[];
  gaps: string[];
  advice: ResumeAdvice[];
  rewrittenProject: string;
};

const clampScore = (value: number) => Math.max(45, Math.min(96, Math.round(value)));

function analyzeResume(job: Job, text: string): ResumeReport {
  const normalized = text.toLowerCase();
  const skillTerms = ["maya", "zbrush", "substance", "ue5", "unreal", "pbr", "建模", "材质", "灯光", "地编", "场景", "uv", "模块化", "优化", "shader", "蓝图"];
  const projectTerms = ["独立", "负责", "完成", "项目", "场景", "资产", "搭建", "制作", "协作", "落地"];
  const hitKeywords = job.tags.filter((tag) => normalized.includes(tag.toLowerCase()));
  const missingKeywords = job.tags.filter((tag) => !normalized.includes(tag.toLowerCase())).slice(0, 5);
  const skillHits = skillTerms.filter((term) => normalized.includes(term)).length;
  const projectHits = projectTerms.filter((term) => normalized.includes(term)).length;
  const hasNumber = /\d/.test(text);
  const hasResult = /(提升|降低|优化|控制|完成|实现|减少|复用|帧率|面数|贴图)/.test(text);
  const hasStructure = /[：:；;。\n]/.test(text);
  const skillScore = clampScore(54 + skillHits * 4 + hitKeywords.length * 3);
  const projectScore = clampScore(56 + projectHits * 4 + (normalized.includes("ue5") ? 4 : 0) + (normalized.includes("场景") ? 4 : 0));
  const expressionScore = clampScore(52 + Math.min(text.length / 9, 14) + (hasNumber ? 10 : 0) + (hasResult ? 10 : 0) + (hasStructure ? 5 : 0));
  const overall = clampScore((skillScore + projectScore + expressionScore) / 3);
  const keywordText = missingKeywords.length ? missingKeywords.join("、") : "岗位标签已基本覆盖";
  const requirementText = job.requirements.slice(0, 2).join("；");

  return {
    overall,
    skillScore,
    projectScore,
    expressionScore,
    hitKeywords,
    missingKeywords,
    strengths: [
      skillHits >= 4 ? `已识别 ${skillHits} 项场景美术相关技能，基础工具链较完整。` : "已识别到场景制作基础，但核心工具链还需要写得更完整。",
      projectHits >= 4 ? "文本包含职责和制作过程，具备项目经历的基本骨架。" : "已有项目方向，但个人职责和制作过程还不够明确。",
    ],
    gaps: [
      hasNumber ? "已有数字信息，建议继续补充性能或资产规格。" : "缺少资产数量、面数、贴图规格、帧率等可核验数字。",
      hasResult ? job.missing[0] : "缺少项目结果与优化成效，无法判断作品是否真正落地。",
    ],
    advice: [
      {
        title: "把求职定位写进简历首屏",
        detail: `${job.company} 的目标岗位是“${job.role}”，你的简历开头应直接出现场景美术、3D场景或地编定位。`,
        action: `建议标题：2027届数字媒体艺术｜游戏场景美术 / 地编｜目标：${job.company}`,
      },
      {
        title: "补齐岗位关键词",
        detail: `当前尚未在简历中识别到：${keywordText}。关键词必须来自你的真实经历，不能为了匹配而硬写。`,
        action: `对照岗位要求核实后补充：${requirementText}`,
      },
      {
        title: "按“动作—方法—结果”重写项目",
        detail: "目前的描述偏技能罗列，招聘方还看不到你解决了什么问题，以及资产最终如何进入引擎。",
        action: "每个项目至少写清个人职责、制作流程、引擎落地和一个真实结果；暂时没有数据的位置保留占位符。",
      },
      {
        title: "针对项目风格调整作品集顺序",
        detail: `${job.project} 更关注与岗位直接相关的视觉风格和生产流程。`,
        action: `将最符合“${job.tags.slice(0, 3).join(" / ")}”的完整场景放在第一位，并附线框、材质拆解、引擎截图和个人职责。`,
      },
    ],
    rewrittenProject: `独立完成［项目名称］的场景资产制作与引擎搭建，负责［你的真实职责］，使用［真实使用的软件与流程］完成模型、UV、材质和灯光；通过［真实优化方法］将［面数 / 贴图 / 帧率等真实数据］优化至［结果］，最终用于［课程 / 比赛 / 团队项目 / 个人作品］。`,
  };
}

function buildResumeDraft(job: Job, text: string, report: ResumeReport) {
  const skills = Array.from(new Set(["Maya", "ZBrush", "Substance Painter", "UE5", "PBR", ...report.hitKeywords])).join(" / ");
  const missing = report.missingKeywords.length ? report.missingKeywords.join("、") : "暂无明显缺口";

  return `【目标岗位】
${job.company}｜${job.role}｜${job.city}

【求职定位｜请按真实情况修改】
2027届数字媒体艺术专业学生，求职方向为游戏场景美术 / 3D场景 / 地编。具备场景资产制作与引擎落地经验，希望参与${job.project}。

【核心技能｜删除未真实掌握的内容】
${skills}

【项目经历改写模板】
项目名称：［填写真实项目名］
项目类型：［个人 / 课程 / 比赛 / 团队项目］
个人职责：［明确你独立负责的模块］

• ${report.rewrittenProject}
• 资产制作：完成［资产数量］个模型，单体面数约［真实数值］，贴图规格为［真实规格］。
• 引擎落地：在 UE5 中完成［地编 / 灯光 / 植被 / 材质实例 / 蓝图］，并说明你真实使用的功能。
• 优化结果：通过［LOD / 合批 / 纹理压缩 / 遮挡剔除等真实方法］，将［真实指标］从［优化前］改善至［优化后］。

【针对 ${job.company} 的作品集调整】
1. 第一页放置最符合“${job.tags.slice(0, 3).join(" / ")}”的完整场景。
2. 每个项目补充参考图、灰盒、线框、材质拆解、引擎最终效果与个人职责。
3. 重点回应：${job.requirements.slice(0, 2).join("；")}。
4. 当前待核实关键词：${missing}。

【原始简历内容｜保留用于核对】
${text.trim() || "［尚未填写］"}

【投递前核对】
□ 所有软件、职责和数据均可由作品或过程文件证明
□ 删除不适用于本岗位的泛化描述
□ 作品集链接可访问，并明确标注个人贡献
□ 投递前再次核对官网岗位状态与作品集要求`;
}

const MAX_RESUME_FILE_SIZE = 12 * 1024 * 1024;

async function extractResumeFileText(file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase();
  const arrayBuffer = await file.arrayBuffer();

  if (extension === "docx") {
    const mammoth = await import("mammoth");
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value.replace(/\n{3,}/g, "\n\n").trim();
  }

  if (extension === "pdf") {
    const pdfjs = await import("pdfjs-dist");
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
    pdfjs.GlobalWorkerOptions.workerSrc = `${window.location.origin}${basePath}/pdf.worker.min.mjs`;
    const pdf = await pdfjs.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
    const pages: string[] = [];
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber);
      const content = await page.getTextContent();
      const pageText = content.items.map((item) => "str" in item ? item.str : "").join(" ").replace(/\s+/g, " ").trim();
      if (pageText) pages.push(pageText);
    }
    return pages.join("\n\n").trim();
  }

  if (extension === "txt") return (await file.text()).trim();
  throw new Error(extension === "doc" ? "暂不支持旧版 .doc 文件，请先在 Word 中另存为 .docx。" : "仅支持 DOCX、PDF 或 TXT 文件。" );
}

function JobCard({ job, onOpen, saved, onSave, todayKey }: { job: Job; onOpen: () => void; saved: boolean; onSave: () => void; todayKey: string }) {
  const deadline = getDeadlineProfile(job);
  const countdown = getCountdownInfo(deadline, todayKey);
  const detailLevel = getDetailLevel(job);
  return (
    <article className="job-card" onClick={onOpen} tabIndex={0} onKeyDown={(e) => e.key === "Enter" && onOpen()}>
      <div className="company-mark" style={{ background: job.accent }}>{job.initials}</div>
      <div className="job-main">
        <div className="job-title-row"><div><span className="company-name">{job.company}</span><h3>{job.role}</h3></div><button className={saved ? "save-button saved" : "save-button"} onClick={(e) => { e.stopPropagation(); onSave(); }} aria-label={saved ? "取消收藏" : "收藏职位"}>{saved ? "★" : "☆"}</button></div>
        <div className={`deadline-spotlight countdown-${countdown.tone}`}><span><small>申请截止</small><b>{countdown.dateLabel}</b></span><strong>{countdown.label}</strong></div>
        <p className="job-meta"><span className="opportunity-label">{getOpportunityType(job)}</span><span className={`detail-level level-${detailLevel}`}>{detailLevel}</span><span className={`scale-label scale-${getScaleTier(job)}`}>规模：{job.scale}</span><span>⌖ {job.city}</span><span className={`deadline-label deadline-${deadline.urgency}`}>截止：{deadline.closes}</span><span className={`campaign-badge ${campaignTone[job.campaign]}`}>{job.campaign}</span><span>核验 {job.verifiedAt.slice(5)}</span><a className="apply-link" href={job.sourceUrl} target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()}>网申入口 ↗</a></p>
        {job.availabilityNote && <p className={`availability-note ${job.campaign === "当前无美术岗" ? "correction" : "verified"}`}>{job.campaign === "当前无美术岗" ? "!" : "✓"} {job.availabilityNote}</p>}
        <div className="tag-row">{job.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
      </div>
      <div className="match-cell"><Donut value={job.match} /><span>岗位匹配</span></div>
    </article>
  );
}

export default function Home() {
  const [view, setView] = useState<View>("overview");
  const [jobs, setJobs] = useState<Job[]>(demoJobs);
  const [savedIds, setSavedIds] = useState<number[]>([1, 2, 5]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("全部城市");
  const [campaignFilter, setCampaignFilter] = useState("全部状态");
  const [typeFilter, setTypeFilter] = useState("全部类型");
  const [scaleFilter, setScaleFilter] = useState("全部规模");
  const [selectedResumeJob, setSelectedResumeJob] = useState(1);
  const [resumeText, setResumeText] = useState("熟悉 Maya、ZBrush、Substance Painter 与 UE5，独立完成过写实废墟和风格化森林场景。负责模型、UV、材质、灯光及最终画面呈现。熟悉模块化资产制作和基础 PBR 工作流。");
  const [analyzed, setAnalyzed] = useState(false);
  const [draftOpen, setDraftOpen] = useState(false);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");
  const [resumeFile, setResumeFile] = useState<{ name: string; size: number } | null>(null);
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [uploadMessage, setUploadMessage] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [todayKey, setTodayKey] = useState("2026-08-09");
  const [noticeOpen, setNoticeOpen] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("career-radar-state-v2");
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as { savedIds?: number[]; statuses?: Record<number, JobStatus> };
      if (parsed.savedIds) setSavedIds(parsed.savedIds);
      if (parsed.statuses) setJobs((current) => current.map((job) => ({ ...job, status: parsed.statuses?.[job.id] ?? job.status })));
    } catch { /* keep demo defaults */ }
  }, []);

  useEffect(() => {
    const now = new Date();
    const pad = (value: number) => String(value).padStart(2, "0");
    setTodayKey(`${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`);
  }, []);

  useEffect(() => {
    const statuses = Object.fromEntries(jobs.map((job) => [job.id, job.status]));
    window.localStorage.setItem("career-radar-state-v2", JSON.stringify({ savedIds, statuses }));
  }, [savedIds, jobs]);

  const filteredJobs = useMemo(() => jobs.filter((job) => {
    const query = search.trim().toLowerCase();
    const searchHit = !query || `${job.company}${job.role}${job.tags.join("")}${job.scale}${getScaleTier(job)}`.toLowerCase().includes(query);
    return searchHit
      && (city === "全部城市" || job.city.includes(city))
      && (campaignFilter === "全部状态" || job.campaign === campaignFilter)
      && (typeFilter === "全部类型" || getOpportunityType(job) === typeFilter)
      && (scaleFilter === "全部规模" || getScaleTier(job) === scaleFilter);
  }).sort((a, b) => b.match - a.match), [jobs, search, city, campaignFilter, typeFilter, scaleFilter]);

  const deadlineAlerts = useMemo(() => filteredJobs.map((job) => ({ job, countdown: getCountdownInfo(getDeadlineProfile(job), todayKey) }))
    .filter((item) => item.countdown.days !== null && item.countdown.days >= 0)
    .sort((a, b) => (a.countdown.days ?? 9999) - (b.countdown.days ?? 9999))
    .slice(0, 3), [filteredJobs, todayKey]);
  const rollingJobCount = useMemo(() => filteredJobs.filter((job) => getCountdownInfo(getDeadlineProfile(job), todayKey).tone === "rolling").length, [filteredJobs, todayKey]);

  const activeResumeJob = jobs.find((job) => job.id === selectedResumeJob) ?? jobs[0];
  const resumeReport = useMemo(() => analyzeResume(activeResumeJob, resumeText), [activeResumeJob, resumeText]);
  const resumeDraft = useMemo(() => buildResumeDraft(activeResumeJob, resumeText, resumeReport), [activeResumeJob, resumeText, resumeReport]);
  const changeStatus = (jobId: number, status: JobStatus) => setJobs((current) => current.map((job) => job.id === jobId ? { ...job, status } : job));
  const toggleSaved = (id: number) => setSavedIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const resetResumeResult = () => {
    setAnalyzed(false);
    setDraftOpen(false);
    setCopyState("idle");
  };
  const copyResumeDraft = async () => {
    try {
      await navigator.clipboard.writeText(resumeDraft);
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }
  };
  const downloadResumeDraft = () => {
    const blob = new Blob([resumeDraft], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${activeResumeJob.company}-定制简历草稿.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  };
  const handleResumeUpload = async (file?: File) => {
    if (!file) return;
    resetResumeResult();
    setUploadMessage("");
    if (file.size > MAX_RESUME_FILE_SIZE) {
      setUploadState("error");
      setUploadMessage("文件超过 12MB，请压缩后重新上传。");
      return;
    }
    setUploadState("parsing");
    setResumeFile({ name: file.name, size: file.size });
    try {
      const extractedText = await extractResumeFileText(file);
      if (extractedText.length < 20) throw new Error("没有提取到足够的文字；如果是扫描版 PDF，请先进行 OCR 文字识别。");
      setResumeText(extractedText);
      setUploadState("success");
      setUploadMessage(`已提取 ${extractedText.length} 字，并生成岗位诊断。`);
      setAnalyzed(true);
    } catch (error) {
      setUploadState("error");
      setUploadMessage(error instanceof Error ? error.message : "文件解析失败，请尝试粘贴文字。" );
    }
  };
  const clearResumeFile = () => {
    setResumeFile(null);
    setUploadState("idle");
    setUploadMessage("");
    setResumeText("");
    resetResumeResult();
  };
  const selectedDeadline = selectedJob ? getDeadlineProfile(selectedJob) : null;
  const selectedCountdown = selectedDeadline ? getCountdownInfo(selectedDeadline, todayKey) : null;
  const selectedJd = selectedJob ? getStructuredJd(selectedJob) : null;

  return (
    <main className="career-app">
      <aside className="sidebar">
        <button className="brand" onClick={() => setView("overview")}><span className="brand-mark">△</span><span><b>跃迁</b><small>CAREER RADAR</small></span></button>
        <nav aria-label="主要导航">
          <p>工作台</p>
          {navItems.map((item) => <button key={item.key} className={view === item.key ? "active" : ""} onClick={() => setView(item.key)}><i>{item.icon}</i><span>{item.label}</span>{item.key === "jobs" && <em>{jobs.length}</em>}</button>)}
          <p>个人空间</p>
          <button><i>◇</i><span>我的作品集</span></button>
          <button><i>⚙</i><span>求职偏好</span></button>
        </nav>
        <div className="profile-card"><span>WX</span><div><b>王同学</b><small>2027届 · 数字媒体艺术</small></div><button aria-label="个人设置">···</button></div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div className="mobile-brand"><span>△</span><b>跃迁</b></div>
          <label className="global-search"><span>⌕</span><input value={search} onChange={(e) => setSearch(e.target.value)} onFocus={() => setView("jobs")} placeholder="搜索公司、岗位或技能关键词" /><kbd>⌘ K</kbd></label>
          <div className="top-actions"><span className="demo-pill verified-pill">✓ 来源已核验</span><button className="notice-button" onClick={() => setNoticeOpen(!noticeOpen)} aria-label="查看通知">♢<i /></button><button className="add-button" onClick={() => { setView("jobs"); setSearch(""); }}>＋ 发现职位</button></div>
          {noticeOpen && <div className="notice-popover"><b>今日提醒</b><p>米哈游2027秋招已开放场景模型、关卡美术和技术美术岗位，应届生截止至2026年10月31日且只能投递1个职位。</p><p>搜狐畅游3D场景岗9月14日截止；点点互动 Elite Program+ 当前12个职位中仍无美术岗。</p></div>}
        </header>

        {view === "overview" && <section className="page overview-page">
          <div className="welcome"><div><p>{formatTodayLabel(todayKey)}</p><h1>早上好，王同学。</h1><span>已追踪 <b>{jobs.length} 个</b> 国内游戏公司机会，覆盖大型、中型与独立团队；其中 {jobs.filter((job) => ["正在招聘", "实习可转正"].includes(job.campaign)).length} 个建议优先核验。</span></div><button onClick={() => setView("jobs")}>查看公司雷达 <span>→</span></button></div>

          <div className="metric-grid">
            <article><span className="metric-icon green">↗</span><div><p>重点厂商机会</p><b>{jobs.length}</b><small><i>{jobs.filter((job) => job.campaign === "正在招聘").length} 个</i> 正在招聘</small></div><div className="spark bars"><i /><i /><i /><i /><i /><i /></div></article>
            <article><span className="metric-icon amber">☆</span><div><p>已收藏</p><b>{savedIds.length}</b><small>其中 <i>2</i> 个即将截止</small></div><div className="spark line">⌁</div></article>
            <article><span className="metric-icon blue">✓</span><div><p>本月已投递</p><b>{jobs.filter((j) => !["收藏", "准备中"].includes(j.status)).length}</b><small>目标完成度 <i>60%</i></small></div><div className="mini-progress"><i style={{ width: "60%" }} /></div></article>
            <article><span className="metric-icon plum">✦</span><div><p>平均匹配度</p><b>83<sup>%</sup></b><small>高于同类岗位基线</small></div><Donut value={83} /></article>
          </div>

          <div className="dashboard-grid">
            <section className="panel priority-panel"><header><div><p>PRIORITY MATCHES</p><h2>今日优先申请</h2></div><button onClick={() => setView("jobs")}>全部职位 →</button></header><div className="compact-jobs">{jobs.slice(0, 3).map((job) => <JobCard key={job.id} job={job} todayKey={todayKey} saved={savedIds.includes(job.id)} onSave={() => toggleSaved(job.id)} onOpen={() => setSelectedJob(job)} />)}</div></section>
            <aside className="panel action-panel"><header><p>THIS WEEK</p><h2>本周行动</h2></header><div className="week-ring"><Donut value={67} /><div><b>4 / 6</b><span>本周任务</span></div></div><ul><li className="done"><i>✓</i><div><b>更新基础简历</b><span>已完成 · 周一</span></div></li><li className="done"><i>✓</i><div><b>整理 UE5 项目图</b><span>已完成 · 周三</span></div></li><li><i>3</i><div><b>完成北辰测试题</b><span className="danger">2 天后截止</span></div></li><li><i>4</i><div><b>投递星海互动</b><span>计划 · 今天</span></div></li></ul><button className="plain-button" onClick={() => setView("pipeline")}>打开投递看板</button></aside>
          </div>

          <section className="insight-strip"><div className="insight-title"><span>✦</span><div><p>AI CAREER INSIGHT</p><h2>本周求职洞察</h2></div></div><p>你的 <b>UE5 场景搭建</b> 与 <b>PBR 工作流</b> 是当前最有竞争力的能力。若在作品集中补充性能数据与模块复用说明，预计可覆盖更多高级环境美术要求。</p><button onClick={() => setView("resume")}>查看提升建议 →</button></section>
        </section>}

        {view === "jobs" && <section className="page jobs-page">
          <header className="page-heading"><div><p>GAME STUDIOS · 2027 CAMPUS</p><h1>国内游戏公司校招雷达</h1><span>覆盖大厂、中厂、小型与独立团队，优先收录游戏美术、3D场景、地编和技术美术机会。</span></div><div className="heading-stat"><b>{jobs.length}</b><span>重点机会</span></div></header>
          <section className="deadline-dashboard">
            <header><span>⏱</span><div><p>DEADLINE RADAR</p><h2>近期截止提醒</h2><small>今天 {todayKey.replaceAll("-", ".")} · 按剩余天数自动更新</small></div></header>
            <div className="deadline-alert-list">{deadlineAlerts.length ? deadlineAlerts.map(({ job, countdown }) => <button key={job.id} className={`deadline-alert countdown-${countdown.tone}`} onClick={() => setSelectedJob(job)}><span><b>{job.company}</b><small>{job.role}</small></span><em>{countdown.dateLabel}</em><strong>{countdown.label}</strong></button>) : <p>当前筛选结果中暂无公布明确日期的岗位。</p>}</div>
            <aside><b>{rollingJobCount}</b><span>个滚动招聘</span><small>没有统一截止日，建议尽早投递</small></aside>
          </section>
          <div className="source-legend"><span><i className="legend-dot live" />正在招聘</span><span><i className="legend-dot intern" />实习可转正</span><span><i className="legend-dot mismatch" />当前无美术岗</span><span><i className="legend-dot watch" />入口关注</span><p>数据最后集中核验：2026-08-23</p></div>
          <div className="filter-row"><label><span>⌕</span><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="搜索畅游、3D场景、UE5…" /></label><select value={city} onChange={(e) => setCity(e.target.value)} aria-label="城市筛选"><option>全部城市</option><option>上海</option><option>杭州</option><option>深圳</option><option>成都</option><option>广州</option><option>北京</option><option>厦门</option><option>重庆</option><option>苏州</option></select><select value={scaleFilter} onChange={(e) => setScaleFilter(e.target.value)} aria-label="公司规模筛选"><option>全部规模</option><option>大型企业</option><option>中型企业</option><option>小型/独立团队</option></select><select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} aria-label="机会类型筛选"><option>全部类型</option><option>正式校招</option><option>实习生</option><option>日常实习</option><option>校招关注</option></select><select value={campaignFilter} onChange={(e) => setCampaignFilter(e.target.value)} aria-label="招聘状态筛选"><option>全部状态</option><option>正在招聘</option><option>实习可转正</option><option>持续开放</option><option>当前无美术岗</option><option>入口关注</option><option>已结束参考</option></select><button>匹配度优先 ↕</button></div>
          <div className="result-bar"><span>找到 <b>{filteredJobs.length}</b> 个重点机会，来自 {new Set(filteredJobs.map((job) => job.company)).size} 家游戏公司</span><span>信息可能随时变化 · 以官网为准</span></div>
          <div className="job-list">{filteredJobs.map((job) => <JobCard key={job.id} job={job} todayKey={todayKey} saved={savedIds.includes(job.id)} onSave={() => toggleSaved(job.id)} onOpen={() => setSelectedJob(job)} />)}</div>
        </section>}

        {view === "resume" && <section className="page resume-page">
          <header className="page-heading"><div><p>AI RESUME STUDIO</p><h1>针对岗位，重写你的优势。</h1><span>上传 Word / PDF 或直接粘贴简历内容，系统会对照岗位要求生成修改方案；文件只在当前设备中解析。</span></div></header>
          <div className="resume-layout">
            <section className="resume-editor panel">
              <div className="step-label"><b>01</b><span>选择目标岗位</span></div>
              <select value={selectedResumeJob} onChange={(e) => { setSelectedResumeJob(Number(e.target.value)); resetResumeResult(); }}>{jobs.map((job) => <option value={job.id} key={job.id}>{job.company} · {job.role}</option>)}</select>
              <div className="selected-role"><span className="company-mark" style={{ background: activeResumeJob.accent }}>{activeResumeJob.initials}</span><div><b>{activeResumeJob.role}</b><span>{activeResumeJob.company} · {activeResumeJob.city} · 岗位基础匹配 {activeResumeJob.match}%</span></div></div>
              <div className="step-label"><b>02</b><span>上传或粘贴简历</span><small>{resumeText.length} 字</small></div>
              <div
                className={`resume-upload ${dragActive ? "drag-active" : ""} ${uploadState === "error" ? "upload-error" : ""}`}
                onDragOver={(event) => { event.preventDefault(); setDragActive(true); }}
                onDragLeave={(event) => { event.preventDefault(); setDragActive(false); }}
                onDrop={(event) => { event.preventDefault(); setDragActive(false); void handleResumeUpload(event.dataTransfer.files[0]); }}
              >
                <input id="resume-file-upload" type="file" accept=".docx,.pdf,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain" onChange={(event) => { void handleResumeUpload(event.target.files?.[0]); event.currentTarget.value = ""; }} />
                {resumeFile ? <div className="uploaded-file"><span className="file-icon">{resumeFile.name.toLowerCase().endsWith(".pdf") ? "PDF" : resumeFile.name.toLowerCase().endsWith(".docx") ? "DOCX" : "TXT"}</span><div><b>{resumeFile.name}</b><span>{(resumeFile.size / 1024 / 1024).toFixed(2)} MB · {uploadState === "parsing" ? "正在提取文字…" : uploadState === "success" ? "已成功导入" : "解析遇到问题"}</span></div><label htmlFor="resume-file-upload">更换</label><button type="button" onClick={clearResumeFile} aria-label="移除已上传的简历">×</button></div> : <div className="upload-empty"><span>⇧</span><div><b>拖拽简历到这里，或 <label htmlFor="resume-file-upload">选择文件</label></b><small>支持 Word（.docx）、PDF、TXT · 最大 12MB</small></div></div>}
                {uploadState !== "idle" && uploadMessage && <p className={`upload-message ${uploadState}`}>{uploadState === "success" ? "✓" : "!"} {uploadMessage}</p>}
              </div>
              <div className="input-divider"><span>或直接粘贴 / 编辑提取后的文字</span></div>
              <textarea value={resumeText} onChange={(e) => { setResumeText(e.target.value); resetResumeResult(); }} aria-label="简历内容" placeholder="粘贴个人简介、技能和项目经历，信息越完整，建议越准确。" />
              <button className="analyze-button" disabled={!resumeText.trim()} onClick={() => { setAnalyzed(true); setDraftOpen(false); setCopyState("idle"); }}><span>✦</span>{analyzed ? "重新生成岗位诊断" : "开始岗位匹配诊断"}</button>
              <p className="privacy-note">⌾ 文件不会上传到服务器；内容仅在当前浏览器中处理</p>
            </section>

            <section className={analyzed ? "analysis-panel active" : "analysis-panel"}>
              {!analyzed ? <div className="analysis-empty"><span>✦</span><h2>让每一段经历，都回应岗位要求</h2><p>左侧选择岗位并粘贴简历后，开始生成匹配诊断。</p><div><i /><i /><i /></div></div> : <div className="analysis-result">
                <header><div><p>MATCH REPORT · {activeResumeJob.company}</p><h2>针对“{activeResumeJob.role}”的修改报告</h2></div><Donut value={resumeReport.overall} /></header>
                <div className="score-breakdown">
                  <span><b>技能匹配</b><i><em style={{ width: `${resumeReport.skillScore}%` }} /></i><small>{resumeReport.skillScore}</small></span>
                  <span><b>项目相关</b><i><em style={{ width: `${resumeReport.projectScore}%` }} /></i><small>{resumeReport.projectScore}</small></span>
                  <span><b>表达质量</b><i><em style={{ width: `${resumeReport.expressionScore}%` }} /></i><small>{resumeReport.expressionScore}</small></span>
                </div>

                <div className="keyword-summary">
                  <div className="keyword-group"><b>已命中关键词</b><div>{resumeReport.hitKeywords.length ? resumeReport.hitKeywords.map((item) => <span className="keyword-hit" key={item}>✓ {item}</span>) : <span className="keyword-empty">暂未命中岗位标签</span>}</div></div>
                  <div className="keyword-group"><b>建议核实并补充</b><div>{resumeReport.missingKeywords.length ? resumeReport.missingKeywords.map((item) => <span className="keyword-gap" key={item}>＋ {item}</span>) : <span className="keyword-complete">岗位标签已基本覆盖</span>}</div></div>
                </div>

                <article className="rewrite-card">
                  <span>优先修改 · 项目经历</span>
                  <p className="before">原描述：{resumeText.split(/[。\n]/).find(Boolean)?.trim() || "尚未填写项目描述"}</p>
                  <p className="after">建议模板：{resumeReport.rewrittenProject}</p>
                </article>

                <section className="resume-advice-section">
                  <div className="section-heading"><div><p>JOB-SPECIFIC ACTIONS</p><h3>针对该岗位的修改建议</h3></div><span>{resumeReport.advice.length} 项可执行建议</span></div>
                  <div className="resume-advice-list">{resumeReport.advice.map((item, index) => <article className="advice-item" key={item.title}><b>{String(index + 1).padStart(2, "0")}</b><div><h4>{item.title}</h4><p>{item.detail}</p><strong>怎么改：{item.action}</strong></div></article>)}</div>
                </section>

                <div className="suggestion-columns"><article><h3><i>✓</i> 已命中的优势</h3>{resumeReport.strengths.map((item) => <p key={item}>{item}</p>)}</article><article><h3><i>!</i> 建议补强</h3>{resumeReport.gaps.map((item) => <p key={item}>{item}</p>)}</article></div>

                <button className="export-button" onClick={() => { setDraftOpen(true); setCopyState("idle"); }} aria-expanded={draftOpen}>{draftOpen ? "定制草稿已生成，见下方 ↓" : "生成定制简历草稿 →"}</button>
                {draftOpen && <section className="draft-panel" aria-live="polite">
                  <header><div><p>TAILORED RESUME DRAFT</p><h3>{activeResumeJob.company} · 定制简历草稿</h3></div><span>占位符需替换为真实信息</span></header>
                  <textarea readOnly value={resumeDraft} aria-label="定制简历草稿" />
                  <div className="draft-actions"><button onClick={copyResumeDraft}>{copyState === "copied" ? "✓ 已复制到剪贴板" : copyState === "failed" ? "复制失败，请手动选择" : "复制全部内容"}</button><button onClick={downloadResumeDraft}>下载 TXT 草稿</button></div>
                  <p>提示：草稿只重组你已提供的内容；［方括号］中的内容必须按真实情况补全。</p>
                </section>}
              </div>}
            </section>
          </div>
        </section>}

        {view === "pipeline" && <section className="page pipeline-page">
          <header className="page-heading pipeline-heading"><div><p>APPLICATION PIPELINE</p><h1>投递看板</h1><span>把每次投递变成可以复盘、可以优化的过程。</span></div><button onClick={() => setView("jobs")}>＋ 添加职位</button></header>
          <div className="pipeline-board">{statusOrder.map((status) => { const columnJobs = jobs.filter((job) => job.status === status); return <section className="pipeline-column" key={status}><header><span><i className={`status-dot s${statusOrder.indexOf(status)}`} />{status}</span><b>{columnJobs.length}</b></header><div>{columnJobs.map((job) => <article className="pipeline-card" key={job.id}><div><span className="company-mark" style={{ background: job.accent }}>{job.initials}</span><small>{job.company}</small></div><h3>{job.role}</h3><p>⌖ {job.city} <span>·</span> {job.match}% 匹配</p><div className="pipeline-date"><span>{getPipelineDeadlineLabel(job, todayKey)}</span><select value={job.status} onChange={(e) => changeStatus(job.id, e.target.value as JobStatus)} aria-label={`更新${job.company}投递状态`}>{statusOrder.map((item) => <option key={item}>{item}</option>)}</select></div></article>)}</div><button className="column-add">＋ 添加到{status}</button></section>; })}</div>
        </section>}

        <footer className="app-footer"><span>跃迁 · 为游戏美术校招生打造</span><span>职位信息为产品演示，请以企业官方页面为准</span></footer>
      </section>

      {selectedJob && selectedDeadline && selectedCountdown && selectedJd && <div className="drawer-backdrop" onClick={() => setSelectedJob(null)}><aside className="job-drawer detailed-drawer" onClick={(e) => e.stopPropagation()}>
        <button className="drawer-close" onClick={() => setSelectedJob(null)}>×</button>
        <div className="drawer-hero">
          <span className="company-mark" style={{ background: selectedJob.accent }}>{selectedJob.initials}</span>
          <p>{selectedJob.company} <span className={`campaign-badge ${campaignTone[selectedJob.campaign]}`}>{selectedJob.campaign}</span><span className={`detail-level level-${selectedJd.level}`}>{selectedJd.level}</span></p>
          <h2>{selectedJob.role}</h2>
          <div className="tag-row">{selectedJob.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
        </div>

        <section className="deadline-section">
          <div className="drawer-section-title"><div><p>APPLICATION TIMELINE</p><h3>招聘时间与截止规则</h3></div><span className={`drawer-countdown countdown-${selectedCountdown.tone}`}>{selectedCountdown.label}</span></div>
          <div className="deadline-grid"><article><span>招聘批次</span><b>{selectedDeadline.batch}</b></article><article><span>开始时间</span><b>{selectedDeadline.opened}</b></article><article className="deadline-primary"><span>最晚投递</span><b>{selectedDeadline.closes}</b></article><article><span>最后核验</span><b>{selectedJob.verifiedAt}</b></article></div>
          <p className="deadline-rule"><i>!</i><span><b>截止说明</b>{selectedDeadline.rule}</span></p>
        </section>

        <section><div className="drawer-section-title"><div><p>COMPANY INTELLIGENCE</p><h3>公司与项目信息</h3></div></div><dl><div><dt>主营业务</dt><dd>{selectedJob.business}</dd></div><div><dt>公司规模</dt><dd>{selectedJob.scale}</dd></div><div><dt>项目方向</dt><dd>{selectedJob.project}</dd></div><div><dt>信息来源</dt><dd><a href={selectedJob.sourceUrl} target="_blank" rel="noreferrer">{selectedJob.source} ↗</a></dd></div></dl></section>

        <section className="structured-jd">
          <div className="drawer-section-title"><div><p>FULL JOB DESCRIPTION</p><h3>岗位 JD 结构化拆解</h3></div></div>
          <p className={`jd-note ${selectedJd.level === "公司级监控" ? "warning" : ""}`}><i>{selectedJd.level === "公司级监控" ? "!" : "✓"}</i>{selectedJd.note}</p>
          <article className="jd-block"><h4><span>01</span>岗位职责</h4><ul>{selectedJd.responsibilities.map((item) => <li key={item}>{item}</li>)}</ul></article>
          <article className="jd-block"><h4><span>02</span>任职要求</h4><ul>{selectedJd.qualifications.map((item) => <li key={item}>{item}</li>)}</ul></article>
          <article className="jd-block"><h4><span>03</span>作品集要求</h4><ul>{selectedJd.portfolio.map((item) => <li key={item}>{item}</li>)}</ul></article>
          <article className="jd-block"><h4><span>04</span>预计招聘流程</h4><ol>{selectedJd.process.map((item) => <li key={item}>{item}</li>)}</ol></article>
        </section>

        <section className="fit-note"><h3>为什么推荐给你</h3>{selectedJob.reasons.map((item) => <p key={item}><span>＋</span>{item}</p>)}{selectedJob.missing.map((item) => <p className="gap" key={item}><span>!</span>{item}</p>)}</section>
        <div className="drawer-actions expanded"><button onClick={() => toggleSaved(selectedJob.id)}>{savedIds.includes(selectedJob.id) ? "★ 已收藏" : "☆ 收藏职位"}</button><button onClick={() => { setSelectedResumeJob(selectedJob.id); setView("resume"); setSelectedJob(null); }}>诊断简历</button><a href={selectedJob.sourceUrl} target="_blank" rel="noreferrer">打开招聘入口 ↗</a></div>
      </aside></div>}
    </main>
  );
}
