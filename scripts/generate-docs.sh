BASEDIR=$(dirname $0)
files="$BASEDIR/../js/main.js"
for dir in $(ls -d $BASEDIR/../js/*/)
do
    if [[ "$dir" != *lib* ]]
    then
        files=$files' '$dir
    fi
done

jsdoc $files -r -d $BASEDIR/../docs/

