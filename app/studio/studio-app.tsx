"use client";

import { FormEvent, useMemo, useState } from "react";
import { artistRecommendations, intelItems, starterActions } from "./_data/mock-data";
import type { ArtStyle, ArtistRecommendation, IntelItem, StudioTab, WorkDirection } from "./_types";
import styles from "./studio.module.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const tabs: Array<{ id: StudioTab; label: string; count?: number }> = [
  { id: "radar", label: "今日前沿", count: intelItems.length },
  { id: "inspiration", label: "灵感收藏" },
  { id: "actions", label: "求职行动", count: starterActions.filter((item) => !item.done).length },
];

const styleFilters: Array<"全部" | ArtStyle> = ["全部", "风格化", "半写实", "写实"];
const directionFilters: Array<"全部" | WorkDirection> = ["全部", "美术方向", "开发技术", "混合方向"];

function Mark({ children }: { children: React.ReactNode }) {
  return <span className={styles.mark}>{children}</span>;
}

function IntelCard({
  item,
  onSave,
  onAction,
}: {
  item: IntelItem;
  onSave: (id: string) => void;
  onAction: (item: IntelItem) => void;
}) {
  return (
    <article className={`${styles.intelCard} ${item.featured ? styles.featuredCard : ""}`}>
      <div className={styles.cardIndex} aria-hidden="true">{item.id.slice(0, 2).toUpperCase()}</div>
      <div className={styles.cardMain}>
        <div className={styles.cardMeta}>
          <span>{item.source}</span><i /> <time>{item.publishedAt}</time>
        </div>
        <a href={item.url} target="_blank" rel="noreferrer" className={styles.cardTitle}>
          <h2>{item.title}</h2><span aria-hidden="true">↗</span>
        </a>
        <p>{item.summary}</p>
        <div className={styles.tagRow}>
          <Mark>{item.style}</Mark><Mark>{item.direction}</Mark><Mark>{item.type}</Mark>
        </div>
      </div>
      <div className={styles.cardSide}>
        <span className={`${styles.valuePill} ${styles[`value${item.value}`]}`}>{item.value}</span>
        <small>{item.signal}</small>
        <div className={styles.cardActions}>
          <button type="button" onClick={() => onSave(item.id)} aria-pressed={item.saved}>
            <span aria-hidden="true">{item.saved ? "◆" : "◇"}</span>{item.saved ? "已收藏" : "收藏"}
          </button>
          <button type="button" className={styles.actionButton} onClick={() => onAction(item)}>
            变成练习 <span aria-hidden="true">＋</span>
          </button>
        </div>
      </div>
    </article>
  );
}

function ArtistCard({ item }: { item: ArtistRecommendation }) {
  return (
    <article className={`${styles.artistCard} ${item.featured ? styles.artistFeatured : ""}`}>
      <a className={styles.artistVisual} href={item.sourceUrl} target="_blank" rel="noreferrer">
        <img src={item.imageUrl} alt={`${item.artist} 的概念设计作品 ${item.workTitle}`} loading={item.featured ? "eager" : "lazy"} />
        <span className={styles.imageCredit}>作品：{item.artist} · 来源：{item.sourceLabel}</span>
        <i aria-hidden="true">VIEW SOURCE ↗</i>
      </a>
      <div className={styles.artistBody}>
        <div className={styles.artistMeta}>
          <span>DAILY PICK</span>
          <Mark>{item.style}</Mark>
        </div>
        <p className={styles.artistName}>{item.artist}</p>
        <h3>{item.workTitle}</h3>
        <dl className={styles.artistDetails}>
          <div><dt>风格方向</dt><dd>{item.artDirection}</dd></div>
          <div><dt>世界观</dt><dd>{item.worldView}</dd></div>
          <div><dt>学习重点</dt><dd>{item.studyFocus}</dd></div>
        </dl>
        <a className={styles.sourceLink} href={item.sourceUrl} target="_blank" rel="noreferrer">阅读作者访谈与作品说明 <span>↗</span></a>
      </div>
    </article>
  );
}

export default function StudioApp() {
  const [activeTab, setActiveTab] = useState<StudioTab>("radar");
  const [items, setItems] = useState(intelItems);
  const [actions, setActions] = useState(starterActions);
  const [styleFilter, setStyleFilter] = useState<(typeof styleFilters)[number]>("全部");
  const [directionFilter, setDirectionFilter] = useState<(typeof directionFilters)[number]>("全部");
  const [query, setQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [importUrl, setImportUrl] = useState("");
  const [imported, setImported] = useState(false);

  const visibleItems = useMemo(() => items.filter((item) => {
    const matchesStyle = styleFilter === "全部" || item.style === styleFilter;
    const matchesDirection = directionFilter === "全部" || item.direction === directionFilter;
    const normalizedQuery = query.trim().toLowerCase();
    const matchesQuery = !normalizedQuery || `${item.title}${item.summary}${item.source}`.toLowerCase().includes(normalizedQuery);
    return matchesStyle && matchesDirection && matchesQuery;
  }), [items, styleFilter, directionFilter, query]);

  const savedItems = items.filter((item) => item.saved);

  const refreshRadar = () => {
    setIsRefreshing(true);
    window.setTimeout(() => setIsRefreshing(false), 900);
  };

  const toggleSave = (id: string) => {
    setItems((current) => current.map((item) => item.id === id ? { ...item, saved: !item.saved } : item));
  };

  const addAction = (item: IntelItem) => {
    const id = `from-${item.id}`;
    setActions((current) => current.some((action) => action.id === id) ? current : [
      {
        id,
        title: `验证：${item.title}`,
        output: "过程截图、结果对比与三条制作结论",
        duration: "2 小时",
        skill: `${item.direction} / ${item.style}`,
        done: false,
      },
      ...current,
    ]);
    setActiveTab("actions");
  };

  const importInspiration = (event: FormEvent) => {
    event.preventDefault();
    if (!importUrl.trim()) return;
    setImported(true);
    window.setTimeout(() => {
      setImported(false);
      setImportUrl("");
    }, 1800);
  };

  return (
    <main className={styles.studioShell}>
      <div className={styles.ambientOne} aria-hidden="true" />
      <div className={styles.ambientTwo} aria-hidden="true" />

      <header className={styles.appHeader}>
        <a className={styles.brand} href={`${basePath}/studio`} aria-label="场景雷达首页">
          <span className={styles.brandGlyph} aria-hidden="true">⌁</span>
          <span><b>场景雷达</b><small>SCENE SIGNAL</small></span>
        </a>
        <nav aria-label="工作台导航">
          {tabs.map((tab) => (
            <button key={tab.id} type="button" className={activeTab === tab.id ? styles.activeTab : ""} onClick={() => setActiveTab(tab.id)}>
              {tab.label}{typeof tab.count === "number" && <em>{tab.id === "actions" ? actions.filter((item) => !item.done).length : tab.count}</em>}
            </button>
          ))}
        </nav>
        <div className={styles.headerTools}>
          <button type="button" className={styles.searchToggle} aria-label="搜索情报" onClick={() => document.getElementById("radar-search")?.focus()}>⌕</button>
          <div className={styles.avatar} aria-label="个人工作台">WX</div>
        </div>
      </header>

      <section className={styles.heroPanel}>
        <div className={styles.heroCopy}>
          <div className={styles.eyebrow}><i /> PERSONAL INTELLIGENCE DESK <span>2026.08</span></div>
          <h1>把前沿，变成<br /><em>下一张作品集图。</em></h1>
          <p>只看与你有关的游戏场景 AI、风格灵感和制作方法。每天十分钟，完成一次从发现到行动的闭环。</p>
          <div className={styles.heroButtons}>
            <button type="button" className={styles.primaryButton} onClick={refreshRadar} disabled={isRefreshing}>
              {isRefreshing ? "正在整理今日信号…" : "获取今日更新"}<span aria-hidden="true">↗</span>
            </button>
            <button type="button" className={styles.secondaryButton} onClick={() => setActiveTab("actions")}>查看本周行动 <span>03</span></button>
          </div>
        </div>
        <aside className={styles.briefCard}>
          <div className={styles.briefTop}><span>WEEK 32</span><i>目标公司适配</i></div>
          <div className={styles.briefScore}><strong>78</strong><span>/ 100</span><small>较上周 +6</small></div>
          <div className={styles.scoreTrack}><i style={{ width: "78%" }} /></div>
          <dl>
            <div><dt>风格化场景</dt><dd><i style={{ width: "86%" }} /></dd><span>86</span></div>
            <div><dt>UE5 落地</dt><dd><i style={{ width: "74%" }} /></dd><span>74</span></div>
            <div><dt>AIGC 实验</dt><dd><i style={{ width: "61%" }} /></dd><span>61</span></div>
          </dl>
          <p><span>本周建议</span>补一组“AI 生成 → 人工修正 → UE5”的过程对比。</p>
        </aside>
      </section>

      <section className={styles.signalStrip} aria-label="今日摘要">
        <div><span>01</span><p><small>TODAY</small><b>6 条有效信号</b></p></div>
        <div><span>02</span><p><small>FOCUS</small><b>风格化 · UE5 · 3D</b></p></div>
        <div><span>03</span><p><small>NEXT ACTION</small><b>完成一次 2 小时验证</b></p></div>
        <div className={styles.liveSignal}><i /> 数据更新于 09:40</div>
      </section>

      <section className={styles.workspace}>
        {activeTab === "radar" && (
          <>
            <section className={styles.artistSection} aria-labelledby="daily-artist-title">
              <header className={styles.artistSectionHeader}>
                <div><span>01 / DAILY ARTIST SIGNAL</span><h2 id="daily-artist-title">每日优秀概念设计师</h2><p>直接看作品，也看它为什么成立：风格、世界观和可带走的学习重点都已整理在卡片中。</p></div>
                <div className={styles.scanStatus}><i /> 3 PICKS · 作品每日轮换</div>
              </header>
              <div className={styles.artistGrid}>
                {artistRecommendations.map((item) => <ArtistCard key={item.id} item={item} />)}
              </div>
            </section>

            <header className={styles.sectionHeader}>
              <div><span>02 / DAILY RADAR</span><h2>今日前沿</h2><p>已按你的目标方向过滤噪音，只保留能转化成方法或作品证据的内容。</p></div>
              <label className={styles.searchBox} htmlFor="radar-search"><span>⌕</span><input id="radar-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索工具、案例或制作环节" /></label>
            </header>

            <div className={styles.filterRail}>
              <div><span>风格</span>{styleFilters.map((filter) => <button key={filter} type="button" className={styleFilter === filter ? styles.activeFilter : ""} onClick={() => setStyleFilter(filter)}>{filter}</button>)}</div>
              <div><span>方向</span>{directionFilters.map((filter) => <button key={filter} type="button" className={directionFilter === filter ? styles.activeFilter : ""} onClick={() => setDirectionFilter(filter)}>{filter}</button>)}</div>
              <small>{visibleItems.length} RESULTS</small>
            </div>

            <div className={styles.intelList}>
              {visibleItems.map((item) => <IntelCard key={item.id} item={item} onSave={toggleSave} onAction={addAction} />)}
              {visibleItems.length === 0 && <div className={styles.emptyState}><span>⌁</span><h3>没有匹配的信号</h3><p>换一个筛选条件，或清空搜索关键词。</p></div>}
            </div>
          </>
        )}

        {activeTab === "inspiration" && (
          <>
            <header className={styles.sectionHeader}>
              <div><span>02 / INSPIRATION VAULT</span><h2>灵感收藏</h2><p>保留来源和作者信息，只提炼值得学习的视觉方法。</p></div>
            </header>
            <form className={styles.importPanel} onSubmit={importInspiration}>
              <div><span aria-hidden="true">＋</span><p><b>粘贴一个作品链接</b><small>支持 ArtStation、Behance、个人网站与公开视频链接</small></p></div>
              <label><span className="sr-only">作品链接</span><input type="url" value={importUrl} onChange={(event) => setImportUrl(event.target.value)} placeholder="https://…" required /><button type="submit">{imported ? "已加入待整理" : "导入并分析"}</button></label>
              <p>首版只保存链接、标签和你的分析，不复制原始作品。</p>
            </form>
            <div className={styles.collectionGrid}>
              {savedItems.length ? savedItems.map((item, index) => (
                <article key={item.id} className={styles.collectionCard}>
                  <div className={styles.collectionVisual}><span>0{index + 1}</span><i>{item.style}</i><b>VIEW<br />STUDY</b></div>
                  <p><small>{item.source}</small><a href={item.url} target="_blank" rel="noreferrer">{item.title}</a></p>
                  <button type="button" onClick={() => toggleSave(item.id)}>移出收藏</button>
                </article>
              )) : <div className={styles.emptyCollection}><span>◇</span><h3>收藏夹正在等待第一条灵感</h3><p>回到今日前沿收藏内容，或粘贴一个你喜欢的作品链接。</p><button type="button" onClick={() => setActiveTab("radar")}>去发现内容</button></div>}
            </div>
          </>
        )}

        {activeTab === "actions" && (
          <>
            <header className={styles.sectionHeader}>
              <div><span>03 / CAREER ACTIONS</span><h2>求职行动</h2><p>每个任务都必须产出一张图、一段验证或一个可公开的制作结论。</p></div>
              <div className={styles.completionRing}><strong>{Math.round(actions.filter((item) => item.done).length / actions.length * 100)}%</strong><span>本周完成</span></div>
            </header>
            <div className={styles.actionLayout}>
              <div className={styles.actionList}>
                {actions.map((action, index) => (
                  <article key={action.id} className={action.done ? styles.completedAction : ""}>
                    <button type="button" className={styles.checkButton} onClick={() => setActions((current) => current.map((item) => item.id === action.id ? { ...item, done: !item.done } : item))} aria-label={action.done ? `标记${action.title}为未完成` : `完成${action.title}`}>{action.done ? "✓" : ""}</button>
                    <span>0{index + 1}</span>
                    <div><small>{action.skill}</small><h3>{action.title}</h3><p>交付：{action.output}</p></div>
                    <Mark>{action.duration}</Mark>
                  </article>
                ))}
              </div>
              <aside className={styles.evidenceCard}>
                <span>PORTFOLIO EVIDENCE</span><h3>不要只展示结果，<br />展示你的判断。</h3>
                <ul><li><i>1</i>为什么选择这个工具</li><li><i>2</i>AI 输出哪里不可用</li><li><i>3</i>你如何修正并落地</li><li><i>4</i>最终节省了什么</li></ul>
                <button type="button">查看案例结构 <span>↗</span></button>
              </aside>
            </div>
          </>
        )}
      </section>

      <footer className={styles.studioFooter}><span>SCENE SIGNAL · PERSONAL DESK</span><p>从发现，到验证，到作品证据。</p><a href={`${basePath}/`}>返回作品集 ↗</a></footer>
    </main>
  );
}
