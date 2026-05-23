const fs = require('fs');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = dir + '/' + file;
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if (file.endsWith('.tsx')) results.push(file);
        }
    });
    return results;
}

const files = walk('frontend/src/app/tenant');
let fixedCount = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    const original = content;
    
    // Remove glass noise for smoothness
    content = content.replace(/<div className="absolute inset-0 glass-noise z-0 pointer-events-none"><\/div>\r?\n?/g, '');
    
    // Replace various linear gradients with a smooth, solid background
    // Common pattern 1: bg-linear-to-br from-white/80 to-neutral-50/50 dark:from-white/[0.08] dark:to-transparent
    content = content.replace(/bg-linear-to-br from-white\/80 to-neutral-50\/50 dark:from-white\/\[0\.08\] dark:to-transparent/g, 'bg-white dark:bg-[#121212]');
    
    // Common pattern 2: bg-linear-to-b from-white/40 to-white/10 dark:from-white/[0.04] dark:to-transparent
    content = content.replace(/bg-linear-to-b from-white\/40 to-white\/10 dark:from-white\/\[0\.04\] dark:to-transparent/g, 'bg-neutral-50/50 dark:bg-[#18181a]');

    // Pattern for mobile cards: bg-white/40 dark:bg-white/[0.02]
    content = content.replace(/bg-white\/40 dark:bg-white\/\[0\.02\]/g, 'bg-white dark:bg-[#121212]');

    // Remove border-white/40 dark:border-white/10 if it conflicts with solid background, or make it subtle
    content = content.replace(/border-white\/40 dark:border-white\/10/g, 'border-neutral-200/50 dark:border-white/5');

    if (content !== original) {
        fs.writeFileSync(file, content);
        console.log('Smoothed backgrounds in:', file);
        fixedCount++;
    }
});

console.log('Total files smoothed:', fixedCount);
