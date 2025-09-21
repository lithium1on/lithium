import { ImGui, ImGuiImplWeb } from "https://esm.sh/@mori2003/jsimgui@0.8.0";

(async () => {
    const myCanvas = document.querySelector("#imgui-canvas");
    await ImGuiImplWeb.Init({ canvas: myCanvas, enableDemos: true });

    const image = await ImGui.ImageFile("assets/img/atm.png");
    const texture = ImGui.CreateTextureFromImage(image);

    function frame() {
        ImGuiImplWeb.BeginRender();

        ImGui.Begin("Image Window");
        ImGui.Image(texture);
        ImGui.End();

        ImGuiImplWeb.EndRender();
        requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
})();
