
### Running the project
**pre requisites**
- nodeJS
- npm

**run the project**

*development*
```
In root directory:
1. npm install
2. create file called ".env.local" in root directory. Add the following line:
REACT_APP_GOOGLE_MAPS_API_KEY=<<YOUR GOOGLE API KEY HERE>>
3. npm start
```
development server will be running on localhost:3000.

*production*

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>

```
1. update ".env.production" file in root directory and add google API key
2. npm run build
```