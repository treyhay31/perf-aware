const directions = {
    "0": "to register",
    "1": "from register"
}
const word = {
    "0": "byte",
    "1": "word",
}
const mods = {
    "00": "Memory Mode, no displacement",
    "01": "Memory Mode, 8-bit displacement follows",
    "10": "Memory Mode, 16-bit displacement follows",
    "11": "Register Mode, no displacement",
}
const regs = {
    "000": ["al", "ax"],
    "001": ["cl", "cx"],
    "010": ["dl", "dx"],
    "011": ["bl", "bx"],
    "100": ["ah", "sp"],
    "101": ["ch", "bp"],
    "110": ["dh", "si"],
    "111": ["bh", "di"],
}
const rms = {
    "000": {
        "00": "[bx + si]",
        "01": (d8) => 0 !== d8 ? `[bx + si + ${d8}]` : `[bx + si]`,
        "10": (d16) => 0 !== d16 ? `[bx + si + ${d16}]` : `[bx + si]`,
    },
    "001": {
        "00": "[bx + di]",
        "01": (d8) => 0 !== d8 ? `[bx + di + ${d8}]` : `[bx + di]`,
        "10": (d16) => 0 !== d16 ? `[bx + di + ${d16}]` : `[bx + di]`,
    },
    "010": {
        "00": "[bp + si]",
        "01": (d8) => 0 !== d8 ? `[bp + si + ${d8}]` : `[bp + si]`,
        "10": (d16) => 0 !== d16 ? `[bp + si + ${d16}]` : `[bp + si]`,
    },
    "011": {
        "00": "[bp + di]",
        "01": (d8) => 0 !== d8 ? `[bp + di + ${d8}]` : `[bp + di]`,
        "10": (d16) => 0 !== d16 ? `[bp + di + ${d16}]` : `[bp + di]`,
    },
    "100": {
        "00": "[si]",
        "01": (d8) => 0 !== d8 ? `[si + ${d8}]` : `[si]`,
        "10": (d16) => 0 !== d16 ? `[si + ${d16}]` : `[si]`,
    },
    "101": {
        "00": "[di]",
        "01": (d8) => 0 !== d8 ? `[di + ${d8}]` : `[di]`,
        "10": (d16) => 0 !== d16 ? `[di + ${d16}]` : `[di]`,
    },
    "110": {
        "00": "[bp]",
        "01": (d8) => 0 !== d8 ? `[bp + ${d8}]` : `[bp]`,
        "10": (d16) => 0 !== d16 ? `[bp + ${d16}]` : `[bp]`,
    },
    "111": {
        "00": "[bx]",
        "01": (d8) => 0 !== d8 ? `[bx + ${d8}]` : `[bx]`,
        "10": (d16) => 0 !== d16 ? `[bx + ${d16}]` : `[bx]`,
    },
}

export { directions, word, mods, regs, rms }