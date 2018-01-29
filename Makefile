
all: clean
	mkdir -p bin
	emcc -O3 -s TOTAL_MEMORY=134217728 -s EXPORTED_FUNCTIONS="['_jsprin_load_eval','_jsprin_eval']" -s EXTRA_EXPORTED_RUNTIME_METHODS="['ccall', 'cwrap']" edax_eval_src/all.c --preload-file data/eval.dat -o bin/edax.js
	cat wk_book.js edax_book/bit.js edax_book/board.js edax_book/book.js edax_book/const.js edax_book/hash.js edax_book/move.js > bin/wk_book.js
	cat ui.js ui_event.js board.js analyse.js > bin/jsprin.js
	cat wk_eval.js > bin/wk_eval.js
	cat bin/edax.js >> bin/wk_eval.js
	rm bin/edax.js
	cat base.html > bin/index.html
	cp jsprin.manifest bin

clean:
	rm -rf bin 
