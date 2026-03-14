# List application users

> Source: https://developers.toriihq.com/reference/getappsidappusers

#### URL Expired

The URL for this request expired after 30 days.

idApp

integer

required

≤ 2147483647

Unique app identifier

sort

string

A comma-seperated list of fields to sort by, with a postfix with either ':asc' or ':desc'. Fields can either be general, or custom to your organization

q

string

A query to search by

qFields

string

A comma-seperated list of fields the query to search applies to. Fields can either be general, or custom to your organization

status

string

enum

The user status to filter by

deletedactivemanaged

Allowed:

`deleted``active``managed`

size

integer

≤ 1000

Defaults to 1000

The max amount of results to return

cursor

string

A base64 string indicating the offset from which to start.

Pass the value of `nextCursor` returned from the previous call to get the next set of results

# `` 200      Application Users

Updated 6 months ago

* * *

Did this page help you?

Yes

No

ShellNodeRubyPHPPython

[Log in to use your API keys](https://developers.toriihq.com/login?redirect_uri=/reference/getappsidappusers)

```

xxxxxxxxxx

curl --request GET \

     --url https://api.toriihq.com/v1.0/apps/idApp/users \

     --header 'accept: */*'
```

Click `Try It!` to start a request and see the response here! Or choose an example:

\*/\*

``200

Updated 6 months ago

* * *

Did this page help you?

Yes

No