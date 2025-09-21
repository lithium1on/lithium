import { ImGui, ImVec2, ImTextureRef, ImGuiImplWeb } from "https://esm.sh/@mori2003/jsimgui@0.8.0";

const canvas = document.querySelector("#imgui-canvas");

(async () => {
    await ImGuiImplWeb.Init({ canvas, enableDemos: false });
    
    let currentTime = 'loading...';
    let currentWeather = 'loading...';
    
    // Time and weather loading functions
    async function loadweather() {
        try {
            const geo = await (await fetch('https://geocoding-api.open-meteo.com/v1/search?name=Nantes&count=1&language=en&format=json')).json();
            if (!geo.results?.length) throw 'location not found';
            
            const { latitude, longitude } = geo.results[0];
            const weather = await (await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=auto`)).json();
            
            const { temperature: t, weathercode: c } = weather.current_weather;
            const desc = {
                0:'clear',1:'mostly clear',2:'partly cloudy',3:'overcast',
                45:'foggy',48:'foggy',51:'light drizzle',53:'drizzle',
                55:'heavy drizzle',61:'light rain',63:'rain',65:'heavy rain',
                80:'rain showers',81:'rain showers',82:'heavy showers'
            }[c] || 'unknown';
            
            currentWeather = `${Math.round(t)}°C, ${desc}`;
        } catch {
            currentWeather = 'weather unavailable';
        }
    }
    
    function loadtime() {
        try {
            const now = new Date().toLocaleTimeString('fr-FR', { 
                timeZone: 'Europe/Paris' 
            });
            currentTime = now;
        } catch {
            currentTime = 'time unavailable';
        }
    }
    
    loadtime();
    loadweather();
    
    setInterval(loadtime, 1000);
    setInterval(loadweather, 10 * 60 * 1000);

    let atmTexId = ImGuiImplWeb.LoadTexture();
    const atm = new Image();
    atm.src = "assets/img/atm.png";
    atm.onload = () => {
        ImGuiImplWeb.LoadTexture(atm, { id: atmTexId });
    };
    
    // ratware image
    let ratTexId = ImGuiImplWeb.LoadTexture();
    const ratware = new Image();
    ratware.src = "assets/img/ratware.png";
    ratware.onload = () => {
        ImGuiImplWeb.LoadTexture(ratware, { id: ratTexId });
    };
    
    function frame() {
        ImGuiImplWeb.BeginRender();
        
        // about window
        ImGui.Begin("about", null, ImGui.WindowFlags.AlwaysAutoResize);
        ImGui.Text("hi, i'm lithium.\ni like eating batteries (sarcasm)\nrelationship helper\nfrench guy\n\n");
        ImGui.Text(`my time: ${currentTime}`);
        ImGui.Text(`my lovely weather: ${currentWeather}`);
        ImGui.End();
        
        // projects window
        ImGui.Begin("projects", null, ImGui.WindowFlags.AlwaysAutoResize);
        ImGui.Text("here are some pretty cool stuff i made;");
        
        if (ImGui.TreeNode("lithium's atm")) {
            ImGui.Text("cool deposit game i made using");
            ImGui.SameLine();
            if (ImGui.TextLink("regui")) globalThis.open("https://github.com/depthso/Dear-Regui", "_blank");
            ImGui.Text("game link:");
            ImGui.SameLine();
            if (ImGui.TextLink("https://www.roblox.com/games/106912201193396")) globalThis.open("https://www.roblox.com/games/106912201193396/", "_blank");
            ImGui.Image(new ImTextureRef(atmTexId), new ImVec2(atm.width / 1.3, atm.height / 1.3));
            ImGui.TreePop();
        }
        
        if (ImGui.TreeNode("ratware")) {
            ImGui.Text("very dead project, executor that was last updated in march (worse than awp)");
            ImGui.Image(new ImTextureRef(ratTexId), new ImVec2(ratware.width / 1.7, ratware.height / 1.7));
            ImGui.Text("ratware isnt coming back any time soon (whole server dead :broken-heart:)")
            ImGui.TreePop();
        }
        
        ImGui.Text("\ncheck back later for more thx");
        ImGui.End();

        // links window
        ImGui.Begin("links", null, ImGui.WindowFlags.AlwaysAutoResize);
        if (ImGui.TextLink("roblox")) globalThis.open("https://www.roblox.com/users/23073498", "_blank");
        ImGui.SameLine();
        ImGui.Text(": @lithium_1on");
        if (ImGui.TextLink("youtube")) globalThis.open("https://www.youtube.com/@lithium.1on", "_blank");
        ImGui.SameLine();
        ImGui.Text(": @lithium.1on");
        if (ImGui.TextLink("tiktok")) globalThis.open("https://www.tiktok.com/@lithium.1on", "_blank");
        ImGui.SameLine();
        ImGui.Text(": @lithium.1on");
        if (ImGui.TextLink("twitch")) globalThis.open("https://twitch.tv/lithium1on", "_blank");
        ImGui.SameLine();
        ImGui.Text(": @lithium1on");
        if (ImGui.TextLink("kick")) globalThis.open("https://kick.com/lithiumion", "_blank");
        ImGui.SameLine();
        ImGui.Text(": @lithiumion");
        if (ImGui.TextLink("spotify")) globalThis.open("https://open.spotify.com/users/31jttr5tyy3jk5koz45n22dl3bf4", "_blank");
        ImGui.SameLine();
        ImGui.Text(": lithium");
        if (ImGui.TextLink("soundcloud")) globalThis.open("https://soundcloud.com/lithium1on", "_blank");
        ImGui.SameLine();
        ImGui.Text(": @lithium1on");
        if (ImGui.TextLink("reddit")) globalThis.open("https://reddit.com/u/lithium_1on", "_blank");
        ImGui.SameLine();
        ImGui.Text(": u/lithium_1on");
        if (ImGui.TextLink("github")) globalThis.open("https://github.com/lithium1on", "_blank");
        ImGui.SameLine();
        ImGui.Text(": @lithium1on");
        if (ImGui.TextLink("namemc")) globalThis.open("https://namemc.com/profile/LithiumMC", "_blank");
        ImGui.SameLine();
        ImGui.Text(": LithiumMC");
        ImGui.End();

        // contact window
        ImGui.Begin("contact", null, ImGui.WindowFlags.AlwaysAutoResize);
        ImGui.Text("email:");
        ImGui.SameLine();
        if (ImGui.TextLink("contact@lithium.lat")) globalThis.open("mailto:contact@lithium.lat", "_blank");
        ImGui.Text("discord:");
        ImGui.SameLine();
        if (ImGui.TextLink("@lithium_1on")) globalThis.open("https://discord.com/users/1284236064420003886", "_blank");
        ImGui.SameLine();
        ImGui.Text(",");
        ImGui.SameLine();
        if (ImGui.TextLink("@lithetanium (alt)")) globalThis.open("https://discord.com/users/1344239874500333649", "_blank");
        ImGui.Text("telegram:");
        ImGui.SameLine();
        if (ImGui.TextLink("@lithium1on")) globalThis.open("https://t.me/lithium1on", "_blank");

        ImGui.End();

        // donations window
        ImGui.Begin("donations", null, ImGui.WindowFlags.AlwaysAutoResize);
        ImGui.Text("paypal:");
        ImGui.SameLine();
        if (ImGui.TextLink("here")) {
            globalThis.open("https://paypal.me/lithiumionbattery", "_blank");
        }

        if (ImGui.TreeNode("litecoin")) {
            if (ImGui.TextLink("ltc1qc6hp0kde0kjgd95tglq9mmpkq5dha77q36e2za")) {
                navigator.clipboard.writeText("ltc1qc6hp0kde0kjgd95tglq9mmpkq5dha77q36e2za");
            }
            ImGui.TreePop();
        }

        if (ImGui.TreeNode("bitcoin")) {
            if (ImGui.TextLink("bc1qgk74kf49x7mwdmghylzj3ulw5uwpl2dkg9ng3p")) {
                navigator.clipboard.writeText("bc1qgk74kf49x7mwdmghylzj3ulw5uwpl2dkg9ng3p");
            }
            ImGui.TreePop();
        }

        if (ImGui.TreeNode("ethereum")) {
            if (ImGui.TextLink("0x97D0Eb4A107F0140A8eaB1C4B4Dd004e5f33A26C")) {
                navigator.clipboard.writeText("0x97D0Eb4A107F0140A8eaB1C4B4Dd004e5f33A26C");
            }
            ImGui.TreePop();
        }

        if (ImGui.TreeNode("monero")) {
            if (ImGui.TextLink("45J6wSkzyRZEqgZ5z9fBcWN15pfNhxyDp55JEzjZJYqzAKrnnipSDcB1RjVcMAwxQMhEN47voTnXi7B8G38QrWru5gUNNSk")) {
                navigator.clipboard.writeText("45J6wSkzyRZEqgZ5z9fBcWN15pfNhxyDp55JEzjZJYqzAKrnnipSDcB1RjVcMAwxQMhEN47voTnXi7B8G38QrWru5gUNNSk");
            }
            ImGui.TreePop();
        }

        if (ImGui.TreeNode("solana")) {
            if (ImGui.TextLink("Eyt6wBbZrujGqyqTMrtsLNffURA2cqRWMEXZTWqiVLjf")) {
                navigator.clipboard.writeText("Eyt6wBbZrujGqyqTMrtsLNffURA2cqRWMEXZTWqiVLjf");
            }
            ImGui.TreePop();
        }

        if (ImGui.TreeNode("xrp")) {
            if (ImGui.TextLink("r9QQPedYxbLckJT6a2SSzhHrHp97QdsAUc")) {
                navigator.clipboard.writeText("r9QQPedYxbLckJT6a2SSzhHrHp97QdsAUc");
            }
            ImGui.TreePop();
        }

        ImGui.End();

        // extras window
        ImGui.Begin("extras", null, ImGui.WindowFlags.AlwaysAutoResize);
        ImGui.Text("nothing here yet");
        ImGui.End();

        // music player window
        ImGui.Begin("music player", null, ImGui.WindowFlags.AlwaysAutoResize);
        ImGui.Text("soon!!");
        ImGui.End();
        
        ImGuiImplWeb.EndRender();
        requestAnimationFrame(frame);
    }
    
    requestAnimationFrame(frame);
})();
