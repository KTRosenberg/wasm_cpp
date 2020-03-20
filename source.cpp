// #include <stdio.h>
// #include <stdlib.h>

// #define GLM_FORCE_ALIGNED_GENTYPES
// #include <glm/glm.hpp>

#ifdef __cplusplus
	#define extern_c_begin() extern "C" {
	#define extern_c_end() }
#else 
	#define extern_c_begin()
	#define extern_c_end()
#endif

#include "robin_hood.h"
#include <string>

robin_hood::unordered_map<int, int> map;

int use_map() {
	map.insert({1, 2});
	return (int)map.size();
}

extern_c_begin()

//extern unsigned char __heap_base;
//extern unsigned char __data_end;

void hello_js(void);

int animate(long arg) {
	std::string s = std::to_string(arg);

	int size = use_map();
	map.insert({2, arg + std::stoi(s)});
	hello_js();
	return size + map.size();
}

extern_c_end()
