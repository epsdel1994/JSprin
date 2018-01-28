/*   2016/10/21: Created by T.Hironaka   */

#include "board.h"
#include "cassio.h"
#include "hash.h"
#include "obftest.h"
#include "options.h"
#include "perft.h"
#include "search.h"
#include "stats.h"
#include "ui.h"
#include "util.h"
#include "event.h"
#include "settings.h"
#include "ybwc.h"
#include <assert.h>
#include <stdarg.h>
#include <math.h>
#include <locale.h>

#include <string.h>

Engine *engine;

int jsprin_load_eval()
{
	UI *ui;

//	options.n_task = get_cpu_number();
	options.n_task = 1;
	options_parse("edax.ini");
	options_bound();

	// allocate ui
	ui = (UI*) malloc(sizeof *ui);
	if (ui == NULL) fatal_error("Cannot allocate a user interface.\n");
	ui->type = UI_CASSIO;

	// initialize
	edge_stability_init();
	hash_code_init();
	hash_move_init();
	statistics_init();
	eval_open(options.eval_file);
	search_global_init();

	engine = (Engine*) engine_init();

	return 0;
}

const char* jsprin_eval(const char* s, double alpha, double beta, int depth, int precision, int time, int num)
{
  Board board[1];
  int mob;
  board_set(board,s);
  mob = get_mobility(board->player, board->opponent);
  if(num>mob)num=mob;

  float pweight = 0.7;

  float psum = (pow(pweight,num) - pow((1-pweight),num)) / (pweight*2 -1);
  float* pw = malloc(sizeof(float) * num);
  for(int i=0;i<num;i++){
    pw[i] = pow(pweight,num-1-i) * pow((1-pweight),i);
    pw[i] /= psum;
  }

  int* resx = malloc(sizeof(int) * num);
  int* resy = malloc(sizeof(int) * num);
  int* ress = malloc(sizeof(int) * num);
  int* ml = malloc(sizeof(int) * num);

  search_set_move_time(engine->search, time * pw[0]);
  engine_endgame_search(engine, s, alpha, beta, 100);

  resx[0] = ((unsigned char)engine->search->result->move & 0x07) +1;
  resy[0] = ((unsigned char)engine->search->result->move >> 3 ) +1;
  ress[0] = engine->search->result->score;
  int resd = engine->search->result->depth;
  int resp = selectivity_table[engine->search->result->selectivity].percent;

  for(int i=1;i<num;i++){
    ml[i-1] = engine->search->result->move;
    movelist_exclude(engine->search->movelist, engine->search->result->move);
    hash_exclude_move(engine->search->hash_table, board_get_hash_code(engine->search->board), engine->search->result->move);
    hash_exclude_move(engine->search->pv_table, board_get_hash_code(engine->search->board), engine->search->result->move);
    hash_exclude_move(engine->search->shallow_table, board_get_hash_code(engine->search->board), engine->search->result->move);

    search_set_move_time(engine->search, time * pw[i]);
    engine_endgame_search(engine, s, alpha, beta, 100);

    resx[i] = ((unsigned char)engine->search->result->move & 0x07) +1;
    resy[i] = ((unsigned char)engine->search->result->move >> 3 ) +1;
    ress[i] = engine->search->result->score;
    if(ress[i]>ress[0]) ress[i]=ress[0];
/*
    if(resd > engine->search->result->depth){
      resd = engine->search->result->depth;
    }
*/
    if(resp > selectivity_table[engine->search->result->selectivity].percent){
      resp = selectivity_table[engine->search->result->selectivity].percent;
    }
  }

  search_get_movelist(engine->search, engine->search->movelist);

/*
  char *res = malloc(512);
*/
  static char res[512];
  char *buf = malloc(512);

  res[0] = '\0';
  strcat(res,"{\"n\": ");
  sprintf(buf,"%d",num); strcat(res,buf);
  strcat(res,",\"x\": [");
  sprintf(buf,"%d",resx[0]); strcat(res,buf);
  for(int i=1; i<num; i++){
    sprintf(buf,", %d",resx[i]); strcat(res,buf);
  }
  strcat(res,"], \"y\": [");
  sprintf(buf,"%d",resy[0]); strcat(res,buf);
  for(int i=1; i<num; i++){
    sprintf(buf,", %d",resy[i]); strcat(res,buf);
  }
  strcat(res,"], \"v\": [");
  sprintf(buf,"%d",ress[0]); strcat(res,buf);
  for(int i=1; i<num; i++){
    sprintf(buf,", %d",ress[i]); strcat(res,buf);
  }
  strcat(res,"], \"depth\": ");
  sprintf(buf,"%d",resd); strcat(res,buf);
  strcat(res,",\"percent\": ");
  sprintf(buf,"%d",resp); strcat(res,buf);
  strcat(res,"}");

  free(buf);

  return res;
}

/*
int main(){
  jsprin_load_eval();
  printf("%s\n",jsprin_eval("OOOOOOOOXXXXXXXXOOOOOOOOXXXXXXXXOOOOOOOOXXXXXXXXOOOOOOOO--------X",-64,64,27,73,3,3));
  printf("%s\n",jsprin_eval("OOOOOOOOXXXXXXXXOOOOOOOOXXXXXXXXOOOOOOOOXXXXXXXXOOOOOOOO--------X",-64,64,27,73,3,3));
  printf("%s\n",jsprin_eval("OOOOOOOOXXXXXXXXOOOOOOOOXXXXXXXXOOOOOOOOXXXXXXXXOOOOOOOO--------X",-64,64,27,73,3,3));
  printf("%s\n",jsprin_eval("OOOOOOOOXXXXXXXXOOOOOOOOXXXXXXXXOOOOOOOOXXXXXXXXOOOOOOOO--------X",-64,64,27,73,3,3));
  printf("%s\n",jsprin_eval("OOOOOOOOXXXXXXXXOOOOOOOOXXXXXXXXOOOOOOOOXXXXXXXXOOOOOOOO--------X",-64,64,27,73,3,3));
}
*/
