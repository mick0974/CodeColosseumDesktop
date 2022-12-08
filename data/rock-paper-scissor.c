#include <string.h>
#include <stdio.h>
#include <stdlib.h>
#include <time.h>

// Dev: sleep
#ifdef _WIN32
    #include <Windows.h>
    void sleep(int seconds) { Sleep(seconds * 1000.0); }
#else
    #include <unistd.h>
#endif


int main(int argc, char *argv[])
{
    int round = 1;
    if (argc > 1){
        round = atoi(argv[1]);
    }

    int interactive = 0;
    if (argc > 2){
        interactive = atoi(argv[2]);
    }


    time_t cur_time;
    unsigned int seed = (unsigned) time(&cur_time);
    srand( seed );
    
    int points = 0;
    int invalids = 0;

    for (int i=0; i < round; i++)
    {
        int choice = rand()%3;
        switch (choice)
        {
            case 0: printf("ROCK\n"); break;
            case 1: printf("PAPER\n"); break;
            case 2: printf("SCISSOR\n"); break;
        }
        fflush(stdout);
        
        if (interactive == 0) continue;
        sleep(1);
        
        char response[10];
        scanf(" %s",response);
        int result;

        if (strcmp(response,"ROCK")==0 || strcmp(response,"0")==0){
            result = 0;
        }else if (strcmp(response,"PAPER")==0 || strcmp(response,"1")==0){
            result = 1;
        }else if (strcmp(response,"SCISSOR")==0 || strcmp(response,"2")==0){
            result = 2;
        }else{
            result = -1;
            ++invalids;
        }

        int point = 0; 
        //WIN
        if ( (choice == 0 && result == 2) || (choice == 1 && result == 0) || (choice == 2 && result == 1) ){ // || (result == -1) ){ 
            point = 1;
        }
        //LOSE
        if ( (choice == 0 && result == 1) || (choice == 1 && result == 2) || (choice == 2 && result == 0) ){ 
            point = -1;
        }
        points += point;
        //printf("[%d] %s\n",(point),response);
        //fflush(stdout);
    }
    printf("TOTAL: %d / %d (invalid: %d)\n",points, round, invalids);
    fflush(stdout);
}