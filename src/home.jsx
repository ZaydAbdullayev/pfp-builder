import { useState, useRef, useEffect } from "react";
import df_head from "./assets/df_pfp-head.png";
import df_body from "./assets/df_pfp-body.png";
import {
  bodies,
  heads,
  defaultConfig,
  gradientColors,
  gradientPairs,
  hairColors,
  skinTones,
  solidColors,
} from "./contents/data";
import { RiTwitterXFill } from "react-icons/ri";

const getGradientMatch = (selectedGradient) => {
  for (const [color1, color2] of gradientPairs) {
    if (
      selectedGradient.includes(color1) &&
      selectedGradient.includes(color2)
    ) {
      return [color1, color2];
    }
  }
  return null;
};

export function App() {
  const [config, setConfig] = useState(defaultConfig);
  const [activeTab, setActiveTab] = useState("Background");
  const canvasRef = useRef(null);
  const [headImages, setHeadImages] = useState({});
  const [bodyImages, setBodyImages] = useState({});
  const [defaultHeadImage, setDefaultHeadImage] = useState(null);
  const [defaultBodyImage, setDefaultBodyImage] = useState(null);

  const tabs = ["Background", "Head", "Body", "Skin", "Hair Color"];

  // Load all images
  useEffect(() => {
    // Load default images
    const defaultHeadImg = new Image();
    defaultHeadImg.crossOrigin = "anonymous";
    defaultHeadImg.onload = () => setDefaultHeadImage(defaultHeadImg);
    defaultHeadImg.src = df_head;

    const defaultBodyImg = new Image();
    defaultBodyImg.crossOrigin = "anonymous";
    defaultBodyImg.onload = () => setDefaultBodyImage(defaultBodyImg);
    defaultBodyImg.src = df_body;

    // Load head images
    const loadedHeadImages = {};
    heads.forEach((head) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        loadedHeadImages[head.id] = img;
        setHeadImages({ ...loadedHeadImages });
      };
      img.src = head.image;
    });

    // Load body images
    const loadedBodyImages = {};
    bodies.forEach((body) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        loadedBodyImages[body.id] = img;
        setBodyImages({ ...loadedBodyImages });
      };
      img.src = body.image;
    });
  }, []);

  const updateConfig = (section, key, value) => {
    setConfig((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  const hexToRgb = (hex) => {
    if (hex === "transparent") return null;
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: Number.parseInt(result[1], 16),
          g: Number.parseInt(result[2], 16),
          b: Number.parseInt(result[3], 16),
        }
      : null;
  };

  const applyColorToHeadImage = (sourceCanvas, skinTone, hairColor) => {
    const ctx = sourceCanvas.getContext("2d");
    if (!ctx) return sourceCanvas;

    const imageData = ctx.getImageData(
      0,
      0,
      sourceCanvas.width,
      sourceCanvas.height
    );
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const gray = data[i]; // R value (grayscale)

      if (skinTone !== "transparent" && gray > 160 && gray < 200) {
        // Face/skin area
        const skinColor = hexToRgb(skinTone);
        if (skinColor) {
          data[i] = skinColor.r;
          data[i + 1] = skinColor.g;
          data[i + 2] = skinColor.b;
        }
      } else if (hairColor !== "transparent" && gray > 100 && gray < 160) {
        // Hair area
        const color = hexToRgb(hairColor);
        if (color) {
          data[i] = color.r;
          data[i + 1] = color.g;
          data[i + 2] = color.b;
        }
      }
    }

    ctx.putImageData(imageData, 0, 0);
    return sourceCanvas;
  };

  const drawAvatar = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const canvasSize = 500;
    canvas.width = canvasSize;
    canvas.height = canvasSize;
    ctx.clearRect(0, 0, canvasSize, canvasSize);

    // Draw background
    if (config.background.type === "solid") {
      if (config.background.color === "transparent") {
        const checkSize = 20;
        for (let x = 0; x < canvasSize; x += checkSize) {
          for (let y = 0; y < canvasSize; y += checkSize) {
            ctx.fillStyle =
              (x / checkSize + y / checkSize) % 2 === 0 ? "#f0f0f0" : "#d0d0d0";
            ctx.fillRect(x, y, checkSize, checkSize);
          }
        }
      } else {
        ctx.fillStyle = config.background.color;
        ctx.fillRect(0, 0, canvasSize, canvasSize);
      }
    } else {
      const selectedGradient = config.background.gradient;
      const gradientColors = getGradientMatch(selectedGradient);

      if (gradientColors) {
        const gradient = ctx.createLinearGradient(0, 0, canvasSize, canvasSize);
        gradient.addColorStop(0, gradientColors[0]);
        gradient.addColorStop(1, gradientColors[1]);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvasSize, canvasSize);
      }
    }

    const elementSize = 200;
    const centerX = (canvasSize - elementSize) / 2;
    const headY = 50;
    const bodyY = headY + elementSize - 50;

    // Draw body (selected or default)
    if (config.body.style !== null && bodyImages[config.body.style]) {
      const bodyImg = bodyImages[config.body.style];
      ctx.drawImage(bodyImg, centerX, bodyY, elementSize, elementSize);
    } else if (defaultBodyImage) {
      ctx.drawImage(defaultBodyImage, centerX, bodyY + 10, 200, 100);
    }

    // HEAD OFFSET: sabit bir yukarıdan başlatma ile saçlar aşağı sarkabilir
    const headTopOffset = -40;

    // Draw head (selected or default)
    if (config.head.style !== null && headImages[config.head.style]) {
      const headImg = headImages[config.head.style];

      const tempCanvas = document.createElement("canvas");
      const tempCtx = tempCanvas.getContext("2d");
      if (tempCtx) {
        tempCanvas.width = headImg.width + 120;
        tempCanvas.height = headImg.height + 120;
        tempCtx.drawImage(headImg, 0, 0);

        applyColorToHeadImage(
          tempCanvas,
          config.head.skinTone,
          config.head.hairColor
        );

        ctx.drawImage(
          tempCanvas,
          centerX + 32,
          headY - headTopOffset,
          elementSize,
          elementSize
        );
      }
    } else if (defaultHeadImage) {
      ctx.drawImage(defaultHeadImage, centerX + 35, headY + 45, 130, 110);
    }

    // Draw nickname
    if (config.nickname.trim()) {
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "24px Arial";
      ctx.textAlign = "center";
      ctx.fillText(`@${config.nickname}`, canvasSize / 2, canvasSize - 30);
    }
  };

  useEffect(() => {
    drawAvatar();
  }, [config, headImages, bodyImages, defaultHeadImage, defaultBodyImage]);

  const downloadPFP = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = "my-pfp.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  const reset = () => {
    setConfig(defaultConfig);
    setActiveTab("Background");
  };

  return (
    <div className="w-[100vw] min-h-screen bg-[#1a1d29] text-white relative">
      <button className="absolute top-4 right-4 bg-[#4A90E2] hover:bg-[#357ABD] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
        <RiTwitterXFill /> Follow Us
      </button>
      {/* Header */}
      <div className="text-center py-8">
        <h1 className="text-6xl font-bold bg-gradient-to-r from-[#4A90E2] to-[#7B68EE] bg-clip-text text-transparent">
          PFP Builder
        </h1>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Side - Preview */}
          <div className="space-y-6">
            {/* Profile Preview */}
            <div className="bg-[#252836] rounded-2xl p-6">
              <h2 className="text-2xl font-semibold mb-6">Profile Preview</h2>
              <div className="flex justify-center">
                <div className="relative">
                  <canvas
                    ref={canvasRef}
                    className="border-4 border-[#3a3d4a] rounded-lg"
                    style={{ width: "500px", height: "500px" }}
                  />
                </div>
              </div>
            </div>

            {/* Nickname Input */}
            <div className="bg-[#252836] rounded-2xl p-6">
              <label
                htmlFor="nickname"
                className="text-lg font-medium mb-2 block"
              >
                Nickname
              </label>
              <input
                id="nickname"
                type="text"
                placeholder="Enter your nickname"
                value={config.nickname}
                onChange={(e) =>
                  setConfig((prev) => ({ ...prev, nickname: e.target.value }))
                }
                className="bg-[#3a3d4a] border-[#4a4d5a] text-white placeholder-gray-400 rounded-lg w-full px-4 py-2 focus:outline-none focus:border-[#7B68EE] transition-colors"
                maxLength={20}
              />
              <p className="text-sm text-gray-400 mt-2">
                Will appear as @{config.nickname || "nickname"}
              </p>
            </div>
          </div>

          {/* Right Side - Customization */}
          <div className="bg-[#252836] rounded-2xl p-6">
            <h2 className="text-2xl font-semibold mb-6">
              Customize Profile Picture
            </h2>

            {/* Tabs */}
            <div className="flex space-x-4 mb-8 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-lg font-medium pb-2 border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab
                      ? "text-[#7B68EE] border-[#7B68EE]"
                      : "text-gray-400 border-transparent hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="space-y-8 h-full overflow-y-auto">
              {activeTab === "Background" && (
                <>
                  {/* Select Color */}
                  <div>
                    <h3 className="text-xl font-medium mb-4">Select Color</h3>
                    <div className="flex flex-wrap items-center gap-3 px-2">
                      {solidColors.map((color, index) => (
                        <button
                          key={index}
                          className={`w-12 h-12 rounded-lg border-2 transition-all relative ${
                            config.background.type === "solid" &&
                            config.background.color === color
                              ? "border-white scale-110"
                              : "border-gray-700 hover:border-gray-400"
                          }`}
                          style={{
                            backgroundColor:
                              color === "transparent" ? "transparent" : color,
                            backgroundImage:
                              color === "transparent"
                                ? "linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)"
                                : "none",
                            backgroundSize:
                              color === "transparent" ? "8px 8px" : "auto",
                            backgroundPosition:
                              color === "transparent"
                                ? "0 0, 0 4px, 4px -4px, -4px 0px"
                                : "auto",
                          }}
                          onClick={() => {
                            updateConfig("background", "type", "solid");
                            updateConfig("background", "color", color);
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Select Gradient */}
                  <div>
                    <h3 className="text-xl font-medium mb-4">
                      Select Gradient
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 px-2">
                      {gradientColors.map((gradient, index) => (
                        <button
                          key={index}
                          className={`w-12 h-12 rounded-lg border-2 transition-all ${
                            config.background.type === "gradient" &&
                            config.background.gradient === gradient
                              ? "border-white scale-110"
                              : "border-transparent hover:border-gray-400"
                          }`}
                          style={{ background: gradient }}
                          onClick={() => {
                            updateConfig("background", "type", "gradient");
                            updateConfig("background", "gradient", gradient);
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </>
              )}

              {activeTab === "Head" && (
                <div>
                  <h3 className="text-xl font-medium mb-4">
                    Select Head Style
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 px-2">
                    {heads.map((head) => (
                      <button
                        key={head.id}
                        className={`w-[80px] h-[80px] rounded-lg border-2 transition-all overflow-hidden bg-gray-100 ${
                          config.head.style === head.id
                            ? "border-white scale-110"
                            : "border-transparent hover:border-gray-400"
                        }`}
                        onClick={() => updateConfig("head", "style", head.id)}
                      >
                        <div
                          className="w-full h-full bg-cover bg-center"
                          style={{
                            backgroundImage: `url(${head.image})`,
                            backgroundPosition: "center",
                            backgroundSize: "100% 100%",
                          }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "Body" && (
                <div>
                  <h3 className="text-xl font-medium mb-4">
                    Select Body Style
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 px-2">
                    {bodies.map((body) => (
                      <button
                        key={body.id}
                        className={`w-[80px] h-[80px] rounded-lg border-2 transition-all overflow-hidden bg-gray-100 ${
                          config.body.style === body.id
                            ? "border-white scale-110"
                            : "border-transparent hover:border-gray-400"
                        }`}
                        onClick={() => updateConfig("body", "style", body.id)}
                      >
                        <div
                          className="w-full h-full bg-cover bg-center"
                          style={{
                            backgroundImage: `url(${body.image})`,
                            backgroundPosition: "center",
                            backgroundSize: "100% 100%",
                          }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "Skin" && (
                <div>
                  <h3 className="text-xl font-medium mb-4">Select Skin Tone</h3>
                  <div className="flex flex-wrap items-center gap-3 px-2">
                    {skinTones.map((tone, index) => (
                      <button
                        key={index}
                        className={`w-12 h-12 rounded-full border-2 transition-all ${
                          config.head.skinTone === tone
                            ? "border-white scale-110"
                            : "border-transparent hover:border-gray-400"
                        }`}
                        style={{
                          backgroundColor:
                            tone === "transparent" ? "transparent" : tone,
                          backgroundImage:
                            tone === "transparent"
                              ? "linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)"
                              : "none",
                          backgroundSize:
                            tone === "transparent" ? "8px 8px" : "auto",
                          backgroundPosition:
                            tone === "transparent"
                              ? "0 0, 0 4px, 4px -4px, -4px 0px"
                              : "auto",
                        }}
                        onClick={() => updateConfig("head", "skinTone", tone)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "Hair Color" && (
                <div>
                  <h3 className="text-xl font-medium mb-4">
                    Select Hair Color
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 px-2">
                    {hairColors.map((color, index) => (
                      <button
                        key={index}
                        className={`w-12 h-12 rounded-full border-2 transition-all ${
                          config.head.hairColor === color
                            ? "border-white scale-110"
                            : "border-transparent hover:border-gray-400"
                        }`}
                        style={{
                          backgroundColor:
                            color === "transparent" ? "transparent" : color,
                          backgroundImage:
                            color === "transparent"
                              ? "linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)"
                              : "none",
                          backgroundSize:
                            color === "transparent" ? "8px 8px" : "auto",
                          backgroundPosition:
                            color === "transparent"
                              ? "0 0, 0 4px, 4px -4px, -4px 0px"
                              : "auto",
                        }}
                        onClick={() => updateConfig("head", "hairColor", color)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Download Button */}
        <div className="flex items-center justify-center gap-2 text-center mt-8 pb-8">
          <button
            onClick={reset}
            className="bg-[#4A90E2] hover:bg-[#357ABD] text-white px-12 py-3 text-lg font-medium rounded-xl transition-colors"
          >
            Reset
          </button>
          <button
            onClick={downloadPFP}
            className="bg-[#4A90E2] hover:bg-[#357ABD] text-white px-12 py-3 text-lg font-medium rounded-xl transition-colors"
          >
            Download PFP
          </button>
        </div>
      </div>
    </div>
  );
}
