# FoT Home Simulator
Data privacy involves protecting personal information from unauthorized access, use, and sharing. Privacy violations can lead to harm, such as identity theft, financial fraud, and the exposure of personal information that could damage a person's reputation and security. The advent of IoT technologies has enriched our daily lives by enabling interconnected devices to generate and collect an increasing amount of data and enabling the creation of more personalized and valuable services. While the IoT promotes many benefits in our everyday lives, from financial transactions to personal communications, it makes personal information even more vulnerable to access by unauthorized third parties worldwide. Its technologies and characteristics have the potential to amplify privacy issues, posing a trade-off between the convenience of the technology's diverse services and users' privacy concerns.

Here, we present a simulation of our proposal, named [FoT-PDS](https://onlinelibrary.wiley.com/doi/abs/10.1002/itl2.512), to address privacy issues in IoT. We adopt a Personal Data Store (PDS) as the storage mechanism and leverage its associated benefits: control, transparency, trust, and awareness. We argue that a PDS serves as a solution to mitigate privacy issues in IoT. A PDS refers to a secure and private repository service dedicated to managing the user's data, allowing them to store, manage, and share personal data and digital assets while controlling who can access and utilize them. In short, the basic idea is that the data remains under the user's control, and any use or processing will only occur with their explicit consent.

As depicted in Figure 1, our proposed scenario encompasses a monitored building and apartments through smart devices. The generated and collected data from devices are stored in your PDS (we are using the [Community Solid Server](https://github.com/CommunitySolidServer/CommunitySolidServer)), and you maintain control over the dissemination, storage, and usage.

<img src="smart-building-scenario.png" alt="Figure 1">

Here, you can find and manage:

- Your data profile;
- Your sensor's data;
- Your clouds' repositories;
- Your granted consent.

This simulation is composed by three components
1. [FoT Simulator](https://github.com/georgepacheco/fot-home-simulator/tree/master/sim)
2. [MQTT Server](https://github.com/georgepacheco/fot-home-simulator/tree/master/mqtt_server)
3. [Solid Server](https://github.com/georgepacheco/fot-home-simulator/tree/master/solid_server)


## Prerequisites

We need to install some tools to run the simulator:

### Docker 27.1.2 or later

### Docker Compose V2.28.1 or later
```bash
# install latest version
$-> sudo curl -L https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose

# Fix permissions after download
$-> sudo chmod +x /usr/local/bin/docker-compose

# Verify success
$-> docker-compose version
```

### NVM
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
```

### Node V20 or later

```bash
# intall node
nvm install 20

# verifies the right Node.js version is in the environment
node -v 

# verifies the right NPM version is in the environment
npm -v 
```

## Installation

Install my-project with npm

```bash
  npm install my-project
  cd my-project
```

 
