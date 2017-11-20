const FOLDER_ID = 7;

var fetch = require('node-fetch');

/*
Async fetch data and return it as json if successful
*/
fetchData = async () => {
    return await fetch('http://localhost:3000/folders').then((response) => {
        if (response.ok) {
            return response.json();
        }
        return Promise.reject(new Error('Couldn\'t fetch data !'));
    });
}

/*
Recursively get current folder by id from folder tree object
*/
getCurrentFolder = (id, folders) => {
    var current = {};
    let i;
    
    for (i = 0; i < folders.length; i++) {
        if (folders[i].id === id) {
            return folders[i];
        }
        if (folders[i].children) {
            const childFolder = getCurrentFolder(id, folders[i].children);
            if (childFolder) {
                return childFolder;
            }
        }
    }
    
    return false;
}

/*
 Recursively draw tree view:
 
 > Albums
   > Albums child
     > Albums sub-child
     > Another sub-child
   > Another albums child
 > Another root folder
*/
drawTree = (folders, depth) => {
    return folders.map(folder => {
        let line = " ".repeat(depth) + '> ';
        line += `${ folder.label } (id: ${ folder.id })`;
        
        if (folder.children) {
            // console.log('has children', folder.children);
            line += '\n' + drawTree(folder.children, depth + 1);
        }
        
        return line;
    }).join('\n');
}

/*
 Recursively draw breadcrumbs from first parent:
 
 Home > Child > Child > Child
*/
drawBreadcrumbs = (id, folders) => {
    let i;
    let output = "";
    
    for (let i = 0; i < folders.length; i++) {
        if (folders[i].id === id) {
            output += folders[i].label;
            break;
        }
        if (folders[i].children) {
            tmpOutput = drawBreadcrumbs(id, folders[i].children);
            if (tmpOutput) {
                output += folders[i].label + ' > ' + tmpOutput;
                break;
            }
        }
    }
    return output;
}

console.log("Fetch data ...");
fetchData().then((folders) => {    
    console.log("Drawing tree view:");
    const tree = drawTree(folders, 0);
    console.log(tree);
    console.log();

    const current = getCurrentFolder(FOLDER_ID, folders);
    console.log(`Folder with ID ${ FOLDER_ID }`);
    console.log('\x1b[32m', current.label);
    console.log('\x1b[0m');
    
    const breadcrumbs = drawBreadcrumbs(FOLDER_ID, folders);
    console.log('Breadcrumbs:');
    console.log('\x1b[32m', breadcrumbs);
    console.log('\x1b[0m');
    
}).catch(e => console.log('Error stack', e));
