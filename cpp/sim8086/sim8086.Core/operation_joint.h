#pragma once
#include "OpCode.h"

struct operation_joint
{
    bool d_reg_is_destination;
    bool w_operation_is_2bytes;
    OpCode op;
    OpType op_type;
};
