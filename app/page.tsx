"use client";

import { useEffect, useMemo, useState } from "react";

type View = "overview" | "jobs" | "resume" | "pipeline";
type JobStatus = "收藏" | "准备中" | "已投递" | "笔试/测试" | "面试";

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
  requirements: string[];
  reasons: string[];
  missing: string[];
  accent: string;
};

const demoJobs: Job[] = [
  {
    id: 1,
    company: "星海互动",
    initials: "XH",
    role: "UE5 场景美术设计师（校招）",
    city: "上海",
    deadline: "08月12日",
    daysLeft: 5,
    match: 92,
    status: "准备中",
    tags: ["UE5", "PBR", "写实", "应届生"],
    business: "自研精品游戏与全球发行",
    scale: "500–999人",
    project: "开放世界动作项目（研发中）",
    source: "企业招聘官网",
    requirements: ["熟悉 Maya / 3ds Max 与 ZBrush", "能在 UE5 中完成场景搭建、灯光与优化", "理解 PBR 流程与模块化资产制作"],
    reasons: ["你的 UE5 场景搭建经历与岗位核心要求一致", "作品集中包含完整的模块化场景案例", "写实方向与项目美术风格接近"],
    missing: ["简历尚未体现性能优化数据", "建议补充团队协作或版本管理经历"],
    accent: "#6d8f72",
  },
  {
    id: 2,
    company: "云岚游戏",
    initials: "YL",
    role: "3D 场景美术师（2027届）",
    city: "杭州",
    deadline: "08月16日",
    daysLeft: 9,
    match: 88,
    status: "收藏",
    tags: ["Maya", "Substance", "次世代"],
    business: "移动游戏研发与运营",
    scale: "1000–4999人",
    project: "国风幻想 RPG",
    source: "高校就业信息网",
    requirements: ["掌握次世代场景资产制作流程", "具备良好的造型、色彩和材质表现能力", "有完整作品集并说明个人职责"],
    reasons: ["次世代资产流程覆盖度较高", "个人作品具备国风元素", "软件栈与岗位要求匹配"],
    missing: ["需要强化国风建筑结构研究", "作品说明中的个人职责不够具体"],
    accent: "#98705d",
  },
  {
    id: 3,
    company: "青屿网络",
    initials: "QY",
    role: "关卡地编 / Level Artist",
    city: "深圳",
    deadline: "08月20日",
    daysLeft: 13,
    match: 84,
    status: "已投递",
    tags: ["地编", "动线", "Unity", "二次元"],
    business: "二次元游戏研发",
    scale: "500–999人",
    project: "多端箱庭探索项目",
    source: "公开招聘平台",
    requirements: ["理解关卡空间、动线与视觉引导", "能够使用 Unity 完成场景落地", "具备跨部门沟通和快速迭代能力"],
    reasons: ["场景构图与氛围塑造能力较强", "有地编完整流程展示", "项目拆解逻辑清楚"],
    missing: ["Unity 经历较少", "建议增加动线与可玩性分析图"],
    accent: "#667b91",
  },
  {
    id: 4,
    company: "北辰数字",
    initials: "BC",
    role: "环境美术实习生",
    city: "成都",
    deadline: "08月28日",
    daysLeft: 21,
    match: 79,
    status: "笔试/测试",
    tags: ["Blender", "手绘", "卡通渲染"],
    business: "独立游戏与主机游戏研发",
    scale: "100–499人",
    project: "风格化冒险游戏",
    source: "企业公众号",
    requirements: ["有良好的手绘与色彩基础", "熟悉 Blender 或 Maya", "热爱风格化游戏与环境叙事"],
    reasons: ["场景色彩和叙事意识符合要求", "有风格化项目可以作为主案例"],
    missing: ["手绘贴图案例数量偏少", "建议补充 Blender 工作流"],
    accent: "#ad8f54",
  },
  {
    id: 5,
    company: "昼夜工作室",
    initials: "ZY",
    role: "技术美术 TA（美术向）",
    city: "广州",
    deadline: "09月02日",
    daysLeft: 26,
    match: 71,
    status: "收藏",
    tags: ["TA", "Shader", "Houdini"],
    business: "游戏技术与内容研发",
    scale: "100–499人",
    project: "跨平台合作动作游戏",
    source: "企业招聘官网",
    requirements: ["熟悉实时渲染基础", "了解 Shader 或程序化内容生产", "能够连接美术与程序工作流"],
    reasons: ["具备较完整的引擎落地经验", "对资产规范和性能有基础理解"],
    missing: ["需要补充 Shader 实例", "Houdini 程序化案例不足"],
    accent: "#7d6b92",
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

function JobCard({ job, onOpen, saved, onSave }: { job: Job; onOpen: () => void; saved: boolean; onSave: () => void }) {
  return (
    <article className="job-card" onClick={onOpen} tabIndex={0} onKeyDown={(e) => e.key === "Enter" && onOpen()}>
      <div className="company-mark" style={{ background: job.accent }}>{job.initials}</div>
      <div className="job-main">
        <div className="job-title-row"><div><span>{job.company}</span><h3>{job.role}</h3></div><button className={saved ? "save-button saved" : "save-button"} onClick={(e) => { e.stopPropagation(); onSave(); }} aria-label={saved ? "取消收藏" : "收藏职位"}>{saved ? "★" : "☆"}</button></div>
        <p className="job-meta"><span>⌖ {job.city}</span><span>◷ 截止 {job.deadline}</span><span className={job.daysLeft <= 7 ? "urgent" : ""}>{job.daysLeft <= 7 ? `仅剩 ${job.daysLeft} 天` : `${job.daysLeft} 天后截止`}</span></p>
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
  const [selectedResumeJob, setSelectedResumeJob] = useState(1);
  const [resumeText, setResumeText] = useState("熟悉 Maya、ZBrush、Substance Painter 与 UE5，独立完成过写实废墟和风格化森林场景。负责模型、UV、材质、灯光及最终画面呈现。熟悉模块化资产制作和基础 PBR 工作流。");
  const [analyzed, setAnalyzed] = useState(false);
  const [noticeOpen, setNoticeOpen] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("career-radar-state");
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as { savedIds?: number[]; statuses?: Record<number, JobStatus> };
      if (parsed.savedIds) setSavedIds(parsed.savedIds);
      if (parsed.statuses) setJobs((current) => current.map((job) => ({ ...job, status: parsed.statuses?.[job.id] ?? job.status })));
    } catch { /* keep demo defaults */ }
  }, []);

  useEffect(() => {
    const statuses = Object.fromEntries(jobs.map((job) => [job.id, job.status]));
    window.localStorage.setItem("career-radar-state", JSON.stringify({ savedIds, statuses }));
  }, [savedIds, jobs]);

  const filteredJobs = useMemo(() => jobs.filter((job) => {
    const query = search.trim().toLowerCase();
    const searchHit = !query || `${job.company}${job.role}${job.tags.join("")}`.toLowerCase().includes(query);
    return searchHit && (city === "全部城市" || job.city === city);
  }), [jobs, search, city]);

  const activeResumeJob = jobs.find((job) => job.id === selectedResumeJob) ?? jobs[0];
  const changeStatus = (jobId: number, status: JobStatus) => setJobs((current) => current.map((job) => job.id === jobId ? { ...job, status } : job));
  const toggleSaved = (id: number) => setSavedIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);

  return (
    <main className="career-app">
      <aside className="sidebar">
        <button className="brand" onClick={() => setView("overview")}><span className="brand-mark">△</span><span><b>跃迁</b><small>CAREER RADAR</small></span></button>
        <nav aria-label="主要导航">
          <p>工作台</p>
          {navItems.map((item) => <button key={item.key} className={view === item.key ? "active" : ""} onClick={() => setView(item.key)}><i>{item.icon}</i><span>{item.label}</span>{item.key === "jobs" && <em>24</em>}</button>)}
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
          <div className="top-actions"><span className="demo-pill">演示数据</span><button className="notice-button" onClick={() => setNoticeOpen(!noticeOpen)} aria-label="查看通知">♢<i /></button><button className="add-button" onClick={() => { setView("jobs"); setSearch(""); }}>＋ 发现职位</button></div>
          {noticeOpen && <div className="notice-popover"><b>今日提醒</b><p>星海互动岗位将在 5 天后截止。</p><p>你有 1 个测试题需要本周完成。</p></div>}
        </header>

        {view === "overview" && <section className="page overview-page">
          <div className="welcome"><div><p>FRIDAY · AUG 07</p><h1>早上好，王同学。</h1><span>今天有 <b>6 个</b> 新职位与你匹配，其中 2 个建议优先处理。</span></div><button onClick={() => setView("jobs")}>查看今日新增 <span>→</span></button></div>

          <div className="metric-grid">
            <article><span className="metric-icon green">↗</span><div><p>新增匹配职位</p><b>24</b><small><i>+6</i> 较昨日</small></div><div className="spark bars"><i /><i /><i /><i /><i /><i /></div></article>
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
          <header className="page-heading"><div><p>JOB RADAR · 2027 CAMPUS</p><h1>校招职位库</h1><span>从公开渠道聚合与你方向相关的职位，信息提交前请回到官方页面核验。</span></div><div className="heading-stat"><b>24</b><span>今日新增</span></div></header>
          <div className="filter-row"><label><span>⌕</span><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="搜索职位、公司、技能" /></label><select value={city} onChange={(e) => setCity(e.target.value)} aria-label="城市筛选"><option>全部城市</option><option>上海</option><option>杭州</option><option>深圳</option><option>成都</option><option>广州</option></select><select aria-label="方向筛选"><option>全部方向</option><option>场景美术</option><option>地编</option><option>技术美术</option></select><button>更多筛选 ⌄</button></div>
          <div className="result-bar"><span>找到 <b>{filteredJobs.length}</b> 个高相关职位</span><button>匹配度优先 ↕</button></div>
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

      {selectedJob && <div className="drawer-backdrop" onClick={() => setSelectedJob(null)}><aside className="job-drawer" onClick={(e) => e.stopPropagation()}><button className="drawer-close" onClick={() => setSelectedJob(null)}>×</button><div className="drawer-hero"><span className="company-mark" style={{ background: selectedJob.accent }}>{selectedJob.initials}</span><p>{selectedJob.company}</p><h2>{selectedJob.role}</h2><div className="tag-row">{selectedJob.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div><div className="drawer-score"><Donut value={selectedJob.match} /><div><b>与你的画像高度匹配</b><span>基于技能、项目风格与求职偏好综合计算</span></div></div><section><h3>公司情报</h3><dl><div><dt>主营业务</dt><dd>{selectedJob.business}</dd></div><div><dt>团队规模</dt><dd>{selectedJob.scale}</dd></div><div><dt>相关项目</dt><dd>{selectedJob.project}</dd></div><div><dt>信息来源</dt><dd>{selectedJob.source} · 今日核验</dd></div></dl></section><section><h3>岗位要求拆解</h3><ul>{selectedJob.requirements.map((item) => <li key={item}><i>✓</i>{item}</li>)}</ul></section><section className="fit-note"><h3>为什么推荐给你</h3>{selectedJob.reasons.map((item) => <p key={item}><span>＋</span>{item}</p>)}{selectedJob.missing.map((item) => <p className="gap" key={item}><span>!</span>{item}</p>)}</section><div className="drawer-actions"><button onClick={() => toggleSaved(selectedJob.id)}>{savedIds.includes(selectedJob.id) ? "★ 已收藏" : "☆ 收藏职位"}</button><button onClick={() => { setSelectedResumeJob(selectedJob.id); setView("resume"); setSelectedJob(null); }}>用此岗位诊断简历 →</button></div></aside></div>}
    </main>
  );
}
