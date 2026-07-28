/**
 * Javascript for Shipping GUI
 *
 * Created By - Akshay Vaze (akshayvaze@gmail.com)
 * Created Date: 2/21/2014
 *
 * Modified By - Akshay Vaze (akshayvaze@gmail.com)
 * Modified Date: 2/24/2014
 */

// Basic validation for the fields used on form, allow zero value
function validate_required_allow_zero(field)
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

// Basic validation for the fields used on form
function validate_required(field)
{
  with (field)
  {
	  if (value==null||value==""||value==0)
	  {
		return false;
	  }
	  else
	  {
		return true;
	  }
   }
}

// Validate the Shipping Pop-Up before completing the order
function validate_form(thisform)
{
  with (thisform)
  {
	  var alertTextBox = "Atleast 1 box must be filled out!";
	  var alertTextWeight = "Weight must be filled out!";
	  var alertTextBaseCost = "Base Cost must be filled out!";
	  var alertTextTrackingNumber = "Tracking Number must be filled out!";
	  var alertTextCarrierShipping = "Please select the carrier and shipping service!";
	  var alertWholeBox = "Please fill out all shipping details of the box selected";
	  var alertWholeCustomBox = "Please fill out all shipping details of the custom box entered";
	  var alertStandardBoxForCustomBox = "Please select the standard boxes for the custom box entered";
          var alertQuantity = "Please select the quantity of standard boxes used to build the custom box";
	  /*
	  // Validate Box Dimensions - Atleast one box should be filled to complete the shipment
	  if (validate_required(box1)==false && 
		  (validate_required(customLength1)==false || 
		   validate_required(customWidth1)==false || 
		   validate_required(customHeight1)==false
		   )
		  )
	  {
		  alert(alertTextBox);
		  return false;
	  }
	  
	  // Validate Box Weight - Atleast weight of one box must be filled to complete the shipment
	  if (validate_required(weight1)==false && 
		  validate_required(customWeight1)==false)
	  {
		  alert(alertTextWeight);
		  return false;
	  }
	  
	  // Validate Base Cost
	  if (validate_required_allow_zero(baseCost1)==false &&
		  validate_required_allow_zero(customBaseCost1)==false)
	  {				  
		  alert(alertTextBaseCost);
		  return false;
	  }
	  
	  // Validate Tracking Number(s)
	  if (validate_required(trackingNumber1)==false &&
		  validate_required(customTrackingNumber1)==false)
	  {				  
		  alert(alertTextTrackingNumber);
		  return false;
	  }
	  */
	 
	  // If BOX 1 is selected, validate all the other details for that box
	  if (validate_required(box1)==true && 
		  (validate_required(weight1)==false || 
		   validate_required_allow_zero(baseCost1)==false || 
		   validate_required(trackingNumber1)==false
		   )
		  )
	  {
		  alert(alertWholeBox);
		  return false;
	  }
	  
	  // If BOX 2 is selected, validate all the other details for that box
	  if (validate_required(box2)==true && 
		  (validate_required(weight2)==false || 
		   validate_required_allow_zero(baseCost2)==false || 
		   validate_required(trackingNumber2)==false
		   )
		  )
	  {
		  alert(alertWholeBox);
		  return false;
	  }
	  
	  // If BOX 3 is selected, validate all the other details for that box
	  if (validate_required(box3)==true && 
		  (validate_required(weight3)==false || 
		   validate_required_allow_zero(baseCost3)==false || 
		   validate_required(trackingNumber3)==false
		   )
		  )
	  {
		  alert(alertWholeBox);
		  return false;
	  }
	  
	  // If BOX 4 is selected, validate all the other details for that box
	  if (validate_required(box4)==true && 
		  (validate_required(weight4)==false || 
		   validate_required_allow_zero(baseCost4)==false || 
		   validate_required(trackingNumber4)==false
		   )
		  )
	  {
		  alert(alertWholeBox);
		  return false;
	  }
	  
	  // If BOX 5 is selected, validate all the other details for that box
	  if (validate_required(box5)==true && 
		  (validate_required(weight5)==false || 
		   validate_required_allow_zero(baseCost5)==false || 
		   validate_required(trackingNumber5)==false
		   )
		  )
	  {
		  alert(alertWholeBox);
		  return false;
	  }
	  
	  // If CUSTOM BOX 1 is selected, validate all the other details for that box
	  if ((validate_required(customLength1)==true || 
		   validate_required(customWidth1)==true || 
		   validate_required(customHeight1)==true) && 
		  (validate_required(customWeight1)==false || 
		   validate_required_allow_zero(customBaseCost1)==false || 
		   validate_required(customTrackingNumber1)==false
		   )
		  )
	  {
		  alert(alertWholeCustomBox);
		  return false;
	  }
	  
          if((validate_required(stdbox1)==true || validate_required(stdbox2) == true || validate_required(stdbox3)== true || 
                  validate_required(stdbox4)==true || validate_required(stdbox5)==true) && 
                  validate_required(customLength1)==false)
          {
              alert(alertWholeCustomBox);
              return false;
          }
          
          if((validate_required(customLength1)==true && validate_required(customWidth1)==true && 
                  validate_required(customHeight1)==true && validate_required(customWeight1)==true && 
                  validate_required(customBaseCost1)==true && validate_required(customSurchargeCost1)==true && 
                  validate_required(customTotalCost1)==true && validate_required(customTrackingNumber1)==true)&& 
                  (validate_required(stdbox1)==false && validate_required(stdbox2)==false &&
                  validate_required(stdbox3)==false && validate_required(stdbox4)==false &&
                  validate_required(stdbox5)==false ))
          {
              alert(alertStandardBoxForCustomBox);
              return false;
          }
          
	  // If CUSTOM BOX 2 is selected, validate all the other details for that box
	  if ((validate_required(customLength2)==true || 
		   validate_required(customWidth2)==true || 
		   validate_required(customHeight2)==true) && 
		  (validate_required(customWeight2)==false || 
		   validate_required_allow_zero(customBaseCost2)==false || 
		   validate_required(customTrackingNumber2)==false
		   )
		  )
	  {
		  alert(alertWholeCustomBox);
		  return false;
	  }
	  
          if((validate_required(stdbox6)==true || validate_required(stdbox7) == true || validate_required(stdbox8)== true || 
                  validate_required(stdbox9)==true || validate_required(stdbox10)==true) && 
                  validate_required(customLength2)==false)
          {
              alert(alertWholeCustomBox);
              return false;
          }
          
          if((validate_required(customLength2)==true && validate_required(customWidth2)==true && 
                  validate_required(customHeight2)==true && validate_required(customWeight2)==true && 
                  validate_required(customBaseCost2)==true && validate_required(customSurchargeCost2)==true && 
                  validate_required(customTotalCost2)==true && validate_required(customTrackingNumber2)==true)&& 
                  (validate_required(stdbox6)==false && validate_required(stdbox7)==false &&
                  validate_required(stdbox8)==false && validate_required(stdbox9)==false &&
                  validate_required(stdbox10)==false ))
          {
              alert(alertStandardBoxForCustomBox);
              return false;
          }
        
          
	  // If CUSTOM BOX 3 is selected, validate all the other details for that box
	  if ((validate_required(customLength3)==true || 
		   validate_required(customWidth3)==true || 
		   validate_required(customHeight3)==true) && 
		  (validate_required(customWeight3)==false || 
		   validate_required_allow_zero(customBaseCost3)==false || 
		   validate_required(customTrackingNumber3)==false
		   )
		  )
	  {
		  alert(alertWholeCustomBox);
		  return false;
	  }
	  
          if((validate_required(stdbox11)==true || validate_required(stdbox12) == true || validate_required(stdbox13)== true || 
                  validate_required(stdbox14)==true || validate_required(stdbox15)==true) && 
                  validate_required(customLength3)==false)
          {
              alert(alertWholeCustomBox);
              return false;
          }
          
          if((validate_required(customLength3)==true && validate_required(customWidth3)==true && 
                  validate_required(customHeight3)==true && validate_required(customWeight3)==true && 
                  validate_required(customBaseCost3)==true && validate_required(customSurchargeCost3)==true && 
                  validate_required(customTotalCost3)==true && validate_required(customTrackingNumber3)==true)&& 
                  (validate_required(stdbox11)==false && validate_required(stdbox12)==false &&
                  validate_required(stdbox13)==false && validate_required(stdbox14)==false &&
                  validate_required(stdbox15)==false ))
          {
              alert(alertStandardBoxForCustomBox);
              return false;
          }
          
	  // If CUSTOM BOX 4 is selected, validate all the other details for that box
	  if ((validate_required(customLength4)==true || 
		   validate_required(customWidth4)==true || 
		   validate_required(customHeight4)==true) && 
		  (validate_required(customWeight4)==false || 
		   validate_required_allow_zero(customBaseCost4)==false || 
		   validate_required(customTrackingNumber4)==false
		   )
		  )
	  {
		  alert(alertWholeCustomBox);
		  return false;
	  }
	  
          if((validate_required(stdbox16)==true || validate_required(stdbox17) == true || validate_required(stdbox18)== true || 
                  validate_required(stdbox19)==true || validate_required(stdbox20)==true) && 
                  validate_required(customLength4)==false)
          {
              alert(alertWholeCustomBox);
              return false;
          }
          
          if((validate_required(customLength4)==true && validate_required(customWidth4)==true && 
                  validate_required(customHeight4)==true && validate_required(customWeight4)==true && 
                  validate_required(customBaseCost4)==true && validate_required(customSurchargeCost4)==true && 
                  validate_required(customTotalCost4)==true && validate_required(customTrackingNumber4)==true)&& 
                  (validate_required(stdbox16)==false && validate_required(stdbox17)==false &&
                  validate_required(stdbox18)==false && validate_required(stdbox19)==false &&
                  validate_required(stdbox20)==false ))
          {
              alert(alertStandardBoxForCustomBox);
              return false;
          }
          
	  // If CUSTOM BOX 5 is selected, validate all the other details for that box
	  if ((validate_required(customLength5)==true || 
		   validate_required(customWidth5)==true || 
		   validate_required(customHeight5)==true) && 
		  (validate_required(customWeight5)==false || 
		   validate_required_allow_zero(customBaseCost5)==false || 
		   validate_required(customTrackingNumber5)==false
		   )
		  )
	  {
		  alert(alertWholeCustomBox);
		  return false;
	  }
	  
          if((validate_required(stdbox21)==true || validate_required(stdbox22) == true || validate_required(stdbox23)== true || 
                  validate_required(stdbox24)==true || validate_required(stdbox25)==true) && 
                  validate_required(customLength5)==false)
          {
              alert(alertWholeCustomBox);
              return false;
          }
          
          if((validate_required(customLength5)==true && validate_required(customWidth5)==true && 
                  validate_required(customHeight5)==true && validate_required(customWeight5)==true && 
                  validate_required(customBaseCost5)==true && validate_required(customSurchargeCost5)==true && 
                  validate_required(customTotalCost5)==true && validate_required(customTrackingNumber5)==true)&& 
                  (validate_required(stdbox21)==false && validate_required(stdbox22)==false &&
                  validate_required(stdbox23)==false && validate_required(stdbox24)==false &&
                  validate_required(stdbox25)==false ))
          {
              alert(alertStandardBoxForCustomBox);
              return false;
          }
          
	  // Validate Box Dimensions - Atleast one box should be filled to complete the shipment
	  if (validate_required(box1)==false && 
		  (validate_required(customLength1)==false || 
		   validate_required(customWidth1)==false || 
		   validate_required(customHeight1)==false
		   )
		  )
	  {
		  alert(alertTextBox);
		  return false;
	  }
	  
	  // Validate Carrier + Shipping Service selected
	  if (validate_required(carrier_id_and_shipping_service_id)==false)
	  {				  
		  alert(alertTextCarrierShipping);
		  return false;
	  }
	   if((validate_required(stdbox1)==true && validate_required(qt1)==false)|| (validate_required(stdbox2)==true && validate_required(qt2)==false)||
                   (validate_required(stdbox3)==true && validate_required(qt3)==false)||(validate_required(stdbox4)==true && validate_required(qt4)==false)||
                   (validate_required(stdbox5)==true && validate_required(qt5)==false)||(validate_required(stdbox6)==true && validate_required(qt6)==false)||
                   (validate_required(stdbox7)==true && validate_required(qt7)==false)||(validate_required(stdbox8)==true && validate_required(qt8)==false)||
                   (validate_required(stdbox9)==true && validate_required(qt9)==false)||(validate_required(stdbox10)==true && validate_required(qt10)==false)||
                   (validate_required(stdbox11)==true && validate_required(qt11)==false)||(validate_required(stdbox12)==true && validate_required(qt12)==false)||
                   (validate_required(stdbox13)==true && validate_required(qt13)==false)||(validate_required(stdbox14)==true && validate_required(qt14)==false)||
                   (validate_required(stdbox15)==true && validate_required(qt15)==false)||(validate_required(stdbox16)==true && validate_required(qt16)==false)||
                   (validate_required(stdbox17)==true && validate_required(qt17)==false)||(validate_required(stdbox18)==true && validate_required(qt18)==false)||
                   (validate_required(stdbox19)==true && validate_required(qt19)==false)||(validate_required(stdbox20)==true && validate_required(qt20)==false)||
                   (validate_required(stdbox21)==true && validate_required(qt21)==false)||(validate_required(stdbox22)==true && validate_required(qt22)==false)||
                   (validate_required(stdbox23)==true && validate_required(qt23)==false)||(validate_required(stdbox24)==true && validate_required(qt24)==false)||
                   (validate_required(stdbox25)==true && validate_required(qt25)==false))
        {  
            alert(alertQuantity);
            return false;
        }
	  // Confirm from the user if this order really needs to be shipped?
	  var x;
 	  var result = confirm(shippingAlertDialogBox);
	
	  if (result)
	  {
		  return true;
	  }
	  else
	  {
		  return false;
	  }
	  
   }
}

// Box 1

function calctotal1() 
{
  var baseCost = $('#baseCost1').val();
  var baseCostValue = parseFloat(baseCost) || 0;
  
  var surchargeCost = $('#surchargeCost1').val();
  var surchargeCostValue = parseFloat(surchargeCost) || 0;
  
  //$('#totalCost1').val('$' + (baseCostValue + surchargeCostValue).toFixed(2));
  $('#totalCost1').val((baseCostValue + surchargeCostValue).toFixed(2));
}

$(document).ready(function() 
	{
	  $('#baseCost1').keyup(function(event) 
			{ calctotal1(); } 
		);
	  
	  $('#surchargeCost1').keyup(function(event) 
			{ calctotal1(); } 
		);
	
	  $('#baseCost1, #surchargeCost1').change(function(event) 
			{ calctotal1(); } 
		);
	} 
);

// Box 2

function calctotal2() 
{
  var baseCost = $('#baseCost2').val();
  var baseCostValue = parseFloat(baseCost) || 0;
  
  var surchargeCost = $('#surchargeCost2').val();
  var surchargeCostValue = parseFloat(surchargeCost) || 0;
  
  $('#totalCost2').val((baseCostValue + surchargeCostValue).toFixed(2));
}

$(document).ready(function() 
	{
	  $('#baseCost2').keyup(function(event) 
			{ calctotal2(); } 
		);
	  
	  $('#surchargeCost2').keyup(function(event) 
			{ calctotal2(); } 
		);
	
	  $('#baseCost2, #surchargeCost2').change(function(event) 
			{ calctotal2(); } 
		);
	} 
);

// Box 3 

function calctotal3() 
{
  var baseCost = $('#baseCost3').val();
  var baseCostValue = parseFloat(baseCost) || 0;
  
  var surchargeCost = $('#surchargeCost3').val();
  var surchargeCostValue = parseFloat(surchargeCost) || 0;
  
  $('#totalCost3').val((baseCostValue + surchargeCostValue).toFixed(2));
}

$(document).ready(function() 
	{
	  $('#baseCost3').keyup(function(event) 
			{ calctotal3(); } 
		);
	  
	  $('#surchargeCost3').keyup(function(event) 
			{ calctotal3(); } 
		);
	
	  $('#baseCost3, #surchargeCost3').change(function(event) 
			{ calctotal3(); } 
		);
	} 
);

// Box 4

function calctotal4() 
{
  var baseCost = $('#baseCost4').val();
  var baseCostValue = parseFloat(baseCost) || 0;
  
  var surchargeCost = $('#surchargeCost4').val();
  var surchargeCostValue = parseFloat(surchargeCost) || 0;
  
  $('#totalCost4').val((baseCostValue + surchargeCostValue).toFixed(2));
}

$(document).ready(function() 
	{
	  $('#baseCost4').keyup(function(event) 
			{ calctotal4(); } 
		);
	  
	  $('#surchargeCost4').keyup(function(event) 
			{ calctotal4(); } 
		);
	
	  $('#baseCost4, #surchargeCost4').change(function(event) 
			{ calctotal4(); } 
		);
	} 
);

// Box 5

function calctotal5() 
{
  var baseCost = $('#baseCost5').val();
  var baseCostValue = parseFloat(baseCost) || 0;
  
  var surchargeCost = $('#surchargeCost5').val();
  var surchargeCostValue = parseFloat(surchargeCost) || 0;
  
  $('#totalCost5').val((baseCostValue + surchargeCostValue).toFixed(2));
}

$(document).ready(function() 
	{
	  $('#baseCost5').keyup(function(event) 
			{ calctotal5(); } 
		);
	  
	  $('#surchargeCost5').keyup(function(event) 
			{ calctotal5(); } 
		);
	
	  $('#baseCost5, #surchargeCost5').change(function(event) 
			{ calctotal5(); } 
		);
	} 
);


// Custom Box 1

function customCalctotal1()
{
  var baseCost = $('#customBaseCost1').val();
  var baseCostValue = parseFloat(baseCost) || 0;
  
  var surchargeCost = $('#customSurchargeCost1').val();
  var surchargeCostValue = parseFloat(surchargeCost) || 0;
  
  $('#customTotalCost1').val((baseCostValue + surchargeCostValue).toFixed(2));
}

$(document).ready(function() 
	{
	  $('#customBaseCost1').keyup(function(event) 
			{ customCalctotal1(); } 
		);
	  
	  $('#customSurchargeCost1').keyup(function(event) 
			{ customCalctotal1(); } 
		);
	
	  $('#customBaseCost1, #customSurchargeCost1').change(function(event) 
			{ customCalctotal1(); } 
		);
	} 
);

// Custom Box 2

function customCalctotal2() 
{
  var baseCost = $('#customBaseCost2').val();
  var baseCostValue = parseFloat(baseCost) || 0;
  
  var surchargeCost = $('#customSurchargeCost2').val();
  var surchargeCostValue = parseFloat(surchargeCost) || 0;
  
  $('#customTotalCost2').val((baseCostValue + surchargeCostValue).toFixed(2));
}

$(document).ready(function() 
	{
	  $('#customBaseCost2').keyup(function(event) 
			{ customCalctotal2(); } 
		);
	  
	  $('#customSurchargeCost2').keyup(function(event) 
			{ customCalctotal2(); } 
		);
	
	  $('#customBaseCost2, #customSurchargeCost2').change(function(event) 
			{ customCalctotal2(); } 
		);
	} 
);

// Custom Box 3

function customCalctotal3() 
{
  var baseCost = $('#customBaseCost3').val();
  var baseCostValue = parseFloat(baseCost) || 0;
  
  var surchargeCost = $('#customSurchargeCost3').val();
  var surchargeCostValue = parseFloat(surchargeCost) || 0;
  
  $('#customTotalCost3').val((baseCostValue + surchargeCostValue).toFixed(2));
}

$(document).ready(function() 
	{
	  $('#customBaseCost3').keyup(function(event) 
			{ customCalctotal3(); } 
		);
	  
	  $('#customSurchargeCost3').keyup(function(event) 
			{ customCalctotal3(); } 
		);
	
	  $('#customBaseCost3, #customSurchargeCost3').change(function(event) 
			{ customCalctotal3(); } 
		);
	} 
);

// Custom Box 4

function customCalctotal4() 
{
  var baseCost = $('#customBaseCost4').val();
  var baseCostValue = parseFloat(baseCost) || 0;
  
  var surchargeCost = $('#customSurchargeCost4').val();
  var surchargeCostValue = parseFloat(surchargeCost) || 0;
  
  $('#customTotalCost4').val((baseCostValue + surchargeCostValue).toFixed(2));
}

$(document).ready(function() 
	{
	  $('#customBaseCost4').keyup(function(event) 
			{ customCalctotal4(); } 
		);
	  
	  $('#customSurchargeCost4').keyup(function(event) 
			{ customCalctotal4(); } 
		);
	
	  $('#customBaseCost4, #customSurchargeCost4').change(function(event) 
			{ customCalctotal4(); } 
		);
	} 
);

// Custom Box 5

function customCalctotal5() 
{
  var baseCost = $('#customBaseCost5').val();
  var baseCostValue = parseFloat(baseCost) || 0;
  
  var surchargeCost = $('#customSurchargeCost5').val();
  var surchargeCostValue = parseFloat(surchargeCost) || 0;
  
  $('#customTotalCost5').val((baseCostValue + surchargeCostValue).toFixed(2));
}

$(document).ready(function() 
	{
	  $('#customBaseCost5').keyup(function(event) 
			{ customCalctotal5(); } 
		);
	  
	  $('#customSurchargeCost5').keyup(function(event) 
			{ customCalctotal5(); } 
		);
	
	  $('#customBaseCost5, #customSurchargeCost5').change(function(event) 
			{ customCalctotal5(); } 
		);
	} 
);

//GroupedShipment functions

// Custom Box 6

function customCalctotal6() 
{
  var baseCost = $('#customBaseCost6').val();
  var baseCostValue = parseFloat(baseCost) || 0;
  
  var surchargeCost = $('#customSurchargeCost6').val();
  var surchargeCostValue = parseFloat(surchargeCost) || 0;
  
  $('#customTotalCost6').val((baseCostValue + surchargeCostValue).toFixed(2));
}

$(document).ready(function() 
	{
	  $('#customBaseCost6').keyup(function(event) 
			{ customCalctotal6(); } 
		);
	  
	  $('#customSurchargeCost6').keyup(function(event) 
			{ customCalctotal6(); } 
		);
	
	  $('#customBaseCost6, #customSurchargeCost6').change(function(event) 
			{ customCalctotal6(); } 
		);
	} 
);

function onlyNumbers (formElement, idElement = null, checkBoth = true, matchElement = '')
{
    var valid = true;
    var alertText = '';

	if(formElement.value == '')
        return;
    
    // var matchFloat = (formElement.value).match(/[0-9]+[.][0-9]+/);
	var matchFloat = (formElement.value).match(/^\d+(\.\d+)?$/);
    var matchInt = (formElement.value).match(/^(^[0-9]+$)|(^[ ]+$)/);

    if (checkBoth) {
    	if (matchFloat == null && matchInt == null) {
    		valid = false;
    		alertText = 'Numerical or decimal';
		}
	} else {
    	if (matchElement === 'float') {
			if (matchFloat == null) {
				valid = false;
				alertText = 'Decimal';
			}
		} else if (matchElement === 'int') {
			if (matchInt == null) {
				valid = false;
				alertText = 'Numerical';
			}
		}
	}

    if(!valid) {
        alert("Invalid format! " + alertText + " values only.");
        
        if(idElement != null) {
			document.getElementById(idElement).value = "";

			// Updates the Total Cost field
			if (idElement.includes('baseCost') || idElement.includes('surchargeCost')) {
				var number = idElement.substr(idElement.length - 1);
				this["calctotal" + number]();
			}
			if (idElement.includes('customBaseCost') || idElement.includes('customSurchargeCost')) {
				var number = idElement.substr(idElement.length - 1);
				this["customCalctotal" + number]();
			}
		}
        
        return false;
    }
}

function onlyAlphanumeric (formElement, idElement = null)
{
    if (formElement.value == '') {
        return;
    }
    
    var matchAlpha = (formElement.value).match(/^[a-zA-Z0-9]+$/);
    
    if (matchAlpha == null) {
        alert("Invalid format! Alphanumeric values only.");
        
        if (idElement != null) {
            document.getElementById(idElement).value = "";
        }
        
        return false;
    }
}


// Validate the Grouped Shipment Pop-Up before completing the order
function validate_groupedshipment_form(thisform)
{
  with (thisform)
  {
	  
	  var alertTextCarrierShipping = "Please select the carrier and shipping service!";
	  var alertWholeCustomBox = "Please fill out all shipping details of the custom box entered";
	 
	  
	  // If CUSTOM BOX 1 is selected, validate all the other details for that box
	  if ((validate_required(customLength6)==false || 
		   validate_required(customWidth6)==false || 
		   validate_required(customHeight6)==false) || 
		  validate_required(customWeight6)==false || 
		   validate_required_allow_zero(customBaseCost6)==false || 
		   validate_required(customTrackingNumber6)==false
		   
		  )
	  {
		  alert(alertWholeCustomBox);
		  return false;
	  }
	  	  
	  // Validate Carrier + Shipping Service selected
	  if (validate_required(carrier_id_and_shipping_service_id)==false)
	  {				  
		  alert(alertTextCarrierShipping);
		  return false;
	  }
	  
	  // Confirm from the user if this order really needs to be shipped?
	  var x;
 	  var result = confirm(shippingAlertDialogBox);
	
	  if (result)
	  {
		  return true;
	  }
	  else
	  {
		  return false;
	  }
	  
   }
}













