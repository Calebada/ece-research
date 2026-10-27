# ECE Research web app

Plain HTML/CSS/JS. No install, no build.

## Add your content
1. Put pictures in `images/research`, `images/achievements`, `images/expo`. Put the logo at `images/logo.png`.
2. Open `data.js` and edit the entries. File names there must match your pictures.
3. Empty `image` or `src` shows a placeholder box.

## Test on your computer
Double-click `index.html`.

## Deploy (pick one)
- Netlify Drop: go to app.netlify.com/drop and drag this whole folder in. Sign up to keep the link permanent.
- GitHub Pages: upload all files to the root of a public repo, then Settings > Pages > Deploy from a branch > main > /(root).

## Put it in SharePoint
- Easiest: add the link to a Quick links web part. It opens the app and needs no admin approval.
- Embed: use the Embed web part with `<iframe src="YOUR-LINK" width="100%" height="1500" frameborder="0"></iframe>`. Your admin must allow the domain in HTML Field Security.
