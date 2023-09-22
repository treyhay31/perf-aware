#pragma once
#include <string>
#include "operation_joint.h"
#include "operation_data.h"
#include "OpCode.h"
#include <vector>
class byte_parser
{
public:
  static operation_joint parse_byte(char byte);
  static operation_data extract_data(operation_joint op, char byte);
  static std::string
  write_assembly_instruction(operation_joint op, operation_data data,
                             std::vector<char> next_bytes);
  static uint8_t get_bits_as_uint8(char byte, int start_index,
                                         int number_of_bits);
  static std::string display_bytes(char op, char data);
  static bool compare_partial_bytes(char byte1, char byte2, int bitsToIgnore);
  static void print_char_in_bits(char byte);
  static std::string get_char_in_bits(char byte);
  static bool check_bit(char byte, int index);
};
