app_name = "sow_builder"
app_title = "SoW Builder"
app_publisher = "Zirrus One"
app_description = "Statement of Work Builder"
app_email = "ops@zirrusone.com"
app_license = "mit"

doctype_js = {
 "Quotation": "public/js/quotation_sow.js"
}

fixtures = [
    {
        "dt": "Property Setter",
        "filters": [
            [
                "name", "in", ["Quotation-order_type-options"]
            ]
        ]
    },
    {
        "dt": "Print Format",
        "filters": [
            [
                "name", "in", ["Statement of Work"]
            ]
        ]
    },
    {
        "dt": "Custom Field",
        "filters": [
            [
                "name", "in", ["Quotation-sow_items_html", "Quotation-sow_item"]
            ]
        ]
    }
]
