import { ImGui, ImGuiImplWeb } from "https://esm.sh/@mori2003/jsimgui@0.8.0";
import { createImageBitmap } from 'https://unpkg.com/@mori2003/jsimgui@0.8.0';

(async () => {
    const myCanvas = document.querySelector("#imgui-canvas");
    await ImGuiImplWeb.Init({ canvas: myCanvas, enableDemos: true });

    const img = await createImageBitmap(await fetch("assets/img/atm.png").then(res => res.blob()));
    const tex = ImGuiImplWeb.CreateTextureFromImage(img);
    const texId = tex ? tex.id : null;

    function frame() {
        ImGuiImplWeb.BeginRender();
        ImGui.Begin("Image Example");
        if (texId) {
            ImGui.Image(texId, [img.width, img.height]);
        } else {
            ImGui.Text("Failed to load image.");
        }
        ImGui.End();
        ImGuiImplWeb.EndRender();
        requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
})();
