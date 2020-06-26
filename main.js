// global variable or states used in the app

// used to save tab: [...tab content]
let main_page_data = {
    "1": [{
        session_date: "2020-06-06",
        session_description: "Description",
        session_from: "15:10",
        session_name: "Name",
        session_to: "15:10",
    }, ],
};

// denotes which tab is currently open | used to render the FE accordingly
let currently_active_top_tab = "1";

// used for update and add functionality
// if null, considered as add operation
// if tab content data is there, considered as update
let add_update_model_data = null;

// function used to reinit the app based on the toggled tabs
// this is called every time any change is made or added
function initPageElements() {
    renderTopTabs();
    renderTabContents();
    mapEventsToElements();
}

// renders the top tabs based on `main_page_data`
function renderTopTabs() {
    let add_tabs_button = `<li id="add_top_tabs_button"><a><button class="btn btn-success">+</button></a></li>`;
    $("#top_tabs_holder").empty();

    $.each(main_page_data, function (tab_id, tab_content) {
        let element_to_insert = `<li id="tabtop-${tab_id}" key="${tab_id}" class="${
      tab_id === currently_active_top_tab && "active"
    } top_tab_button"><a data-toggle="tab">TabTop - ${tab_id} <button key="${tab_id}" class="btn btn-danger top_tab_delete_button">-</button></a></li>`;
        $("#top_tabs_holder").append(element_to_insert);
    });

    $("#top_tabs_holder").append(add_tabs_button);
}

// render the inner tab contents based on `currently_active_top_tab` and `main_page_data`
function renderTabContents() {
    // show or hide the button
    if (currently_active_top_tab === null) {
        $("#add_tab_content_button").css("display", "none");
    } else {
        $("#add_tab_content_button").css("display", "block");
    }

    let tab_to_render = currently_active_top_tab;

    // empty children each time
    let html_tab_container = $("#tab_content_container");
    html_tab_container.empty();

    if (tab_to_render === null) {
        // break out of the function if no tabs are active to render
        return null;
    }

    // tab content under the currently active tab
    let tab_content = main_page_data[tab_to_render];

    tab_content.forEach((element, index) => {
        // h4 content
        let inner_content = ``;
        $.each(element, function (key, value) {
            inner_content += `<h4 class="${key}">${key}: ${value}</h4>`;
        });
        // append data to html body`
        let tab_single_content = `
        <div key="${index}" class="tab_content_holder draggable" draggable="true">
            ${inner_content}
            <div class="actions">
                <button tabKey="${tab_to_render}" tabContentKey="${index}" class="btn btn-primary edit_tab_single_content">Edit</button>
                <button tabKey="${tab_to_render}" tabContentKey="${index}" class="btn btn-primary move_tab_single_content">Drag & Drop</button>
                <button tabKey="${tab_to_render}" tabContentKey="${index}" class="btn btn-primary delete_tab_single_content">Delete</button>
            </div>
        </div>
        `;
        html_tab_container.append(tab_single_content);
    });
}

// based on the value given in `add_update_model_data`
// initiates the update & add model everytime it is opened
function reinitAddUpdateModelValues() {
    let model_data = add_update_model_data;

    if (model_data === null) {
        // add operation
        $("#add_update_model_main_content input").val("");
        $("#add_update_model_main_content textarea").val("");
    } else {
        // update operation
        $.each(model_data, function (input_key, intput_value) {
            $("#add_update_model_main_content input").each((index, element) => {
                if (element.name === input_key.toString()) {
                    element.value = intput_value;
                }
            });
            $("#add_update_model_main_content textarea").each((index, element) => {
                if (element.name === input_key.toString()) {
                    element.value = intput_value;
                }
            });
        });
    }
}

window.onload = function () {
    // init the entire page on window load
    initPageElements();
};

// Drag & Drop Functionality

// on drag start, set the element id that is being dragged
function dragStart(e) {
    window.dragged_element_index = $(this).attr("key");
}

// some dummy function
function dragLeave(e) {
    e.stopPropagation();
}

// some dummy function
function dragOver(e) {
    e.preventDefault();
    return false;
}

// on drop, get the dragged element and the
// element upon which it is dropped if both the id's are not
// the same, switch the position of the two elemets
function dragDrop(e) {
    let dropped_element_index = $(this).attr("key");

    if (
        window.dragged_element_index.toString() !== dropped_element_index.toString()
    ) {
        let dropped_data =
            main_page_data[currently_active_top_tab.toString()][
                dropped_element_index
            ];
        let dragged_data =
            main_page_data[currently_active_top_tab.toString()][
                dragged_element_index
            ];

        main_page_data[currently_active_top_tab.toString()][
            dropped_element_index
        ] = dragged_data;
        main_page_data[currently_active_top_tab.toString()][
            dragged_element_index
        ] = dropped_data;

        // at this point `main_page_data` will be properly arranged but the page will not be
        // reinit page to render page accordingly
        initPageElements();
    }

    return false;
}

// Visit for drag drop example
// https://webdevtrick.com/html-drag-and-drop-list/


// Event Listeners Mapping | this is put in a function and is called each time because,
// when every you delete and push an element again, the listner wont work, and has to be called again
// Note: the listners are set only on first time, so call them everytime to map the listners
function mapEventsToElements() {

    // add new top tabs button
    $("#add_top_tabs_button").click(function () {
        let next_tab_key_int = Object.keys(main_page_data).length + 1
        let next_tab_key_str = next_tab_key_int.toString()
        main_page_data[next_tab_key_str] = []

        if (currently_active_top_tab === null) {
            currently_active_top_tab = next_tab_key_str
        }

        initPageElements()
    })

    // toggle top tabs button
    $(".top_tab_button").click(function () {
        let tab_key = $(this).attr("key")
        currently_active_top_tab = tab_key

        initPageElements()
    })

    // delete top tabs button
    $(".top_tab_delete_button").click(function () {
        let to_delete_tab_key_str = $(this).attr("key").toString()

        if (currently_active_top_tab === to_delete_tab_key_str) {
            currently_active_top_tab = null
        }

        let after_deleted_main_page_data = {}
        let data_index = 1
        $.each(main_page_data, function (tab_id, tab_content) {
            if (tab_id !== to_delete_tab_key_str) {
                after_deleted_main_page_data[data_index.toString()] = tab_content
                data_index += 1
            }
        });
        main_page_data = after_deleted_main_page_data

        // remove tab and rerender tab content
        initPageElements()
    })

    // add a new tab/section content under an active tab | note: `currently_active_top_tab`
    // is used to map to which tab the data is added
    $("#add_tab_content_button").click(function () {
        add_update_model_data = null
        reinitAddUpdateModelValues()
        $("#add_update_model").modal('show')
    })

    // delete a tab content or a tab section | note: inorder for this operation
    // you need both the tabKey and the tabContentIndex | which are passed on create
    $(".delete_tab_single_content").click(function () {
        let clicked_ele = $(this)
        let tab_id = clicked_ele.attr("tabKey")
        let tabContent_id = clicked_ele.attr("tabContentKey")

        let tab_content_data = main_page_data[tab_id.toString()]
        let new_tab_content_data = []

        tab_content_data.forEach((element, index) => {
            if (index.toString() !== tabContent_id.toString()) {
                new_tab_content_data.push(element)
            }
        })

        main_page_data[tab_id.toString()] = new_tab_content_data

        initPageElements()
    })

    // edit a single tab content data => set the `add_update_model_data`
    // note: also set `tab_id` & `tab_content_id` => to understand which place has to be replaced or edited
    $(".edit_tab_single_content").click(function () {
        let clicked_ele = $(this)
        let tab_id = clicked_ele.attr("tabKey")
        let tabContent_id = clicked_ele.attr("tabContentKey")

        let editable_data = main_page_data[tab_id.toString()][tabContent_id]
        editable_data['tab_id'] = tab_id.toString()
        editable_data['tab_content_id'] = tabContent_id.toString()

        add_update_model_data = editable_data
        reinitAddUpdateModelValues()
        $("#add_update_model").modal('show')

    })

    // on add_update model form submit | get the data, add it or edit it
    $('#add_update_model_submit_form').on('submit', function (e) {
        $("#add_update_model").modal('hide')
        e.preventDefault()
        e.stopImmediatePropagation();
        e.stopPropagation();

        let saved_data = {}

        $("#add_update_model_main_content input").each((index, element) => {
            saved_data[element.name] = element.value
        })

        $("#add_update_model_main_content textarea").each((index, element) => {
            saved_data[element.name] = element.value
        })

        // get data, save it and render tab content
        if (add_update_model_data === null) {
            // add function
            main_page_data[currently_active_top_tab].push(saved_data)
        } else {
            // update function
            let tab_id = add_update_model_data['tab_id']
            let tab_content_id = add_update_model_data['tab_content_id']

            main_page_data[tab_id.toString()][tab_content_id] = saved_data
        }

        initPageElements()

    });

    // drag & drop

    [].forEach.call($(".draggable"), function (item) {
        item.addEventListener('dragstart', dragStart, false);
        item.addEventListener('dragover', dragOver, false);
        item.addEventListener('dragleave', dragLeave, false);
        item.addEventListener('drop', dragDrop, false);
    });

    // ... add other events handlers here
}
