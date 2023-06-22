import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const browser = await puppeteer.launch({
    headless: 'new',
    args: [
        '--no-sandbox',
		'--headless',
        '--enable-gpu',
        '--ignore-gpu-blocklist',
    ]
});
let page = await browser.newPage();

await page.goto('chrome://gpu');
const features = await page.evaluate(() => {
    return document.body.getElementsByTagName('info-view')[0].shadowRoot.querySelector('.feature-status-list').innerText;
});

const featuresArray = features.split('\n');

let isOpenGLEnabled = false;
let isCanvasHardwareAccelerated = false;
let isWebGLHardwareAccelerated = false;
let isWebGL2HardwareAccelerated = false;

for (const feature of featuresArray) {
    const [name, value] = feature.split(': ');

    if (name === 'OpenGL' && value === 'Enabled') isOpenGLEnabled = true;
    if (name === 'Canvas' && value === 'Hardware accelerated') isCanvasHardwareAccelerated = true;
    if (name === 'WebGL' && value === 'Hardware accelerated') isWebGLHardwareAccelerated = true;
    if (name === 'WebGL2' && value === 'Hardware accelerated') isWebGL2HardwareAccelerated = true;
}

console.log(`\x1b[${isOpenGLEnabled ? 92 : 91}mOpenGL is ${isOpenGLEnabled ? '' : 'not '}enabled`);
console.log(`\x1b[${isCanvasHardwareAccelerated ? 92 : 91}mCanvas is ${isCanvasHardwareAccelerated ? '' : 'not '}hardware accelerated`);
console.log(`\x1b[${isWebGLHardwareAccelerated ? 92 : 91}mWebGL is ${isWebGLHardwareAccelerated ? '' : 'not '}hardware accelerated`);
console.log(`\x1b[${isWebGL2HardwareAccelerated ? 92 : 91}mWebGL2 is ${isWebGL2HardwareAccelerated ? '' : 'not '}hardware accelerated`);

await page.close();

page = await browser.newPage();

const packages = ['three'];
for(const packageName of packages) {
    let scriptPath;
    if (packageName[0] === '.') {
        scriptPath = path.resolve(__dirname, packageName);
    }
    else {
        const packagePath = path.resolve('./', `node_modules/${packageName}`);
        const rawdata = fs.readFileSync(path.resolve(packagePath, 'package.json'));
        const json = JSON.parse(rawdata);
        scriptPath = path.resolve(packagePath, json.main);
    }

    await page.addScriptTag({ path: scriptPath });
}

const pixel = await page.evaluate(() => {
    const THREE = window.THREE;
    const renderer = new THREE.WebGLRenderer();
    document.body.appendChild(renderer.domElement)
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera();
    camera.position.x = 10;
    camera.lookAt(0, 0, 0);
    const box = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
    scene.add(box);
    const renderTarget = new THREE.WebGLRenderTarget(1, 1);
    renderer.setRenderTarget(renderTarget);
    renderer.render(scene, camera);
    const pixel = new Uint8Array(4);
    renderer.readRenderTargetPixels(renderTarget, 0, 0, 1, 1, pixel);
    return [...pixel];
});

const passed = JSON.stringify([255, 0, 0, 255]) === JSON.stringify(pixel);
console.log(`\x1b[${passed ? 92 : 91}mthree.js rendering test ${passed ? 'passed' : 'failed'}\x1b[0m`);

await page.close();
await browser.close();
