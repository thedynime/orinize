'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Check, ArrowRight, Link2, ShieldCheck, X } from 'lucide-react';
import { OrinizeBrand, OrinizeIcon } from '../brand';

export default function LoginExperience() {
 const dialog=useRef<HTMLDivElement>(null);
 const [decision,setDecision]=useState<'accepted'|'rejected'|null>(null);
 const [remaining,setRemaining]=useState(3);
 const result=useRef<HTMLHeadingElement>(null);
 const destination=decision==='accepted'?'https://app.dynime.com/orinize':'/';
 useEffect(()=>{
  if(!decision)return;
  result.current?.focus();
  const started=Date.now();
  const timer=window.setInterval(()=>setRemaining(Math.max(0,3-Math.floor((Date.now()-started)/1000))),200);
  const redirect=window.setTimeout(()=>window.location.assign(destination),3000);
  return()=>{window.clearInterval(timer);window.clearTimeout(redirect);};
 },[decision,destination]);
 useEffect(()=>{
  try{document.documentElement.dataset.theme=localStorage.getItem('orinize-site-theme')==='dark'?'dark':'light';}catch{}
  dialog.current?.focus();
  function key(event:KeyboardEvent){
   if(event.key==='Escape'){window.location.assign('/');return;}
   if(event.key!=='Tab')return;
   const items=dialog.current?.querySelectorAll<HTMLElement>('a[href], button, summary');
   if(!items?.length)return;
   const first=items[0],last=items[items.length-1];
   if(event.shiftKey&&(document.activeElement===first||document.activeElement===dialog.current)){event.preventDefault();last.focus();}
   else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
  }
  document.addEventListener('keydown',key);
  return()=>document.removeEventListener('keydown',key);
 },[]);
 return <div className="marketing permission-page">
  <div className="permission-backdrop" aria-hidden="true" inert><div className="permission-background-nav"><OrinizeBrand/><span>Overview　 Features　 Learn　 For work　 Pricing</span><span>Open Orinize ↗</span></div><div className="permission-background-hero"><h1>Intelligence for<br/>Everything You Do.</h1><p>Your AI partner for writing, learning, and getting unstuck.</p><span>Open Orinize ↗</span></div><img src="/images/product-showcase-branded.png" alt="" width="1552" height="1013"/></div>
  <main className="permission-overlay"><div className="permission-dialog" role="dialog" aria-modal="true" aria-labelledby="permission-title" aria-describedby="permission-description" ref={dialog} tabIndex={-1}>
   <Link className="permission-close" href="/" aria-label="Close and return home"><X size={16}/></Link>
   {decision?<div className={`permission-result is-${decision}`}><div className="decision-stamp"><span>{decision==='accepted'?<Check size={25}/>:<X size={25}/>}</span><h2 id="permission-title" ref={result} tabIndex={-1}>{decision==='accepted'?'Accepted':'Rejected'}</h2></div><p id="permission-description">{decision==='accepted'?'Your choice is confirmed. Opening Orinize on Dynime.':'Your choice is confirmed. Returning to the Orinize homepage.'}</p><p className="decision-countdown" role="status">Redirecting in {remaining} {remaining===1?'second':'seconds'}…</p><div className="decision-progress" aria-hidden="true"><span/></div><a className="decision-now" href={destination}>{decision==='accepted'?'Open Orinize now':'Return home now'}<ArrowRight size={14}/></a><p className="permission-preview">Preview only · No account access was granted.</p></div>:<>
   <div className="permission-apps" aria-hidden="true"><OrinizeIcon size={52}/><span><Link2 size={17}/></span><div className="permission-dynime"><img src="/brand/dynime-favicon.png" alt="" width={49} height={49}/></div></div>
   <span className="permission-eyebrow">CONNECT WITH DYNIME</span>
   <h2 id="permission-title">“Orinize” would like to<br/>connect to your Dynime account</h2>
   <p id="permission-description">Your ideas. Your conversations.<br/>Connected through Dynime.</p>
   <div className="permission-request"><div className="permission-request-icon"><ShieldCheck size={20}/></div><div><strong>One connected account</strong><p>Use Dynime to sign in to Orinize. No extra account or password needed.</p></div></div>
   <p className="permission-preview">Permission preview · No account access is granted here.</p>
   <div className="permission-actions"><button onClick={()=>setDecision('rejected')}>Don’t allow</button><button onClick={()=>setDecision('accepted')}>Allow &amp; continue<ArrowRight size={15}/></button></div>
   </>}
   <div className="permission-brand-note">Orinize is a product of Dynime.</div>
  </div></main>
  <footer className="permission-footer">© {new Date().getFullYear()} Orinize. All rights reserved.</footer>
 </div>;
}
