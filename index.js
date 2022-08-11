/* Importing functions and variables */
const { Client, Intents, MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const { token, prefix, userRoleID } = require('./config.json');
const { success, warning, error, info } = require('./cfg/colors.json');
const fs = require('fs');
const path = require('path');
const api = require('./scripts/api');
const gen = require('./scripts/generators');
const cfggen = require('./scripts/configGenerators');



const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES
  ]
})


client.once('ready', () => {
  console.log('Discord Bot ready');
});


client.on('messageCreate', msg => { 
  if (msg.author.bot) {
    return
  }

  if (msg.content.startsWith(prefix + "ping")) { 
    msg.reply("Pong!")
  }

  /* Register command */
  if (msg.content.startsWith(prefix + "register")) {
    if (msg.member.roles.cache.has(userRoleID)) {
        let name = msg.author.id;
        const mkdirPath = './users/' + name;
        const writeFilePath = './users/' + name + '/upload.php';

        if (!(fs.existsSync(path.join(__dirname, mkdirPath)))) {
            let uploadsecret = gen.randomString(20);
            let content = gen.generatePHP(uploadsecret);

            api.deleteUploadSecret(name);
            api.saveUploadSecret(name, uploadsecret);

            fs.mkdir(path.join(__dirname, mkdirPath), (err => {
                if (err) {
                    return console.error(err);
                }
            }));
            fs.chmod(path.join(__dirname, mkdirPath), '755', (err => {
                if (err) {
                    return console.error(err);
                }
            }));
            fs.writeFileSync(path.join(__dirname, writeFilePath), content, err => {
                if (err) {
                    console.error(err);
                    return;
                }
            })

            const responseEmbed  = new MessageEmbed()
              .setColor(success)
              .setTitle("Embed Settings")
              .setDescription(`You have been registered successfully! \n\nUse \`${prefix}configurate\` to configurate your upload settings and \`${prefix}getConfigs\` to get your config files.`)
            msg.reply({ embeds: [ responseEmbed ] });
        } else {
            msg.reply("You are already registered!");
        }
    } else {
        msg.reply("You don't have the required role to use this command!");
    }
  }

  /* Generate new upload secret */
  if (msg.content.startsWith(prefix + "newSecret") || msg.content.startsWith(prefix + "newsecret")) {
    let name = msg.author.id;
    const rmPath = './users/' + name;
    const mkdirPath = './users/' + name;
    const writeFilePath = './users/' + name + '/upload.php';

    if (fs.existsSync(path.join(__dirname, mkdirPath))) {
      let uploadsecret = gen.randomString(20);
      let content = gen.generatePHP(uploadsecret);
      
      api.deleteUploadSecret(name);
      api.saveUploadSecret(name, uploadsecret);
  
      fs.rmSync(path.join(__dirname, rmPath), { recursive: true, force: true });
      fs.mkdir(path.join(__dirname, mkdirPath), (err => {
        if (err) {
          return console.error(err);
        }
      }));
      fs.chmod(path.join(__dirname, mkdirPath), '755', (err => {
          if (err) {
              return console.error(err);
          }
      }));
      fs.writeFileSync(path.join(__dirname, writeFilePath), content, err => {
        if (err) {
          console.error(err);
          return;
        }
      })
  
      const responseEmbed  = new MessageEmbed()
        .setColor(warning)
        .setTitle("Upload secret changed!")
        .setDescription(`Your upload secret has been changed. Use \`${prefix}getConfigs\` to get your new config files.`)
      msg.reply({ embeds: [ responseEmbed ] });
    }
    else {
      msg.reply("You don't have a valid account linked to your Discord profile.");
    }
  }

  /* Delete all images and database entries */
  if (msg.content.startsWith(prefix + "wipe")) {
    let name = msg.author.id;
    const rmPath = './users/' + name;
    
    if (fs.existsSync(path.join(__dirname, rmPath))) {
      fs.rmSync(path.join(__dirname, rmPath), { recursive: true, force: true });
      api.deleteUploadSecret(name);
  
      const responseEmbed  = new MessageEmbed()
        .setColor(warning)
        .setTitle("Title Settings")
        .setDescription(`All your images and database entries have been deleted.`)
      msg.reply({ embeds: [ responseEmbed ] });
    }
    else {
      msg.reply("You don't have a valid account linked to your Discord profile.")
    }
  }


  /* Configurate upload settings command */
  if (msg.content.startsWith(prefix + "configurate")) {
    let name = msg.author.id;
    const folderPath = `./users/${name}`;

    if (fs.existsSync(path.join(__dirname, folderPath))) {
      if (!fs.existsSync(path.join(__dirname, folderPath + '/config.json'))) {    
        const row = new MessageActionRow()
          .addComponents(
            new MessageButton()
              .setCustomId('embedTrue')
              .setLabel('Yes')
              .setStyle('SUCCESS'),
            new MessageButton()
              .setCustomId('embedFalse')
              .setLabel('No')
              .setStyle('SECONDARY')
          );

        const exampleEmbed = new MessageEmbed()
          .setTitle('Embeds look like this!')
          .setDescription('And can have a description!')
          .setAuthor( { name: 'As well as an author field!', iconURL: msg.author.displayAvatarURL() } )
          .setImage('https://i.imgur.com/RJVEcru.png');

        msg.reply({ content: '**Configuration:** \n\nDo you want to use embeds?', embeds: [ exampleEmbed ], components: [row] });
      } else {
        msg.reply(`You already configurated your settings! \nUse \`${prefix}help\` to get a list of commands and how to change your settings using them.`);
      }

    } else {
      msg.reply("You don't have a valid account linked to your Discord profile.")
    }
  }

  /* Embeds on/off commands */
  if (msg.content.startsWith(prefix + "embedsOn") || msg.content.startsWith(prefix + "embedson") || msg.content.startsWith(prefix + "enableEmbeds") || msg.content.startsWith(prefix + "enableembeds")) {
    const userConfigPath = `./users/${msg.author.id}/config.json`;
    if (fs.existsSync(path.join(__dirname, userConfigPath))) {
      const userConfig = JSON.parse(fs.readFileSync(userConfigPath));
      if (!userConfig.embed) {
        userConfig.embed = true;
        fs.rmSync(path.join(__dirname, userConfigPath), { recursive: true, force: true });
        fs.writeFileSync(path.join(__dirname, `./users/${msg.author.id}/config.json`), JSON.stringify(userConfig));

        const responseEmbed  = new MessageEmbed()
          .setColor(success)
          .setTitle("Embed Settings")
          .setDescription(`Okay, embeds are now enabled.`)
        msg.reply({ embeds: [ responseEmbed ] });
      } else {
        const responseEmbed  = new MessageEmbed()
          .setColor(error)
          .setTitle("Embed Settings")
          .setDescription(`You already have embeds enabled. \nUse \`${prefix}embedsOff\` to turn them off.`)
        msg.reply({ embeds: [ responseEmbed ] });
      }
    } else {
      msg.reply(`You don't have a valid account linked to your Discord profile or need to use \`${prefix}configurate\` to configurate your account and turn embeds on.`);
    }
  }
  
  if (msg.content.startsWith(prefix + "embedsOff") || msg.content.startsWith(prefix + "embedsoff") || msg.content.startsWith(prefix + "disableEmbeds") || msg.content.startsWith(prefix + "disableembeds")) {
    const userConfigPath = `./users/${msg.author.id}/config.json`;
    if (fs.existsSync(path.join(__dirname, userConfigPath))) {
      const userConfig = JSON.parse(fs.readFileSync(userConfigPath));
      if (userConfig.embed) {
        userConfig.embed = false;
        fs.rmSync(path.join(__dirname, userConfigPath), { recursive: true, force: true });
        fs.writeFileSync(path.join(__dirname, `./users/${msg.author.id}/config.json`), JSON.stringify(userConfig));

        const responseEmbed  = new MessageEmbed()
          .setColor(success)
          .setTitle("Embed Settings")
          .setDescription(`Okay, embeds are now disabled.`)
        msg.reply({ embeds: [ responseEmbed ] });
      } else {
        const responseEmbed  = new MessageEmbed()
          .setColor(error)
          .setTitle("Embed Settings")
          .setDescription(`You already have embeds disabled. \nUse \`${prefix}embedsOn\` to turn them on.`)
        msg.reply({ embeds: [ responseEmbed ] });
      }
    } else {
      msg.reply(`You don't have a valid account linked to your Discord profile or need to use \`${prefix}configurate\` to configurate your account and turn embeds on.`);
    }
  }

  /* Set title command */
  if (msg.content.startsWith(prefix + "setTitle") || msg.content.startsWith(prefix + "settitle")) {
    const userConfigPath = `./users/${msg.author.id}/config.json`;
    if (fs.existsSync(path.join(__dirname, userConfigPath))) {
      const userConfig = JSON.parse(fs.readFileSync(userConfigPath));
      if (userConfig.embed) {
        const messageContent = msg.content;
        const commandLength = prefix.length + "setTitle".length + 1;
        if (messageContent.slice(commandLength).length < 60) {
          if (!messageContent.slice(commandLength) == " ") {
            userConfig.title = messageContent.slice(commandLength);
            fs.rmSync(path.join(__dirname, `./users/${msg.author.id}/config.json`), { recursive: true, force: true });
            fs.writeFileSync(path.join(__dirname, `./users/${msg.author.id}/config.json`), JSON.stringify(userConfig));
            
            const responseEmbed  = new MessageEmbed()
              .setColor(success)
              .setTitle("Title Settings")
              .setDescription(`Your title has been set to: \n\n\`${userConfig.title}\` \n\nUse \`${prefix}setDescription\` to add/change your description. \n Use \`${prefix}setAuthor\` to add an author.`)
            msg.reply({ embeds: [ responseEmbed ] });
          } else {
            const responseEmbed  = new MessageEmbed()
              .setColor(error)
              .setTitle("Title Settings")
              .setDescription(`Please enter a title. \nCommand Syntax: \`${prefix}setTitle <Title>\``)
            msg.reply({ embeds: [ responseEmbed ] });
          }
        } else {
          msg.reply(`Your title is too long. \nIt must be less than 60 characters.`);
        }
      } else {
        msg.reply(`You don't have embeds enabled. \nUse \`${prefix}embedsOn\` to turn them on.`);
      }
    } else {
      msg.reply(`You don't have a valid account linked to your Discord profile or need to use \`${prefix}configurate\` to configurate your account and turn embeds on.`);
    }
  }

  /* Set description command */
  if (msg.content.startsWith(prefix + "setDescription") || msg.content.startsWith(prefix + "setdescription")) {
    const userConfigPath = `./users/${msg.author.id}/config.json`;
    if (fs.existsSync(path.join(__dirname, userConfigPath))) {
      const userConfig = JSON.parse(fs.readFileSync(userConfigPath));
      if (userConfig.embed) {
        const messageContent = msg.content;
        const commandLength = prefix.length + "setDescription".length + 1;
        if (messageContent.slice(commandLength).length < 200) {
          if (!messageContent.slice(commandLength) == " ") {
            userConfig.description = messageContent.slice(commandLength);
            fs.rmSync(path.join(__dirname, `./users/${msg.author.id}/config.json`), { recursive: true, force: true });
            fs.writeFileSync(path.join(__dirname, `./users/${msg.author.id}/config.json`), JSON.stringify(userConfig));
            
            const responseEmbed  = new MessageEmbed()
              .setColor(success)
              .setTitle("Description Settings")
              .setDescription(`Your description has been set to: \n\n\`${userConfig.description}\` \n\nUse \`${prefix}setTitle\` to add/change your title. \nUse \`${prefix}setAuthor\` to add an author.`)
            msg.reply({ embeds: [ responseEmbed ] });
          } else {
            userConfig.description = messageContent.slice(commandLength);
            fs.rmSync(path.join(__dirname, `./users/${msg.author.id}/config.json`), { recursive: true, force: true });
            fs.writeFileSync(path.join(__dirname, `./users/${msg.author.id}/config.json`), JSON.stringify(userConfig));

            const responseEmbed  = new MessageEmbed()
              .setColor(success)
              .setTitle("Description Settings")
              .setDescription(`Your description has been set to: \n\n\` \` \n\nUse \`${prefix}setTitle\` to add/change your title. \nUse \`${prefix}setAuthor\` to add an author.`)
            msg.reply({ embeds: [ responseEmbed ] });
          }
        } else {
          msg.reply(`Your description is too long. \nIt must be less than 200 characters.`);
        }
      } else {
        msg.reply(`You don't have embeds enabled. \nUse \`${prefix}embedsOn\` to turn them on.`);
      }
    } else {
      msg.reply(`You don't have a valid account linked to your Discord profile or need to use \`${prefix}configurate\` to configurate your account and turn embeds on.`);
    }
  }

  /* Set author commands */
  if (msg.content.startsWith(prefix + "setAuthor") || msg.content.startsWith(prefix + "setauthor")) {
    const userConfigPath = `./users/${msg.author.id}/config.json`;
    if (fs.existsSync(path.join(__dirname, userConfigPath))) {
      const userConfig = JSON.parse(fs.readFileSync(userConfigPath));
      if (userConfig.embed) {
        const messageContent = msg.content;
        const commandLength = prefix.length + "setauthor".length + 1;
        if (!messageContent.slice(commandLength).length < 200) {
          if (!messageContent.slice(commandLength) == " ") {
            userConfig.author =  {
              name: messageContent.slice(commandLength),
              iconURL: msg.author.displayAvatarURL()
            };
            fs.rmSync(path.join(__dirname, `./users/${msg.author.id}/config.json`), { recursive: true, force: true });
            fs.writeFileSync(path.join(__dirname, `./users/${msg.author.id}/config.json`), JSON.stringify(userConfig));

            const responseEmbed  = new MessageEmbed()
              .setColor(success)
              .setTitle("Author Settings")
              .setDescription(`Your author text has been set to: \n\n\`${userConfig.author.name}\` \n\n If you want to disable author, use \`${prefix}authorOff\`.`)
            msg.reply({ embeds: [ responseEmbed ] });
          } else {
            const responseEmbed  = new MessageEmbed()
              .setColor(error)
              .setTitle("Author Settings")
              .setDescription(`Please enter an author text. \nCommand Syntax: \`${prefix}setTitle <Title>\``)
            msg.reply({ embeds: [ responseEmbed ] });
          }
        } else {
          msg.reply(`Your author text is too long. \nIt must be less than 200 characters.`);
        }
      } else {
        msg.reply(`You don't have embeds enabled. \nUse \`${prefix}embedsOn\` to turn them on.`);
      }
    } else {
      msg.reply(`You don't have a valid account linked to your Discord profile or need to use \`${prefix}configurate\` to configurate your account and turn embeds on.`);
    }
  }

  if (msg.content.startsWith(prefix + "authorOff") || msg.content.startsWith(prefix + "authoroff") || msg.content.startsWith(prefix + "disableAuthor") || msg.content.startsWith(prefix + "disableauthor") ) {
    const userConfigPath = `./users/${msg.author.id}/config.json`;
    if (fs.existsSync(path.join(__dirname, userConfigPath))) {
      const userConfig = JSON.parse(fs.readFileSync(userConfigPath));
      if (userConfig.embed) {
        userConfig.author = "";
        fs.rmSync(path.join(__dirname, `./users/${msg.author.id}/config.json`), { recursive: true, force: true });
        fs.writeFileSync(path.join(__dirname, `./users/${msg.author.id}/config.json`), JSON.stringify(userConfig));
        const responseEmbed  = new MessageEmbed()
          .setColor(success)
          .setTitle("Author field disabled")
          .setDescription(`Your author fiels has been disabled. \nUse \`${prefix}setAuthor\` to add an author again.`)
        msg.reply({ embeds: [ responseEmbed ] });
      } else {
        msg.reply(`You don't have embeds enabled. \nUse \`${prefix}embedsOn\` to turn them on.`);
      }
    } else {
      msg.reply(`You don't have a valid account linked to your Discord profile or need to use \`${prefix}configurate\` to configurate your account and turn embeds on.`);
    }
  }

  /* Embed preview command */
  if (msg.content.startsWith(prefix + "preview")) {
    const userConfigPath = `./users/${msg.author.id}/config.json`;
    if (fs.existsSync(path.join(__dirname, userConfigPath))) {
      const userConfig = JSON.parse(fs.readFileSync(userConfigPath));
      const previewEmbed = new MessageEmbed()
        .setTitle(userConfig.title)
        .setDescription(userConfig.description)
        .setImage(msg.author.displayAvatarURL())
        .setAuthor( { name: userConfig.author.name, iconURL: msg.author.displayAvatarURL() } )
      msg.reply({ content: "This is your current embed:", embeds: [ previewEmbed ] });
    } else {
      msg.reply(`You don't have a valid account linked to your Discord profile or need to use \`${prefix}configurate\` to configurate your account and turn embeds on.`);
    }
  }

  /* Get configs command */
  if (msg.content.startsWith(prefix + "getConfigs") || msg.content.startsWith(prefix + "getconfigs") || msg.content.startsWith(prefix + "getConfig") || msg.content.startsWith(prefix + "getconfig")) {
    let name = msg.author.id;
    const folderPath = `./users/${name}`;

    if (fs.existsSync(path.join(__dirname, folderPath))) {
      
      const row = new MessageActionRow()
        .addComponents(
          new MessageButton()
            .setCustomId('ShareX')
            .setLabel('ShareX')
            .setStyle('PRIMARY'),
          new MessageButton()
            .setCustomId('ShareNix')
            .setLabel('ShareNix')
            .setStyle('PRIMARY')
        );

      const configEmbed = new MessageEmbed()
        .setTitle('Get Configs')
        .setDescription('For what program do you want the config file? \n([ShareX](https://getsharex.com) or [ShareNix](https://github.com/Francesco149/sharenix))')

      msg.reply({ embeds: [ configEmbed ], components: [ row ] });
    } else {
      msg.reply("You don't have a valid account linked to your Discord profile.")
    }
  }

  /* Help command */
  if (msg.content.startsWith(prefix + "help")) {
    const helpEmbed = new MessageEmbed()
      .setColor(info)
      .setTitle('**Help - All available commands**')
      .addFields(
        { name: `${prefix}help`, value: 'Shows this list of commands.' },
      )
    
    const accountCommands =  new MessageEmbed()
      .setColor(info)
      .setTitle('Basic Account Commands')
      .setDescription("Commands to set up your account and change it's settings.")
      .addFields(
        { name: `${prefix}register`, value: `Registers you as a user. Only works if you have the <@&${userRoleID}> role.`, inline: true },
        { name: `${prefix}newSecret`, value: 'Generates a new upload secret and sends it to you..', inline: true },
        { name: `${prefix}wipe`, value: 'Wipes all your images and database entries.', inline: true },
        { name: `${prefix}getConfigs`, value: 'Gets the config files for [ShareX](https://getsharex.com) or [ShareNix](https://github.com/Francesco149/sharenix).', inline: true }
      )
    
    const configurationCommands = new MessageEmbed()
      .setColor(info)
      .setTitle('Configuration Commands')
      .setDescription('Commands to configurate your image settings (embed configuration etc.).')
      .addFields(
        { name: `${prefix}configurate`, value: 'Configurate your account. Only works if you are registered.', inline: true},
        { name: `${prefix}embedsOn`, value: 'Turns on embeds.', inline: true },
        { name: `${prefix}embedsOff`, value: 'Turns off embeds.', inline: true },
        { name: `${prefix}setTitle \`<Title>\``, value: 'Sets your embed title. Only works if you have embeds enabled.', inline: true },
        { name: `${prefix}setDescription \`<Description>\``, value: 'Sets your embed description. Only works if you have embeds enabled.', inline: true },
        { name: `${prefix}setAuthor \`<Author Text>\``, value: 'Sets your author text. Only works if you have embeds enabled.', inline: true },
        { name: `${prefix}authorOff`, value: 'Disables your author field. Only works if you have embeds enabled.', inline: true },
        { name: `${prefix}preview`, value: 'Shows you a preview of your current embed.', inline: true }
      )

    msg.reply({ embeds: [ helpEmbed, accountCommands, configurationCommands ] });
  }
});


/* Button reactions */
client.on('interactionCreate', async interaction => {

  if (!interaction.isButton()) {
    return
  }

  /* EmbedTrue button */
  if (interaction.customId === 'embedTrue') {
    let name = interaction.member.user.id;
    const configPath = `./users/${name}/config.json`;

    const config = {
      "embed": true,
      "title": "",
      "description": "",
      "author": ""
    }
    
    fs.writeFile(path.join(__dirname, configPath), JSON.stringify(config, null, 2), err => {
      if (err) {
        console.error(err);
        return;
      }
    });

    await interaction.reply(`Okay, you are using embeds now. \n\nUse \`${prefix}setTitle <Title>\` to set a title for your embed.`);
  }

  /* EmbedFalse button */
  if (interaction.customId === 'embedFalse') {
    let name = interaction.member.user.id;
    const configPath = `./users/${name}/config.json`;

    const config = {
      "embed": true,
      "title": "",
      "description": "",
      "author": ""
    }
    
    fs.writeFile(path.join(__dirname, configPath), JSON.stringify(config, null, 2), err => {
      if (err) {
        console.error(err);
        return;
      }
    });

    await interaction.reply(`Okay, that's fine! \n\nIf you want to turn embeds on again, use \`${prefix}embedsOn\`.`);
  }


  /* ShareX button */
  if (interaction.customId === 'ShareX') {
    let name = interaction.member.user.id;
    
    const userUploadSecret = api.getUploadSecret(name);
    cfggen.ShareXGenerator(name, userUploadSecret);

    fs.chmod(path.join(__dirname, `./scripts/cache`), '755', (err => {
        if (err) {
            return console.error(err);
        }
    }));

    const shareXEmbed = new MessageEmbed()
      .setColor(success)
      .setTitle('ShareX Config')
      .setDescription('Here is your ShareX config!')

    const row = new MessageActionRow()
        .addComponents(
          new MessageButton()
            .setLabel('ShareX Tutorial')
            .setStyle('LINK')
            .setURL('https://youtu.be/NVOZ9_qmz3Y')
        );

    await interaction.member.user.send({
      embeds: [ shareXEmbed ],
      components: [ row ],
    });
    await interaction.member.user.send({
      files: [ `./scripts/cache/${name}config.sxcu` ]
    });

    fs.rmSync(path.join(__dirname, `./scripts/cache/${name}config.sxcu`), { recursive: true, force: true });
  }

  /* ShareNix button */
  if (interaction.customId === 'ShareNix') {
    let name = interaction.member.user.id;
    
    const userUploadSecret = api.getUploadSecret(name);
    cfggen.ShareNixGenerator(name, userUploadSecret);
    
    fs.chmod(path.join(__dirname, `./scripts/cache`), '755', (err => {
        if (err) {
            return console.error(err);
        }
    }));

    const shareNixEmbed = new MessageEmbed()
      .setColor(success)
      .setTitle('ShareNix Config')
      .setDescription('Here is your ShareNix config!')

    const row = new MessageActionRow()
        .addComponents(
          new MessageButton()
            .setLabel('ShareNix Documentation')
            .setStyle('LINK')
            .setURL('https://github.com/Francesco149/sharenix#installing---arch-linux')
        );

    await interaction.member.user.send({
      embeds: [ shareNixEmbed ],
      components: [ row ],
    });
    await interaction.member.user.send({
      files: [ `./scripts/cache/${name}config.json` ]
    });

    fs.rm(path.join(__dirname, `./scripts/cache/${name}config.json`), { recursive: true, force: true });
  }

});

/* Login to Discord with your client's token */
client.login(token);
