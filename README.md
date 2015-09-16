# nodejs_scripts
Node.JS utility scripts

How to Use the scripts
Clone the project

npm install

update data/devlist.txt with developer list

Run the below command to fetch app list for the specified developers
node appsListforGivenDevs.js --ORG_NAME <YOUR_ORG_NAME>

appsListforGivenDevs fetch the apps on-boarded by the given list of developers in your ORG. This generate CSV file with following format

<developer1>, <app1>, <app2>, <app3>, ...
<developer2>,


Run the below command to fetch app list for the specified developers
node appsListProdCheckforGivenDevs.js --ORG_NAME <YOUR_ORG_NAME> --PRODUCT_NAME <YOUR_PRODUCT_NAME>

appsListProdCheckforGivenDevs fetch the apps on-boarded by the given list of developers in your ORG. This scipt also check if the specified product is associated with the devs/apps and flag it accordingly. This generate CSV file with following format

<developer1>, <app1>, <app2>, <app3>, ..., 1
<developer2>,
<developer3>, <app4>, <app5>, <app6>, ..., 0


