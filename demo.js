import { ImGui, ImGuiImplWeb } from "https://esm.sh/@mori2003/jsimgui@0.8.0";

(async () => {
    const myCanvas = document.querySelector("#imgui-canvas");
    await ImGuiImplWeb.Init({ canvas: myCanvas, enableDemos: true });

    const image = new Image();
    image.src = "assets/img/atm.png";
    await new Promise((resolve) => {
        image.onload = resolve;
    });

    const texture = await ImGuiImplWeb.CreateTextureFromImage(image);

    function frame() {
        ImGuiImplWeb.BeginRender();
        ImGui.Begin("Image Example");
        ImGui.Image(texture, new ImVec2(256, 256));
        ImGui.End();
        ImGuiImplWeb.EndRender();
        requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
})();
