# Note
This is for React Native using React Navigation https://reactnavigation.org/. If you are using React Native CLI basic (without using React Navigation) then this guide won't work for you. You need to refer to the folder that is `rum-js/reactnative-cli-ios-basic-auto-instr`.

# Env
- Tested on React Native v
- With React Navigation v

# Get started
- Start with https://reactnative.dev/docs/environment-setup.
    - Select ![](i1.png) these options based on my workstation setup e.g. React Native CLI >> macOS >> iOS.
    - Follow through the docs environment setup.
    - Build a simple app following the setup doc.
    - After completion, open `App.tsx` in my text editor of choice and edit some lines.
- Edit the App.tsx to include code snippets from these 3 docs in sequential order.
    - Comment or remove the default created code in App.tsx.
    - Then add code from
        - https://reactnavigation.org/docs/getting-started
        - https://reactnavigation.org/docs/hello-react-navigation
        - https://reactnavigation.org/docs/navigating
        - After addition it would look like this ![](i2.png)
        - Run the new addition with `npx react-native start` in terminal 1 and `npx react-native run-ios` in new terminal 2.
- Edit the App.tsx to include code snippets from https://reactnative.dev/docs/network
    - It would look like this ![](i3.png) 
    - - Run the new addition with `npx react-native start` in terminal 1 and `npx react-native run-ios` in new terminal 2.
- Add splunk-otel-react-native https://github.com/signalfx/splunk-otel-react-native
    - Install via npm / yarn e.g. `npm install @splunk/otel-react-native`
    - Initialize the library ![](i4.png) in App.tsx (unlike a basic version without using React Navigation) like 

```typescript

```

- After that go to the ios folder `cd ios` in a new terminal 3 do `bundle install` and CocoaPods installed `pod install` then return to root folder `cd ..`.

- Reboot the app with `npx react-native start` in terminal 1 and `npx react-native run-ios` in new terminal 2.

- Go to Splunk Observability Cloud to verify that the RUM has metrics and session info. 
