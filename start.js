const { spawn } = require('child_process');
const child_process = require('child_process');

// install Python dependencies from requirements.txt
const installPythonDeps = spawn('pip', ['install', '-r', 'requirements.txt'], { stdio: 'inherit' });

// start the servers
installPythonDeps.on('close', (code) => {
  if (code === 0) {
    console.log('Python dependencies installed successfully.');

    // start the Python server process
    const pythonServer = spawn('gunicorn', ['-b', '0.0.0.0:5000', '--timeout', '120', 'app:app'], {
      stdio: 'inherit', // Inherit stdio to allow logs to be shown in the terminal
    });

    // start the Node.js server process
    const nodeServer = spawn('node', ['server.js'], {
      stdio: 'inherit', // Inherit stdio for Node.js logs
    });

    // handle Python server process exit
    pythonServer.on('close', (code) => {
      console.log(`Python server process exited with code ${code}`);
      if (nodeServer) {
        nodeServer.kill();
      }
    });

    // handle Node.js server process exit
    nodeServer.on('close', (code) => {
      console.log(`Node.js server process exited with code ${code}`);
      if (pythonServer) {
        pythonServer.kill();
      }
    });
  } else {
    console.error(`Failed to install Python dependencies with code ${code}`);
  }
});
