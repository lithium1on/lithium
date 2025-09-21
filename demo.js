import { ImGui, ImGuiImplWeb } from "https://esm.sh/@mori2003/jsimgui@0.8.0";

(async () => {
    const myCanvas = document.querySelector("#imgui-canvas");
    await ImGuiImplWeb.Init({ canvas: myCanvas, enableDemos: true });

    const ImageFileCache = {};

    const createTextureFn =
        ImGuiImplWeb.CreateTextureFromImage ||
        ImGuiImplWeb.createTextureFromImage ||
        ImGuiImplWeb.CreateTexture ||
        ImGuiImplWeb.createTexture ||
        null;

    async function createTextureWithFallback(img) {
        if (createTextureFn) {
            try {
                const res = createTextureFn.call(ImGuiImplWeb, img);
                return (res instanceof Promise) ? await res : res;
            } catch (e) {
                // fall through to manual GL path
            }
        }

        const gl = myCanvas.getContext("webgl2");
        const tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        gl.bindTexture(gl.TEXTURE_2D, null);
        return tex;
    }

    async function ImageFile(path, width = 128, height = 128) {
        if (!ImageFileCache[path]) {
            const img = new Image();
            img.src = path;
            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
            });
            const tex = await createTextureWithFallback(img);
            ImageFileCache[path] = { tex, w: img.width, h: img.height };
        }

        const data = ImageFileCache[path];
        if (!data || !data.tex) return;
        try {
            ImGui.Image(data.tex, ImGui.Vec2(width || data.w, height || data.h));
        } catch (e) {
            // swallow — different js-imgui builds expect different texture refs
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
            if (ImGui.TextLink("regui")) globalThis.open("https://github.com/depthso/Dear-Regui", "_blank");

            ImGui.Text("game link: ");
            ImGui.SameLine();
            if (ImGui.TextLink("roblox.com/games/106912201193396")) globalThis.open("https://www.roblox.com/games/106912201193396/", "_blank");

            ImageFile("assets/img/atm.png", 256, 256);

            ImGui.TreePop();
        }

        ImGui.End();

        ImGuiImplWeb.EndRender();
        requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
})();
