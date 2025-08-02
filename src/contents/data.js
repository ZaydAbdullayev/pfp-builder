import head_1 from "../assets/head_1.png";
import head_2 from "../assets/head_2.png";
import head_3 from "../assets/head_3.png";
import head_4 from "../assets/head_4.png";
import head_5 from "../assets/head_5.png";
import head_6 from "../assets/head_6.png";
import head_7 from "../assets/head_7.png";
import head_8 from "../assets/head_8.png";
import head_9 from "../assets/head_9.png";
import head_10 from "../assets/head_10.png";
import head_11 from "../assets/head_11.png";
import head_12 from "../assets/head_12.png";

import body_1 from "../assets/body_1.png";
import body_2 from "../assets/body_2.png";
import body_3 from "../assets/body_3.png";
import body_4 from "../assets/body_4.png";
import body_5 from "../assets/body_5.png";
import body_6 from "../assets/body_6.png";
import body_7 from "../assets/body_7.png";
import body_8 from "../assets/body_8.png";
import body_9 from "../assets/body_9.png";
import body_10 from "../assets/body_10.png";
import body_11 from "../assets/body_11.png";
import body_12 from "../assets/body_12.png";

export const heads = [
    { id: 0, name: "Short Male", image: head_1 },
    { id: 1, name: "Wavy Shoulder", image: head_2 },
    { id: 2, name: "Straight Bangs", image: head_3 },
    { id: 3, name: "Long Wavy", image: head_4 },
    { id: 4, name: "Spiky Messy", image: head_5 },
    { id: 5, name: "Shoulder Wavy", image: head_6 },
    { id: 6, name: "Buzz Cut", image: head_7 },
    { id: 7, name: "Medium Wavy", image: head_8 },
    { id: 8, name: "Textured Short", image: head_9 },
    { id: 9, name: "Slicked Back", image: head_10 },
    { id: 10, name: "Bob Bangs", image: head_11 },
    { id: 11, name: "Shoulder Length", image: head_12 },
];
export const bodies = [
    { id: 0, name: "Long Sleeve", image: body_1 },
    { id: 1, name: "T-Shirt", image: body_2 },
    { id: 2, name: "Loose Tee", image: body_3 },
    { id: 3, name: "Fitted Tee", image: body_4 },
    { id: 4, name: "Sweater", image: body_5 },
    { id: 5, name: "Dress Shirt", image: body_6 },
    { id: 6, name: "Casual Tee", image: body_7 },
    { id: 7, name: "Basic Tee", image: body_8 },
    { id: 8, name: "V-Neck", image: body_9 },
    { id: 9, name: "Plain Tee", image: body_10 },
    { id: 10, name: "Blazer", image: body_11 },
    { id: 11, name: "Sport Tee", image: body_12 },
];

export const defaultConfig = {
    background: {
        type: "solid",
        color: "#4A90E2",
        gradient: "linear-gradient(135deg, #FF6B35, #F7931E)",
    },
    head: {
        style: null,
        skinTone: "#DEB887",
        hairColor: "#8B4513",
    },
    body: {
        style: null,
    },
    nickname: "",
};

export const solidColors = [
    "#4A90E2",
    "#50C878",
    "#FFD700",
    "#FF6B35",
    "#FF4757",
    "#E91E63",
    "#4A4A4A",
    "#fff",
    "transparent",
];

export const gradientColors = [
    "linear-gradient(135deg, #FF6B35, #F7931E)",
    "linear-gradient(135deg, #E91E63, #FF6B35)",
    "linear-gradient(135deg, #4A90E2, #7B68EE)",
    "linear-gradient(135deg, #7B68EE, #9370DB)",
    "linear-gradient(135deg, #FF69B4, #FF1493)",
    "linear-gradient(135deg, #50C878, #32CD32)",
    "linear-gradient(135deg, #DA70D6, #BA55D3)",
    "linear-gradient(135deg, #DB7093, #FF6B35)",
    "linear-gradient(135deg, #FF4500, #FF6347)",
    "linear-gradient(135deg, #1E90FF, #00BFFF)",
    "linear-gradient(135deg, #00CED1, #20B2AA)",
    "linear-gradient(135deg, #7FFF00, #ADFF2F)",
    "linear-gradient(135deg, #FF8C00, #FFA500)",
    "linear-gradient(135deg, #FF00FF, #DA70D6)",
    "linear-gradient(135deg, #00FF00, #32CD32)",
];

export const skinTones = [
    "#FDBCB4", // Light
    "#F1C27D", // Light-Medium
    "#E0AC69", // Medium
    "#C68642", // Medium-Dark
    "#8D5524", // Dark
    "#654321", // Very Dark
    "#DEB887", // Neutral
    "#fff", // White
    "#000", // Black
    "transparent", // Transparent
];

export const hairColors = [
    "#000000", // Black
    "#8B4513", // Brown
    "#DAA520", // Blonde
    "#B22222", // Red
    "#708090", // Gray
    "#4B0082", // Purple
    "#FF69B4", // Pink
    "#fff", // White
    "#d3d3d3", // Light Gray
    "#00008B", // Dark Blue
    "#800080", // Purple
    "#FF4500", // Orange Red
    "#2F4F4F", // Dark Slate Gray
    "#A52A2A", // Brown
    "#808080", // Gray
    "#FF6347", // Tomato
    "#FF1493", // Deep Pink
    "#00CED1", // Dark Turquoise
    "#7FFF00", // Chartreuse
    "#FF8C00", // Dark Orange
    "#ADFF2F", // Green Yellow
    "#FF00FF", // Magenta
    "#00FF00", // Lime
    "#0000FF", // Blue
    "#FFFF00", // Yellow
];

export const gradientPairs = [
    ["#FF6B35", "#F7931E"],
    ["#E91E63", "#FF6B35"],
    ["#4A90E2", "#7B68EE"],
    ["#7B68EE", "#9370DB"],
    ["#FF69B4", "#FF1493"],
    ["#50C878", "#32CD32"],
    ["#DA70D6", "#BA55D3"],
    ["#DB7093", "#FF6B35"],
    ["#FF4500", "#FF6347"],
    ["#1E90FF", "#00BFFF"],
    ["#00CED1", "#20B2AA"],
    ["#7FFF00", "#ADFF2F"],
    ["#FF8C00", "#FFA500"],
    ["#FF00FF", "#DA70D6"],
    ["#00FF00", "#32CD32"],
];
