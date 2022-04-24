// Put your database code here
"use strict";

const Database = require('better-sqlite3');

// Create/connect database
const db = new Database('log.db')

// Prepare database
const stmt = db.prepare(`
    SELECT name FROM sqlite_master WHERE type='table' and name='accesslog';`
    );

// Define row
let row = stmt.get();

// Check to see if there is a table or not; If row is 
if (row == undefined){
    // State that the log database is empty
    console.log('Log database is empty. Creating a log database...')

    // Create a constant that will contain SQL commands to initialize database
    const sqlInit = `
        CREATE TABLE accesslog ( 
            id INTEGER PRIMARY KEY, 
            remoteaddr TEXT,
            remoteuser TEXT,
            time TEXT,
            method TEXT,
            url TEXT,
            protocol TEXT,
            httpversion TEXT,
            status TEXT, 
            referrer TEXT,
            useragent TEXT
        );
    `
    db.exec(sqlInit)
} else{
    console.log('A Log database exists.')
}

// Export as a module
module.exports = db
