function changeGroup23(currentOption){
    var option1 = document.getElementById("customOptions_group1").selectedIndex;
    var option2 = document.getElementById("customOptions_group2").selectedIndex;
    var option3 = document.getElementById("customOptions_group3").selectedIndex;
    var option4 = document.getElementById("customOptions_group4").selectedIndex;
    
    if(currentOption==1){
        document.getElementById("customOptions_group2").selectedIndex = "0";
        document.getElementById("customOptions_group3").selectedIndex = "0";
        document.getElementById("customOptions_group4").selectedIndex = "0";
        
        var valueToHide2 = "group2_"+document.getElementById("customOptions_group1").value;
        var valueToHide3 = "group3_"+document.getElementById("customOptions_group1").value;
        var valueToHide4 = "group4_"+document.getElementById("customOptions_group1").value;
        
        console.log(valueToHide2);
        console.log(valueToHide3);
        console.log(valueToHide4);
        
        //Let's turn on all the options
        for(i=1;i<=3;i++)
            document.report_config.customOptions_group2[i].style.visibility="visible";
        for(i=1;i<=3;i++)
            document.report_config.customOptions_group3[i].style.visibility="visible";
        for(i=1;i<=3;i++)
            document.report_config.customOptions_group4[i].style.visibility="visible";

        //Let's turn off the selected option in the other select-inputs
        document.getElementById(valueToHide2).style.visibility = "hidden";
        document.getElementById(valueToHide3).style.visibility = "hidden";
        document.getElementById(valueToHide4).style.visibility = "hidden";
    }
    
    if(currentOption==2){
        document.getElementById("customOptions_group3").selectedIndex = "0";
        document.getElementById("customOptions_group4").selectedIndex = "0";
        
        var valueToHide3 = "group3_"+document.getElementById("customOptions_group2").value;
        var valueToHide4 = "group4_"+document.getElementById("customOptions_group2").value;
        
        console.log(valueToHide3);
        console.log(valueToHide4);
        
        
        //var valueSelectdOn3 = "group3_"+document.getElementById("customOptions_group2").value;
        //var valueSelectdOn4 = "group4_"+document.getElementById("customOptions_group2").value;
        
        for(i=1;i<=3;i++)
            document.report_config.customOptions_group3[i].style.visibility="visible";
        for(i=1;i<=3;i++)
            document.report_config.customOptions_group4[i].style.visibility="visible";
        
        document.getElementById(valueToHide3).style.visibility = "hidden";
        document.getElementById(valueToHide4).style.visibility = "hidden";
       
        //document.getElementById(valueSelectdOn3).style.visibility = "hidden";
        //document.getElementById(valueSelectdOn4).style.visibility = "hidden";
        
    }
    if(currentOption==3){
        document.getElementById("customOptions_group4").selectedIndex = "0";
        var valueToHide4 = "group4_"+document.getElementById("customOptions_group3").value;
        var valueSelectdOn1 = "group4_"+document.getElementById("customOptions_group1").value;
        
        for(i=1;i<=3;i++)
            document.report_config.customOptions_group4[i].style.visibility="visible";
        
        document.getElementById(valueToHide4).style.visibility = "hidden";
        document.getElementById(valueSelectdOn1).style.visibility = "hidden";
        
    }
    
}

function checkToSubmit(){
    if (document.getElementById("customOptions_group1").value == 0){
		if(document.getElementById("customOptions_group1").value == 0 && document.getElementById("customOptions_group2").value == 0 && document.getElementById("customOptions_group3").value == 0  && document.getElementById("customOptions_group4").value == 0 ){
			document.getElementById("customOptions_group1").value = "substrate";
			document.getElementById("customOptions_group2").value = "gallerywrap";
			document.getElementById("customOptions_group3").value = "framecode";
                        document.getElementById("customOptions_group4").value = "gallery";
			return true;
		}
    }
    else{
        return true;
    }
}

function change_department_to(id_value,num_of_department){
   
    document.getElementById("display_to").selectedIndex = id_value;
    
    for(i=0;i<num_of_department;i++){
        document.report_config.display_to[i].style.visibility = "hidden"; 
    }
    
    for(i=id_value;i<num_of_department;i++){
        document.report_config.display_to[i].style.visibility = "visible"; 
    }
}

function submitWorkcomplete(skipDateValidation){
    
	var skipDate=false;
	
	if (typeof skipDateValidation !== 'undefined') {
		if(skipDateValidation=='yes'){
			skipDate=true;
		}
		
	}
		
	if(!skipDate && (document.getElementById("date_from").value=="" || document.getElementById("date_to").value=="")){
        
		alert("Please select a range of date ");
        return false;
		
    }
	
	if ( document.getElementById("customOptions_group1").value == 0 && (document.getElementById("customOptions_group2").value != 0 || document.getElementById("customOptions_group3").value != 0 || document.getElementById("customOptions_group4").value != 0) ){
		
		alert("Please select the First Group By");
        return false;		
				
    }else if ( document.getElementById("customOptions_group2").value == 0 && (document.getElementById("customOptions_group3").value != 0 || document.getElementById("customOptions_group4").value != 0)){
		
		alert("Please select the Second Group By");
        return false;		
				
    }else if ( document.getElementById("customOptions_group3").value == 0 && document.getElementById("customOptions_group4").value != 0 ){
		
		alert("Please select the Third Group By");
        return false;		
				
    }else if (document.getElementById("email") != null && document.getElementById("userEmail") != null) {
            if ( document.getElementById("email").value == "" && document.getElementById("userEmail").value == "0") {
                alert("Please enter your email");
                return false;	
            } else {
                document.report_config.submit();
            }
    } 
    else{
		document.report_config.submit();
    
	}
	
}

