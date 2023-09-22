#include "pch.h"
#include "CppUnitTest.h"
#include <byte_parser.h>

using namespace Microsoft::VisualStudio::CppUnitTestFramework;

namespace sim8086Test
{
	TEST_CLASS(sim8086Test)
	{
	public:
		//10001001 (mov) 11011001 (mov)
		TEST_METHOD(get_bits_as_char__TEST)
		{
			uint8_t actual = byte_parser::get_bits_as_uint8(0b11001000, 0, 2);
			Assert::AreEqual((uint8_t)3, actual);
		}

		
	};
}
