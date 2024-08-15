const { spawn } = require('child_process');

// Step 1: Install Python dependencies from requirements.txt
const installPythonDeps = spawn('pip', ['install', '-r', 'requirements.txt'], { stdio: 'inherit' });

// When the installation finishes, start the servers
installPythonDeps.on('close', (code) => {
  if (code === 0) {
    console.log('Python dependencies installed successfully.');

    // Step 2: Start the Python server process
    const pythonServer = spawn('gunicorn', ['-b', '0.0.0.0:5000', '--timeout', '120', 'app:app'], {
      stdio: 'inherit', // Inherit stdio to allow logs to be shown in the terminal
    });

    // Step 3: Start the Node.js server process
    const nodeServer = spawn('node', ['server.js'], {
      stdio: 'inherit', // Inherit stdio for Node.js logs
    });

    // Handle Python server process exit
    pythonServer.on('close', (code) => {
      console.log(`Python server process exited with code ${code}`);
      if (nodeServer) {
        nodeServer.kill();
      }
    });

    // Handle Node.js server process exit
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
