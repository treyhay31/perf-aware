import convert from "./convert.js"
import instructions from "./instructions.js"
import { regs, rms } from "./constants.js"
import log from "./logger.js"
/*
    [ | | | | | |     |      ] [  |  | | | | | | ]
    | opcode    | dir | word | | mod | reg | r/m |
*/
const get_mod = (mod, rm, w, data) => {
    if (mod === "11") { // register mode - no displacement bits
        return regs[rm][w]
    }
    if (mod === "00") { // memory mode - no displacement bits
        //* displacement bits if rm === 110
        if (rm === "110") {
            return rms[rm][mod](data)
        }
        return rms[rm][mod]
    }
    if (data === -1) {
        return rms[rm]["00"]
    }
    return rms[rm][mod](data)
}

const get_data = (i, binary, w, mod) => {
    if (mod === "11") {
        return -1
                const bin = `${convert.int_to_byte(binary[i + 1])}`
        log("narrow bin => ", binary[i + 1], bin, w, mod)
        return binary[i + 1]
    }
    if (mod === "01") {
        // this is a 'wide' operation 
        // but the mod only colls for a 'narrow' piece of data
        // only grab the low half
        const bin = `${convert.int_to_byte(binary[i + 1])}`
        log("w && mod-01 wide bin => ", bin, w, mod)
        return binary[i + 1]
    }
    if (w === 1 || mod === "10") {
        const bin = `${convert.int_to_byte(binary[i + 2])}${convert.int_to_byte(binary[i + 1])}`
        log("w wide bin => ", bin, w, mod)
        return convert.byte_to_int(bin)
    }
    const bin = `${convert.int_to_byte(binary[i + 1])}`
    log("narrow bin => ", binary[i + 1], bin, w, mod)
    return binary[i + 1]
}

const get_instruction = int_byte => {

    const byte1 = convert.int_to_byte(int_byte)

    if (byte1 === null || byte1 === undefined)
        throw new Error(`da byte was nuffin, ${int_byte}`)

    if (byte1 === "00000000") {
        throw new Error(`zippo...`)
    }

    // Register/memory to/from register
    if (byte1.startsWith("100010")) {
        log("Register/memory to/from register")
        return instructions[byte1.substring(0, 6)]()
    }
    // immediate to register/memory
    if (byte1.startsWith("1100011")) {
        log("immediate to register/memory")
        return instructions[byte1.substring(0, 7)]()
    }
    // immediate to register
    if (byte1.startsWith("1011")) {
        log("immediate to register", byte1)
        return instructions[byte1.substring(0, 4)]()
    }
    // memory to accumulator
    if (byte1.startsWith("1010000")) {
        log("memory to accumulator", byte1)
        return instructions[byte1.substring(0, 7)]()
    }
    // accumulator to memory
    if (byte1.startsWith("1010001")) {
        log("accumulator to memory", byte1)
        return instructions[byte1.substring(0, 7)]()
    }

    const err = `da byte was not in our wheelhouse, (${int_byte}) ${byte1}`
    console.error(err)
    throw err
}

const byte_inspector = {
    get_instruction,
    get_mod,
    get_data
}

export default byte_inspector