import { ImGui, ImVec2, ImTextureRef, ImGuiImplWeb } from "https://esm.sh/@mori2003/jsimgui";

const canvas = document.querySelector("#imgui-canvas");

(async () => {
    await ImGuiImplWeb.Init({ canvas, enableDemos: false });

    let audio = null;
    let isPlaying = false;
    let currentSongIndex = 0;
    let volume = 0.3;
    let currentPlayTime = 0;
    let totalDuration = 0;
    let userSeeking = false;
    let isLoading = false;
    let currentTime = "loading...";
    let currentWeather = "loading...";

    const songs = [
        { name: "a new kind of love", file: "assets/audio/ankol.opus", icon: "assets/img/music/ankol.jpg" },
        { name: "devil.child", file: "assets/audio/devil.opus", icon: "assets/img/music/devil.jpg" },
        { name: "moron", file: "assets/audio/moron.opus", icon: "assets/img/music/moron.jpg" },
        { name: "posted up", file: "assets/audio/postedup.opus", icon: "assets/img/music/postedup.jpg" },
        { name: "she's like a superstar", file: "assets/audio/superstar.opus", icon: "assets/img/music/superstar.jpg" },
        { name: "keep yourself safe", file: "assets/audio/kys.opus", icon: "assets/img/music/kys.jpg" },
        { name: "hello kitty camo", file: "assets/audio/hkc.opus", icon: "assets/img/music/hkc.jpg" },
        { name: "would u notice", file: "assets/audio/notice.opus", icon: "assets/img/music/notice.jpg" },
        { name: "edgy", file: "assets/audio/edgy.opus", icon: "assets/img/music/edgy.jpg" },
        { name: "turn it up", file: "assets/audio/tiu.opus", icon: "assets/img/music/tiu.jpg" }
    ];

    const progressRef = { value: 0 };
    const volumeRef = { value: volume };

    function initAudio() {
        if (audio) audio.pause();
        audio = new Audio();
        audio.volume = volume;
        audio.loop = false;
        audio.addEventListener('loadstart', () => { isLoading = true; });
        audio.addEventListener("loadedmetadata", () => { totalDuration = audio.duration || 0; isLoading = false; });
        audio.addEventListener("timeupdate", () => { if (!userSeeking) currentPlayTime = audio.currentTime || 0; });
        audio.addEventListener("ended", () => { audio.currentTime = 0; audio.play().catch(()=>{}); });
        audio.addEventListener("play", () => isPlaying = true);
        audio.addEventListener("pause", () => isPlaying = false);
    }

    function loadCurrentSong() {
        if (!audio) initAudio();
        const s = songs[currentSongIndex];
        if (s) {
            audio.src = s.file;
            currentPlayTime = 0;
            totalDuration = 0;
            try { audio.load(); } catch {}
        }
    }

    function playSong() { if (!audio) { initAudio(); loadCurrentSong(); } audio.play().catch(()=>{}); }
    function pauseSong() { if (audio) audio.pause(); }
    function nextSong() { currentSongIndex = (currentSongIndex + 1) % songs.length; loadCurrentSong(); if (isPlaying) playSong(); }
    function prevSong() { currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length; loadCurrentSong(); if (isPlaying) playSong(); }
    function setVolume(v) { volume = Math.max(0, Math.min(1, v)); volumeRef.value = volume; if (audio) audio.volume = volume; }
    function seekTo(t) { if (audio && totalDuration > 0) { audio.currentTime = Math.max(0, Math.min(totalDuration, t)); currentPlayTime = audio.currentTime; } }
    function formatTime(s) { if (isNaN(s) || s < 0) return "00:00"; const m = Math.floor(s/60), sec = Math.floor(s%60); return `${m.toString().padStart(2,"0")}:${sec.toString().padStart(2,"0")}`; }

    async function loadWeather() {
        try {
            const geo = await (await fetch("https://geocoding-api.open-meteo.com/v1/search?name=Nantes&count=1&language=en&format=json")).json();
            if (!geo.results?.length) throw 0;
            const { latitude, longitude } = geo.results[0];
            const w = await (await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=auto`)).json();
            const t = w.current_weather?.temperature;
            const c = w.current_weather?.weathercode;
            const desc = {0:"clear",1:"mostly clear",2:"partly cloudy",3:"overcast",45:"foggy",48:"foggy",51:"light drizzle",53:"drizzle",55:"heavy drizzle",61:"light rain",63:"rain",65:"heavy rain",80:"rain showers",81:"rain showers",82:"heavy showers"}[c] || "unknown";
            currentWeather = (typeof t === "number") ? `${Math.round(t)}°C, ${desc}` : "weather unavailable";
        } catch {
            currentWeather = "weather unavailable";
        }
    }

    function loadTime() {
        try { currentTime = new Date().toLocaleTimeString("fr-FR", { timeZone: "Europe/Paris" }); } catch { currentTime = "time unavailable"; }
    }

    initAudio();
    loadCurrentSong();
    loadTime();
    loadWeather();
    setInterval(loadTime, 1000);
    setInterval(loadWeather, 10 * 60 * 1000);

    const loadTexture = src => {
        const id = ImGuiImplWeb.LoadTexture();
        const img = new Image();
        img.src = src;
        img.onload = () => ImGuiImplWeb.LoadTexture(img, { id });
        return { id, img };
    };

    const atm = loadTexture("assets/img/atm.png");
    const ratware = loadTexture("assets/img/ratware.png");
    const musicIcons = {};
    songs.forEach((s,i)=>{ if (s.icon) musicIcons[i] = loadTexture(s.icon); });

    const link = (label, url) => { if (ImGui.TextLink(label)) globalThis.open(url, "_blank"); };
    const copyable = (label, text) => { if (ImGui.TextLink(label)) navigator.clipboard.writeText(text); };

    function frame() {
        ImGuiImplWeb.BeginRender();

        ImGui.Begin("about", null, ImGui.WindowFlags.AlwaysAutoResize);
        ImGui.Text("hi, i'm lithium.\ni like eating batteries (sarcasm)\nrelationship helper\nfrench guy\n");
        ImGui.Text(`my time: ${currentTime}\nmy lovely weather: ${currentWeather}`);
        ImGui.End();

        ImGui.Begin("projects", null, ImGui.WindowFlags.AlwaysAutoResize);
        if (ImGui.TreeNode("lithium's atm")) {
            ImGui.Text("cool deposit game i made using"); ImGui.SameLine(); link("regui", "https://github.com/depthso/Dear-Regui");
            ImGui.Text("game link:"); ImGui.SameLine(); link("roblox", "https://www.roblox.com/games/106912201193396/");
            ImGui.Image(new ImTextureRef(atm.id), new ImVec2(atm.img.width / 1.3, atm.img.height / 1.3));
            ImGui.TreePop();
        }
        if (ImGui.TreeNode("ratware")) {
            ImGui.Text("very dead project, executor that was last updated in march (worse than awp)");
            ImGui.Image(new ImTextureRef(ratware.id), new ImVec2(ratware.img.width / 1.7, ratware.img.height / 1.7));
            ImGui.Text("ratware isnt coming back any time soon (whole server dead 💔)");
            ImGui.TreePop();
        }
        ImGui.End();

        ImGui.Begin("links", null, ImGui.WindowFlags.AlwaysAutoResize);
        link("roblox", "https://www.roblox.com/users/23073498"); ImGui.SameLine(); ImGui.Text(": @lithium_1on");
        link("youtube", "https://www.youtube.com/@lithium.1on"); ImGui.SameLine(); ImGui.Text(": @lithium.1on");
        link("tiktok", "https://www.tiktok.com/@lithium.1on"); ImGui.SameLine(); ImGui.Text(": @lithium.1on");
        link("twitch", "https://twitch.tv/lithium1on"); ImGui.SameLine(); ImGui.Text(": @lithium1on");
        link("kick", "https://kick.com/lithiumion"); ImGui.SameLine(); ImGui.Text(": @lithiumion");
        link("spotify", "https://open.spotify.com/users/31jttr5tyy3jk5koz45n22dl3bf4"); ImGui.SameLine(); ImGui.Text(": lithium");
        link("soundcloud", "https://soundcloud.com/lithium1on"); ImGui.SameLine(); ImGui.Text(": @lithium1on");
        link("reddit", "https://reddit.com/u/lithium_1on"); ImGui.SameLine(); ImGui.Text(": u/lithium_1on");
        link("github", "https://github.com/lithium1on"); ImGui.SameLine(); ImGui.Text(": @lithium1on");
        link("namemc", "https://namemc.com/profile/LithiumMC"); ImGui.SameLine(); ImGui.Text(": LithiumMC");
        ImGui.End();

        ImGui.Begin("contact", null, ImGui.WindowFlags.AlwaysAutoResize);
        ImGui.Text("email:"); ImGui.SameLine(); link("contact@lithium.lat", "mailto:contact@lithium.lat");
        ImGui.Text("discord:"); ImGui.SameLine(); link("@lithium_1on", "https://discord.com/users/1284236064420003886");
        ImGui.SameLine(); ImGui.Text(","); ImGui.SameLine(); link("@lithetanium (alt)", "https://discord.com/users/1344239874500333649");
        ImGui.Text("telegram:"); ImGui.SameLine(); link("@lithium1on", "https://t.me/lithium1on");
        ImGui.End();

        ImGui.Begin("donations", null, ImGui.WindowFlags.AlwaysAutoResize);
        ImGui.Text("paypal:"); ImGui.SameLine(); link("here", "https://paypal.me/lithiumionbattery");
        if (ImGui.TreeNode("litecoin")) { copyable("ltc1qc6hp0kde0kjgd95tglq9mmpkq5dha77q36e2za", "ltc1qc6hp0kde0kjgd95tglq9mmpkq5dha77q36e2za"); ImGui.TreePop(); }
        if (ImGui.TreeNode("bitcoin")) { copyable("bc1qgk74kf49x7mwdmghylzj3ulw5uwpl2dkg9ng3p", "bc1qgk74kf49x7mwdmghylzj3ulw5uwpl2dkg9ng3p"); ImGui.TreePop(); }
        if (ImGui.TreeNode("ethereum")) { copyable("0x97D0Eb4A107F0140A8eaB1C4B4Dd004e5f33A26C", "0x97D0Eb4A107F0140A8eaB1C4B4Dd004e5f33A26C"); ImGui.TreePop(); }
        if (ImGui.TreeNode("monero")) { copyable("45J6wSkzyRZEqgZ5z9fBcWN15pfNhxyDp55JEzjZJYqzAKrnnipSDcB1RjVcMAwxQMhEN47voTnXi7B8G38QrWru5gUNNSk", "45J6wSkzyRZEqgZ5z9fBcWN15pfNhxyDp55JEzjZJYqzAKrnnipSDcB1RjVcMAwxQMhEN47voTnXi7B8G38QrWru5gUNNSk"); ImGui.TreePop(); }
        if (ImGui.TreeNode("solana")) { copyable("Eyt6wBbZrujGqyqTMrtsLNffURA2cqRWMEXZTWqiVLjf", "Eyt6wBbZrujGqyqTMrtsLNffURA2cqRWMEXZTWqiVLjf"); ImGui.TreePop(); }
        if (ImGui.TreeNode("xrp")) { copyable("r9QQPedYxbLckJT6a2SSzhHrHp97QdsAUc", "r9QQPedYxbLckJT6a2SSzhHrHp97QdsAUc"); ImGui.TreePop(); }
        ImGui.End();

        ImGui.Begin("extras", null, ImGui.WindowFlags.AlwaysAutoResize);
        if (ImGui.TreeNode("questions")) {
            ImGui.Text("can i steal this?"); ImGui.SameLine(); ImGui.TextDisabled("nuh uh");
            ImGui.Text("are you a female"); ImGui.SameLine(); ImGui.TextDisabled("think about it");
            ImGui.Text("ur music sucks i wanna submit soem!!"); ImGui.SameLine(); ImGui.TextDisabled("no my music doesnt suck grrr but if you wanna submit contact me lol");
            ImGui.Text("lithium pls feet pics"); ImGui.SameLine(); link("here", "assets/img/feetpics.gif");
            ImGui.TreePop();
        }

        if (ImGui.TreeNode("minecraft server")) {
            ImGui.Text("how to join:");
            copyable("ip: mc.lithium.lat (click to copy)", "mc.lithium.lat");
            ImGui.Text("version: 1.21.8");
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
            const quotes = [
                `"we are gooners, not skibidies, and gooners don't..." - king`,
                `"If cancer kills you it dies with you, it's not a loss. It's a draw." - zinc-carbon battery`,
                `"all your base are belong to us" - Edwin Murray`,
                `"if youre not tuff then youre not tuff" - Plague`,
                `"a man who unironically chooses to build a cashgrab game as a replacement for developing exploits is homosexual" - Lily Phillips`,
                `"a person who goons all the time will eventually have nothing to goon to except the thought of gooning" - Lily Phillips`
            ];
            quotes.forEach(q => ImGui.Text(q));
            ImGui.TreePop();
        }
        ImGui.End();

        ImGui.Begin("music player", null, ImGui.WindowFlags.AlwaysAutoResize);
        const currentIcon = musicIcons[currentSongIndex];
        if (currentIcon && currentIcon.img.complete) { ImGui.Image(new ImTextureRef(currentIcon.id), new ImVec2(80,80)); ImGui.SameLine(); }
        ImGui.BeginGroup();
        const currentSong = songs[currentSongIndex];
        ImGui.Text("now playing:");
        ImGui.Text(currentSong ? currentSong.name : "no song");
        if (isLoading) ImGui.Text("loading...");
        ImGui.EndGroup();
        ImGui.Spacing();

        ImGui.PushItemWidth(30);
        if (ImGui.Button("<<", new ImVec2(30,0))) prevSong();
        ImGui.SameLine();
        if (isPlaying) { if (ImGui.Button("||", new ImVec2(30,0))) pauseSong(); }
        else { if (ImGui.Button(">", new ImVec2(30,0))) playSong(); }
        ImGui.SameLine();
        if (ImGui.Button(">>", new ImVec2(30,0))) nextSong();
        ImGui.PopItemWidth();
        ImGui.SameLine();

        if (!userSeeking) progressRef.value = totalDuration > 0 ? currentPlayTime / totalDuration : 0;
        ImGui.SetNextItemWidth(200);
        if (ImGui.SliderFloat("##progress", progressRef, 0.0, 1.0, "")) {
            if (totalDuration > 0) seekTo(progressRef.value * totalDuration);
        }
        if (ImGui.IsItemActive()) userSeeking = true;
        else if (userSeeking) userSeeking = false;

        ImGui.SameLine();
        ImGui.Text(`${formatTime(currentPlayTime)} / ${formatTime(totalDuration)}`);

        ImGui.Spacing();
        ImGui.Text("volume:"); ImGui.SameLine();
        ImGui.SetNextItemWidth(150);
        if (ImGui.SliderFloat("##volume", volumeRef, 0.0, 1.0, `${Math.round(volumeRef.value * 100)}%`)) {
            setVolume(volumeRef.value);
        }

        ImGui.Spacing();
        if (ImGui.TreeNode("playlist")) {
            songs.forEach((s,i)=> {
                const cur = i===currentSongIndex;
                const label = cur ? `> ${s.name}` : s.name;
                if (cur) ImGui.PushStyleColor(ImGui.Col.Text, 0xFF66FF66);
                if (ImGui.Selectable(label, cur)) {
                    if (i !== currentSongIndex) {
                        currentSongIndex = i;
                        loadCurrentSong();
                        if (isPlaying) playSong();
                    }
                }
                if (cur) ImGui.PopStyleColor();
            });
            ImGui.TreePop();
        }

        ImGui.End();
        ImGuiImplWeb.EndRender();
        requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
})();
