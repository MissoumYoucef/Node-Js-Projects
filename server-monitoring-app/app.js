// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const os = require('os');
const osUtils = require('os-utils');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Endpoint to execute a command
app.post('/execute', (req, res) => {
    const { command } = req.body;
    exec(command, (error, stdout, stderr) => {
        if (error) {
            return res.status(500).send({ error: stderr });
        }
        res.send({ output: stdout });
    });
});

// Endpoint to list directory contents
app.get('/list-directory', (req, res) => {
    const { dirPath } = req.query;
    fs.readdir(dirPath, (err, files) => {
        if (err) {
            return res.status(500).send({ error: err.message });
        }
        res.send({ files });
    });
});

// Endpoint to create a new file
app.post('/create-file', (req, res) => {
    const { filePath, content } = req.body;
    fs.writeFile(filePath, content, (err) => {
        if (err) {
            return res.status(500).send({ error: err.message });
        }
        res.send({ message: 'File created successfully' });
    });
});

// Endpoint to monitor CPU and RAM usage
app.get('/metrics', (req, res) => {
    osUtils.cpuUsage((cpuUsage) => {
        res.send({
            cpuUsage: cpuUsage * 100,
            freeMemory: os.freemem(),
            totalMemory: os.totalmem(),
        });
    });
});

// Serve the frontend
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
