.PHONY: deploy

deploy:
	git checkout gh-pages
	git merge master --no-edit
	git push
	git checkout master