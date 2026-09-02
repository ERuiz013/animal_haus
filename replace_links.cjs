const fs = require('fs');

const path = 'c:/Users/elias/Dropbox/htdocs/rjs_animal_haus/src/components/layout/navbar/index_adm.jsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Add handleNavigation
const handleNavCode = `    const handleMenuClose = (setter) => () => setter(null);

    const handleNavigation = (e, path, setter = null) => {
        e.preventDefault();
        window.history.pushState({}, '', path);
        window.dispatchEvent(new Event('popstate'));
        if (setter) {
            setter(null);
        } else if (mobileOpen) {
            setMobileOpen(false);
        }
    };`;

content = content.replace('    const handleMenuClose = (setter) => () => setter(null);', handleNavCode);

// 2. Replace ListItemButton links (mobile)
// <ListItemButton sx={{ pl: 4 }} component="a" href="/admin/ventas" onClick={handleDrawerToggle}>
content = content.replace(/<ListItemButton sx=\{\{ pl: 4 \}\} component="a" href="([^"]+)" onClick=\{handleDrawerToggle\}>/g, '<ListItemButton sx={{ pl: 4 }} onClick={(e) => handleNavigation(e, \'$1\')}>');

// 3. Replace MenuItem links (desktop)
// <MenuItem component="a" href="/admin/ventas" onClick={handleMenuClose(setAnchorElVentas)}>
content = content.replace(/<MenuItem component="a" href="([^"]+)" onClick=\{handleMenuClose\(([^)]+)\)\}>/g, '<MenuItem onClick={(e) => handleNavigation(e, \'$1\', $2)}>');

// 4. Replace Logo link
content = content.replace(/component="a"\s+href="\/admin"\s+sx=\{\{/g, `onClick={(e) => handleNavigation(e, '/admin')}
                            sx={{ cursor: 'pointer',`);

fs.writeFileSync(path, content, 'utf8');
console.log('Done replacing links');
