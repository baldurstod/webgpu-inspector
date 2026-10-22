.PHONY: build

build:
	rollup -c

firefox:
	$(shell rollup -c --environment BROWSER:firefox)
	$(call make_zip,firefox)

chromium:
	$(shell rollup -c)
	$(call make_zip,chromium)

define make_zip
	mkdir -p dist
	cd ./build/client && zip -r "../../dist/webgpuinspector_$(1)_$(shell jq '.version' build/client/manifest.json)_$(shell date '+%Y_%m_%d').zip" .
endef

lint:
	npx eslint ./src/client/ts/**


translations:
	rollup -c --environment TRANSLATIONS:true
