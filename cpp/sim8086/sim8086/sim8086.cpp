// sim8086.cpp : This file contains the 'main' function. Program execution
// begins and ends there.
//
#include <iostream>
#include <fstream>
#include <vector>
#include "byte_parser.h"
#include <operation_joint.h>
#include "sim8086.h"

int main()
{
  std::string file_name = "0037_single_register_mov";
  // Open the binary file for reading
  std::ifstream file("C:\\train\\perf-aware\\src\\perfaware\\part1\\listing_"
                     + file_name,
                     std::ios::binary);

  // Open a file for writing (create it if it doesn't exist)
  std::ofstream output_file("C:\\train\\perf-aware\\cpp\\output\\" + file_name + "__output.asm");

  // Check if the file was opened successfully
  if(!output_file.is_open())
    {
      std::cerr << "Failed to open the file for writing." << std::endl;
      return 1; // Return an error code
    }


  if(!file.is_open())
    {
      std::cerr << "Failed to open the file for reading." << std::endl;
      return 1;
    }

  std::vector<char> bytes;
  char byte;
  int column_width = 4;
  int columns = 0;
  int current_byte = 0;

  bool done = false;
  while(!done)
    {
      if(!file.read(&byte, 1))
        {
          done = true;
          break;
        }

      bytes.push_back(byte);

      std::cout << "BYTE #" + (current_byte) + ' ' +
                       byte_parser::get_char_in_bits(byte)
                << std::endl;
      current_byte++;
      operation_joint op = byte_parser::parse_byte(byte);
      char data_byte;
      if(!file.read(&data_byte, 1))
        {
          //std::cerr << "No more bytes to read... maybe break here?"
          //          << std::endl;
          return 1;
        }
      current_byte++;

      operation_data data = byte_parser::extract_data(op, data_byte);
      std::cout << byte_parser::display_bytes(byte, data_byte) << std::endl;
      std::vector<char> next_bytes;
      if (data.more_bytes > 0) {
          for(size_t i = 0; i < data.more_bytes; i++) {
              char next_byte;
              file.read(&next_byte, 1);
              next_bytes.push_back(next_byte);
          }
          // handle the next bytes...
      }

      output_file << byte_parser::write_assembly_instruction(op, data,
                                                             next_bytes);
    }

  // Check if there was an error reading the file
  if(file.bad())
    {
      std::cerr << "Error occurred while reading the file." << std::endl;
      return 1;
    }

  // Close the files
  output_file.close();
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
//   5. Go to Project > Add New Item to create new code files, or Project > Add
//   Existing Item to add existing code files to the project
//   6. In the future, to open this project again, go to File > Open > Project
//   and select the .sln file