const Discord = require("discord.js"); //baixar a lib
const client = new Discord.Client();
const config = require("./config.json");


client.on("ready", () => {
    console.log(`Bot foi iniciado, com ${client.users.size} usuários, em ${client.channels.size} canais, em ${client.guilds.size} servidores.`);
    client.user.setActivity(`Eu estou em ${client.guilds.size} servidores`);
    // caso queira o bot trasmitindo use:
    /*
       client.user.setPresence({ game: { name: 'comando', type: 1, url: 'https://www.twitch.tv/ladonegro'} });
        //0 = Jogando
        //  1 = Transmitindo
        //  2 = Ouvindo
        //  3 = Assistindo
          */
});

client.on("guildCreate", guild => {
    console.log(`O bot entrou nos servidor: ${guild.name} (id: ${guild.id}). População: ${guild.memberCount} membros!`);
    client.user.setActivity(`Estou em ${client.guilds.size} servidores`);
});

client.on("guildDelete", guild => {
    console.log(`O bot foi removido do servidor: ${guild.name} (id: ${guild.id})`);
    client.user.setActivity(`Estou em ${client.guilds.size} servidores`);
});


client.on("message", async message => {

    if (message.author.bot) return;
    if (message.channel.type === "dm") return;
    if (!message.content.startsWith(config.prefix)) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const comando = args.shift().toLowerCase();

    // coamdno ping
    if (comando === "ping") {
        const m = await message.channel.send("Ping?");
        m.edit(`Pong! A Latência é ${m.createdTimestamp - message.createdTimestamp}ms. A Latencia da API é ${Math.round(client.ping)}ms`);
    }
    //comando falar
    if (comando === "say") {
        const sayMessage = args.join(" ");
        message.delete().catch(O_o => { });
        message.channel.send(sayMessage);
    }
    //comando apagar
    if (comando === "apagar") {
        const deleteCount = parseInt(args[0], 10);
        if (!deleteCount || deleteCount < 2 || deleteCount > 100)
            return message.reply("Por favor, forneça um número entre 2 e 100 para o número de mensagens a serem excluídas");

        const fetched = await message.channel.fetchMessages({ limit: deleteCount });
        message.channel.bulkDelete(fetched)
            .catch(error => message.reply(`Não foi possível deletar mensagens devido a: ${error}`));
    }
    // comando chutar 
    if (comando === "kick") {
        //adicione o nome dos cargos que vc quer que use esse comando!
        if (!message.member.roles.some(r => ["chefes🍩", "Nome de outro cargo 2"].includes(r.name)))
            return message.reply("Desculpe, você não tem permissão para usar isto!");
        let member = message.mentions.members.first() || message.guild.members.get(args[0]);
        if (!member)
            return message.reply("Por favor mencione um membro válido deste servidor");
        if (!member.kickable)
            return message.reply("Eu não posso expulsar este usuário! Eles pode ter um cargo mais alto ou eu não tenho permissões de expulsar?");

        let reason = args.slice(1).join(' ');
        if (!reason) reason = "Nenhuma razão fornecida";

        await member.kick(reason)
            .catch(error => message.reply(`Desculpe ${message.author} não consegui expulsar o membro devido o: ${error}`));
        message.reply(`${member.user.tag} foi kickado por ${message.author.tag} Motivo: ${reason}`);

    }
    // comando ban
    if (comando === "ban") {
        //adicione o nome do cargo que vc quer que use esse comando!
        if (!message.member.roles.some(r => ["chefes🍩"].includes(r.name)))
            return message.reply("Desculpe, você não tem permissão para usar isto!");
        let member = message.mentions.members.first();
        if (!member)
            return message.reply("Por favor mencione um membro válido deste servidor");
        if (!member.bannable)
            return message.reply("Eu não posso banir este usuário! Eles pode ter um cargo mais alto ou eu não tenho permissões de banir?");
        let reason = args.slice(1).join(' ');
        if (!reason) reason = "Nenhuma razão fornecida";
        await member.ban(reason)
            .catch(error => message.reply(`Desculpe ${message.author} não consegui banir o membro devido o : ${error}`));
        message.reply(`${member.user.tag} foi banido por ${message.author.tag} Motivo: ${reason}`);
    }
    if (comando === "enviar") {
        let msg = args.join(" "); // Remember arrays are 0-based!.
        message.delete();
        if (!message.member.hasPermission('ADMINISTRATOR')) return message.reply({
            embed: {
                description: ":incorreto: | Você não tem permissão para usar esse comando.",
                color: 6066491
            }
        });
        const embed = new Discord.RichEmbed()
            .setTitle(`${msg}`)
            .setAuthor("Kings Land")
            .setColor(0x00AE86)
            .setImage("https://cdn.discordapp.com/attachments/547512622174568450/547844286360584199/9615003_l-1024x689.png")
            .setURL("https://discord.gg/7ZkyFsf")
        message.guild.members.map(membro => { membro.send({ embed }) });
        message.channel.send("Divulgação enviada");
    }

});

client.login(config.token);