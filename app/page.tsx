"use client";

import { useEffect, useMemo, useState } from "react";

type View = "overview" | "jobs" | "resume" | "pipeline";
type JobStatus = "收藏" | "准备中" | "已投递" | "笔试/测试" | "面试";
type CampaignStatus = "正在招聘" | "实习可转正" | "持续开放" | "入口关注" | "已结束参考";
type OpportunityType = "正式校招" | "实习生" | "日常实习" | "校招关注";

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
  verifiedAt: string;
  requirements: string[];
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
    city: "广州/杭州",
    deadline: "招满即止",
    daysLeft: 99,
    match: 94,
    status: "准备中",
    tags: ["27届正式校招", "游戏美术", "3D场景", "作品集"],
    business: "游戏研发、全球发行与长线运营",
    scale: "大型上市互联网与游戏公司",
    project: "多品类自研游戏与全球化项目",
    source: "网易游戏校园招聘官网",
    sourceUrl: "https://game.campus.163.com/",
    campaign: "正在招聘",
    verifiedAt: "2026-08-07",
    requirements: ["2027届毕业生，具体毕业区间以官网为准", "美术岗位需提交能够说明个人职责的作品集", "关注场景制作、引擎落地和团队协作能力"],
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
    verifiedAt: "2026-08-07",
    requirements: ["2027届实习面向2026年9月至2027年8月毕业生", "美术设计类岗位必须上传作品集", "每位候选人最多可投递两个职位"],
    reasons: ["官方明确开放2027届实习项目", "大型3D项目对场景资产与引擎能力需求稳定", "你的完整场景案例适合作为第一志愿材料"],
    missing: ["需要明确展示三角面、贴图规格和优化思路", "建议强化写实建筑与模块化资产案例"],
    accent: "#7258a5",
  },
  {
    id: 4,
    company: "叠纸游戏",
    initials: "PG",
    role: "NOVA训练营｜美术设计方向",
    city: "上海",
    deadline: "招满即止",
    daysLeft: 99,
    match: 90,
    status: "笔试/测试",
    tags: ["27届训练营", "美术设计", "灯光", "风格化"],
    business: "原创游戏、动画与IP内容研发",
    scale: "大型精品游戏研发公司",
    project: "暖暖系列、恋与系列及开放世界项目",
    source: "叠纸游戏校园招聘官网",
    sourceUrl: "https://career.papegames.com/campus",
    campaign: "正在招聘",
    verifiedAt: "2026-08-07",
    requirements: ["NOVA训练营面向2027届及之后毕业生", "美术方向关注艺术基础、画面表现与项目落地", "部分岗位包含灯光、渲染或场景相关测试"],
    reasons: ["训练营明确面向2027届", "你的风格化场景与灯光能力契合项目方向", "数字媒体艺术专业符合多数美术岗位专业偏好"],
    missing: ["需要提高角色与场景叙事的联系", "建议增加更精致的风格化材质表现"],
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
    campaign: "持续开放",
    verifiedAt: "2026-08-07",
    requirements: ["美术相关专业，掌握两款以上主流美术软件", "根据原画和技术规范完成3D模型及材质", "重视造型、色彩、学习能力和协作意识"],
    reasons: ["官网当前展示3D场景和美术向TA岗位", "你的Maya、ZBrush与PBR技能直接匹配", "校招岗位类别清晰，适合重点投递"],
    missing: ["需要将软件技能转化为可量化的项目成果", "TA方向需额外补充脚本或Shader基础"],
    accent: "#d15b44",
  },
  {
    id: 6, company: "米哈游", initials: "MHY", role: "校园招聘｜场景美术 / 3D方向", city: "上海", deadline: "关注岗位更新", daysLeft: 99, match: 88, status: "收藏",
    tags: ["二次元", "卡通渲染", "全球化", "3D场景"], business: "原创IP游戏与多元内容研发", scale: "官网披露约5000人", project: "原神、崩坏：星穹铁道、绝区零等", source: "米哈游校园招聘官网", sourceUrl: "https://jobs.mihoyo.com/campus", campaign: "入口关注", verifiedAt: "2026-08-07",
    requirements: ["具体开放岗位以校园招聘列表为准", "重视扎实美术基础、风格理解与完成度", "需要提供完整作品集及清晰的个人职责说明"], reasons: ["场景项目强调完整世界构建与引擎表现", "你的风格化场景可作为匹配起点", "官方校园招聘入口持续维护"], missing: ["作品完成度需要达到更高精度", "建议补充二次元或卡通渲染专项案例"], accent: "#5d81bb",
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
    id: 10, company: "三七互娱", initials: "37", role: "2027届实习｜UE / 3D美术方向", city: "广州", deadline: "关注补录", daysLeft: 99, match: 82, status: "收藏",
    tags: ["27届实习", "UE蓝图", "3D动画", "全球发行"], business: "游戏研发、运营与全球发行", scale: "大型上市游戏公司", project: "多品类手游与海外发行项目", source: "三七互娱招聘官网", sourceUrl: "https://zhaopin.37.com/", campaign: "入口关注", verifiedAt: "2026-08-07",
    requirements: ["2027届实习项目曾开放UE视频、UE蓝图及3D动画等岗位", "美术设计类通常包含作品或测试环节", "当前具体余量需在官网实时核验"], reasons: ["UE技能与岗位关键词相关", "广州是重要游戏研发城市", "实习可作为秋招前的生产经验补充"], missing: ["更偏视频和蓝图，需谨慎判断岗位方向", "建议补充UE Sequencer或蓝图案例"], accent: "#d39b28",
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
    id: 13, company: "灵犀互娱", initials: "LX", role: "2027届实习｜设计 / 技术美术 / 3D场景", city: "广州/上海/北京", deadline: "本批次已截止", daysLeft: 0, match: 86, status: "收藏",
    tags: ["27届实习", "3D场景", "技术美术", "批次结束"], business: "阿里巴巴旗下游戏研发与发行品牌", scale: "大型互联网集团游戏业务", project: "SLG、MMO、卡牌与箱庭等项目", source: "阿里巴巴校园招聘官网", sourceUrl: "https://campus-talent.alibaba.com/campus/position", campaign: "已结束参考", verifiedAt: "2026-08-07",
    requirements: ["2027届实习批次曾开放模型、技术美术和3D场景方向", "该批次网申已于2026年5月底结束", "可关注秋招、补录和下一轮实习"], reasons: ["历史岗位与场景方向匹配度高", "岗位类型覆盖模型、TA和3D场景", "适合作为后续批次监控对象"], missing: ["当前批次已结束，请勿误投", "建议开启补录提醒"], accent: "#e77b28",
  },
  {
    id: 14, company: "英雄游戏", initials: "YX", role: "2027届实习生｜游戏美术类", city: "北京/上海", deadline: "招满即止", daysLeft: 99, match: 80, status: "收藏",
    tags: ["27届实习", "游戏美术", "研发发行"], business: "游戏研发、发行与电竞相关业务", scale: "大型游戏公司", project: "多品类移动与主机游戏项目", source: "高校就业网招聘公告", sourceUrl: "https://www.yingxiong.com/", campaign: "正在招聘", verifiedAt: "2026-08-07",
    requirements: ["2027届实习项目公开包含美术类岗位", "具体场景岗位需以实时职位列表为准", "建议准备作品集与可持续实习时间说明"], reasons: ["适合作为大厂之外的重点补充投递", "研发与发行项目覆盖多个美术方向", "可积累真实游戏生产经验"], missing: ["当前公开信息未细分到场景岗位", "投递前需再次核验职位名称和地点"], accent: "#315d82",
  },
  {
    id: 15, company: "鹰角网络", initials: "HG", role: "2027秋季校园招聘提前批｜美术表现类", city: "上海", deadline: "招满即止", daysLeft: 99, match: 91, status: "收藏", opportunityType: "正式校招",
    tags: ["27届秋招", "美术表现", "3D场景", "日常实习"], business: "原创游戏与文化内容研发", scale: "头部精品游戏研发公司", project: "明日方舟及多款在研项目", source: "鹰角网络校园招聘官网", sourceUrl: "https://campus.hypergryph.com/", campaign: "正在招聘", verifiedAt: "2026-08-07",
    requirements: ["2027秋招提前批已经启动", "招聘官网设有美术表现类岗位和日常实习入口", "美术岗位需以官网实时职位和作品集要求为准"], reasons: ["场景风格研究与艺术表达权重较高", "你的风格化场景方向具备潜在匹配度", "同时可关注日常实习积累生产经验"], missing: ["需要提升作品的原创世界观表达", "建议增加一套强风格化场景设计"], accent: "#202326",
  },
  {
    id: 16, company: "搜狐畅游", initials: "CY", role: "2027届暑期实习｜游戏美术类", city: "北京", deadline: "招满即止", daysLeft: 99, match: 87, status: "收藏", opportunityType: "实习生",
    tags: ["27届实习", "可转正", "3D场景", "技术美术"], business: "网络游戏研发与运营", scale: "大型老牌游戏公司", project: "天龙八部系列及多款在研项目", source: "畅游校园招聘官网", sourceUrl: "https://campus.changyou.com/", campaign: "实习可转正", verifiedAt: "2026-08-07",
    requirements: ["暑期实习面向2027届毕业生并提供转正机会", "游戏美术大类岗位以官网开放情况为准", "日常实习也向其他年级在校生开放"], reasons: ["岗位体系包含3D场景与技术美术方向", "实习转正路径清晰", "你的数字媒体艺术背景符合美术岗位偏好"], missing: ["需要准备稳定的实习时间说明", "建议增加写实MMO环境资产"], accent: "#1d77b7",
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
    id: 20, company: "盛趣游戏", initials: "SQ", role: "校招 / 实习机会｜游戏美术方向", city: "上海", deadline: "关注岗位更新", daysLeft: 99, match: 83, status: "收藏", opportunityType: "日常实习",
    tags: ["实习机会", "技术美术", "MMO", "上海"], business: "网络游戏研发、发行与运营", scale: "大型老牌游戏公司", project: "传奇世界、最终幻想14等", source: "盛趣游戏加入我们", sourceUrl: "https://www.shengqugames.com/cn/join", campaign: "持续开放", verifiedAt: "2026-08-07",
    requirements: ["官网同时提供校园招聘和实习机会入口", "历史项目包含技术美术实习与转校招", "具体岗位需在入口内实时核验"], reasons: ["MMO项目对场景资源需求长期存在", "日常实习可以补充团队项目经历", "上海地点便于集中投递"], missing: ["入口部分页面为往届专题，需核验发布日期", "建议优先查找3D场景或TA岗位"], accent: "#b03039",
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
  "已结束参考": "closed",
};

const getOpportunityType = (job: Job): OpportunityType => job.opportunityType ?? (
  job.role.includes("实习") || job.role.includes("训练营") ? "实习生" : job.campaign === "入口关注" ? "校招关注" : "正式校招"
);

function JobCard({ job, onOpen, saved, onSave }: { job: Job; onOpen: () => void; saved: boolean; onSave: () => void }) {
  return (
    <article className="job-card" onClick={onOpen} tabIndex={0} onKeyDown={(e) => e.key === "Enter" && onOpen()}>
      <div className="company-mark" style={{ background: job.accent }}>{job.initials}</div>
      <div className="job-main">
        <div className="job-title-row"><div><span className="company-name">{job.company}</span><h3>{job.role}</h3></div><button className={saved ? "save-button saved" : "save-button"} onClick={(e) => { e.stopPropagation(); onSave(); }} aria-label={saved ? "取消收藏" : "收藏职位"}>{saved ? "★" : "☆"}</button></div>
        <p className="job-meta"><span className="opportunity-label">{getOpportunityType(job)}</span><span>⌖ {job.city}</span><span>◷ {job.deadline}</span><span className={`campaign-badge ${campaignTone[job.campaign]}`}>{job.campaign}</span><span>核验 {job.verifiedAt.slice(5)}</span><a className="apply-link" href={job.sourceUrl} target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()}>网申入口 ↗</a></p>
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
  const [selectedResumeJob, setSelectedResumeJob] = useState(1);
  const [resumeText, setResumeText] = useState("熟悉 Maya、ZBrush、Substance Painter 与 UE5，独立完成过写实废墟和风格化森林场景。负责模型、UV、材质、灯光及最终画面呈现。熟悉模块化资产制作和基础 PBR 工作流。");
  const [analyzed, setAnalyzed] = useState(false);
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
    const statuses = Object.fromEntries(jobs.map((job) => [job.id, job.status]));
    window.localStorage.setItem("career-radar-state-v2", JSON.stringify({ savedIds, statuses }));
  }, [savedIds, jobs]);

  const filteredJobs = useMemo(() => jobs.filter((job) => {
    const query = search.trim().toLowerCase();
    const searchHit = !query || `${job.company}${job.role}${job.tags.join("")}`.toLowerCase().includes(query);
    return searchHit
      && (city === "全部城市" || job.city.includes(city))
      && (campaignFilter === "全部状态" || job.campaign === campaignFilter)
      && (typeFilter === "全部类型" || getOpportunityType(job) === typeFilter);
  }), [jobs, search, city, campaignFilter, typeFilter]);

  const activeResumeJob = jobs.find((job) => job.id === selectedResumeJob) ?? jobs[0];
  const changeStatus = (jobId: number, status: JobStatus) => setJobs((current) => current.map((job) => job.id === jobId ? { ...job, status } : job));
  const toggleSaved = (id: number) => setSavedIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);

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
          {noticeOpen && <div className="notice-popover"><b>今日提醒</b><p>网易游戏 2027 届校园招聘已经启动，建议优先核验岗位。</p><p>你有 4 个“正在招聘”机会尚未处理。</p></div>}
        </header>

        {view === "overview" && <section className="page overview-page">
          <div className="welcome"><div><p>FRIDAY · AUG 07</p><h1>早上好，王同学。</h1><span>已追踪 <b>{jobs.length} 个</b> 国内重点游戏公司机会，其中 {jobs.filter((job) => ["正在招聘", "实习可转正"].includes(job.campaign)).length} 个建议优先核验。</span></div><button onClick={() => setView("jobs")}>查看大厂雷达 <span>→</span></button></div>

          <div className="metric-grid">
            <article><span className="metric-icon green">↗</span><div><p>重点厂商机会</p><b>{jobs.length}</b><small><i>{jobs.filter((job) => job.campaign === "正在招聘").length} 个</i> 正在招聘</small></div><div className="spark bars"><i /><i /><i /><i /><i /><i /></div></article>
            <article><span className="metric-icon amber">☆</span><div><p>已收藏</p><b>{savedIds.length}</b><small>其中 <i>2</i> 个即将截止</small></div><div className="spark line">⌁</div></article>
            <article><span className="metric-icon blue">✓</span><div><p>本月已投递</p><b>{jobs.filter((j) => !["收藏", "准备中"].includes(j.status)).length}</b><small>目标完成度 <i>60%</i></small></div><div className="mini-progress"><i style={{ width: "60%" }} /></div></article>
            <article><span className="metric-icon plum">✦</span><div><p>平均匹配度</p><b>83<sup>%</sup></b><small>高于同类岗位基线</small></div><Donut value={83} /></article>
          </div>

          <div className="dashboard-grid">
            <section className="panel priority-panel"><header><div><p>PRIORITY MATCHES</p><h2>今日优先申请</h2></div><button onClick={() => setView("jobs")}>全部职位 →</button></header><div className="compact-jobs">{jobs.slice(0, 3).map((job) => <JobCard key={job.id} job={job} saved={savedIds.includes(job.id)} onSave={() => toggleSaved(job.id)} onOpen={() => setSelectedJob(job)} />)}</div></section>
            <aside className="panel action-panel"><header><p>THIS WEEK</p><h2>本周行动</h2></header><div className="week-ring"><Donut value={67} /><div><b>4 / 6</b><span>本周任务</span></div></div><ul><li className="done"><i>✓</i><div><b>更新基础简历</b><span>已完成 · 周一</span></div></li><li className="done"><i>✓</i><div><b>整理 UE5 项目图</b><span>已完成 · 周三</span></div></li><li><i>3</i><div><b>完成北辰测试题</b><span className="danger">2 天后截止</span></div></li><li><i>4</i><div><b>投递星海互动</b><span>计划 · 今天</span></div></li></ul><button className="plain-button" onClick={() => setView("pipeline")}>打开投递看板</button></aside>
          </div>

          <section className="insight-strip"><div className="insight-title"><span>✦</span><div><p>AI CAREER INSIGHT</p><h2>本周求职洞察</h2></div></div><p>你的 <b>UE5 场景搭建</b> 与 <b>PBR 工作流</b> 是当前最有竞争力的能力。若在作品集中补充性能数据与模块复用说明，预计可覆盖更多高级环境美术要求。</p><button onClick={() => setView("resume")}>查看提升建议 →</button></section>
        </section>}

        {view === "jobs" && <section className="page jobs-page">
          <header className="page-heading"><div><p>MAJOR GAME STUDIOS · 2027 CAMPUS</p><h1>国内大厂校招雷达</h1><span>优先收录游戏美术、3D场景、地编与技术美术机会；投递前请打开来源链接核验实时余量。</span></div><div className="heading-stat"><b>{jobs.length}</b><span>重点机会</span></div></header>
          <div className="source-legend"><span><i className="legend-dot live" />正在招聘</span><span><i className="legend-dot intern" />实习可转正</span><span><i className="legend-dot watch" />入口关注</span><p>数据最后集中核验：2026-08-07</p></div>
          <div className="filter-row"><label><span>⌕</span><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="搜索腾讯、网易、3D场景、UE5…" /></label><select value={city} onChange={(e) => setCity(e.target.value)} aria-label="城市筛选"><option>全部城市</option><option>上海</option><option>杭州</option><option>深圳</option><option>成都</option><option>广州</option><option>北京</option><option>厦门</option></select><select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} aria-label="机会类型筛选"><option>全部类型</option><option>正式校招</option><option>实习生</option><option>日常实习</option><option>校招关注</option></select><select value={campaignFilter} onChange={(e) => setCampaignFilter(e.target.value)} aria-label="招聘状态筛选"><option>全部状态</option><option>正在招聘</option><option>实习可转正</option><option>持续开放</option><option>入口关注</option><option>已结束参考</option></select><button>匹配度优先 ↕</button></div>
          <div className="result-bar"><span>找到 <b>{filteredJobs.length}</b> 个重点机会，来自 {new Set(filteredJobs.map((job) => job.company)).size} 家游戏公司</span><span>信息可能随时变化 · 以官网为准</span></div>
          <div className="job-list">{filteredJobs.map((job) => <JobCard key={job.id} job={job} saved={savedIds.includes(job.id)} onSave={() => toggleSaved(job.id)} onOpen={() => setSelectedJob(job)} />)}</div>
        </section>}

        {view === "resume" && <section className="page resume-page">
          <header className="page-heading"><div><p>AI RESUME STUDIO</p><h1>针对岗位，重写你的优势。</h1><span>选择目标职位，系统将对照岗位要求给出可执行建议；不会虚构你没有的经历。</span></div></header>
          <div className="resume-layout">
            <section className="resume-editor panel"><div className="step-label"><b>01</b><span>选择目标岗位</span></div><select value={selectedResumeJob} onChange={(e) => { setSelectedResumeJob(Number(e.target.value)); setAnalyzed(false); }}>{jobs.map((job) => <option value={job.id} key={job.id}>{job.company} · {job.role}</option>)}</select><div className="selected-role"><span className="company-mark" style={{ background: activeResumeJob.accent }}>{activeResumeJob.initials}</span><div><b>{activeResumeJob.role}</b><span>{activeResumeJob.company} · {activeResumeJob.city} · 匹配度 {activeResumeJob.match}%</span></div></div><div className="step-label"><b>02</b><span>粘贴简历内容</span><small>{resumeText.length} 字</small></div><textarea value={resumeText} onChange={(e) => { setResumeText(e.target.value); setAnalyzed(false); }} aria-label="简历内容" /><button className="analyze-button" onClick={() => setAnalyzed(true)}><span>✦</span>{analyzed ? "重新生成诊断" : "开始岗位匹配诊断"}</button><p className="privacy-note">⌾ 内容仅在当前设备中处理和展示</p></section>
            <section className={analyzed ? "analysis-panel active" : "analysis-panel"}>{!analyzed ? <div className="analysis-empty"><span>✦</span><h2>让每一段经历，都回应岗位要求</h2><p>左侧选择岗位并粘贴简历后，开始生成匹配诊断。</p><div><i /><i /><i /></div></div> : <div className="analysis-result"><header><div><p>MATCH REPORT</p><h2>简历匹配报告</h2></div><Donut value={86} /></header><div className="score-breakdown"><span><b>技能匹配</b><i><em style={{ width: "92%" }} /></i><small>92</small></span><span><b>项目相关</b><i><em style={{ width: "86%" }} /></i><small>86</small></span><span><b>表达质量</b><i><em style={{ width: "72%" }} /></i><small>72</small></span></div><article className="rewrite-card"><span>优先修改 · 项目经历</span><p className="before">负责制作一个废墟场景，使用了 Maya 和 UE5。</p><p className="after">独立完成写实废墟场景的模块化资产制作与 UE5 场景搭建，负责模型、UV、PBR 材质、灯光及氛围调整，并建立统一的资产命名与贴图规格。</p></article><div className="suggestion-columns"><article><h3><i>✓</i> 已命中的优势</h3>{activeResumeJob.reasons.slice(0, 2).map((item) => <p key={item}>{item}</p>)}</article><article><h3><i>!</i> 建议补强</h3>{activeResumeJob.missing.map((item) => <p key={item}>{item}</p>)}</article></div><button className="export-button">生成定制简历草稿 →</button></div>}</section>
          </div>
        </section>}

        {view === "pipeline" && <section className="page pipeline-page">
          <header className="page-heading pipeline-heading"><div><p>APPLICATION PIPELINE</p><h1>投递看板</h1><span>把每次投递变成可以复盘、可以优化的过程。</span></div><button onClick={() => setView("jobs")}>＋ 添加职位</button></header>
          <div className="pipeline-board">{statusOrder.map((status) => { const columnJobs = jobs.filter((job) => job.status === status); return <section className="pipeline-column" key={status}><header><span><i className={`status-dot s${statusOrder.indexOf(status)}`} />{status}</span><b>{columnJobs.length}</b></header><div>{columnJobs.map((job) => <article className="pipeline-card" key={job.id}><div><span className="company-mark" style={{ background: job.accent }}>{job.initials}</span><small>{job.company}</small></div><h3>{job.role}</h3><p>⌖ {job.city} <span>·</span> {job.match}% 匹配</p><div className="pipeline-date"><span>{job.daysLeft <= 7 ? `还剩 ${job.daysLeft} 天` : job.deadline}</span><select value={job.status} onChange={(e) => changeStatus(job.id, e.target.value as JobStatus)} aria-label={`更新${job.company}投递状态`}>{statusOrder.map((item) => <option key={item}>{item}</option>)}</select></div></article>)}</div><button className="column-add">＋ 添加到{status}</button></section>; })}</div>
        </section>}

        <footer className="app-footer"><span>跃迁 · 为游戏美术校招生打造</span><span>职位信息为产品演示，请以企业官方页面为准</span></footer>
      </section>

      {selectedJob && <div className="drawer-backdrop" onClick={() => setSelectedJob(null)}><aside className="job-drawer" onClick={(e) => e.stopPropagation()}><button className="drawer-close" onClick={() => setSelectedJob(null)}>×</button><div className="drawer-hero"><span className="company-mark" style={{ background: selectedJob.accent }}>{selectedJob.initials}</span><p>{selectedJob.company} <span className={`campaign-badge ${campaignTone[selectedJob.campaign]}`}>{selectedJob.campaign}</span></p><h2>{selectedJob.role}</h2><div className="tag-row">{selectedJob.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div><div className="drawer-score"><Donut value={selectedJob.match} /><div><b>与你的画像高度匹配</b><span>基于技能、项目风格与求职偏好综合计算</span></div></div><section><h3>公司情报</h3><dl><div><dt>主营业务</dt><dd>{selectedJob.business}</dd></div><div><dt>公司规模</dt><dd>{selectedJob.scale}</dd></div><div><dt>项目方向</dt><dd>{selectedJob.project}</dd></div><div><dt>信息来源</dt><dd><a href={selectedJob.sourceUrl} target="_blank" rel="noreferrer">{selectedJob.source} ↗</a></dd></div><div><dt>最后核验</dt><dd>{selectedJob.verifiedAt} · 投递前请再次确认</dd></div></dl></section><section><h3>岗位要求拆解</h3><ul>{selectedJob.requirements.map((item) => <li key={item}><i>✓</i>{item}</li>)}</ul></section><section className="fit-note"><h3>为什么推荐给你</h3>{selectedJob.reasons.map((item) => <p key={item}><span>＋</span>{item}</p>)}{selectedJob.missing.map((item) => <p className="gap" key={item}><span>!</span>{item}</p>)}</section><div className="drawer-actions expanded"><button onClick={() => toggleSaved(selectedJob.id)}>{savedIds.includes(selectedJob.id) ? "★ 已收藏" : "☆ 收藏职位"}</button><button onClick={() => { setSelectedResumeJob(selectedJob.id); setView("resume"); setSelectedJob(null); }}>诊断简历</button><a href={selectedJob.sourceUrl} target="_blank" rel="noreferrer">打开招聘入口 ↗</a></div></aside></div>}
    </main>
  );
}
