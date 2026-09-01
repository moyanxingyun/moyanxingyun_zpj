"use client";

import { useEffect, useRef, useState } from "react";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const assetUrl = (path: string) => `${basePath}${path}`;

const projects = [
  { id: "scene-project", kind: "ue", no: "01", eyebrow: "UE5 ENVIRONMENT", title: "风格化森林小屋", image: assetUrl("/portfolio-scene-wide.jpg"), note: "地形 · 植被 · 灯光 · 模块化资产" },
  { id: "props-project", kind: "pbr", no: "02", eyebrow: "PBR ASSET", title: "鬼面具与道具资产", image: assetUrl("/portfolio-mask.jpg"), note: "高低模 · 烘焙 · 材质 · 展示" },
  { id: "future-project", kind: "future", no: "03", eyebrow: "NEXT PROJECT", title: "写实 UE5 场景", image: assetUrl("/portfolio-modular.jpg"), note: "第二个完整场景 · 制作中" },
];

const gallery = [
  { image: assetUrl("/portfolio-scene-hero.jpg"), label: "最终镜头 01", code: "FINAL 01" },
  { image: assetUrl("/portfolio-scene-wide.jpg"), label: "最终镜头 02", code: "FINAL 02" },
  { image: assetUrl("/portfolio-scene-angles.jpg"), label: "场景多角度", code: "ANGLES" },
  { image: assetUrl("/portfolio-modular.jpg"), label: "模块化拆分", code: "MODULAR" },
  { image: assetUrl("/portfolio-materials.jpg"), label: "植被与草地材质", code: "FOLIAGE" },
];

const assets = [
  { title: "鬼面具", type: "HERO PROP", image: assetUrl("/portfolio-mask.jpg"), detail: "风格化雕刻与 PBR 材质练习。正式案例将补充高模、线框、UV、贴图通道及资产规格。" },
  { title: "铜锣与装饰面具", type: "PROP SET", image: assetUrl("/portfolio-props.jpg"), detail: "用于展示复杂装饰结构、金属层次和多角度可读性。后续拆分为独立资产卡。" },
  { title: "刀具与台钻", type: "HARD SURFACE", image: assetUrl("/portfolio-tools.jpg"), detail: "硬表面资产练习，强调材质区分与磨损控制。后续补充线框、烘焙和贴图规格。" },
];

const capabilityTabs = [
  { key: "shape", label: "造型与色彩", title: "让造型在小屏幕上依然可读", body: "强化轮廓、体块节奏、色彩分区和视觉焦点，适配全球化风格项目与移动端观看距离。", stat: "FORM / COLOR / READABILITY" },
  { key: "engine", label: "UE5 落地", title: "从单个资产推进到完整场景", body: "展示资产拼接、材质配置、地编、灯光、后处理与最终画面的完整链路，而不是只呈现离线渲染。", stat: "ASSET / MATERIAL / IN-ENGINE" },
  { key: "pipeline", label: "生产流程", title: "让过程能够被团队复用", body: "通过命名、规格、模块化、贴图预算和清晰拆解证明协作意识，并用 AIGC 辅助参考探索与效率提升。", stat: "PIPELINE / TEAMWORK / AIGC" },
];

const grassStudyStats = [
  { label: "MASTER MATERIALS", value: "02", note: "单面 / 双面母材分流" },
  { label: "MATERIAL INSTANCES", value: "07", note: "草地与阔叶材质变体" },
  { label: "MASTER MASK CLIP", value: "0.3333", note: "两套母材默认裁切阈值" },
  { label: "LEVEL USAGE", value: "3 MESH / 2 MI", note: "演示关卡实际引用" },
];

const grassPipeline = [
  ["01", "母材分流", "默认单面覆盖密集草簇；薄片需要背面可见时切换双面母材。"],
  ["02", "透明链路", "UseBaseTexture 在纹理与常量分支间切换，再由 OpacityPower 控制后接入 Opacity Mask。"],
  ["03", "实例派生", "从两套母材派生 7 个实例，按草型和叶片需求覆盖纹理与静态开关。"],
  ["04", "关卡核验", "只读扫描演示关卡中的真实材质引用，确认 3 种草模型使用 2 个实例，而非只看资源库。"],
  ["05", "成本复查", "固定镜头、分辨率与密度，对比裁切、双面、风动和 LOD 策略后再记录 GPU 数据。"],
];

const grassCapturePlan = [
  { no: "01", code: "NODE GRAPH", title: "母材透明链路", body: "局部截取 UseBaseTexture、OpacityPower 到 Opacity Mask 的完整连接；裁掉内容浏览器与内部资源路径。" },
  { no: "02", code: "INSTANCE MATRIX", title: "实例参数对照", body: "同框展示单面 / 双面实例，标注 0.3333 裁切、纹理分支和风动开关差异。" },
  { no: "03", code: "VIEW DISTANCE", title: "近中远景可读性", body: "用同一机位三联图检查叶尖保留、背面缺失与 LOD 跳变，避免只放近景美术截图。" },
  { no: "04", code: "COST VIEW", title: "复杂度与帧时", body: "并列记录 Lit、Shader Complexity / Quad Overdraw；保持同分辨率与密度，并补充 GPU ms 和 FPS。" },
];

function GameIcon({ glyph, compact = false, className = "" }: { glyph: string; compact?: boolean; className?: string }) {
  return <span className={`game-icon ${compact ? "compact" : ""} ${className}`} aria-hidden="true"><i>{glyph}</i></span>;
}

export default function Home() {
  const [filter, setFilter] = useState("all");
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [selectedAsset, setSelectedAsset] = useState<(typeof assets)[number] | null>(null);
  const [activeCapability, setActiveCapability] = useState("shape");
  const [isSunlit, setIsSunlit] = useState(false);
  const [copied, setCopied] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? (window.scrollY / max) * 100 : 0);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    if (!selectedAsset) return;
    const close = (event: KeyboardEvent) => event.key === "Escape" && setSelectedAsset(null);
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [selectedAsset]);

  const jumpTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  const copyEmail = async () => {
    await navigator.clipboard.writeText("270061154@qq.com");
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };
  const toggleVideo = async () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) await video.play();
    else video.pause();
  };
  const exportPdf = () => {
    const previousTitle = document.title;
    const closedDetails = Array.from(document.querySelectorAll<HTMLDetailsElement>(".process-list details:not([open])"));

    closedDetails.forEach((detail) => { detail.open = true; });
    document.title = "王鑫源_游戏场景美术作品集";

    const restorePage = () => {
      closedDetails.forEach((detail) => { detail.open = false; });
      document.title = previousTitle;
    };

    window.addEventListener("afterprint", restorePage, { once: true });
    window.requestAnimationFrame(() => window.print());
  };
  const activeCap = capabilityTabs.find((item) => item.key === activeCapability) ?? capabilityTabs[0];

  return (
    <main className={`portfolio ${isSunlit ? "sunlit" : ""}`}>
      <div className="scroll-progress" style={{ width: `${progress}%` }} />
      <div className="world-glow glow-a" aria-hidden="true" /><div className="world-glow glow-b" aria-hidden="true" />
      <div className="particles" aria-hidden="true">{Array.from({ length: 14 }, (_, i) => <i key={i} />)}</div>

      <header className="topbar">
        <a className="identity" href="#top" aria-label="返回网站顶部"><GameIcon glyph="✦" className="brand-icon" /><div><b>王鑫源</b><small>ENVIRONMENT ARTIST</small></div></a>
        <nav aria-label="网站导航"><a href="#work">作品</a><a href="#scene-project">场景案例</a><a href="#props-project">资产案例</a><a href="#fit">能力</a><a href="#about">关于</a></nav>
        <div className="header-actions"><button className="mode-button" type="button" onClick={() => setIsSunlit(!isSunlit)} aria-pressed={isSunlit}><GameIcon glyph={isSunlit ? "☾" : "☼"} compact /><small>{isSunlit ? "暮色" : "晨光"}</small></button><a className="contact-link" href="mailto:270061154@qq.com">联系我 <GameIcon glyph="›" compact /></a></div>
      </header>

      <section className="hero" id="top" onPointerMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); e.currentTarget.style.setProperty("--mx", `${(e.clientX - r.left) / r.width - .5}`); e.currentTarget.style.setProperty("--my", `${(e.clientY - r.top) / r.height - .5}`); }}>
        <img className="hero-art" src={assetUrl("/portfolio-scene-hero.jpg")} alt="王鑫源风格化 UE5 房屋场景" />
        <div className="hero-wash" aria-hidden="true" /><div className="hero-compass" aria-hidden="true"><i /><i /><i /><span>✦</span></div>
        <div className="hero-copy">
          <p className="status"><i /> AVAILABLE FOR 2027 CAMPUS RECRUITMENT</p>
          <span className="chapter-tag">CHAPTER Ⅰ · PORTFOLIO</span>
          <h1><span>构筑幻想，</span><span>让世界可被探索。</span></h1>
          <p className="hero-role">3D 场景美术 <em>·</em> PBR 场景建模 <em>·</em> UE5 地编</p>
          <p className="hero-intro">从资产到场景，从材质到光影。用清晰的造型、色彩与生产流程，构建适合全球化风格项目的游戏世界。</p>
          <div className="hero-actions"><a className="fantasy-button primary" href="#work"><span>探索作品</span><GameIcon glyph="›" /></a><button className="fantasy-button ghost" type="button" onClick={() => jumpTo("fit")}><span>查看能力</span><GameIcon glyph="✦" /></button></div>
          <div className="pdf-actions" aria-label="作品集 PDF 操作">
            <a className="pdf-action" href={assetUrl("/wang-xinyuan-portfolio.pdf")} download="王鑫源_游戏场景美术作品集.pdf">
              <GameIcon glyph="↓" compact />
              <span><b>下载 PDF</b><small>适合官网直接投递</small></span>
            </a>
            <button className="pdf-action" type="button" onClick={exportPdf} aria-describedby="pdf-export-note">
              <GameIcon glyph="▧" compact />
              <span><b>导出当前网页</b><small>保留完整项目内容</small></span>
            </button>
            <small className="pdf-export-note" id="pdf-export-note">在打印窗口中选择“另存为 PDF”</small>
          </div>
        </div>
        <div className="hero-orbit orbit-one" aria-hidden="true">ENVIRONMENT · UE5 · PBR</div><div className="hero-orbit orbit-two" aria-hidden="true">WANG XINYUAN · 2026</div>
        <div className="scroll-hint"><span>SCROLL</span><i /></div>
      </section>

      <section className="quest-strip" aria-label="核心能力摘要">
        <article><span>01</span><div><small>SPECIALTY</small><b>PBR 场景资产</b></div><GameIcon glyph="✦" compact /></article>
        <article><span>02</span><div><small>ENGINE</small><b>UE5 场景落地</b></div><GameIcon glyph="✦" compact /></article>
        <article><span>03</span><div><small>STYLE</small><b>全球化风格 3D</b></div><GameIcon glyph="✦" compact /></article>
      </section>

      <section className="work-section" id="work">
        <header className="section-heading"><div><span className="chapter-tag dark-tag">CHAPTER Ⅱ · SELECTED WORK</span><h2>旅途中的作品</h2></div><p>点击项目进入案例，或使用筛选快速查看 UE5 场景与 PBR 资产。悬停时会显示项目定位和制作重点。</p></header>
        <div className="filter-bar" role="group" aria-label="项目筛选">
          {[{k:"all",l:"全部"},{k:"ue",l:"UE5 场景"},{k:"pbr",l:"PBR 资产"},{k:"future",l:"制作中"}].map((item) => <button key={item.k} type="button" className={filter === item.k ? "active" : ""} onClick={() => setFilter(item.k)} aria-pressed={filter === item.k}><span>{item.l}</span></button>)}
        </div>
        <div className="project-grid">
          {projects.filter((project) => filter === "all" || project.kind === filter).map((project) => (
            <button className={`project-card kind-${project.kind}`} type="button" key={project.no} onClick={() => jumpTo(project.id)}>
              <img src={project.image} alt={`${project.title}项目预览`} /><span className="card-vignette" />
              <div className="card-corners" aria-hidden="true"><i /><i /><i /><i /></div>
              <div className="card-top"><span>{project.no}</span><small>{project.eyebrow}</small></div>
              <div className="card-copy"><p>{project.note}</p><h3>{project.title}</h3><span className="card-enter">进入项目 <GameIcon glyph="›" compact /></span></div>
            </button>
          ))}
        </div>
      </section>

      <section className="scene-case" id="scene-project">
        <header className="case-heading"><div><span className="chapter-tag">CHAPTER Ⅲ · UE5 CASE STUDY</span><p>SOLO PROJECT / REAL-TIME ENVIRONMENT</p></div><h2>风格化<br />森林小屋</h2><p>展示自制模块化资产、风格化材质、地形植被、灯光和后处理的完整场景结构。</p></header>

        <section className={`showreel-shell ${isVideoPlaying ? "is-playing" : ""}`} aria-labelledby="showreel-title">
          <header className="showreel-heading">
            <div><span>WORLD BUILDING REEL</span><h3 id="showreel-title">UE5 地编作品演示</h3></div>
            <p>场景构建、植被布置、空间节奏与最终镜头展示</p>
            <button type="button" className="showreel-toggle" onClick={toggleVideo} aria-label={isVideoPlaying ? "暂停地编作品视频" : "播放地编作品视频"}>
              <GameIcon glyph={isVideoPlaying ? "Ⅱ" : "▶"} />
              <span>{isVideoPlaying ? "暂停演示" : "播放演示"}</span>
            </button>
          </header>
          <div className="showreel-frame">
            <video
              ref={videoRef}
              controls={isVideoPlaying}
              playsInline
              preload="metadata"
              poster={assetUrl("/portfolio-scene-wide.jpg")}
              onPlay={() => setIsVideoPlaying(true)}
              onPause={() => setIsVideoPlaying(false)}
              onEnded={() => setIsVideoPlaying(false)}
            >
              <source src={assetUrl("/ue5-worldbuilding-reel.mp4")} type="video/mp4" />
              您的浏览器暂不支持视频播放。
            </video>
            <img className="print-video-poster" src={assetUrl("/portfolio-scene-wide.jpg")} alt="UE5 地编作品演示封面" />
            {!isVideoPlaying && <button className="video-start" type="button" onClick={toggleVideo} aria-label="播放 UE5 地编作品演示"><GameIcon glyph="▶" className="play-icon" /><span>点击播放完整地编演示</span><small>UE5 · WORLD BUILDING · REAL-TIME</small></button>}
            <div className="video-corners" aria-hidden="true"><i /><i /><i /><i /></div>
          </div>
        </section>

        <div className="gallery-shell">
          <div className="gallery-main"><img key={gallery[galleryIndex].image} src={gallery[galleryIndex].image} alt={gallery[galleryIndex].label} /><div className="image-label"><span>{gallery[galleryIndex].code}</span><b>{gallery[galleryIndex].label}</b></div></div>
          <div className="gallery-thumbs">{gallery.map((item, index) => <button type="button" key={item.image} className={galleryIndex === index ? "active" : ""} onClick={() => setGalleryIndex(index)} aria-label={`查看${item.label}`}><img src={item.image} alt="" /><span>{String(index + 1).padStart(2,"0")}</span></button>)}</div>
          <div className="gallery-nav"><button type="button" onClick={() => setGalleryIndex((galleryIndex + gallery.length - 1) % gallery.length)} aria-label="上一张"><GameIcon glyph="‹" compact /></button><span>{galleryIndex + 1} / {gallery.length}</span><button type="button" onClick={() => setGalleryIndex((galleryIndex + 1) % gallery.length)} aria-label="下一张"><GameIcon glyph="›" compact /></button></div>
        </div>

        <div className="case-overview ornament-panel">
          <div><span className="mini-title">PROJECT OVERVIEW</span><h3>从资产规则到实时画面</h3><p>以风格化森林小屋为核心，完成模块资产、地形植被、材质实例、灯光与后处理的引擎整合。技术复盘进一步检查草地母材、实例参数和关卡实际引用，重点平衡薄片可读性、透明裁切、风动与远景稳定性。</p></div>
          <dl><div><dt>职责</dt><dd>建模 / 材质 / 地编 / 灯光</dd></div><div><dt>工具</dt><dd>Maya / Substance 3D / UE5</dd></div><div><dt>类型</dt><dd>个人实时场景</dd></div><div><dt>验证</dt><dd>材质审计 / 关卡引用核验</dd></div></dl>
        </div>

        <div className="feature-pair">
          <article className="image-feature"><div className="feature-frame"><img src={assetUrl("/portfolio-modular.jpg")} alt="房屋模块化资产拆分" /><span>ASSET KIT</span></div><div><small>01 / MODULAR KIT</small><h3>模块化资产系统</h3><p>补充模块尺寸、网格吸附、复用次数和命名规则，让拆分图能够证明生产意识。</p><button type="button" onClick={() => setGalleryIndex(3)}>在画廊中查看 <GameIcon glyph="›" compact /></button></div></article>
          <article className="image-feature reverse"><div className="feature-frame"><img src={assetUrl("/portfolio-materials.jpg")} alt="UE5 植被与草地材质研究展示" /><span>FOLIAGE STUDY</span></div><div><small>02 / MATERIAL</small><h3>草地材质系统</h3><p>以单面 / 双面两套 Masked 母材承接不同草片轮廓，再用实例控制纹理分支与透明强度。母材默认裁切阈值为 0.3333，当前风动保持静态，优先保证远景稳定和可控的着色成本。</p><button type="button" onClick={() => setGalleryIndex(4)}>在画廊中查看 <GameIcon glyph="›" compact /></button></div></article>
        </div>

        <section className="grass-study" aria-labelledby="grass-study-title">
          <header className="grass-study-heading">
            <div><span className="chapter-tag">TECHNICAL STUDY · VERIFIED</span><h3 id="grass-study-title">UE5 植被与<br />草地材质研究</h3></div>
            <div className="grass-study-intro"><p>通过只读脚本核对母材属性、实例覆盖和演示关卡引用，将“看起来有效”的草地拆成可复查的技术决策。下列数字来自当前项目快照；建议项与实测项分开呈现，不以估算值替代性能数据。</p><span><i /> READ-ONLY MATERIAL AUDIT</span></div>
          </header>

          <div className="grass-stat-grid" aria-label="草地材质核心参数">
            {grassStudyStats.map((stat) => <article key={stat.label}><small>{stat.label}</small><strong>{stat.value}</strong><p>{stat.note}</p></article>)}
          </div>

          <div className="grass-study-grid">
            <article className="grass-panel pipeline-panel">
              <header><span>01 / PRODUCTION LOGIC</span><h4>从母材到关卡引用</h4></header>
              <ol>{grassPipeline.map((step) => <li key={step[0]}><span>{step[0]}</span><div><b>{step[1]}</b><p>{step[2]}</p></div></li>)}</ol>
            </article>

            <article className="grass-panel tradeoff-panel">
              <header><span>02 / PERFORMANCE</span><h4>性能取舍与落地边界</h4></header>
              <div className="tradeoff-table" role="table" aria-label="草地材质性能取舍">
                <div className="tradeoff-row tradeoff-head" role="row"><span role="columnheader">决策</span><span role="columnheader">当前配置</span><span role="columnheader">取舍</span></div>
                <div className="tradeoff-row" role="row"><b role="cell">面向模式</b><span role="cell">单面 + 双面分流</span><p role="cell">单面用于密集草簇以控制成本；仅在薄片背面会进入镜头时使用双面。</p></div>
                <div className="tradeoff-row" role="row"><b role="cell">透明裁切</b><span role="cell">母材默认 · 0.3333</span><p role="cell">较低阈值保留叶尖但增加透明区域；提高阈值可减轻边缘负担，也会损失轮廓。</p></div>
                <div className="tradeoff-row" role="row"><b role="cell">风动 / WPO</b><span role="cell">静态 · 参数 0</span><p role="cell">当前母材没有 WPO 输入，避免顶点动画与远景闪烁；需要动态时只为近景英雄草接入轻量风动。</p></div>
                <div className="tradeoff-row" role="row"><b role="cell">LOD 过渡</b><span role="cell">Dither 关闭</span><p role="cell">省去抖动过渡并保持画面干净，但距离切换可能更明显；应结合 Cull Distance 做同机位复测。</p></div>
              </div>
              <aside><b>验证边界</b><p>现有日志没有记录 GPU ms、FPS、三角面或 Cull Distance，因此本案例不虚构性能数字；最终以相同镜头、分辨率和植被密度补录。</p></aside>
            </article>
          </div>

          <section className="capture-plan" aria-labelledby="capture-plan-title">
            <header><span>03 / CAPTURE PLAN</span><h4 id="capture-plan-title">建议截图位</h4><p>每张图只证明一个结论，并在发布前隐藏工程路径、用户名与无关资源名。</p></header>
            <div>{grassCapturePlan.map((shot) => <figure key={shot.no} className="capture-card"><div className="capture-slot" role="img" aria-label={`${shot.title}建议截图占位`}><span>{shot.no}</span><b>＋</b><small>CAPTURE IN UE5</small></div><figcaption><small>{shot.code}</small><b>{shot.title}</b><p>{shot.body}</p></figcaption></figure>)}</div>
          </section>
        </section>

        <div className="process-board">
          <header><span className="chapter-tag dark-tag">PROCESS LOG</span><h3>制作日志</h3><p>点击展开各阶段；截图清单已改为可直接执行的机位与信息要求。</p></header>
          <div className="process-list">
            {[
              ["01","灰盒与构图","BLOCKOUT / COMPOSITION","建议截图：俯视灰盒 / 主镜头迭代","用俯视图和前后对比说明动线、视觉焦点与建筑体块如何收敛。"],
              ["02","高低模与 UV","HIGH / LOW / UV","建议截图：线框 / UV / 密度","并列展示高低模、UV 排布、三角面数与 Texel Density，确保数值可读。"],
              ["03","烘焙与贴图","BAKE / TEXTURE","建议截图：贴图通道 / 修复前后","展示 Normal、AO、Base Color、Roughness 以及一处典型烘焙问题的修复。"],
              ["04","植被材质与优化","UE5 / PROFILING","建议截图：Lit / Complexity 同机位","记录母材 Masked 0.3333、单/双面分配、静态风动与 LOD 过渡设置；在相同镜头下补充 Shader Complexity、Quad Overdraw、GPU ms 与 FPS。"],
            ].map((item) => <details key={item[0]}><summary><span>{item[0]}</span><div><small>{item[2]}</small><b>{item[1]}</b></div><i>＋</i></summary><div className="detail-content"><div className="drop-zone"><span>{item[3]}</span><b>✦</b></div><p>{item[4]}</p></div></details>)}
          </div>
        </div>
      </section>

      <section className="props-case" id="props-project">
        <header className="section-heading"><div><span className="chapter-tag dark-tag">CHAPTER Ⅳ · PBR ASSETS</span><h2>道具图鉴</h2></div><p>点击任意资产打开详情卡。正式版为每件代表作补充技术参数和完整制作流程。</p></header>
        <div className="asset-grid">{assets.map((asset, index) => <button type="button" className={index === 0 ? "asset-card featured" : "asset-card"} key={asset.title} onClick={() => setSelectedAsset(asset)}><img src={asset.image} alt={asset.title} /><span className="asset-shade" /><div className="asset-copy"><small>{asset.type}</small><h3>{asset.title}</h3><span className="asset-enter">查看详情 <GameIcon glyph="›" compact /></span></div></button>)}</div>
        <div className="spec-ribbon"><span>ASSET SPECIFICATION</span><div><small>TRIANGLES</small><b>待补充</b></div><div><small>TEXTURE</small><b>待补充</b></div><div><small>TEXEL DENSITY</small><b>待补充</b></div><div><small>PIPELINE</small><b>HIGH → LOW → BAKE → PBR</b></div></div>
      </section>

      <section className="fit-section" id="fit">
        <header><span className="chapter-tag">CHAPTER Ⅴ · CAPABILITY</span><h2>面向游戏生产的能力</h2><p>强调 1—2 项核心专长，同时证明资源能够在引擎中正确落地并与上下游协作。</p></header>
        <div className="capability-shell">
          <div className="capability-tabs" role="tablist" aria-label="能力切换">{capabilityTabs.map((tab, index) => <button type="button" role="tab" aria-selected={activeCapability === tab.key} className={activeCapability === tab.key ? "active" : ""} key={tab.key} onClick={() => setActiveCapability(tab.key)}><span>0{index + 1}</span><b>{tab.label}</b></button>)}</div>
          <article className="capability-content" role="tabpanel"><span>{activeCap.stat}</span><h3>{activeCap.title}</h3><p>{activeCap.body}</p><div className="capability-orbit" aria-hidden="true"><i /><i /><i /><b>✦</b></div></article>
        </div>
      </section>

      <section className="about" id="about">
        <div className="about-card ornament-panel"><span className="chapter-tag dark-tag">CHAPTER Ⅵ · ABOUT</span><h2>王鑫源</h2><p className="about-role">3D ENVIRONMENT ARTIST<br />PBR · UE5 · STYLIZED WORLD</p><div className="about-meta"><span>南京林业大学 · 数字媒体艺术</span><span>日语 N2 · 英语 CET-4</span><span>酷家乐 · 唯晶科技实习经历</span></div></div>
        <div className="about-copy"><p>具备 PBR 场景资产制作与 UE5 场景整合经验，可独立推进建模、拓扑、UV、烘焙、材质、地编、灯光及后处理。希望参与重视风格化、全球化表达与长期内容生产的游戏项目。</p><div className="contact-actions"><a className="fantasy-button primary" href="mailto:270061154@qq.com"><span>发送邮件</span><GameIcon glyph="›" /></a><button className="fantasy-button light" type="button" onClick={copyEmail}><span>{copied ? "邮箱已复制" : "复制邮箱"}</span><GameIcon glyph={copied ? "✓" : "✦"} /></button></div></div>
      </section>

      <footer><div><GameIcon glyph="✦" compact /><b>王鑫源</b><small>WANG XINYUAN</small></div><p>ENVIRONMENT ART · UE5 · PBR</p><p>© 2026 PORTFOLIO</p><a href="#top">返回顶部 <GameIcon glyph="↑" compact /></a></footer>

      <button className="floating-top icon-button" type="button" onClick={() => jumpTo("top")} aria-label="返回顶部"><GameIcon glyph="↑" /></button>

      {selectedAsset && <div className="modal-backdrop" role="presentation" onMouseDown={() => setSelectedAsset(null)}><section className="asset-modal" role="dialog" aria-modal="true" aria-labelledby="asset-modal-title" onMouseDown={(e) => e.stopPropagation()}><button className="modal-close icon-button" type="button" onClick={() => setSelectedAsset(null)} aria-label="关闭详情"><GameIcon glyph="×" /></button><div className="modal-image"><img src={selectedAsset.image} alt={selectedAsset.title} /></div><div className="modal-copy"><span>{selectedAsset.type}</span><h2 id="asset-modal-title">{selectedAsset.title}</h2><p>{selectedAsset.detail}</p><dl><div><dt>TRIANGLES</dt><dd>待补充</dd></div><div><dt>TEXTURES</dt><dd>待补充</dd></div><div><dt>TOOLS</dt><dd>Maya / SP / Marmoset</dd></div></dl><button className="fantasy-button primary" type="button" onClick={() => setSelectedAsset(null)}><span>返回图鉴</span><GameIcon glyph="‹" /></button></div></section></div>}
    </main>
  );
}
