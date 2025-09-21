import { ImGui, ImGuiImplWeb } from "https://esm.sh/@mori2003/jsimgui@0.8.0";

(async () => {
    const myCanvas = document.querySelector("#imgui-canvas");
    await ImGuiImplWeb.Init({ canvas: myCanvas, enableDemos: true });

    function frame() {
        ImGuiImplWeb.BeginRender();
        // about
		ImGui.Begin("about");
		ImGui.Text("hi, i'm lithium.\ni like eating batteries (sarcasm)\nrelationship helper\nfrench guy\n\nmy time: {time}\nmy lovely weather: {weather}");
		ImGui.End();
        // projects
        ImGui.Begin("projects");
        ImGui.Text('here are some pretty cool stuff i made;\n\n')
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

            ImGui.TreePop();
        }
        ImGui.End();

        ImGuiImplWeb.EndRender();
        requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
})();