import { regs, rms, mods } from "./constants.js"
import convert from "./convert.js"
import byte_inspector from "./byte_inspector.js"
import log from "./logger.js"

const padded_int = (int) => int.toString().padStart(4, " ")
const parser = {
    display: (file_name, binary) => {
        log("display: ", file_name, binary)
        // log 4 bytes per line
        let result = `; ${file_name}\r\n`
        let i = 0
        while (i < binary.length) {
            const byte1 = binary[i]
            const byte2 = i < binary.length - 1 ? binary[i + 1] : -1
            const byte3 = i < binary.length - 2 ? binary[i + 2] : -1
            const byte4 = i < binary.length - 3 ? binary[i + 3] : -1
            result += `${padded_int(byte1)} ${padded_int(byte2)} ${padded_int(byte3)} ${padded_int(byte4)}         ${convert.int_to_byte(byte1)} ${convert.int_to_byte(byte2)} ${convert.int_to_byte(byte3)} ${convert.int_to_byte(byte4)}\r\n`
            i += 4
        }
        log(result, i, binary.length)
    },
    disassemble: async (file_name, binary) => {

        let disassembled_content = `
;${file_name}.asm
16 bits
`
        log("binary size => ", binary.length)
        let i = 0
        while (i < binary.length) {
            const byte1 = convert.int_to_byte(binary[i])

            if (byte1 === null || byte1 === undefined) {
                throw `da byte was nuffin, ${i}`
            }

            if (byte1 === "00000000") {
                i++ // skip because it is already handled
                continue
            }

            if (byte1.startsWith("100010")) {// Register/memory to/from register
                const instruction = byte_inspector.get_instruction(byte1).write_assembly(binary, i)

                disassembled_content += ` 
${instruction.assembly}`
                i = instruction.new_index
                log("disassembled_content => ", disassembled_content)
                continue
            }

            // immediate to register/memory
            if (byte1.startsWith("1100011")) {
                log("immediate to register/memory")
                const instruction = instructions[byte1.substring(0, 7)]
                const opcode = instruction.opcode
                const d_byte = convert.bit_string_to_num(byte1[instruction.d_index])
                const w_byte = convert.bit_string_to_num(byte1[instruction.w_index])

                const total_bytes_required = instruction.total_bytes_required(w_byte)
                log("requires more bytes => ", total_bytes_required)

                const byte2 = convert.int_to_byte(binary[i + 1])
                const mod = byte2.substring(instruction.mod_start, instruction.mod_end)
                const mem = byte2.substring(instruction.rm_start, instruction.rm_end) // r/m
                log(`bytes ${i + 1} & ${i + 2}`, byte1, byte2,
                    JSON.stringify({ opcode, d_byte, w_byte, mod, mem }, null, 2))

                log(JSON.stringify({
                    opcode: `[${byte1.substring(0, 6)}] ${instruction.desc} (${opcode})`,
                    direction: `${directions[d_byte]} (${convert.bit_string_to_num(d_byte)})`,
                    word_wide: `${word[w_byte]} (${w_byte})`,
                    mod: `${mods[mod]} (${mod})`,
                    mem: `${byte_inspector.get_mod(mod, mem, w_byte, byte_inspector.get_data(i, binary, w_byte, mods[mod]))} (${mem})`
                }, null, 2))

                disassembled_content += ` 
${opcode} ${byte_inspector.get_mod(mod, mem, w_byte, byte_inspector.get_data(i, binary, w_byte, mods[mod]))}, [${byte_inspector.get_data(i + 1 + w_byte, binary, w_byte, mods[mod])}]`
                i += total_bytes_required
                log("disassembled_content => ", disassembled_content)
                continue
            }
            // immediate to register
            if (byte1.startsWith("1011")) {
                log("immediate to register", byte1)
                const instruction = instructions[byte1.substring(0, 4)]
                const opcode = instruction.opcode
                const w_byte = convert.bit_string_to_num(byte1[instruction.w_index])
                const reg = byte1.substring(instruction.reg_start, instruction.reg_end)
                const total_bytes_required = instruction.total_bytes_required(w_byte)
                log("requires more bytes => ", total_bytes_required)

                disassembled_content += ` 
${opcode} ${regs[reg][w_byte]}, ${byte_inspector.get_data(i, binary, w_byte)}`
                i += total_bytes_required
                log("disassembled_content => ", disassembled_content)
                continue
            }
            // memory to accumulator
            if (byte1.startsWith("1010000")) {
                log("memory to accumulator", byte1)
                const instruction = instructions[byte1.substring(0, 7)]
                i++
                continue
            }
            // accumulator to memory
            if (byte1.startsWith("1010001")) {
                log("accumulator to memory", byte1)
                const instruction = instructions[byte1.substring(0, 7)]
                i++
                continue
            }

            const err = `da byte was not in our wheelhouse, (${i}) ${byte1}, ${convert.int_to_byte(binary[i + 1])}`
            console.error(err)
            if (i + 1 >= binary.length) {
                throw err
            }

            i++

        }
        log(`disassembled_content =>`, disassembled_content)
        log(`expected =>`, (await Deno.readTextFile(`./${file_name}.asm`)))
        Deno.writeTextFile(`./disassembled_${file_name}.asm`, disassembled_content)
    }
}

// deno export module

export default parser;
