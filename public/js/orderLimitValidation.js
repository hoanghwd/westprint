/**
 * Javascript for Validating generic fields on form like text box, combo box, etc.
 *
 * Created By - Akshay Vaze (akshayvaze@gmail.com)
 * Created Date: 4/4/2014
 *
 * Modified By -
 * Modified Date:
 */

// Basic validation for the fields used on form
function validate_null(field)
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

// Validate the Set Order Limits form
function validate_form(thisform)
{
  with (thisform)
  {
        var alertSelectLocation = "Please select the location...";
        var alertEnterCapacity = "Please enter the capacity for selected location...";

        // Validate Location Selection
        if (validate_null(locId)==false)
        {				  
                alert(alertSelectLocation);
                return false;
        }
        
        // Validate Enter Capacity text field
        if (validate_null(capacity)==false)
        {				  
                alert(alertEnterCapacity);
                return false;
        }
   }
}