const convert = {
    int_to_byte: (int) => typeof int === "number" ? int.toString(2).padStart(8, "0") : int,
    byte_to_int: (byte) => parseInt(byte, 2),
    bit_string_to_num: (bit_string) => bit_string === "1" ? 1 : 0
}

export default convert