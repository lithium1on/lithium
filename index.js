import { ImGui, ImVec2, ImTextureRef, ImGuiImplWeb } from "https://esm.sh/@mori2003/jsimgui";

const Canvas = document.querySelector("#imgui-canvas");

(function() {
    const Hour = new Date().getHours();
    const BgImage = (Hour >= 18 || Hour < 8) 
        ? 'assets/img/redmoon.png' 
        : 'assets/img/bliss.png';
    
    document.body.style.background = `url('${BgImage}') no-repeat center center`;
    document.body.style.backgroundSize = 'cover';
})();

(async () => {
    await ImGuiImplWeb.Init({ canvas: Canvas, enableDemos: false });

    const Playlist = [
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
            this.Playlist = playlist;
            this.AudioElement = null;
            this.CurrentIndex = 0;
            this.IsPlaying = false;
            this.IsLoading = false;
            this.CurrentTime = 0;
            this.Duration = 0;
            this.InitAudioElement();
            this.LoadTrack(this.CurrentIndex);
        }

        InitAudioElement() {
            this.AudioElement = new Audio();

            this.AudioElement.addEventListener('loadstart', () => {
                this.IsLoading = true;
            });

            this.AudioElement.addEventListener('loadedmetadata', () => {
                this.Duration = this.AudioElement.duration || 0;
                this.IsLoading = false;
            });

            this.AudioElement.addEventListener('ended', () => {
                this.Next();
            });

            this.AudioElement.addEventListener('play', () => {
                this.IsPlaying = true;
            });

            this.AudioElement.addEventListener('pause', () => {
                this.IsPlaying = false;
            });
        }

        LoadTrack(index) {
            this.CurrentIndex = index;
            const Track = this.Playlist[index];
            
            if (Track) {
                this.AudioElement.src = Track.file;
                this.CurrentTime = 0;
                this.Duration = 0;
                try {
                    this.AudioElement.load();
                } catch (e) {}
            }
        }

        Play() {
            this.AudioElement.play().catch(() => {});
        }

        Pause() {
            this.AudioElement.pause();
        }

        Next() {
            const WasPlaying = this.IsPlaying;
            this.LoadTrack((this.CurrentIndex + 1) % this.Playlist.length);
            if (WasPlaying) this.Play();
        }

        Previous() {
            const WasPlaying = this.IsPlaying;
            this.LoadTrack((this.CurrentIndex - 1 + this.Playlist.length) % this.Playlist.length);
            if (WasPlaying) this.Play();
        }

        SelectTrack(index) {
            if (index !== this.CurrentIndex) {
                const WasPlaying = this.IsPlaying;
                this.LoadTrack(index);
                if (WasPlaying) this.Play();
            }
        }

        GetCurrentTrack() {
            return this.Playlist[this.CurrentIndex];
        }

        FormatTime(seconds) {
            if (isNaN(seconds) || seconds < 0) return "00:00";
            const Minutes = Math.floor(seconds / 60);
            const Secs = Math.floor(seconds % 60);
            return `${Minutes.toString().padStart(2, "0")}:${Secs.toString().padStart(2, "0")}`;
        }
    }

    const Player = new MusicPlayer(Playlist);

    let DisplayTime = "loading...";
    let DisplayWeather = "loading...";

    async function FetchWeather() {
        try {
            const GeoResponse = await fetch("https://geocoding-api.open-meteo.com/v1/search?name=Nantes&count=1&language=en&format=json");
            const GeoData = await GeoResponse.json();
            
            if (!GeoData.results?.length) throw new Error("No location found");
            
            const { latitude, longitude } = GeoData.results[0];
            const WeatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=auto`);
            const WeatherData = await WeatherResponse.json();
            
            const Temp = WeatherData.current_weather?.temperature;
            const Code = WeatherData.current_weather?.weathercode;
            
            const WeatherDescriptions = {
                0: "clear", 1: "mostly clear", 2: "partly cloudy", 3: "overcast",
                45: "foggy", 48: "foggy",
                51: "light drizzle", 53: "drizzle", 55: "heavy drizzle",
                61: "light rain", 63: "rain", 65: "heavy rain",
                80: "rain showers", 81: "rain showers", 82: "heavy showers"
            };
            
            const Description = WeatherDescriptions[Code] || "unknown";
            DisplayWeather = typeof Temp === "number" ? `${Math.round(Temp)}°C, ${Description}` : "weather unavailable";
        } catch {
            DisplayWeather = "weather unavailable";
        }
    }

    function UpdateTime() {
        try {
            DisplayTime = new Date().toLocaleTimeString("fr-FR", { timeZone: "Europe/Paris" });
        } catch {
            DisplayTime = "time unavailable";
        }
    }

    UpdateTime();
    FetchWeather();
    setInterval(UpdateTime, 1000);
    setInterval(FetchWeather, 10 * 60 * 1000);

    function LoadTexture(src) {
        const Id = ImGuiImplWeb.LoadTexture();
        const Img = new Image();
        Img.src = src;
        Img.onload = () => ImGuiImplWeb.LoadTexture(Img, { id: Id });
        return { id: Id, img: Img };
    }

    const Textures = {
        Atm: LoadTexture("assets/img/atm.png"),
        Ratware: LoadTexture("assets/img/ratware.png"),
        MusicIcons: {}
    };

    Playlist.forEach((track, index) => {
        if (track.icon) {
            Textures.MusicIcons[index] = LoadTexture(track.icon);
        }
    });

    const OpenLink = (label, url) => {
        if (ImGui.TextLink(label)) {
            globalThis.open(url, "_blank");
        }
    };

    const CopyToClipboard = (label, text) => {
        if (ImGui.TextLink(label)) {
            navigator.clipboard.writeText(text);
        }
    };

    function RenderFrame() {
        ImGuiImplWeb.BeginRender();

        ImGui.Begin("about", null, ImGui.WindowFlags.AlwaysAutoResize);
        ImGui.Text("hi, i'm lithium.\ni like eating batteries (sarcasm)\nrelationship helper\nfrench guy");
        ImGui.Spacing();
        ImGui.Text(`my time: ${DisplayTime}\nmy lovely weather: ${DisplayWeather}`);
        ImGui.End();

        ImGui.Begin("projects", null, ImGui.WindowFlags.AlwaysAutoResize);
        ImGui.Text("here are some pretty cool stuff ive made;");
        ImGui.Spacing();
        if (ImGui.TreeNode("lithium's atm")) {
            ImGui.Text("cool deposit game i made using");
            ImGui.SameLine();
            OpenLink("regui", "https://github.com/depthso/Dear-Regui");
            ImGui.Text("game link:");
            ImGui.SameLine();
            OpenLink("https://www.roblox.com/games/106912201193396/", "https://www.roblox.com/games/106912201193396/");
            ImGui.Image(
                new ImTextureRef(Textures.Atm.id),
                new ImVec2(Textures.Atm.img.width / 1.3, Textures.Atm.img.height / 1.3)
            );
            ImGui.TreePop();
        }
        if (ImGui.TreeNode("ratware")) {
            ImGui.Text("very dead project, executor that was last updated in march (worse than awp)");
            ImGui.Image(
                new ImTextureRef(Textures.Ratware.id),
                new ImVec2(Textures.Ratware.img.width / 1.7, Textures.Ratware.img.height / 1.7)
            );
            ImGui.Text("ratware isnt coming back any time soon (whole server dead 💀)");
            ImGui.TreePop();
        }
        ImGui.Spacing();
        ImGui.Text("check back later for more thx");
        ImGui.End();

        ImGui.Begin("links", null, ImGui.WindowFlags.AlwaysAutoResize);
        OpenLink("roblox", "https://www.roblox.com/users/23073498"); ImGui.SameLine(); ImGui.Text(": @lithium_1on");
        OpenLink("youtube", "https://www.youtube.com/@lithium.1on"); ImGui.SameLine(); ImGui.Text(": @lithium.1on");
        OpenLink("tiktok", "https://www.tiktok.com/@lithium.1on"); ImGui.SameLine(); ImGui.Text(": @lithium.1on");
        OpenLink("twitch", "https://twitch.tv/lithium1on"); ImGui.SameLine(); ImGui.Text(": @lithium1on");
        OpenLink("kick", "https://kick.com/lithiumion"); ImGui.SameLine(); ImGui.Text(": @lithiumion");
        OpenLink("spotify", "https://open.spotify.com/users/31jttr5tyy3jk5koz45n22dl3bf4"); ImGui.SameLine(); ImGui.Text(": lithium");
        OpenLink("soundcloud", "https://soundcloud.com/lithium1on"); ImGui.SameLine(); ImGui.Text(": @lithium1on");
        OpenLink("reddit", "https://reddit.com/u/lithium_1on"); ImGui.SameLine(); ImGui.Text(": u/lithium_1on");
        OpenLink("github", "https://github.com/lithium1on"); ImGui.SameLine(); ImGui.Text(": @lithium1on");
        OpenLink("namemc", "https://namemc.com/profile/LithiumMC"); ImGui.SameLine(); ImGui.Text(": LithiumMC");
        ImGui.End();

        ImGui.Begin("contact", null, ImGui.WindowFlags.AlwaysAutoResize);
        ImGui.Text("email:"); ImGui.SameLine(); OpenLink("contact@lithium.lat", "mailto:contact@lithium.lat");
        ImGui.Text("discord:"); ImGui.SameLine(); OpenLink("@lithium_1on", "https://discord.com/users/1284236064420003886");
        ImGui.SameLine(); ImGui.Text(","); ImGui.SameLine(); OpenLink("@lithetanium (alt)", "https://discord.com/users/1344239874500333649");
        ImGui.Text("telegram:"); ImGui.SameLine(); OpenLink("@lithium1on", "https://t.me/lithium1on");
        ImGui.End();

        ImGui.Begin("donations", null, ImGui.WindowFlags.AlwaysAutoResize);
        ImGui.Text("paypal:"); ImGui.SameLine(); OpenLink("here", "https://paypal.me/lithiumionbattery");
        if (ImGui.TreeNode("litecoin")) { CopyToClipboard("ltc1qc6hp0kde0kjgd95tglq9mmpkq5dha77q36e2za", "ltc1qc6hp0kde0kjgd95tglq9mmpkq5dha77q36e2za"); ImGui.TreePop(); }
        if (ImGui.TreeNode("bitcoin")) { CopyToClipboard("bc1qgk74kf49x7mwdmghylzj3ulw5uwpl2dkg9ng3p", "bc1qgk74kf49x7mwdmghylzj3ulw5uwpl2dkg9ng3p"); ImGui.TreePop(); }
        if (ImGui.TreeNode("ethereum")) { CopyToClipboard("0x97D0Eb4A107F0140A8eaB1C4B4Dd004e5f33A26C", "0x97D0Eb4A107F0140A8eaB1C4B4Dd004e5f33A26C"); ImGui.TreePop(); }
        if (ImGui.TreeNode("monero")) { CopyToClipboard("45J6wSkzyRZEqgZ5z9fBcWN15pfNhxyDp55JEzjZJYqzAKrnnipSDcB1RjVcMAwxQMhEN47voTnXi7B8G38QrWru5gUNNSk", "45J6wSkzyRZEqgZ5z9fBcWN15pfNhxyDp55JEzjZJYqzAKrnnipSDcB1RjVcMAwxQMhEN47voTnXi7B8G38QrWru5gUNNSk"); ImGui.TreePop(); }
        if (ImGui.TreeNode("solana")) { CopyToClipboard("Eyt6wBbZrujGqyqTMrtsLNffURA2cqRWMEXZTWqiVLjf", "Eyt6wBbZrujGqyqTMrtsLNffURA2cqRWMEXZTWqiVLjf"); ImGui.TreePop(); }
        if (ImGui.TreeNode("xrp")) { CopyToClipboard("r9QQPedYxbLckJT6a2SSzhHrHp97QdsAUc", "r9QQPedYxbLckJT6a2SSzhHrHp97QdsAUc"); ImGui.TreePop(); }
        ImGui.End();

        ImGui.Begin("extras", null, ImGui.WindowFlags.AlwaysAutoResize);
        if (ImGui.TreeNode("questions")) {
            ImGui.Text("can i steal this?"); ImGui.SameLine(); ImGui.TextDisabled("nuh uh");
            ImGui.Text("are you a female"); ImGui.SameLine(); ImGui.TextDisabled("think about it");
            ImGui.Text("ur music sucks i wanna submit soem!!"); ImGui.SameLine(); ImGui.TextDisabled("no my music doesnt suck grrr but if you wanna submit contact me lol");
            ImGui.Text("lithium pls feet pics"); ImGui.SameLine(); OpenLink("here", "assets/img/feetpics.gif");
            ImGui.TreePop();
        }
        if (ImGui.TreeNode("minecraft server")) {
            ImGui.Text("how to join:");
            CopyToClipboard("ip: mc.lithium.lat (click to copy)", "mc.lithium.lat");
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
            const Quotes = [
                `"we are gooners, not skibidies, and gooners don't..." - king`,
                `"If cancer kills you it dies with you, it's not a loss. It's a draw." - zinc-carbon battery`,
                `"all your base are belong to us" - Edwin Murray`,
                `"if youre not tuff then youre not tuff" - Plague`,
                `"a man who unironically chooses to build a cashgrab game as a replacement for developing exploits is homosexual" - Lily Phillips`,
                `"a person who goons all the time will eventually have nothing to goon to except the thought of gooning" - Lily Phillips`
            ];
            Quotes.forEach(q => ImGui.Text(q));
            ImGui.TreePop();
        }
        ImGui.End();

        ImGui.Begin("music player", null, ImGui.WindowFlags.AlwaysAutoResize);
        Player.CurrentTime = Player.AudioElement.currentTime || 0;
        const CurrentIcon = Textures.MusicIcons[Player.CurrentIndex];
        if (CurrentIcon && CurrentIcon.img.complete) {
            ImGui.Image(new ImTextureRef(CurrentIcon.id), new ImVec2(80, 80));
            ImGui.SameLine();
        }
        ImGui.BeginGroup();
        ImGui.Text("now playing:");
        const CurrentTrack = Player.GetCurrentTrack();
        ImGui.Text(CurrentTrack ? CurrentTrack.name : "no song");
        if (Player.IsLoading) ImGui.Text("loading...");
        ImGui.EndGroup();
        ImGui.Spacing();
        ImGui.PushItemWidth(30);
        if (ImGui.Button("<<", new ImVec2(25, 0))) Player.Previous();
        ImGui.SameLine();
        if (Player.IsPlaying) {
            if (ImGui.Button("||", new ImVec2(25, 0))) Player.Pause();
        } else {
            if (ImGui.Button(">", new ImVec2(25, 0))) Player.Play();
        }
        ImGui.SameLine();
        if (ImGui.Button(">>", new ImVec2(25, 0))) Player.Next();
        ImGui.PopItemWidth();
        ImGui.SameLine(0, 75);
        ImGui.Text(`${Player.FormatTime(Player.CurrentTime)} / ${Player.FormatTime(Player.Duration)}`);
        ImGui.Spacing();
        if (ImGui.TreeNode("playlist")) {
            Playlist.forEach((track, index) => {
                const IsCurrentTrack = index === Player.CurrentIndex;
                const Label = IsCurrentTrack ? `> ${track.name}` : track.name;
                if (IsCurrentTrack) {
                    ImGui.PushStyleColor(ImGui.Col.Text, 0xFF66FF66);
                }
                if (ImGui.Selectable(Label, IsCurrentTrack)) {
                    Player.SelectTrack(index);
                }
                if (IsCurrentTrack) {
                    ImGui.PopStyleColor();
                }
            });
            ImGui.TreePop();
        }
        ImGui.End();

        ImGuiImplWeb.EndRender();
        requestAnimationFrame(RenderFrame);
    }

    requestAnimationFrame(RenderFrame);
})();