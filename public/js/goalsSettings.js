function enableInputToUpdate(check_field, text_field, form_name, text_field2, text_field3) {

    if (document.forms[form_name][check_field].checked == true) {
        document.forms[form_name][text_field].disabled = "";
        document.forms[form_name][text_field].style.backgroundColor = "#FFF";
        document.forms[form_name][text_field2].disabled = "";
        document.forms[form_name][text_field2].style.backgroundColor = "#FFF";
        document.forms[form_name][text_field3].disabled = "";
        document.forms[form_name][text_field3].style.backgroundColor = "#FFF";
    } else {
        document.forms[form_name][text_field].disabled = "disable";
        document.forms[form_name][text_field].style.backgroundColor = "#C6CBCE";
        document.forms[form_name][text_field2].disabled = "disable";
        document.forms[form_name][text_field2].style.backgroundColor = "#C6CBCE";
        document.forms[form_name][text_field3].disabled = "disable";
        document.forms[form_name][text_field3].style.backgroundColor = "#C6CBCE";
    }


    return true;
}

function processBeforeSubmit(form_name) {

    document.forms[form_name]['workersText'].disabled = "";
    document.forms[form_name]['work_dayWeek'].disabled = "";
    document.forms[form_name]['work_hourWeek'].disabled = "";
    document.forms[form_name]['current_dailyGoal'].disabled = "";
    document.forms[form_name]['current_hourlyGoal'].disabled = "";
    document.forms[form_name]['batchFlag'].disabled = "";
    document.forms[form_name]['startHour'].disabled = "";
    document.forms[form_name]['startMin'].disabled = "";
    document.forms[form_name]['amOrPm'].disabled = "";
    document.forms[form_name].submit();

}