update: *
	./wget-links.sh links-update.txt
content: *
	./wget-links.sh links-all.txt
build: *
	rm -vr build || true
	cp -vr content/thl.fi build
	./generate-combo.sh
	./remove-queries.sh
	./create-indices.sh
	./relative-links.sh
sync: *
	aws s3 sync build s3://thl-fi-mirror
