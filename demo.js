import { ImGui, ImVec2, ImTextureRef, ImGuiImplWeb } from "https://esm.sh/@mori2003/jsimgui@0.8.0";

const canvas = document.querySelector("#imgui-canvas");

(async () => {
    await ImGuiImplWeb.Init({ canvas, enableDemos: false });

    let currentTime = "loading...";
    let currentWeather = "loading...";

    const link = (label, url) => { if (ImGui.TextLink(label)) globalThis.open(url, "_blank"); };
    const copyable = (label, text) => { if (ImGui.TextLink(label)) navigator.clipboard.writeText(text); };
    const loadTexture = (src) => {
        const id = ImGuiImplWeb.LoadTexture();
        const img = new Image();
        img.src = src;
        img.onload = () => ImGuiImplWeb.LoadTexture(img, { id });
        return { id, img };
    };

    async function loadWeather() {
        try {
            const geo = await (await fetch("https://geocoding-api.open-meteo.com/v1/search?name=Nantes&count=1&language=en&format=json")).json();
            if (!geo.results?.length) throw "location not found";
            const { latitude, longitude } = geo.results[0];
            const weather = await (await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=auto`)).json();
            const { temperature: t, weathercode: c } = weather.current_weather;
            const desc = {
                0: "clear", 1: "mostly clear", 2: "partly cloudy", 3: "overcast",
                45: "foggy", 48: "foggy", 51: "light drizzle", 53: "drizzle",
                55: "heavy drizzle", 61: "light rain", 63: "rain", 65: "heavy rain",
                80: "rain showers", 81: "rain showers", 82: "heavy showers",
            }[c] || "unknown";
            currentWeather = `${Math.round(t)}°C, ${desc}`;
        } catch {
            currentWeather = "weather unavailable";
        }
    }

    function loadTime() {
        try { currentTime = new Date().toLocaleTimeString("fr-FR", { timeZone: "Europe/Paris" }); }
        catch { currentTime = "time unavailable"; }
    }

    loadTime();
    loadWeather();
    setInterval(loadTime, 1000);
    setInterval(loadWeather, 10 * 60 * 1000);

    const atm = loadTexture("assets/img/atm.png");
    const ratware = loadTexture("assets/img/ratware.png");

    const windowNames = [
        "about",
        "projects",
        "links",
        "contact",
        "donations",
        "extras",
        "music player"
    ];

    const sizes = {};
    const positions = {};
    const applied = {};
    let positioned = false;

    function drawAbout() {
        ImGui.Text("hi, i'm lithium.\ni like eating batteries (sarcasm)\nrelationship helper\nfrench guy\n");
        ImGui.Text(`my time: ${currentTime}`);
        ImGui.Text(`my lovely weather: ${currentWeather}`);
    }

    function drawProjects() {
        ImGui.Text("here are some pretty cool stuff i made;");
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
        ImGui.Text("\ncheck back later for more thx");
    }

    function drawLinks() {
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
    }

    function drawContact() {
        ImGui.Text("email:"); ImGui.SameLine(); link("contact@lithium.lat", "mailto:contact@lithium.lat");
        ImGui.Text("discord:"); ImGui.SameLine(); link("@lithium_1on", "https://discord.com/users/1284236064420003886");
        ImGui.SameLine(); ImGui.Text(","); ImGui.SameLine(); link("@lithetanium (alt)", "https://discord.com/users/1344239874500333649");
        ImGui.Text("telegram:"); ImGui.SameLine(); link("@lithium1on", "https://t.me/lithium1on");
    }

    function drawDonations() {
        ImGui.Text("paypal:"); ImGui.SameLine(); link("here", "https://paypal.me/lithiumionbattery");
        if (ImGui.TreeNode("litecoin")) { copyable("ltc1qc6hp0kde0kjgd95tglq9mmpkq5dha77q36e2za", "ltc1qc6hp0kde0kjgd95tglq9mmpkq5dha77q36e2za"); ImGui.TreePop(); }
        if (ImGui.TreeNode("bitcoin")) { copyable("bc1qgk74kf49x7mwdmghylzj3ulw5uwpl2dkg9ng3p", "bc1qgk74kf49x7mwdmghylzj3ulw5uwpl2dkg9ng3p"); ImGui.TreePop(); }
        if (ImGui.TreeNode("ethereum")) { copyable("0x97D0Eb4A107F0140A8eaB1C4B4Dd004e5f33A26C", "0x97D0Eb4A107F0140A8eaB1C4B4Dd004e5f33A26C"); ImGui.TreePop(); }
        if (ImGui.TreeNode("monero")) { copyable("45J6wSkzyRZEqgZ5z9fBcWN15pfNhxyDp55JEzjZJYqzAKrnnipSDcB1RjVcMAwxQMhEN47voTnXi7B8G38QrWru5gUNNSk", "45J6wSkzyRZEqgZ5z9fBcWN15pfNhxyDp55JEzjZJYqzAKrnnipSDcB1RjVcMAwxQMhEN47voTnXi7B8G38QrWru5gUNNSk"); ImGui.TreePop(); }
        if (ImGui.TreeNode("solana")) { copyable("Eyt6wBbZrujGqyqTMrtsLNffURA2cqRWMEXZTWqiVLjf", "Eyt6wBbZrujGqyqTMrtsLNffURA2cqRWMEXZTWqiVLjf"); ImGui.TreePop(); }
        if (ImGui.TreeNode("xrp")) { copyable("r9QQPedYxbLckJT6a2SSzhHrHp97QdsAUc", "r9QQPedYxbLckJT6a2SSzhHrHp97QdsAUc"); ImGui.TreePop(); }
    }

    function drawExtras() {
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
    }

    function drawMusic() {
        ImGui.Text("soon!! i have to figure out how to make it work :)");
    }

    function drawWindowByName(name) {
        if (name === "about") drawAbout();
        else if (name === "projects") drawProjects();
        else if (name === "links") drawLinks();
        else if (name === "contact") drawContact();
        else if (name === "donations") drawDonations();
        else if (name === "extras") drawExtras();
        else if (name === "music player") drawMusic();
    }

    function measureSizesOnce() {
        for (let i = 0; i < windowNames.length; i++) {
            const name = windowNames[i];
            if (!sizes[name]) {
                ImGui.Begin(name, null, ImGui.WindowFlags.AlwaysAutoResize | ImGui.WindowFlags.NoSavedSettings);
                drawWindowByName(name);
                const s = ImGui.GetWindowSize();
                sizes[name] = { w: Math.max(80, s.x), h: Math.max(32, s.y) };
                ImGui.End();
            }
        }
    }

    function placeRandomNonOverlapping() {
        const canvasWidth = Math.max(100, canvas.width || canvas.clientWidth);
        const canvasHeight = Math.max(100, canvas.height || canvas.clientHeight);
        const margin = 8;
        const placedRects = [];
        for (let i = 0; i < windowNames.length; i++) {
            const name = windowNames[i];
            const w = sizes[name].w;
            const h = sizes[name].h;
            let found = false;
            const maxTries = 400;
            for (let t = 0; t < maxTries; t++) {
                const cx = Math.floor(Math.random() * (canvasWidth - w - margin * 2)) + w / 2 + margin;
                const cy = Math.floor(Math.random() * (canvasHeight - h - margin * 2)) + h / 2 + margin;
                const rect = { x1: cx - w / 2, y1: cy - h / 2, x2: cx + w / 2, y2: cy + h / 2, cx, cy, w, h };
                let ok = true;
                for (const r of placedRects) {
                    if (!(rect.x2 + margin <= r.x1 || rect.x1 - margin >= r.x2 || rect.y2 + margin <= r.y1 || rect.y1 - margin >= r.y2)) { ok = false; break; }
                }
                if (ok) { positions[name] = { x: rect.cx, y: rect.cy }; placedRects.push(rect); found = true; break; }
            }
            if (!found) {
                const cx = Math.floor(Math.random() * (canvasWidth - w - margin * 2)) + w / 2 + margin;
                const cy = Math.floor(Math.random() * (canvasHeight - h - margin * 2)) + h / 2 + margin;
                positions[name] = { x: cx, y: cy };
                placedRects.push({ x1: cx - w / 2, y1: cy - h / 2, x2: cx + w / 2, y2: cy + h / 2, cx, cy, w, h });
            }
            applied[name] = false;
        }
        positioned = true;
    }

    function applyPositionIfNeeded(name) {
        if (positions[name] && !applied[name]) {
            ImGui.SetNextWindowPos(new ImVec2(positions[name].x, positions[name].y), ImGui.Cond.Once, new ImVec2(0.5, 0.5));
            applied[name] = true;
        }
    }

    function frame() {
        ImGuiImplWeb.BeginRender();

        if (!positioned) {
            measureSizesOnce();
            if (Object.keys(sizes).length === windowNames.length) placeRandomNonOverlapping();
        }

        for (let i = 0; i < windowNames.length; i++) {
            const name = windowNames[i];
            applyPositionIfNeeded(name);
            ImGui.Begin(name, null, ImGui.WindowFlags.AlwaysAutoResize);
            drawWindowByName(name);
            ImGui.End();
        }

        ImGuiImplWeb.EndRender();
        requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
})();
