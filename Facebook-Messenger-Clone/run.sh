case "$1" in
      'ios')
            react-native run-ios --simulator="iPhone X"
            ;;
      'android')
            react-native run-android
            ;;
      'install')
            yarn install
            react-native eject
            react-native link
            ;;
      'reset')
            watchman watch-del-all
            rm -rf node_modules/ && npm install
            npm start -- -- reset-cache
            rm - rf /tmp/haste-map-react-native-packager-*
            ;;
esac