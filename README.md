
internal component ...
`ng g c  --project tf-ng-form-editor --export false --skip-tests true --display-block true --prefix form-editor --module tf-ng-form-editor components/< COMPONENT NAME >`

exported component ...
`ng g c  --project tf-ng-form-editor --export true --skip-tests true --display-block true --prefix tf-ng-form-editor < COMPONENT NAME >`



interface ....
ng g class  --project tf-ng-form-editor --skip-tests true --type interface to-share/< CLASS NAME >

model...
ng g class  --project tf-ng-form-editor --skip-tests true --type model to-share/< CLASS NAME >


service ...
`ng g s  --project tf-ng-form-editor --skip-tests true < SERVICE NAME >`



`npm update --legacy-peer-deps`



### To build `tf-ng-form-editor`


**** UPDATE PACKAGE VERSION ****

Build the project for prod which doesn't use IVY ngBuild as npm doesn't except pkgs built in ivy


`ng build tf-ng-form-editor --prod`

Navigate to the built project

`cd dist/tf-ng-form-editor`

Publish

`npm publish`

Return back to workplace

`cd ../../`

