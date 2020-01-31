## Cypress Test Readme

Create a file: `cypress.env.json` in the root directory.

It should contain these this object with values from your .env:

```
{
  "ADMIN_EMAIL": "YOUR ENV VALUE",
  "ADMIN_PASSWORD": "YOUR ENV VALUE"
}
```
Start server: `$ npm run build && npm run devstart`
Then: `$ npm run cypress` to run the test.
