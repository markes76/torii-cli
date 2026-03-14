# Authentication

> Source: https://developers.toriihq.com/reference/authentication

[Jump to Content](https://developers.toriihq.com/reference/authentication#content)

[![developer.torii](https://files.readme.io/f5ef906-Torii_logo_dark.svg)](https://developers.toriihq.com/)

[Home](https://developers.toriihq.com/) [Guides](https://developers.toriihq.com/docs) [Recipes](https://developers.toriihq.com/recipes) [API Explorer](https://developers.toriihq.com/reference) [Changelog](https://developers.toriihq.com/changelog)

v1.0

* * *

[Log In](https://developers.toriihq.com/login?redirect_uri=/reference/authentication) [![developer.torii](https://files.readme.io/f5ef906-Torii_logo_dark.svg)](https://developers.toriihq.com/)

API Explorer

[Log In](https://developers.toriihq.com/login?redirect_uri=/reference/authentication)

v1.0 [Home](https://developers.toriihq.com/) [Guides](https://developers.toriihq.com/docs) [Recipes](https://developers.toriihq.com/recipes) [API Explorer](https://developers.toriihq.com/reference) [Changelog](https://developers.toriihq.com/changelog)

Authentication

All

Pages

###### Start typing to search…

JUMP TO

## getting started

- [Introduction](https://developers.toriihq.com/reference/introduction-1)
- [Authentication](https://developers.toriihq.com/reference/authentication)
- [Pagination](https://developers.toriihq.com/reference/pagination)
- [Aggregations](https://developers.toriihq.com/reference/aggregations)
- [Filters](https://developers.toriihq.com/reference/filters)
- [Rate limits](https://developers.toriihq.com/reference/rate-limits)
- [Errors](https://developers.toriihq.com/reference/errors)
- [OpenAPI](https://developers.toriihq.com/reference/openapi-documentation)

## Torii API Documentation

- [Organizations](https://developers.toriihq.com/reference/getorgsmy)
  - [Get organizationget](https://developers.toriihq.com/reference/getorgsmy)
- [Users](https://developers.toriihq.com/reference/getusers)
  - [List usersget](https://developers.toriihq.com/reference/getusers)
  - [Get userget](https://developers.toriihq.com/reference/getusersiduser)
  - [Update userput](https://developers.toriihq.com/reference/putusersiduser)
- [User Applications](https://developers.toriihq.com/reference/getusersiduserapps)
  - [List user applicationsget](https://developers.toriihq.com/reference/getusersiduserapps)
  - [Get user applicationget](https://developers.toriihq.com/reference/getusersiduserappsidapp)
  - [Update user applicationput](https://developers.toriihq.com/reference/putusersiduserappsidapp)
- [Files](https://developers.toriihq.com/reference/getfilesurl)
  - [Get parameters for uploading filesget](https://developers.toriihq.com/reference/getfilesurl)
  - [Get file informationget](https://developers.toriihq.com/reference/getfilesid)
  - [Download fileget](https://developers.toriihq.com/reference/getfilesiddownload)
  - [Store file information in DBpost](https://developers.toriihq.com/reference/postfiles)
  - [Upload file (up to 3MB)post](https://developers.toriihq.com/reference/postfilesupload)
- [Parsings](https://developers.toriihq.com/reference/getparsingsid)
  - [Get parse requestget](https://developers.toriihq.com/reference/getparsingsid)
  - [Parse automaticallyput](https://developers.toriihq.com/reference/putparsingsautomatic)
  - [Parse manuallyput](https://developers.toriihq.com/reference/putparsingsmanual)
- [SCIM](https://developers.toriihq.com/reference/getscimv2resourcetypes)
  - [List Resource Typesget](https://developers.toriihq.com/reference/getscimv2resourcetypes)
  - [List Schemasget](https://developers.toriihq.com/reference/getscimv2schemas)
  - [Get Service Provider Configurationget](https://developers.toriihq.com/reference/getscimv2serviceproviderconfig)
  - [List Usersget](https://developers.toriihq.com/reference/getscimv2users)
  - [Create Userpost](https://developers.toriihq.com/reference/postscimv2users)
  - [Get User By IDget](https://developers.toriihq.com/reference/getscimv2usersiduser)
  - [Delete Userdel](https://developers.toriihq.com/reference/deletescimv2usersiduser)
  - [Update User (PUT)put](https://developers.toriihq.com/reference/putscimv2usersiduser)
  - [Update user (PATCH)patch](https://developers.toriihq.com/reference/patchscimv2usersiduser)
- [Applications Users](https://developers.toriihq.com/reference/getappsidappusers)
  - [List application usersget](https://developers.toriihq.com/reference/getappsidappusers)
- [Apps](https://developers.toriihq.com/reference/getapps)
  - [List appsget](https://developers.toriihq.com/reference/getapps)
  - [Add apppost](https://developers.toriihq.com/reference/postapps)
  - [Search appsget](https://developers.toriihq.com/reference/getappssearch)
  - [Get appget](https://developers.toriihq.com/reference/getappsidapp)
  - [Update appput](https://developers.toriihq.com/reference/putappsidapp)
  - [Create apppost](https://developers.toriihq.com/reference/postappscustom)
  - [Match appspost](https://developers.toriihq.com/reference/postappsmatch)
- [Audit](https://developers.toriihq.com/reference/getaudit)
  - [Get admin audit logsget](https://developers.toriihq.com/reference/getaudit)
- [Contracts](https://developers.toriihq.com/reference/getcontracts)
  - [List contractsget](https://developers.toriihq.com/reference/getcontracts)
  - [Create contractpost](https://developers.toriihq.com/reference/postcontracts)
  - [Get contractget](https://developers.toriihq.com/reference/getcontractsidcontract)
  - [Delete contractdel](https://developers.toriihq.com/reference/deletecontractsidcontract)
  - [Update contractput](https://developers.toriihq.com/reference/putcontractsidcontract)
- [Roles](https://developers.toriihq.com/reference/getroles)
  - [List rolesget](https://developers.toriihq.com/reference/getroles)
- [App Fields](https://developers.toriihq.com/reference/getappsfields)
  - [List app fieldsget](https://developers.toriihq.com/reference/getappsfields)
  - [Create a new fieldpost](https://developers.toriihq.com/reference/postappsfields)
  - [Delete fielddel](https://developers.toriihq.com/reference/deleteappsfieldsidfield)
  - [List app fields metadataget](https://developers.toriihq.com/reference/getappsmetadata)
  - [Update fieldput](https://developers.toriihq.com/reference/putappsfieldsidfield)
- [Contracts Fields](https://developers.toriihq.com/reference/getcontractsfields)
  - [List contract fieldsget](https://developers.toriihq.com/reference/getcontractsfields)
  - [List contract fields metadataget](https://developers.toriihq.com/reference/getcontractsmetadata)
- [User Fields](https://developers.toriihq.com/reference/getusersfields)
  - [List user custom fieldsget](https://developers.toriihq.com/reference/getusersfields)
  - [List user fields metadataget](https://developers.toriihq.com/reference/getusersmetadata)
- [Workflows](https://developers.toriihq.com/reference/getworkflowsactionexecutions)
  - [Get action execution logsget](https://developers.toriihq.com/reference/getworkflowsactionexecutions)
  - [Get workflows edit historyget](https://developers.toriihq.com/reference/getworkflowsaudit)
  - [Run App Access Request Policypost](https://developers.toriihq.com/reference/postappcatalogtriggerappaccessrequestpolicy)
  - [Run workflowpost](https://developers.toriihq.com/reference/postworkflowsidworkflowtrigger)
- [Plugins](https://developers.toriihq.com/reference/getpluginsidpluginfields)
  - [List plugin fieldsget](https://developers.toriihq.com/reference/getpluginsidpluginfields)
  - [Create pluginpost](https://developers.toriihq.com/reference/postplugins)
  - [Generate an API key for a private pluginpost](https://developers.toriihq.com/reference/postpluginsuuidpluginapikey)
  - [Delete plugindel](https://developers.toriihq.com/reference/deletepluginsuuidplugin)
  - [Update plugin (publish new version)put](https://developers.toriihq.com/reference/putpluginsuuidplugin)
- [Anonymization](https://developers.toriihq.com/reference/postanonymizerequest)
  - [Create user anonymization requestpost](https://developers.toriihq.com/reference/postanonymizerequest)
- [Integrations](https://developers.toriihq.com/reference/putservicessynccustom)
  - [Sync custom integrationput](https://developers.toriihq.com/reference/putservicessynccustom)
  - [Sync Gluu custom integrationput](https://developers.toriihq.com/reference/putservicessyncgluu)

Powered by [ReadMe](https://readme.com/?ref_src=hub&project=superhero)

# Authentication

Ask AI