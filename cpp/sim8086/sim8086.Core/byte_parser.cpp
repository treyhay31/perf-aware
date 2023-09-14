#include "pch.h"
#include "byte_parser.h"

std::string byte_parser::parse_byte(char byte)
{
    // Process each bit in the byte
    for (int i = 7; i >= 0; --i) {
        bool bit = (byte >> i) & 1;
    }
    return std::string("mov");
}
