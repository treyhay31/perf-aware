#pragma once
enum class OpCode
{
  MOV,
};
enum class OpType : char
{
  mov__reg_reg_mov = 0b1000100,
  mov__immediate_reg_mem_mov = 0b1100011,
  mov__immediate_to_reg = 0b10110000,
  mov__mem_to_accum = 0b10100000,
  mov__accum_to_mem = 0b10100010,
  mov__reg_to_seg = 0b10001110,
  mov__seg_to_reg = 0b10001100
};
enum class OpMod : char
{
  MEM_NO_DISPLACE = 0,     // 00
  MEM_DISPLACE_8_BIT = 1,  // 01
  MEM_DISPLACE_16_BIT = 2, // 10
  REG_NO_DISPLACE = 3      // 11
};

enum class OpReg
{
  AL,
  CL,
  DL,
  BL,
  AH,
  CH,
  DH,
  BH,
  AX,
  CX,
  DX,
  BX,
  SP,
  BP,
  SI,
  DI
};

enum class OpRmMod
{ // TODO(trey): MOD=00 R/M=110 - needs to be handled for direct address
  BX_SI,
  BX_DI,
  BP_SI,
  BP_DI,
  SI__ADDRESS,
  DI__ADDRESS,
  DIRECT_ADDRESS,
  BX__ADDRESS,
  BX_SI__D8,
  BX_DI__D8,
  BP_SI__D8,
  BP_DI__D8,
  SI__D8,
  DI__D8,
  BP__D8,
  BX__D8,
  BX_SI__D16,
  BX_DI__D16,
  BP_SI__D16,
  BP_DI__D16,
  SI__D16,
  DI__D16,
  BP__D16,
  BX__D16,
  AL,
  CL,
  DL,
  BL,
  AH,
  CH,
  DH,
  BH,
  AX,
  CX,
  DX,
  BX,
  SP,
  BP,
  SI,
  DI
};
enum class OpSegReg : char
{
  ES = 0,
  CS = 1,
  SS = 2,
  DS = 3
};