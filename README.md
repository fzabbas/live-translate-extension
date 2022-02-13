A live translation chrome extension built using Google Translate API and React.

To clone the repo in your local device:

```
$ git clone git@github.com:fzabbas/live-translate-extension.git
```

To be able to use the Google Translate API, you will need to get an API key.

> NOTE: To get an API key, sign in into [Google API Console](https://console.developers.google.com/home/).

> Follow the [guide](https://cloud.google.com/translate/docs/setup) to get detailed instructions.

Once you have your API key, create a ```.env``` file in the local repo and make a variable that stores your API key.

```
$ REACT_APP_API_KEY= <your_API_KEY>
```



To install the app, run the command: 
```
$ npm install
$ npm run build
```
This will create a build folder in your local copy of the repo.
Open a Google Chrome window and go to :

```
chrome://extensions/
```

Toggle to Developer Mode and click on the load unpacked button, then select the ```/build``` folder that was just created.

![chrome extenssions](https://i.imgur.com/jAvQmCP.png)

Now you will see the Live Transalte Extensions in your list of extensions, toggle it on to use it!

Features:
1) Light and Dark mode 
2) Highlight text on current tab to translate 
3) Type text in the text box to translate to given language.

<img src="https://i.imgur.com/LaTuS8X.png" width="300" height="300"> <img src="https://i.imgur.com/7dDq3TX.png" width="400" height="300">
<img src="https://i.imgur.com/0mRYUq3.png" width="250" height="300">

