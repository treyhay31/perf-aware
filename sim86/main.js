import parser from './parser.js'

const file_name = 'listing_0037_single_register_mov'
// const file_name = 'listing_0038_many_register_mov'
// const file_name = 'listing_0039_more_movs'
// const file_name = 'listing_0040_challenge_movs'

const file = {
    asm: await Deno.readFile(`./${file_name}.asm`),
    binary: await Deno.readFile(`./${file_name}`)
}

console.log("disassemble", file_name)
await parser.disassemble(file_name, file.binary)

const assemble = Deno.run({ cmd: ["nasm.exe", `${file_name}.asm`, `-o`, `thing`] })
await assemble.status()
assemble.close()
