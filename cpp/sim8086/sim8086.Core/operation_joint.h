#pragma once
#include "OpCode.h"

struct operation_joint
{
  bool d_reg_is_destination;
  bool w_operation_is_2bytes;
  OpCode op;
  OpType op_type;

  OpMod mod;
  uint8_t mod_byte;

  OpReg reg;
  uint8_t reg_byte;

  OpRmMod rm;
  uint8_t rm_byte;

  OpSegReg sr;
  int more_bytes;
};
