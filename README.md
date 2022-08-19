# ✨ KonVision - Image Host Bot

Open-source image host interfaced via a Discord Bot. It features Customizable embeds, config generators, and many more features!


## ❯ Table of contents

- [Setup & Installation](#setup--installation)
  - [Information](#information)
  - [Configuration](#configuration)
  - [Install dependencies](#install-dependencies)
  - [Run the project](#run-the-project)
- [Server-side Setup & Troubleshooting](#server-side-setup--troubleshooting)
  - [Disclaimer](#disclaimer)
  - [Services required](#services-required)
  - [Uploading](#uploading)
  - [NGINX Configuration files](#nginx-configuration-files)
  - [Integrity checks](#integrity-checks)
  - [IP configuration](#ip-configuration)
  - [Launching the router and discord bot.](#launching-the-router-and-discord-bot)
- [Other](#other)
  - [License](#license)
  - [Contribution](#contribution)


## ❯ Setup & Installation

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


## ❯ Server-side Setup & Troubleshooting

### Disclaimer
This code has been designed and written to run on an Ubuntu Server (Ubuntu server LTS 20.04.4). To avoid unnecessary bugs, do not attempt to set this up on a Windows server or home pc because the chances are high, that it will not work.

### Services required  

| Service  | Installation |
| :------: | :----------: |
| [nginx](https://nginx.org/) (or [Apache II](https://httpd.apache.org/))  | `sudo apt-get install nginx`  |
| [php fpm](https://php-fpm.org/)  | `sudo apt-get install php8.1-fpm`  |
| [Node.js](https://nodejs.org/)  | `sudo apt-get install node`  |
| [npm](https://www.npmjs.com/)  | `sudo apt-get install npm`  |

### Uploading  
After editing all necessary config files, you can upload the code to your server.

You will need to create a directory called ```/var/www/api.YOUR.HOST/``` and place the file structure in it.

You will need to create a directory called ```/var/www/YOUR.HOST/``` which will host your main homepage.  

### NGINX Configuration files

After installing all necessary services and after creating the 2 file paths, you can create the nginx config files which are located in ```/etc/nginx/sites-enabled```.  

The first important config file is for the API. It is important to implement PHP here. Simply copy and paste the below config file to ```/etc/nxing/sites-enabled/api.YOUR.DOMAIN.conf```.

```
server {
    root /var/www/api.YOUR.DOMAIN;  
    index index.php;
    server_name api.YOUR.DOMAIN;
    location / { try_files $uri $uri/ /index.php?$query_string; }

    location ~ \.php$ {
    include snippets/fastcgi-php.conf;
    fastcgi_pass unix:/run/php/php8.1-fpm.sock;
}

location ~ /\.ht {
    deny all;
}

#
#MAKE SURE YOU SET UP SSL IN THIS CONFIG FILE USING CERTBOT!
#
```

The second important config file is for the main website. Nothing is needed here apart from setting the document root and web socket. Simply copy and paste the below config file to ```/etc/nxing/sites-enabled/YOUR.DOMAIN.conf```.

```
server {
    root /var/www/YOUR.DOMAIN;  
    index index.php;
    server_name YOUR.DOMAIN;
    location / { try_files $uri $uri/ /index.php?$query_string; 
}

location ~ /\.ht {
    deny all;
}

#
#MAKE SURE YOU SET UP SSL IN THIS CONFIG FILE USING CERTBOT!
#
```


### Integrity checks

Now simply run these commands to test if everything works:

```bash
sudo systemctl status nginx
```

```bash
sudo systemctl status php8.1-fpm
```

```bash
sudo nginx -t 
```

If you see all services are running and `nginx -t` doesn't have any error outputs, you are good to go and can follow the rest of the installation.

### IP configuration
If you are using a third party DNS, make sure you create 2 records, the main A record that points to your website to host your frontend (not included in this repo) and an  `A` record that hosts this API. Both records point to the same IP address, but the API endpoints DNS needs to be a `api.YOUR.DOMAIN` subdomain.  
This setup is needed to make nginx serve a different root depending on your call.  

If everything is set up, your DNS should look something like this:  
![DNS Management Example](https://i.imgur.com/rogmSEZ.png)


### Launching the router and discord bot.

Now, the setup should be completed, and you are good to launch the backend.  

```bash
screen sudo -u www-data node /var/www/api.YOUR.DOMAIN/handler/handler.js
screen sudo -u www-data node /var/www/api.YOUR.DOMAIN/index.js
```  

Your API should be running now!


## ❯ Other

### License

This project is licensed under the [GNU Affero General Public License v3.0](https://github.com/KonVision/OpenBot/blob/main/LICENSE).

### Contribution

All contributions (Issues, Pull Requests etc.) are welcome.
