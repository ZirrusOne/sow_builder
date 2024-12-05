frappe.ui.form.on('Quotation', {
    refresh: function(frm) {
        render_sow_items(frm);
    },
    
    before_save: function (frm) {
        // Ensure each SoW Item in the child table is updated with its current description
        frm.doc.custom_sow_item.forEach(item => {
            const editor_control = editor_controls[item.name];
            if (editor_control) {
                const description = editor_control.get_value();
                item.description = description; // Save the rich text content
            }
        });

        // Refresh the child table field
        frm.refresh_field('custom_sow_item');
    },

    validate: function(frm) {
        // Ensure child table items are not lost during validation
        frm.doc.custom_sow_item = frm.doc.custom_sow_item || [];
    }
});

const editor_controls = {};

function render_sow_items(frm) {
    const container = frm.fields_dict.custom_sow_items_html.$wrapper;
    const sow_items = frm.doc.custom_sow_item || [];
    container.empty();

    // Fetch all unique SoW Sections and order by `order` field
    frappe.db.get_list('SoW Section', {
        fields: ['name', '`order`'], // Escape `order` field
        order_by: '`order` asc'      // Escape `order` field in sorting
    }).then(sections => {
        if (sections.length === 0) {
            container.append('<p>No SoW Sections are available to add items to.</p>');
            return;
        }

        // Group SoW Items by their linked SoW Section
        const grouped_items = group_by_section(sow_items);

        sections.forEach(section => {
            const section_name = section.name;

            // Create a container for this section
            const section_container = $(`
                <div class="section-container" style="margin-bottom: 30px;">
                    <div class="section-header" style="margin-bottom: 10px;">
                        <span class="control-label" style="margin-right: 8px;">${section_name}</span>
                        <button class="btn btn-success btn-sm sow-add-item" data-section="${section_name}" style="padding: 2px 6px; font-size: 12px; vertical-align: middle;">
                            +
                        </button>
                    </div>
                    <div class="sow-items-container" data-section="${section_name}" style="margin-left: 20px;"></div>
                </div>
            `);
            container.append(section_container);

            // Populate existing SoW Items under this section
            const items_container = section_container.find(`.sow-items-container[data-section="${section_name}"]`);
            const items = grouped_items[section_name] || [];
            items.forEach(item => {
                append_sow_item(items_container, item, frm); // Reinitialize with saved data
            });
        });

        // Bind the "+" button click event
        container.find('.sow-add-item').off('click').on('click', function () {
            const section_name = $(this).data('section');
            const items_container = container.find(`.sow-items-container[data-section="${section_name}"]`);

            // Add new SoW Item
            const new_item = create_sow_item(frm, section_name);

            // Render the new item directly in the items container
            append_sow_item(items_container, new_item, frm);

            // Mark form as dirty
            frm.dirty();
        });

        // Bind the "Delete Item" button click event
        bind_delete_button(frm);
    });
}

function append_sow_item(container, item, frm) {
    if (!item || !item.name) {
        console.error('Invalid item:', item);
        return;
    }

    const editor_id = `sow-item-editor-${item.name}`;
    const dropdown_id = `sow-item-template-${item.name}`;
    const delete_button_id = `sow-delete-${item.name}`;

    const item_html = `
        <div class="sow-item-container" style="margin-bottom: 20px; position: relative; display: flex; flex-direction: column; align-items: center; border: 1px solid #ddd; padding: 10px; border-radius: 5px;">
            <select id="${dropdown_id}" class="form-control sow-template-dropdown" style="margin-bottom: 10px; width: 100%;">
                <option value="">Select a template...</option>
            </select>
            <div id="${editor_id}" class="sow-item-rich-text" style="width: 100%;"></div>
            <button id="${delete_button_id}" class="btn btn-danger btn-sm sow-delete-item" data-item="${item.name}" 
                style="padding: 2px 6px; font-size: 12px; position: absolute; bottom: -15px; transform: translateX(-50%); left: 50%; border-radius: 50%;">
                X
            </button>
        </div>
    `;
    container.append(item_html);

    // Initialize Frappe's rich text editor
    const editor_control = frappe.ui.form.make_control({
        parent: `#${editor_id}`,
        df: {
            fieldtype: 'Text Editor',
            fieldname: `description-${item.name}`,
            label: 'Description',
            default: '', // Initialize empty first, then explicitly set value below
            onchange: (value) => {
                const existing_item = frm.doc.custom_sow_item.find(i => i.name === item.name);
                if (existing_item) {
                    existing_item.description = value; // Update the description in the child table
                }
                frm.dirty();
            }
        },
        render_input: true
    });

    // Explicitly set the saved description after initialization
    if (item.description) {
        editor_control.set_input(item.description);
    }

    // Save the editor control for later reference
    editor_controls[item.name] = editor_control;

    // Populate the dropdown with templates for the corresponding section
    frappe.db.get_list('SoW Item Template', {
        fields: ['name', 'description'],
        filters: { sow_section: item.sow_section }
    }).then(templates => {
        const dropdown = $(`#${dropdown_id}`);
        templates.forEach(template => {
            dropdown.append(`<option value="${template.name}">${template.name}</option>`);
        });
    });

    // Bind the dropdown change event
    $(`#${dropdown_id}`).on('change', function () {
        const selected_template_name = $(this).val();
        if (selected_template_name) {
            frappe.db.get_value('SoW Item Template', selected_template_name, 'description', ({ description }) => {
                editor_control.set_input(description);

                // Update the corresponding item in the child table
                const existing_item = frm.doc.custom_sow_item.find(i => i.name === item.name);
                if (existing_item) {
                    existing_item.description = description;
                }
                frm.dirty();
            });
        }
    });

    // Bind the delete button click event
    $(`#${delete_button_id}`).on('click', function () {
        const item_name = $(this).data('item');
        frm.doc.custom_sow_item = frm.doc.custom_sow_item.filter(i => i.name !== item_name);
        delete editor_controls[item_name]; // Remove the editor control reference
        render_sow_items(frm);
        frm.dirty();
    });
}

function bind_delete_button(frm) {
    $('.sow-delete-item').off('click').on('click', function () {
        const item_name = $(this).data('item');

        // Remove the item from the child table
        frm.doc.custom_sow_item = frm.doc.custom_sow_item.filter(item => item.name !== item_name);

        // Re-render the SoW Items
        render_sow_items(frm);

        // Mark form as dirty to save the changes
        frm.dirty();
    });
}   

function create_sow_item(frm, section_name) {
    // Create a new child item in the SoW Items child table
    const new_item = frappe.model.add_child(frm.doc, 'SoW Item', 'custom_sow_item');
    new_item.sow_section = section_name; // Link the new item to the section
    new_item.description = ''; // Default empty description

    // Refresh the field to reflect changes in the child table
    frm.refresh_field('custom_sow_item');

    // Return the newly created item
    return new_item;
}

function group_by_section(items) {
    const grouped = {};
    items.forEach(item => {
        const section_name = item.sow_section || 'Uncategorized';
        if (!grouped[section_name]) {
            grouped[section_name] = [];
        }
        grouped[section_name].push(item);
    });
    return grouped;
}
