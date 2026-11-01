'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, BookOpen, Code2, FileText, Sparkles } from 'lucide-react';
import type { SitePage } from './site-content';

const examples = [
 { label: 'A clearer working day', title: 'The meeting ends. The next step begins.', prompt: 'Turn these meeting notes into decisions, open questions, and an action list. Keep owners unassigned if they are not mentioned.', result: ['Decisions worth keeping', 'Questions still to resolve', 'Actions ready to assign'], link: '/work', category: 'WORK' },
 { label: 'Room for your own voice', title: 'An empty page becomes a first draft.', prompt: 'Help me write a short introduction for my project. Ask who it is for, what problem it solves, and the tone I want.', result: ['A purpose before a paragraph', 'An outline to build on', 'A draft you can make your own'], link: '/features/writing', category: 'CREATE' },
 { label: 'One idea at a time', title: 'The confusing part becomes a good question.', prompt: 'Explain recursion using a simple everyday example. Then give me a small exercise and wait for my answer before explaining the solution.', result: ['An explanation at your level', 'An example that makes it concrete', 'Practice that checks understanding'], link: '/features/study-mode', category: 'LEARN' },
 { label: 'A fresh pair of eyes', title: 'A stubborn bug becomes a smaller problem.', prompt: 'Help me debug this function. Start by comparing expected and actual behavior, then suggest a minimal test before proposing a fix.', result: ['A problem you can reproduce', 'Assumptions made visible', 'A change you can test'], link: '/codex', category: 'BUILD' },
];

export function ScrollReveals({path}:{path:string}) {
 useEffect(() => {
  if (!('IntersectionObserver' in window)) return;
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  let observer: IntersectionObserver | undefined;
  const reset = () => {
   observer?.disconnect();
   document.querySelectorAll('.reveal-pending').forEach(el => el.classList.remove('reveal-pending'));
   if (preference.matches) return;
   observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.remove('reveal-pending'); observer?.unobserve(entry.target); }
   }), { threshold: 0.06 });
   document.querySelectorAll('main > section').forEach(el => {
    if (el.getBoundingClientRect().top > window.innerHeight) { el.classList.add('reveal-pending'); observer?.observe(el); }
   });
  };
  reset(); preference.addEventListener('change', reset);
  return () => { observer?.disconnect(); preference.removeEventListener('change', reset); document.querySelectorAll('.reveal-pending').forEach(el => el.classList.remove('reveal-pending')); };
 }, [path]);
 return null;
}

export function ExploreSections() {
 const track = useRef<HTMLDivElement>(null);
 const [active, setActive] = useState(0);
 function move(index:number) {
  const element = track.current?.children[index] as HTMLElement | undefined;
  if (!element || !track.current) return;
  track.current.scrollTo({left:element.offsetLeft - (track.current.children[0] as HTMLElement).offsetLeft, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
 }
 return <>
  <section className="explore-bento site-width" aria-labelledby="bento-title"><div className="section-title"><div><span className="site-eyebrow">MORE THAN A SINGLE ANSWER</span><h2 id="bento-title">A little help.<br/>A lot of possibility.</h2></div><p>From a loose thought to a useful draft.<br/>Find a way into whatever comes next.</p></div><div className="bento-layout">
   <Link href="/features/writing" className="bento-card bento-writing"><FileText size={26}/><h3>Find the words.<br/>Keep your voice.</h3><p>Shape a story, refine an email, or give your notes a beginning, middle, and end.</p><div className="draft-visual" aria-hidden="true"><small>THE FIRST DRAFT</small><strong>Good ideas start rough.</strong><span/><span/><span/><em>Make this a little more like me.</em></div><span className="bento-link">Explore writing <ArrowUpRight size={17}/></span></Link>
   <Link href="/features/study-mode" className="bento-card bento-learning"><BookOpen size={26}/><h3>Stay with the<br/>interesting question.</h3><p>Break an idea into smaller pieces. Ask why, try an example, then test what you know.</p><div className="learning-visual" aria-hidden="true"><span>Ask</span><i>→</i><span>Explore</span><i>→</i><span>Understand</span></div><span className="bento-link">Explore learning <ArrowUpRight size={17}/></span></Link>
   <Link href="/codex" className="bento-card bento-code"><Code2 size={26}/><h3>Think through the build.</h3><p>Compare approaches, reason about a bug, and understand the code before you use it.</p><code aria-hidden="true"><span>// one clearer next step</span><br/>idea → question → experiment</code><span className="bento-link">Explore coding <ArrowUpRight size={17}/></span></Link>
   <Link href="/features/dots" className="bento-card bento-ideas"><Sparkles size={26}/><h3>Connect the unexpected.</h3><p>Find themes in scattered notes and explore a direction you hadn’t considered.</p><span className="bento-link">Connect your ideas <ArrowUpRight size={17}/></span></Link>
  </div></section>
  <section className="example-slider site-width" aria-labelledby="slider-title" aria-roledescription="carousel"><div className="section-title"><div><span className="site-eyebrow">SMALL CONVERSATIONS. REAL STARTING POINTS.</span><h2 id="slider-title">Picture your next<br/>“that helps” moment.</h2></div><div className="slider-arrows"><button aria-label="Previous example" disabled={active===0} onClick={()=>move(active-1)}><ArrowLeft size={20}/></button><button aria-label="Next example" disabled={active===examples.length-1} onClick={()=>move(active+1)}><ArrowRight size={20}/></button></div></div>
   <p className="slider-note">Illustrative prompts and outcomes. Explore an example, then make it yours.</p>
   <div className="example-track" ref={track} tabIndex={0} aria-label="Workflow examples, swipe or use arrow keys" onKeyDown={e=>{if(e.target===e.currentTarget&&(e.key==='ArrowLeft'||e.key==='ArrowRight')){e.preventDefault();move(Math.max(0,Math.min(examples.length-1,active+(e.key==='ArrowRight'?1:-1))));}}} onScroll={()=>{const el=track.current;if(el){const first=el.children[0] as HTMLElement;const second=el.children[1] as HTMLElement;setActive(Math.max(0,Math.min(examples.length-1,Math.round(el.scrollLeft/(second.offsetLeft-first.offsetLeft)))));}}}>
    {examples.map((example,i)=><article className="example-slide" key={example.category} role="group" aria-roledescription="slide" aria-label={`${i+1} of ${examples.length}: ${example.category}`}><div className="example-story"><span className="site-eyebrow">{example.category} / {example.label}</span><h3>{example.title}</h3><Link href={example.link} className="site-text-link">Explore this workflow<ArrowUpRight size={17}/></Link></div><div className="example-conversation"><span>YOUR STARTING POINT</span><p>{example.prompt}</p><span>WHAT TO WORK TOWARD</span><ul>{example.result.map(result=><li key={result}>{result}</li>)}</ul></div></article>)}
   </div><div className="slider-pagination"><span aria-live="polite">0{active+1} <span>/ 0{examples.length}</span></span><div>{examples.map((example,i)=><button key={example.category} aria-label={`Go to ${example.category.toLowerCase()} example`} aria-pressed={active===i} onClick={()=>move(i)}/>)}</div></div>
  </section>
  <section className="conversation-depth site-width"><span className="site-eyebrow">THE FOLLOW-UP IS WHERE IT GETS INTERESTING</span><h2>You can take the<br/>conversation further.</h2><div className="followup-grid">{[['Change the lens','“What would someone with a different perspective notice?”','Uncover assumptions and compare a reasonable alternative.'],['Find the simplest version','“Explain the essential idea in three sentences.”','Get a starting point you can understand before going deeper.'],['Make it practical','“Turn this into a checklist I can use today.”','Bring an abstract answer closer to your actual task.'],['Keep refining','“What is missing, and what should I check?”','Review the gaps before you use or share the result.']].map(([title,prompt,text])=><article key={title}><h3>{title}</h3><p>{prompt}</p><small>{text}</small></article>)}</div></section>
 </>;
}

export function PagePlaybook({page}:{page:SitePage}) {
 if(page.kind==='policy'||page.path==='policies') return null;
 const steps=page.steps.length ? page.steps : [['Choose a guide','Start with the topic closest to the task in front of you.'],['Try a small example','Use a focused question to find your starting point.'],['Keep exploring','Follow the next question that makes your goal clearer.']];
 return <>
  <section className="page-playbook site-width"><div className="section-title"><div><span className="site-eyebrow">YOUR {page.label.toUpperCase()} PLAYBOOK</span><h2>From a first thought<br/>to a useful outcome.</h2></div><p>{page.description}</p></div><div className="playbook-grid">{steps.slice(0,3).map(([title,text],i)=><article key={title}><span>0{i+1}</span><h3>{title}</h3><p>{text}</p><small>{['Start here','Build on it','Make it yours'][i]}</small></article>)}</div></section>
  <section className="page-takeaway site-width"><div><span className="site-eyebrow">TAKE IT INTO YOUR NEXT CONVERSATION</span><h2>A clearer brief.<br/>A stronger starting point.</h2><p>For {page.label.toLowerCase()}, a useful request brings together the goal, the relevant context, and a way to judge the result.</p><Link href="/resources/prompt-guide" className="site-text-link">Build a better prompt<ArrowUpRight size={17}/></Link></div><blockquote><span>TRY THIS STRUCTURE</span><p>{page.prompt || `I’m exploring ${page.label.toLowerCase()}. Help me identify a useful starting point, explain the options, and choose one small next step.`}</p><footer>Follow up: “What would you need to know to make this more useful?”</footer></blockquote></section>
 </>;
}
