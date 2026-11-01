import { test, expect } from '@playwright/test';
import { sitePages } from '../app/site-content';

test('selected homepage, capability tabs, navigation, and app access',async({page})=>{
 await page.goto('http://localhost:3000/');
 await expect(page.getByRole('heading',{level:1})).toContainText('Intelligence for');
 expect(await page.locator('main > section').count()).toBeGreaterThanOrEqual(10);
 await page.getByRole('tab',{name:'Build confidently'}).click();
 await expect(page.getByRole('tabpanel')).toContainText('Get unstuck.');
 await page.getByRole('tab',{name:'Learn deeply'}).focus();
 await page.keyboard.press('ArrowRight');
 await expect(page.getByRole('tab',{name:'Write clearly'})).toHaveAttribute('aria-selected','true');
 await page.getByRole('button',{name:'Features',exact:true}).click();
 await page.locator('#menu-Features').getByRole('link',{name:'Writing',exact:true}).click();
 await expect(page).toHaveURL(/features\/writing$/);
 await expect(page.getByRole('heading',{level:1})).toContainText('From rough thought');
 for(const link of await page.locator('a.site-button').all()) expect(await link.getAttribute('href')).toBe('/login');
});

test('mobile menu, search, prompt builder, and theme persistence',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto('http://localhost:3000/');
 await page.getByRole('button',{name:'Open menu',exact:true}).click();
 await page.getByRole('button',{name:'Resources',exact:true}).click();
 await page.locator('#menu-Resources').getByRole('link',{name:'Resources',exact:true}).click();
 await page.getByRole('textbox',{name:'Find a guide or resource'}).fill('travel');
 await expect(page.locator('.site-resource-grid > a')).toHaveCount(1);
 await page.getByRole('textbox',{name:'Find a guide or resource'}).fill('no-such-resource-123');
 await expect(page.locator('.site-no-results')).toBeVisible();
 await page.getByRole('button',{name:'Switch to dark mode',exact:true}).click();
 await page.reload();
 await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});

test('every marketing route has at least ten content sections',async({page})=>{
 test.setTimeout(120000);
 for(const route of ['', 'overview', ...sitePages.map(p=>p.path)]){
  const response=await page.goto('http://localhost:3000/'+route);
  expect(response?.status(),route).toBe(200);
  await expect(page.locator('main h1'),route).toHaveCount(1);
  expect(await page.locator('main > section').count(),route).toBeGreaterThanOrEqual(10);
 }
});

test('desktop menus open on hover and close outside the panel',async({page})=>{
 await page.goto('http://localhost:3000/');
 const trigger=page.getByRole('button',{name:'Features',exact:true});
 await trigger.hover();
 await expect(trigger).toHaveAttribute('aria-expanded','true');
 await page.locator('#menu-Features').getByRole('link',{name:'Writing',exact:true}).hover();
 await expect(trigger).toHaveAttribute('aria-expanded','true');
 await page.getByRole('heading',{level:1}).hover();
 await expect(trigger).toHaveAttribute('aria-expanded','false');
});

test('Dynime connection preview collects no credentials and supports deny',async({page})=>{
 await page.goto('http://localhost:3000/');
 await page.locator('.site-header .site-button').click();
 await expect(page).toHaveURL(/\/login\/?$/);
 await expect(page.locator('input')).toHaveCount(0);
 await expect(page.getByRole('dialog')).toBeVisible();
 await expect(page.getByRole('dialog')).toBeFocused();
 await page.getByRole('button',{name:'Don’t allow',exact:true}).click();
 await expect(page.getByRole('dialog',{name:'Rejected',exact:true})).toBeVisible();
 await expect(page.getByRole('status')).toContainText('Redirecting in');
 await expect(page).toHaveURL('http://localhost:3000/');
});
