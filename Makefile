update: FORCE
	./wget-links.sh links-update.txt
content: *
	./wget-links.sh links-all.txt
build: content
	rm -vr build || true
	cp -vr content/thl.fi build
	./create-indices.sh
	./remove-queries.sh
	./relative-links.sh
sync: build
	aws s3 sync build s3://thl-fi-mirror
FORCE: ;
