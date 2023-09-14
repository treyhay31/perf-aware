// sim8086.cpp : This file contains the 'main' function. Program execution begins and ends there.
//
#include <iostream>
#include <fstream>
#include <vector>
#include "byte_parser.h"

int main() {
    // Open the binary file for reading
    std::ifstream file("C:\\train\\perf-aware\\src\\perfaware\\part1\\listing_0037_single_register_mov", std::ios::binary);

    if (!file.is_open()) {
        std::cerr << "Failed to open the file for reading." << std::endl;
        return 1;
    }

    std::vector<char> bytes;
    char byte;
    int column_width = 4;
    int columns = 0;
    while (file.read(&byte, 1)) {

        bytes.push_back(byte);

        // Process each bit in the byte
        for (int i = 7; i >= 0; --i) {
            bool bit = (byte >> i) & 1; 
            std::cout << bit;
        }

        std::cout << " (" + byte_parser::parse_byte(byte) + ") ";
        if (columns > column_width) {
            columns = 0;
            std::cout << " " << std::endl;
        }
        else {
            columns++;
        }
    }

    // Check if there was an error reading the file
    if (file.bad()) {
        std::cerr << "Error occurred while reading the file." << std::endl;
        return 1;
    }

    // Close the file
    file.close();

    return 0;
}


// Run program: Ctrl + F5 or Debug > Start Without Debugging menu
// Debug program: F5 or Debug > Start Debugging menu

// Tips for Getting Started:
//   1. Use the Solution Explorer window to add/manage files
//   2. Use the Team Explorer window to connect to source control
//   3. Use the Output window to see build output and other messages
//   4. Use the Error List window to view errors
//   5. Go to Project > Add New Item to create new code files, or Project > Add Existing Item to add existing code files to the project
//   6. In the future, to open this project again, go to File > Open > Project and select the .sln file