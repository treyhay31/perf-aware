#include "pch.h"
#include "byte_parser.h"
#include <iostream>
#include "operation_joint.h"
#include "OpCode.h"



operation_joint byte_parser::parse_byte(char byte)
{
  operation_joint joint = operation_joint();
  char reg_reg_mov = 0b10001000; // 6
  if(compare_partial_bytes(reg_reg_mov, byte, 2))
    {
      joint.op = OpCode::MOV;
      joint.op_type = OpType::mov__reg_reg_mov;
      joint.d_reg_is_destination = check_bit(byte, 6);
      joint.w_operation_is_2bytes = check_bit(byte, 7);
      return joint;
    }
  return joint;
}

operation_data byte_parser::extract_data(operation_joint op, char byte)
{
  operation_data data = operation_data();

  uint8_t mod_bits = get_bits_as_uint8(byte, 6, 2);
  uint8_t reg_bits = get_bits_as_uint8(byte, 3, 3);
  uint8_t rm_bits = get_bits_as_uint8(byte, 0, 2);
  data.mod_byte = mod_bits;
  data.reg_byte = reg_bits;
  data.rm_byte = rm_bits;
  data.mod = static_cast<OpMod>(mod_bits); // if rm == 110 then 16bit disp

  if(data.mod == OpMod::REG_NO_DISPLACE)
    {
      switch(rm_bits)
        {
        case 0: data.reg = OpReg::AX; break;
        case 1: data.reg = OpReg::CX; break;
        case 2: data.reg = OpReg::DX; break;
        case 3: data.reg = OpReg::BX; break;
        case 4: data.reg = OpReg::SP; break;
        case 5: data.reg = OpReg::BP; break;
        case 6: data.reg = OpReg::SI; break;
        case 7: data.reg = OpReg::DI; break;
        }
    }

  if(op.w_operation_is_2bytes)
    {
      switch(reg_bits)
        {
        case 0: data.reg = OpReg::AX; break;
        case 1: data.reg = OpReg::CX; break;
        case 2: data.reg = OpReg::DX; break;
        case 3: data.reg = OpReg::BX; break;
        case 4: data.reg = OpReg::SP; break;
        case 5: data.reg = OpReg::BP; break;
        case 6: data.reg = OpReg::SI; break;
        case 7: data.reg = OpReg::DI; break;
        }
    }
  else
    {
      switch(reg_bits)
        {
        case 0: data.reg = OpReg::AL; break;
        case 1: data.reg = OpReg::CL; break;
        case 2: data.reg = OpReg::DL; break;
        case 3: data.reg = OpReg::BL; break;
        case 4: data.reg = OpReg::AH; break;
        case 5: data.reg = OpReg::CH; break;
        case 6: data.reg = OpReg::DH; break;
        case 7: data.reg = OpReg::BH; break;
        }
    }

  switch(mod_bits)
    {
    case 0:

      switch(rm_bits)
        {
        case 0: data.rm = OpRmMod::BX_SI; break;
        case 1: data.rm = OpRmMod::BX_DI; break;
        case 2: data.rm = OpRmMod::BP_SI; break;
        case 3: data.rm = OpRmMod::BP_DI; break;
        case 4: data.rm = OpRmMod::SI__ADDRESS; break;
        case 5: data.rm = OpRmMod::DI__ADDRESS; break;
        case 6: data.rm = OpRmMod::DIRECT_ADDRESS; break;
        case 7: data.rm = OpRmMod::BX__ADDRESS; break;
        };
      break;

    case 1:
      switch(rm_bits)
        {
        case 0: data.rm = OpRmMod::BX_SI__D8; break;
        case 1: data.rm = OpRmMod::BX_DI__D8; break;
        case 2: data.rm = OpRmMod::BP_SI__D8; break;
        case 3: data.rm = OpRmMod::BP_DI__D8; break;
        case 4: data.rm = OpRmMod::SI__D8; break;
        case 5: data.rm = OpRmMod::DI__D8; break;
        case 6: data.rm = OpRmMod::BP__D8; break;
        case 7: data.rm = OpRmMod::BX__D8; break;
        };
      break;

    case 2:
      switch(rm_bits)
        {
        case 0: data.rm = OpRmMod::BX_SI__D16; break;
        case 1: data.rm = OpRmMod::BX_DI__D16; break;
        case 2: data.rm = OpRmMod::BP_SI__D16; break;
        case 3: data.rm = OpRmMod::BP_DI__D16; break;
        case 4: data.rm = OpRmMod::SI__D16; break;
        case 5: data.rm = OpRmMod::DI__D16; break;
        case 6: data.rm = OpRmMod::BP__D16; break;
        case 7: data.rm = OpRmMod::BX__D16; break;
        };
      break;

    case 3:
      if(op.w_operation_is_2bytes)
        {
          switch(rm_bits)
            {
            case 0: data.rm = OpRmMod::AX; break;
            case 1: data.rm = OpRmMod::CX; break;
            case 2: data.rm = OpRmMod::DX; break;
            case 3: data.rm = OpRmMod::BX; break;
            case 4: data.rm = OpRmMod::SP; break;
            case 5: data.rm = OpRmMod::BP; break;
            case 6: data.rm = OpRmMod::SI; break;
            case 7: data.rm = OpRmMod::DI; break;
            }
        }
      else
        {
          switch(rm_bits)
            {
            case 0: data.rm = OpRmMod::AL; break;
            case 1: data.rm = OpRmMod::CL; break;
            case 2: data.rm = OpRmMod::DL; break;
            case 3: data.rm = OpRmMod::BL; break;
            case 4: data.rm = OpRmMod::AH; break;
            case 5: data.rm = OpRmMod::CH; break;
            case 6: data.rm = OpRmMod::DH; break;
            case 7: data.rm = OpRmMod::BH; break;
            }
        }
      break;
    }

  return data;
}

uint8_t
byte_parser::get_bits_as_uint8(char byte, int start_index, int number_of_bits)
{
  // Create a bitmask for the desired bits
  int bitmask = (1 << number_of_bits) - 1;

  // Shift the bitmask to the left by the startBit
  bitmask <<= start_index;

  // Use bitwise AND to extract the desired bits
  int result = (byte & bitmask) >> start_index;

  return result;
}

std::string
byte_parser::write_assembly_instruction(operation_joint op, operation_data data,
                                        std::vector<char> next_bytes)
{
  static const std::string RegTable[] = {"AL", "CL", "DL", "BL", "AH", "CH",
                                         "DH", "BH", "AX", "CX", "DX", "BX",
                                         "SP", "BP", "SI", "DI"};
  // TODO(trey): MOD=00 R/M=110 - needs to be handled for direct address
  static const std::string RmTable[] = {
      "BX + SI", "BX + DI", "BP + SI", "BP + DI", "SI", "DI", "BP", "BX"};
  std::string instruction;
  switch(op.op)
    {
    case OpCode::MOV: instruction += "mov "; break;
    }

  switch(op.op_type)
    {
    case OpType::mov__reg_reg_mov:
      if(op.d_reg_is_destination)
        { // destination is on the left `mov bx, cx` => `mov dest, src`
          instruction +=
              RegTable[(int)data.reg_byte] + ", " + RmTable[(int)data.rm_byte];
        }
      else
        {
          instruction +=
              RmTable[(int)data.rm_byte] + ", " + RegTable[(int)data.reg_byte];
        }
      break;
    }
  return instruction;
}

std::string byte_parser::display_bytes(char op, char data)
{
  // 10001001       11011001
  // [100010] 0 1 | [11] [011] [001]
  //  mov     d w    mod  reg   r/m
  // Process each bit in the byte
  std::string result = get_char_in_bits(op) + ' ' + get_char_in_bits(data);
  char reg_reg_mov = 0b10001000; // 6
  if(compare_partial_bytes(reg_reg_mov, op, 2))
    {
      result += "\nreg_reg_mov: ";

      bool reg_is_destination = check_bit(op, 6);
      if(reg_is_destination)
        {
          result += "\n  D: 1 -- REG = destination";
        }
      else
        {
          result += "\n  D: 0 -- REG = source";
        };

      bool w_bit_is_true = check_bit(op, 7);
      if(w_bit_is_true)
        {
          result += "\n  W: 1 -- WORD operation (16bits)";
        }
      else
        {
          result += "\n  W: 0 -- BYTE operation (8bits)";
        }

      uint8_t mod_bits = get_bits_as_uint8(data, 6, 2);
      uint8_t reg_bits = get_bits_as_uint8(data, 3, 3);
      uint8_t rm_bits = get_bits_as_uint8(data, 0, 2);

      if(w_bit_is_true)
        {
          switch(reg_bits)
            {
            case 0: result += "\n  REG: 000 - AX"; break;
            case 1: result += "\n  REG: 001 - CX"; break;
            case 2: result += "\n  REG: 010 - DX"; break;
            case 3: result += "\n  REG: 011 - BX"; break;
            case 4: result += "\n  REG: 100 - SP"; break;
            case 5: result += "\n  REG: 101 - BP"; break;
            case 6: result += "\n  REG: 110 - SI"; break;
            case 7: result += "\n  REG: 111 - DI"; break;
            }
        }
      else
        {
          switch(reg_bits)
            {
            case 0: result += "\n  REG: 000 - AL"; break;
            case 1: result += "\n  REG: 001 - CL"; break;
            case 2: result += "\n  REG: 010 - DL"; break;
            case 3: result += "\n  REG: 011 - BL"; break;
            case 4: result += "\n  REG: 100 - AH"; break;
            case 5: result += "\n  REG: 101 - CH"; break;
            case 6: result += "\n  REG: 110 - DH"; break;
            case 7: result += "\n  REG: 111 - BH"; break;
            }
        }

      switch(mod_bits)
        {
        case 0:
          result += "\n  MOD: 00 Memory Mode - no disp";
          switch(rm_bits)
            {
            case 0: result += "\n  RM: 000 - BX_SI"; break;
            case 1: result += "\n  RM: 001 - BX_DI"; break;
            case 2: result += "\n  RM: 010 - BP_SI"; break;
            case 3: result += "\n  RM: 011 - BP_DI"; break;
            case 4: result += "\n  RM: 100 - SI__ADDRESS"; break;
            case 5: result += "\n  RM: 101 - DI__ADDRESS"; break;
            case 6: result += "\n  RM: 110 - DIRECT_ADDRESS"; break;
            case 7: result += "\n  RM: 111 - BX__ADDRESS"; break;
            };
          break;

        case 1:
          result += "\n  MOD: 01 Memory Mode - 8bit disp";
          switch(rm_bits)
            {
            case 0: result += "\n  RM: 000 - BX_SI__D8"; break;
            case 1: result += "\n  RM: 001 - BX_DI__D8"; break;
            case 2: result += "\n  RM: 010 - BP_SI__D8"; break;
            case 3: result += "\n  RM: 011 - BP_DI__D8"; break;
            case 4: result += "\n  RM: 100 - SI__D8"; break;
            case 5: result += "\n  RM: 101 - DI__D8"; break;
            case 6: result += "\n  RM: 110 - BP__D8"; break;
            case 7: result += "\n  RM: 111 - BX__D8"; break;
            };
          break;

        case 2:
          result += "\n  MOD: 10 Memory Mode - 16bit disp";
          switch(rm_bits)
            {
            case 0: result += "\n  RM: 000 - BX_SI__D16"; break;
            case 1: result += "\n  RM: 001 - BX_DI__D16"; break;
            case 2: result += "\n  RM: 010 - BP_SI__D16"; break;
            case 3: result += "\n  RM: 011 - BP_DI__D16"; break;
            case 4: result += "\n  RM: 100 - SI__D16"; break;
            case 5: result += "\n  RM: 101 - DI__D16"; break;
            case 6: result += "\n  RM: 110 - BP__D16"; break;
            case 7: result += "\n  RM: 111 - BX__D16"; break;
            };
          break;

        case 3:
          result += "\n  MOD: 11 Register Mode";
          if(w_bit_is_true)
            {
              switch(rm_bits)
                {
                case 0: result += "\n  RM: 000 - AX"; break;
                case 1: result += "\n  RM: 001 - CX"; break;
                case 2: result += "\n  RM: 010 - DX"; break;
                case 3: result += "\n  RM: 011 - BX"; break;
                case 4: result += "\n  RM: 100 - SP"; break;
                case 5: result += "\n  RM: 101 - BP"; break;
                case 6: result += "\n  RM: 110 - SI"; break;
                case 7: result += "\n  RM: 111 - DI"; break;
                }
            }
          else
            {
              switch(rm_bits)
                {
                case 0: result += "\n  RM: 000 - AL"; break;
                case 1: result += "\n  RM: 001 - CL"; break;
                case 2: result += "\n  RM: 010 - DL"; break;
                case 3: result += "\n  RM: 011 - BL"; break;
                case 4: result += "\n  RM: 100 - AH"; break;
                case 5: result += "\n  RM: 101 - CH"; break;
                case 6: result += "\n  RM: 110 - DH"; break;
                case 7: result += "\n  RM: 111 - BH"; break;
                }
            }
          break;
        }

      return result;
    }

  char immediate_reg_mem_mov = 0b11000110; // 7
  if(compare_partial_bytes(immediate_reg_mem_mov, op, 1))
    {
      return std::string("immediate_reg_mem_mov");
    }

  char immediate_to_reg = 0b10110000; // 4
  if(compare_partial_bytes(immediate_to_reg, op, 4))
    {
      return std::string("immediate_to_reg");
    }

  char mem_to_accum = 0b10100000; // 7
  if(compare_partial_bytes(mem_to_accum, op, 1))
    {
      return std::string("mem_to_accum");
    }

  char accum_to_mem = 0b10100010; // 7
  if(compare_partial_bytes(accum_to_mem, op, 1))
    {
      return std::string("accum_to_mem");
    }

  char reg_to_seg = 0b10001110; // 8
  if(compare_partial_bytes(reg_to_seg, op, 0))
    {
      return std::string("reg_to_seg");
    }

  char seg_to_reg = 0b10001100; // 8
  if(compare_partial_bytes(seg_to_reg, op, 0))
    {
      return std::string("seg_to_reg");
    }

  return get_char_in_bits(op) + std::string(" - is unaccounted for...");
}

bool byte_parser::compare_partial_bytes(char byte1, char byte2,
                                        int bitsToIgnore)
{
  if(bitsToIgnore < 0 || bitsToIgnore > 7)
    return false;

  char mask = static_cast<char>(0xFF << bitsToIgnore);

  char important_bits1 = byte1 & mask;
  char important_bits2 = byte2 & mask;

  // std::cout << "byte1: " << std::endl;
  // print_char_in_bits(byte1);
  // print_char_in_bits(important_bits1);

  // std::cout << "byte2: " << std::endl;
  // print_char_in_bits(byte2);
  // print_char_in_bits(important_bits2);

  return important_bits1 == important_bits2;
}

void byte_parser::print_char_in_bits(char byte)
{
  for(int i = 7; i >= 0; i--)
    {
      bool bit = (byte & (1 << i)) != 0;

      std::cout << bit;

      if(i % 4 == 0)
        {
          std::cout << ' ';
        }
    }

  std::cout << std::endl;
}

std::string byte_parser::get_char_in_bits(char byte)
{
  std::string bits = "";

  for(int i = 7; i >= 0; i--)
    {
      bool bit = (byte & (1 << i)) != 0;

      if(bit)
        {
          bits += "1";
        }
      else
        {
          bits += "0";
        }
    }

  return bits;
}

bool byte_parser::check_bit(char byte, int index)
{
  return (byte & (1 << index)) != 0;
}