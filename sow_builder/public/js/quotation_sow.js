frappe.ui.form.on('Quotation', {
    refresh: function(frm) {
        render_sow_items(frm);
    },

    before_save: function(frm) {
        // Collect descriptions from all text editors and update the child table
        $('.sow-item-editor').each(function() {
            const editor_id = $(this).attr('id');
            const item_name = editor_id.replace('sow-item-editor-', '');
            const description = $(this).val(); // Get the current value
    
            // Find the corresponding item in the child table
            const existing_item = frm.doc.sow_item.find(item => item.name === item_name);
    
            if (existing_item) {
                // Update the child table item's description directly
                existing_item.description = description;
            }
        });
    
        // Explicitly refresh the child table field to ensure changes are saved
        frm.refresh_field('sow_item');
    },

    // Add a validation handler to ensure child table changes are detected
    validate: function(frm) {
        // Ensure child table items are not lost during validation
        frm.doc.sow_item = frm.doc.sow_item || [];
    }
});

function render_sow_items(frm) {
    const container = frm.fields_dict.sow_items_html.$wrapper;
    const sow_items = frm.doc.sow_item || [];
    container.empty();

    // Fetch all unique SoW Sections (even if no items exist)
    frappe.db.get_list('SoW Section', { fields: ['name'] }).then(sections => {
        if (sections.length === 0) {
            container.append('<p>No SoW Sections are available to add items to.</p>');
            return;
        }

        // Group SoW Items by their linked SoW Section
        const grouped_items = group_by_section(sow_items);
        sections.forEach(section => {
            const section_name = section.name;

            // Add the SoW Section Header
            const section_header_html = `<div class="control-label">${section_name}</div>`;
            container.append(section_header_html);

            // Create an indented container for the text box and button
            const indented_container = $('<div style="margin-left: 20px;"></div>');

            // Add SoW Items under this section (if any)
            const items = grouped_items[section_name] || [];
            items.forEach(item => {
                const editor_id = `sow-item-editor-${item.name}`;
                const editor_html = `
                    <div class="sow-item-container" style="margin-bottom: 15px; display: flex; align-items: center;">
                        <textarea id="${editor_id}" class="form-control sow-item-editor" style="flex: 1; margin-right: 10px;">${item.description || ''}</textarea>
                        <button class="btn btn-danger btn-sm sow-delete-item" data-item="${item.name}" style="padding: 2px 6px; font-size: 12px;">
                            X
                        </button>
                    </div>
                `;
                indented_container.append(editor_html);
            });

            // Add a "Create Item" button for this section
            const add_button_html = `
                <button class="btn btn-primary btn-sm sow-add-item" data-section="${section_name}" style="margin-top: 10px;">
                    Add Item to ${section_name}
                </button>
            `;
            indented_container.append(add_button_html);

            // Append the indented container to the main container
            container.append(indented_container);

            // Add whitespace after the section
            container.append('<div style="margin-bottom: 30px;"></div>');
        });

        // Bind the "Create Item" button click event
        container.find('.sow-add-item').on('click', function() {
            const section_name = $(this).data('section');
            create_sow_item(frm, section_name);
        });

        // Bind the "Delete Item" button click event
        container.find('.sow-delete-item').on('click', function() {
            const item_name = $(this).data('item');

            // Remove the item from the child table
            frm.doc.sow_item = frm.doc.sow_item.filter(item => item.name !== item_name);

            // Re-render the SoW Items
            render_sow_items(frm);

            // Mark form as dirty to save the changes
            frm.dirty();
        });

        // Add input event listener to mark form as dirty
        container.find('.sow-item-editor').on('input', function() {
            const editor_id = $(this).attr('id');
            const item_name = editor_id.replace('sow-item-editor-', '');

            // Find the corresponding item in the child table
            const existing_item = frm.doc.sow_item.find(item => item.name === item_name);

            if (existing_item) {
                existing_item.description = $(this).val();
                frm.dirty(); // Trigger form dirty state
            }
        });
    });
}

function create_sow_item(frm, section_name) {
    const new_item = frappe.model.add_child(frm.doc, 'SoW Item', 'sow_item');
    new_item.sow_section = section_name; // Link the new item to the section
    new_item.description = ''; // Default empty description

    // Find the last button for this section to insert before
    const container = frm.fields_dict.sow_items_html.$wrapper;
    const section_selector = `.sow-add-item[data-section="${section_name}"]`;
    const add_button = container.find(section_selector);

    // Create editor for the new item
    const editor_id = `sow-item-editor-${new_item.name}`;
    const editor_html = `
        <div>
            <textarea id="${editor_id}" class="form-control sow-item-editor"></textarea>
        </div>
    `;

    // Insert the new editor before the "Add Item" button
    add_button.before(editor_html);

    // Explicitly refresh the child table field
    frm.refresh_field('sow_item');
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