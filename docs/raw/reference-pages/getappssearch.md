# Search apps

> Source: https://developers.toriihq.com/reference/getappssearch

#### URL Expired

The URL for this request expired after 30 days.

q

string

required

The query to search

limit

integer

1 to 50

Defaults to 5

Max results to return

# `` 200      Search apps

object

apps

array of objects

apps

object

id

integer

required

Unique identifier

name

string

required

category

string

required

imageUrl

string

required

url

string

required

isHidden

boolean

Updated 6 months ago

* * *

Did this page help you?

Yes

No

ShellNodeRubyPHPPython

[Log in to use your API keys](https://developers.toriihq.com/login?redirect_uri=/reference/getappssearch)

```

xxxxxxxxxx

curl --request GET \

     --url https://api.toriihq.com/v1.0/apps/search \

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
      "category": "Developer Tools",\
\
      "imageUrl": "http://example.com/image.png",\
\
      "url": "https://example.com",\
\
      "isHidden": false\
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