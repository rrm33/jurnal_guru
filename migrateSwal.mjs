import fs from 'fs';
import path from 'path';

const componentsDir = path.join(process.cwd(), 'src', 'components');

const files = fs.readdirSync(componentsDir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(componentsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  let changed = false;

  if (content.includes('alert(') || content.includes('confirm(') || content.includes('window.confirm(')) {
    // Add import statement at the top
    if (!content.includes('swalAlert')) {
      const lines = content.split('\n');
      const importLine = `import { swalAlert, swalConfirm } from "../lib/swalUtils";`;
      lines.splice(1, 0, importLine);
      content = lines.join('\n');
      changed = true;
    }
  }

  // Replace alert( with swalAlert(
  if (content.includes('alert(')) {
    content = content.replace(/\balert\(/g, 'swalAlert(');
    changed = true;
  }

  // Replace confirm( with await swalConfirm(
  if (content.includes('confirm(')) {
    content = content.replace(/\bwindow\.confirm\(/g, 'confirm(');
    content = content.replace(/\bconfirm\(/g, 'await swalConfirm(');
    changed = true;
  }

  // Now, since await swalConfirm is used inside onClick={() => ...}, we must change them to onClick={async () => ...}
  if (content.includes('await swalConfirm')) {
    content = content.replace(/onClick=\{\(\) => \{/g, 'onClick={async () => {');
    content = content.replace(/onClick=\{\(e\) => \{/g, 'onClick={async (e) => {');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${file}`);
  }
}

// Do the same for src/App.tsx
const appPath = path.join(process.cwd(), 'src', 'App.tsx');
let appContent = fs.readFileSync(appPath, 'utf8');
if (appContent.includes('alert(') || appContent.includes('window.confirm(')) {
  if (!appContent.includes('swalAlert')) {
      const lines = appContent.split('\n');
      const importLine = `import { swalAlert, swalConfirm } from "./lib/swalUtils";`;
      lines.splice(2, 0, importLine);
      appContent = lines.join('\n');
  }
  appContent = appContent.replace(/\balert\(/g, 'swalAlert(');
  appContent = appContent.replace(/\bwindow\.confirm\(/g, 'await swalConfirm(');
  appContent = appContent.replace(/const handleLogout = \(\) => \{/g, 'const handleLogout = async () => {');
  fs.writeFileSync(appPath, appContent);
  console.log('Updated App.tsx');
}
