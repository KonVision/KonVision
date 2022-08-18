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

### Disclaimer
This code has been designed and written to run un a Ubuntu Server (Ubuntu server LTS 20.04.4). To avoid unneccesary bugs, do not attempt to set this up on a windows server or home pc because the chances are high, that it will not work.

### Backend

### Services needed  

| Service  | Installation |
| ------------- | ------------- |
| nginx (or Apache2)  | sudo apt-get install nginx  |
| php fpm  | sudo apt-get install php8.1-fpm  |
| NodeJs  | sudo apt-get install node  |
| npm  | sudo apt-get install npm  |

### Uploading  
After editing all neccessary config files, you can upload the code to your server.  
You will need to create a directory called ```/var/www/api.YOUR.HOST/``` and place the file structure in it.   
You will need to create a directory called ```/var/www/YOUR.HOST/``` which will host your main homepage.  

### NGINX Configuration files

After installing all neccesary services and after creating the 2 file paths, you can create the nginx config files which are located in ```/etc/nginx/sites-enabled```.  
The first important config file is for the api. It is important to implement php here. Simply copy paste the below config file to ```/etc/nxing/sites-enabled/api.YOUR.DOMAIN.conf```  

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
    deny all;}

    #
    #MAKE SURE YOU SET UP SSL IN THIS CONFIG FILE USING CERTBOT!
    #
```

The second important config file is for the main website. Nothing is needed here apart from setting the document root and websocket. Simply copy paste the below config file to ```/etc/nxing/sites-enabled/YOUR.DOMAIN.conf```

```
server {
        root /var/www/YOUR.DOMAIN;  
        index index.php;
        server_name YOUR.DOMAIN;
        location / { try_files $uri $uri/ /index.php?$query_string; }
        location ~ /\.ht {
         deny all;}
    #
    #MAKE SURE YOU SET UP SSL IN THIS CONFIG FILE USING CERTBOT!
    #
```
### Integrity checks

Now simply run these commands to test if everything works:
```
sudo systemctl status nginx
sudo systemctl status php8.1-fpm
sudo nginx -t 
```
If you see all services are running and nginx -t doesnt have any error outputs you are good to go and can follow the rest of the installation.

### IP configuration
If you are using a third party DNS make sure you create 2 records, the main A record that points to your website to host your frontend (not included in this repo) and a A record that hosts this api. both records point to the same IP adress but the api endpoints DNS needs to be a api.YOUR.DOMAIN subdomain.  
This setup is needed to make nginx serve a different root depenging on your call.  

If everyting is set up your dns should look something like this:
(https://api.flows.host/users/608611692955435009/a9449837b374d9b15067f320e91ebdc6/a9449837b374d9b15067f320e91ebdc6.png)





