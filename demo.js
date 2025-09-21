import { ImGui, ImGuiImplWeb } from "https://esm.sh/@mori2003/jsimgui@0.8.0";

(async () => {
    const myCanvas = document.querySelector("#imgui-canvas");
    await ImGuiImplWeb.Init({ canvas: myCanvas, enableDemos: true });

    const ImageFileCache = {};
    function ImageFile(path, width = 128, height = 128) {
        if (!ImageFileCache[path]) {
            const img = new Image();
            img.src = path;
            img.onload = () => {
                const tex = ImGuiImplWeb.CreateTextureFromImage(img);
                ImageFileCache[path] = { tex, w: img.width, h: img.height };
            };
            return;
        }

        const data = ImageFileCache[path];
        if (data && data.tex) {
            ImGui.Image(data.tex, [width || data.w, height || data.h]);
        }
    }

    function frame() {
        ImGuiImplWeb.BeginRender();

        ImGui.Begin("about");
        ImGui.Text("hi, i'm lithium.\ni like eating batteries (sarcasm)\nrelationship helper\nfrench guy\n\nmy time: {time}\nmy lovely weather: {weather}");
        ImGui.End();

        ImGui.Begin("projects");
        ImGui.Text('here are some pretty cool stuff i made;\n\n');

        if (ImGui.TreeNode("lithium's atm")) {
            ImGui.Text("cool deposit game i made using ");
            ImGui.SameLine();
            if (ImGui.TextLink("regui")) {
                globalThis.open("https://github.com/depthso/Dear-Regui", "_blank");
            }

            ImGui.Text("game link: ");
            ImGui.SameLine();
            if (ImGui.TextLink("roblox.com/games/106912201193396")) {
                globalThis.open("https://www.roblox.com/games/106912201193396/", "_blank");
            }

            ImageFile("assets/img/atm.png", 256, 256);

            ImGui.TreePop();
        }

        ImGui.End();

        ImGuiImplWeb.EndRender();
        requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
})();
