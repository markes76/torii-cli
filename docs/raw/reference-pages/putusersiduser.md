# Update user

> Source: https://developers.toriihq.com/reference/putusersiduser

#### URL Expired

The URL for this request expired after 30 days.

idUser

integer

required

Unique user identifier

lifecycleStatus

string

enum

required

Lifecycle status

activeoffboardingoffboarded

Allowed:

`active``offboarding``offboarded`

# `` 200      User

object

user

object

id

integer

Unique user identifier

idOrg

number

firstName

string

lastName

string

email

string

Email address

creationTime

date

Creation time

idRole

number

role

string

lifecycleStatus

string

enum

Lifecycle status

`active``offboarding``offboarded`

isDeletedInIdentitySources

boolean

true if the user has left the organization, false otherwise

isExternal

boolean

true if the user is external, false otherwise

activeAppsCount

integer

additionalEmails

array of strings

Defaults to

List of additional emails

additionalEmails

Updated 6 months ago

* * *

Did this page help you?

Yes

No

ShellNodeRubyPHPPython

[Log in to use your API keys](https://developers.toriihq.com/login?redirect_uri=/reference/putusersiduser)

```

xxxxxxxxxx

curl --request PUT \

     --url https://api.toriihq.com/v1.0/users/idUser \

     --header 'accept: */*' \

     --header 'content-type: application/json'
```

```

xxxxxxxxxx



{

  "user": {

    "id": 1000,

    "idOrg": 10,

    "firstName": "Tony",

    "lastName": "Tony",

    "email": "tony@stark.com",

    "creationTime": "2020-01-01T00:00:00.000Z",

    "idRole": 1,

    "role": "Admin",

    "lifecycleStatus": "active",

    "isDeletedInIdentitySources": true,

    "isExternal": true,

    "activeAppsCount": 1,

    "additionalEmails": [\
\
      "tony@stark.com"\
\
    ]

  }

}
```

Updated 6 months ago

* * *

Did this page help you?

Yes

No