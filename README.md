"# ECE Research

A static, framework-free research page for the Electronics Engineering Department.

## Run locally

Open `index.html` directly in a browser. No install or build step is required.

## Edit the content

All page content is read from [`data.js`](./data.js) through `window.ECE_DATA`.

1. Add images to `images/research`, `images/achievements`, or `images/expo`. Replace `images/logo.png` with the department logo if desired.
2. Update the matching `image` or `src` values in `data.js`.
3. Leave an image value empty to show the built-in dashed camera placeholder.

## Deploy with Netlify Drop

1. Open [Netlify Drop](https://app.netlify.com/drop).
2. Drag the entire repository folder into the upload area.
3. Use the generated URL to share the site. No build command is needed.

## Deploy with GitHub Pages

1. Push the repository to a GitHub repository.
2. Open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select the `main` branch and the `/(root)` folder, then save.
5. Open the published Pages URL after the deployment completes.

The app uses URL hashes (`#archive`, `#achievements`, and `#expo`) so each view can be linked directly."

The page follows the visitor's system light/dark preference. The header toggle can override it, and that choice is saved in the browser. It also works when opened directly from disk and when embedded in an iframe (including SharePoint)."
