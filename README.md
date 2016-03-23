# Git Issues Dashboard
Git dashboard is an application that takes a repository and makes a issues dashboard out of it, which contains all the issues created in one screen.

[Click here for demo](http://githubissuesboard.herokuapp.com/)

# Available Filters
* Last 24 hours
* 24 hours-7days
* More than 7days

These filters work based on the creation date(**not updation date**).

# Technical Details
This application works only with public repositories on github.com and uses github's public api to fetch the details and the whole application is made out of javascript.

# Possible Extenstions
1) Proper Validation of github repository links
2) Use pagination where ever required (now only fetches first 100 open issues).
3) login with github and explore issues of all your repositories in one place
4) enabling show and add comments on the same page under the issue itself.

There are many more possiblities to extend it.