#pragma once
#include "OpCode.h"
struct operation_data {
    OpMod mod;
    uint8_t mod_byte;

    OpReg reg;
    uint8_t reg_byte;
    
    OpRmMod rm;
    uint8_t rm_byte;
    
    OpSegReg sr;
    int more_bytes;
};
