// This is a program to calculate min and max values

#include<stdio.h>

void short_max_method1(void);
void short_max_method2(void);
void short_max_method3(void);
void short_max_method4(void);




int main(){

// Short is 2B/ 16bit datatype so for signed it is -2^15 to 2^15-1
    short_max_method1();
    short_max_method2();
    short_max_method3();
    short_max_method4();
  
}


void short_max_method1(void){
    short s;
    short tmp;
    s=0;
    tmp = s-1;
    // Loop to calculate max value of short, stored in tmp
    while(s>tmp){
        s++;
        tmp++;
    }
    printf("Method 1: The max value for short datatype (signed) is %d\n",tmp);


    //For unsigned short
    unsigned short k;
    unsigned short tmp1;
    k=0;
    k--;
    printf("Method 1: The max value for short datatype (unsigned) is %d\n",k);

}

void short_max_method2(void){
    short s;
    short tmp;
    s=0;
    tmp = s-1;
    // Loop to calculate max value of short, stored in tmp
    while(++s>++tmp){
    }
    printf("Method 2: The max value for short datatype (signed) is %d\n",tmp);

}

void short_max_method3(void){
    short s;
    s=0;
    // Loop to calculate max value of short, stored in tmp
    while(++s>0){
    }
    --s; // coz at last we did one ++s and then exited the while loop when wrap around happens
    // As we want the highest value so we will go one back

    printf("Method 3: The max value for short datatype (signed) is %d\n",s);

}


void short_max_method4(void){

 
    // Max values
    // Short 16 bit :- 1111 1111 1111 1111 :- Hexadecimal 0xFFFF
    // Short 15 bit :-  111 1111 1111 1111 :- Hexadecimal 0x7FFF

    short s;
    s=0x7FFF;
    
    printf("Method 4: The max value for short datatype (signed) is %d\n",s);

}