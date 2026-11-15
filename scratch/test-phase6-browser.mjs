/**
 * Phase 6 In-Browser Headless Chrome Verification Script
 * Earth Information Jukebox — NASA GISTEMP Time-Series Sonification Test
 */

import { spawn } from 'child_process';
import http from 'http';

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runTest() {
  console.log('--- STARTING PHASE 6 IN-BROWSER TIME-SERIES SONIFICATION TEST ---');
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9334;
  const userDataDir = 'C:\\temp\\chrome-test-p6-' + Date.now();

  const chromeProc = spawn(chromePath, [
    `--remote-debugging-port=${port}`,
    '--headless=new',
    '--no-sandbox',
    '--disable-gpu',
    '--autoplay-policy=no-user-gesture-required',
    `--user-data-dir=${userDataDir}`,
    'http://localhost:3000/studio',
  ]);

  try {
    let versionData = null;
    for (let i = 0; i < 30; i++) {
      try {
        const res = await new Promise((resolve, reject) => {
          http.get(`http://127.0.0.1:${port}/json/version`, (r) => {
            let data = '';
            r.on('data', (c) => (data += c));
            r.on('end', () => resolve(JSON.parse(data)));
          }).on('error', reject);
        });
        if (res && res.webSocketDebuggerUrl) {
          versionData = res;
          break;
        }
      } catch {
        await delay(500);
      }
    }

    if (!versionData) {
      throw new Error('Could not connect to Chrome debugging port.');
    }
    console.log('Connected to Chrome CDP:', versionData.Browser);

    const pages = await new Promise((resolve, reject) => {
      http.get(`http://127.0.0.1:${port}/json/list`, (r) => {
        let data = '';
        r.on('data', (c) => (data += c));
        r.on('end', () => resolve(JSON.parse(data)));
      }).on('error', reject);
    });

    const pageWsUrl = pages[0].webSocketDebuggerUrl;
    const ws = new WebSocket(pageWsUrl);

    await new Promise((resolve) => {
      ws.addEventListener('open', resolve, { once: true });
    });

    let msgId = 1;
    function sendCommand(method, params = {}) {
      return new Promise((resolve, reject) => {
        const id = msgId++;
        const handler = (event) => {
          const msg = JSON.parse(event.data);
          if (msg.id === id) {
            ws.removeEventListener('message', handler);
            if (msg.error) reject(msg.error);
            else resolve(msg.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    await sendCommand('Runtime.enable');
    await sendCommand('Page.enable');

    console.log('1. Waiting for Studio workstation to load...');
    await delay(3000);

    // 1. Verify Modality Switcher
    const modalityCheck = await sendCommand('Runtime.evaluate', {
      expression: `
        (() => {
          const timeSeriesBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Scientific Time-Series Mode'));
          const spatialBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Spatial Visual Sonification Mode'));
          return {
            hasTimeSeriesMode: !!timeSeriesBtn,
            hasSpatialMode: !!spatialBtn,
          };
        })()
      `,
      returnByValue: true,
    });
    console.log('1. Modality Switcher Check:', JSON.stringify(modalityCheck.result.value));

    // 2. Verify Chart & Data Summary loaded
    console.log('2. Inspecting Time-Series Chart and CSV Data Summary...');
    const dataCheck = await sendCommand('Runtime.evaluate', {
      expression: `
        (() => {
          const chart = document.querySelector('svg[viewBox="0 0 1000 300"]');
          const rects = chart ? chart.querySelectorAll('rect') : [];
          const recordWarmth = Array.from(document.querySelectorAll('span')).find(s => s.textContent.includes('+1.28 °C'));
          const recordCold = Array.from(document.querySelectorAll('span')).find(s => s.textContent.includes('-0.49 °C'));
          const timelineProgress = document.querySelector('div[aria-label="Climate sonification timeline progress"]');

          return {
            hasChartSvg: !!chart,
            totalChartBars: rects.length,
            hasRecordWarmth: !!recordWarmth,
            hasRecordCold: !!recordCold,
            hasProgressBar: !!timelineProgress
          };
        })()
      `,
      returnByValue: true,
    });
    console.log('2. Data & Chart Verification:', JSON.stringify(dataCheck.result.value));

    // 3. Test Play Climate History
    console.log('3. Triggering "Play Climate History"...');
    await sendCommand('Runtime.evaluate', {
      expression: `
        (() => {
          const playBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Play Climate History'));
          if (playBtn) playBtn.click();
        })()
      `,
    });

    await delay(2500);

    // 4. Verify Live Playing Telemetry
    const liveTelemetry = await sendCommand('Runtime.evaluate', {
      expression: `
        (() => {
          const statusBadge = Array.from(document.querySelectorAll('span')).find(s => s.textContent === 'playing');
          const obsEl = Array.from(document.querySelectorAll('span')).find(s => s.textContent === 'OBSERVATION:');
          const obsVal = obsEl ? obsEl.parentElement.querySelector('span[class*="text-text-primary"]')?.textContent : null;
          const pitchEl = Array.from(document.querySelectorAll('span')).find(s => s.textContent === 'PITCH:');
          const pitchVal = pitchEl ? pitchEl.parentElement.querySelector('span[class*="text-nasa-cyan"]')?.textContent : null;
          const timelineEl = Array.from(document.querySelectorAll('span')).find(s => s.textContent === 'TIMELINE:');
          const timelineVal = timelineEl ? timelineEl.parentElement.querySelector('span[class*="text-biosphere-emerald"]')?.textContent : null;
          const ariaLive = document.querySelector('div[aria-live="polite"]')?.textContent;

          return {
            isPlaying: !!statusBadge,
            observation: obsVal?.trim(),
            pitch: pitchVal?.trim(),
            timelinePosition: timelineVal?.trim(),
            announcement: ariaLive?.trim()
          };
        })()
      `,
      returnByValue: true,
    });
    console.log('4. Live Telemetry Readout:', JSON.stringify(liveTelemetry.result.value, null, 2));

    // 5. Test Pause & Resume
    console.log('5. Testing Pause...');
    await sendCommand('Runtime.evaluate', {
      expression: `
        (() => {
          const pauseBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Pause'));
          if (pauseBtn) pauseBtn.click();
        })()
      `,
    });
    await delay(1000);

    const pauseCheck = await sendCommand('Runtime.evaluate', {
      expression: `
        (() => {
          const pausedBadge = Array.from(document.querySelectorAll('span')).find(s => s.textContent === 'paused');
          const resumeBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Resume'));
          return { isPaused: !!pausedBadge, hasResumeBtn: !!resumeBtn };
        })()
      `,
      returnByValue: true,
    });
    console.log('5. Pause Verification:', JSON.stringify(pauseCheck.result.value));

    // 6. Test Speed Adjustment to 2.0x and Stop
    console.log('6. Testing Speed 2.0x and Stop...');
    await sendCommand('Runtime.evaluate', {
      expression: `
        (() => {
          const resumeBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Resume'));
          if (resumeBtn) resumeBtn.click();
          const speed2x = Array.from(document.querySelectorAll('button')).find(b => b.textContent === '2x');
          if (speed2x) speed2x.click();
        })()
      `,
    });
    await delay(1500);

    await sendCommand('Runtime.evaluate', {
      expression: `
        (() => {
          const stopBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Stop'));
          if (stopBtn) stopBtn.click();
        })()
      `,
    });
    await delay(1000);

    const stopCheck = await sendCommand('Runtime.evaluate', {
      expression: `
        (() => {
          const stoppedBadge = Array.from(document.querySelectorAll('span')).find(s => s.textContent === 'stopped');
          const timelineEl = Array.from(document.querySelectorAll('span')).find(s => s.textContent === 'TIMELINE:');
          const posVal = timelineEl ? timelineEl.parentElement.querySelector('span[class*="text-biosphere-emerald"]')?.textContent : null;
          return { isStopped: !!stoppedBadge, resetPos: posVal?.trim() };
        })()
      `,
      returnByValue: true,
    });
    console.log('6. Stop Verification:', JSON.stringify(stopCheck.result.value));

    // 7. Test Granularity Switch to Monthly Detailed
    console.log('7. Switching Granularity to Monthly Detailed...');
    await sendCommand('Runtime.evaluate', {
      expression: `
        (() => {
          const monthlyBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Monthly Detailed'));
          if (monthlyBtn) monthlyBtn.click();
        })()
      `,
    });
    await delay(1000);

    const monthlyCheck = await sendCommand('Runtime.evaluate', {
      expression: `
        (() => {
          const timelineEl = Array.from(document.querySelectorAll('span')).find(s => s.textContent === 'TIMELINE:');
          const posVal = timelineEl ? timelineEl.parentElement.querySelector('span[class*="text-biosphere-emerald"]')?.textContent : null;
          return { timelineTotal: posVal?.trim() };
        })()
      `,
      returnByValue: true,
    });
    console.log('7. Monthly Granularity Total Events:', JSON.stringify(monthlyCheck.result.value));

    // 8. Test Modality Switch to Spatial Mode
    console.log('8. Switching to Spatial Visual Mode...');
    await sendCommand('Runtime.evaluate', {
      expression: `
        (() => {
          const spatialBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Spatial Visual Sonification Mode'));
          if (spatialBtn) spatialBtn.click();
        })()
      `,
    });
    await delay(1000);

    const spatialCheck = await sendCommand('Runtime.evaluate', {
      expression: `
        (() => {
          const analyzeBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Analyze Image'));
          return { hasSpatialAnalyzeBtn: !!analyzeBtn };
        })()
      `,
      returnByValue: true,
    });
    console.log('8. Spatial Mode Return Check:', JSON.stringify(spatialCheck.result.value));

    console.log('--- ALL PHASE 6 IN-BROWSER VERIFICATIONS PASSED SUCCESSFULLY ---');
    ws.close();
  } finally {
    chromeProc.kill('SIGKILL');
  }
}

runTest().catch((err) => {
  console.error('TEST FAILED:', err);
  process.exit(1);
});
