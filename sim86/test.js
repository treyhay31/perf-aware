import {
    assert,
    assertEquals,
    assertThrows,
    assertThrowsAsync
} from "https://deno.land/std@0.112.0/testing/asserts.ts";
import {  rms, mods, regs, directions } from "./constants.js";
import instructions from "./instructions.js";
import byte_inspector from "./byte_inspector.js";
import convert from "./convert.js";
import parser from './parser.js'

// const file_name = 'listing_0037_single_register_mov'
// const file_name = 'listing_0038_many_register_mov'
const file_name = 'listing_0039_more_movs'
// const file_name = 'listing_0037_single_register_mov'

const expected = {
    "listing_0037_single_register_mov": `
    ;listing_0037_single_register_mov.asm
    16 bits
     
    mov cx, bx`,
    "listing_0038_many_register_mov": `
    ;listing_0038_many_register_mov.asm
    16 bits
     
    mov cx, bx 
    mov ch, ah 
    mov dx, bx 
    mov si, bx 
    mov bx, di 
    mov al, cl 
    mov ch, ch 
    mov bx, ax 
    mov bx, si 
    mov sp, di 
    mov bp, ax`,
    "listing_0039_more_movs": `
    ;listing_0039_more_movs.asm
    16 bits
     
    mov si, bx 
    mov dh, al 
    mov cl, 12 
    mov ch, 244 
    mov cx, 12 
    mov cx, 65524 
    mov dx, 3948 
    mov dx, 61588 
    mov al, [bx + si] 
    mov bx, [bp + di] 
    mov dx, [bp] 
    mov ah, [bx + si + 4] 
    mov al, [bx + si + 4999] 
    mov [bx + di], cx 
    mov [bp + si], cl 
    mov [bp], ch`,
    "listing_0040_challenge_movs": `
    ;listing_0040_challenge_movs.asm
    bits 16

    mov ax, [bx + di - 37]
    mov [si - 300], cx
    mov dx, [bx - 32]
    mov [bp + di], byte 7
    mov [di + 901], word 347
    mov bp, [5]
    mov bx, [3458]
    mov ax, [2555]
    mov ax, [16]
    mov [2554], ax
    mov [15], ax
    `
}

const file = {
    asm: await Deno.readFile(`./${file_name}.asm`),
    binary: await Deno.readFile(`./${file_name}`)
}
console.log("display", parser.display(file_name, file.binary))
console.log("file bytes", file.binary)
console.log("expected", expected[file_name])
Deno.test("handles null...", () => {
    assertThrows(() => {
        byte_inspector.get_instruction(null)
    }, Error)
});
// Deno.test("handles undefined...", () => {
//     assertThrows(() => {
//         byte_inspector.get_instruction(undefined)
//     }, Error)
// });
// Deno.test("handles non-instruction bytes...", () => {
//     assertThrows(() => {
//         byte_inspector.get_instruction("trey")
//     }, Error)
// });

Deno.test("Get data", () => {
    const binary = [
        137, 217
    ]
    const actual = byte_inspector.get_data(0, binary, "1", "001")  
    assertEquals(217, actual)
});


Deno.test("The expected assembly - file 37", () => {
    const binary = [
        137, 217
    ]
    const actual = byte_inspector.get_instruction(binary[0]).write_assembly(0, binary) 
    const expected = {
        assembly: "mov cx, bx",
        new_index: 2
    }
    assertEquals(expected.assembly, actual.assembly)
    assertEquals(expected.new_index, actual.new_index)
});

Deno.test("The expected assembly - file 38", () => {
    const binary = [
        137, 217, 136, 229, 137,
        218, 137, 222, 137, 251,
        136, 200, 136, 237, 137,
        195, 137, 243, 137, 252,
        137, 197 
    ]
    let index = 0

    {
        const byte = convert.int_to_byte(binary[index])
        const actual = byte_inspector.get_instruction(byte).write_assembly(index, binary) 
        const expected = {
            assembly: "mov cx, bx",
            new_index: 2
        }
        console.log("bytes", binary[index], binary[index + 1], convert.int_to_byte(binary[index]), convert.int_to_byte(binary[index + 1]))
        console.log("expected assembly", expected.assembly)
        assertEquals(expected.assembly, actual.assembly)
        assertEquals(expected.new_index, actual.new_index)
        index = actual.new_index
    }

    {
        const byte = convert.int_to_byte(binary[index])
        const actual = byte_inspector.get_instruction(byte).write_assembly(index, binary) 
        const expected = {
            assembly: "mov ch, ah",
            new_index: 4 
        }
        console.log("bytes", binary[index], binary[index + 1], convert.int_to_byte(binary[index]), convert.int_to_byte(binary[index + 1]))
        console.log("expected assembly", expected.assembly)
        assertEquals(expected.assembly, actual.assembly)
        assertEquals(expected.new_index, actual.new_index)
        index = actual.new_index
    }
    
    {
        const byte = convert.int_to_byte(binary[index])
        const actual = byte_inspector.get_instruction(byte).write_assembly(index, binary) 
        const expected = {
            assembly: "mov dx, bx",
            new_index: 6 
        }
        console.log("bytes", binary[index], binary[index + 1], convert.int_to_byte(binary[index]), convert.int_to_byte(binary[index + 1]))
        console.log("expected assembly", expected.assembly)
        assertEquals(expected.assembly, actual.assembly)
        assertEquals(expected.new_index, actual.new_index)
        index = actual.new_index
    }
    
    {
        const byte = convert.int_to_byte(binary[index])
        const actual = byte_inspector.get_instruction(byte).write_assembly(index, binary) 
        const expected = {
            assembly: "mov si, bx",
            new_index: 8 
        }
        console.log("bytes", binary[index], binary[index + 1], convert.int_to_byte(binary[index]), convert.int_to_byte(binary[index + 1]))
        console.log("expected assembly", expected.assembly)
        assertEquals(expected.assembly, actual.assembly)
        assertEquals(expected.new_index, actual.new_index)
        index = actual.new_index
    }
    
    {
        const byte = convert.int_to_byte(binary[index])
        const actual = byte_inspector.get_instruction(byte).write_assembly(index, binary) 
        const expected = {
            assembly: "mov bx, di",
            new_index: 10 
        }
        console.log("bytes", binary[index], binary[index + 1], convert.int_to_byte(binary[index]), convert.int_to_byte(binary[index + 1]))
        console.log("expected assembly", expected.assembly)
        assertEquals(expected.assembly, actual.assembly)
        assertEquals(expected.new_index, actual.new_index)
        index = actual.new_index
    }
    
    {
        const byte = convert.int_to_byte(binary[index])
        const actual = byte_inspector.get_instruction(byte).write_assembly(index, binary) 
        const expected = {
            assembly: "mov al, cl",
            new_index: 12 
        }
        console.log("bytes", binary[index], binary[index + 1], convert.int_to_byte(binary[index]), convert.int_to_byte(binary[index + 1]))
        console.log("expected assembly", expected.assembly)
        assertEquals(expected.assembly, actual.assembly)
        assertEquals(expected.new_index, actual.new_index)
        index = actual.new_index
    }
    
    {
        const byte = convert.int_to_byte(binary[index])
        const actual = byte_inspector.get_instruction(byte).write_assembly(index, binary) 
        const expected = {
            assembly: "mov ch, ch",
            new_index: 14 
        }
        console.log("bytes", binary[index], binary[index + 1], convert.int_to_byte(binary[index]), convert.int_to_byte(binary[index + 1]))
        console.log("expected assembly", expected.assembly)
        assertEquals(expected.assembly, actual.assembly)
        assertEquals(expected.new_index, actual.new_index)
        index = actual.new_index
    }
    
    {
        const byte = convert.int_to_byte(binary[index])
        const actual = byte_inspector.get_instruction(byte).write_assembly(index, binary) 
        const expected = {
            assembly: "mov bx, ax",
            new_index: 16 
        }
        console.log("bytes", binary[index], binary[index + 1], convert.int_to_byte(binary[index]), convert.int_to_byte(binary[index + 1]))
        console.log("expected assembly", expected.assembly)
        assertEquals(expected.assembly, actual.assembly)
        assertEquals(expected.new_index, actual.new_index)
        index = actual.new_index
    }
    
    {
        const byte = convert.int_to_byte(binary[index])
        const actual = byte_inspector.get_instruction(byte).write_assembly(index, binary) 
        const expected = {
            assembly: "mov bx, si",
            new_index: 18 
        }
        console.log("bytes", binary[index], binary[index + 1], convert.int_to_byte(binary[index]), convert.int_to_byte(binary[index + 1]))
        console.log("expected assembly", expected.assembly)
        assertEquals(expected.assembly, actual.assembly)
        assertEquals(expected.new_index, actual.new_index)
        index = actual.new_index
    }
    
    {
        const byte = convert.int_to_byte(binary[index])
        const actual = byte_inspector.get_instruction(byte).write_assembly(index, binary) 
        const expected = {
            assembly: "mov sp, di",
            new_index: 20 
        }
        console.log("bytes", binary[index], binary[index + 1], convert.int_to_byte(binary[index]), convert.int_to_byte(binary[index + 1]))
        console.log("expected assembly", expected.assembly)
        assertEquals(expected.assembly, actual.assembly)
        assertEquals(expected.new_index, actual.new_index)
        index = actual.new_index
    }
    
    {
        const byte = convert.int_to_byte(binary[index])
        const actual = byte_inspector.get_instruction(byte).write_assembly(index, binary) 
        const expected = {
            assembly: "mov bp, ax",
            new_index: 22 
        }
        console.log("bytes", binary[index], binary[index + 1], convert.int_to_byte(binary[index]), convert.int_to_byte(binary[index + 1]))
        console.log("expected assembly", expected.assembly)
        assertEquals(expected.assembly, actual.assembly)
        assertEquals(expected.new_index, actual.new_index)
        index = actual.new_index
    }
});


Deno.test("The expected assembly - file 39", () => {
    const binary = [
        137, 222, 136, 198, 177,  12, 181, 244, 185,
         12,   0, 185, 244, 255, 186, 108,  15, 186,
        148, 240, 138,   0, 139,  27, 139,  86,   0,
        138,  96,   4, 138, 128, 135,  19, 137,   9,
        136,  10, 136, 110,   0
    ]

    let index = 0
    {
        const byte = convert.int_to_byte(binary[index])
        const actual = byte_inspector.get_instruction(byte).write_assembly(index, binary) 
        const expected = {
            assembly: "mov si, bx",
            new_index: 2 
        }
        console.log("bytes", binary[index], binary[index + 1], convert.int_to_byte(binary[index]), convert.int_to_byte(binary[index + 1]))
        console.log("expected assembly", expected.assembly)
        assertEquals(expected.assembly, actual.assembly)
        assertEquals(expected.new_index, actual.new_index)
        index = actual.new_index
    }
    
    {
        const byte = convert.int_to_byte(binary[index])
        const actual = byte_inspector.get_instruction(byte).write_assembly(index, binary) 
        const expected = {
            assembly: "mov dh, al",
            new_index: 4 
        }
        console.log("bytes", binary[index], binary[index + 1], convert.int_to_byte(binary[index]), convert.int_to_byte(binary[index + 1]))
        console.log("expected assembly", expected.assembly)
        assertEquals(expected.assembly, actual.assembly)
        assertEquals(expected.new_index, actual.new_index)
        index = actual.new_index
    }
    
    {
        const byte = convert.int_to_byte(binary[index])
        const actual = byte_inspector.get_instruction(byte).write_assembly(index, binary) 
        const expected = {
            assembly: "mov cl, 12",
            new_index: 6 
        }
        console.log("bytes", binary[index], binary[index + 1], convert.int_to_byte(binary[index]), convert.int_to_byte(binary[index + 1]))
        console.log("expected assembly", expected.assembly)
        assertEquals(expected.assembly, actual.assembly)
        assertEquals(expected.new_index, actual.new_index)
        index = actual.new_index
    }

    {
        const byte = convert.int_to_byte(binary[index])
        const actual = byte_inspector.get_instruction(byte).write_assembly(index, binary) 
        const expected = {
            assembly: "mov ch, 244",
            new_index: 8 
        }
        console.log("bytes", binary[index], binary[index + 1], binary[index + 2], convert.int_to_byte(binary[index]), convert.int_to_byte(binary[index + 1]))
        console.log("expected assembly", expected.assembly)
        assertEquals(expected.assembly, actual.assembly)
        assertEquals(expected.new_index, actual.new_index)
        index = actual.new_index
    }

    {
        const byte = convert.int_to_byte(binary[index])
        const actual = byte_inspector.get_instruction(byte).write_assembly(index, binary) 
        const expected = {
            assembly: "mov cx, 12",
            new_index: 11 
        }
        console.log("bytes", binary[index], binary[index + 1], binary[index + 2], convert.int_to_byte(binary[index]), convert.int_to_byte(binary[index + 1]))
        console.log("expected assembly", expected.assembly)
        assertEquals(expected.assembly, actual.assembly)
        assertEquals(expected.new_index, actual.new_index)
        index = actual.new_index
    }

    {
        const byte = convert.int_to_byte(binary[index])
        const actual = byte_inspector.get_instruction(byte).write_assembly(index, binary) 
        const expected = {
            assembly: "mov cx, 65524",
            new_index: 14 
        }
        console.log("bytes", binary[index], binary[index + 1], binary[index + 2], convert.int_to_byte(binary[index]), convert.int_to_byte(binary[index + 1]), convert.int_to_byte(binary[index + 2]))
        console.log("expected assembly", expected.assembly)
        assertEquals(expected.assembly, actual.assembly)
        assertEquals(expected.new_index, actual.new_index)
        index = actual.new_index
    }
    
    {
        const byte = convert.int_to_byte(binary[index])
        const actual = byte_inspector.get_instruction(byte).write_assembly(index, binary) 
        const expected = {
            assembly: "mov dx, 3948",
            new_index: 17 
        }
        console.log("bytes", binary[index], binary[index + 1], binary[index + 2], convert.int_to_byte(binary[index]), convert.int_to_byte(binary[index + 1]), convert.int_to_byte(binary[index + 2]))
        console.log("expected assembly", expected.assembly)
        assertEquals(expected.assembly, actual.assembly)
        assertEquals(expected.new_index, actual.new_index)
        index = actual.new_index
    }
    
    {
        const byte = convert.int_to_byte(binary[index])
        const actual = byte_inspector.get_instruction(byte).write_assembly(index, binary) 
        const expected = {
            assembly: "mov dx, 61588",
            new_index: 20 
        }
        console.log("bytes", binary[index], binary[index + 1], binary[index + 2], convert.int_to_byte(binary[index]), convert.int_to_byte(binary[index + 1]), convert.int_to_byte(binary[index + 2]))
        console.log("expected assembly", expected.assembly)
        assertEquals(expected.assembly, actual.assembly)
        assertEquals(expected.new_index, actual.new_index)
        index = actual.new_index
    }
    
    {
        const byte = convert.int_to_byte(binary[index])
        const actual = byte_inspector.get_instruction(byte).write_assembly(index, binary) 
        const expected = {
            assembly: "mov al, [bx + si]",
            new_index: 22 
        }
        console.log("bytes", binary[index], binary[index + 1], convert.int_to_byte(binary[index]), convert.int_to_byte(binary[index + 1]))
        console.log("expected assembly", expected.assembly)
        assertEquals(expected.assembly, actual.assembly)
        assertEquals(expected.new_index, actual.new_index)
        index = actual.new_index
    }
    
    {
        const byte = convert.int_to_byte(binary[index])
        const actual = byte_inspector.get_instruction(byte).write_assembly(index, binary) 
        const expected = {
            assembly: "mov bx, [bp + di]",
            new_index: 24 
        }
        console.log("bytes", binary[index], binary[index + 1], convert.int_to_byte(binary[index]), convert.int_to_byte(binary[index + 1]))
        console.log("expected assembly", expected.assembly)
        assertEquals(expected.assembly, actual.assembly)
        assertEquals(expected.new_index, actual.new_index)
        index = actual.new_index
    }
    
    {
        const actual = byte_inspector.get_instruction(binary[index]).write_assembly(index, binary) 
        const expected = {
            assembly: "mov dx, [bp]",
            new_index: 26 
        }
        console.log("bytes #", index, " => ", binary[index], binary[index + 1], binary[index + 2], convert.int_to_byte(binary[index]), convert.int_to_byte(binary[index + 1]), convert.int_to_byte(binary[index + 2]))
        console.log("expected assembly", expected.assembly)
        assertEquals(expected.assembly, actual.assembly)
        assertEquals(expected.new_index, actual.new_index)
        index = actual.new_index 
    }
    
    {
        const actual = byte_inspector.get_instruction(binary[index]).write_assembly(index, binary) 
        const expected = {
            assembly: "mov ah, [bx + si + 4]",
            new_index: 29 
        }
        console.log("bytes #", index, binary[index], binary[index + 1], convert.int_to_byte(binary[index]), convert.int_to_byte(binary[index + 1]))
        console.log("expected assembly", expected.assembly)
        assertEquals(expected.assembly, actual.assembly)
        assertEquals(expected.new_index, actual.new_index)
        index = actual.new_index
    }
    
    {
        const actual = byte_inspector.get_instruction(binary[index]).write_assembly(index, binary) 
        const expected = {
            assembly: "mov al, [bx + si + 4999]",
            new_index: -1
        }
        console.log("bytes", binary[index], binary[index + 1], convert.int_to_byte(binary[index]), convert.int_to_byte(binary[index + 1]))
        console.log("expected assembly", expected.assembly)
        assertEquals(expected.assembly, actual.assembly)
        assertEquals(expected.new_index, actual.new_index)
        index = actual.new_index + 1
    }

    {
        const byte = convert.int_to_byte(binary[index])
        const actual = byte_inspector.get_instruction(byte).write_assembly(index, binary) 
        const expected = {
            assembly: "mov [bx + di], cx",
            new_index: -1
        }
        console.log("bytes", binary[index], binary[index + 1], convert.int_to_byte(binary[index]), convert.int_to_byte(binary[index + 1]))
        console.log("expected assembly", expected.assembly)
        assertEquals(expected.assembly, actual.assembly)
        assertEquals(expected.new_index, actual.new_index)
        index = actual.new_index
    }

    {
        const byte = convert.int_to_byte(binary[index])
        const actual = byte_inspector.get_instruction(byte).write_assembly(index, binary) 
        const expected = {
            assembly: "mov [bp + si], cl",
            new_index: -1
        }
        console.log("bytes", binary[index], binary[index + 1], convert.int_to_byte(binary[index]), convert.int_to_byte(binary[index + 1]))
        console.log("expected assembly", expected.assembly)
        assertEquals(expected.assembly, actual.assembly)
        assertEquals(expected.new_index, actual.new_index)
        index = actual.new_index
    }

    {
        const byte = convert.int_to_byte(binary[index])
        const actual = byte_inspector.get_instruction(byte).write_assembly(index, binary) 
        const expected = {
            assembly: "mov [bp], ch",
            new_index: -1
        }
        console.log("bytes", binary[index], binary[index + 1], convert.int_to_byte(binary[index]), convert.int_to_byte(binary[index + 1]))
        console.log("expected assembly", expected.assembly)
        assertEquals(expected.assembly, actual.assembly)
        assertEquals(expected.new_index, actual.new_index)
        index = actual.new_index
    }
});