# bot

## Setup & Installation

You need [Node.js](https://nodejs.org/en/) and a package manager such as [yarn](https://yarnpkg.com/) or [NPM](https://www.npmjs.com/).

### Information
When hosting, only make the `./users/*` directory public!

### Configuration
For the Discord bot, you need to have a Bot Application and its token.

Create a 'User' role in your Discord Server and get its ID. This role can be given to members who are allowed to use the image host. If a member doesn't have the role he can't use it.

Now fill in `config.json` with your domain **(without `www` or `http/https`)**, your Discord Bot token, a custom prefix and the ID of the role.

```json
{
    "domain": "your.domain",
    "token": "DISCORD_TOKEN",
    "prefix": "CUSTOM_PREFIX",
    "userRoleID": "USER_ROLE_ID"
}
```

### Install dependencies
In this example, we are using [yarn](https://yarnpkg.com/) as our package manager. Feel free to use any other package manager and to install [`discord.js@13.9.1`](https://www.npmjs.com/package/discord.js/v/13.9.1) and [`chokidar`](https://www.npmjs.com/package/chokidar) with it.

```bash
yarn install
```

<details>
    <summary>Installing without lockfile</summary>
    <p> If you want to create a new lockfile / set up a new project, you can use the following command to add the required packages: </p>
    <code>yarn add discord.js@13.9.1</code>
    <br>
    <code>yarn add chokidar</code>
</details>

### Run the project 

```bash
node index.js
```
## Server side Setup and Troubleshooting

#Disclaimer
This code has been designed and written to run un a Ubuntu Server (Ubuntu server LTS 20.04.4). To avoid unneccesary bugs, do not attempt to set this up on a windows server or home pc because the chances are high, that it will not work.

#Backend

