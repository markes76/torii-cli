# Get app

> Source: https://developers.toriihq.com/reference/getappsidapp

| Time | Status | User Agent |  |
| :-- | :-- | :-- | :-- |
| Retrieving recent requests… |

LoadingLoading…

#### URL Expired

The URL for this request expired after 30 days.

idApp

integer

required

≤ 2147483647

Unique app identifier

fields

string

Defaults to id,name,primaryOwner

List of fields to return for each application.

Allowed fields: `id`, `name`, `primaryOwner`, `appOwners`, `state`, `category`, `url`, `imageUrl`, `description`, `tags`, `score`, `isCustom`, `addedBy`, `creationTime`, `isHidden`, `sources`, `vendor`, `activeUsersCount`, `lastVisitTime` and all fields from `/apps/fields`

includeLicenses

boolean

Include aggregated license summary for the app

truefalse

# `` 200      App

object

app

object

id

integer

Unique identifier

isHidden

boolean

primaryOwner

object

primaryOwner object

name

string

state

string

Application state

url

string

category

string

description

string

tags

string

licenses

object

licenses object

Updated 25 days ago

* * *

Did this page help you?

Yes

No

ShellNodeRubyPHPPython

[Log in to use your API keys](https://developers.toriihq.com/login?redirect_uri=/reference/getappsidapp)

```

xxxxxxxxxx

curl --request GET \

     --url https://api.toriihq.com/v1.0/apps/idApp \

     --header 'accept: */*'
```

```

xxxxxxxxxx



{

  "app": {

    "id": 1000,

    "isHidden": false,

    "primaryOwner": {

      "firstName": "Tony",

      "lastName": "Stark",

      "photoUrl": "www.photo.com",

      "lifecycleStatus": "active",

      "fullName": "Tony Stark",

      "isDeletedInIdentitySources": true,

      "id": 1000,

      "email": "tony@stark.com",

      "status": "active"

    },

    "name": "Salesforce",

    "state": "Discovered",

    "url": "https://example.com",

    "category": "Developer Tools",

    "description": "Awesome application",

    "tags": "DevOps,Human Resource",

    "licenses": {

      "summary": {

        "totalAmount": 0,

        "activeAmount": 0,

        "inactiveAmount": 0,

        "unassignedAmount": 0,

        "pricePerLicense": {

          "value": 0,

          "currency": "string"

        },

        "annualCost": {

          "value": 0,

          "currency": "string"

        },

        "potentialSavings": {

          "value": 0,

          "currency": "string"

        }

      },

      "types": [\
\
        {\
\
          "name": "string",\
\
          "totalAmount": 0,\
\
          "activeAmount": 0,\
\
          "inactiveAmount": 0,\
\
          "unassignedAmount": 0,\
\
          "pricePerLicense": {\
\
            "value": 0,\
\
            "currency": "string"\
\
          },\
\
          "annualCost": {\
\
            "value": 0,\
\
            "currency": "string"\
\
          },\
\
          "potentialSavings": {\
\
            "value": 0,\
\
            "currency": "string"\
\
          },\
\
          "pricePerLicenseInOrgCurrency": {\
\
            "value": 0,\
\
            "currency": "string"\
\
          },\
\
          "annualCostInOrgCurrency": {\
\
            "value": 0,\
\
            "currency": "string"\
\
          },\
\
          "potentialSavingsInOrgCurrency": {\
\
            "value": 0,\
\
            "currency": "string"\
\
          }\
\
        }\
\
      ]

    }

  }

}
```

Updated 25 days ago

* * *

Did this page help you?

Yes

No