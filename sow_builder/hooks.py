app_name = "sow_builder"
app_title = "SoW Builder"
app_publisher = "Zirrus One"
app_description = "Statement of Work Builder"
app_email = "ops@zirrusone.com"
app_license = "mit"

# Apps
# ------------------

# required_apps = []

# Each item in the list will be shown as an app in the apps page
# add_to_apps_screen = [
# 	{
# 		"name": "sow_builder",
# 		"logo": "/assets/sow_builder/logo.png",
# 		"title": "SoW Builder",
# 		"route": "/sow_builder",
# 		"has_permission": "sow_builder.api.permission.has_app_permission"
# 	}
# ]

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
# app_include_css = "/assets/sow_builder/css/sow_builder.css"
# app_include_js = "/assets/sow_builder/js/sow_builder.js"

# include js, css files in header of web template
# web_include_css = "/assets/sow_builder/css/sow_builder.css"
# web_include_js = "/assets/sow_builder/js/sow_builder.js"

# include custom scss in every website theme (without file extension ".scss")
# website_theme_scss = "sow_builder/public/scss/website"

# include js, css files in header of web form
# webform_include_js = {"doctype": "public/js/doctype.js"}
# webform_include_css = {"doctype": "public/css/doctype.css"}

# include js in page
# page_js = {"page" : "public/js/file.js"}

# include js in doctype views
# doctype_js = {"doctype" : "public/js/doctype.js"}
doctype_js = {
 "Quotation": "public/js/quotation_sow.js"
}
# doctype_list_js = {"doctype" : "public/js/doctype_list.js"}
# doctype_tree_js = {"doctype" : "public/js/doctype_tree.js"}
# doctype_calendar_js = {"doctype" : "public/js/doctype_calendar.js"}

# Svg Icons
# ------------------
# include app icons in desk
# app_include_icons = "sow_builder/public/icons.svg"

# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
# 	"Role": "home_page"
# }

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Jinja
# ----------

# add methods and filters to jinja environment
# jinja = {
# 	"methods": "sow_builder.utils.jinja_methods",
# 	"filters": "sow_builder.utils.jinja_filters"
# }

# Installation
# ------------

# before_install = "sow_builder.install.before_install"
# after_install = "sow_builder.install.after_install"

# Uninstallation
# ------------

# before_uninstall = "sow_builder.uninstall.before_uninstall"
# after_uninstall = "sow_builder.uninstall.after_uninstall"

# Integration Setup
# ------------------
# To set up dependencies/integrations with other apps
# Name of the app being installed is passed as an argument

# before_app_install = "sow_builder.utils.before_app_install"
# after_app_install = "sow_builder.utils.after_app_install"

# Integration Cleanup
# -------------------
# To clean up dependencies/integrations with other apps
# Name of the app being uninstalled is passed as an argument

# before_app_uninstall = "sow_builder.utils.before_app_uninstall"
# after_app_uninstall = "sow_builder.utils.after_app_uninstall"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "sow_builder.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
# 	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
# 	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# DocType Class
# ---------------
# Override standard doctype classes

# override_doctype_class = {
# 	"ToDo": "custom_app.overrides.CustomToDo"
# }

# Document Events
# ---------------
# Hook on document methods and events

# doc_events = {
# 	"*": {
# 		"on_update": "method",
# 		"on_cancel": "method",
# 		"on_trash": "method"
# 	}
# }

# Scheduled Tasks
# ---------------

# scheduler_events = {
# 	"all": [
# 		"sow_builder.tasks.all"
# 	],
# 	"daily": [
# 		"sow_builder.tasks.daily"
# 	],
# 	"hourly": [
# 		"sow_builder.tasks.hourly"
# 	],
# 	"weekly": [
# 		"sow_builder.tasks.weekly"
# 	],
# 	"monthly": [
# 		"sow_builder.tasks.monthly"
# 	],
# }

# Testing
# -------

# before_tests = "sow_builder.install.before_tests"

# Overriding Methods
# ------------------------------
#
# override_whitelisted_methods = {
# 	"frappe.desk.doctype.event.event.get_events": "sow_builder.event.get_events"
# }
#
# each overriding function accepts a `data` argument;
# generated from the base implementation of the doctype dashboard,
# along with any modifications made in other Frappe apps
# override_doctype_dashboards = {
# 	"Task": "sow_builder.task.get_dashboard_data"
# }

# exempt linked doctypes from being automatically cancelled
#
# auto_cancel_exempted_doctypes = ["Auto Repeat"]

# Ignore links to specified DocTypes when deleting documents
# -----------------------------------------------------------

# ignore_links_on_delete = ["Communication", "ToDo"]

# Request Events
# ----------------
# before_request = ["sow_builder.utils.before_request"]
# after_request = ["sow_builder.utils.after_request"]

# Job Events
# ----------
# before_job = ["sow_builder.utils.before_job"]
# after_job = ["sow_builder.utils.after_job"]

# User Data Protection
# --------------------

# user_data_fields = [
# 	{
# 		"doctype": "{doctype_1}",
# 		"filter_by": "{filter_by}",
# 		"redact_fields": ["{field_1}", "{field_2}"],
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_2}",
# 		"filter_by": "{filter_by}",
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_3}",
# 		"strict": False,
# 	},
# 	{
# 		"doctype": "{doctype_4}"
# 	}
# ]

# Authentication and authorization
# --------------------------------

# auth_hooks = [
# 	"sow_builder.auth.validate"
# ]

# Automatically update python controller files with type annotations for this app.
# export_python_type_annotations = True

# default_log_clearing_doctypes = {
# 	"Logging DocType Name": 30  # days to retain logs
# }

fixtures = [
    {
        "dt": "Print Format",
        "filters": [
            [
                "name", "in", ["Statement of Work"]
            ]
        ]
    }
]
