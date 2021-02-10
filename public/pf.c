#include <stdio.h>
#include <stdlib.h>
#include <fcntl.h>
#include <stdbool.h>
#include <signal.h>
#include <sys/mman.h>
#include <unistd.h>
#include "forth/forth_embed.h"
#include <string.h>


// if the region requested is already mapped, things fail
// so we want address that won't get used as the program
// starts up
#define STACKHEAP_MEM_START 0xf9f8c000

// the number of memory pages will will allocate to an instance of forth
#define NUM_PAGES 20

// the max number of pages we want in memort at once, ideally
#define ACTIVE 0
#define NEVER_MAPPED_BEFORE 1
#define SWAPPED_OUT 2
#define MAX_PAGES 3

int priority[MAX_PAGES]; 
int page_state[NUM_PAGES];
int fds[NUM_PAGES]; 
int active[MAX_PAGES]; 
int actives = 0; 

static void handler(int sig, siginfo_t *si, void *unused){
    void* fault_address = si->si_addr;
    printf("in handler with invalid address %p\n", fault_address);
    int distance = (void*) fault_address - (void*) STACKHEAP_MEM_START;
    if(distance < 0 || distance > getpagesize()*NUM_PAGES){
        printf("address not within expected page!\n");
        exit(2);
    }
    int page_to_map = 0;
    int page_size = getpagesize();

    for(int i = 0 ; i < NUM_PAGES; i++){
        if(fault_address < ((i+1)*page_size+STACKHEAP_MEM_START) && fault_address >= ((i*page_size)+STACKHEAP_MEM_START)){
            page_to_map = i;
            break;
        }        
    }

	int oldest_page = -1;
	int k = 1;
	if(actives < MAX_PAGES){
		printf("mapping page %d\n", page_to_map);
		void* result = mmap((void*) STACKHEAP_MEM_START + (getpagesize() * page_to_map),getpagesize(),PROT_READ | PROT_WRITE | PROT_EXEC,MAP_FIXED | MAP_SHARED | MAP_ANONYMOUS,-1,0);
		if(result == MAP_FAILED){
			perror("map failed");
			exit(1);
		}
		for (int i = 0; i < MAX_PAGES; i++) {
			if (i != actives){
				priority[i]--;
			}
		}
		page_state[page_to_map] = ACTIVE;
		priority[actives] = MAX_PAGES;
		active[actives] = page_to_map;
	}
    else{
		while(k){
			for (int j = 0; j< MAX_PAGES; j++){
				if (priority[j] == 0){
					oldest_page = j;
					k = 0;
					break;
				}
			}	
			for (int j = 0; j<MAX_PAGES; j++){
				if (j!=oldest_page){
					priority[j]--;
				}
			}	
		}
		char* filename = malloc(11);
		int i = oldest_page;
		sprintf(filename,"page_%d.dat",active[i]);
		fds[active[i]] = open(filename, O_RDWR | O_CREAT, S_IRWXU);
		if (fds[active[i]] < 0) {
			perror("error loading linked file");
			exit(25);
		}
		write(fds[active[i]],(active[i] * getpagesize()) + (void*) STACKHEAP_MEM_START, getpagesize());

		printf("unmapping page %d\n",active[i]);
		int munmap_result = munmap((active[i] * getpagesize()) + (void*) STACKHEAP_MEM_START,getpagesize());
		if(munmap_result < 0){
			perror("munmap failed");
			exit(6);
		}
		free(filename);
		page_state[active[i]] = SWAPPED_OUT;				
		if (page_state[page_to_map] == NEVER_MAPPED_BEFORE){
			printf("mapping page %d\n", page_to_map);
			void* result = mmap((void*) STACKHEAP_MEM_START + (getpagesize() * page_to_map),getpagesize(),PROT_READ | PROT_WRITE | PROT_EXEC,MAP_FIXED | MAP_SHARED | MAP_ANONYMOUS,-1,0);
			if(result == MAP_FAILED){
				perror("map failed");
				exit(1);
			}
			active[i] = page_to_map;
			page_state[page_to_map] = ACTIVE;
			priority[i] = MAX_PAGES;
		}
		else if (page_state[page_to_map] == SWAPPED_OUT){
			printf("mapping page %d\n", page_to_map);
			void* result = mmap((void*) STACKHEAP_MEM_START + (getpagesize() * page_to_map),getpagesize(),PROT_READ | PROT_WRITE | PROT_EXEC,MAP_FIXED | MAP_SHARED,fds[page_to_map], 0);
			active[i] = page_to_map;
			page_state[page_to_map] = ACTIVE;
			priority[i] = MAX_PAGES;
		}

	}

	actives++;
}

int main() {

    //TODO: Add a bunch of segmentation fault handler setup here for
    //PART 1 (plus you'll also have to add the handler your self)
    
    struct forth_data forth;
    char output[200];
    static char stack[SIGSTKSZ];
    
    stack_t ss = {
                  .ss_size = SIGSTKSZ,
                  .ss_sp = stack,
    };
    
    sigaltstack(&ss, NULL);

    struct sigaction sa;
    sa.sa_flags = SA_SIGINFO | SA_ONSTACK;
    sigemptyset(&sa.sa_mask);
    sa.sa_sigaction = handler;
    if (sigaction(SIGSEGV, &sa, NULL) == -1) 
    {
        perror("error installing handler");
        exit(3);
    }

    // the return stack is a forth-specific data structure if we
    // wanted to, we could give it an expanding memory segment like we
    // do for the stack/heap but I opted to keep things simple
    int returnstack_size = getpagesize() * 2;
    void* returnstack = mmap(NULL, returnstack_size, PROT_READ | PROT_WRITE | PROT_EXEC,
                   MAP_ANON | MAP_PRIVATE, -1, 0);

    
    // initializing the stack/heap to a unmapped memory pointer we
    // will map it by responding to segvs as the forth code attempts
    // to read/write memory in that space

    int stackheap_size = getpagesize() * NUM_PAGES;

    // TODO: Modify this in PART 1
    void* stackheap = (void*) STACKHEAP_MEM_START;
    
    for(int i = 0; i < NUM_PAGES; i ++){
        page_state[i] = NEVER_MAPPED_BEFORE;
        priority[i] = NUM_PAGES;
    }
    
    initialize_forth_data(&forth,
                          returnstack + returnstack_size, //beginning of returnstack
                          stackheap, //begining of heap
                          stackheap + stackheap_size); //beginning of stack

    // this code actually executes a large amount of starter forth
    // code in jonesforth.f.  If you screwed something up about
    // memory, it's likely to fail here.
    load_starter_forth_at_path(&forth, "forth/jonesforth.f");

    // printf("finished loading starter forth\n");
    
    // now we can set the input to our own little forth program
    // (as a string)
    //2nd param = code we want to run
    //3rd param = buffer for the output
    int fresult = f_run(&forth,
                        " : USESTACK BEGIN DUP 1- DUP 0= UNTIL ; " // function that puts numbers 0 to n on the stack
                        " : DROPUNTIL BEGIN DUP ROT = UNTIL ; " // funtion that pulls numbers off the stack till it finds target
                        " FOO 5000 USESTACK " // 5000 integers on the stack
                        " 2500 DROPUNTIL " // pull half off
                        " 1000 USESTACK " // then add some more back
                        " 4999 DROPUNTIL " // pull all but 2 off
                        " . . " // 4999 and 5000 should be the only ones remaining, print them out
                        " .\" finished successfully \" " // print some text */
                        ,
                        output,
                        sizeof(output));
    
    if(fresult != FCONTINUE_INPUT_DONE) {
        printf("forth did not finish executing sucessfully %d\n", fresult);
        exit(4);
    }
    printf("OUTPUT: %s\n", output);    
    printf("done\n");
    return 0;
}