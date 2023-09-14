#include "pch.h"
#include "CppUnitTest.h"
#include <byte_parser.h>

using namespace Microsoft::VisualStudio::CppUnitTestFramework;

namespace sim8086Test
{
	TEST_CLASS(sim8086Test)
	{
	public:
		
		TEST_METHOD(TestMethod1)
		{
			std::string actual = byte_parser::parse_byte(static_cast<char>(0b11110000));
			Assert::AreEqual(std::string("mov"), actual);
		}
	};
}
