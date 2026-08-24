const {useState,useEffect,useRef,useCallback} = React;

/* ============ ASSETS ============ */
const CT_SYMBOL = "assets/img/ct-symbol.png";

/* ============ DATA ============ */
const NAV_LINKS = [
  {label:"Services", href:"#services"},
  {label:"Work", href:"#work"},
  {label:"Solutions", href:"#solutions"},
  {label:"About", href:"#about"},
  {label:"Contact", href:"#contact"},
];

const SERVICES = [
  {
    num:"01", id:"web", title:"Web Development",
    desc:"Digital experiences engineered for performance, conversion and growth — built on modern frameworks, not templates.",
    tags:["Strategy","UX/UI","Development","Performance","SEO","Analytics"],
    cta:"Build Something Exceptional"
  },
  {
    num:"02", id:"ecom", title:"E-Commerce",
    desc:"Revenue engines, not just storefronts. Commerce systems built around conversion, retention and lifetime value.",
    tags:["Store Architecture","Checkout UX","Payments","Inventory","CRO","Automation"],
    cta:"Start Selling Smarter"
  },
  {
    num:"03", id:"ads", title:"Google Ads",
    desc:"Performance campaigns focused on measurable outcomes — not impressions for their own sake.",
    tags:["Search","Shopping","Performance Max","Remarketing","Landing Pages","ROAS"],
    cta:"Launch a Campaign"
  },
  {
    num:"04", id:"seo", title:"SEO",
    desc:"Technical, structural and content systems built to move you from invisible to unavoidable.",
    tags:["Technical SEO","Content","Authority","Core Web Vitals","Local SEO","Reporting"],
    cta:"Improve Your Visibility"
  },
  {
    num:"05", id:"brand", title:"Brand Identity",
    desc:"Full identity systems — logo, type, color, voice — built to make your business look as good as it performs.",
    tags:["Logo Systems","Typography","Guidelines","Social Identity","Packaging","Voice"],
    cta:"Build Your Identity"
  },
  {
    num:"06", id:"uiux", title:"UI/UX Design",
    desc:"Interfaces designed around real user behaviour — clear, fast, and built to convert.",
    tags:["Wireframes","Prototyping","Design Systems","User Testing","Accessibility","Handoff"],
    cta:"Design Your Product"
  },
  {
    num:"07", id:"systems", title:"Digital Systems",
    desc:"Custom business systems and web applications that replace manual work with software.",
    tags:["Web Apps","Dashboards","Integrations","Automation","APIs","Internal Tools"],
    cta:"Build Your System"
  },
  {
    num:"08", id:"custom", title:"Custom Solutions",
    desc:"When the problem doesn't fit a category, we build the thing that solves it.",
    tags:["Discovery","Architecture","Engineering","Testing","Deployment","Support"],
    cta:"Talk Through Your Problem"
  },
];

const CASES = [
  {num:"01", industry:"Hospitality", title:"Coffee & Rental Platform", desc:"A booking-first digital presence for a hospitality rental brand, rebuilt around discovery and conversion.", stats:[["+64%","Map Visibility"],["+41%","Booking Rate"]], color:"#a5c71a"},
  {num:"02", industry:"Retail", title:"Furniture Resale Rebrand", desc:"A full identity system for a used-furniture buying brand — from wordmark to social presence.", stats:[["3","Brand Systems"],["1","Unified Voice"]], color:"#e8e8e8"},
  {num:"03", industry:"F&B", title:"Cabra Bean Visual Identity", desc:"Visual content and brand direction for an independent café brand, built for a crowded feed.", stats:[["+2.1x","Engagement"],["12","Content Pillars"]], color:"#a5c71a"},
  {num:"04", industry:"Technology", title:"Cabra Technology Platform", desc:"The self-referential build: our own agency identity, systemized across every surface.", stats:[["100%","In-House"],["∞","Iteration"]], color:"#e8e8e8"},
];

const WHY = [
  {i:"01", t:"Strategy Before Execution", d:"We don't open a design tool until we understand what the business actually needs to move."},
  {i:"02", t:"Design With Purpose", d:"Every visual decision is tied to a business outcome — nothing is decoration for its own sake."},
  {i:"03", t:"Technology With Performance", d:"Fast, accessible, technically sound. Beautiful and broken is not an option."},
  {i:"04", t:"Marketing With Measurable Outcomes", d:"If we can't measure it, we don't call it growth. Every campaign reports to a number."},
  {i:"05", t:"Long-Term Thinking", d:"We build systems that compound — brand, product and growth working as one machine."},
];

const STACK = ["Next.js","React","TypeScript","Node.js","Cloud Infra","Analytics","SEO Systems","APIs","Automation"];

const RESULTS = [
  {n:120,suffix:"+",label:"Digital Projects Delivered"},
  {n:35,suffix:"+",label:"Brands Built"},
  {n:60,suffix:"+",label:"Campaigns Managed"},
  {n:98,suffix:"%",label:"Client Retention"},
];

const NEEDS = ["Website","E-Commerce","Google Ads","SEO","Branding","Corporate Profile","Web Application","Custom System","Something Else"];
const BUDGETS = ["Under $2,000","$2,000 – $5,000","$5,000 – $15,000","$15,000+","Not Sure Yet"];

/* ============ HOOKS ============ */
function useReveal(){
  const ref = useRef(null);
  useEffect(()=>{
    const el = ref.current;
    if(!el) return;
    const obs = new IntersectionObserver(([entry])=>{
      if(entry.isIntersecting){ el.classList.add('in'); obs.unobserve(el); }
    },{threshold:0.15});
    obs.observe(el);
    return ()=>obs.disconnect();
  },[]);
  return ref;
}

function Reveal({children, className="", as:Tag="div", delay=0, style={}}){
  const ref = useReveal();
  return <Tag ref={ref} className={`reveal ${className}`} style={{transitionDelay:`${delay}ms`, ...style}}>{children}</Tag>;
}

function RevealMask({children, className="", as:Tag="div", delay=0}){
  const ref = useReveal();
  return <Tag ref={ref} className={`reveal-mask ${className}`}>
    <span style={{transitionDelay:`${delay}ms`}}>{children}</span>
  </Tag>;
}

/* ============ CUSTOM CURSOR ============ */
function CustomCursor(){
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const pos = useRef({x:0,y:0});
  const ring = useRef({x:0,y:0});

  useEffect(()=>{
    if(window.matchMedia('(max-width: 900px)').matches) return;
    const move = e=>{
      pos.current = {x:e.clientX, y:e.clientY};
      if(dotRef.current){
        dotRef.current.style.left = e.clientX+'px';
        dotRef.current.style.top = e.clientY+'px';
      }
    };
    window.addEventListener('mousemove', move);

    let raf;
    const loop = ()=>{
      ring.current.x += (pos.current.x - ring.current.x)*0.18;
      ring.current.y += (pos.current.y - ring.current.y)*0.18;
      if(ringRef.current){
        ringRef.current.style.left = ring.current.x+'px';
        ringRef.current.style.top = ring.current.y+'px';
      }
      raf = requestAnimationFrame(loop);
    };
    loop();

    const onOver = e=>{
      const target = e.target.closest('[data-cursor]');
      if(target && ringRef.current && dotRef.current){
        const mode = target.getAttribute('data-cursor');
        ringRef.current.style.opacity = '1';
        if(mode==='view'){ ringRef.current.style.width='64px'; ringRef.current.style.height='64px'; ringRef.current.textContent='VIEW'; }
        else if(mode==='open'){ ringRef.current.style.width='64px'; ringRef.current.style.height='64px'; ringRef.current.textContent='OPEN'; }
        else { ringRef.current.style.width='56px'; ringRef.current.style.height='56px'; ringRef.current.textContent=''; }
        dotRef.current.style.width='0px'; dotRef.current.style.height='0px';
      }
    };
    const onOut = e=>{
      const target = e.target.closest('[data-cursor]');
      if(target && ringRef.current && dotRef.current){
        ringRef.current.style.opacity='0';
        dotRef.current.style.width='8px'; dotRef.current.style.height='8px';
      }
    };
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);

    return ()=>{
      window.removeEventListener('mousemove', move);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      cancelAnimationFrame(raf);
    };
  },[]);

  return <>
    <div className="cursor-dot" ref={dotRef}></div>
    <div className="cursor-ring" ref={ringRef}></div>
  </>;
}

/* ============ MAGNETIC BUTTON ============ */
function Magnetic({children, className="", as:Tag="button", ...props}){
  const ref = useRef(null);
  useEffect(()=>{
    const el = ref.current;
    if(!el || window.matchMedia('(max-width: 900px)').matches) return;
    const onMove = e=>{
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left - r.width/2;
      const y = e.clientY - r.top - r.height/2;
      el.style.transform = `translate(${x*0.25}px, ${y*0.25}px)`;
    };
    const onLeave = ()=>{ el.style.transform = 'translate(0,0)'; };
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return ()=>{ el.removeEventListener('mousemove', onMove); el.removeEventListener('mouseleave', onLeave); };
  },[]);
  return <Tag ref={ref} className={`magnetic ${className}`} {...props}>{children}</Tag>;
}

/* ============ SCROLL PROGRESS ============ */
function ScrollProgress(){
  const ref = useRef(null);
  useEffect(()=>{
    const onScroll = ()=>{
      const h = document.documentElement;
      const pct = (h.scrollTop)/(h.scrollHeight - h.clientHeight)*100;
      if(ref.current) ref.current.style.width = pct+'%';
    };
    window.addEventListener('scroll', onScroll, {passive:true});
    return ()=>window.removeEventListener('scroll', onScroll);
  },[]);
  return <div className="scroll-progress" ref={ref}></div>;
}

/* ============ NAV ============ */
function Nav({lang, setLang, t}){
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(()=>{
    const onScroll = ()=> setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, {passive:true});
    return ()=>window.removeEventListener('scroll', onScroll);
  },[]);

  useEffect(()=>{
    document.body.style.overflow = menuOpen ? 'hidden' : '';
  },[menuOpen]);

  return <>
    <nav className={`nav ${scrolled?'scrolled':''}`}>
      <a href="#top" className="nav-logo" data-cursor="default">
        <svg width="26" height="14" viewBox="0 0 792 365" aria-hidden="true"><image href={CT_SYMBOL} width="792" height="365"/></svg>
        CABRA
      </a>
      <ul className="nav-links">
        {NAV_LINKS.map(l=> <li key={l.href}><a className="nav-link" href={l.href} data-cursor="default">{t.nav[l.label]}</a></li>)}
      </ul>
      <div style={{display:'flex',alignItems:'center',gap:18}}>
        <div className="lang-toggle">
          <button className={lang==='en'?'active':''} onClick={()=>setLang('en')}>EN</button>
          <span style={{color:'var(--grey-dim)'}}>/</span>
          <button className={lang==='ar'?'active':''} onClick={()=>setLang('ar')}>AR</button>
        </div>
        <Magnetic as="a" href="#contact" className="nav-cta desktop-only" data-cursor="open">
          {t.nav.cta} <span>↗</span>
        </Magnetic>
        <button className="nav-burger" onClick={()=>setMenuOpen(true)} aria-label="Open menu">
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>

    <div className={`mobile-menu ${menuOpen?'open':''}`}>
      <button className="mobile-menu-close" onClick={()=>setMenuOpen(false)} aria-label="Close menu">✕</button>
      {NAV_LINKS.map(l=> <a key={l.href} href={l.href} onClick={()=>setMenuOpen(false)}>{t.nav[l.label]}</a>)}
      <a href="#contact" onClick={()=>setMenuOpen(false)} style={{color:'var(--lime)'}}>{t.nav.cta}</a>
    </div>
  </>;
}
/* ============ HERO CANVAS — reactive triangle field ============ */
function HeroCanvas(){
  const canvasRef = useRef(null);

  useEffect(()=>{
    const canvas = canvasRef.current;
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    let w,h,dpr;
    let mouse = {x:-9999,y:-9999};
    let particles = [];
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function resize(){
      dpr = Math.min(window.devicePixelRatio||1, 2);
      w = canvas.offsetWidth; h = canvas.offsetHeight;
      canvas.width = w*dpr; canvas.height = h*dpr;
      ctx.setTransform(dpr,0,0,dpr,0,0);
      const count = Math.min(70, Math.floor((w*h)/22000));
      particles = Array.from({length:count}, ()=>({
        x: Math.random()*w,
        y: Math.random()*h,
        baseX: 0, baseY:0,
        vx:(Math.random()-0.5)*0.15,
        vy:(Math.random()-0.5)*0.15,
        size: 3+Math.random()*5,
        depth: 0.3+Math.random()*0.7,
      }));
      particles.forEach(p=>{p.baseX=p.x;p.baseY=p.y;});
    }
    resize();
    window.addEventListener('resize', resize);

    const onMove = e=>{
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const onLeave = ()=>{ mouse.x=-9999; mouse.y=-9999; };
    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseleave', onLeave);

    function drawTriangle(x,y,size,alpha,rotation){
      ctx.save();
      ctx.translate(x,y);
      ctx.rotate(rotation);
      ctx.beginPath();
      ctx.moveTo(0,-size);
      ctx.lineTo(size*0.87, size*0.6);
      ctx.lineTo(-size*0.87, size*0.6);
      ctx.closePath();
      ctx.fillStyle = `rgba(165,199,26,${alpha})`;
      ctx.fill();
      ctx.restore();
    }

    let raf;
    let t = 0;
    function tick(){
      t += reduceMotion ? 0 : 0.004;
      ctx.clearRect(0,0,w,h);

      // connective lines
      for(let i=0;i<particles.length;i++){
        const p = particles[i];
        const dx = mouse.x - p.x, dy = mouse.y - p.y;
        const dist = Math.sqrt(dx*dx+dy*dy);
        if(dist < 160){
          const force = (1 - dist/160) * 26;
          const ang = Math.atan2(dy,dx);
          p.x -= Math.cos(ang)*force*0.06;
          p.y -= Math.sin(ang)*force*0.06;
        }
        // drift back
        p.x += (p.baseX - p.x)*0.012 + p.vx;
        p.y += (p.baseY - p.y)*0.012 + p.vy;
        if(!reduceMotion){
          p.baseX += Math.sin(t + i)*0.15;
        }
      }
      // lines between near particles
      ctx.lineWidth = 1;
      for(let i=0;i<particles.length;i++){
        for(let j=i+1;j<particles.length;j++){
          const a = particles[i], b = particles[j];
          const dx=a.x-b.x, dy=a.y-b.y;
          const d = Math.sqrt(dx*dx+dy*dy);
          if(d < 120){
            ctx.strokeStyle = `rgba(255,255,255,${0.05*(1-d/120)})`;
            ctx.beginPath();
            ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y);
            ctx.stroke();
          }
        }
      }
      particles.forEach((p,i)=>{
        const dx = mouse.x - p.x, dy = mouse.y - p.y;
        const dist = Math.sqrt(dx*dx+dy*dy);
        const near = dist < 160;
        drawTriangle(p.x, p.y, p.size*(near?1.4:1), near? 0.9 : 0.22*p.depth, t*0.5+i);
      });

      raf = requestAnimationFrame(tick);
    }
    tick();

    return ()=>{
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('mouseleave', onLeave);
    };
  },[]);

  return <canvas id="heroCanvas" ref={canvasRef}></canvas>;
}

/* ============ HERO ============ */
function Hero({t}){
  return (
    <section className="hero" id="top">
      <div className="hero-grid-bg"></div>
      <HeroCanvas/>
      <div className="wrap hero-inner">
        <div className="hero-kicker"><span className="dot"></span>{t.hero.kicker}</div>
        <h1 className="display-xl">
          {t.hero.lines.map((line,i)=>(
            <div className="line" key={i}>
              <RevealMask delay={i*90} as="div">
                {line.map((word,wi)=> word.accent
                  ? <em className="accent" key={wi} style={{marginInlineEnd:'0.28em',fontStyle:'normal'}}>{word.text}</em>
                  : <span key={wi} style={{marginInlineEnd:'0.28em'}}>{word.text}</span>
                )}
              </RevealMask>
            </div>
          ))}
        </h1>
        <div className="hero-sub">
          <Reveal delay={500} className="hero-desc">
            <p className="lead">{t.hero.desc}</p>
          </Reveal>
          <Reveal delay={600} className="hero-actions">
            <Magnetic as="a" href="#contact" className="btn btn-primary" data-cursor="open">
              {t.hero.cta1} <span className="arrow">↗</span>
            </Magnetic>
            <Magnetic as="a" href="#work" className="btn btn-ghost" data-cursor="view">
              {t.hero.cta2}
            </Magnetic>
          </Reveal>
        </div>
      </div>
      <div className="hero-scroll">
        <span>{t.hero.scroll}</span>
        <div className="hero-scroll-line"></div>
      </div>
    </section>
  );
}

/* ============ MARQUEE ============ */
function Marquee({items}){
  const doubled = [...items, ...items];
  return (
    <div className="marquee-wrap">
      <div className="marquee-track">
        {doubled.map((item,i)=>(
          <div className="marquee-item" key={i}>
            {item}<span className="tri-sep"></span>
          </div>
        ))}
      </div>
    </div>
  );
}
/* ============ INTRO / POSITIONING ============ */
function Intro({t}){
  return (
    <section className="section-pad hairline">
      <div className="wrap intro-grid">
        <Reveal>
          <div className="eyebrow"><span className="tri"></span>{t.intro.eyebrow}</div>
          <h2 className="display-l">{t.intro.title}</h2>
        </Reveal>
        <Reveal delay={150}>
          <p className="lead" style={{marginBottom:28}}>{t.intro.body}</p>
        </Reveal>
      </div>
    </section>
  );
}

/* ============ SERVICES EXPLORER ============ */
function ServicesExplorer({t}){
  const [active, setActive] = useState(0);
  const s = SERVICES[active];
  const st = t.servicesData[active];

  return (
    <section className="section-pad hairline" id="services">
      <div className="wrap">
        <div className="section-head">
          <Reveal>
            <div className="eyebrow"><span className="tri"></span>{t.services.eyebrow}</div>
            <h2 className="display-l">{t.services.title}</h2>
          </Reveal>
        </div>

        <div className="services-explorer">
          <div>
            {SERVICES.map((s2,i)=>(
              <div
                key={s2.id}
                className={`service-row ${active===i?'active':''}`}
                onMouseEnter={()=>setActive(i)}
                onClick={()=>setActive(i)}
                data-cursor="default"
              >
                <span className="service-num">{s2.num}</span>
                <span className="service-title">{t.servicesData[i].title}</span>
              </div>
            ))}
          </div>
          <div className="service-detail">
            <div className="service-detail-panel active">
              <div className="eyebrow" style={{marginBottom:16}}><span className="tri"></span>{s.num}</div>
              <h3 className="display-m" style={{marginBottom:18}}>{st.title}</h3>
              <p className="body-text" style={{maxWidth:'46ch'}}>{st.desc}</p>
              <div className="service-tags">
                {st.tags.map((tag,i)=> <span className="service-tag" key={i}>{tag}</span>)}
              </div>
              <Magnetic as="a" href="#contact" className="btn btn-primary" data-cursor="open">
                {st.cta} <span className="arrow">↗</span>
              </Magnetic>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============ ANIMATED COUNTER ============ */
function useCountUp(target, active, duration=1400){
  const [val, setVal] = useState(0);
  useEffect(()=>{
    if(!active) return;
    let start=null;
    const step = ts=>{
      if(!start) start=ts;
      const progress = Math.min((ts-start)/duration, 1);
      const eased = 1 - Math.pow(1-progress, 3);
      setVal(Math.floor(eased*target));
      if(progress<1) requestAnimationFrame(step);
      else setVal(target);
    };
    requestAnimationFrame(step);
  },[active]);
  return val;
}

function MiniBarChart(){
  const bars = [40,55,48,70,62,80,75,92,85,100,96,110];
  return (
    <svg viewBox="0 0 340 110" width="100%" height="100%" preserveAspectRatio="none" aria-hidden="true">
      <polyline
        points={bars.map((b,i)=>`${i*(340/(bars.length-1))},${110-b*0.9}`).join(' ')}
        fill="none" stroke="#a5c71a" strokeWidth="2"
      />
      {bars.map((b,i)=>(
        <circle key={i} cx={i*(340/(bars.length-1))} cy={110-b*0.9} r="2.5" fill="#a5c71a"/>
      ))}
    </svg>
  );
}

/* ============ ADS DASHBOARD ============ */
function AdsSection({t}){
  const ref = useReveal();
  const [visible, setVisible] = useState(false);
  useEffect(()=>{
    const el = ref.current;
    if(!el) return;
    const obs = new IntersectionObserver(([e])=>{ if(e.isIntersecting) setVisible(true); },{threshold:0.3});
    obs.observe(el);
    return ()=>obs.disconnect();
  },[]);

  const impressions = useCountUp(482600, visible);
  const ctr = useCountUp(68, visible);
  const roas = useCountUp(46, visible);

  return (
    <section className="section-pad hairline">
      <div className="wrap intro-grid" ref={ref} style={{alignItems:'center'}}>
        <Reveal>
          <div className="eyebrow"><span className="tri"></span>{t.ads.eyebrow}</div>
          <h2 className="display-l" style={{marginBottom:24}}>{t.ads.title}</h2>
          <p className="lead" style={{marginBottom:32}}>{t.ads.body}</p>
          <Magnetic as="a" href="#contact" className="btn btn-ghost" data-cursor="open">
            {t.ads.cta} <span className="arrow">↗</span>
          </Magnetic>
        </Reveal>

        <Reveal delay={150}>
          <div className="dash">
            <div className="dash-head">
              <span className="dash-label">{t.ads.dashLabel}</span>
              <div className="dash-live"><span className="dot"></span>{t.ads.live}</div>
            </div>
            <div className="dash-metrics">
              <div className="dash-metric">
                <div className="m-label">{t.ads.m1}</div>
                <div className="m-value">{impressions.toLocaleString()}</div>
                <div className="m-delta">↑ 24.6%</div>
              </div>
              <div className="dash-metric">
                <div className="m-label">{t.ads.m2}</div>
                <div className="m-value">{(ctr/10).toFixed(1)}%</div>
                <div className="m-delta">↑ 12.1%</div>
              </div>
              <div className="dash-metric">
                <div className="m-label">{t.ads.m3}</div>
                <div className="m-value">{(roas/10).toFixed(1)}x</div>
                <div className="m-delta">↑ 31.8%</div>
              </div>
            </div>
            <div className="dash-chart"><MiniBarChart/></div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ============ SEO SERP VISUAL ============ */
function SeoSection({t}){
  const ref = useReveal();
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState(7);
  useEffect(()=>{
    const el = ref.current;
    if(!el) return;
    const obs = new IntersectionObserver(([e])=>{ if(e.isIntersecting) setVisible(true); },{threshold:0.3});
    obs.observe(el);
    return ()=>obs.disconnect();
  },[]);
  useEffect(()=>{
    if(!visible) return;
    const seq = [7,6,5,4,3,2,1];
    let i=0;
    const iv = setInterval(()=>{
      i++;
      if(i<seq.length){ setPos(seq[i]); } else clearInterval(iv);
    }, 380);
    return ()=>clearInterval(iv);
  },[visible]);

  return (
    <section className="section-pad hairline">
      <div className="wrap intro-grid" ref={ref} style={{alignItems:'center'}}>
        <Reveal>
          <div className="serp">
            {[1,2,3].map(n=>(
              <div className={`serp-row ${pos===n?'you':''}`} key={n}>
                <span className="serp-pos">{String(n).padStart(2,'0')}</span>
                <div>
                  <div className="serp-site">{pos===n ? t.seo.yoursite : `competitor-${n}.com`}</div>
                  <div className="serp-title">{pos===n ? t.seo.yourtitle : t.seo.competitorTitles[n-1]}</div>
                </div>
                <span className="serp-badge">{pos===n ? t.seo.you : ''}</span>
              </div>
            ))}
          </div>
        </Reveal>
        <Reveal delay={100}>
          <div className="eyebrow"><span className="tri"></span>{t.seo.eyebrow}</div>
          <h2 className="display-l" style={{marginBottom:24}}>{t.seo.title}</h2>
          <p className="lead" style={{marginBottom:32}}>{t.seo.body}</p>
          <div className="service-tags" style={{marginBottom:32}}>
            {t.seo.tags.map((tag,i)=><span className="service-tag" key={i}>{tag}</span>)}
          </div>
          <Magnetic as="a" href="#contact" className="btn btn-ghost" data-cursor="open">
            {t.seo.cta} <span className="arrow">↗</span>
          </Magnetic>
        </Reveal>
      </div>
    </section>
  );
}
/* ============ BRAND IDENTITY MOSAIC ============ */
function BrandSection({t}){
  return (
    <section className="section-pad hairline" id="solutions">
      <div className="wrap intro-grid" style={{alignItems:'center'}}>
        <Reveal>
          <div className="eyebrow"><span className="tri"></span>{t.brand.eyebrow}</div>
          <h2 className="display-l" style={{marginBottom:24}}>{t.brand.title}</h2>
          <p className="lead" style={{marginBottom:32}}>{t.brand.body}</p>
          <Magnetic as="a" href="#contact" className="btn btn-ghost" data-cursor="open">
            {t.brand.cta} <span className="arrow">↗</span>
          </Magnetic>
        </Reveal>
        <Reveal delay={150}>
          <div className="brand-mosaic">
            <div className="mosaic-tile mosaic-lime" style={{gridColumn:'span 2', gridRow:'span 2'}}>
              <span style={{fontFamily:'var(--display)',fontWeight:700,fontSize:15,color:'#050505'}}>LOGO</span>
            </div>
            <div className="mosaic-tile mosaic-black" style={{gridColumn:'span 2'}}>
              <span style={{fontFamily:'var(--mono)',fontSize:11,color:'var(--grey)',letterSpacing:'.06em'}}>TYPE</span>
            </div>
            <div className="mosaic-tile" style={{gridColumn:'span 2'}}>
              <span style={{fontFamily:'var(--mono)',fontSize:11,color:'var(--grey)',letterSpacing:'.06em'}}>COLOR</span>
            </div>
            <div className="mosaic-tile mosaic-white">
              <span style={{fontFamily:'var(--mono)',fontSize:10,color:'#050505',letterSpacing:'.04em'}}>SOCIAL</span>
            </div>
            <div className="mosaic-tile">
              <span style={{fontFamily:'var(--mono)',fontSize:10,color:'var(--grey)',letterSpacing:'.04em'}}>PROFILE</span>
            </div>
            <div className="mosaic-tile" style={{gridColumn:'span 2'}}>
              <span style={{fontFamily:'var(--mono)',fontSize:10,color:'var(--grey)',letterSpacing:'.04em'}}>GUIDELINES</span>
            </div>
            <div className="mosaic-tile mosaic-black" style={{gridColumn:'span 2'}}>
              <span style={{fontFamily:'var(--mono)',fontSize:10,color:'var(--grey)',letterSpacing:'.04em'}}>PACKAGING</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ============ RESULTS ============ */
function ResultCell({r, active}){
  const val = useCountUp(r.n, active, 1600);
  return (
    <div className="result-cell">
      <div className="result-num">{val}<span className="plus">{r.suffix}</span></div>
      <div className="result-label">{r.label}</div>
    </div>
  );
}

function ResultsSection({t}){
  const ref = useReveal();
  const [visible, setVisible] = useState(false);
  useEffect(()=>{
    const el = ref.current;
    if(!el) return;
    const obs = new IntersectionObserver(([e])=>{ if(e.isIntersecting) setVisible(true); },{threshold:0.3});
    obs.observe(el);
    return ()=>obs.disconnect();
  },[]);
  return (
    <section className="section-pad" style={{paddingTop:80,paddingBottom:80}}>
      <div className="wrap" ref={ref}>
        <div className="results-grid">
          {RESULTS.map((r,i)=>(
            <ResultCell key={i} r={{...r,label:t.results[i]}} active={visible}/>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ CASE STUDIES ============ */
function CasesSection({t}){
  return (
    <section className="section-pad hairline" id="work">
      <div className="wrap">
        <div className="section-head">
          <Reveal>
            <div className="eyebrow"><span className="tri"></span>{t.cases.eyebrow}</div>
            <h2 className="display-l">{t.cases.title}</h2>
          </Reveal>
          <Reveal delay={150}>
            <p className="lead">{t.cases.sub}</p>
          </Reveal>
        </div>
      </div>
      <Reveal delay={200}>
        <div className="cases-viewport">
          <div className="cases-track">
            {CASES.map((c,i)=>(
              <div className="case-card" key={i} data-cursor="view">
                <div className="case-visual" style={{background: i%2===0
                  ? 'linear-gradient(135deg, #111 0%, #0a0a0a 60%, rgba(165,199,26,0.15) 100%)'
                  : 'linear-gradient(135deg, #131313 0%, #0a0a0a 100%)'}}>
                  <span className="case-num">{c.num}</span>
                  <span className="case-view">{t.cases.view} ↗</span>
                  <svg width="90" height="90" viewBox="0 0 100 100" style={{position:'absolute',right:20,bottom:20,opacity:0.5}} aria-hidden="true">
                    <polygon points="50,15 85,80 15,80" fill="none" stroke={c.color} strokeWidth="1.5"/>
                  </svg>
                </div>
                <div className="case-body">
                  <div className="case-industry">{t.cases.industries[i]}</div>
                  <div className="case-title">{t.cases.titles[i]}</div>
                  <div className="case-desc">{t.cases.descs[i]}</div>
                  <div className="case-stats">
                    {c.stats.map((s,si)=>(
                      <div className="case-stat" key={si}><b>{s[0]}</b><span>{t.cases.statLabels[i][si]}</span></div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
/* ============ WHY CABRA ============ */
function WhySection({t}){
  return (
    <section className="section-pad hairline">
      <div className="wrap">
        <Reveal>
          <div className="eyebrow"><span className="tri"></span>{t.why.eyebrow}</div>
          <h2 className="display-l" style={{marginBottom:10}}>{t.why.title}</h2>
        </Reveal>
        <div className="why-list" style={{marginTop:60}}>
          {WHY.map((w,i)=>(
            <Reveal key={i} delay={i*70}>
              <div className="why-item">
                <span className="why-index">{w.i}</span>
                <span className="why-title">{t.whyData[i].t}</span>
                <span className="why-desc">{t.whyData[i].d}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ TECH STACK ORBIT ============ */
function StackSection({t}){
  const positions = STACK.map((_,i)=>{
    const angle = (i/STACK.length)*Math.PI*2 - Math.PI/2;
    const radius = i%2===0 ? 190 : 150;
    return {
      x: Math.cos(angle)*radius,
      y: Math.sin(angle)*radius*0.62,
    };
  });
  return (
    <section className="section-pad hairline">
      <div className="wrap">
        <div className="section-head">
          <Reveal>
            <div className="eyebrow"><span className="tri"></span>{t.stack.eyebrow}</div>
            <h2 className="display-l">{t.stack.title}</h2>
          </Reveal>
          <Reveal delay={150}><p className="lead">{t.stack.sub}</p></Reveal>
        </div>
        <Reveal delay={200}>
          <div className="stack-orbit">
            <div className="stack-ring" style={{width:380,height:236,borderRadius:'50%'}}></div>
            <div className="stack-ring" style={{width:280,height:174,borderRadius:'50%'}}></div>
            <div className="stack-center">CABRA<br/>OS</div>
            {STACK.map((s,i)=>(
              <div className="stack-node" key={s} style={{
                left:`calc(50% + ${positions[i].x}px)`,
                top:`calc(50% + ${positions[i].y}px)`,
                transform:'translate(-50%,-50%)'
              }}>{s}</div>
            ))}
          </div>
          <div className="stack-list-mobile">
            {STACK.map(s=> <span key={s}>{s}</span>)}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ============ ABOUT ============ */
function AboutSection({t}){
  return (
    <section className="section-pad hairline" id="about">
      <div className="wrap">
        <Reveal>
          <div className="eyebrow"><span className="tri"></span>{t.about.eyebrow}</div>
        </Reveal>
        <Reveal delay={100}>
          <p className="about-words">{t.about.words}</p>
        </Reveal>
      </div>
    </section>
  );
}
/* ============ PROJECT CONFIGURATOR / CONTACT ============ */
function ContactSection({t}){
  const [needs, setNeeds] = useState([]);
  const [budget, setBudget] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({name:'',company:'',email:'',phone:'',details:''});

  const toggleNeed = (n)=>{
    setNeeds(prev => prev.includes(n) ? prev.filter(x=>x!==n) : [...prev, n]);
  };

  const onSubmit = (e)=>{
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="section-pad hairline" id="contact">
      <div className="wrap">
        <div className="section-head">
          <Reveal>
            <div className="eyebrow"><span className="tri"></span>{t.contact.eyebrow}</div>
            <h2 className="display-l">{t.contact.title}</h2>
          </Reveal>
        </div>

        <Reveal delay={150}>
          <div className="configurator">
            {!submitted ? (
              <form onSubmit={onSubmit}>
                <div className="config-step-label">{t.contact.step1}</div>
                <div className="chip-grid" style={{marginBottom:44}}>
                  {t.contact.needs.map((n,i)=>(
                    <button type="button" key={i} className={`chip ${needs.includes(i)?'selected':''}`}
                      onClick={()=>toggleNeed(i)} data-cursor="default">{n}</button>
                  ))}
                </div>

                <div className="config-step-label">{t.contact.step2}</div>
                <div className="chip-grid" style={{marginBottom:44}}>
                  {t.contact.budgets.map((b,i)=>(
                    <button type="button" key={i} className={`chip ${budget===i?'selected':''}`}
                      onClick={()=>setBudget(i)} data-cursor="default">{b}</button>
                  ))}
                </div>

                <div className="config-step-label">{t.contact.step3}</div>
                <div className="field" style={{marginBottom:30}}>
                  <textarea placeholder={t.contact.detailsPlaceholder} value={form.details}
                    onChange={e=>setForm({...form, details:e.target.value})}></textarea>
                </div>

                <div className="field-row">
                  <div className="field">
                    <label>{t.contact.name}</label>
                    <input type="text" required value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
                  </div>
                  <div className="field">
                    <label>{t.contact.company}</label>
                    <input type="text" value={form.company} onChange={e=>setForm({...form,company:e.target.value})}/>
                  </div>
                </div>
                <div className="field-row">
                  <div className="field">
                    <label>{t.contact.email}</label>
                    <input type="email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
                  </div>
                  <div className="field">
                    <label>{t.contact.phone}</label>
                    <input type="tel" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/>
                  </div>
                </div>

                <div className="config-summary">
                  <div className="config-summary-text">
                    {needs.length>0 || budget!==null ? (
                      <>{t.contact.summaryPrefix} <b>{needs.map(i=>t.contact.needs[i]).join(', ') || t.contact.summaryFallback}</b>
                      {budget!==null && <> — <b>{t.contact.budgets[budget]}</b></>}. {t.contact.summarySuffix}</>
                    ) : t.contact.summaryEmpty}
                  </div>
                  <Magnetic as="button" type="submit" className="btn btn-primary" data-cursor="open">
                    {t.contact.submit} <span className="arrow">↗</span>
                  </Magnetic>
                </div>
              </form>
            ) : (
              <div style={{textAlign:'center',padding:'40px 0'}}>
                <div className="eyebrow" style={{justifyContent:'center'}}><span className="tri"></span>{t.contact.successEyebrow}</div>
                <h3 className="display-m">{t.contact.successTitle}</h3>
                <p className="body-text" style={{marginTop:14}}>{t.contact.successBody}</p>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ============ FOOTER ============ */
function Footer({t}){
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-cta">
          <Reveal>
            <h2 className="display-xl" style={{fontSize:'clamp(40px,7vw,96px)'}}>{t.footer.line1}</h2>
            <h2 className="display-xl" style={{fontSize:'clamp(40px,7vw,96px)',color:'var(--lime)'}}>{t.footer.line2}</h2>
          </Reveal>
        </div>

        <div className="footer-grid">
          <div className="footer-col">
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:16,fontFamily:'var(--display)',fontWeight:700,fontSize:20}}>
              <svg width="28" height="15" viewBox="0 0 792 365" aria-hidden="true"><image href={CT_SYMBOL} width="792" height="365"/></svg>
              CABRA
            </div>
            <p className="body-text" style={{maxWidth:'32ch'}}>{t.footer.tagline}</p>
          </div>
          <div className="footer-col">
            <h4>{t.footer.h1}</h4>
            {SERVICES.slice(0,5).map((s,i)=><a href="#services" key={i}>{t.servicesData[i].title}</a>)}
          </div>
          <div className="footer-col">
            <h4>{t.footer.h2}</h4>
            <a href="#work">{t.footer.work}</a>
            <a href="#about">{t.footer.about}</a>
            <a href="#contact">{t.footer.contact}</a>
          </div>
          <div className="footer-col">
            <h4>{t.footer.h3}</h4>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href="mailto:hello@cabra.tech">hello@cabra.tech</a>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 CABRA TECHNOLOGY</span>
          <div className="footer-status"><span className="dot"></span>
            <span>{t.footer.status}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
/* ============ TRANSLATIONS ============ */
const T = {
  en: {
    nav:{ "Services":"Services","Work":"Work","Solutions":"Solutions","About":"About","Contact":"Contact", cta:"Start a Project" },
    hero:{
      kicker:"Digital Systems Studio",
      lines:[
        [{text:"We build"}],
        [{text:"digital"},{text:"systems"}],
        [{text:"that"},{text:"move",accent:true}],
        [{text:"business."}],
      ],
      desc:"CABRA TECHNOLOGY creates digital products, brands and growth systems designed to help ambitious businesses compete in a digital-first world.",
      cta1:"Start a Project", cta2:"Explore Our Work",
      scroll:"Scroll"
    },
    marquee:["WEB","BRAND","GROWTH","TECHNOLOGY","PERFORMANCE","DIGITAL"],
    intro:{
      eyebrow:"Positioning",
      title:"Digital technology built for growth.",
      body:"We don't build websites for the sake of having one. Every product we ship is engineered around a business outcome — traffic that converts, brands that are remembered, systems that save time. Design, technology and growth, working as one machine."
    },
    services:{ eyebrow:"Capabilities", title:"What we build." },
    servicesData: SERVICES.map(s=>({title:s.title, desc:s.desc, tags:s.tags, cta:s.cta})),
    ads:{
      eyebrow:"Performance Marketing", title:"Traffic isn't the goal. Growth is.",
      body:"We build Google Ads campaigns focused on measurable outcomes — not impressions for their own sake. Every campaign is structured around a number you actually care about.",
      cta:"Launch a Campaign",
      dashLabel:"Campaign Performance", live:"Live",
      m1:"Impressions", m2:"CTR", m3:"ROAS"
    },
    seo:{
      eyebrow:"Search Visibility", title:"Be found. Then be chosen.",
      body:"Technical SEO, content architecture and authority building — engineered to move you from page seven to page one, and from page one to the first click.",
      tags:["Technical SEO","Content","Authority","Core Web Vitals","Search Visibility","Conversions"],
      cta:"Improve Your Visibility",
      yoursite:"yourbrand.com", yourtitle:"Your business — ranking where it should",
      you:"You",
      competitorTitles:["Competitor listing","Directory result","Competitor listing"]
    },
    brand:{
      eyebrow:"Brand Identity", title:"Make your business look as good as it performs.",
      body:"Full identity systems — logo, typography, color, voice, social presence and corporate profile — built as one coherent system, not a folder of disconnected assets.",
      cta:"Build Your Identity"
    },
    results:["Digital Projects Delivered","Brands Built","Campaigns Managed","Client Retention"],
    cases:{
      eyebrow:"Selected Work", title:"Case studies.", sub:"A sample of systems we've built for real businesses.",
      view:"View",
      industries:["Hospitality","Retail","F&B","Technology"],
      titles:["Coffee & Rental Platform","Furniture Resale Rebrand","Cabra Bean Visual Identity","Cabra Technology Platform"],
      descs:[
        "A booking-first digital presence for a hospitality rental brand, rebuilt around discovery and conversion.",
        "A full identity system for a used-furniture buying brand — from wordmark to social presence.",
        "Visual content and brand direction for an independent café brand, built for a crowded feed.",
        "The self-referential build: our own agency identity, systemized across every surface."
      ],
      statLabels:[["Map Visibility","Booking Rate"],["Brand Systems","Unified Voice"],["Engagement","Content Pillars"],["In-House","Iteration"]]
    },
    why:{ eyebrow:"Why Cabra", title:"We don't sell services. We build advantage." },
    whyData: WHY.map(w=>({t:w.t, d:w.d})),
    stack:{ eyebrow:"Technology", title:"The stack behind the system.", sub:"Modern, boring-in-a-good-way infrastructure — chosen for speed, not trend." },
    about:{
      eyebrow:"About Cabra",
      words:"CABRA TECHNOLOGY exists at the intersection of design, technology and growth. We started as a small studio frustrated with agencies that treated websites as brochures — we build systems instead: products that ship, campaigns that report to a number, and brands built to be remembered."
    },
    contact:{
      eyebrow:"Start a Project", title:"Have a project worth building?",
      step1:"What do you need?", step2:"What's your approximate budget?", step3:"Tell us about your project.",
      needs:NEEDS, budgets:BUDGETS,
      detailsPlaceholder:"A few sentences about what you're trying to build...",
      name:"Name", company:"Company", email:"Email", phone:"Phone",
      summaryPrefix:"Your project needs:", summaryFallback:"a consultation",
      summarySuffix:"We'll follow up with next steps.",
      summaryEmpty:"Select what you need above — we'll tailor our reply to it.",
      submit:"Start the Project",
      successEyebrow:"Received", successTitle:"We'll be in touch shortly.",
      successBody:"Thanks for reaching out — a member of the CABRA team will review your project and follow up within one business day."
    },
    footer:{
      line1:"Let's build", line2:"what's next.",
      tagline:"Digital experiences. Technology. Growth.",
      h1:"Services", h2:"Company", h3:"Connect",
      work:"Work", about:"About", contact:"Contact",
      status:"All systems operational"
    }
  },

  ar: {
    nav:{ "Services":"الخدمات","Work":"أعمالنا","Solutions":"الحلول","About":"من نحن","Contact":"تواصل", cta:"ابدأ مشروعك" },
    hero:{
      kicker:"استوديو أنظمة رقمية",
      lines:[
        [{text:"نبني"}],
        [{text:"أنظمة"},{text:"رقمية"}],
        [{text:"تُحرّك",accent:true}],
        [{text:"أعمالك."}],
      ],
      desc:"كابرا تكنولوجي تصمّم منتجات رقمية، هويات بصرية، وأنظمة نمو تساعد الشركات الطموحة على المنافسة في عالم رقمي أولاً.",
      cta1:"ابدأ مشروعك", cta2:"استعرض أعمالنا",
      scroll:"مرر للأسفل"
    },
    marquee:["ويب","هوية","نمو","تقنية","أداء","رقمي"],
    intro:{
      eyebrow:"موقعنا",
      title:"تقنية رقمية مبنية للنمو.",
      body:"لا نبني مواقع لمجرد وجودها. كل منتج نطلقه مصمم حول نتيجة عمل حقيقية — زيارات تتحول لعملاء، هويات تُتذكر، وأنظمة توفر الوقت. التصميم والتقنية والنمو تعمل كآلة واحدة."
    },
    services:{ eyebrow:"خدماتنا", title:"ماذا نبني." },
    servicesData: [
      {title:"تطوير المواقع", desc:"تجارب رقمية مصممة للأداء والتحويل والنمو — مبنية على تقنيات حديثة لا قوالب جاهزة.", tags:["الاستراتيجية","تجربة المستخدم","التطوير","الأداء","السيو","التحليلات"], cta:"لنبنِ شيئًا استثنائيًا"},
      {title:"المتاجر الإلكترونية", desc:"محركات إيرادات، لا مجرد واجهات بيع. أنظمة تجارة مبنية حول التحويل والاحتفاظ بالعملاء.", tags:["بنية المتجر","تجربة الدفع","المدفوعات","المخزون","تحسين التحويل","الأتمتة"], cta:"ابدأ البيع بذكاء"},
      {title:"إعلانات جوجل", desc:"حملات أداء تركز على نتائج قابلة للقياس — لا مجرد ظهور بلا معنى.", tags:["البحث","التسوق","الأداء الأقصى","إعادة الاستهداف","صفحات الهبوط","العائد على الإنفاق"], cta:"أطلق حملتك"},
      {title:"تحسين محركات البحث", desc:"أنظمة تقنية وهيكلية ومحتوى مبنية لنقلك من غير مرئي إلى لا يمكن تجاهله.", tags:["السيو التقني","المحتوى","السلطة الرقمية","مؤشرات الويب الأساسية","السيو المحلي","التقارير"], cta:"حسّن ظهورك"},
      {title:"الهوية البصرية", desc:"أنظمة هوية متكاملة — شعار، خطوط، ألوان، صوت — تجعل عملك يبدو بجودة أدائه.", tags:["أنظمة الشعار","الطباعة","الدليل الإرشادي","الهوية على السوشيال","التغليف","الصوت"], cta:"ابنِ هويتك"},
      {title:"تصميم UI/UX", desc:"واجهات مصممة حول سلوك المستخدم الحقيقي — واضحة، سريعة، ومبنية للتحويل.", tags:["الإطارات الأولية","النماذج التفاعلية","أنظمة التصميم","اختبار المستخدم","إمكانية الوصول","التسليم"], cta:"صمّم منتجك"},
      {title:"الأنظمة الرقمية", desc:"أنظمة أعمال وتطبيقات ويب مخصصة تستبدل العمل اليدوي ببرمجيات.", tags:["تطبيقات الويب","لوحات التحكم","التكاملات","الأتمتة","واجهات برمجية","أدوات داخلية"], cta:"ابنِ نظامك"},
      {title:"حلول مخصصة", desc:"عندما لا تناسب المشكلة أي تصنيف، نبني الحل الذي يلائمها تحديدًا.", tags:["الاكتشاف","البنية","الهندسة","الاختبار","الإطلاق","الدعم"], cta:"ناقش مشكلتك معنا"},
    ],
    ads:{
      eyebrow:"التسويق الأدائي", title:"الزيارات ليست الهدف. النمو هو الهدف.",
      body:"نبني حملات إعلانات جوجل تركز على نتائج قابلة للقياس — لا مجرد ظهور بلا معنى. كل حملة مبنية حول رقم يهمك فعليًا.",
      cta:"أطلق حملتك",
      dashLabel:"أداء الحملة", live:"مباشر",
      m1:"الظهور", m2:"معدل النقر", m3:"العائد على الإنفاق"
    },
    seo:{
      eyebrow:"الظهور في البحث", title:"كن مرئيًا. ثم كن الخيار.",
      body:"سيو تقني، هيكلة محتوى، وبناء سلطة رقمية — مصممة لنقلك من الصفحة السابعة إلى الأولى، ومن الأولى إلى أول نقرة.",
      tags:["السيو التقني","المحتوى","السلطة الرقمية","مؤشرات الويب","الظهور في البحث","التحويلات"],
      cta:"حسّن ظهورك",
      yoursite:"yourbrand.com", yourtitle:"عملك — في الترتيب الذي يستحقه",
      you:"أنت",
      competitorTitles:["نتيجة منافس","نتيجة دليل","نتيجة منافس"]
    },
    brand:{
      eyebrow:"الهوية البصرية", title:"اجعل عملك يبدو بجودة أدائه.",
      body:"أنظمة هوية متكاملة — شعار، طباعة، ألوان، صوت، حضور على السوشيال وملف تعريفي — مبنية كنظام واحد متجانس، لا ملفات متفرقة.",
      cta:"ابنِ هويتك"
    },
    results:["مشروعًا رقميًا","هوية بُنيت","حملة تمت إدارتها","نسبة بقاء العملاء"],
    cases:{
      eyebrow:"أعمال مختارة", title:"دراسات حالة.", sub:"عينة من الأنظمة التي بنيناها لشركات حقيقية.",
      view:"عرض",
      industries:["ضيافة","تجزئة","مطاعم","تقنية"],
      titles:["منصة قهوة وتأجير","إعادة هوية أثاث مستعمل","هوية كابرا بين البصرية","منصة كابرا تكنولوجي"],
      descs:[
        "حضور رقمي يركز على الحجز لعلامة ضيافة وتأجير، أُعيد بناؤه حول الاكتشاف والتحويل.",
        "نظام هوية متكامل لعلامة شراء أثاث مستعمل — من الشعار إلى الحضور على السوشيال.",
        "محتوى بصري وتوجيه هوية لعلامة مقهى مستقلة، مبني لمنافسة زحام الخلاصات.",
        "البناء الذاتي: هوية وكالتنا نفسها، مُنظمة عبر كل واجهة."
      ],
      statLabels:[["الظهور على الخريطة","معدل الحجز"],["أنظمة الهوية","صوت موحّد"],["التفاعل","محاور المحتوى"],["داخلي بالكامل","تكرار مستمر"]]
    },
    why:{ eyebrow:"لماذا كابرا", title:"لا نبيع خدمات. نبني ميزة تنافسية." },
    whyData:[
      {t:"الاستراتيجية قبل التنفيذ", d:"لا نفتح أداة تصميم قبل أن نفهم ما تحتاجه الأعمال فعليًا للتحرك."},
      {t:"تصميم بهدف", d:"كل قرار بصري مرتبط بنتيجة عمل — لا شيء زخرفة لذاتها."},
      {t:"تقنية بأداء", d:"سريع، متاح، وسليم تقنيًا. الجمال مع الأعطال ليس خيارًا."},
      {t:"تسويق بنتائج قابلة للقياس", d:"إن لم نستطع قياسه، لا نسميه نموًا. كل حملة تُقاس برقم."},
      {t:"تفكير طويل المدى", d:"نبني أنظمة تتراكم قيمتها — الهوية والمنتج والنمو تعمل كآلة واحدة."},
    ],
    stack:{ eyebrow:"التقنية", title:"البنية خلف النظام.", sub:"بنية تحتية حديثة وموثوقة — اختيرت للسرعة لا للموضة." },
    about:{
      eyebrow:"من نحن",
      words:"كابرا تكنولوجي تقف عند تقاطع التصميم والتقنية والنمو. بدأنا كاستوديو صغير غير راضٍ عن وكالات تتعامل مع المواقع كمنشورات دعائية — نحن نبني أنظمة بدلاً من ذلك: منتجات تُطلق، حملات تُقاس برقم، وهويات بُنيت لتُتذكر."
    },
    contact:{
      eyebrow:"ابدأ مشروعك", title:"لديك مشروع يستحق البناء؟",
      step1:"ما الذي تحتاجه؟", step2:"ما هي ميزانيتك التقريبية؟", step3:"أخبرنا عن مشروعك.",
      needs:["موقع إلكتروني","متجر إلكتروني","إعلانات جوجل","سيو","هوية بصرية","ملف تعريفي","تطبيق ويب","نظام مخصص","شيء آخر"],
      budgets:["أقل من 2,000$","2,000$ – 5,000$","5,000$ – 15,000$","15,000$+","غير محدد بعد"],
      detailsPlaceholder:"بضع جمل عمّا تحاول بناءه...",
      name:"الاسم", company:"الشركة", email:"البريد الإلكتروني", phone:"الهاتف",
      summaryPrefix:"مشروعك يحتاج:", summaryFallback:"استشارة",
      summarySuffix:"سنتواصل معك بالخطوات التالية.",
      summaryEmpty:"اختر ما تحتاجه أعلاه — سنُخصص ردنا بناءً عليه.",
      submit:"ابدأ المشروع",
      successEyebrow:"تم الاستلام", successTitle:"سنتواصل معك قريبًا.",
      successBody:"شكرًا لتواصلك — سيقوم أحد أعضاء فريق كابرا بمراجعة مشروعك والرد خلال يوم عمل واحد."
    },
    footer:{
      line1:"لنبنِ", line2:"ما هو قادم.",
      tagline:"تجارب رقمية. تقنية. نمو.",
      h1:"الخدمات", h2:"الشركة", h3:"تواصل",
      work:"أعمالنا", about:"من نحن", contact:"تواصل",
      status:"جميع الأنظمة تعمل"
    }
  }
};
/* ============ APP ROOT ============ */
function App(){
  const [lang, setLang] = useState('en');
  const t = T[lang];

  useEffect(()=>{
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  },[lang]);

  return (
    <>
      <ScrollProgress/>
      <CustomCursor/>
      <Nav lang={lang} setLang={setLang} t={t}/>
      <main id="main">
        <Hero t={t}/>
        <Marquee items={t.marquee}/>
        <Intro t={t}/>
        <ServicesExplorer t={t}/>
        <AdsSection t={t}/>
        <SeoSection t={t}/>
        <BrandSection t={t}/>
        <ResultsSection t={t}/>
        <CasesSection t={t}/>
        <WhySection t={t}/>
        <StackSection t={t}/>
        <AboutSection t={t}/>
        <ContactSection t={t}/>
      </main>
      <Footer t={t}/>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App/>);
