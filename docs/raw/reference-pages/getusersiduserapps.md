# List user applications

> Source: https://developers.toriihq.com/reference/getusersiduserapps

| Time | Status | User Agent |  |
| :-- | :-- | :-- | :-- |
| Make a request to see history. |

#### URL Expired

The URL for this request expired after 30 days.

idUser

integer

required

Unique user identifier

fields

string

Defaults to id,name,isUserRemovedFromApp,state

List of fields to return for each user application.

Allowed fields: `id`, `name`, `primaryOwner`, `appOwners`, `state`, `category`, `url`, `imageUrl`, `description`, `tags`, `score`, `isCustom`, `addedBy`, `creationTime`, `isHidden`, `sources`, `vendor`, `users`, `lastUsageTime`, `isUserRemovedFromApp`, `annualCost`, `annualCostConverted`, `currency` and all fields from `/apps/fields`

isUserRemovedFromApp

boolean

true if the user was removed from the application, false otherwise

truefalse

state

string

Application state

# `` 200      User apps

object

apps

array of objects

apps

object

id

integer

Unique identifier

name

string

isUserRemovedFromApp

boolean

true if the user was removed from the application, false otherwise

state

string

Application state

Updated 6 months ago

* * *

Did this page help you?

Yes

No

ShellNodeRubyPHPPython

[Log in to use your API keys](https://developers.toriihq.com/login?redirect_uri=/reference/getusersiduserapps)

```

xxxxxxxxxx

curl --request GET \

     --url 'https://api.toriihq.com/v1.0/users/idUser/apps?fields=id&fields=name&fields=isUserRemovedFromApp&fields=state' \

     --header 'accept: */*'
```

```

xxxxxxxxxx



{

  "apps": [\
\
    {\
\
      "id": 1000,\
\
      "name": "Salesforce",\
\
      "isUserRemovedFromApp": true,\
\
      "state": "discovered"\
\
    }\
\
  ]

}
```

Updated 6 months ago

* * *

Did this page help you?

Yes

No