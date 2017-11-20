const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.listen(port);

// mock data
const foldersArray = [
    {id: 1, parentid: 0, label: 'Albums'},
    {id: 2, parentid: 1, label: 'Cars'},
    {id: 3, parentid: 1, label: 'Cats'},
    {id: 4, parentid: 1, label: 'Dogs'},
    {id: 5, parentid: 2, label: 'Ford'},
    {id: 6, parentid: 2, label: 'Alfa Romeo'},
    {id: 7, parentid: 5, label: 'Old timers'},
    {id: 8, parentid: 0, label: 'Uploads'},
    {id: 9, parentid: 0, label: 'Old images'},
    {id: 10, parentid: 0, label: 'Backup'},
    {id: 11, parentid: 9, label: 'Birthdays'},
    {id: 12, parentid: 11, label: 'My birthday'},
    {id: 13, parentid: 11, label: 'Children\'s birthday'},
    {id: 14, parentid: 11, label: 'Grandparents'},
];

transformArray = (folders) => {
    const map = {};
    const roots = [];
    let tmpNode;
    let i;
    for (i = 0; i < folders.length; i += 1) {
        // Create map of our tree
        map[folders[i].id] = i;
    }
    
    for (i = 0; i < folders.length; i += 1) {
        tmpNode = folders[i];
        
        if (tmpNode.parentid > 0) {
            // create empty children[] attribute
            if (!folders[map[tmpNode.parentid]].children) {
                folders[map[tmpNode.parentid]].children = [];
            }
            // Push current folder into parent's children array
            folders[map[tmpNode.parentid]].children.push(tmpNode);
        } else {
            // No parent -> push it in root
            roots.push(tmpNode);
        }
    }
    
    return roots;
}

const transformedArray = transformArray(foldersArray);
app.route('/folders').get((req, res) => {
    // const folders = transformArray(foldersArray);
    
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(transformedArray));
});

console.log(`Fetch data: http://localhost:${ port }/folders`);
