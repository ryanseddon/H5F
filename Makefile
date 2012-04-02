js-min =			h5f.min.js
js-file =			h5f.js

closure-jar =		build/tools/compiler.jar



all:
	@rm -f $(js-min)
	@echo "Minifing JavaScript…\t\c"
	@java -jar $(closure-jar) --js=$(js-file) --warning_level QUIET  --js_output_file $(js-min)
	@echo "[ Done ]"
	