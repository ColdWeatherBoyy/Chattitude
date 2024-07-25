<div style="display: flex; align-items: center; gap: 10px;">
  <a href="https://opensource.org/licenses/MIT">
    <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT" height="20">
  </a>
  <a href="https://github.com/ColdWeatherBoyy/chattitude/graphs/contributors">
    <img src="https://img.shields.io/github/contributors/ColdWeatherBoyy/chattitude.svg?style=for-the-badge" alt="Contributors" height="20">
  </a>
  <a href="https://github.com/ColdWeatherBoyy/chattitude">
      <img src="https://img.shields.io/badge/GitHub-Repo-0D968B?logo=github" alt="Repo Link" height="20">
  </a>
  <a href="https://physicaltherapytimers.eliassz.com">
      <img src="https://img.shields.io/badge/Live-Site-2F4858" alt="Live Site Link" height="20">
  </a>
</div>
<br />
<div style="text-align:center">
  <h1>Chattitude</h1>
  <h2><a href="https://chattitude.eliassz.com">View Live Site Here</a></h2>
</div>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#about-the-project">About The Project</a>
    <li><a href="#built-with">Built With</a></li>
    <li><a href="#installation">Installation</a></li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

## About the Project

This is a messaging app built to use WebSockets. As an additional exercise, I built user authentication for this app from scratch. The site features a global chat for all users, a record of who is online, and the ability to scroll through chat history. It has full account persistence and updateability and a persisting chat history. It was scaffolded with Vite and built with React, Express, Node.js, MongoDB, and Chakra UI.

It was started/conceived of in partnership with [David Keim](https://github.com/keimdm), but mostly built by myself.

## Built With

<div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap; padding-left: 20px;">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" height="25">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" height="25">
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" height="25">
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js" height="25">
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" height="25">
  <img src="https://img.shields.io/badge/React–Use–Websocket-blue?style=for-the-badge" alt="React Use Websockets" height="25"/>
  <img src="https://img.shields.io/badge/WS-Websockets-blue?style=for-the-badge" alt="WS" height="25"/>
  <img src="https://img.shields.io/badge/Chakra%20UI-319795?style=for-the-badge&logo=chakra-ui&logoColor=white" alt="Chakra UI" height="25">
  <img src="https://img.shields.io/badge/bcrypt-%23FFCA28.svg?style=for-the-badge&logo=bcrypt&logoColor=white" alt="bcrypt" height="25">
  <img src="https://img.shields.io/badge/jwt-%23000000.svg?style=for-the-badge&logo=json-web-tokens&logoColor=white" alt="jwt" height="25">
  <img src="https://img.shields.io/badge/Vite-000000?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" height="25"> 
  <img src="https://img.shields.io/badge/Heroku-430098?style=for-the-badge&logo=heroku&logoColor=white" alt="Heroku" height="25">

</div>

## Installation

1. **Clone the repository**: First, clone the repository to your local machine. Install the necessary dependencies by running `npm install` in the root directory (which concurrently `cd`s into the client and server directories and installs their dependencies).

2. **Add ENV variables**: Copy the `EXAMPLE.env` file and make it into a `.env` file. Fill in the necessary variables. You will need a MongoDB URI for the database and a JWT secret for the authentication function.

3. **Run the app**: Run `npm run dev` in the root directory to start the app. The client and server will start concurrently.

## Usage

The app is live at [chattitude.eliassz.com](https://chattitude.eliassz.com). You can create an account, log in, and chat with other users who are online at the time. You can update your account info as needed. Hope to see you there!

## Roadmap

Not sure much more will happen on this project, but, if so, next steps include:

- Convert to TypeScript.
- Build connecting functionality to user accounts, to enable private messaging/group-based messaging.

## Acknowledgements

Thanks to [Max Ohsawa](https://github.com/maxohsawa) for initial planning on an earlier related project that never came to fruition. Thanks to [David Keim](https:github.com/dmkeim) for the partnership on the earlier stages of the project.

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

<div>
Thanks for checking this out! I'm Elias! If you have questions about this app or just want to know more about me, and you can reach me at any of the following places:
<ul style="list-style: none">
<li>Connect with me on <a href="https://www.linkedin.com/in/elias-sz/">LinkedIn</a></li>
<li>See what I'm working on at <a href="https://www.github.com/ColdWeatherBoyy">GitHub</a> or on my <a href="https://www.eliassz.com">portfolio</a></li>
<li>Write me a note at <a href="mailto:elias.spector.zabusky@gmail.com">elias.spector.zabusky@gmail.com</a></li>
</div>
