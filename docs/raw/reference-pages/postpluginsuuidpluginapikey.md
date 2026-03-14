# Generate an API key for a private plugin

> Source: https://developers.toriihq.com/reference/postpluginsuuidpluginapikey

#### URL Expired

The URL for this request expired after 30 days.

uuidPlugin

string

required

# `` 200      API Key

object

id

integer

Unique identifier

idOrg

integer

Unique org identifier

createdBy

integer

Unique user identifier

token

string

# `` 400      Error Response

# `` 404      Error Response

Updated 6 months ago

* * *

Did this page help you?

Yes

No

ShellNodeRubyPHPPython

[Log in to use your API keys](https://developers.toriihq.com/login?redirect_uri=/reference/postpluginsuuidpluginapikey)

```

xxxxxxxxxx

curl --request POST \

     --url https://api.toriihq.com/v1.0/plugins/uuidPlugin/apikey \

     --header 'accept: */*'
```

Click `Try It!` to start a request and see the response here! Or choose an example:

\*/\*

``200``400``404

Updated 6 months ago

* * *

Did this page help you?

Yes

No