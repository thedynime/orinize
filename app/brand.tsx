"use client";

import { useEffect, useId, useRef, useState } from 'react';

// The geometry and palette below are the user-supplied official Orinize SVG.
export function OrinizeIcon({size=32,animated=true}:{size?:number;animated?:boolean}) {
 const iconRef=useRef<HTMLSpanElement>(null);
 const id=useId().replace(/[^a-zA-Z0-9_-]/g,'');
 const [gaze,setGaze]=useState({x:0,y:0});
 const [blinking,setBlinking]=useState(false);
 useEffect(()=>{
  if(!animated)return;
  const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
  const timers=new Set<ReturnType<typeof setTimeout>>();
  let frame=0;
  let running=false;
  let lastMove=0;
  function later(fn:()=>void,delay:number){const timer=setTimeout(()=>{timers.delete(timer);if(running)fn();},delay);timers.add(timer);}
  function idle(){later(()=>{if(Date.now()-lastMove>1500){const choices=[{x:0,y:0},{x:1.8,y:-0.6},{x:-1.8,y:0.4},{x:1.6,y:1},{x:0,y:0}];setGaze(choices[Math.floor(Math.random()*choices.length)]);}idle();},2200+Math.random()*2600);}
  function blink(){later(()=>{setBlinking(true);later(()=>{setBlinking(false);if(Math.random()<0.25)later(()=>{setBlinking(true);later(()=>setBlinking(false),110);},120);},140);blink();},2200+Math.random()*3000);}
  function stop(){running=false;timers.forEach(clearTimeout);timers.clear();cancelAnimationFrame(frame);setGaze({x:0,y:0});setBlinking(false);}
  function sync(){stop();if(!motion.matches&&!document.hidden){running=true;idle();blink();}}
  function track(event:PointerEvent){if(!running||event.pointerType!=='mouse')return;cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{if(!running||!iconRef.current)return;const rect=iconRef.current.getBoundingClientRect();if(rect.bottom<0||rect.top>window.innerHeight)return;const dx=event.clientX-rect.left-rect.width/2;const dy=event.clientY-rect.top-rect.height/2;const distance=Math.hypot(dx,dy);if(distance<600){lastMove=Date.now();const factor=Math.min(distance/240,1)*2.4;const angle=Math.atan2(dy,dx);setGaze({x:Math.cos(angle)*factor,y:Math.sin(angle)*factor});}else setGaze({x:0,y:0});});}
  sync();
  motion.addEventListener('change',sync);
  document.addEventListener('visibilitychange',sync);
  window.addEventListener('pointermove',track,{passive:true});
  return()=>{running=false;timers.forEach(clearTimeout);timers.clear();cancelAnimationFrame(frame);motion.removeEventListener('change',sync);document.removeEventListener('visibilitychange',sync);window.removeEventListener('pointermove',track);};
 },[animated]);
 return <span className="orinize-live-icon" ref={iconRef} aria-hidden="true" style={{width:size,height:size}}><svg width="100%" height="100%" viewBox="0 0 32 32" fill="none">
  <defs>
    
    <radialGradient id={`orinizeSphereVolume-${id}`} cx="32%" cy="26%" r="72%">
      <stop offset="0%" stopColor="#93A6FF" />
      <stop offset="20%" stopColor="#6E82FF" />
      <stop offset="50%" stopColor="#5164FF" />
      <stop offset="78%" stopColor="#3748E6" />
      <stop offset="100%" stopColor="#2432BD" />
    </radialGradient>

    
    <radialGradient id={`orinizeTopGlint-${id}`} cx="45%" cy="30%" r="55%">
      <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.45" />
      <stop offset="60%" stopColor="#FFFFFF" stopOpacity="0.12" />
      <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.0" />
    </radialGradient>

    
    <radialGradient id={`orinizeBottomBounce-${id}`} cx="50%" cy="100%" r="45%">
      <stop offset="0%" stopColor="#8093FF" stopOpacity="0.5" />
      <stop offset="100%" stopColor="#8093FF" stopOpacity="0.0" />
    </radialGradient>

    <clipPath id={`orinizeSphereClip-${id}`}>
      <circle cx="16" cy="16" r="16" />
    </clipPath>
  </defs>

  
  <g clipPath={`url(#orinizeSphereClip-${id})`}>
    <circle cx="16" cy="16" r="16" fill={`url(#orinizeSphereVolume-${id})`} />
    <ellipse cx="15" cy="8.5" rx="10.5" ry="6" fill={`url(#orinizeTopGlint-${id})`} transform="rotate(-18 15 8.5)" />
    <ellipse cx="16" cy="30" rx="12" ry="5" fill={`url(#orinizeBottomBounce-${id})`} />
  </g>

  
  <g className="orinize-live-gaze" style={{transform:`translate(${gaze.x}px, ${gaze.y}px)`}}><g className="orinize-live-eyes" style={{transform:blinking?'scaleY(0.08)':'scaleY(1)'}}>
    <rect x="9.5" y="10.5" width="4.2" height="11" rx="2.1" fill="#FFFFFF" />
    <rect x="18.3" y="10.5" width="4.2" height="11" rx="2.1" fill="#FFFFFF" />
  </g></g>
</svg></span>;
}
export function OrinizeBrand(){return <span className="site-wordmark"><OrinizeIcon size={38}/><span className="site-wordmark-copy"><span>Orinize</span><small>a Dynime company</small></span></span>;}
