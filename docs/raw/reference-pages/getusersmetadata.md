# List user fields metadata

> Source: https://developers.toriihq.com/reference/getusersmetadata

| Time | Status | User Agent |  |
| :-- | :-- | :-- | :-- |
| Retrieving recent requests… |

LoadingLoading…

#### URL Expired

The URL for this request expired after 30 days.

q

string

The field name or key to search for

# `` 200      User Metadata

object

predefinedFields

array of objects

predefinedFields

object

name

string

required

systemKey

string

required

type

string

enum

required

`number``singleLine``multiLine``email``currency``cardNumber``datePicker``dropdown``dropdownMulti``usersDropdown``user``bool``fileUpload``contractsDropdownMulti``usersDropdownMulti``appUserAccount``multiValueString`

filterType

string

enum

`longText``text``number``currency``bool``dropdown``dropdownMulti``date``user``userMulti``name``freeText``appUserAccount``fileUpload``contractsDropdownMulti`

filterSystemKey

string

relatedFields

array of strings

relatedFields

scopes

array of strings

scopes

feature

string

enum

`integration.slack:action.askTorii``page.appCatalog``page.appCatalog:tab.policies``page.appCatalog:tab.settings``page.application``page.application:tab.chargeback``page.application:tab.contracts``page.application:tab.discoveredApps``page.application:tab.expenses``page.application:tab.info``page.application:tab.overview``page.application:tab.recommendations``page.application:tab.securityGrade``page.application:tab.users``page.applications``page.applications:tab.compare``page.applications:tab.refine``page.applications:tab.review``page.expenses``page.expenses:tab.allExpenses``page.expenses:tab.expenseFiles``page.expenses:tab.matchingRules``page.expenses:tab.overview``page.insights``page.integrations``page.integrations:type.custom``page.integrations:type.expenses``page.integrations:type.googleSheets``page.licenses``page.licenses:component.benchmark``page.licenses:tab.chargeback``page.licenses:tab.current``page.licenses:tab.recommendations``page.licenses:tab.trend``page.offboarding``page.pluginMarketplace``page.renewals``page.renewals:component.contractAI``page.renewals:tab.calendar``page.renewals:tab.contracts``page.reports``page.security``page.settings``page.settings:tab.apiAccess``page.settings:tab.applicationDetails``page.settings:tab.browserExtension``page.settings:tab.contractDetails``page.settings:tab.customApps``page.settings:tab.emails``page.settings:tab.general``page.settings:tab.hiddenApps``page.settings:tab.labs``page.settings:tab.members``page.settings:tab.members:component.inviteMembersByRole``page.settings:tab.members:tab.appOwners``page.settings:tab.members:tab.toriiUsers``page.settings:tab.roles``page.settings:tab.roles:component.customRoles``page.settings:tab.roles:role.procurement``page.settings:tab.secretsVault``page.settings:tab.security``page.settings:tab.usersAndEmployees``page.settings:tab.usersAndEmployees:feature.automaticallyReassignStakeholder``page.settings:tab.usersAndEmployees:feature.automaticallyReassignStakeholder:entity.contracts``page.user``page.users``page.users:tab.employees``page.users:tab.nonHumanUsers``page.users:tab.externalUsers``page.users:tab.users``page.workflows``page.tasks``feature.emailToContract``mergeUsers``appCompliance``blockAccess``shareReports``scheduledReports``page.reports:tab.reports``page.dashboards``page.dashboards:feature.viewAdvancedNativeDashboards``page.dashboards:feature.viewDrillDownData``page.dashboards:feature.updateLayout``page.dashboards:feature.updateWidgetConfig``page.dashboards:feature.accessPermissions``page.dashboards:feature.createDeleteDashboard``feature.offboarding``feature.contracts``feature.expenses``feature.licenses``feature.security``feature.accessReviews``feature.accessPolicies``page.settings:tab.applicationDetails:feature.smartFields`

customFields

array of objects

customFields

object

idField

integer

Unique identifier

systemKey

string

required

isShown

boolean

idOrg

integer

Unique org identifier

sourceIdApp

integer

≤ 2147483647

Unique app identifier

name

string

type

string

isDeleted

boolean

relatedFields

array of strings

relatedFields

Updated 6 months ago

* * *

Did this page help you?

Yes

No

ShellNodeRubyPHPPython

[Log in to use your API keys](https://developers.toriihq.com/login?redirect_uri=/reference/getusersmetadata)

```

xxxxxxxxxx

curl --request GET \

     --url https://api.toriihq.com/v1.0/users/metadata \

     --header 'accept: */*'
```

```

xxxxxxxxxx



{

  "predefinedFields": [\
\
    {\
\
      "name": "Department",\
\
      "systemKey": "department",\
\
      "type": "singleLine",\
\
      "filterType": "dropdown",\
\
      "filterSystemKey": "application",\
\
      "relatedFields": [\
\
        "string"\
\
      ],\
\
      "scopes": [\
\
        "member"\
\
      ],\
\
      "feature": "integration.slack:action.askTorii"\
\
    }\
\
  ],

  "customFields": [\
\
    {\
\
      "idField": 1000,\
\
      "systemKey": "department",\
\
      "isShown": true,\
\
      "idOrg": 1000,\
\
      "sourceIdApp": 1000,\
\
      "name": "Department",\
\
      "type": "singleLine",\
\
      "isDeleted": false,\
\
      "relatedFields": [\
\
        "string"\
\
      ]\
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