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

    // Fetch all unique SoW Sections (even if no items exist) and order by `order` field
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
                append_sow_item(items_container, item);
            });
        });

        // Bind the "+" button click event
        container.find('.sow-add-item').off('click').on('click', function () {
            const section_name = $(this).data('section');
            const items_container = container.find(`.sow-items-container[data-section="${section_name}"]`);

            // Add new SoW Item
            const new_item = create_sow_item(frm, section_name);

            // Render the new item directly in the items container
            append_sow_item(items_container, new_item);

            // Mark form as dirty
            frm.dirty();
        });

        // Bind the "Delete Item" button click event
        bind_delete_button(frm);

        // Add input event listener to mark form as dirty
        container.find('.sow-item-editor').on('input', function () {
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

function append_sow_item(container, item) {
    if (!item || !item.name) {
        console.error('Invalid item:', item);
        return; // Exit if the item is invalid
    }

    const editor_id = `sow-item-editor-${item.name}`;
    const item_html = `
        <div class="sow-item-container" style="margin-bottom: 15px; display: flex; align-items: center;">
            <textarea id="${editor_id}" class="form-control sow-item-editor" style="flex: 1; margin-right: 10px;">${item.description || ''}</textarea>
            <button class="btn btn-danger btn-sm sow-delete-item" data-item="${item.name}" style="padding: 2px 6px; font-size: 12px;">
                X
            </button>
        </div>
    `;
    container.append(item_html);
}

function bind_delete_button(frm) {
    $('.sow-delete-item').off('click').on('click', function () {
        const item_name = $(this).data('item');

        // Remove the item from the child table
        frm.doc.sow_item = frm.doc.sow_item.filter(item => item.name !== item_name);

        // Re-render the SoW Items
        render_sow_items(frm);

        // Mark form as dirty to save the changes
        frm.dirty();
    });
}   

function create_sow_item(frm, section_name) {
    // Create a new child item in the SoW Items child table
    const new_item = frappe.model.add_child(frm.doc, 'SoW Item', 'sow_item');
    new_item.sow_section = section_name; // Link the new item to the section
    new_item.description = ''; // Default empty description

    // Refresh the field to reflect changes in the child table
    frm.refresh_field('sow_item');

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