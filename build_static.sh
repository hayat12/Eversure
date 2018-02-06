#!/bin/bash

CURRENT_DIR=$( cd "$(dirname "${BASH_SOURCE}")" ; pwd -P )
cd "$CURRENT_DIR"

arg1="$1"

echo "> Concatenating"
css_path="static/css/pack.css"
css_files=$(grep 'href="node_modules' index.html | sed -e 's/.*href="//' -e 's/">//')

js_path="static/js/pack.js"
js_files=$(grep 'src="node_modules' index.html | sed -e 's/.*src="//' -e 's/">.*//')

> "$css_path"
> "$js_path"

while read -r line ; do
	cat "$line" >> "$css_path"
done < <(echo "$css_files")

while read -r line ; do
	cat "$line" >> "$js_path"
done < <(echo "$js_files")

echo "> Stripping source map"
sed -i -e '/\/\*# sourceMappingURL.*/d' "$css_path"
sed -i -e '/\/\/# sourceMappingURL.*/d' "$js_path"

echo "> Getting fonts"
mkdir -p static/fonts
cp node_modules/simple-line-icons/fonts/* static/fonts

if [[ "$arg1" == "compress" ]]; then
	echo "> Compressing"
	./node_modules/clean-css-cli/bin/cleancss -o "$css_path" "$css_path"
	./node_modules/uglify-js/bin/uglifyjs "$js_path" --compress --mangle --output "$js_path"
fi

echo "> Done"
