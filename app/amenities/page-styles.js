// Auto-generated from amenities.html <style> blocks (verbatim). Rendered mount-scoped.
const css = `:root{
 --navh:62px;
 --canvas:#F4F1EA;--canvas-2:#ECE7DB;--ink:#1C2A38;--ink-soft:#46504E;--muted:#8C8678;
 --line:#C19A63;--line-deep:#A07C4A;--gold-deep:#9A7438;--teal:#356A6F;--teal-deep:#234B50;--hair:rgba(28,42,56,.14);
 --display:"Cormorant Garamond",Georgia,serif;--body:"Poppins",system-ui,sans-serif;
 --ease:cubic-bezier(.16,.84,.34,1);--maxw:1240px;}
*{box-sizing:border-box;margin:0;padding:0}html{scroll-behavior:smooth}
body{background:var(--canvas);color:var(--ink);font-family:var(--body);font-weight:300;line-height:1.7;-webkit-font-smoothing:antialiased;overflow-x:hidden}
img{display:block;max-width:100%}a{color:inherit;text-decoration:none}
.wrap{max-width:var(--maxw);margin:0 auto;padding:0 clamp(1.5rem,6vw,5rem)}
.label{font-family:var(--body);font-weight:500;font-size:.66rem;letter-spacing:.32em;text-transform:uppercase;color:var(--muted)}
.line{color:var(--line)}
.hairline{height:1px;background:var(--line);width:0;transition:width 1.1s var(--ease)}.in .hairline,.in.hairline{width:64px}
.vlabel{writing-mode:vertical-rl;font-size:.6rem;letter-spacing:.34em;text-transform:uppercase;color:var(--muted)}
.bignum{font-family:var(--display);font-weight:300;color:var(--line);opacity:.32;font-size:clamp(3rem,7vw,5.5rem);line-height:.8}
/* nav */
header{position:fixed;top:0;left:0;right:0;z-index:90;transition:.5s var(--ease)}
header .bar{display:flex;align-items:center;justify-content:space-between;padding:1.1rem clamp(1.5rem,6vw,5rem)}
header.solid{background:color-mix(in srgb,var(--canvas) 80%,transparent);backdrop-filter:blur(16px) saturate(1.1);border-bottom:1px solid var(--hair)}
.brand{font-family:var(--display);font-weight:500;font-size:1.25rem;letter-spacing:.12em;display:flex;align-items:baseline;gap:.5rem}
.brand img{height:42px;width:auto;display:block}
.brand .lg-dark{display:block}.brand .lg-light{display:none}
header.over-hero:not(.solid) .brand .lg-dark{display:none}
header.over-hero:not(.solid) .brand .lg-light{display:block}
@media(max-width:600px){.brand img{height:34px}}
.brand small{font-family:var(--body);font-weight:500;font-size:.52rem;letter-spacing:.32em;text-transform:uppercase;color:var(--muted)}
nav{display:flex;align-items:center;gap:1.9rem}
nav a{font-size:.7rem;letter-spacing:.18em;text-transform:uppercase;opacity:.72;transition:.3s}
nav a:hover,nav a.active{opacity:1;color:var(--line)}nav a.active{border-bottom:1px solid var(--line);padding-bottom:2px}
nav .nbtn{border:1px solid var(--ink);padding:.55rem 1rem;border-radius:2px;opacity:1}
nav .nbtn:hover{background:var(--ink);color:var(--canvas);border-color:var(--ink)}
.hamb{display:none;flex-direction:column;gap:5px;cursor:pointer;padding:6px}.hamb span{width:22px;height:1.5px;background:var(--ink);transition:.3s}
@media(max-width:940px){#hdr nav{position:fixed;inset:0 0 0 auto;width:min(76vw,300px);background:var(--canvas);flex-direction:column;justify-content:center;gap:1.7rem;transform:translateX(100%);transition:.5s var(--ease);padding:2.5rem;box-shadow:-30px 0 60px rgba(0,0,0,.12);z-index:95}#hdr nav.open{transform:translateX(0)}#hdr nav a{font-size:.92rem}.hamb{display:flex;z-index:96}header.solid{background:var(--canvas);backdrop-filter:none;-webkit-backdrop-filter:none}}
/* hero */
.hero{height:100svh;min-height:600px;position:relative;overflow:hidden;display:flex;align-items:flex-end}
.hero .img{position:absolute;inset:0;background:url(/assets/img/hero_golden.webp) center/cover;transform:scale(1.12);animation:hz 2.4s var(--ease) forwards}
.hero .veil{position:absolute;inset:0;background:linear-gradient(0deg,rgba(10,16,24,.62),rgba(10,16,24,.05) 44%,transparent 72%)}
.hero .vr{position:absolute;right:clamp(1rem,5vw,2.4rem);top:0;bottom:0;display:flex;align-items:center;z-index:2}
.hero .vr .vlabel{color:rgba(247,244,237,.7)}
.hero .inner{position:relative;z-index:2;width:100%;padding-bottom:clamp(3rem,8vw,5.5rem)}
.hero .label{color:rgba(247,244,237,.85);opacity:0;animation:fade 1s ease 1s forwards}
.hero h1{font-family:var(--display);font-weight:300;color:#F7F4ED;font-size:clamp(3.6rem,13vw,9rem);line-height:.9;letter-spacing:.02em;margin:.45rem 0 .4rem;opacity:0;transform:translateY(20px);animation:rise 1.2s var(--ease) 1.15s forwards}
.hero .rule{height:1px;background:var(--line);width:0;animation:grow 1.2s var(--ease) 1.85s forwards}
.hero .sub{color:rgba(247,244,237,.82);font-size:.72rem;letter-spacing:.32em;text-transform:uppercase;margin-top:1rem;opacity:0;animation:fade 1.2s ease 2s forwards}
.scrollcue{position:absolute;bottom:1.5rem;left:50%;transform:translateX(-50%);z-index:2;color:rgba(247,244,237,.6);font-size:.56rem;letter-spacing:.3em;text-transform:uppercase;text-align:center}
.scrollcue .d{width:1px;height:28px;background:linear-gradient(rgba(247,244,237,.7),transparent);margin:.5rem auto 0;animation:pulse 2.4s infinite}
/* index strip */
.index{border-top:1px solid var(--hair);border-bottom:1px solid var(--hair)}
.index .row{display:grid;grid-template-columns:1.4fr 1fr 1fr 1fr 1fr;gap:1rem;padding:1.4rem 0;align-items:center}
@media(max-width:820px){.index .row{grid-template-columns:1fr 1fr;gap:1.2rem .8rem}}
.index .lead{font-family:var(--display);font-style:italic;color:var(--ink);font-size:1.25rem}
.index a{display:flex;gap:.6rem;align-items:baseline;font-size:.74rem;letter-spacing:.06em;text-transform:uppercase;color:var(--ink-soft);transition:.3s}
.index a:hover{color:var(--line)}.index a i{font-family:var(--display);font-style:italic;color:var(--line);font-size:1rem}
/* page header (sub pages) */
.phead{padding:clamp(7rem,13vw,10rem) 0 clamp(2.5rem,6vw,4rem)}
.phead .grid{display:grid;grid-template-columns:1.5fr 1fr;gap:clamp(2rem,6vw,4rem);align-items:end}
@media(max-width:820px){.phead .grid{grid-template-columns:1fr}}
.crumb{font-size:.66rem;letter-spacing:.2em;text-transform:uppercase;color:var(--muted);margin-bottom:1rem}.crumb a{color:var(--line)}
.phead h1{font-family:var(--display);font-weight:300;font-size:clamp(2.8rem,7vw,5rem);line-height:.98;color:var(--ink)}
.phead p{color:var(--ink-soft);max-width:42ch;margin-top:1.2rem}
.phead .ph-img{aspect-ratio:3/4;position:relative;overflow:hidden;border-radius:2px}
.phead .ph-img .ph{position:absolute;inset:0;background-size:cover;background-position:center;transform:scale(1.12);transition:transform 1.6s var(--ease)}
.phead.in .ph-img .ph{transform:scale(1)}
.phead .ph-img::after{content:"";position:absolute;inset:0;background:var(--canvas);transform-origin:bottom;transition:transform 1.2s var(--ease) .1s}
.phead.in .ph-img::after{transform:scaleY(0)}
/* statement */
.statement{display:grid;grid-template-columns:1.35fr 1fr;gap:clamp(2rem,6vw,4rem);align-items:center}
@media(max-width:820px){.statement{grid-template-columns:1fr}}
.statement .big{font-family:var(--display);font-weight:300;font-size:clamp(1.9rem,4.4vw,3.2rem);line-height:1.2;max-width:24ch}
.statement .big em{font-style:italic;color:var(--line)}
.statement .aside{position:relative;aspect-ratio:3/4;min-height:440px;overflow:hidden;border-radius:2px}
.statement .aside .ph{position:absolute;inset:0;background:url(/assets/img/d_water.webp) center/cover}
.statement .cap{font-size:.66rem;letter-spacing:.06em;color:var(--muted);margin-top:.7rem}
/* chapter */
.chapter{display:grid;grid-template-columns:1fr 1fr;align-items:center;gap:clamp(2rem,6vw,5rem)}
.chapter.flip .txt{order:2}.chapter.flip .media{order:1}
.chapter .txt{position:relative}
.chapter .num{position:absolute;top:-2.8rem;left:-.2rem}
.chapter h2{font-family:var(--display);font-weight:300;font-size:clamp(2.1rem,4.4vw,3.3rem);line-height:1.05;margin:.3rem 0 1.1rem}
.chapter p{color:var(--ink-soft);max-width:40ch;margin-bottom:1.5rem}
.more{font-size:.7rem;letter-spacing:.22em;text-transform:uppercase;color:var(--line);border-bottom:1px solid var(--line);padding-bottom:.35rem;transition:.3s}.more:hover{letter-spacing:.27em}
/* section kicker — names the topic plainly before the poetic headline */
.kicker{display:flex;align-items:center;gap:.95rem;margin-bottom:1.2rem}
.kicker .kn{color:var(--line);width:46px;height:46px;display:grid;place-items:center;border:1px solid var(--line);border-radius:50%;flex-shrink:0;background:var(--canvas)}
.kicker .kn svg{width:21px;height:21px;display:block;stroke-width:1.5}
.kicker .kt{font-size:.72rem;letter-spacing:.2em;text-transform:uppercase;color:var(--ink);font-weight:500}
.kicker .ks{font-size:.82rem;color:var(--muted);margin-top:.25rem;line-height:1.3}
/* essentials — the facts buyers ask first */
.essgrid{display:grid;grid-template-columns:repeat(4,1fr);gap:1.5rem;border-top:1px solid var(--hair);padding-top:1.8rem;margin-top:.3rem}
.ess-i{display:flex;flex-direction:column;gap:.4rem;border-left:1px solid var(--hair);padding-left:1.2rem}
.ess-i:first-child{border-left:none;padding-left:0}
.el{font-size:.58rem;letter-spacing:.2em;text-transform:uppercase;color:var(--line)}
.ev{font-family:var(--display);font-weight:400;font-size:1.18rem;color:var(--ink);line-height:1.2}
.ed{font-size:.76rem;color:var(--muted);line-height:1.4}
.ess-cta{display:flex;flex-wrap:wrap;gap:1rem 1.7rem;align-items:center;margin-top:2rem}
.altcta{text-align:center;margin-top:1.6rem;font-size:.82rem;color:var(--muted)}
.altcta a{color:var(--gold-deep);border-bottom:1px solid var(--line)}
/* narrative bridges — thread one story into the next */
.bridge{text-align:center;max-width:620px;margin:0 auto;padding:clamp(2.2rem,6vw,3.6rem) 1.5rem}
.bridge p{font-family:var(--display);font-style:italic;font-weight:300;font-size:clamp(1.25rem,2.6vw,1.8rem);line-height:1.45;color:var(--muted)}
.bridge b{color:var(--ink-soft);font-style:normal;font-weight:400}
/* the case for the price — rational capstone to the emotional stories */
.worth{padding:clamp(3.5rem,8vw,6rem) 0;background:var(--canvas-2);border-top:1px solid var(--hair);border-bottom:1px solid var(--hair)}
.worth-in{max-width:780px}
.worth-lead{font-family:var(--display);font-weight:300;font-size:clamp(1.9rem,4.2vw,3rem);line-height:1.18;color:var(--ink);margin:.4rem 0 1.3rem}
.worth-body{font-size:1.04rem;line-height:1.85;color:var(--ink-soft);max-width:62ch}
.worth-body b{color:var(--ink);font-weight:500}
/* === Waterline — lakefront depth progress indicator === */
.wl{position:fixed;right:clamp(1.1rem,1.8vw,2rem);top:50%;transform:translateY(-50%);height:min(58vh,500px);z-index:60;opacity:0;transition:opacity .6s var(--ease);pointer-events:none}
.wl.show{opacity:1}
.wl-tube{position:absolute;right:0;top:0;bottom:0;width:3px;border-radius:3px;background:color-mix(in srgb,var(--teal) 9%,transparent);box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--teal) 13%,transparent);overflow:hidden}
.wl-water{position:absolute;left:0;top:0;width:100%;height:0;background:linear-gradient(180deg,color-mix(in srgb,var(--teal) 26%,transparent),color-mix(in srgb,var(--teal) 68%,transparent));transition:height .32s var(--ease)}
.wl-surface{position:absolute;left:-1.5px;right:-1.5px;bottom:0;height:2px;border-radius:2px;background:var(--teal);box-shadow:0 0 9px 1px color-mix(in srgb,var(--teal) 60%,transparent);animation:wlbreathe 3.6s ease-in-out infinite}
@keyframes wlbreathe{0%,100%{transform:translateY(0);opacity:.92}50%{transform:translateY(-1.5px);opacity:1}}
.wl-mk{position:absolute;right:0;transform:translateY(-50%);display:flex;align-items:center;justify-content:flex-end;gap:.65rem;background:none;border:0;cursor:pointer;pointer-events:auto;padding:0}
.wl-mk .tick{width:8px;height:1px;background:var(--hair);transition:.45s var(--ease);flex-shrink:0}
.wl-mk .nm{font-family:var(--display);font-style:italic;font-weight:300;font-size:1.05rem;line-height:1;color:var(--ink-soft);white-space:nowrap;opacity:0;transform:translateX(8px);transition:.5s var(--ease);background:var(--canvas);padding:.16rem .6rem;border-radius:2px;box-shadow:0 5px 18px rgba(28,42,56,.12)}
.wl-mk:hover .nm,.wl-mk.on .nm{opacity:1;transform:none}
.wl-mk:hover .tick{background:var(--teal);width:12px}
.wl-mk.on .tick{background:var(--teal);width:15px;height:2px}
.wl-mk.on .nm{color:var(--teal-deep)}
.wl-now{position:absolute;right:15px;top:50%;transform:translateY(-50%);writing-mode:vertical-rl;font-family:var(--display);font-style:italic;font-weight:300;font-size:.92rem;letter-spacing:.06em;color:var(--teal-deep);white-space:nowrap;opacity:0;transition:opacity .5s var(--ease);display:none}
@media(max-width:1100px){
 .wl{right:11px;height:44vh}
 .wl-tube{width:5px;border-radius:5px;background:color-mix(in srgb,var(--teal) 8%,transparent);box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--teal) 20%,transparent),0 3px 11px rgba(28,42,56,.08)}
 .wl-tube::before{content:"";position:absolute;left:1px;top:7px;bottom:7px;width:1px;background:rgba(255,255,255,.5);border-radius:1px;z-index:2}
 .wl-surface{box-shadow:0 0 11px 2px color-mix(in srgb,var(--teal) 55%,transparent)}
 .wl-mk{display:none}
 .wl-now{display:block}
}
@media(max-width:820px){.essgrid{grid-template-columns:1fr 1fr;gap:1.3rem}.ess-i{border-left:none;padding-left:0}}
@media(max-width:440px){.essgrid{grid-template-columns:1fr}}
/* two-image composition */
.duo{position:relative}
.duo .big{position:relative;aspect-ratio:4/5;overflow:hidden;border-radius:2px}
.duo .big .ph{position:absolute;inset:0;background-size:cover;background-position:center;transform:scale(1.14);transition:transform 1.6s var(--ease)}
.duo .big::after{content:"";position:absolute;inset:0;background:var(--canvas);transform-origin:right;transition:transform 1.2s var(--ease)}
.chapter.in .duo .big::after{transform:scaleX(0)}.chapter.in .duo .big .ph{transform:scale(1)}
.duo .inset{position:absolute;width:42%;aspect-ratio:3/4;bottom:-1.6rem;overflow:hidden;border:6px solid var(--canvas);border-radius:2px;box-shadow:0 18px 40px rgba(28,42,56,.18)}
.duo.r .inset{right:-1.2rem}.duo.l .inset{left:-1.2rem}
.duo .inset .ph{position:absolute;inset:0;background-size:cover;background-position:center}
.duo .icap{position:absolute;bottom:-2.6rem;font-size:.6rem;letter-spacing:.14em;text-transform:uppercase;color:var(--muted)}
.duo.r .icap{right:-1rem}.duo.l .icap{left:-1rem}
/* band */
.band{position:relative;height:86vh;min-height:460px;overflow:hidden;display:flex;align-items:center;justify-content:center}
.band .ph{position:absolute;inset:0;background-size:cover;background-position:center;will-change:transform}
.band::after{content:"";position:absolute;inset:0;background:rgba(10,16,24,.24)}
.band .cap{position:relative;z-index:2;text-align:center;color:#F7F4ED;padding:0 1.5rem}
.band .cap p{font-family:var(--display);font-weight:300;font-style:italic;font-size:clamp(1.8rem,4.4vw,3rem);line-height:1.2;max-width:18ch;margin:0 auto}
.band .cap .label{color:rgba(247,244,237,.8);margin-bottom:1rem}
.band .loc{position:absolute;bottom:1.4rem;right:clamp(1.2rem,5vw,3rem);z-index:2;color:rgba(247,244,237,.7);font-size:.6rem;letter-spacing:.2em;text-transform:uppercase}
.band .loc2{position:absolute;bottom:1.4rem;left:clamp(1.2rem,5vw,3rem);z-index:2;color:rgba(247,244,237,.7);font-size:.6rem;letter-spacing:.2em;text-transform:uppercase}
/* figures */
.figs{display:grid;grid-template-columns:repeat(4,1fr);gap:0}
@media(max-width:680px){.figs{grid-template-columns:repeat(2,1fr)}}
.fig{text-align:center;padding:1.5rem 1rem;border-left:1px solid var(--hair)}.fig:first-child{border-left:none}
@media(max-width:680px){.fig:nth-child(odd){border-left:none}.fig:nth-child(n+3){border-top:1px solid var(--hair)}}
.fig .n{font-family:var(--display);font-weight:300;font-size:clamp(2.3rem,5vw,3.4rem);line-height:1}
.fig .t{font-size:.6rem;letter-spacing:.2em;text-transform:uppercase;color:var(--muted);margin-top:.5rem}
/* units */
.units{display:grid;grid-template-columns:1fr 1fr;gap:clamp(1.5rem,4vw,3rem)}@media(max-width:760px){.units{grid-template-columns:1fr}}
.unit{border-top:1px solid var(--ink);padding-top:1.4rem;position:relative}
.unit .bignum{position:absolute;right:0;top:1rem}
.unit h3{font-family:var(--display);font-weight:300;font-size:2.6rem;line-height:1;margin-bottom:1rem}
.unit dl{display:grid;grid-template-columns:auto 1fr;gap:.55rem 1.2rem;font-size:.86rem}
.unit dt{color:var(--muted)}.unit dd{text-align:right;color:var(--ink)}
.unit .uimg{aspect-ratio:16/10;margin:1.3rem 0;overflow:hidden;border-radius:2px;background-size:cover;background-position:center}
.unit .ctarow{display:flex;gap:1.3rem;align-items:center;margin-top:.4rem}
.indic{font-size:.72rem;color:var(--line-deep);font-style:italic;margin-top:1.6rem}
/* feature list */
.flist{display:grid;grid-template-columns:repeat(2,1fr);gap:1.4rem 3rem;margin-top:2rem}@media(max-width:680px){.flist{grid-template-columns:1fr}}
.flist .f{border-top:1px solid var(--hair);padding-top:.9rem}
.flist .f h4{font-family:var(--display);font-style:italic;font-size:1.35rem;color:var(--ink)}
.flist .f p{font-size:.85rem;color:var(--ink-soft);margin-top:.2rem}
/* amenities cols */
.amg{display:grid;grid-template-columns:repeat(3,1fr);gap:clamp(1.5rem,4vw,3rem)}@media(max-width:820px){.amg{grid-template-columns:1fr}}
.amc{border-top:1px solid var(--ink);padding-top:1.2rem;position:relative}
.amc .bignum{position:absolute;right:0;top:.8rem}
.amc h3{font-family:var(--display);font-weight:300;font-size:1.9rem;margin-bottom:.1rem}
.amc .ct{font-size:.6rem;letter-spacing:.16em;text-transform:uppercase;color:var(--muted);margin-bottom:1rem}
.amc ul{list-style:none}.amc li{font-size:.86rem;color:var(--ink-soft);padding:.28rem 0;border-bottom:1px solid var(--hair)}
/* connectivity */
.conn{display:grid;grid-template-columns:repeat(2,1fr);gap:0 3rem;margin-top:1rem}@media(max-width:640px){.conn{grid-template-columns:1fr}}
.conn .r{display:flex;justify-content:space-between;gap:1rem;padding:.7rem 0;border-bottom:1px solid var(--hair);font-size:.9rem;color:var(--ink-soft)}
.conn .r b{color:var(--ink);font-weight:400;white-space:nowrap}
/* map */
.mapwrap{margin-top:2rem;border:1px solid var(--hair);border-radius:2px;overflow:hidden;height:clamp(320px,46vh,460px);background:var(--canvas-2)}
.mapwrap iframe{width:100%;height:100%;border:0;filter:grayscale(.35) sepia(.06) contrast(1.02)}
/* gallery */
.gal{column-count:3;column-gap:.85rem}
@media(max-width:900px){.gal{column-count:2}}
@media(max-width:560px){.gal{column-count:1}}
.gal figure{position:relative;overflow:hidden;border-radius:2px;cursor:zoom-in;break-inside:avoid;margin:0 0 .85rem}
.gal img{width:100%;height:auto;display:block;transition:.7s var(--ease)}.gal figure:hover img{transform:scale(1.04)}
.gal figcaption{position:absolute;left:0;right:0;bottom:0;padding:1.5rem 1.1rem .95rem;background:linear-gradient(0deg,rgba(16,26,36,.5),transparent);color:rgba(247,244,237,.96);font-family:var(--body);font-size:.56rem;letter-spacing:.26em;text-transform:uppercase;opacity:0;transform:translateY(6px);transition:.45s var(--ease)}
.gal figcaption::before{content:"";display:inline-block;width:1.4rem;height:1px;background:var(--line);vertical-align:middle;margin-right:.6rem}
.gal figure:hover figcaption{opacity:1;transform:none}
@media(hover:none){.gal figcaption{opacity:1;transform:none}}
.lightbox{position:fixed;inset:0;z-index:210;display:none;align-items:center;justify-content:center;background:rgba(20,16,12,.92);padding:2rem}
.lightbox.open{display:flex}.lightbox img{max-width:92vw;max-height:88vh;border-radius:2px}
.lightbox .x{position:absolute;top:1.2rem;right:1.6rem;color:#F7F4ED;font-size:2rem;cursor:pointer}
/* faq */
.faq{max-width:820px}
.q{border-bottom:1px solid var(--hair)}
.q button{width:100%;text-align:left;background:none;border:none;color:var(--ink);font-family:var(--display);font-size:1.4rem;padding:1.1rem 2rem 1.1rem 0;cursor:pointer;position:relative}
.q button::after{content:"+";position:absolute;right:.2rem;top:1.05rem;color:var(--line);font-family:var(--body);font-weight:300;font-size:1.5rem;transition:.3s}
.q.open button::after{transform:rotate(45deg)}
.q .a{max-height:0;overflow:hidden;transition:max-height .4s var(--ease);color:var(--ink-soft);font-size:.9rem}.q .a p{padding:0 0 1.1rem;max-width:64ch}
/* about projects */
.proj{display:grid;grid-template-columns:repeat(4,1fr);gap:1.3rem}@media(max-width:760px){.proj{grid-template-columns:repeat(2,1fr)}}
.proj .p{border-top:1px solid var(--hair);padding-top:1rem}.proj .p h4{font-family:var(--display);font-style:italic;font-size:1.4rem}.proj .p span{font-size:.78rem;color:var(--muted)}
/* enquiry */
.enq{text-align:center}
.enq h2{font-family:var(--display);font-weight:300;font-size:clamp(2.1rem,5.2vw,3.8rem);line-height:1.08;max-width:18ch;margin:0 auto 1rem}
.enq p{color:var(--ink-soft);max-width:44ch;margin:0 auto 2rem}
.qform{display:flex;gap:.6rem;flex-wrap:wrap;justify-content:center;max-width:720px;margin:0 auto}
.cgrid{display:grid;grid-template-columns:1.2fr 1fr;gap:clamp(2rem,6vw,4rem)}
@media(max-width:760px){.cgrid{grid-template-columns:1fr;gap:2.4rem}}
/* === figures band — image-free substance breather === */
.figures{background:var(--canvas-2);border-top:1px solid var(--hair);border-bottom:1px solid var(--hair)}
.figures .wrap{padding-top:clamp(3.2rem,7vw,5rem);padding-bottom:clamp(3.2rem,7vw,5rem)}
.fig-head{text-align:center;margin-bottom:clamp(2.2rem,5vw,3.4rem)}
.fig-head h2{font-family:var(--display);font-weight:300;font-size:clamp(1.9rem,4vw,2.9rem);margin-top:.35rem;color:var(--ink)}
.fig-grid{display:grid;grid-template-columns:repeat(6,1fr);gap:clamp(1.4rem,2.6vw,2.2rem)}
.fig{text-align:center}
.fig-n{display:block;font-family:var(--display);font-weight:300;font-size:clamp(2.7rem,4.4vw,3.9rem);line-height:1;color:var(--ink);letter-spacing:-.01em}
.fig-n .fig-s{font-size:.3em;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);margin-left:.25em;font-family:var(--body);font-weight:500;vertical-align:.35em}
.fig-l{display:block;margin-top:.85rem;font-size:.72rem;letter-spacing:.05em;color:var(--ink-soft);line-height:1.45}
.fig-foot{text-align:center;margin-top:clamp(2.2rem,5vw,3.2rem);font-family:var(--display);font-style:italic;font-size:clamp(1.05rem,2vw,1.3rem);color:var(--muted);max-width:36ch;margin-left:auto;margin-right:auto;line-height:1.5}
@media(max-width:820px){.fig-grid{grid-template-columns:repeat(3,1fr);gap:2.2rem 1.2rem}}
@media(max-width:430px){.fig-grid{grid-template-columns:repeat(2,1fr);gap:2rem 1rem}}
/* === assurance band — financial-safety trust beat === */
.assure{background:var(--canvas-2);border-top:1px solid var(--hair);border-bottom:1px solid var(--hair)}
.assure .wrap{padding-top:clamp(2.8rem,7vw,4.5rem);padding-bottom:clamp(2.8rem,7vw,4.5rem)}
.assure-in{text-align:center}
.assure .kicker{margin-bottom:clamp(1.8rem,5vw,2.6rem)}
.agrid{display:grid;grid-template-columns:repeat(4,1fr);gap:clamp(1.6rem,3vw,2.4rem);text-align:left}
.ai{display:flex;flex-direction:column;gap:.55rem;padding-top:1.3rem;border-top:1px solid var(--line)}
.ai .aic{color:var(--line-deep)}.ai .aic svg{width:24px;height:24px;stroke-width:1.4}
.ai b{font-family:var(--body);font-weight:600;font-size:.92rem;letter-spacing:.01em;color:var(--ink)}
.ai p{font-size:.84rem;line-height:1.5;color:var(--ink-soft);margin:0}
@media(max-width:820px){.agrid{grid-template-columns:1fr 1fr;gap:1.5rem 1.4rem}}
@media(max-width:440px){.agrid{grid-template-columns:1fr;gap:0}.ai{padding:1.2rem 0;border-top:1px solid var(--hair)}.ai:first-child{border-top:1px solid var(--line)}}
.qform input,.qform select{font-family:var(--body);font-size:.88rem;padding:.85rem 1rem;background:transparent;border:1px solid var(--hair);border-radius:2px;color:var(--ink);flex:1;min-width:150px}
.qform input::placeholder{color:var(--muted)}.qform input:focus,.qform select:focus{outline:none;border-color:var(--line)}
.formnote{font-size:.7rem;color:var(--muted);margin-top:1rem}
/* buttons */
.btn{font-family:var(--body);font-weight:500;letter-spacing:.18em;text-transform:uppercase;font-size:.68rem;padding:1rem 2rem;border:1px solid var(--ink);color:var(--ink);border-radius:2px;cursor:pointer;display:inline-block;transition:.4s var(--ease)}
.btn:hover{background:var(--ink);color:var(--canvas)}.btn.solid{background:var(--ink);color:var(--canvas)}.btn.solid:hover{background:transparent;color:var(--ink)}
/* footer */
footer{border-top:1px solid var(--hair);background:var(--canvas-2)}
.ft{display:grid;grid-template-columns:2fr 1fr 1fr;gap:2.5rem;padding:clamp(3rem,6vw,4.5rem) 0 2rem}@media(max-width:760px){.ft{grid-template-columns:1fr;gap:2rem}}
.ft .brand{font-size:1.6rem}.ft-logo{height:48px;width:auto;display:block;margin-bottom:.3rem}
.rera-verify{font-size:.72rem;color:var(--line)!important;border-bottom:1px solid var(--line);display:inline-block!important;margin-top:.7rem}
.by-makuta{margin-top:1.5rem;display:flex;align-items:center;gap:.7rem}
.by-makuta span{font-size:.58rem;letter-spacing:.18em;text-transform:uppercase;color:var(--muted)}
.by-makuta img{height:36px;width:auto;display:block}
.ft a,.ft p{font-size:.83rem;color:var(--ink-soft);display:block;margin-bottom:.5rem;transition:.3s}.ft a:hover{color:var(--line)}
.ft h4{font-size:.6rem;letter-spacing:.22em;text-transform:uppercase;color:var(--muted);margin-bottom:1rem}
.ft .rera{font-size:.78rem;border:1px solid var(--hair);padding:.6rem .9rem;border-radius:2px;margin-top:.7rem;display:inline-block}
.disc{font-size:.62rem;color:var(--muted);border-top:1px solid var(--hair);padding:1.3rem 0;line-height:1.6}
/* floats */
.wa{position:fixed;right:1.1rem;bottom:1.3rem;z-index:80;width:56px;height:56px;border-radius:50%;background:#25D366;display:grid;place-items:center;box-shadow:0 10px 26px rgba(37,211,102,.45);transition:.3s}.wa:hover{transform:scale(1.08)}.wa svg{width:32px;height:32px;fill:#fff}
.mcall{position:fixed;left:0;right:0;bottom:0;z-index:79;display:none;background:color-mix(in srgb,var(--canvas) 90%,transparent);backdrop-filter:blur(14px);border-top:1px solid var(--hair);padding:.7rem;text-align:center}
.mcall a{font-size:.64rem;letter-spacing:.2em;text-transform:uppercase;color:var(--line);margin:0 1rem}
@media(max-width:760px){.mcall{display:block}.wa{display:none}.scrollcue{display:none}}
/* modal */
.modal{position:fixed;inset:0;z-index:200;display:none;align-items:center;justify-content:center;padding:1.5rem;background:rgba(20,16,12,.55);backdrop-filter:blur(5px)}.modal.open{display:flex}
.modal .box{background:var(--canvas);border:1px solid var(--line);border-radius:3px;max-width:420px;width:100%;padding:2.4rem;position:relative}
.modal .x{position:absolute;top:.9rem;right:1.2rem;color:var(--muted);font-size:1.6rem;cursor:pointer}
.modal h3{font-family:var(--display);font-weight:400;font-size:1.9rem;margin-bottom:.3rem}
.modal p{font-size:.84rem;color:var(--ink-soft);margin-bottom:1.3rem}
.modal input{width:100%;font-family:var(--body);font-size:.9rem;padding:.8rem 1rem;margin-bottom:.7rem;background:transparent;border:1px solid var(--hair);border-radius:2px;color:var(--ink)}
.modal input:focus{outline:none;border-color:var(--line)}.modal .btn{width:100%;text-align:center;margin-top:.3rem}
.modal .ok{text-align:center}.modal .ok .tick{font-size:2.2rem;color:var(--line)}.err{color:#b5562f;font-size:.72rem;margin:-.3rem 0 .6rem;display:none}
/* === amenities fun-but-elegant === */
.amintro{display:grid;grid-template-columns:1fr 1fr;gap:clamp(2rem,6vw,4rem);align-items:center}@media(max-width:820px){.amintro{grid-template-columns:1fr}}
.daytabs{display:flex;gap:.5rem;flex-wrap:wrap;margin-bottom:2.2rem}
.daytab{font-family:var(--body);font-size:.64rem;letter-spacing:.18em;text-transform:uppercase;color:var(--muted);background:none;border:1px solid var(--hair);border-radius:40px;padding:.6rem 1.2rem;cursor:pointer;transition:.35s var(--ease)}
.daytab.on{background:var(--ink);color:var(--canvas);border-color:var(--ink)}.daytab:hover{border-color:var(--line);color:var(--line)}
.daypanel{display:none}.daypanel.on{display:grid;grid-template-columns:1.05fr 1fr;gap:clamp(2rem,5vw,3.5rem);align-items:center;animation:fadeup .55s var(--ease)}@media(max-width:820px){.daypanel.on{grid-template-columns:1fr}}
.daypanel .pimg{aspect-ratio:5/4;border-radius:2px;background-size:cover;background-position:center}
.daypanel .ptag{font-family:var(--display);font-style:italic;color:var(--line);font-size:1.3rem;margin-bottom:.3rem}
.daypanel h3{font-family:var(--display);font-weight:300;font-size:clamp(2rem,4vw,3rem);line-height:1.04;margin-bottom:1.1rem}
.daypanel .pd{color:var(--ink-soft);max-width:40ch;margin-bottom:1.2rem}
.daychips{display:flex;flex-wrap:wrap;gap:.55rem}
.chip{display:inline-flex;align-items:center;gap:.5rem;border:1px solid var(--hair);border-radius:40px;padding:.5rem .95rem;font-size:.8rem;color:var(--ink-soft);transition:.3s var(--ease)}
.chip:hover{border-color:var(--line);transform:translateY(-2px);color:var(--ink)}.chip svg{width:16px;height:16px;color:var(--line);flex-shrink:0;stroke-width:1.3}
@keyframes fadeup{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
.marquee{overflow:hidden;border-top:1px solid var(--hair);border-bottom:1px solid var(--hair);padding:1.1rem 0;-webkit-mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent);mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)}
.marquee .track{display:flex;white-space:nowrap;width:max-content;animation:scroll 42s linear infinite}.marquee:hover .track{animation-play-state:paused}
.marquee span{font-family:var(--display);font-style:italic;font-size:1.35rem;color:var(--ink-soft);padding:0 1.4rem}.marquee span i{color:var(--line);font-style:normal}
@keyframes scroll{to{transform:translateX(-50%)}}
.zone{margin-top:clamp(2.5rem,6vw,4rem)}
.zone .zh{display:flex;align-items:baseline;justify-content:space-between;border-bottom:1px solid var(--ink);padding-bottom:.7rem;margin-bottom:1.5rem;gap:1rem}
.zone .zh .zt{display:flex;align-items:baseline;gap:.8rem}.zone .zh h3{font-family:var(--display);font-weight:300;font-size:clamp(1.7rem,3.4vw,2.4rem)}
.zone .zh .zl{font-size:.6rem;letter-spacing:.18em;text-transform:uppercase;color:var(--muted)}.zone .zh .zc{font-family:var(--display);font-style:italic;color:var(--line);font-size:1.5rem}
.icongrid{display:grid;grid-template-columns:repeat(4,1fr);gap:.7rem}@media(max-width:880px){.icongrid{grid-template-columns:repeat(3,1fr)}}@media(max-width:560px){.icongrid{grid-template-columns:repeat(2,1fr)}}
.amitem{display:flex;align-items:center;gap:.8rem;padding:.95rem .9rem;border:1px solid var(--hair);border-radius:3px;transition:.35s var(--ease)}
.amitem:hover{border-color:var(--line);transform:translateY(-4px);box-shadow:0 14px 30px rgba(28,42,56,.08)}
.amitem svg{width:23px;height:23px;color:var(--line);flex-shrink:0;stroke-width:1.2}.amitem span{font-size:.82rem;color:var(--ink);line-height:1.25}
/* home experience + specs */
.exp4{display:grid;grid-template-columns:repeat(4,1fr);gap:1.4rem;margin-top:2.4rem}@media(max-width:820px){.exp4{grid-template-columns:repeat(2,1fr)}}@media(max-width:460px){.exp4{grid-template-columns:1fr}}
.exp4 .e{border-top:1px solid var(--hair);padding-top:1rem}.exp4 .e svg{width:26px;height:26px;color:var(--line);margin-bottom:.7rem;stroke-width:1.1}
.exp4 .e h4{font-family:var(--display);font-style:italic;font-size:1.4rem}.exp4 .e p{font-size:.8rem;color:var(--ink-soft);margin-top:.2rem}
.specs{display:grid;grid-template-columns:repeat(3,1fr);gap:1.3rem 2.5rem;margin-top:2rem}@media(max-width:760px){.specs{grid-template-columns:1fr 1fr}}@media(max-width:460px){.specs{grid-template-columns:1fr}}
.specs .s{border-top:1px solid var(--hair);padding-top:.9rem}.specs .s h4{font-family:var(--display);font-style:italic;font-size:1.2rem}.specs .s p{font-size:.79rem;color:var(--ink-soft);margin-top:.2rem}
.pull{font-family:var(--display);font-style:italic;color:var(--ink);font-size:1.25rem;line-height:1.4;border-left:1px solid var(--line);padding-left:1.1rem;margin-top:1.6rem;max-width:34ch}
/* map cleanup */
.mapcap{display:flex;align-items:center;gap:.7rem;border:1px solid var(--hair);border-bottom:none;border-radius:2px 2px 0 0;padding:.8rem 1.1rem;font-size:.74rem;letter-spacing:.1em;text-transform:uppercase;color:var(--ink)}
.mapcap b{color:var(--line)}.mapwrap{margin-top:0;border-radius:0 0 2px 2px}
/* responsive duo + chapter */
@media(max-width:820px){
 .duo .big{aspect-ratio:3/2}
 .duo .inset{position:relative;width:52%;bottom:auto;margin:-3.2rem 0 0 auto;border-width:5px}
 .duo.l .inset,.duo.r .inset{left:auto;right:0}
 .duo .icap{position:relative;bottom:auto;left:auto!important;right:0!important;text-align:right;margin-top:.5rem}
 .chapter .num{position:relative;top:auto;left:auto;margin-bottom:.3rem}
 .statement .aside{max-width:340px}
}
/* === loader === */
.loader{position:fixed;inset:0;z-index:300;background:var(--canvas);display:flex;align-items:center;justify-content:center;transition:opacity .7s var(--ease),visibility .7s}
.loader.done{opacity:0;visibility:hidden;pointer-events:none}
.lwrap{text-align:center}
.lmk{font-family:var(--body);font-weight:500;letter-spacing:.4em;font-size:.7rem;color:var(--muted);opacity:0;animation:fade .7s ease .15s forwards}
.ltg{font-family:var(--display);font-weight:300;font-size:clamp(3rem,9vw,5rem);color:var(--line);line-height:1;letter-spacing:.06em;opacity:0;transform:translateY(10px);animation:rise .9s var(--ease) .3s forwards}
.lwave{width:160px;height:20px;margin:.4rem auto 0}.lwave path{fill:none;stroke:var(--line);stroke-width:2;stroke-dasharray:240;stroke-dashoffset:240;animation:draw 1.1s var(--ease) .6s forwards}
/* === scroll progress === */
.progress{position:fixed;top:0;left:0;height:2px;width:0;background:linear-gradient(90deg,var(--line-deep),var(--line));z-index:95;transition:width .1s linear}
/* === ripple rings (live animation) === */
.ripples{position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:1}
.ripples span{position:absolute;left:var(--rx,30%);top:var(--ry,55%);width:14px;height:14px;border-radius:50%;border:1px solid var(--line);transform:translate(-50%,-50%) scale(0);opacity:.5;animation:ripple 7s ease-out infinite}
.ripples span:nth-child(2){animation-delay:2.3s}.ripples span:nth-child(3){animation-delay:4.6s}
.hero .ripples span{border-color:rgba(216,184,124,.6)}
@keyframes ripple{0%{transform:translate(-50%,-50%) scale(0);opacity:.55}80%{opacity:.12}100%{transform:translate(-50%,-50%) scale(34);opacity:0}}
/* === wave divider === */
.wavediv{line-height:0;color:var(--line)}.wavediv svg{width:100%;height:34px;display:block}.wavediv path{fill:none;stroke:currentColor;stroke-width:1.4;opacity:.5}
/* ripple-line under headings */
.rip-line{position:relative;height:16px;width:90px;margin-top:1.4rem}
.rip-line svg{width:100%;height:100%}.rip-line path{fill:none;stroke:var(--line);stroke-width:1.6;stroke-dasharray:120;stroke-dashoffset:120}
.in .rip-line path{animation:draw 1.3s var(--ease) forwards}
/* === skeleton shimmer === */
.skel{position:relative;overflow:hidden;background:var(--canvas-2)}
.skel::after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(255,255,255,.5),transparent);transform:translateX(-100%);animation:shim 1.4s infinite}
.skel.ready::after{display:none}
@keyframes shim{to{transform:translateX(100%)}}
/* === hero CTA === */
.hero .cta{display:flex;gap:.8rem;flex-wrap:wrap;margin-top:1.8rem;opacity:0;animation:fade 1.2s ease 2.2s forwards}
.hbtn{font-family:var(--body);font-weight:500;letter-spacing:.16em;text-transform:uppercase;font-size:.66rem;padding:.95rem 1.6rem;border-radius:2px;cursor:pointer;transition:.4s var(--ease)}
.hbtn.sol{background:var(--line);color:var(--navy-900,#11203a)}.hbtn.sol:hover{background:var(--gold-bright,#D8B87C)}
.hbtn.gho{border:1px solid rgba(247,244,237,.6);color:#F7F4ED}.hbtn.gho:hover{border-color:var(--line);color:var(--line)}
/* === cta band (brochure+price) === */
.ctaband{text-align:center}
.ctaband .row{display:flex;gap:.8rem;justify-content:center;flex-wrap:wrap;margin-top:1.5rem}
/* === floor-plan explorer === */
.fp{margin-top:1rem}
.fp .towernote{font-family:var(--display);font-style:italic;color:var(--ink-soft);font-size:1.2rem;margin-bottom:1.6rem;display:flex;align-items:center;gap:.7rem}
.fp .towernote svg{width:26px;height:26px;color:var(--line);flex-shrink:0}
.fp .seg{display:inline-flex;border:1px solid var(--hair);border-radius:40px;padding:3px;margin-bottom:1.4rem}
.fp .seg button{font-family:var(--body);font-size:.66rem;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);background:none;border:none;padding:.6rem 1.3rem;border-radius:30px;cursor:pointer;transition:.35s}
.fp .seg button.on{background:var(--ink);color:var(--canvas)}
.fp .chips{display:flex;flex-wrap:wrap;gap:.55rem;margin-bottom:1.8rem}
.fp .uchip{font-family:var(--body);font-size:.74rem;letter-spacing:.07em;color:var(--ink-soft);background:var(--canvas);border:1px solid var(--hair);border-radius:40px;padding:.62rem 1.3rem;cursor:pointer;transition:.32s var(--ease);white-space:nowrap}
.fp .uchip:hover{border-color:var(--line);color:var(--ink)}.fp .uchip.on{border-color:var(--ink);background:var(--ink);color:var(--canvas)}
@media(max-width:560px){.fp .chips{flex-wrap:nowrap;overflow-x:auto;scrollbar-width:none;-ms-overflow-style:none;margin:0 -1.4rem 1.6rem;padding:.1rem 1.4rem .4rem}.fp .chips::-webkit-scrollbar{display:none}}
.fp .uchip-old{display:none}
.fp .view{display:grid;grid-template-columns:1.4fr 1fr;gap:clamp(2rem,5vw,3.5rem);align-items:center;border-top:1px solid var(--hair);padding-top:2rem}
@media(max-width:820px){.fp .view{grid-template-columns:1fr}}
.fp .plan{aspect-ratio:4/3;border:1px solid var(--hair);border-radius:2px;background:var(--canvas-2);display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden}
.fp .plan svg{width:78%;height:78%;color:var(--ink-soft);opacity:.5}
.fp .plan .pcode{position:absolute;top:1rem;left:1.1rem;font-family:var(--display);font-style:italic;color:var(--line);font-size:1.5rem}
.fp .plan .pwm{position:absolute;bottom:1rem;right:1.1rem;font-size:.6rem;letter-spacing:.14em;text-transform:uppercase;color:var(--muted)}
.fp .det h3{font-family:var(--display);font-weight:300;font-size:2.4rem;line-height:1;margin-bottom:1rem}
.fp .det dl{display:grid;grid-template-columns:auto 1fr;gap:.5rem 1.2rem;font-size:.86rem;border-top:1px solid var(--hair);padding-top:1rem}
.fp .det dt{color:var(--muted)}.fp .det dd{text-align:right}
.fp .det .ctarow{display:flex;gap:.7rem;flex-wrap:wrap;margin-top:1.5rem}
.btn.sm{padding:.8rem 1.3rem;font-size:.64rem}
/* === amenities crossfade stack === */
.daystack{display:grid;position:relative}
.daystack .daypanel{display:grid!important;grid-area:1/1;grid-template-columns:1.05fr 1fr;gap:clamp(2rem,5vw,3.5rem);align-items:center;opacity:0;visibility:hidden;pointer-events:none;transition:opacity .6s var(--ease),visibility .6s}
@media(max-width:820px){.daystack .daypanel{grid-template-columns:1fr}}
.daystack .daypanel.on{opacity:1;visibility:visible;pointer-events:auto;animation:none}
.daypanel .pimg{transition:transform 8s var(--ease)}.daypanel.on .pimg{transform:scale(1.06)}
/* mobile bar 4-up */
@media(max-width:760px){.mcall{display:flex;justify-content:space-around}.mcall a{margin:0}}
/* === home stories === */
.statbig{display:flex;align-items:baseline;gap:.9rem;margin:1.5rem 0 .4rem}
.statbig .fig{font-family:var(--display);font-weight:300;font-size:clamp(3.4rem,7vw,5rem);line-height:.85;color:var(--ink)}
.statbig .unit{font-size:.82rem;color:var(--muted);max-width:13ch;letter-spacing:.04em;line-height:1.3}
.hl{display:flex;flex-direction:column;gap:.9rem;margin:1.3rem 0 .4rem}
.hl .l{display:flex;gap:.75rem;align-items:flex-start}
.hl svg{width:21px;height:21px;color:var(--line);flex-shrink:0;margin-top:2px;stroke-width:1.3}
.hl .l b{font-weight:500;color:var(--ink)}.hl .l p{font-size:.86rem;color:var(--ink-soft);margin-top:1px}
.story-btn{display:inline-flex;align-items:center;gap:.6rem;font-family:var(--body);font-weight:500;letter-spacing:.14em;text-transform:uppercase;font-size:.66rem;color:var(--ink);background:transparent;border:1px solid var(--line);padding:.9rem 1.65rem;border-radius:2px;margin-top:1.6rem;transition:.4s var(--ease)}
.story-btn:hover{background:var(--ink);color:#F7F4ED;border-color:var(--ink);gap:.9rem}
.story-btn .ar{color:var(--line);transition:.4s}.story-btn:hover .ar{transform:translateX(4px);color:#F7F4ED}
/* === editorial story spreads (home) — full-bleed image, copy breathes opposite === */
.story{position:relative;display:grid;grid-template-columns:1.06fr .94fr;align-items:stretch;background:var(--canvas);overflow:hidden}
.story.flip .story-media{order:2}
.story.flip .story-copy{order:1}
.story-media{position:relative;overflow:hidden;min-height:clamp(460px,80vh,880px)}
.story-media .ph{position:absolute;inset:0;background-size:cover;background-position:center;transform:scale(1.06);transition:transform 2.1s var(--ease)}
.story.in .story-media .ph{transform:scale(1)}
.story-media::before{content:"";position:absolute;inset:0;z-index:1;background:linear-gradient(to top,rgba(18,28,38,.42),rgba(18,28,38,0) 40%);pointer-events:none}
.story-media .icap{position:absolute;left:clamp(1.4rem,2.4vw,2.4rem);bottom:clamp(1.2rem,2.2vw,1.9rem);z-index:2;font-size:.58rem;letter-spacing:.3em;text-transform:uppercase;color:rgba(247,244,237,.95)}
.story-media .icap::before{content:"";display:inline-block;width:1.7rem;height:1px;background:var(--line);vertical-align:middle;margin-right:.7rem}
.story-media::after{content:"";position:absolute;inset:0;z-index:3;background:var(--canvas);transition:transform 1.4s var(--ease)}
.story:not(.flip) .story-media::after{transform-origin:right}
.story.flip .story-media::after{transform-origin:left}
.story.in .story-media::after{transform:scaleX(0)}
.story-copy{display:flex;align-items:center;padding:clamp(3.4rem,7vw,7rem) clamp(1.9rem,5.5vw,5.8rem)}
.story-copy-in{max-width:38rem;width:100%}
.story-copy h2{font-family:var(--display);font-weight:300;font-size:clamp(2.2rem,3.6vw,3.4rem);line-height:1.04;margin:.35rem 0 1.1rem}
.story-copy-in>p{color:var(--ink-soft);max-width:44ch;margin-bottom:1.5rem}
@media(max-width:1024px){.story{grid-template-columns:1fr 1fr}}
@media(max-width:900px){
 .story{grid-template-columns:1fr}
 .story.flip .story-media,.story.flip .story-copy{order:0}
 .story-media{min-height:58vh}
 .story-copy{padding:clamp(2.4rem,8vw,3.4rem) clamp(1.4rem,5.4vw,2rem) clamp(3rem,10vw,4rem)}
 .story-copy h2{font-size:clamp(2rem,8vw,2.7rem)}
}
/* === master plan === */
.mplan{display:grid;grid-template-columns:1.5fr 1fr;gap:clamp(2rem,5vw,3.5rem);align-items:center;margin-top:1.8rem}
@media(max-width:820px){.mplan{grid-template-columns:1fr}}
.mplan .pwrap{border:1px solid var(--hair);border-radius:2px;background:var(--canvas-2);padding:clamp(1rem,3vw,1.6rem);position:relative}
.mplan svg.site{width:100%;height:auto;display:block}
.mplan .mk circle{fill:var(--canvas);stroke:var(--ink-soft);stroke-width:1.4;transition:.3s}
.mplan .mk text{font-family:var(--body);font-size:12px;fill:var(--ink-soft);font-weight:600;transition:.3s}
.mplan .mk.hot circle{fill:var(--line);stroke:var(--line)}.mplan .mk.hot text{fill:#11203a}
.mplan .pwm{position:absolute;bottom:.7rem;right:1rem;font-size:.58rem;letter-spacing:.13em;text-transform:uppercase;color:var(--muted)}
.legend{list-style:none}
.legend li{display:flex;gap:.85rem;align-items:center;padding:.5rem 0;border-bottom:1px solid var(--hair);cursor:default;transition:.3s;font-size:.88rem;color:var(--ink-soft)}
.legend li:hover{color:var(--ink)}
.legend .ln{width:25px;height:25px;border-radius:50%;border:1px solid var(--line);display:grid;place-items:center;font-size:.7rem;color:var(--line);flex-shrink:0;transition:.3s}
.legend li:hover .ln{background:var(--line);color:#fff}
.mdisc{font-size:.72rem;color:var(--muted);margin-top:1.5rem;line-height:1.55;max-width:64ch}
.facts{display:grid;grid-template-columns:repeat(4,1fr);gap:1.4rem;border-top:1px solid var(--hair);border-bottom:1px solid var(--hair);padding:1.6rem 0;margin-top:2.2rem}
@media(max-width:680px){.facts{grid-template-columns:1fr 1fr}}
.facts .f2 .n{font-family:var(--display);font-weight:300;font-size:1.9rem;color:var(--ink);line-height:1}
.facts .f2 .t{font-size:.68rem;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);margin-top:.35rem}
.rera-line{display:flex;flex-wrap:wrap;gap:.5rem 1.5rem;align-items:center;margin-top:1.3rem;font-size:.78rem;color:var(--ink-soft)}
.rera-line b{font-family:var(--body);font-weight:600;letter-spacing:.05em;color:var(--ink)}
.rera-line a{color:var(--gold-deep);border-bottom:1px solid var(--line)}
/* === orientation strip (grounds the visitor right after the hero) === */
.orient{background:var(--canvas-2);border-bottom:1px solid var(--hair)}
.orow{display:grid;grid-template-columns:repeat(4,1fr);gap:1.6rem;padding:clamp(1.4rem,3vw,1.9rem) 0 1rem}
.oi{display:flex;flex-direction:column;gap:.35rem;border-left:1px solid var(--hair);padding-left:1.1rem}
.oi:first-child{border-left:none;padding-left:0}
.ol{font-size:.56rem;letter-spacing:.22em;text-transform:uppercase;color:var(--line)}
.ov{font-family:var(--display);font-weight:400;font-size:clamp(1rem,1.6vw,1.18rem);color:var(--ink);line-height:1.25}
.orera{display:flex;flex-wrap:wrap;gap:.4rem 1.1rem;align-items:center;font-size:.66rem;letter-spacing:.06em;color:var(--muted);padding:0 0 1.2rem}
.orera span{font-weight:500;color:var(--ink-soft)}
.orera a{color:var(--gold-deep);border-bottom:1px solid var(--line)}
@media(max-width:820px){.orow{grid-template-columns:1fr 1fr;gap:1.1rem}.oi{border-left:none;padding-left:0}}
@media(max-width:440px){.orow{grid-template-columns:1fr;gap:.9rem}}
/* === sticky section sub-header === */
.subhead{position:fixed;top:0;left:0;right:0;z-index:84;transform:translateY(-110%);transition:transform .5s var(--ease);background:var(--canvas);border-bottom:1px solid var(--hair);box-shadow:0 6px 18px rgba(28,42,56,.07)}
.subhead.show{transform:translateY(var(--navh))}
.sh-inner{display:flex;align-items:center;justify-content:space-between;padding:.55rem clamp(1.5rem,6vw,5rem)}
.sh-left{display:flex;align-items:baseline;gap:.7rem;min-width:0}
.sh-num{font-family:var(--display);font-style:italic;color:var(--line);font-size:1.15rem;line-height:1}
.sh-lab{font-size:.64rem;letter-spacing:.22em;text-transform:uppercase;color:var(--ink);transition:opacity .25s var(--ease),transform .25s var(--ease);white-space:nowrap}
.sh-lab.fade{opacity:0;transform:translateY(-4px)}
.sh-count{font-size:.58rem;letter-spacing:.2em;text-transform:uppercase;color:var(--muted);flex-shrink:0}
.sh-prog{height:2px;background:var(--hair)}
.sh-prog span{display:block;height:100%;width:0;background:linear-gradient(90deg,var(--line-deep),var(--line));transition:width .12s linear}
@media(max-width:940px){:root{--navh:58px}.sh-count{display:none}}
/* motion */
.reveal{opacity:0;transform:translateY(28px);transition:1s var(--ease)}.reveal.in{opacity:1;transform:none}
@keyframes hz{to{transform:scale(1)}}@keyframes rise{to{opacity:1;transform:none}}@keyframes fade{to{opacity:1}}@keyframes grow{to{width:72px}}@keyframes pulse{0%,100%{opacity:.3}50%{opacity:1}}
@media(prefers-reduced-motion:reduce){*{animation-duration:.001s!important;transition-duration:.001s!important}.reveal{opacity:1;transform:none}.duo .big::after,.phead .ph-img::after{transform:scale(0)}.duo .big .ph,.phead .ph-img .ph,.hero .img{transform:none}}
/* ===== RESPONSIVE PASS — mobile & tablet are the primary audience ===== */
img{max-width:100%;height:auto}
html{-webkit-text-size-adjust:100%}
body{overflow-x:hidden}
*{-webkit-tap-highlight-color:rgba(0,0,0,0)}
@media(max-width:1024px){.duo .inset{width:46%}.chapter{gap:clamp(1.8rem,5vw,3.5rem)}}
/* stack the story chapters (phones + small tablets) */
@media(max-width:820px){
 .chapter{grid-template-columns:1fr;gap:1.4rem}
 .chapter .duo,.chapter.flip .duo{order:1}
 .chapter .txt,.chapter.flip .txt{order:2}
 .duo{margin-bottom:1.4rem}
 .band{height:60vh;min-height:360px}
}
/* mobile: inline \`padding:V 0\` on .wrap sections zeroes side padding (masked on desktop by the centered max-width gutter, broken on mobile). Force it back. */
@media(max-width:900px){
 .wrap{padding-left:clamp(1.4rem,5.4vw,2.2rem)!important;padding-right:clamp(1.4rem,5.4vw,2.2rem)!important}
}
/* mobile: keep the duo's overlap image fully inside the column (was bleeding off-screen) */
@media(max-width:820px){
 .chapter .duo .inset,.chapter .duo.r .inset,.chapter .duo.l .inset{position:relative;width:58%;margin:-2.4rem 0 0 auto;left:auto;right:auto;bottom:auto}
 .chapter .duo .cap,.chapter .duo .lbl{text-align:right}
}
/* phones */
@media(max-width:600px){
 .hero h1{font-size:clamp(3.4rem,18vw,5rem)}
 .hero .cta{gap:.5rem}.hero .cta .hbtn{padding:.85rem 1rem;font-size:.6rem}
 .index .row{grid-template-columns:1fr 1fr;gap:.9rem .8rem}
 .index .lead{grid-column:1 / -1;margin-bottom:.2rem}
 .chapter h2{font-size:clamp(2rem,8vw,2.7rem)}
 .chapter p,.hl{max-width:100%}
 .statbig{flex-wrap:wrap;gap:.3rem .9rem}
 .duo .inset{width:54%}
 .band .cap p{font-size:clamp(1.7rem,6.6vw,2.2rem)}
 .worth-lead{font-size:clamp(1.7rem,6.4vw,2.2rem)}
 .enq h2{font-size:clamp(1.9rem,7.4vw,2.5rem);max-width:16ch}
 .enq.wrap{padding-top:clamp(3rem,9vw,4.5rem)!important;padding-bottom:clamp(3rem,9vw,4.5rem)!important}
 .mplan .pwrap{padding:.8rem}
 /* finger-friendly targets */
 .btn,.hbtn,.nbtn,.uchip,.daytab,.story-btn,.seg button{min-height:46px;display:inline-flex;align-items:center;justify-content:center}
 /* stack the enquiry form so nothing overflows */
 .qform{flex-direction:column;gap:.7rem}
 .qform input,.qform select,.qform .btn{width:100%;flex:1 1 100%;min-width:0}
 /* fit the 4-item call bar */
 .mcall{padding:.55rem .3rem}
 .mcall a{flex:1;text-align:center;padding:.5rem .1rem;font-size:.66rem;letter-spacing:.05em;margin:0}
 /* 16px inputs stop iOS auto-zoom */
 .qform input,.qform select,.modal .box input{font-size:16px;min-height:48px}
}
/* small phones */
@media(max-width:380px){
 .hero h1{font-size:clamp(3rem,19vw,4.2rem)}
 .statbig .fig{font-size:2.8rem}
 .chapter h2,.phead h1{font-size:clamp(2.1rem,9vw,2.7rem)}
 .daytab{padding:.5rem .85rem;font-size:.58rem}
 .wrap{padding-left:1.2rem;padding-right:1.2rem}
}
/* upgraded mobile action bar */
.mcall{position:fixed;left:0;right:0;bottom:0;z-index:79;display:none;gap:.35rem;align-items:stretch;justify-content:stretch;background:color-mix(in srgb,var(--canvas) 92%,transparent);backdrop-filter:blur(16px) saturate(1.1);-webkit-backdrop-filter:blur(16px) saturate(1.1);border-top:1px solid var(--hair);box-shadow:0 -8px 22px rgba(28,42,56,.09);padding:.45rem .55rem calc(.45rem + env(safe-area-inset-bottom))}
.mcall a{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.2rem;font-family:var(--body);font-weight:500;font-size:.54rem;letter-spacing:.1em;text-transform:uppercase;color:var(--ink-soft);margin:0;padding:.42rem .15rem;border-radius:9px;transition:.25s var(--ease)}
.mcall a svg{width:19px;height:19px;fill:none;stroke:currentColor;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round;display:block}
.mcall a:active{background:var(--canvas-2)}
.mcall .mc-cta{flex:1.6;background:var(--ink);color:#F7F4ED}
.mcall .mc-cta svg{stroke:var(--line)}
@media(min-width:761px){.mcall{display:none!important}}
@media(max-width:760px){.mcall{display:flex}}

/* ============ STICKY 4-ICON BAR ============ */
.sticky-bar{position:fixed;bottom:0;left:0;right:0;z-index:999;
  display:flex;justify-content:center;gap:0;background:var(--ink);
  box-shadow:0 -2px 30px rgba(14,27,44,.3);padding:0;height:60px}
/* HIDE ON DESKTOP */
@media(min-width:861px){.sticky-bar{display:none !important}}
/* FLOATING PILL ON MOBILE */
@media(max-width:860px){
  .sticky-bar{bottom:20px;left:auto;right:20px;width:auto;height:auto;
    flex-direction:column;gap:0;background:transparent;box-shadow:none;
    padding:8px;border-radius:50px;flex-wrap:wrap;justify-content:flex-end}
}
.sb-btn:hover{background:rgba(193,154,99,.15);color:var(--line)}
.sb-icon{font-size:1.4rem;display:block}
.sb-label{font-size:.62rem;letter-spacing:.1em}
@media(max-width:600px){.sticky-bar{position:fixed;bottom:0;left:0;right:0;z-index:999;
  display:flex;justify-content:center;gap:0;background:var(--ink);
  box-shadow:0 -2px 30px rgba(14,27,44,.3);padding:0;height:60px}
/* HIDE ON DESKTOP */
@media(min-width:861px){.sticky-bar{display:none !important}}
/* FLOATING PILL ON MOBILE */
@media(max-width:860px){
  .sticky-bar{bottom:20px;left:auto;right:20px;width:auto;height:auto;
    flex-direction:column;gap:0;background:transparent;box-shadow:none;
    padding:8px;border-radius:50px;flex-wrap:wrap;justify-content:flex-end}
}.sb-icon{font-size:1.2rem}}
@media(max-width:400px){.sticky-bar{position:fixed;bottom:0;left:0;right:0;z-index:999;
  display:flex;justify-content:center;gap:0;background:var(--ink);
  box-shadow:0 -2px 30px rgba(14,27,44,.3);padding:0;height:60px}
/* HIDE ON DESKTOP */
@media(min-width:861px){.sticky-bar{display:none !important}}
/* FLOATING PILL ON MOBILE */
@media(max-width:860px){
  .sticky-bar{bottom:20px;left:auto;right:20px;width:auto;height:auto;
    flex-direction:column;gap:0;background:transparent;box-shadow:none;
    padding:8px;border-radius:50px;flex-wrap:wrap;justify-content:flex-end}
}
  .sb-icon{font-size:1rem}.sb-label{display:none}}

.form-modal{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(14,27,44,.7);
  display:none;z-index:1000;align-items:center;justify-content:center;backdrop-filter:blur(2px)}
.form-modal.active{display:flex}
.form-modal .form-container{background:#fff;padding:2rem;border-radius:4px;max-width:500px;width:90%;max-height:90vh;overflow-y:auto;animation:slideUp .3s var(--ease)}
@keyframes slideUp{from{transform:translateY(60px);opacity:0}to{transform:translateY(0);opacity:1}}



/* ==========  HEADER (transparent over hero, opaque on scroll) ========== */
#hdr{position:fixed;top:0;left:0;right:0;z-index:90;transition:background 0.35s ease,box-shadow 0.35s ease}
#hdr.solid{background:#F4F1EA !important;backdrop-filter:none !important;box-shadow:0 1px 18px rgba(28,42,56,0.07);border-bottom:1px solid rgba(28,42,56,0.06)}

/* ==========  PROGRESS BAR (top-of-page scroll loader) ========== */
.progress{position:fixed !important;top:0 !important;left:0 !important;height:2px !important;background:linear-gradient(90deg,#A07C4A,#C19A63) !important;z-index:100 !important;transition:width 0.1s linear !important}

/* ==========  HERO — heavier vignette so baked-in video text doesn't compete ========== */
.hero,.hero-section{background:#0E1B2C;position:relative}
.hero-overlay{background:radial-gradient(ellipse at center,rgba(14,27,44,0.45) 0%,rgba(14,27,44,0.75) 60%,rgba(14,27,44,0.9) 100%) !important;z-index:2}
.hero-content{position:relative;z-index:5}
.hero-h1{text-shadow:0 4px 32px rgba(0,0,0,0.55) !important;font-weight:300 !important}
.hero-sub{text-shadow:0 2px 16px rgba(0,0,0,0.55) !important}
.hero-trust{text-shadow:0 2px 12px rgba(0,0,0,0.7) !important}

/* ==========  REVEAL — keep content visible (no JS dep) ========== */
.reveal,.chapter,.phead,.figures,.assure,.wrap,.scard,.sstory__head,.scard__body{opacity:1 !important;transform:none !important;visibility:visible !important}

/* ==========  STICKIES — ONE per device, no double ========== */
/* Desktop: only floating WA pill */
@media(min-width:861px){.sticky-bar,.mcall{display:none !important}.wa{display:grid !important}}
/* Mobile: only bottom sticky-bar (hide everything else) */
@media(max-width:860px){.sticky-bar{display:none !important}.wa{display:none !important}.mcall{display:flex !important}
  /* Hamburger always shows on mobile */
  .hamb{display:flex !important;z-index:99 !important;position:relative;cursor:pointer}
}

/* ==========  HAMBURGER NAV (ensure open works on mobile) ========== */
#hdr nav{z-index:98 !important}
#hdr nav.open{transform:translateX(0) !important}

/* ==========  LOADER smooth fade ========== */
.loader{transition:opacity 0.6s ease,visibility 0.6s ease}
.loader.done{opacity:0;visibility:hidden;pointer-events:none}


    @media(max-width:760px){
      #clubhouse-compare > div > div:nth-child(2){
        grid-template-columns:1fr !important;
        gap:2rem !important;
      }
      #clubhouse-compare > div > div:nth-child(2) > div:nth-child(2){display:none !important}
      #clubhouse-compare > div > div:nth-child(2) > div:first-child{text-align:left !important}
      #clubhouse-compare > div > div:nth-child(2) > div:first-child{padding-bottom:2rem;border-bottom:1px solid rgba(28,42,56,0.08)}
    }
`;
export default css;
