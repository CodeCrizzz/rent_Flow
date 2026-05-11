const fs = require('fs');
const path = require('path');

const adminDir = path.join('c:', 'Users', 'CodeCrizzz', 'rentflow', 'frontend', 'src', 'app', 'admin');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        const dirPath = path.join(dir, f);
        const isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

walkDir(adminDir, (filePath) => {
    if (!filePath.endsWith('.tsx')) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Remove ambient glows
    content = content.replace(/\s*\{\/\*\s*Ambient Background[a-zA-Z\s]*\*\/\}\s*/gi, '\n            ');
    content = content.replace(/\s*<div className=\"absolute[^>]*blur-\[(100|80)px\][^>]*><\/div>\s*/g, '');

    // Upgrade cards to glassmorphism
    content = content.replace(/bg-white dark:bg-\[\#0a0a0a\]/g, 'bg-linear-to-br from-white/80 to-slate-50/50 dark:from-[#0a0a0a]/80 dark:to-transparent backdrop-blur-2xl');
    
    content = content.replace(/bg-slate-50 dark:bg-\[\#0d0d0d\]\/40/g, 'bg-linear-to-br from-slate-50/80 to-white/50 dark:from-[#0d0d0d]/60 dark:to-transparent backdrop-blur-xl border border-white/60 dark:border-white/10');
    
    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Updated ' + filePath);
    }
});
