/**
 * Javascript for Item Pop-Up
 *
 * Created By - Akshay Vaze (akshayvaze@gmail.com)
 * Created Date: 3/13/2014
 *
 * Modified By -
 * Modified Date:
 */

// Validate the Item Pop-Up
function validate_itempopup(form)
{
  with (form)
  {
          // If zero is entered, alert user to enter appropriate value as zero is not allowed
	  if (validate_zero(qtToAdvance)==false)
	  {
		alert("Value can't be ZERO! Please enter appropraite value...");
		return false;
	  }
          
          // If nothing is entered, alert user to enter appropriate value as blank value is not allowed
	  if (validate_blank(qtToAdvance)==false)
	  {
		alert("Value can't be BLANK! Please enter appropraite value...");
		return false;
	  }
          
          // If quantity to advance entered by the user is greater than total item quantity, alert user to enter appropriate value
          if(validate_quantity(qtToAdvance, itemQuantity)==false)
          {
                alert("Value entered should be Less than or Equal to Total Item Quantity! Please enter appropriate value...");
                return false;
          }
  }
}

// Basic validation to check if zero is entered
function validate_zero(field)
{
  with (field)
  {
	  if (value=="0")
	  {
		return false;
	  }
	  else
	  {
		return true;
	  }
   }
}

// Basic validation to check if nothing is entered
function validate_blank(field)
{
  with (field)
  {
	  if (value==null||value=="")
	  {
		return false;
	  }
	  else
	  {
		return true;
	  }
   }
}

// Basic validation for quantity entered
function validate_quantity(field, itemQuantity)
{
  with (field)
  {
	  if (value!=itemQuantity)
	  {
		return false;
	  }
	  else
	  {
		return true;
	  }
   }
}

//Validation for Reason in holding
function validateHold(obj){
	
	if(obj.reason.value==""){
		alert("Please specify the Details.");
		return false;
	}else if (obj.reasonId.value=="None"){
		alert("Please specify the Reason.");
		return false;
	}else{
		return true;
	}
		
}

//Validation for Reason in holding
function validateUnhold(obj){
	
	if(obj.reason.value==""){
		alert("Please specify the Details.");
		return false;
	}else if (obj.reasonId.value=="None"){
		alert("Please specify the Reason.");
		return false;
	}else{
		return true;
	}
		
}


//Validation for Reprint
function validateReprint(obj){
	
	if(obj.moreDetails.value==""){
		alert("Please specify the Details.");
		return false;
	}else if (obj.reason.value=="None"){
		alert("Please specify the Reason.");
		return false;
	}else{	
		return true;
	}
		
}

//Validation for Move
function validateMove(obj){
	
	if(obj.department.value=="None"){
		alert("Please select a Department.");
		return false;
	}/*else if (obj.department.value==8 && obj.move_type.value==""){
		alert("Please select Move Type.");
		return false;
	}*/else if (obj.movingReason.value==""){
		alert("Please specify the Moving Reason.");
		return false;
	}else{
		return true;
	}
		
}

//Validation for Move
function selectType(obj){
	/*
	if(obj.value==8){
		document.getElementById('move_tye').innerHTML='<br>Move Type<br><select name="move_type"><option value="" ></option><option value="Return Package" >Return Package</option><option value="Other" >Other</option></select>';
	}else{
		document.getElementById('move_tye').innerHTML='';
	}
	*/
		
}


function updateHoldValues(obj){
	
	//alert(obj.value)
	var tmp = obj.options[obj.selectedIndex].text.split(' - ');
	
	//alert(tmp[0])
	//alert(tmp[1])
	document.getElementById('reasonGroup').value = tmp[0];
	document.getElementById('reasonType').value = tmp[1];
	
	if(document.getElementById('resetSLAFAKE')){
		if(tmp[0] == 'Customer Issues'){
			document.getElementById('resetSLAFAKE').checked  = true;
			document.getElementById('resetSLA').value  = 'on';
		}else{
			document.getElementById('resetSLAFAKE').checked  = false;
			document.getElementById('resetSLA').value  = '';
		}
	}	
	
}






