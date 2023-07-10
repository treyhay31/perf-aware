import convert from "./convert.js"
import { rms, mods, regs, directions } from "./constants.js"
import byte_inspector from "./byte_inspector.js"
import log from "./logger.js"


const instructions = {
    "100010": () => {
        const instruction = {
            opcode: "mov",
            desc: "register/mem to/from register",
            w_index: 7,
            d_index: 6,
            mod_start: 0,
            mod_end: 2,
            reg_start: 2,
            reg_end: 5,
            rm_start: 5,
            rm_end: 8,
            total_bytes_required: (w) => 2 + w,
        }
        return {
            write_assembly: (index, binary) => {
                const byte1 = convert.int_to_byte(binary[index])
                log(instruction, index, binary, binary.map(convert.int_to_byte))

                const opcode = instruction.opcode
                const d_byte = convert.bit_string_to_num(byte1[instruction.d_index])
                const w_byte = convert.bit_string_to_num(byte1[instruction.w_index])

                const byte2 = convert.int_to_byte(binary[index + 1])
                const mod = byte2.substring(instruction.mod_start, instruction.mod_end)
                const reg = byte2.substring(instruction.reg_start, instruction.reg_end)
                const rm = byte2.substring(instruction.rm_start, instruction.rm_end) 
                log(JSON.stringify({byte1, byte2, opcode, d_byte, w_byte, mod, reg, rm}, null, 2))
                
                const data = byte_inspector.get_data(index+1, binary, w_byte, mod)
                const data_1 = `${byte_inspector.get_mod(mod, rm, w_byte, data)}`
                const data_2 = `${regs[reg][w_byte]}`

                const [dest, src] = d_byte === 1
                    ? [data_2, data_1]
                    : [data_1, data_2]

                return {
                    new_index: index + 2,
                    assembly: `${opcode} ${dest}, ${src}`
                }
            }
        }
    },
    "1100011": () => {
        const instruction = {
            opcode: "mov",
            desc: "immediate to register/memory",
            w_index: 7,
            mod_start: 0,
            mod_end: 2,
            rm_start: 5,
            rm_end: 8,
            total_bytes_required: (w) => 3 + w,
        }
        return {
            write_assembly: (index, binary) => {
                log(instruction)
                return {
                    assembly: "mov",
                    new_index: index + 2,
                }
            }
        }
    },
    "1011": () => {
        const instruction = {
            opcode: "mov",
            desc: "immediate to register",
            w_index: 4,
            reg_start: 5,
            reg_end: 8,
            total_bytes_required: (w) => 2 + w,
        }
        return {
            write_assembly: (index, binary) => {
                log(instruction)
                const byte1 = convert.int_to_byte(binary[index])
                log("immediate to register", byte1)
                const opcode = instruction.opcode
                const w_byte = convert.bit_string_to_num(byte1[instruction.w_index])
                const reg = byte1.substring(instruction.reg_start, instruction.reg_end)
                const total_bytes_required = instruction.total_bytes_required(w_byte)
                log(JSON.stringify({opcode, w_byte, reg, total_bytes_required}, null, 2))

                const dest = regs[reg][w_byte]
                const src = byte_inspector.get_data(index, binary, w_byte)
                
                return {
                    assembly: `${opcode} ${dest}, ${src}`,
                    new_index: index + total_bytes_required
                }
            }
        }
    },
    "1010000": () => {
        const instruction = {
            opcode: "mov",
            desc: "memory to accumulator",
            w_index: 7,
            total_bytes_required: (w) => 2 + w,
        }
        return {
            write_assembly: (index, binary) => {
                log(instruction)
                return {
                    assembly: "mov",
                    new_index: index + 2,
                }
            }
        }
    },
    "1010001": () => {
        const instruction = {
            opcode: "mov",
            desc: "accumulator to memory",
            w_index: 7,
            total_bytes_required: (w) => 2 + w,
        }
        return {
            write_assembly: (index, binary) => {
                log(instruction)
                return {
                    assembly: "mov",
                    new_index: index + 2,
                }
            }
        }
    },
}

export default instructions;