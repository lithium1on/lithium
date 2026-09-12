import { ImGui, ImVec2, ImTextureRef, ImGuiImplWeb } from "https://esm.sh/@mori2003/jsimgui@0.9.0";

// data

const playlist = [
    { name: "moron", file: "assets/audio/moron.opus", icon: "assets/img/music/moron.jpg", author: "m1v & luvwillow" },
    { name: "antichrist", file: "assets/audio/antichrist.opus", icon: "assets/img/music/m1v.jpg", author: "m1v & vanity" },
    { name: "a hardstyle christmas", file: "assets/audio/hardstyle.opus", icon: "assets/img/music/hardstyle.jpg", author: "vanity, d3r & m1v" },
    { name: "m0nster high", file: "assets/audio/monster.opus", icon: "assets/img/music/monster.jpg", author: "hubithekid, kets4eki,\nwujek, fendisuicide" },
    { name: "posted up", file: "assets/audio/postedup.opus", icon: "assets/img/music/postedup.jpg", author: "yati & lchigo, d3r" },
    { name: "she's like a superstar", file: "assets/audio/superstar.opus", icon: "assets/img/music/superstar.jpg", author: "d3r & wasty" },
    { name: "fed", file: "assets/audio/fed.opus", icon: "assets/img/music/m1v.jpg", author: "m1v" },
    { name: "keep yourself safe", file: "assets/audio/kys.opus", icon: "assets/img/music/kys.jpg", author: "cy4ne & \niwannabemissed" },
    { name: "hello kitty camo", file: "assets/audio/hkc.opus", icon: "assets/img/music/hkc.jpg", author: "disoc8" },
    { name: "would u notice", file: "assets/audio/notice.opus", icon: "assets/img/music/notice.jpg", author: "overtonight" },
    { name: "edgy", file: "assets/audio/edgy.opus", icon: "assets/img/music/edgy.jpg", author: "luvwillow" },
    { name: "kylie", file: "assets/audio/kylie.opus", icon: "assets/img/music/kylie.jpg", author: "kets4eki, KidSnorlax,\nPröz, lunarr" },
    { name: "turn it up", file: "assets/audio/tiu.opus", icon: "assets/img/music/tiu.jpg", author: "skypebf & 6arelyhuman" },
    { name: "stay_w_me original", file: "assets/audio/swmo.opus", icon: "assets/img/music/m1v.jpg", author: "m1v" },
    { name: "love bomb", file: "assets/audio/love.opus", icon: "assets/img/music/love.jpg", author: "d3r" },
    { name: "seksualna niebezpieczna", file: "assets/audio/seksualna.opus", icon: "assets/img/music/seksualna.jpg", author: "hubithekid, kets4eki,\nlunarr" },
    { name: "TeAsE", file: "assets/audio/tease.opus", icon: "assets/img/music/m1v.jpg", author: "m1v" },
    { name: "scars 4 u", file: "assets/audio/scars.opus", icon: "assets/img/music/scars.jpg", author: "luvwillow" },
    { name: "thief (wasty) 1/27/2023", file: "assets/audio/thief.opus", icon: "assets/img/music/thief.jpg", author: "d3r archive (wasty)" },
    { name: "4u", file: "assets/audio/4u.opus", icon: "assets/img/music/4u.jpg", author: "lunarr" },
    { name: "molly in my backpack", file: "assets/audio/molly.opus", icon: "assets/img/music/molly.jpg", author: "kets4eki, Crescent,\nwujek" },
    { name: "old memories!", file: "assets/audio/oldmemories.opus", icon: "assets/img/music/m1v2.jpg", author: "m0v / m1v" }
];

const socials = [
    { name: "roblox", url: "https://www.roblox.com/users/23073498", handle: "@lithium_1on" },
    { name: "steam", url: "https://steamcommunity.com/id/lithium1on", handle: "@lithium_1on" },
    { name: "youtube", url: "https://www.youtube.com/@lithium.1on", handle: "@lithium.1on" },
    { name: "tiktok", url: "https://www.tiktok.com/@lithium1on", handle: "@lithium1on" },
    { name: "twitch", url: "https://twitch.tv/lithium1on", handle: "@lithium1on" },
    { name: "kick", url: "https://kick.com/lithiumion", handle: "@lithiumion" },
    { name: "spotify", url: "https://open.spotify.com/users/31jttr5tyy3jk5koz45n22dl3bf4", handle: "lithium" },
    { name: "soundcloud", url: "https://soundcloud.com/lithium1on", handle: "@lithium1on" },
    { name: "reddit", url: "https://reddit.com/u/lithium_1on", handle: "u/lithium_1on" },
    { name: "github", url: "https://github.com/lithium1on", handle: "@lithium1on" },
    { name: "namemc", url: "https://namemc.com/profile/LithiumMC", handle: "LithiumMC" }
];

const wallets = [
    { name: "litecoin", address: "ltc1qc6hp0kde0kjgd95tglq9mmpkq5dha77q36e2za" },
    { name: "bitcoin", address: "bc1qgk74kf49x7mwdmghylzj3ulw5uwpl2dkg9ng3p" },
    { name: "ethereum", address: "0x97D0Eb4A107F0140A8eaB1C4B4Dd004e5f33A26C" },
    { name: "monero", address: "45J6wSkzyRZEqgZ5z9fBcWN15pfNhxyDp55JEzjZJYqzAKrnnipSDcB1RjVcMAwxQMhEN47voTnXi7B8G38QrWru5gUNNSk" },
    { name: "solana", address: "Eyt6wBbZrujGqyqTMrtsLNffURA2cqRWMEXZTWqiVLjf" },
    { name: "xrp", address: "r9QQPedYxbLckJT6a2SSzhHrHp97QdsAUc" }
];

const quotes = [
    `"we are gooners, not skibidies, and gooners don't..." - king`,
    `"If cancer kills you it dies with you, it's not a loss. It's a draw." - zinc-carbon battery`,
    `"all your base are belong to us" - Edwin Murray`,
    `"if youre not tuff then youre not tuff" - Plague`,
    `"a man who unironically chooses to build a cashgrab game as a replacement for developing exploits is homosexual" - Lily Phillips`,
    `"a person who goons all the time will eventually have nothing to goon to except the thought of gooning" - Lily Phillips`,
    `"give me 6 hours to chop down a tree and i will spend the first four gooning" - Abraham lincoln`,
    `"I will inject my scripts inside you" - ex7m`,
    `"if you're 555 then i'm 666" - winxx`,
    `"hello guys" - 3apka`
];

const serverStatuses = [
    "offline", "online", "starting", "stopping", "restarting", "saving",
    "loading", "crashed", "pending", "transferring", "preparing"
];

const weatherDescriptions = {
    0: "clear", 1: "mostly clear", 2: "partly cloudy", 3: "overcast",
    45: "foggy", 48: "foggy",
    51: "light drizzle", 53: "drizzle", 55: "heavy drizzle", 56: "freezing drizzle", 57: "freezing drizzle",
    61: "light rain", 63: "rain", 65: "heavy rain", 66: "freezing rain", 67: "freezing rain",
    71: "light snow", 73: "snow", 75: "heavy snow", 77: "snow grains",
    80: "rain showers", 81: "rain showers", 82: "heavy showers", 85: "snow showers", 86: "snow showers",
    95: "thunderstorm", 96: "thunderstorm with hail", 99: "thunderstorm with hail"
};

// music

class MusicPlayer {
    constructor(tracks) {
        this.tracks = tracks;
        this.index = 0;
        this.loading = false;
        this.audio = new Audio();
        this.audio.volume = 0.3;
        this.audio.addEventListener("loadstart", () => { this.loading = true; });
        this.audio.addEventListener("loadedmetadata", () => { this.loading = false; });
        this.audio.addEventListener("error", () => { this.loading = false; });
        this.audio.addEventListener("ended", () => this.next());
        this.select(0, false);
    }

    get track() {
        return this.tracks[this.index];
    }

    get playing() {
        return !this.audio.paused;
    }

    get currentTime() {
        return this.audio.currentTime || 0;
    }

    get duration() {
        return Number.isFinite(this.audio.duration) ? this.audio.duration : 0;
    }

    play() {
        this.audio.play().catch(() => {});
    }

    pause() {
        this.audio.pause();
    }

    toggle() {
        if (this.playing) this.pause();
        else this.play();
    }

    select(index, autoplay = this.playing) {
        this.index = (index + this.tracks.length) % this.tracks.length;
        this.audio.src = this.track.file;
        if (autoplay) this.play();
    }

    next() {
        this.select(this.index + 1, true);
    }

    previous() {
        this.select(this.index - 1);
    }
}

function formatTime(seconds) {
    const minutes = String(Math.floor(seconds / 60)).padStart(2, "0");
    const secs = String(Math.floor(seconds % 60)).padStart(2, "0");
    return `${minutes}:${secs}`;
}

const player = new MusicPlayer(playlist);

// minecraft

const minecraft = { server: null, message: "loading..." };

async function fetchMinecraft() {
    try {
        const response = await fetch("https://api.lithium.wtf/mc/about", { cache: "no-store" });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        minecraft.server = (await response.json()).server ?? null;
    } catch {
        minecraft.server = null;
    }
    minecraft.message = "server info unavailable";
}

// time & weather

const parisTime = new Intl.DateTimeFormat("fr-FR", {
    timeZone: "Europe/Paris",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
});

let weather = "loading...";

async function fetchWeather() {
    try {
        const response = await fetch("https://api.open-meteo.com/v1/forecast?latitude=47.2172&longitude=-1.5534&current_weather=true");
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const { temperature, weathercode } = (await response.json()).current_weather ?? {};
        weather = typeof temperature === "number"
            ? `${Math.round(temperature)}°C, ${weatherDescriptions[weathercode] ?? "unknown"}`
            : "weather unavailable";
    } catch {
        weather = "weather unavailable";
    }
}

// textures

await ImGuiImplWeb.Init({ canvas: document.querySelector("#imgui-canvas"), enableDemos: false });

const textureCache = new Map();

function loadTexture(src) {
    if (!textureCache.has(src)) {
        const texture = { id: ImGuiImplWeb.LoadTexture(), img: new Image(), loaded: false };
        texture.img.onload = () => {
            ImGuiImplWeb.LoadTexture(texture.img, { id: texture.id });
            texture.loaded = true;
        };
        texture.img.src = src;
        textureCache.set(src, texture);
    }
    return textureCache.get(src);
}

const textures = {
    pfp: loadTexture("assets/img/pfp.png"),
    atm: loadTexture("assets/img/atm.png"),
    ratware: loadTexture("assets/img/ratware.png"),
    cornball: loadTexture("assets/img/cornball.png")
};

const trackIcons = playlist.map(track => loadTexture(track.icon));

// widgets

function link(label, url = label) {
    if (ImGui.TextLink(label)) window.open(url, "_blank", "noopener");
}

function copyLink(label, text = label) {
    if (ImGui.TextLink(label)) navigator.clipboard.writeText(text).catch(() => {});
}

function inline(...parts) {
    parts.forEach((part, i) => {
        if (i > 0) ImGui.SameLine();
        if (typeof part === "string") ImGui.Text(part);
        else link(...part);
    });
}

function answer(question, reply) {
    ImGui.Text(question);
    ImGui.SameLine();
    ImGui.TextDisabled(reply);
}

function image(texture, scale) {
    ImGui.Image(
        new ImTextureRef(texture.id),
        new ImVec2(texture.img.width * scale, texture.img.height * scale)
    );
}

// windows

const windowMargin = 10;
const windowGap = 3;
let nextWindowY = windowMargin;

function drawWindow(title, drawContents) {
    ImGui.SetNextWindowPos(new ImVec2(windowMargin, nextWindowY), ImGui.Cond.FirstUseEver);
    ImGui.SetNextWindowCollapsed(true, ImGui.Cond.FirstUseEver);
    if (ImGui.Begin(title, null, ImGui.WindowFlags.AlwaysAutoResize)) drawContents();
    nextWindowY += ImGui.GetWindowHeight() + windowGap;
    ImGui.End();
}

function drawAbout() {
    ImGui.BeginGroup();
    image(textures.pfp, 1 / 3);
    ImGui.EndGroup();
    ImGui.SameLine(0, 8);
    ImGui.BeginGroup();
    ImGui.Text("hi, i'm lithium.\ni like eating batteries (sarcasm)\nim 17 years old (november 8th)\nfrenchie guy");
    ImGui.Spacing();
    ImGui.Text(`my time: ${parisTime.format()}\nmy lovely weather: ${weather}`);
    ImGui.EndGroup();
}

function drawProjects() {
    ImGui.Text("heres some pretty cool stuff ive made;");
    ImGui.Spacing();

    if (ImGui.TreeNode("lithium's atm")) {
        inline("cool deposit game i made using", ["regui", "https://github.com/depthso/Dear-Regui"]);
        inline("game link:", ["https://www.roblox.com/games/106912201193396/"]);
        image(textures.atm, 1 / 1.3);
        ImGui.TreePop();
    }

    if (ImGui.TreeNode("ratware")) {
        ImGui.Text("very dead project, executor that was last updated in march (worse than awp)");
        ImGui.Text("was mostly just atlantis but with a custom ui lol and very pro custom api");
        image(textures.ratware, 1 / 1.7);
        ImGui.Text("ratware isnt coming back any time soon (whole server dead)");
        ImGui.TreePop();
    }

    if (ImGui.TreeNode("cornball ide")) {
        ImGui.Text("roblox executor inside roblox game!! (amazing)");
        image(textures.cornball, 1 / 1.2);
        ImGui.Text("while it cant run shit properly, it has 1% unc and its level 2");
        ImGui.Text("the only problem with it is the environment being dogshit");
        inline("it uses", ["LuauCeption", "https://github.com/RadiatedExodus/LuauCeption"], "and", ["Fiu", "https://github.com/rce-incorporated/Fiu"]);
        inline("download the", ["roblox model", "/assets/misc/cornball.rbxm"], "or join the", ["game", "https://www.roblox.com/games/119510179772995/"]);
        ImGui.TreePop();
    }

    ImGui.Spacing();
    ImGui.Text("check back later for more thx");
}

function drawLinks() {
    for (const { name, url, handle } of socials) {
        inline([name, url], `: ${handle}`);
    }
}

function drawContact() {
    inline("email:", ["contact@lithium.wtf", "mailto:contact@lithium.wtf"]);
    inline("discord:", ["@lithium_1on", "https://discord.com/users/1284236064420003886"], ",", ["@lithetanium (alt)", "https://discord.com/users/1344239874500333649"]);
    ImGui.Text("stoat:");
    ImGui.SameLine();
    copyLink("lithium#9154");
    inline("telegram:", ["@lithium1on", "https://t.me/lithium1on"]);
}

function drawDonations() {
    inline("paypal:", ["here", "https://paypal.me/lithiumionbattery"]);
    for (const { name, address } of wallets) {
        if (ImGui.TreeNode(name)) {
            copyLink(address);
            ImGui.TreePop();
        }
    }
}

function drawExtras() {
    if (ImGui.TreeNode("questions")) {
        answer("can i steal this?", "nuh uh");
        answer("are you a female", "think about it");
        answer("ur music sucks i wanna submit soem!!", "no my music doesnt suck grrr but if you wanna submit contact me lol");
        inline("lithium pls feet pics", ["here", "assets/img/feetpics.gif"]);
        ImGui.TreePop();
    }

    if (ImGui.TreeNode("minecraft server")) {
        ImGui.Text("how to join:");
        copyLink("ip: mc.lithium.wtf (click to copy)", "mc.lithium.wtf");
        const { server } = minecraft;
        if (server) {
            ImGui.Text(`version: ${server.software?.version ?? "unknown"}`);
            inline("server is currently", serverStatuses[server.status] ?? "unknown");
            ImGui.Text(`${server.players?.count ?? 0} / ${server.players?.max ?? 0} players are online`);
        } else {
            ImGui.TextDisabled(minecraft.message);
        }
        ImGui.Text("whitelist is on, must dm me on discord to get whitelisted!!");
        ImGui.Spacing();
        ImGui.Text("rules:");
        ImGui.BulletText("cracks arent allowed, you pooron");
        ImGui.BulletText("no griefing");
        ImGui.BulletText("no hack clients!!");
        ImGui.BulletText("breaking rules = whitelist revoked");
        ImGui.TreePop();
    }

    if (ImGui.TreeNode("quotes")) {
        ImGui.Text("dm me on discord to add a quote");
        ImGui.Spacing();
        for (const quote of quotes) ImGui.Text(quote);
        ImGui.TreePop();
    }

    if (ImGui.TreeNode("info")) {
        answer("imgui version:", ImGui.GetVersion());
        inline("this site is made using", ["jsimgui", "https://github.com/mori2003/jsimgui"]);
        inline("the website's source is on", ["github", "https://github.com/lithium1on/lithium"]);
        ImGui.TreePop();
    }
}

function drawMusicPlayer() {
    const icon = trackIcons[player.index];
    if (icon.loaded) {
        ImGui.Image(new ImTextureRef(icon.id), new ImVec2(80, 80));
        ImGui.SameLine();
    }
    ImGui.BeginGroup();
    ImGui.Text("now playing:");
    ImGui.Text(player.track.name);
    if (player.loading) ImGui.Text("loading...");
    ImGui.TextDisabled(`by ${player.track.author}`);
    ImGui.EndGroup();
    ImGui.Spacing();

    const buttonSize = new ImVec2(25, 0);
    if (ImGui.Button("<<", buttonSize)) player.previous();
    ImGui.SameLine();
    if (ImGui.Button(player.playing ? "||" : ">", buttonSize)) player.toggle();
    ImGui.SameLine();
    if (ImGui.Button(">>", buttonSize)) player.next();
    ImGui.SameLine(0, 75);
    ImGui.Text(`${formatTime(player.currentTime)} / ${formatTime(player.duration)}`);
    ImGui.Spacing();

    if (ImGui.TreeNode("playlist")) {
        playlist.forEach((track, index) => {
            const isCurrent = index === player.index;
            if (isCurrent) ImGui.PushStyleColor(ImGui.Col.Text, 0xFF66FF66);
            if (ImGui.Selectable(isCurrent ? `> ${track.name}` : track.name, isCurrent) && !isCurrent) {
                player.select(index);
            }
            if (isCurrent) ImGui.PopStyleColor();
        });
        ImGui.TreePop();
    }
}

// render

function render() {
    ImGuiImplWeb.BeginRender();
    nextWindowY = windowMargin;
    drawWindow("about", drawAbout);
    drawWindow("projects", drawProjects);
    drawWindow("links", drawLinks);
    drawWindow("contact", drawContact);
    drawWindow("donations", drawDonations);
    drawWindow("extras", drawExtras);
    drawWindow("music player", drawMusicPlayer);
    ImGuiImplWeb.EndRender();
    requestAnimationFrame(render);
}

fetchWeather();
fetchMinecraft();
setInterval(fetchWeather, 10 * 60 * 1000);
setInterval(fetchMinecraft, 60 * 1000);
requestAnimationFrame(render);
