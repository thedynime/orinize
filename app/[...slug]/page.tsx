import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Landing from '../landing';
import { sitePages } from '../site-content';
import { getAppUrl } from '../site-config';
export const dynamicParams = false;
export function generateStaticParams() { return [{slug:['overview']}, ...sitePages.map(page=>({slug:page.path.split('/')}))]; }
export async function generateMetadata({params}:{params:Promise<{slug:string[]}>}):Promise<Metadata> {
  const {slug}=await params;
  const page=sitePages.find(p=>p.path===slug.join('/'));
  return {title:page?`${page.label} — Orinize`:'Orinize — Overview',description:page?.description};
}
export default async function Page({params}:{params:Promise<{slug:string[]}>}) {
 const {slug}=await params;
 const path=slug.join('/');
 if(path!=='overview'&&!sitePages.some(p=>p.path===path)) notFound();
 return <Landing appUrl={getAppUrl()} path={path==='overview'?'':path}/>;
}
