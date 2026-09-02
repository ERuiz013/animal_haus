const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

walkDir('./src', function(filePath) {
    if (filePath.endsWith('.jsx')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let newContent = content.replace(/`http:\/\/localhost\/rjs_animal_haus\/\$\{([^}]+)\}`/g, 
            '`${window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" ? "http://localhost/rjs_animal_haus/" : "https://eliasruiz1787316067845.1530023.misitiohostgator.com/rjs_animal_haus/"}${ $1 }`'
        );
        
        if (content !== newContent) {
            fs.writeFileSync(filePath, newContent);
            console.log(`Updated ${filePath}`);
        }
    }
});
