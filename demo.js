import { ImGui, ImVec2, ImTextureRef, ImGuiImplWeb } from "https://esm.sh/@mori2003/jsimgui";

const canvas = document.querySelector("#imgui-canvas");

(function() {
    const hour = new Date().getHours();
    const bgImage = (hour >= 18 || hour < 8) 
        ? 'assets/img/redmoon.png' 
        : 'assets/img/bliss.png';
    
    document.body.style.background = `url('${bgImage}') no-repeat center center`;
    document.body.style.backgroundSize = 'cover';
})();

(async () => {
    await ImGuiImplWeb.Init({ canvas, enableDemos: false });

    const playlist = [
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

    class MusicPlayer {
        constructor(playlist) {
            this.playlist = playlist;
            this.audioElement = null;
            this.currentIndex = 0;
            this.isPlaying = false;
            this.isLoading = false;
            this.volume = 0.3;
            this.currentTime = 0;
            this.duration = 0;
            
            this.volumeRef = { value: this.volume };
            
            this.initAudioElement();
            this.loadTrack(this.currentIndex);
        }

        initAudioElement() {
            this.audioElement = new Audio();
            this.audioElement.volume = this.volume;
            this.audioElement.loop = false;

            this.audioElement.addEventListener('loadstart', () => {
                this.isLoading = true;
            });

            this.audioElement.addEventListener('loadedmetadata', () => {
                this.duration = this.audioElement.duration || 0;
                this.isLoading = false;
            });

            this.audioElement.addEventListener('ended', () => {
                this.audioElement.currentTime = 0;
                this.currentTime = 0;
                this.audioElement.play().catch(() => {});
            });

            this.audioElement.addEventListener('play', () => {
                this.isPlaying = true;
            });

            this.audioElement.addEventListener('pause', () => {
                this.isPlaying = false;
            });
        }

        loadTrack(index) {
            this.currentIndex = index;
            const track = this.playlist[index];
            
            if (track) {
                this.audioElement.src = track.file;
                this.currentTime = 0;
                this.duration = 0;
                try {
                    this.audioElement.load();
                } catch (e) {}
            }
        }

        play() {
            this.audioElement.play().catch(() => {});
        }

        pause() {
            this.audioElement.pause();
        }

        next() {
            const wasPlaying = this.isPlaying;
            this.loadTrack((this.currentIndex + 1) % this.playlist.length);
            if (wasPlaying) this.play();
        }

        previous() {
            const wasPlaying = this.isPlaying;
            this.loadTrack((this.currentIndex - 1 + this.playlist.length) % this.playlist.length);
            if (wasPlaying) this.play();
        }

        setVolume(newVolume) {
            this.volume = Math.max(0, Math.min(1, newVolume));
            this.volumeRef.value = this.volume;
            this.audioElement.volume = this.volume;
        }

        seek(timeInSeconds) {
            if (this.duration > 0) {
                const clampedTime = Math.max(0, Math.min(this.duration, timeInSeconds));
                this.audioElement.currentTime = clampedTime;
                this.currentTime = clampedTime;
            }
        }

        selectTrack(index) {
            if (index !== this.currentIndex) {
                const wasPlaying = this.isPlaying;
                this.loadTrack(index);
                if (wasPlaying) this.play();
            }
        }

        getCurrentTrack() {
            return this.playlist[this.currentIndex];
        }

        formatTime(seconds) {
            if (isNaN(seconds) || seconds < 0) return "00:00";
            const minutes = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
        }
    }

    const player = new MusicPlayer(playlist);

    let displayTime = "loading...";
    let displayWeather = "loading...";

    async function fetchWeather() {
        try {
            const geoResponse = await fetch("https://geocoding-api.open-meteo.com/v1/search?name=Nantes&count=1&language=en&format=json");
            const geoData = await geoResponse.json();
            
            if (!geoData.results?.length) throw new Error("No location found");
            
            const { latitude, longitude } = geoData.results[0];
            const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=auto`);
            const weatherData = await weatherResponse.json();
            
            const temp = weatherData.current_weather?.temperature;
            const code = weatherData.current_weather?.weathercode;
            
            const weatherDescriptions = {
                0: "clear", 1: "mostly clear", 2: "partly cloudy", 3: "overcast",
                45: "foggy", 48: "foggy",
                51: "light drizzle", 53: "drizzle", 55: "heavy drizzle",
                61: "light rain", 63: "rain", 65: "heavy rain",
                80: "rain showers", 81: "rain showers", 82: "heavy showers"
            };
            
            const description = weatherDescriptions[code] || "unknown";
            displayWeather = typeof temp === "number" ? `${Math.round(temp)}°C, ${description}` : "weather unavailable";
        } catch {
            displayWeather = "weather unavailable";
        }
    }

    function updateTime() {
        try {
            displayTime = new Date().toLocaleTimeString("fr-FR", { timeZone: "Europe/Paris" });
        } catch {
            displayTime = "time unavailable";
        }
    }

    updateTime();
    fetchWeather();
    setInterval(updateTime, 1000);
    setInterval(fetchWeather, 10 * 60 * 1000);

    function loadTexture(src) {
        const id = ImGuiImplWeb.LoadTexture();
        const img = new Image();
        img.src = src;
        img.onload = () => ImGuiImplWeb.LoadTexture(img, { id });
        return { id, img };
    }

    const textures = {
        atm: loadTexture("assets/img/atm.png"),
        ratware: loadTexture("assets/img/ratware.png"),
        musicIcons: {}
    };

    playlist.forEach((track, index) => {
        if (track.icon) {
            textures.musicIcons[index] = loadTexture(track.icon);
        }
    });

    const openLink = (label, url) => {
        if (ImGui.TextLink(label)) {
            globalThis.open(url, "_blank");
        }
    };

    const copyToClipboard = (label, text) => {
        if (ImGui.TextLink(label)) {
            navigator.clipboard.writeText(text);
        }
    };

    function renderFrame() {
        ImGuiImplWeb.BeginRender();

        renderAboutWindow();
        renderProjectsWindow();
        renderLinksWindow();
        renderContactWindow();
        renderDonationsWindow();
        renderExtrasWindow();
        renderMusicPlayerWindow();

        ImGuiImplWeb.EndRender();
        requestAnimationFrame(renderFrame);
    }

    function renderAboutWindow() {
        ImGui.Begin("about", null, ImGui.WindowFlags.AlwaysAutoResize);
        ImGui.Text("hi, i'm lithium.\ni like eating batteries (sarcasm)\nrelationship helper\nfrench guy\n");
        ImGui.Text(`my time: ${displayTime}\nmy lovely weather: ${displayWeather}`);
        ImGui.End();
    }

    function renderProjectsWindow() {
        ImGui.Begin("projects", null, ImGui.WindowFlags.AlwaysAutoResize);
        
        if (ImGui.TreeNode("lithium's atm")) {
            ImGui.Text("cool deposit game i made using");
            ImGui.SameLine();
            openLink("regui", "https://github.com/depthso/Dear-Regui");
            ImGui.Text("game link:");
            ImGui.SameLine();
            openLink("roblox", "https://www.roblox.com/games/106912201193396/");
            ImGui.Image(
                new ImTextureRef(textures.atm.id),
                new ImVec2(textures.atm.img.width / 1.3, textures.atm.img.height / 1.3)
            );
            ImGui.TreePop();
        }
        
        if (ImGui.TreeNode("ratware")) {
            ImGui.Text("very dead project, executor that was last updated in march (worse than awp)");
            ImGui.Image(
                new ImTextureRef(textures.ratware.id),
                new ImVec2(textures.ratware.img.width / 1.7, textures.ratware.img.height / 1.7)
            );
            ImGui.Text("ratware isnt coming back any time soon (whole server dead 💀)");
            ImGui.TreePop();
        }
        
        ImGui.End();
    }

    function renderLinksWindow() {
        ImGui.Begin("links", null, ImGui.WindowFlags.AlwaysAutoResize);
        openLink("roblox", "https://www.roblox.com/users/23073498"); ImGui.SameLine(); ImGui.Text(": @lithium_1on");
        openLink("youtube", "https://www.youtube.com/@lithium.1on"); ImGui.SameLine(); ImGui.Text(": @lithium.1on");
        openLink("tiktok", "https://www.tiktok.com/@lithium.1on"); ImGui.SameLine(); ImGui.Text(": @lithium.1on");
        openLink("twitch", "https://twitch.tv/lithium1on"); ImGui.SameLine(); ImGui.Text(": @lithium1on");
        openLink("kick", "https://kick.com/lithiumion"); ImGui.SameLine(); ImGui.Text(": @lithiumion");
        openLink("spotify", "https://open.spotify.com/users/31jttr5tyy3jk5koz45n22dl3bf4"); ImGui.SameLine(); ImGui.Text(": lithium");
        openLink("soundcloud", "https://soundcloud.com/lithium1on"); ImGui.SameLine(); ImGui.Text(": @lithium1on");
        openLink("reddit", "https://reddit.com/u/lithium_1on"); ImGui.SameLine(); ImGui.Text(": u/lithium_1on");
        openLink("github", "https://github.com/lithium1on"); ImGui.SameLine(); ImGui.Text(": @lithium1on");
        openLink("namemc", "https://namemc.com/profile/LithiumMC"); ImGui.SameLine(); ImGui.Text(": LithiumMC");
        ImGui.End();
    }

    function renderContactWindow() {
        ImGui.Begin("contact", null, ImGui.WindowFlags.AlwaysAutoResize);
        ImGui.Text("email:"); ImGui.SameLine(); openLink("contact@lithium.lat", "mailto:contact@lithium.lat");
        ImGui.Text("discord:"); ImGui.SameLine(); openLink("@lithium_1on", "https://discord.com/users/1284236064420003886");
        ImGui.SameLine(); ImGui.Text(","); ImGui.SameLine(); openLink("@lithetanium (alt)", "https://discord.com/users/1344239874500333649");
        ImGui.Text("telegram:"); ImGui.SameLine(); openLink("@lithium1on", "https://t.me/lithium1on");
        ImGui.End();
    }

    function renderDonationsWindow() {
        ImGui.Begin("donations", null, ImGui.WindowFlags.AlwaysAutoResize);
        ImGui.Text("paypal:"); ImGui.SameLine(); openLink("here", "https://paypal.me/lithiumionbattery");
        if (ImGui.TreeNode("litecoin")) { copyToClipboard("ltc1qc6hp0kde0kjgd95tglq9mmpkq5dha77q36e2za", "ltc1qc6hp0kde0kjgd95tglq9mmpkq5dha77q36e2za"); ImGui.TreePop(); }
        if (ImGui.TreeNode("bitcoin")) { copyToClipboard("bc1qgk74kf49x7mwdmghylzj3ulw5uwpl2dkg9ng3p", "bc1qgk74kf49x7mwdmghylzj3ulw5uwpl2dkg9ng3p"); ImGui.TreePop(); }
        if (ImGui.TreeNode("ethereum")) { copyToClipboard("0x97D0Eb4A107F0140A8eaB1C4B4Dd004e5f33A26C", "0x97D0Eb4A107F0140A8eaB1C4B4Dd004e5f33A26C"); ImGui.TreePop(); }
        if (ImGui.TreeNode("monero")) { copyToClipboard("45J6wSkzyRZEqgZ5z9fBcWN15pfNhxyDp55JEzjZJYqzAKrnnipSDcB1RjVcMAwxQMhEN47voTnXi7B8G38QrWru5gUNNSk", "45J6wSkzyRZEqgZ5z9fBcWN15pfNhxyDp55JEzjZJYqzAKrnnipSDcB1RjVcMAwxQMhEN47voTnXi7B8G38QrWru5gUNNSk"); ImGui.TreePop(); }
        if (ImGui.TreeNode("solana")) { copyToClipboard("Eyt6wBbZrujGqyqTMrtsLNffURA2cqRWMEXZTWqiVLjf", "Eyt6wBbZrujGqyqTMrtsLNffURA2cqRWMEXZTWqiVLjf"); ImGui.TreePop(); }
        if (ImGui.TreeNode("xrp")) { copyToClipboard("r9QQPedYxbLckJT6a2SSzhHrHp97QdsAUc", "r9QQPedYxbLckJT6a2SSzhHrHp97QdsAUc"); ImGui.TreePop(); }
        ImGui.End();
    }

    function renderExtrasWindow() {
        ImGui.Begin("extras", null, ImGui.WindowFlags.AlwaysAutoResize);
        
        if (ImGui.TreeNode("questions")) {
            ImGui.Text("can i steal this?"); ImGui.SameLine(); ImGui.TextDisabled("nuh uh");
            ImGui.Text("are you a female"); ImGui.SameLine(); ImGui.TextDisabled("think about it");
            ImGui.Text("ur music sucks i wanna submit soem!!"); ImGui.SameLine(); ImGui.TextDisabled("no my music doesnt suck grrr but if you wanna submit contact me lol");
            ImGui.Text("lithium pls feet pics"); ImGui.SameLine(); openLink("here", "assets/img/feetpics.gif");
            ImGui.TreePop();
        }

        if (ImGui.TreeNode("minecraft server")) {
            ImGui.Text("how to join:");
            copyToClipboard("ip: mc.lithium.lat (click to copy)", "mc.lithium.lat");
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
    }

    function renderMusicPlayerWindow() {
        ImGui.Begin("music player", null, ImGui.WindowFlags.AlwaysAutoResize);
        
        player.currentTime = player.audioElement.currentTime || 0;

        const currentIcon = textures.musicIcons[player.currentIndex];
        if (currentIcon && currentIcon.img.complete) {
            ImGui.Image(new ImTextureRef(currentIcon.id), new ImVec2(80, 80));
            ImGui.SameLine();
        }
        
        ImGui.BeginGroup();
        ImGui.Text("now playing:");
        const currentTrack = player.getCurrentTrack();
        ImGui.Text(currentTrack ? currentTrack.name : "no song");
        if (player.isLoading) ImGui.Text("loading...");
        ImGui.EndGroup();
        
        ImGui.Spacing();

        ImGui.PushItemWidth(30);
        if (ImGui.Button("<<", new ImVec2(25, 0))) player.previous();
        ImGui.SameLine();
        if (player.isPlaying) {
            if (ImGui.Button("||", new ImVec2(25, 0))) player.pause();
        } else {
            if (ImGui.Button(">", new ImVec2(25, 0))) player.play();
        }
        ImGui.SameLine();
        if (ImGui.Button(">>", new ImVec2(25, 0))) player.next();
        ImGui.PopItemWidth();
        ImGui.SameLine(0, 75);
        ImGui.Text(`${player.formatTime(player.currentTime)} / ${player.formatTime(player.duration)}`);

        ImGui.Spacing();
        if (ImGui.TreeNode("playlist")) {
            playlist.forEach((track, index) => {
                const isCurrentTrack = index === player.currentIndex;
                const label = isCurrentTrack ? `> ${track.name}` : track.name;
                
                if (isCurrentTrack) {
                    ImGui.PushStyleColor(ImGui.Col.Text, 0xFF66FF66);
                }
                
                if (ImGui.Selectable(label, isCurrentTrack)) {
                    player.selectTrack(index);
                }
                
                if (isCurrentTrack) {
                    ImGui.PopStyleColor();
                }
            });
            ImGui.TreePop();
        }

        ImGui.End();
    }

    requestAnimationFrame(renderFrame);
})();