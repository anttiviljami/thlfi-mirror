update: FORCE
	./wget-links.sh links-update.txt
content: FORCE
	./wget-links.sh links-all.txt
build: FORCE
	rm -vr build || true
	cp -r content/thl.fi build
	./remove-queries.sh
	./create-indices.sh
	./relative-links.sh
prune: FORCE
	rm -rf build/documents build/tilastoliite
sync: FORCE
	aws s3 sync build s3://thl-fi-mirror
crawl: FORCE
	node crawler.js
FORCE: ;
