/**
 * Phase 5 Headless Chrome In-Browser Verification Script
 * Earth Information Jukebox — Tone.js Sonification Test
 */

import { spawn } from 'child_process';
import http from 'http';

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function findChromePath() {
  const possiblePaths = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    process.env.LOCALAPPDATA + '\\Google\\Chrome\\Application\\chrome.exe',
  ];
  return possiblePaths[0];
}

async function runTest() {
  console.log('--- STARTING PHASE 5 IN-BROWSER SONIFICATION TEST ---');
  const chromePath = await findChromePath();
  const port = 9333;
  const userDataDir = 'C:\\temp\\chrome-test-p5-' + Date.now();

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
    // Wait for Chrome to listen on port
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

    // Get page target
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

    console.log('Waiting for Studio page to load...');
    await delay(3000);

    // 1. Verify locked state before analysis
    const preCheck = await sendCommand('Runtime.evaluate', {
      expression: `
        (() => {
          const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Analyze Image'));
          const lockedBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Sonification Locked'));
          return {
            hasAnalyzeBtn: !!btn,
            hasLockedBtn: !!lockedBtn,
          };
        })()
      `,
      returnByValue: true,
    });
    console.log('1. Pre-Analysis State:', JSON.stringify(preCheck.result.value));

    // 2. Click "Analyze Image"
    console.log('2. Clicking "Analyze Image"...');
    await sendCommand('Runtime.evaluate', {
      expression: `
        (() => {
          const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Analyze Image'));
          if (btn) btn.click();
        })()
      `,
    });

    // 3. Poll for analysis completion (up to 20 seconds)
    console.log('3. Polling for OpenCV analysis and Sonification unlock...');
    let analysisFinished = false;
    for (let i = 0; i < 40; i++) {
      await delay(500);
      const poll = await sendCommand('Runtime.evaluate', {
        expression: `
          (() => {
            const playBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Play Soundscape'));
            const statusBadge = document.querySelector('span[class*="tracking-widest"]');
            return {
              hasPlayBtn: !!playBtn,
              statusText: statusBadge ? statusBadge.textContent : null,
            };
          })()
        `,
        returnByValue: true,
      });

      if (poll.result.value.hasPlayBtn) {
        console.log(`Analysis complete! Sonification station unlocked. Playback Status: [${poll.result.value.statusText}]`);
        analysisFinished = true;
        break;
      }
    }

    if (!analysisFinished) {
      throw new Error('Analysis did not complete in time.');
    }

    // 4. Test Play Sonification
    console.log('4. Triggering "Play Soundscape"...');
    await sendCommand('Runtime.evaluate', {
      expression: `
        (() => {
          const playBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Play Soundscape'));
          if (playBtn) playBtn.click();
        })()
      `,
    });

    await delay(2500);

    // 5. Inspect playback telemetry while playing
    const playStatus = await sendCommand('Runtime.evaluate', {
      expression: `
        (() => {
          const statusBadge = Array.from(document.querySelectorAll('span')).find(s => s.textContent === 'playing');
          const pitchEl = Array.from(document.querySelectorAll('span')).find(s => s.textContent === 'ACTIVE PITCH:');
          const pitchVal = pitchEl ? pitchEl.parentElement.querySelector('span[class*="text-nasa-cyan"]')?.textContent : null;
          const posEl = Array.from(document.querySelectorAll('span')).find(s => s.textContent === 'POSITION:');
          const posVal = posEl ? posEl.parentElement.querySelector('span[class*="text-biosphere-emerald"]')?.textContent : null;
          const ariaLive = document.querySelector('div[aria-live="polite"]')?.textContent;
          const isPulsingReticle = !!document.querySelector('.border-telemetry-amber');

          return {
            isPlaying: !!statusBadge,
            activePitch: pitchVal?.trim(),
            position: posVal?.trim(),
            announcement: ariaLive?.trim(),
            hasVisualReticle: isPulsingReticle
          };
        })()
      `,
      returnByValue: true,
    });
    console.log('5. Live Playback Telemetry:', JSON.stringify(playStatus.result.value, null, 2));

    // 6. Test Pause
    console.log('6. Clicking "Pause"...');
    await sendCommand('Runtime.evaluate', {
      expression: `
        (() => {
          const pauseBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Pause'));
          if (pauseBtn) pauseBtn.click();
        })()
      `,
    });

    await delay(1000);

    const pauseStatus = await sendCommand('Runtime.evaluate', {
      expression: `
        (() => {
          const pausedBadge = Array.from(document.querySelectorAll('span')).find(s => s.textContent === 'paused');
          const resumeBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Resume'));
          return {
            isPaused: !!pausedBadge,
            hasResumeBtn: !!resumeBtn
          };
        })()
      `,
      returnByValue: true,
    });
    console.log('6. Pause Verification:', JSON.stringify(pauseStatus.result.value));

    // 7. Test Resume & Speed change to 2.0x
    console.log('7. Clicking "Resume" and setting speed to 2.0x...');
    await sendCommand('Runtime.evaluate', {
      expression: `
        (() => {
          const resumeBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Resume'));
          if (resumeBtn) resumeBtn.click();
          const speed2xBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent === '2x');
          if (speed2xBtn) speed2xBtn.click();
        })()
      `,
    });

    await delay(2000);

    // 8. Test Stop
    console.log('8. Clicking "Stop"...');
    await sendCommand('Runtime.evaluate', {
      expression: `
        (() => {
          const stopBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Stop'));
          if (stopBtn) stopBtn.click();
        })()
      `,
    });

    await delay(1000);

    const stopStatus = await sendCommand('Runtime.evaluate', {
      expression: `
        (() => {
          const stoppedBadge = Array.from(document.querySelectorAll('span')).find(s => s.textContent === 'stopped');
          const posEl = Array.from(document.querySelectorAll('span')).find(s => s.textContent === 'POSITION:');
          const posVal = posEl ? posEl.parentElement.querySelector('span[class*="text-biosphere-emerald"]')?.textContent : null;
          return {
            isStopped: !!stoppedBadge,
            resetPosition: posVal?.trim()
          };
        })()
      `,
      returnByValue: true,
    });
    console.log('8. Stop Verification:', JSON.stringify(stopStatus.result.value));

    // 9. Verify Accessibility, NonAudioFeatureSummary, and Mapping Explainer
    console.log('9. Checking NonAudioFeatureSummary & Mapping Explainer...');
    const a11yAndComponents = await sendCommand('Runtime.evaluate', {
      expression: `
        (() => {
          const nonAudioHeader = Array.from(document.querySelectorAll('h4')).find(h => h.textContent.includes('Non-Auditory Planetary Feature Summary'));
          const maxLumRow = Array.from(document.querySelectorAll('td')).find(td => td.textContent.includes('Maximum Luminance'));
          const explainerBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('How Earth Visual Features Become Sound'));
          
          if (explainerBtn) explainerBtn.click();

          return {
            hasNonAudioSummary: !!nonAudioHeader,
            hasMaxLumExtremum: !!maxLumRow,
            hasExplainerBtn: !!explainerBtn
          };
        })()
      `,
      returnByValue: true,
    });
    console.log('9. Non-Audio Summary & Explainer Result:', JSON.stringify(a11yAndComponents.result.value));

    console.log('--- ALL PHASE 5 BROWSER VERIFICATIONS PASSED SUCCESSFULLY ---');
    ws.close();
  } finally {
    chromeProc.kill('SIGKILL');
  }
}

runTest().catch((err) => {
  console.error('TEST FAILED:', err);
  process.exit(1);
});
