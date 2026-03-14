# List plugin fields

> Source: https://developers.toriihq.com/reference/getpluginsidpluginfields

| Time | Status | User Agent |  |
| :-- | :-- | :-- | :-- |
| Retrieving recent requests… |

LoadingLoading…

#### URL Expired

The URL for this request expired after 30 days.

idPlugin

integer

required

Unique identifier of the plugin

# `` 200      Plugin Fields

object

plugin

object

idOrg

integer

idPlugin

integer

fields

array of objects

fields

object

idField

integer

systemKey

string

Updated 6 months ago

* * *

Did this page help you?

Yes

No

ShellNodeRubyPHPPython

[Log in to use your API keys](https://developers.toriihq.com/login?redirect_uri=/reference/getpluginsidpluginfields)

```

xxxxxxxxxx

curl --request GET \

     --url https://api.toriihq.com/v1.0/plugins/idPlugin/fields \

     --header 'accept: */*'
```

```

xxxxxxxxxx



{

  "plugin": {

    "idOrg": 0,

    "idPlugin": 0,

    "fields": [\
\
      {\
\
        "idField": 0,\
\
        "systemKey": "string"\
\
      }\
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