#!/usr/bin/env node
/* Local development orchestrator: Ganache + contract deployment + API + Next.js. */
const {spawn,spawnSync}=require('child_process');
const net=require('net');
const path=require('path');
const fs=require('fs');
const root=__dirname;const children=[];
const isWin=process.platform==='win32';
function run(cmd,args,cwd,opts={}){const p=spawn(cmd,args,{cwd,stdio:'inherit',shell:isWin,...opts});children.push(p);return p;}
function sync(cmd,args,cwd){const r=spawnSync(cmd,args,{cwd,stdio:'inherit',shell:isWin});if(r.status!==0)throw Error(`${cmd} ${args.join(' ')} failed (exit ${r.status})`)}
async function portOpen(port){return new Promise(resolve=>{const s=net.createConnection({host:'127.0.0.1',port});s.once('connect',()=>{s.destroy();resolve(true)});s.once('error',()=>resolve(false));s.setTimeout(500,()=>{s.destroy();resolve(false)})})}
async function wait(port,seconds=45){for(let i=0;i<seconds*2;i++){if(await portOpen(port))return;await new Promise(r=>setTimeout(r,500))}throw Error(`Port ${port} did not become ready`)}
function stop(){for(const p of children){try{p.kill('SIGTERM')}catch{}}process.exit(0)}process.on('SIGINT',stop);process.on('SIGTERM',stop);
(async()=>{try{
 console.log('\n=== TrustChain: one-command local launcher ===\n');
 for(const d of ['frontend','backend','blockchain'])if(!fs.existsSync(path.join(root,d,'node_modules')))throw Error(`Missing ${d} dependencies. First run: npm run setup`);
 const ganacheAlready=await portOpen(8545);
 if(!ganacheAlready){console.log('[1/4] Starting local Ganache blockchain on 8545');run(path.join(root,'node_modules','.bin',isWin?'ganache.cmd':'ganache'),['--server.port','8545','--chain.chainId','1337','--wallet.totalAccounts','15','--wallet.defaultBalance','1000','--wallet.mnemonic','test test test test test test test test test test test junk'],root);await wait(8545)}else console.log('[1/4] Using existing blockchain on port 8545 (must be Ganache chain 1337)');
 console.log('[2/4] Compiling and deploying contracts');sync('npx',['hardhat','compile'],path.join(root,'blockchain'));sync('npx',['hardhat','run','scripts/deploy.js','--network','localhost'],path.join(root,'blockchain'));
 console.log('[3/4] Preparing database and starting API');
 if(!(await portOpen(5432))){const docker=spawnSync('docker',['compose','up','-d'],{cwd:root,stdio:'inherit'});if(docker.status!==0)throw Error('PostgreSQL is not running. Start Docker Desktop and retry npm start.');await wait(5432,60)}
 run('npm',['run','dev'],path.join(root,'backend'));
 console.log('[4/4] Starting Next.js frontend');const web=run('npm',['run','dev'],path.join(root,'frontend'));
 console.log('\nOpen http://localhost:3000 when Next.js says Ready.\nAPI: http://localhost:4000/api/health\nMetaMask RPC: http://127.0.0.1:8545 | Chain ID: 1337\nPress Ctrl+C to stop.\n');
 web.on('exit',code=>{if(code!==0)console.error('Frontend stopped. See the error above.');stop()});
 }catch(e){console.error('\nSTARTUP ERROR:',e.message);stopWithError()}})();
function stopWithError(){for(const p of children)try{p.kill('SIGTERM')}catch{}process.exit(1)}
