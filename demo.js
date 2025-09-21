import { ImGui, ImVec2, ImTextureRef, ImGuiImplWeb } from "https://esm.sh/@mori2003/jsimgui@0.8.0";

const canvas = document.querySelector("#imgui-canvas");

(async () => {
    await ImGuiImplWeb.Init({ canvas, enableDemos: false });

    // atm image
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

        ImGui.Begin("about");
        ImGui.Text("hi, i'm lithium.\ni like eating batteries (sarcasm)\nrelationship helper\nfrench guy\n\n");
        ImGui.Text("my time: {time}");
        ImGui.Text("my lovely weather: {weather}");
        ImGui.End();

        ImGui.Begin("projects", null, ImGui.WindowFlags.AlwaysAutoResize);
        ImGui.Text("here are some pretty cool stuff i made;");
        if (ImGui.TreeNode("lithium's atm")) {
            ImGui.Text("cool deposit game i made using");
            ImGui.SameLine();
            if (ImGui.TextLink("regui")) globalThis.open("https://github.com/depthso/Dear-Regui", "_blank");

            ImGui.Text("game link:");
            ImGui.SameLine();
            if (ImGui.TextLink("https://www.roblox.com/games/106912201193396")) globalThis.open("https://www.roblox.com/games/106912201193396/", "_blank");

            ImGui.Image(new ImTextureRef(texId), new ImVec2(atm.width / 1.3, img.height / 1.3));

            ImGui.TreePop();
        }
        if (ImGui.TreeNode("ratware")) {
            ImGui.Text("very dead project, executor that was last updated in march (worse than awp)");
            ImGui.Image(new ImTextureRef(texId), new ImVec2(ratware.width / 1.3, img.height / 1.3));
            ImGui.Text("ratware isnt coming back any time soon (whole server dead :broken-heart:)")
            ImGui.TreePop();
        }
        ImGui.Text("\ncheck back later for more thx");

        ImGui.End();

        ImGuiImplWeb.EndRender();
        requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
})();
