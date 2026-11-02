const {spawnSync}=require('child_process');
const fs=require('fs');const path=require('path');
const root=__dirname;
function run(cmd,args,cwd){console.log(`\n> ${cmd} ${args.join(' ')} (${path.relative(root,cwd)||'.'})`);const r=spawnSync(cmd,args,{cwd,stdio:'inherit',shell:process.platform==='win32'});if(r.status!==0)process.exit(r.status||1)}
const major=Number(process.versions.node.split('.')[0]);if(major<20){console.error('Node.js 20 or newer is required.');process.exit(1)}
for(const dir of ['.','blockchain','backend','frontend'])run('npm',['install','--no-audit','--no-fund'],path.join(root,dir));
console.log('\nDependencies installed. Next: npm start\n');
console.log('Start Docker Desktop first if you want the PostgreSQL-backed API.');
