import { ImGui, ImVec2, ImTextureRef, ImGuiImplWeb } from "https://esm.sh/@mori2003/jsimgui@0.8.0";

const canvas = document.querySelector("#imgui-canvas");

(async () => {
    await ImGuiImplWeb.Init({ canvas, enableDemos: false });

    let texId = ImGuiImplWeb.LoadTexture(); 
    const img = new Image();
    img.src = "assets/img/atm.png";
    img.onload = () => {
        ImGuiImplWeb.LoadTexture(img, { id: texId });
    };

    function frame() {
        ImGuiImplWeb.BeginRender();

        ImGui.Begin("about");
        ImGui.Text("hi, i'm lithium.\ni like eating batteries (sarcasm)\nrelationship helper\nfrench guy\n\n");
        ImGui.Text("my time: {time}");
        ImGui.Text("my lovely weather: {weather}");
        ImGui.End();

        ImGui.Begin("projects");
        ImGui.Text("here are some pretty cool stuff i made;");
        if (ImGui.TreeNode("lithium's atm")) {
            ImGui.Text("cool deposit game i made using");
            ImGui.SameLine();
            if (ImGui.TextLink("regui")) globalThis.open("https://github.com/depthso/Dear-Regui", "_blank");

            ImGui.Text("game link:");
            ImGui.SameLine();
            if (ImGui.TextLink("https://www.roblox.com/games/106912201193396")) globalThis.open("https://www.roblox.com/games/106912201193396/", "_blank");

            ImGui.Image(new ImTextureRef(texId), new ImVec2(img.width / 1.5, img.height / 1.5));

            ImGui.TreePop();
        }
        ImGui.End();

        ImGuiImplWeb.EndRender();
        requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
})();
