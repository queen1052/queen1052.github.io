This Flutter Web app is a minimal scaffold to render site contents (markdown) and can be deployed to GitHub Pages.

Build instructions (locally with Flutter installed):

1. flutter channel stable
2. flutter upgrade
3. cd flutter_app
4. flutter build web --base-href "/" 
5. Copy build/web contents to GitHub Pages branch (gh-pages) or serve via GitHub Actions

Notes:
- This repo doesn't include Flutter SDK. Install Flutter locally before building.
- To generate pages from existing markdown, copy _posts or desired markdown files into flutter_app/assets/posts/ and load them in the app.
