/**
 *
 * @param name
 * @returns {string|boolean}
 */
function getCookie(name) {
    let content = "; " + document.cookie;
    let parts = content.split("; " + name + "=");
    if (parts.length == 2) {
        return parts.pop().split(";").shift();
    }
    else {
        return false;
    }
}

/**
 *
 * @param cookie_name
 * @param cookie_value
 * @param expiration_days
 */
function setCookie(cookie_name, cookie_value, expiration_days) {
    let datetoExpire = new Date();
    datetoExpire.setTime(datetoExpire.getTime() + (expiration_days * 24 * 60 * 60 * 1000));
    let cookieExpires = "expires=" + datetoExpire.toUTCString();
    document.cookie = cookie_name + "=" + cookie_value + "; " + cookieExpires + ";path=/;";
}

function autoSuggestAjax() {
    let searchByKeyWord = $('#searchByKeyWord').val();

    loadSearchAutoSuggestion(searchByKeyWord);
}

/**
 *
 * @param searchSelectOption
 * @param boxNumber
 */
function loadSearchAutoSuggestion(searchByKeyWord) {
    let whatToSearch = document.getElementById('whatToSearch');

    //For gallery->H.D | SYN->owner
    if (searchByKeyWord == 'username') {
        autocompleteHeader(whatToSearch, clientsListsGlobalSearch);
    }
    else {
        autocompleteHeader(whatToSearch, '');
    }
}

function autocompleteHeader(inp, arr) {
    // The autocomplete function takes two arguments, the text field element and an array of possible autocompleted values:
    var currentFocus;

    // Execute a function when someone writes in the text field:
    inp.addEventListener("input", function (e) {
        var a, b, i, val = this.value;

        // Close any already open lists of autocompleted values
        closeAllLists();

        if (!val) {
            return false;
        }
        currentFocus = -1;

        // Create a DIV element that will contain the items (values):
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");

        //alert ( $("select#searchSelection2 option").filter(":selected").val() );

        a.setAttribute("class", "autocomplete-items");

        // Append the DIV element as a child of the autocomplete container:
        this.parentNode.appendChild(a);

        for (i = 0; i < arr.length; i++) {
            // Check if the item starts with the same letters as the text field value:
            if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                // Create a DIV element for each matching element:
                b = document.createElement("DIV");
                // Make the matching letters bold:
                b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                b.innerHTML += arr[i].substr(val.length);
                // Insert a input field that will hold the current array item's value:
                b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                // Execute a function when someone clicks on the item value (DIV element):
                b.addEventListener("click", function (e) {
                    // Insert the value for the autocomplete text field:*/
                    inp.value = this.getElementsByTagName("input")[0].value;
                    // Close the list of autocompleted values, (or any other open lists of autocompleted values:
                    closeAllLists();
                });
                a.appendChild(b);
            }
        }
    });

    // Execute a function presses a key on the keyboard:
    inp.addEventListener("keydown", function (e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        //alert(this.id + "autocomplete-list");
        //console.log(this.id + "autocomplete-list");
        //console.log(e.keyCode);

        if (x) x = x.getElementsByTagName("div");

        if (e.keyCode == 40) {
            // If the arrow DOWN key is pressed, increase the currentFocus variable:
            currentFocus++;
            // And make the current item more visible:
            console.log(x);
            addActive(x);
        } else if (e.keyCode == 38) {
            // If the arrow UP key is pressed, decrease the currentFocus variable:
            currentFocus--;
            // And make the current item more visible:
            addActive(x);
        } else if (e.keyCode == 13) {
            e.preventDefault();

            if (currentFocus > -1) {
                // And simulate a click on the "active" item:
                if (x) x[currentFocus].click();
            }
        }
    });

    function addActive(x) {
        // A function to classify an item as "active":
        if (!x) return false;
        // Start by removing the "active" class on all items:
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        // Add class "autocomplete-active":
        x[currentFocus].classList.add("autocomplete-active");
    }

    function removeActive(x) {
        // A function to remove the "active" class from all autocomplete items:
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }

    function closeAllLists(elmnt) {
        // Close all autocomplete lists in the document, except the one passed as an argument:
        var x = document.getElementsByClassName("autocomplete-items");

        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }

    // Execute a function when someone clicks in the document:
    document.addEventListener('click', function (e) {
        closeAllLists(e.target);
    });
}

/**
 *
 * @returns {boolean}
 */
function onSubmitGlobalSearch() {
    let whatToSearch = $('#whatToSearch').val();
    if (whatToSearch == '') {
        openAlert('Please provide search value');
    }
    else {
        $('#form_global_search').submit();
    }
    return false;
}

function setWhereToSearchCookie() {
    let whereToSearchCookie = "search_in"; //This will define if we should set HD or SYN in main dropbox
    let cookieInitialValues = "inSYN"; // Let's set HD as default
    setCookie(whereToSearchCookie, cookieInitialValues, 360);
}

function setDropDownValues(ob) {
    let whereToSearchCookie = "search_in"; //This will define if we should set HD or SYN in main dropbox
    let whereToSearchCookieValue = $("#whereToSearch").val(); // Let's set HD as default
    setCookie(whereToSearchCookie, whereToSearchCookieValue, 360);
}

function setGlobalSearchOnDrops() {
    //Search In
    let whereToSearchCookie = "search_in"; //This will define if we should set HD or SYN in main dropbox
    let whereToSearchCookieValue = getCookie(whereToSearchCookie);

    //Let's try to read the boss cookie and in case of it doesn't exist let's create it!
    if (whereToSearchCookieValue == false) {
        setWhereToSearchCookie();
    }
    else {
        $('#whereToSearch').val(whereToSearchCookieValue);
    }

    //Search By keyword
    let searchByKeyWordCookie = "search_by_keyword";
    let searchByKeyWordCookieValue = getCookie(searchByKeyWordCookie);

    if (searchByKeyWordCookieValue == false) {
        setCookie(searchByKeyWordCookie, 'username', 360);
    }
    else {
        $('#searchByKeyWord').val(searchByKeyWordCookieValue);
    }
}

function manageSearchKeyWordCookie() {
    let searchByKeyWordCookie = "search_by_keyword";
    let searchByKeyWordValue = $('#searchByKeyWord').val();

    setCookie(searchByKeyWordCookie, searchByKeyWordValue, 360);
}