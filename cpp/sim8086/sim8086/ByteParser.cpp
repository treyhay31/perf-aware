#include "pch.h"
#include "ByteParser.h"

std::string ByteParser::parse_byte(char byte)
{
    // Process each bit in the byte
    for (int i = 7; i >= 0; --i) {
        bool bit = (byte >> i) & 1;
    }
	return std::string("mov");
}
