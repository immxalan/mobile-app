/*****************************
 * environment.js
 * path: '/environment.js' (root of your project)
 ******************************/

// Be sure to add any new environment variables here! Import them for your Redux Actions.

import Constants from 'expo-constants';
// import { Platform } from 'react-native';
// const localhost = Platform.OS === 'ios' ? 'localhost:8080' : '10.0.2.2:8080';

const ENV = {
    dev: {
        auth0Domain: 'login.connectourkids.org',
        auth0ClientId: '3dKTXilDyoCV3YP06e90059KI6bPERYQ',
        auth0Audience: 'https://api-staging.connectourkids.org/',
        familyConnectionsURL: 'https://family-staging.connectourkids.org',
        auth0RedirectScheme: 'exp://127.0.0.1:19000/--/expo-auth-session',
        peopleSearchURL: 'https://dev.search.connectourkids.org/api/search-v2',
        eventTrackingURL: 'https://dev.search.connectourkids.org/api/sendEvent',
    },
    staging: {
        auth0Domain: 'login.connectourkids.org',
        auth0ClientId: '3dKTXilDyoCV3YP06e90059KI6bPERYQ',
        auth0Audience: 'https://api-staging.connectourkids.org/',
        familyConnectionsURL: 'https://family-staging.connectourkids.org',
        auth0RedirectScheme: 'exp://127.0.0.1:19000/--/expo-auth-session',
        peopleSearchURL: 'https://dev.search.connectourkids.org/api/search-v2',
        eventTrackingURL: 'https://dev.search.connectourkids.org/api/sendEvent',
    // Add other keys you want here
    },
    prod: {
        auth0Domain: 'login.connectourkids.org',
        auth0ClientId: 'QzXVCpRPy4m6IOPpm6Jl644nQIvpTknR',
        auth0Audience: 'https://api.connectourkids.org/',
        auth0RedirectScheme: 'connectourkids://127.0.0.1:19000/--/expo-auth-session',
        familyConnectionsURL: 'https://family.connectourkids.org',
        peopleSearchURL: 'https://search.connectourkids.org/api/search-v2',
        eventTrackingURL: 'https://search.connectourkids.org/api/sendEvent',
    // Add other keys you want here
    },
};

const getEnvVars = (env = Constants.manifest.releaseChannel) => {
    // This variable is set to true when react-native is running in Dev mode.
    // __DEV__ is true when run locally, but false when published.

    if (env == 'default')
        env = 'prod';

    return __DEV__ ? ENV.dev : ENV[env || 'prod'];
};

export default getEnvVars;
