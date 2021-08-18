# tf-ng-form-editor


Install tf-ng-form-editor from npm

`npm install tf-ng-form-editor`


If it errors then install it with --legacy-peer-deps

`npm install tf-ng-form-editor --legacy-peer-deps`

This also solves the error when updating to future versions

`npm update --legacy-peer-deps`

## Integration

"./node_modules/tf-ng-form-editor/assets/css/froala_editor.pkgd.min.css",
              "./node_modules/tf-ng-form-editor/assets/css/froala_style.min.css"


The editor makes use of froala rich text editor (angular-froala-wysiwyg). If your app already has this installed, and you have followed the froala instructions to integrate then skip this. If you haven't already got froala then we need to add some global styles... open angular.json file and insert a new entry into the styles array

```
"styles": [
  "styles.css",
  "./node_modules/tf-ng-form-editor/assets/css/froala_editor.pkgd.min.css",
  "./node_modules/tf-ng-form-editor/assets/css/froala_style.min.css"
]
```

You will also need to add CSS styles into the main index.html file

```
<!-- index.html -->
<link href="node_modules/tf-ng-form-editor/assets/css/froala_editor.pkgd.min.css" rel="stylesheet">
```

