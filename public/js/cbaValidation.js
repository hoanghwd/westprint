/**
 * Javascript for Canvas Border Automation
 *
 * Created By - Akshay Vaze (akshayvaze@gmail.com)
 * Created Date: 4/1/2014
 *
 * Modified By -
 * Modified Date:
 */

// Basic validation for the fields used on form
function validate_required(field)
{
  with (field)
  {
	  if (value=="")
	  {
		return false;
	  }
	  else
	  {
		return true;
	  }
   }
}

// Validate the CBA Page
function validate_form(thisform)
{
  with (thisform)
  {
        var alertTextBox = "Please select the location...";

        // Validate Location Selection
        if (validate_required(locId)==false)
        {				  
                alert(alertTextBox);
                return false;
        }
   }
}