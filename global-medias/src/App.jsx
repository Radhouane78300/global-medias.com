import React, { useState, useEffect, useMemo } from 'react';
import {
  CheckCircle2, ChevronRight, Globe, Facebook, Instagram, Linkedin, Twitter,
  ArrowRight, CreditCard, Settings, MessageSquare, Smartphone, User, LogOut,
  TrendingUp, FileText, Zap, Star, Target, Sparkles, Rocket, Cpu,
  ClipboardCheck, Activity
} from 'lucide-react';

/* ─────────────────────────────────────────────
   WEBHOOKS & STRIPE
   ───────────────────────────────────────────── */
const WEBHOOK_AUDIT_FORM      = "https://n8n-6a9g.onrender.com/webhook-test/formulaire-client";
const WEBHOOK_AUDIT_RESULTS   = "https://n8n-6a9g.onrender.com/webhook-test/audit-results";
const WEBHOOK_PAYMENT_SUCCESS = "https://n8n-6a9g.onrender.com/webhook-test/stripe-payment-success";
const STRIPE_PUBLISHABLE_KEY  = "pk_live_51Sw90nRwX2KzbqjMIiMvkdOrmSdKco3Ml5h0x9CTSybhiy9Gh6LfBrvDamXohKrYuRCCtWdXd5vSwKiXARM1wrCV001FERN6SV";

/* ─────────────────────────────────────────────
   DONNÉES STATIQUES
   ───────────────────────────────────────────── */
const TRUST_LOGOS = [
  { name: "FNAIM" }, { name: "ORPI" }, { name: "CENTURY 21" },
  { name: "GUY HOQUET" }, { name: "LA FORÊT" }, { name: "ERA" },
  { name: "NESTENN" }, { name: "PLAZA IMMOBILIER" }, { name: "CITYA" },
  { name: "FONCIA" }, { name: "PROPRIETES-PRIVEES" }, { name: "LOGIS" },
  { name: "SOTHEBY'S REALTY" }, { name: "IMMOBILIER DE FRANCE" }
];

const TESTIMONIALS = [
  { n: "Marc A.",     r: "Gérant Orpi",          t: "L'audit IA a révélé des opportunités énormes sur Facebook. ROI x3 en deux mois." },
  { n: "Sophie L.",   r: "Dirigeante FNAIM",     t: "Le dashboard est une merveille d'ergonomie. Je pilote tout depuis mon mobile." },
  { n: "Paul V.",     r: "CEO Century 21",       t: "L'estimation budgétaire par l'IA est d'une précision chirurgicale. Bluffant." },
  { n: "Elena R.",    r: "Marketing ERA",        t: "Le tunnel de conversion est fluide, propre et ultra-professionnel." },
  { n: "Karim B.",    r: "Promoteur Immob.",     t: "Une visibilité accrue sur Google My Business grâce aux conseils de l'IA." },
  { n: "Claire P.",   r: "Expert Foncier",       t: "Enfin un outil qui comprend les spécificités du marché immobilier local." },
  { n: "Lucas M.",    r: "Syndic Citya",         t: "Le suivi des leads en temps réel a transformé notre réactivité commerciale." },
  { n: "Nathalie J.", r: "Agence Luxe",          t: "Les recommandations sur Instagram ont attiré une clientèle haut de gamme." },
  { n: "Antoine F.",  r: "Conseiller Logis",     t: "Simple, rapide et efficace. L'audit se fait vraiment en 30 secondes." },
  { n: "Sarah D.",    r: "Indépendante",         t: "Global Médias est devenu mon partenaire n°1 pour ma croissance digitale." },
  { n: "Thomas L.",   r: "Directeur Nestenn",    t: "Le devis automatisé facilite grandement la prise de décision budgétaire." },
  { n: "Julie S.",    r: "Gérante Foncia",       t: "Une interface sécurisée et intuitive pour une gestion parfaite des prospects." }
];

const FAQ_ITEMS = [
  { q: "l'audit ia est-il réellement gratuit et sans engagement ?",            a: "Absolument. Notre scan technologique est conçu pour vous offrir une transparence totale sur votre santé digitale." },
  { q: "quel gain de chiffre d'affaires puis-je espérer avec cette solution ?", a: "Grâce à notre moteur d'intelligence artificielle, nous identifions les canaux marketing où votre investissement sera le plus rentable." },
  { q: "comment analysez-vous la stratégie de mes concurrents directs ?",     a: "L'étape 2 de notre tunnel scanne l'empreinte digitale des acteurs de votre secteur dans votre localité." },
  { q: "combien de temps faut-il pour voir les premiers résultats concrets ?", a: "L'analyse se fait en 30 secondes. Une fois votre devis validé, la mise en place est quasi-instantanée." },
  { q: "comment garantissez-vous la sécurité et la confidentialité de mes données ?", a: "La protection de votre activité est notre priorité. Toutes vos données sont chiffrées." }
];

/* ─────────────────────────────────────────────
   HELPERS
   ───────────────────────────────────────────── */
const calculateDynamicScore = (url, type, baseSeed) => {
  if (!url || url.trim() === "") return Math.floor(Math.random() * 15) + 5;
  let hash = 0;
  const combinedStr = url + type + baseSeed;
  for (let i = 0; i < combinedStr.length; i++) {
    hash = combinedStr.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash % 60) + 35;
};

const getStatutLabel = (score) => {
  if (score < 40) return "Critique";
  if (score < 70) return "Moyen";
  if (score < 85) return "Optimisable";
  return "Excellent";
};

const callWebhook = async (url, data) => {
  try {
    await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  } catch (e) { console.error("Webhook error:", e); }
};

/* ─────────────────────────────────────────────
   CUSTOM SVG ICONS
   ───────────────────────────────────────────── */
const AppleIcon = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="url(#appleGradient)">
    <defs><linearGradient id="appleGradient"><stop offset="0%" stopColor="#D946EF" /><stop offset="100%" stopColor="#F59E0B" /></linearGradient></defs>
    <path d="M17.057 20.28c-.96.947-2.16 1.72-3.414 1.72-1.196 0-1.637-.738-3.093-.738-1.455 0-1.956.717-3.072.738-1.255.02-2.316-.677-3.32-1.72C2.103 18.214 1 15.223 1 12.355c0-4.664 3.037-7.126 6-7.126 1.495 0 2.518.89 3.415.89.877 0 1.576-.89 3.414-.89 2.006 0 3.812 1.05 4.876 2.65-4.144 2.15-3.474 7.68.643 9.352-.73 1.956-1.576 3.93-2.29 5.048zM12.028 4.793c-.02-2.58 2.126-4.71 4.643-4.793.287 2.693-2.35 4.935-4.643 4.793z"/>
  </svg>
);

const GooglePlayIcon = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="url(#googleGradient)">
    <defs><linearGradient id="googleGradient"><stop offset="0%" stopColor="#2563EB" /><stop offset="100%" stopColor="#D946EF" /></linearGradient></defs>
    <path d="M3 20.5v-17c0-.8.6-1.5 1.4-1.5.3 0 .6.1.8.2l14.5 8.5c.7.4.7 1.2 0 1.6L5.2 20.8c-.2.1-.5.2-.8.2-.8 0-1.4-.7-1.4-1.5z"/>
  </svg>
);

const GoogleIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

/* ─────────────────────────────────────────────
   REUSABLE COMPONENTS
   ───────────────────────────────────────────── */
const GlassCard = ({ children, className = "" }) => (
  <div className={`bg-white/5 backdrop-blur-md rounded-[2.5rem] border border-white/10 p-8 ${className}`}>
    {children}
  </div>
);

const GradientTitle = ({ children, className = "", as: Tag = "h1" }) => (
  <Tag className={`bg-clip-text text-transparent bg-gradient-to-r from-[#F59E0B] via-[#F43F5E] to-[#D946EF] font-black tracking-tighter text-center mx-auto block max-w-4xl uppercase ${className}`}>
    {children}
  </Tag>
);

const AppButton = ({ children, variant = 'primary', className = '', onClick, type = "button" }) => {
  const base = "relative px-6 py-2.5 rounded-full font-bold transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden group tracking-wide uppercase text-[10px]";
  const variants = {
    primary:   "bg-gradient-to-r from-[#D946EF] via-[#F43F5E] to-[#F59E0B] text-white shadow-lg hover:scale-105 active:scale-95",
    outline:   "border border-[#D946EF] text-white hover:bg-[#D946EF]/20 shadow-[0_0_10px_rgba(217,70,239,0.2)]",
    secondary: "bg-gradient-to-r from-[#9333EA] to-[#2563EB] text-white hover:opacity-90",
    ghost:     "text-slate-400 hover:text-white"
  };
  return (
    <button type={type} onClick={onClick} className={`${base} ${variants[variant]} ${className}`}>
      <span className="relative z-10">{children}</span>
    </button>
  );
};

/* ─────────────────────────────────────────────
   HEADER
   ───────────────────────────────────────────── */
const Header = ({ setPage }) => (
  <header className="fixed top-0 w-full bg-black/40 backdrop-blur-lg z-50 border-b border-white/5">
    <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => setPage('home')}>
        <Zap className="text-blue-500 w-5 h-5" />
        <span className="text-sm font-black text-white uppercase tracking-tighter">Global Medias</span>
      </div>
      <nav className="hidden md:flex items-center gap-4">
        <AppButton variant="outline" onClick={() => document.getElementById('calendrier')?.scrollIntoView({ behavior: 'smooth' })}>Prendre rendez-vous</AppButton>
        <AppButton variant="secondary" onClick={() => setPage('login')}>Connexion</AppButton>
      </nav>
    </div>
  </header>
);

/* ─────────────────────────────────────────────
   FOOTER
   ───────────────────────────────────────────── */
const Footer = ({ setPage, setLegalTab }) => (
  <footer className="bg-black text-white pt-16 pb-8 border-t border-white/5">
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left items-center md:items-start">
      <div className="flex flex-col items-center md:items-start space-y-4">
        <div className="flex items-center gap-2"><Zap className="text-blue-500 w-6 h-6" /><span className="text-lg font-black uppercase">Global Medias</span></div>
        <div className="flex flex-col gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          <button onClick={() => { setLegalTab('cgv');    setPage('legal'); }} className="hover:text-white transition text-center md:text-left text-xs">Conditions Générales de Vente</button>
          <button onClick={() => { setLegalTab('privacy'); setPage('legal'); }} className="hover:text-white transition text-center md:text-left text-xs">Vie privée</button>
          <button onClick={() => { setLegalTab('cookies'); setPage('legal'); }} className="hover:text-white transition text-center md:text-left text-xs">Cookies</button>
        </div>
        <p className="text-slate-600 text-[9px] mt-4 uppercase text-center md:text-left">Global Médias SAS | 66 avenue des Champs-Élysées, 75008 Paris<br />RCS : 913 597 241 | TVA : FR87913597241</p>
      </div>
      <div className="flex flex-col items-center space-y-6">
        <h3 className="text-xs font-black uppercase text-blue-400">Prêt à décoller ?</h3>
        <div className="flex flex-col gap-3 w-full max-w-[180px] mx-auto">
          <AppButton onClick={() => setPage('audit-form')}>Audit gratuit</AppButton>
          <AppButton variant="outline">Être appelé</AppButton>
        </div>
      </div>
      <div className="flex flex-col items-center md:items-end space-y-6">
        <h4 className="font-bold text-slate-500 uppercase tracking-widest text-[9px]">Bientôt notre application</h4>
        <div className="flex flex-row gap-2 justify-center md:justify-end">
          <div className="relative group cursor-pointer">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#D946EF] to-[#F59E0B] rounded-lg blur-[1px] opacity-20 group-hover:opacity-100 transition duration-500"></div>
            <div className="relative flex items-center gap-1 px-1.5 py-0.5 bg-black rounded-lg border border-white/10">
              <AppleIcon size={12} /><span className="text-[5px] text-slate-500 uppercase font-black">App Store</span>
            </div>
          </div>
          <div className="relative group cursor-pointer">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#2563EB] to-[#D946EF] rounded-lg blur-[1px] opacity-20 group-hover:opacity-100 transition duration-500"></div>
            <div className="relative flex items-center gap-1 px-1.5 py-0.5 bg-black rounded-lg border border-white/10">
              <GooglePlayIcon size={12} /><span className="text-[5px] text-slate-500 uppercase font-black">Google Play</span>
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          {[Facebook, Instagram, Twitter, Linkedin].map((Icon, i) => <Icon key={i} size={18} className="text-slate-600 hover:text-white transition-colors cursor-pointer" />)}
        </div>
      </div>
    </div>
  </footer>
);

/* ─────────────────────────────────────────────
   HOME
   ───────────────────────────────────────────── */
const HomeView = ({ setPage }) => (
  <main className="bg-[#050510] text-white relative min-h-screen overflow-x-hidden">
    {/* HERO */}
    <section className="relative pt-32 pb-20 px-6 flex flex-col items-center text-center max-w-5xl mx-auto z-10">
      <GradientTitle className="text-3xl md:text-5xl lg:text-6xl leading-[1.1] mb-6">Propulsez votre visibilité <br /> digitale avec l'IA</GradientTitle>
      <AppButton className="text-[11px] px-12 py-4 shadow-2xl" onClick={() => setPage('audit-form')}>Découvrir Global Médias</AppButton>
    </section>

    {/* LOGOS CAROUSEL */}
    <section className="pb-20 px-6 max-w-5xl mx-auto">
      <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-600 mb-10 text-center">Ils nous font confiance</p>
      <div className="relative w-full overflow-hidden before:absolute before:left-0 before:top-0 before:z-20 before:h-full before:w-32 before:bg-gradient-to-r before:from-[#050510] before:to-transparent after:absolute after:right-0 after:top-0 after:z-20 after:h-full after:w-32 after:bg-gradient-to-l after:from-[#050510] after:to-transparent">
        <div className="flex gap-20 whitespace-nowrap items-center w-max animate-scroll">
          {TRUST_LOGOS.concat(TRUST_LOGOS).map((brand, i) => (
            <div key={i} className="flex flex-col items-center gap-2 grayscale opacity-40 hover:opacity-100 transition-all cursor-default px-8">
              <span className="text-2xl font-black tracking-tighter italic uppercase">{brand.name}</span>
              <div className="h-[1px] w-full bg-white/20"></div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* 4 ÉTAPES */}
    <section className="py-24 max-w-6xl mx-auto px-6 text-center">
      <h2 className="text-2xl md:text-4xl font-black tracking-tighter mb-16 uppercase">
        Capturez vos clients <GradientTitle as="span" className="inline text-2xl md:text-4xl">en 4 étapes</GradientTitle>
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {[
          { id: "01", t: "Audit",      d: "Diagnostic via nos APIs SEO en temps réel.",      icon: <Rocket        size={40} className="text-blue-500 mb-2 drop-shadow-[0_0_10px_#3B82F655]" /> },
          { id: "02", t: "Analyse IA", d: "Score de performance comparé à vos concurrents.", icon: <Cpu           size={40} className="text-[#D946EF] mb-2 drop-shadow-[0_0_10px_#D946EF55]" /> },
          { id: "03", t: "Stratégie",  d: "Optimisation de votre budget publicitaire.",      icon: <ClipboardCheck size={40} className="text-[#F43F5E] mb-2 drop-shadow-[0_0_10px_#F43F5E55]" /> },
          { id: "04", t: "Pilotage",   d: "Dashboard privé pour suivre vos nouveaux leads.", icon: <Activity      size={40} className="text-[#F59E0B] mb-2 drop-shadow-[0_0_10px_#F59E0B55]" /> }
        ].map((s, i) => (
          <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] flex flex-col items-center space-y-4 hover:border-blue-500/50 transition-all group">
            <div className="group-hover:scale-110 transition-transform">{s.icon}</div>
            <span className="text-3xl font-black text-white/10">{s.id}</span>
            <h4 className="text-xs font-black text-white tracking-widest uppercase">{s.t}</h4>
            <p className="text-slate-500 text-[10px] leading-relaxed uppercase">{s.d}</p>
          </div>
        ))}
      </div>
    </section>

    {/* FAQ */}
    <section className="py-20 max-w-3xl mx-auto px-6 text-center">
      <h2 className="text-xl font-black tracking-tighter mb-12 uppercase text-slate-200">Questions <span className="text-blue-500">Fréquentes</span></h2>
      <div className="space-y-4">
        {FAQ_ITEMS.map((item, i) => (
          <details key={i} className="group bg-white/5 rounded-[1.2rem] border border-white/10 overflow-hidden">
            <summary className="p-4 cursor-pointer list-none flex justify-between items-center group-open:bg-blue-600/10 hover:bg-white/5 relative">
              <span className="w-full text-center pr-4 text-[10px] font-bold text-slate-300 group-open:text-white uppercase">{item.q}</span>
              <ChevronRight size={14} className="group-open:rotate-90 transition-transform absolute right-4 text-blue-400/50" />
            </summary>
            <div className="px-6 pb-6 pt-4 text-slate-400 text-[10px] italic border-t border-white/5 text-center">{item.a}</div>
          </details>
        ))}
      </div>
    </section>

    {/* TESTIMONIALS */}
    <section className="py-20 bg-indigo-900/10 border-y border-white/5 overflow-hidden">
      <h2 className="text-xl font-black uppercase text-center tracking-[0.2em] text-blue-400 mb-12">Leur succès digital commence ici</h2>
      <div className="relative w-full overflow-hidden before:absolute before:left-0 before:top-0 before:z-20 before:h-full before:w-32 before:bg-gradient-to-r before:from-[#050510] before:to-transparent after:absolute after:right-0 after:top-0 after:z-20 after:h-full after:w-32 after:bg-gradient-to-l after:from-[#050510] after:to-transparent">
        <div className="flex gap-6 whitespace-nowrap items-stretch w-max animate-scroll-testimonials">
          {TESTIMONIALS.concat(TESTIMONIALS).map((t, i) => (
            <div key={i} className="w-[300px] p-6 bg-white/5 rounded-2xl border border-white/10 flex flex-col items-center shrink-0">
              <div className="flex justify-center gap-1 mb-4 text-yellow-500">
                {[...Array(5)].map((_, j) => <Star key={j} size={10} className="fill-yellow-500" />)}
              </div>
              <p className="text-[10px] italic mb-6 text-slate-300 whitespace-normal leading-relaxed text-center">"{t.t}"</p>
              <div className="flex flex-col items-center gap-2 mt-auto">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-black text-sm text-white">{t.n[0]}</div>
                <div className="text-center">
                  <div className="text-[11px] font-black text-white uppercase">{t.n}</div>
                  <div className="text-[8px] text-slate-500 font-bold tracking-widest uppercase">{t.r}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* CALENDRIER + CONTACT */}
    <section id="calendrier" className="py-24 px-6 max-w-6xl mx-auto text-center">
      <h2 className="text-2xl md:text-3xl font-black tracking-tighter italic uppercase mb-16">
        Prendre <GradientTitle as="span" className="inline text-2xl md:text-3xl">rendez-vous</GradientTitle>
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="bg-white/5 rounded-[3rem] h-[500px] border border-white/10 overflow-hidden shadow-2xl">
          <iframe src="https://calendly.com/global-medias-sas/30min?hide_landing_page_details=1&hide_gdpr_banner=1" width="100%" height="100%" frameBorder="0" title="Calendly"></iframe>
        </div>
        <div className="bg-white/5 p-8 rounded-[3rem] border border-white/10">
          <h3 className="text-sm font-black mb-6 italic text-white uppercase tracking-widest text-center">Formulaire de contact rapide</h3>
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert("Demande envoyée !"); }}>
            <input className="w-full px-5 py-3 rounded-xl bg-white/5 border border-white/10 outline-none text-xs text-center text-white placeholder:text-slate-600 uppercase" placeholder="NOM DE LA SOCIÉTÉ" required />
            <input className="w-full px-5 py-3 rounded-xl bg-white/5 border border-white/10 outline-none text-xs text-center text-white placeholder:text-slate-600 uppercase" placeholder="PRÉNOM & NOM DU CONTACT" required />
            <input type="tel"   className="w-full px-5 py-3 rounded-xl bg-white/5 border border-white/10 outline-none text-xs text-center text-white placeholder:text-slate-600 uppercase" placeholder="NUMÉRO DE TÉLÉPHONE" required />
            <input type="email" className="w-full px-5 py-3 rounded-xl bg-white/5 border border-white/10 outline-none text-xs text-center text-white placeholder:text-slate-600 uppercase" placeholder="ADRESSE EMAIL" required />
            <AppButton type="submit" className="w-full py-4 text-base rounded-xl shadow-pink-500/10">Envoyer ma demande</AppButton>
          </form>
        </div>
      </div>
    </section>
  </main>
);

/* ─────────────────────────────────────────────
   AUDIT FORM
   ───────────────────────────────────────────── */
const AuditFormView = ({ handleAuditSubmit, loading }) => (
  <main className="pt-32 pb-24 bg-[#050510] text-white min-h-screen px-6 flex flex-col items-center text-center">
    <div className="max-w-3xl w-full">
      <GradientTitle className="text-2xl md:text-4xl mb-3 tracking-widest leading-tight">Audit Visibilité Internet</GradientTitle>
      <div className="bg-white/5 backdrop-blur-md rounded-[3rem] p-10 border border-white/10">
        {loading ? (
          <div className="py-20 text-center space-y-8">
            <div className="w-12 h-12 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] animate-pulse">Analyse IA...</p>
          </div>
        ) : (
          <form onSubmit={handleAuditSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input name="company"  className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 outline-none text-xs text-center text-white placeholder:text-slate-600 uppercase" placeholder="NOM DE L'ÉTABLISSEMENT" required />
            <input name="activity" className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 outline-none text-xs text-center text-white placeholder:text-slate-600 uppercase" placeholder="ACTIVITÉ PRINCIPALE" required />
            <input name="location" className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 outline-none text-xs text-center text-white placeholder:text-slate-600 uppercase" placeholder="LOCALITÉ" required />
            <input name="url_site" className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 outline-none text-xs text-center text-white placeholder:text-slate-600 uppercase" placeholder="URL DU SITE INTERNET" />
            <input name="url_fb"   className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 outline-none text-xs text-center text-white placeholder:text-slate-600 uppercase" placeholder="URL FACEBOOK" />
            <input name="url_insta"className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 outline-none text-xs text-center text-white placeholder:text-slate-600 uppercase" placeholder="URL INSTAGRAM" />
            <input name="budget" type="number" className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 outline-none text-xs text-center text-white placeholder:text-slate-600 uppercase" placeholder="BUDGET MARKETING ANNUEL (€)" />
            <input name="email" type="email"   className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 outline-none text-xs text-center text-white placeholder:text-slate-600 uppercase" placeholder="EMAIL DE CONTACT" required />
            <div className="md:col-span-2">
              <input name="phone" type="tel" className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 outline-none text-xs text-center text-white placeholder:text-slate-600 uppercase" placeholder="NUMÉRO DE TÉLÉPHONE" required />
            </div>
            <div className="md:col-span-2 pt-4 text-center">
              <AppButton type="submit" className="w-full py-5 text-lg rounded-2xl shadow-pink-500/10">Lancer mon audit</AppButton>
            </div>
          </form>
        )}
      </div>
    </div>
  </main>
);

/* ─────────────────────────────────────────────
   AUDIT RESULT
   ───────────────────────────────────────────── */
const AuditResultView = ({ auditData, globalScore, auditResults, setPage }) => (
  <main className="pt-24 pb-20 bg-[#050510] text-white px-6 min-h-screen text-center">
    <div className="max-w-6xl mx-auto space-y-12">
      <GradientTitle className="text-2xl md:text-4xl tracking-widest italic">RÉSULTATS ANALYSE IA</GradientTitle>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Carte latérale */}
        <GlassCard className="lg:col-span-1 space-y-8 h-fit">
          <div className="text-center border-b border-white/5 pb-8 space-y-2">
            <h2 className="text-xl font-black text-white uppercase">{auditData.company || "VOTRE SOCIÉTÉ"}</h2>
            <p className="text-[10px] text-blue-400 uppercase tracking-widest">{auditData.activity}</p>
          </div>
          <div className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">
            <div className="flex flex-col gap-2 items-center text-center">
              <span className="text-blue-400 text-[8px]">SIÈGE SOCIAL</span>
              <span className="text-white">66 AVENUE DES CHAMPS ÉLYSÉES, 75008 PARIS</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2"><span>RCS</span><span className="text-white">913 597 241</span></div>
            <div className="flex justify-between border-b border-white/5 pb-2"><span>Email</span><span className="text-white lowercase">{auditData.email}</span></div>
            <div className="flex justify-between text-blue-400 font-black"><span>Score IA</span><span>{globalScore}%</span></div>
          </div>
        </GlassCard>

        {/* Colonne principale */}
        <div className="lg:col-span-2 space-y-8">
          {/* Synthèse + jauge */}
          <GlassCard className="flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1 w-full space-y-6">
              <h3 className="text-[10px] font-black uppercase text-slate-500 tracking-widest text-center">Synthèse IA (Google / Meta)</h3>
              {auditResults.slice(0, 3).map((s, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-[9px] font-bold uppercase"><span>{s.name}</span><span>{s.score}%</span></div>
                  <div className="h-1 bg-white/5 rounded-full"><div className="h-full bg-blue-500 shadow-[0_0_10px_#3B82F6] rounded-full" style={{ width: `${s.score}%` }}></div></div>
                </div>
              ))}
            </div>
            <div className="relative w-40 h-40 flex items-center justify-center mx-auto">
              <div className="absolute inset-0 rounded-full border-[6px] border-white/5 shadow-inner"></div>
              <div className="absolute inset-0 rounded-full border-[6px] border-emerald-500 border-l-transparent border-b-transparent -rotate-45"></div>
              <span className="text-3xl font-black">{globalScore}%</span>
            </div>
          </GlassCard>

          {/* Tableau */}
          <div className="bg-white/5 rounded-[2.5rem] border border-white/10 overflow-hidden">
            <div className="p-6 border-b border-white/5 bg-white/5 text-center font-black uppercase text-[10px] tracking-widest text-slate-400">Analyses API Rigoureuses</div>
            <div className="overflow-x-auto">
              <table className="w-full text-center text-[10px] uppercase">
                <thead className="bg-black/20 text-slate-500 font-black tracking-widest">
                  <tr><th className="p-5">Source API</th><th className="p-5">Audience</th><th className="p-5">Statut</th><th className="p-5">Score</th></tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {auditResults.map((c, i) => (
                    <tr key={i} className="hover:bg-white/5 transition-all text-white">
                      <td className="p-5 flex items-center justify-center gap-3"><span className="text-blue-400">{c.icon}</span><span className="font-bold tracking-wider">{c.name}</span></td>
                      <td className="p-5 text-slate-400 font-black">{c.visitors}</td>
                      <td className="p-5 text-slate-500 text-[8px] italic">{getStatutLabel(c.score)}</td>
                      <td className="p-5"><span className={`px-2 py-1 rounded-full text-[8px] font-black ${c.score > 70 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>{c.score}%</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* CTA boost */}
          <div className="bg-gradient-to-r from-blue-900/40 to-pink-900/40 p-12 rounded-[3rem] border border-white/10 text-center space-y-6 shadow-2xl">
            <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-white">BOOSTEZ VOTRE CA DE +30%</h2>
            <p className="text-slate-400 text-[10px] max-w-xl mx-auto leading-relaxed italic">L'IA préconise une restructuration budgétaire immédiate pour capter les leads qualifiés.</p>
            <AppButton variant="primary" className="px-10 py-4 text-xs shadow-pink-500/20" onClick={() => setPage('quote')}>Faire un devis <ArrowRight size={14} /></AppButton>
          </div>
        </div>
      </div>
    </div>
  </main>
);

/* ─────────────────────────────────────────────
   QUOTE
   ───────────────────────────────────────────── */
const QuoteView = ({ auditResults, globalScore, setPage }) => {
  const totalHT = auditResults.reduce((acc, curr) => acc + (curr.rec || 0), 0);
  const tva     = totalHT * 0.20;
  const ttc     = totalHT + tva;
  const roiMultiplier        = useMemo(() => Math.max(3, 8 - (globalScore / 20)), [globalScore]);
  const estimatedRevenueGain = Math.round(totalHT * roiMultiplier);

  return (
    <main className="pt-24 pb-20 bg-[#050510] text-white px-6 min-h-screen text-center flex flex-col items-center">
      <div className="max-w-5xl mx-auto space-y-12 w-full">
        <GradientTitle className="text-2xl md:text-4xl italic tracking-widest">Configuration Devis IA</GradientTitle>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recommandations */}
          <div className="lg:col-span-2">
            <GlassCard>
              <h3 className="text-[10px] font-black uppercase text-blue-400 mb-10 text-center tracking-widest">Plan d'Optimisation Budgétaire</h3>
              <div className="space-y-6">
                {auditResults.filter(c => c.rec > 0).map((item, i) => (
                  <div key={i} className="flex flex-col md:flex-row items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400">{item.icon}</div>
                      <div className="text-left">
                        <div className="font-black text-[10px] uppercase text-white tracking-widest">{item.name}</div>
                        <div className="text-[8px] text-slate-500 font-bold uppercase">Optimal IA : {item.rec}€</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-4 md:mt-0 justify-center">
                      <span className="text-lg font-black text-blue-400">{item.rec}€</span>
                      <AppButton variant="secondary" className="min-w-0 p-2"><CheckCircle2 size={12} /></AppButton>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Synthèse financière */}
          <div className="lg:col-span-1">
            <div className="bg-[#0A0A1A] p-10 rounded-[3rem] border border-white/20 shadow-2xl space-y-8">
              <h3 className="text-sm font-black italic tracking-widest text-white uppercase text-center">Synthèse Financière</h3>
              <div className="space-y-4 text-[11px] font-bold uppercase text-white">
                <div className="flex justify-between text-slate-500"><span>Total HT</span><span className="text-white">{totalHT.toFixed(2)}€</span></div>
                <div className="flex justify-between text-slate-500"><span>TVA (20%)</span><span className="text-white">{tva.toFixed(2)}€</span></div>
                <div className="pt-6 border-t border-white/10 flex justify-between items-end">
                  <span className="text-white text-[10px]">TOTAL TTC</span>
                  <span className="text-3xl font-black text-blue-400 tracking-tighter">{ttc.toFixed(2)}€</span>
                </div>
              </div>
              <div className="p-6 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border border-emerald-500/30 rounded-2xl text-center shadow-lg">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <TrendingUp size={14} className="text-emerald-400" />
                  <span className="text-[9px] font-black uppercase text-emerald-300 tracking-wider">Projection de Croissance IA</span>
                </div>
                <div className="text-2xl font-black text-white mt-1">+{estimatedRevenueGain.toLocaleString()}€</div>
                <p className="text-[7px] text-slate-500 mt-2 italic text-center">Chiffre d'affaires supplémentaire estimé</p>
              </div>
              <AppButton variant="primary" className="w-full py-5 text-base rounded-2xl shadow-pink-500/20" onClick={() => setPage('payment')}>Confirmer &amp; Payer</AppButton>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

/* ─────────────────────────────────────────────
   PAYMENT
   ───────────────────────────────────────────── */
const PaymentView = ({ handlePaymentSuccess }) => (
  <main className="pt-32 pb-24 bg-[#050510] text-white px-6 min-h-screen flex flex-col items-center text-center">
    <div className="max-w-lg w-full bg-white/5 border border-white/10 p-12 rounded-[4rem] shadow-2xl space-y-12 backdrop-blur-xl">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center mx-auto border border-blue-500/20 shadow-[0_0_20px_#3B82F633]"><CreditCard size={32} /></div>
        <h1 className="text-xl font-black uppercase tracking-widest">Engagement &amp; Paiement</h1>
        <p className="text-slate-500 text-[9px] uppercase tracking-[0.2em] px-6">Propulsé par Stripe — Activation Dashboard.</p>
      </div>
      <div className="space-y-4">
        <input className="w-full px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-xs font-black text-center text-white placeholder:text-slate-600 uppercase" placeholder="NUMÉRO DE CARTE" />
        <div className="grid grid-cols-2 gap-4">
          <input className="px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-xs font-black text-center text-white placeholder:text-slate-600 uppercase" placeholder="MM / YY" />
          <input className="px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-xs font-black text-center text-white placeholder:text-slate-600 uppercase" placeholder="CVC" />
        </div>
      </div>
      <AppButton variant="primary" className="w-full py-6 text-xl rounded-2xl shadow-pink-500/20" onClick={handlePaymentSuccess}>Finaliser &amp; Décoller</AppButton>
    </div>
  </main>
);

/* ─────────────────────────────────────────────
   CREATE ACCOUNT
   ───────────────────────────────────────────── */
const CreateAccountView = ({ handleAccountCreation }) => (
  <main className="pt-32 pb-24 bg-[#050510] text-white min-h-screen px-6 flex flex-col items-center">
    <GlassCard className="max-w-md w-full text-center space-y-8">
      <GradientTitle as="h2" className="text-2xl italic">Créer votre compte</GradientTitle>
      <p className="text-slate-400 text-[10px] tracking-widest italic leading-relaxed">Félicitations ! Activez votre accès dashboard.</p>
      <div className="space-y-4">
        <button onClick={() => handleAccountCreation()} className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-white text-black font-black text-xs hover:bg-slate-200 transition-all">
          <GoogleIcon /> S'inscrire avec Google
        </button>
        <div className="flex items-center gap-4 text-slate-700 font-black text-[9px] uppercase"><div className="h-px flex-1 bg-white/10"></div>OU<div className="h-px flex-1 bg-white/10"></div></div>
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleAccountCreation(); }}>
          <input type="email"    className="w-full px-5 py-3 rounded-xl bg-white/5 border border-white/10 outline-none text-xs text-center text-white placeholder:text-slate-600 uppercase" placeholder="EMAIL" required />
          <input type="password" className="w-full px-5 py-3 rounded-xl bg-white/5 border border-white/10 outline-none text-xs text-center text-white placeholder:text-slate-600 uppercase" placeholder="MOT DE PASSE" required />
          <AppButton type="submit" className="w-full py-4 text-xs rounded-xl">Activer mon compte</AppButton>
        </form>
      </div>
    </GlassCard>
  </main>
);

/* ─────────────────────────────────────────────
   LOGIN
   ───────────────────────────────────────────── */
const LoginView = ({ handleLogin }) => (
  <main className="pt-32 pb-24 bg-[#050510] text-white min-h-screen px-6 flex flex-col items-center">
    <GlassCard className="max-w-md w-full text-center space-y-8">
      <GradientTitle as="h2" className="text-2xl italic">Connexion Client</GradientTitle>
      <div className="space-y-4">
        <button onClick={() => handleLogin({ preventDefault: () => null })} className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-white text-black font-black text-xs hover:bg-slate-200 transition-all">
          <GoogleIcon /> Continuer avec Google
        </button>
        <div className="flex items-center gap-4 text-slate-700 font-black text-[9px] uppercase"><div className="h-px flex-1 bg-white/10"></div>OU<div className="h-px flex-1 bg-white/10"></div></div>
        <form className="space-y-4" onSubmit={handleLogin}>
          <input type="email"    className="w-full px-5 py-3 rounded-xl bg-white/5 border border-white/10 outline-none text-xs text-center text-white placeholder:text-slate-600 uppercase" placeholder="ADRESSE EMAIL" required />
          <input type="password" className="w-full px-5 py-3 rounded-xl bg-white/5 border border-white/10 outline-none text-xs text-center text-white placeholder:text-slate-600 uppercase" placeholder="MOT DE PASSE" required />
          <AppButton type="submit" className="w-full py-4 text-xs rounded-xl">Accéder au QG</AppButton>
        </form>
      </div>
    </GlassCard>
  </main>
);

/* ─────────────────────────────────────────────
   DASHBOARD
   ───────────────────────────────────────────── */
const DashboardView = ({ auditData, setIsPaid, setPage }) => {
  const [tab, setTab] = useState('clients');
  return (
    <div className="min-h-screen bg-[#050510] text-white flex">
      {/* Sidebar */}
      <aside className="w-72 bg-white/5 m-4 rounded-[2.5rem] flex flex-col fixed inset-y-0 z-50 border border-white/10 shadow-2xl backdrop-blur-xl">
        <div className="p-8 flex items-center justify-center gap-2 cursor-pointer" onClick={() => setPage('home')}>
          <Zap className="text-blue-500 w-6 h-6" /><span className="text-lg font-black tracking-tighter italic text-white uppercase">Global Medias</span>
        </div>
        <nav className="flex-1 px-4 space-y-2 pt-4">
          {[
            { id: 'channels',  n: 'Réseaux & Google',  i: <Globe size={18} /> },
            { id: 'clients',   n: 'Nouveaux prospects', i: <User size={18} /> },
            { id: 'quotes',    n: 'Devis & Factures',   i: <FileText size={18} /> },
            { id: 'settings',  n: 'Paramètres',         i: <Settings size={18} /> },
            { id: 'support',   n: 'Réclamations',       i: <MessageSquare size={18} /> }
          ].map(item => (
            <button key={item.id} onClick={() => setTab(item.id)}
              className={`w-full flex items-center justify-center gap-4 px-6 py-4 rounded-2xl font-black text-[9px] uppercase tracking-widest transition-all ${tab === item.id ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
              {item.i} {item.n}
            </button>
          ))}
        </nav>
        <div className="p-8 border-t border-white/5">
          <button className="flex items-center justify-center gap-4 text-slate-600 hover:text-red-400 font-black text-[10px] uppercase transition-all mx-auto w-full" onClick={() => { setIsPaid(false); setPage('home'); }}>
            <LogOut size={18} /> Déconnexion
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 ml-72 p-10 space-y-10">
        <header className="flex justify-between items-center bg-white/5 p-8 rounded-[2.5rem] border border-white/10 backdrop-blur-lg">
          <div className="space-y-1 text-left">
            <h2 className="text-xl font-black italic tracking-tight uppercase">Espace {auditData.company || "Votre Société"}</h2>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Score IA : 82.4%</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10B981]"></span>
            </div>
          </div>
        </header>

        <div className="bg-white/5 rounded-[3rem] border border-white/10 overflow-hidden min-h-[500px]">
          <div className="p-8 border-b border-white/5 font-black uppercase text-xs tracking-widest text-slate-400 text-center">
            {tab === 'clients' ? "Gestion des Prospects" : tab === 'channels' ? "Détails par Canal" : "Espace Support"}
          </div>
          <div className="p-10">
            {tab === 'clients' ? (
              <div className="overflow-x-auto">
                <table className="w-full text-center text-[11px] uppercase">
                  <thead className="text-slate-500 border-b border-white/5">
                    <tr><th className="pb-6">Nom</th><th className="pb-6">Téléphone</th><th className="pb-6">Source</th><th className="pb-6 text-right">Statut</th></tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {[
                      { n: "Robert M.", t: "06 12 34 56 78", s: <Facebook size={14} />,  st: "Nouveau" },
                      { n: "Alice D.",  t: "07 44 22 11 00", s: <Instagram size={14} />, st: "Traité"  },
                      { n: "Jean M.",   t: "06 99 88 77 66", s: <Globe size={14} />,     st: "Rappel"  }
                    ].map((item, i) => (
                      <tr key={i} className="hover:bg-white/5 transition-all text-white">
                        <td className="py-6 font-bold tracking-widest">{item.n}</td>
                        <td className="py-6 text-slate-400 tracking-widest">{item.t}</td>
                        <td className="py-6 text-blue-400 flex justify-center">{item.s}</td>
                        <td className="py-6 text-right">
                          <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase ${item.st === 'Nouveau' ? 'bg-blue-600/20 text-blue-400' : 'bg-slate-700/20 text-slate-500'}`}>{item.st}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 opacity-20">
                <Sparkles size={64} className="mb-4 text-blue-400" />
                <h4 className="font-black uppercase tracking-widest">Synchronisation...</h4>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

/* ─────────────────────────────────────────────
   LEGAL
   ───────────────────────────────────────────── */
const LegalView = ({ setPage, legalTab }) => {
  const CGV = [
    { title: "Article 1 – DOCUMENTS CONTRACTUELS", body: 'Le Contrat est constitué des présentes Conditions Générales. Elles prévaudront sur toutes clauses et conditions contraires pouvant figurer sur les documents émanant du client. Global Médias définit par « assistance technique » la mobilisation de ressources IA.' },
    { title: "Article 2 – OBJET",                  body: "Global SAS (Global Médias) accepte une mission d'assistance technique et de conseil digital dont la nature est décrite dans les devis validés." },
    { title: "Article 3 – OBLIGATIONS DU CLIENT",  body: "Il appartient au client de fournir les informations nécessaires à la réalisation de la prestation IA et de valider les phases de recette." },
    { title: "Article 4 – OBLIGATIONS DE GLOBAL MÉDIAS", body: "Global Médias apportera son savoir-faire. Les obligations sont des obligations de moyens et ne sauraient être qualifiées d'obligations de résultat." },
    { title: "Article 5 – TARIFICATION ET PAIEMENT", body: "Le prix est indiqué HT sur le devis. Le règlement s'effectue via la plateforme sécurisée Stripe intégrée au site www.Global-medias.com." },
    { title: "Article 6 – PROPRIÉTÉ",              body: "Le prestataire cède au client l'ensemble des droits patrimoniaux nécessaires à l'utilisation commerciale des travaux réalisés après paiement intégral." },
    { title: "Article 7 – FOR COMPÉTENT",          body: "Le contrat est régi par le droit français. Litiges soumis au tribunal de PARIS." }
  ];
  const PRIVACY = [
    { title: "1. INFORMATIONS GÉNÉRALES",  body: "La société GLOBAL SAS, exploitant Global Médias, s'engage à protéger la confidentialité de vos données conformément au RGPD. Responsable : GLOBAL SAS, 66 avenue des champs Élysée 75008 Paris." },
    { title: "2. DONNÉES COLLECTÉES",      body: "Nous collectons : Nom complet, Téléphone, Email, Nom de société via nos formulaires d'audit IA." },
    { title: "3. FINALITÉS",               body: "Répondre à vos demandes d'audit, assurer le fonctionnement du dashboard et respecter nos obligations légales." },
    { title: "4. DESTINATAIRES",           body: "Vos données sont accessibles uniquement aux employés autorisés de GLOBAL SAS. Nous ne vendons pas vos données." },
    { title: "5. SÉCURITÉ",                body: "Protocoles de cryptage AES-256 pour sécuriser l'accès à votre dashboard stratégique." },
    { title: "6. VOS DROITS",              body: "Accès, rectification, effacement. Contact : dpo [at] global-medias [dot] com." }
  ];
  const content = legalTab === 'cgv' ? CGV : PRIVACY;

  return (
    <main className="pt-32 pb-24 px-6 max-w-4xl mx-auto bg-[#050510] min-h-screen text-white flex flex-col items-center">
      <GradientTitle className="text-3xl mb-12 tracking-widest">
        {legalTab === 'cgv' ? 'Conditions Générales de Vente' : 'Politique de Confidentialité'}
      </GradientTitle>
      <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10 text-left text-slate-300 text-xs leading-relaxed space-y-6 overflow-y-auto max-h-[60vh] custom-scrollbar w-full">
        {content.map((s, i) => (
          <section key={i}>
            <h3 className="text-white font-black uppercase mb-1">{s.title}</h3>
            <p>{s.body}</p>
          </section>
        ))}
      </div>
      <AppButton variant="outline" className="mt-16 rounded-xl shadow-pink-500/10" onClick={() => setPage('home')}>Retour Accueil</AppButton>
    </main>
  );
};

/* ─────────────────────────────────────────────
   APP ROOT — routing + état global
   ───────────────────────────────────────────── */
const AppContainer = () => {
  const [page, setPage]                         = useState('home');
  const [loading, setLoading]                   = useState(false);
  const [auditData, setAuditData]               = useState({});
  const [auditResults, setAuditResults]         = useState([]);
  const [globalScore, setGlobalScore]           = useState(0);
  const [isPaid, setIsPaid]                     = useState(false);
  const [isAccountCreated, setIsAccountCreated] = useState(false);
  const [legalTab, setLegalTab]                 = useState('cgv');

  useEffect(() => { window.scrollTo(0, 0); }, [page]);

  const handleAuditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = Object.fromEntries(new FormData(e.target).entries());
    setAuditData(data);
    await callWebhook(WEBHOOK_AUDIT_FORM, { ...data, timestamp: new Date().toISOString() });

    const seed    = data.company || "seed";
    const googleS = calculateDynamicScore(data.url_site,  "goog", seed);
    const fbS     = calculateDynamicScore(data.url_fb,    "fb",   seed);
    const instaS  = calculateDynamicScore(data.url_insta, "inst", seed);

    const results = [
      { id: 'google', name: 'Google Search',    icon: <Globe size={16} />,      visitors: googleS > 30 ? String(googleS * 15) : "80",  score: googleS, rec: 350 + (100 - googleS) * 5 },
      { id: 'fb',     name: 'Facebook Ads',     icon: <Facebook size={16} />,   visitors: fbS > 30     ? String(fbS * 22)     : "120", score: fbS,     rec: 450 + (100 - fbS) * 4 },
      { id: 'inst',   name: 'Instagram Ads',    icon: <Instagram size={16} />,  visitors: instaS > 30  ? String(instaS * 18)  : "95",  score: instaS,  rec: 300 + (100 - instaS) * 6 },
      { id: 'tk',     name: 'TikTok Marketing', icon: <Smartphone size={16} />, visitors: "150",                                        score: calculateDynamicScore(seed, "tk", "rand"), rec: 200 },
      { id: 'gmb',    name: 'G. My Business',   icon: <Target size={16} />,     visitors: data.url_site ? "3,420" : "410",            score: Math.min(googleS + 15, 98), rec: 120 },
      { id: 'tp',     name: 'Trustpilot',       icon: <Star size={16} />,       visitors: "110",                                       score: calculateDynamicScore(data.email, "tp", seed), rec: 80 }
    ];
    const avg = Math.floor(results.reduce((a, c) => a + c.score, 0) / results.length);
    setAuditResults(results);
    setGlobalScore(avg);
    await callWebhook(WEBHOOK_AUDIT_RESULTS, { client: data.email, company: data.company, globalScore: avg, detailedResults: results.map(r => ({ name: r.name, score: r.score })) });
    setTimeout(() => { setLoading(false); setPage('audit-result'); }, 2500);
  };

  const handlePaymentSuccess = async () => {
    setLoading(true);
    await callWebhook(WEBHOOK_PAYMENT_SUCCESS, { email: auditData.email, company: auditData.company, status: "PAID", stripe_key: STRIPE_PUBLISHABLE_KEY });
    setTimeout(() => { setIsPaid(true); setLoading(false); setPage('create-account'); }, 2000);
  };

  const handleAccountCreation = () => {
    setLoading(true);
    setTimeout(() => { setIsAccountCreated(true); setLoading(false); setPage('dashboard'); }, 1500);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (isPaid && isAccountCreated) setPage('dashboard');
    else alert("Veuillez d'abord activer votre compte.");
  };

  const renderContent = () => {
    switch (page) {
      case 'home':           return <HomeView          setPage={setPage} />;
      case 'audit-form':     return <AuditFormView     handleAuditSubmit={handleAuditSubmit} loading={loading} />;
      case 'audit-result':   return <AuditResultView   auditData={auditData} globalScore={globalScore} auditResults={auditResults} setPage={setPage} />;
      case 'quote':          return <QuoteView         auditResults={auditResults} globalScore={globalScore} setPage={setPage} />;
      case 'payment':        return <PaymentView       handlePaymentSuccess={handlePaymentSuccess} />;
      case 'create-account': return <CreateAccountView handleAccountCreation={handleAccountCreation} />;
      case 'login':          return <LoginView         handleLogin={handleLogin} />;
      case 'dashboard':      return <DashboardView     auditData={auditData} setIsPaid={setIsPaid} setPage={setPage} />;
      case 'legal':          return <LegalView         setPage={setPage} legalTab={legalTab} />;
      default:               return <HomeView          setPage={setPage} />;
    }
  };

  return (
    <div className="min-h-screen font-sans bg-black text-white overflow-x-hidden">
      {page !== 'dashboard' && <Header setPage={setPage} />}
      {renderContent()}
      {page !== 'dashboard' && <Footer setPage={setPage} setLegalTab={setLegalTab} />}
    </div>
  );
};

export default AppContainer;
