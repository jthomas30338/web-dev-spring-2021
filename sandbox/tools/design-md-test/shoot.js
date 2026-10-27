const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path'), fs = require('fs'), { execFileSync } = require('child_process');
const NM = path.join(__dirname, 'node_modules');
const [file, out] = process.argv.slice(2);
const html = fs.readFileSync(file, 'utf8');
// build Tailwind CSS for this page with the page's own inline config
const m = html.match(/tailwind\.config = (\{[\s\S]*?\});\s*<\/script>/);
const theme = m ? eval('(' + m[1] + ')').theme : {};
fs.writeFileSync('tw.config.js', 'module.exports=' + JSON.stringify({ content: [path.resolve(file)], theme }));
fs.writeFileSync('in.css', '@tailwind base;@tailwind components;@tailwind utilities;');
execFileSync(path.join(NM, '.bin/tailwindcss'), ['-c', 'tw.config.js', '-i', 'in.css', '-o', 'out.css'], { stdio: 'ignore' });
const css = fs.readFileSync('out.css', 'utf8');
const twStub = `window.tailwind={};document.head.insertAdjacentHTML('beforeend',${JSON.stringify('<style>' + css + '</style>')});`;
const F = (pkg, f) => path.join(NM, '@fontsource', pkg, 'files', f);
const fonts = [['Inter',400,'inter','inter-latin-400-normal.woff2'],['Inter',500,'inter','inter-latin-500-normal.woff2'],['Inter',600,'inter','inter-latin-600-normal.woff2'],
  ['IBM Plex Sans',600,'ibm-plex-sans','ibm-plex-sans-latin-600-normal.woff2'],['IBM Plex Sans',700,'ibm-plex-sans','ibm-plex-sans-latin-700-normal.woff2'],
  ['IBM Plex Mono',400,'ibm-plex-mono','ibm-plex-mono-latin-400-normal.woff2'],['IBM Plex Mono',500,'ibm-plex-mono','ibm-plex-mono-latin-500-normal.woff2']];
const fontCss = fonts.map(([fam,w,pkg,f]) => `@font-face{font-family:'${fam}';font-weight:${w};font-style:normal;src:url(https://fonts.gstatic.com/local/${pkg}/${f}) format('woff2');}`).join('\n');
(async () => {
  const browser = await chromium.launch();
  const errors = [];
  for (const [w, h, suffix] of [[1280, 900, ''], [390, 844, '-mobile']]) {
    const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 2 });
    page.on('pageerror', e => errors.push(e.message));
    await page.route('**/*', route => {
      const u = route.request().url();
      if (u.startsWith('file:')) return route.continue();
      if (u.includes('cdn.tailwindcss.com')) return route.fulfill({ body: twStub, contentType: 'text/javascript' });
      if (u.includes('fonts.googleapis.com')) return route.fulfill({ body: fontCss, contentType: 'text/css' });
      const fm = u.match(/fonts\.gstatic\.com\/local\/([^/]+)\/(.+)$/);
      if (fm) return route.fulfill({ path: F(fm[1], fm[2]), contentType: 'font/woff2' });
      if (/react-dom@/.test(u)) return route.fulfill({ path: path.join(NM, 'react-dom/umd', u.split('/').pop()), contentType: 'text/javascript' });
      if (/react@/.test(u)) return route.fulfill({ path: path.join(NM, 'react/umd', u.split('/').pop()), contentType: 'text/javascript' });
      if (/@babel\/standalone/.test(u)) return route.fulfill({ path: path.join(NM, '@babel/standalone/babel.min.js'), contentType: 'text/javascript' });
      if (/xlsx@/.test(u)) return route.fulfill({ path: path.join(NM, 'xlsx/dist/xlsx.full.min.js'), contentType: 'text/javascript' });
      return route.abort();
    });
    await page.goto('file://' + path.resolve(file));
    await page.waitForSelector('h1');
    const rows = page.locator('tbody tr');
    let r = rows.nth(0).locator('input');
    await r.nth(0).fill('Current Account'); await r.nth(1).fill('3000'); await r.nth(2).fill('100'); await r.nth(3).fill('100'); await r.nth(4).uncheck();
    await page.getByText('+ Add Account').click();
    r = rows.nth(1).locator('input');
    await r.nth(0).fill('Proposed Account'); await r.nth(1).fill('3900'); await r.nth(2).fill('260'); await r.nth(3).fill('299');
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(300);
    await page.screenshot({ path: out + suffix + '.png', fullPage: true });
    console.log('fonts used:', await page.evaluate(() => getComputedStyle(document.querySelector('h1')).fontFamily), '| loaded:', await page.evaluate(() => [...document.fonts].filter(f => f.status === 'loaded').length));
    await page.close();
  }
  console.log('errors:', errors.filter(e => !e.includes('Babel')));
  await browser.close();
})();
