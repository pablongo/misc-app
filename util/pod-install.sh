BASEDIR=$(dirname "$0")
echo "Working"
cd $BASEDIR
cd ../ios
pod install
echo "Pods installeds"
echo "Script finished"