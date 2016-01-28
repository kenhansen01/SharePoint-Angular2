# SharePoint and Angular2

### Before you start
Make sure you have TypeScript 1.8.0+ installed globally. 
As of now that means running:
```
npm install -g typescript@next
```

### What you get from this
A Master page with a fixed navigation menu at the top of the page. This also styles the nav dropdowns so the 3rd level is height matched to the 2nd based on which is tallest. 

![Navigation Styles](navImage.JPG)

The master page also registers all of the Angular2 scripts and initializes SystemJS to start configuring and loading files.

A Layout Page that loads news items from a list, filters based on selections and shows the items in a modal view. It looks like this (blurred to protect my innocent employer):

![News Items](homeScreen.JPG)

### Pre-requisite steps:

