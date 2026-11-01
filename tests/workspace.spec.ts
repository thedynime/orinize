import { test, expect } from '@playwright/test';
test('discover categories, save prompt, open from library, and start chat',async({page})=>{
 await page.goto('http://localhost:3000/preview/discover');
 await expect(page.locator('.template-card')).toHaveCount(8);
 await page.getByRole('button',{name:'Development',exact:true}).click();
 await expect(page.locator('.template-card')).toHaveCount(2);
 await page.getByRole('button',{name:'Save A second pair of eyes',exact:true}).click();
 await page.getByRole('link',{name:'My library'}).click();
 await page.getByRole('button',{name:'Saved prompts'}).click();
 await expect(page.locator('.saved-row')).toContainText('A second pair of eyes');
 await page.getByRole('button',{name:'Use prompt'}).click();
 await expect(page.getByRole('textbox',{name:'Message Orinize'})).toHaveValue(/thoughtful senior engineer/);
 await page.getByRole('button',{name:'Send message'}).click();
 await expect(page.getByRole('button',{name:'Regenerate'})).toBeVisible();
 await page.getByRole('link',{name:'My library'}).click();
 await expect(page.locator('.library-row')).toHaveCount(1);
 await page.locator('.library-row').getByRole('button',{name:/Open/}).click();
 await expect(page.locator('.message.assistant')).toContainText('demo conversation');
});
test('settings appearance persists across pages and exports valid history',async({page})=>{
 await page.goto('http://localhost:3000/preview/settings');
 await page.getByRole('button',{name:'dark',exact:true}).click();
 await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
 const downloadEvent=page.waitForEvent('download');
 await page.getByRole('button',{name:'Export data'}).click();
 const download=await downloadEvent;
 expect(download.suggestedFilename()).toBe('orinize-conversations.json');
 await expect(page.getByRole('status')).toContainText('exported');
 await page.getByRole('link',{name:'Discover'}).click();
 await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
 await page.reload();
 await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
});
test('all pages fit mobile and desktop with keyboard-accessible navigation',async({page})=>{
 for(const viewport of [{width:1440,height:900},{width:390,height:844}]){
 await page.setViewportSize(viewport);
 for(const route of ['chat','discover','library','settings']){
 await page.goto('http://localhost:3000/preview/'+route);
 await expect(page.locator('h1')).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.screenshot({path:`artifacts/redesign-${viewport.width}-${route||'chat'}.png`});
 }
 }
 await page.getByRole('button',{name:'Open navigation'}).click();
 await expect(page.getByRole('link',{name:'Discover'})).toBeVisible();
 await page.keyboard.press('Escape');
 await expect(page.locator('.sidebar')).not.toBeVisible();
});
