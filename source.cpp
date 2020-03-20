#include <stdio.h>
#include <stdlib.h>

#include "c_common.h"

#define GLM_FORCE_ALIGNED_GENTYPES
#include <glm/glm.hpp>

#define POSITIVE_INFINITY (std::numeric_limits<f64>::infinity())
#define NEGATIVE_INFINITY (-POSITIVE_INFINITY)

#include "robin_hood.h"
#include <string>

using map_int2int = robin_hood::unordered_map<int, int>;

map_int2int map;

int use_map() {
	map.insert({1, 2});
	return (int)map.size();
}

extern_c_begin()


extern unsigned char __heap_base;
extern unsigned char __data_end;

void hello_js(void);

unsigned char* heap_base_ptr(void) 
{
	return &__heap_base;
}
unsigned char* data_end_ptr(void) 
{
	return &__data_end;
}

int32 animate(long arg) 
{
	std::string s = std::to_string(arg);

	int size = use_map();
	map.insert({2, arg + std::stoi(s)});
	hello_js();
	return size + map.size();
}

extern_c_end()
