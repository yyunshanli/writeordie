FROM node:18

WORKDIR /writeordie

# copy the package.json and package-lock.json files
COPY package*.json ./

# install Node.js dependencies
RUN npm install

# install Python and necessary libraries
RUN apt-get update && apt-get install -y python3 python3-pip python3-venv \
    build-essential libhdf5-dev

# create a virtual environment for Python
RUN python3 -m venv /venv

# copy the requirements.txt file
COPY requirements.txt ./

# install Python dependencies into the virtual environment
RUN /venv/bin/pip install --upgrade pip setuptools wheel
RUN /venv/bin/pip install -r requirements.txt

# copy the application code
COPY . .

# set the environment variable to use the virtual environment's Python
ENV PATH="/venv/bin:$PATH"

# expose the port 
EXPOSE 3000

# start the application
CMD ["npm", "start"]
