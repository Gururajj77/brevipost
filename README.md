**Hi, this is Gururaj's social media app, called Brevipost**

This app is built using the latest Angular 17 and the firebase. Below are the features used from the firestore:

- Authorization
- Firestore

The link for the hosted application: https://bervipost.firebaseapp.com

Please create a new account either by entering the needed credentials or by Google.

Now, here is the breakdown of the application design and the decisions made by me.

Before going in:

- I haven't implemented the UI of sign-in and register exactly as the "tweetx web"(the svg from the image is missing).
- Put efforts to make the other parts of the app similar to the image references.
- If you need a test credentials, you can use:
  - ikshwaku@yahoo.in
  - F0rever$

The folder structure of the application:

- app: contains the main components of the application.
- assets: contain the font used (Poppins).
- environment: contains the firebase configuration credentials.
- partials: The contains the scss partial styles which contains the accent and button styling which are shared across the application.

The app folder is the main folder housing all the application components, lets dive in:

- feed: The entry point to the app after successful login, will see all the posts made by the users of the app.
- profile: Holds the profile component of the logged in user, has 3 sub components called "profile-posts", "followers", "following" to show the posts from the follwed users, the logged in user's followers and following accounts respectively.
- sign-in and sign-up: Has similar functionality, the sign in with google implemented for both.
- users: Holds the users component, which displays all the registered users with their followers count.
- routes: The routes are registered in the app.routes.ts as per the angular 17 standard, where the standalone component architecture is default instead of ngModule (app-routing.module.ts).
- shared: This folder holds the shared components and services which will be detailed elaborately below.

The shared folder holds the shared components and important services that enable this app to communicate to the firebase.

- components: has the loader, main header, snackbar, the posts card and the user card components which are shared across the application.
- services:
  - The auth service has the methods for signin with google, to authenticate the user has logged in or not and to retrieve the current user details.
  - firestore: the firestore has 2 services which has mainly related to posts, getting users and updated the follow counts. The second service was created later in development to increase maintainability of the application.
  - guard: this has a simple authorization guard for the routes to check the user has logged in to access the feed, users and profile pages.
- types : golds the post and user types for the application.
