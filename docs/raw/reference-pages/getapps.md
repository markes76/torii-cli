# List apps

> Source: https://developers.toriihq.com/reference/getapps

#### URL Expired

The URL for this request expired after 30 days.

fields

string

Defaults to id,name,primaryOwner

List of fields to return for each application.

Allowed fields: `id`, `name`, `primaryOwner`, `appOwners`, `state`, `category`, `url`, `imageUrl`, `description`, `tags`, `score`, `isCustom`, `addedBy`, `creationTime`, `isHidden`, `sources`, `vendor`, `activeUsersCount`, `lastVisitTime` and all fields from `/apps/fields`

aggs

string

JSON string representing aggregation configuration. Structure: '{"field":"string","aggregationType":"metric\|groupBy\|date\_range\|date\_histogram","options":{"size":"integer","sort":{"field":"string","order":"desc\|asc","aggFunc":"total\|sum\|avg\|max\|min"},"metricFunction":"total\|sum\|avg\|max\|min","hardBounds":{"min":"string","max":"string"},"extendedBounds":{"min":"string","max":"string"},"datePeriod":"weekly\|monthly\|quarterly\|yearly"},"aggs":"Nested aggregation with the same structure as the parent"}'

q

string

The query to search

sort

string

A comma-seperated list of fields to sort by, with a postfix with either ':asc' or ':desc'. Fields can either be general, or custom to your organization

filters

string

JSON string representing filters

size

integer

1 to 1000

The max amount of results to return

cursor

string

A base64 string indicating the offset from which to start.

Pass the value of `nextCursor` returned from the previous call to get the next set of results

includeLicenses

boolean

Include aggregated license summary for each app

truefalse

# `` 200      Apps

object

apps

array of objects

apps

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

aggregations

number

count

integer

The number of results to return

total

integer

The total number of results

nextCursor

string

A base64 string indicating the offset from which to start.

Pass the value of `nextCursor` returned from the previous call to get the next set of results

Updated 25 days ago

* * *

Did this page help you?

Yes

No

ShellNodeRubyPHPPython

[Log in to use your API keys](https://developers.toriihq.com/login?redirect_uri=/reference/getapps)

```

xxxxxxxxxx

curl --request GET \

     --url https://api.toriihq.com/v1.0/apps \

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
      "isHidden": false,\
\
      "primaryOwner": {\
\
        "firstName": "Tony",\
\
        "lastName": "Stark",\
\
        "photoUrl": "www.photo.com",\
\
        "lifecycleStatus": "active",\
\
        "fullName": "Tony Stark",\
\
        "isDeletedInIdentitySources": true,\
\
        "id": 1000,\
\
        "email": "tony@stark.com",\
\
        "status": "active"\
\
      },\
\
      "name": "Salesforce",\
\
      "state": "Discovered",\
\
      "url": "https://example.com",\
\
      "category": "Developer Tools",\
\
      "description": "Awesome application",\
\
      "tags": "DevOps,Human Resource",\
\
      "licenses": {\
\
        "summary": {\
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
          }\
\
        },\
\
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
        ]\
\
      }\
\
    }\
\
  ],

  "aggregations": 0,

  "count": 100,

  "total": 1000,

  "nextCursor": "WzE0NjM1Mzg4NTcsIjY1NDMyMyJd"

}
```

Updated 25 days ago

* * *

Did this page help you?

Yes

No