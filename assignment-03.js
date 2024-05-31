
//Calculate the unassigned number
function unAssignedNum() {
    var inputs = $("input:not(.textInput)");
    var totalUnassignedNum = 0;
    for (var i = 0; i < inputs.length; i++) {
        if ($.trim($(inputs[i]).val()) == "-") {
            totalUnassignedNum++;
            $(inputs[i]).parent().css("background-color", "yellow");
        } else {
            var originalBg = $(inputs[i]).parent().parent().children().eq(0).css("background-color");
            $(inputs[i]).parent().css("background-color", originalBg);
        }
    }
    $("#unassigedNum").text(totalUnassignedNum);
}

//Convert avg score to level and scale
function convertAvgToPercent(average) {
    average = parseInt(average);
    if (average >= 93 && average <= 100) {
        return {level: "A", scale: "4.0"};
    } else if (average >= 90 && average <= 92) {
        return {level: "A-", scale: "3.7"};
    } else if (average >= 87 && average <= 89) {
        return {level: "B+", scale: "3.3"};
    } else if (average >= 83 && average <= 86) {
        return {level: "B", scale: "3.0"};
    } else if (average >= 80 && average <= 82) {
        return {level: "B-", scale: "2.7"};
    } else if (average >= 77 && average <= 79) {
        return {level: "C+", scale: "2.3"};
    } else if (average >= 73 && average <= 76) {
        return {level: "C", scale: "2.0"};
    } else if (average >= 70 && average <= 72) {
        return {level: "C-", scale: "1.7"};
    } else if (average >= 67 && average <= 69) {
        return {level: "D+", scale: "1.3"};
    } else if (average >= 63 && average <= 66) {
        return {level: "D", scale: "1.0"};
    } else if (average >= 60 && average <= 62) {
        return {level: "D-", scale: "0.7"};
    } else {
        return {level: "F", scale: "0.0"};
    }
}

//Calculate average grade, letter grade, 4.0 scale grade
function calculateTotalGrade(obj) {
    var originalBg = obj.parent().parent().children().eq(0).css("background-color");
    obj.parent().parent().children(".finalGrade").css("background-color", originalBg)
        .css("color", "black");
    obj.parent().parent().children(".letterGrade").css("background-color", originalBg)
        .css("color", "black");
    obj.parent().parent().children(".scaleGrade").css("background-color", originalBg)
        .css("color", "black");
    var grades = obj.parent().parent().children(".grade");
    var totalGrade = 0;
    var zeroVal = false;
    for (var i = 0; i < grades.length; i++) {
        var grade = $.trim($(grades[i]).children("input").eq(0).val());
        if (grade == "0") {
            zeroVal = true;
        }
        if (grade == "-" || grade == "") {
            grade = 0;
        }
        totalGrade += parseInt(grade);
    }
    //Set total grade
    var average = Math.round(totalGrade / 5.0);        
    if (parseFloat(totalGrade) != 0 || zeroVal == true) {
        var gradeScale = convertAvgToPercent(average);
        obj.parent().parent().children(".finalGrade").text(average+"%").css("text-align","right");
        obj.parent().parent().children(".letterGrade").text(gradeScale.level);  
        obj.parent().parent().children(".scaleGrade").text(gradeScale.scale).css("text-align","right");  
        if (parseInt(average) < 60) {
            //If total grade lower than 60, set background red
            obj.parent().parent().children(".finalGrade").css("background-color", "red")
                .css("color", "white");
            obj.parent().parent().children(".letterGrade").css("background-color", "red")
                .css("color", "white");
            obj.parent().parent().children(".scaleGrade").css("background-color", "red")
                .css("color", "white");
        } 
    } else {
        obj.parent().parent().children(".finalGrade").text("-").css("text-align","center");
        obj.parent().parent().children(".letterGrade").text("-").css("text-align","center");
        obj.parent().parent().children(".scaleGrade").text("-").css("text-align","center");
    }        
}

$(document).ready(function() {
    
    unAssignedNum();
    saveTable();
   
    $("table").on("focus", "input", function() {
        if ($.trim($(this).val()) == "-") {
            $(this).val("");
        }
    });

    $("table").on("blur", "input", function() {
        if ($.trim($(this).val()) == "") {
            $(this).val("-");
            $(this).css("text-align","center");
            calculateTotalGrade($(this));
            unAssignedNum();
        }
    });

    $("table").on("change", "input:not(.textInput)", function() {
        if (/[^0-9.]/.test($(this).val()) || parseFloat($(this).val()) > 100 || parseFloat($(this).val()) < 0) {
            $(this).val("-");
            $(this).css("text-align","center");            
            calculateTotalGrade($(this));
            unAssignedNum();
            return false;
        }
        $(this).css("text-align","right");
        if ($(this).val() != "") {
            $(this).val(parseFloat($(this).val()));
        }
        calculateTotalGrade($(this));
        unAssignedNum();
    });

    $("table").on("change", "td input.textInput", function() {
        if ($(this).val() != "-") {
            $(this).css("text-align","left");
        }
    });

    //Click the last column, toggle display
    $("table").on("click", ".finalGrade", function() {        
        $(".finalGrade").hide();
        $(".letterGrade").show();
        $(".scaleGrade").hide();
    });

    $("table").on("click", ".letterGrade", function() {
        $(".finalGrade").hide();        
        $(".letterGrade").hide();
        $(".scaleGrade").show();
    });

    $("table").on("click", ".scaleGrade", function() {
        $(".finalGrade").show();
        $(".letterGrade").hide();
        $(".scaleGrade").hide();
    });

    //Add new row
    $("#btnAddRow").click(function() {
        var newRow = "<tr><td style=\"width:120px\"><input value=\"-\" class=\"textInput\" style=\"padding:0;\"></td>"
            + "<td style=\"padding-left:0px;width:77px;\"><input value=\"-\" style=\"width:100%\" class=\"textInput\"></td>"
        for (var j = 2; j < $("th").length-3; j++) {
            newRow += "<td class=\"grade\"><input value=\"-\"></td>";
        }
        newRow += "<td class=\"finalGrade\">-</td><td class=\"letterGrade\">-</td><td class=\"scaleGrade\">-</td></tr>";
        $("table").append(newRow);
        unAssignedNum();
    });

    //Add new column
    $("#btnAddCol").click(function() {
        $("table thead tr th:nth-last-child(4)").after("<th><input class=\"textInput\" style=\"color:black;font-weight:bold;"
            + "font-family:sans-serif\" value=\"-\"></th>");
        $("table tbody tr td:nth-last-child(4)").after("<td class=\"grade\">"
            + "<input style=\"font-family:sans-serif\" value=\"-\"></td>");
        //$("table").append(newRow);
        unAssignedNum();
    });

    //Save table
    $("#btnSave").click(function() {
        saveTable();
        //alert("The current table has been saved!");
    });

    function saveTable() {
        //If there is empty column name or duplicated titles
        var columnTitles = [];
        var illegal = true;
        $("th").each(function(){
            if ($(this).children("input").val() == "-") {
                alert("Pleae input the column name!");
                return fasle;
            }
        });
        //debugger;
        var rowJsons = []; 
        //Read table content
        for (var i = 0; i < $("tbody tr").length; i++) {
            var rowJson = {};
            var tds = $("tbody tr").eq(i).children();           
            for (var j = 0; j < $(tds).length; j++) {
                //Title name
                var title = "";                               
                //Data
                var data = "";
                if (j < 2) {
                    title = $("table thead tr th").eq(j).text(); 
                    //alert($("#originalRowCnt").val());
                    if (i < parseInt($("#originalRowCnt").val())) {
                        data = $(tds).eq(j).text();
                    } else {
                        data = $(tds).eq(j).children("input").eq(0).val();
                    }                    
                } else if (j >=2 && j < $(tds).length-3) {
                    //debugger;
                    if (j >= 2 && j < parseInt($("#originalColCnt").val())+2) {
                        //Original column names
                        title = $("table thead tr th").eq(j).text(); 
                    } else {
                        //Extra column names
                        title = $("table thead tr th").eq(j).children("input").eq(0).val(); 
                    }
                    data = $(tds).eq(j).children("input").eq(0).val();
                } else {
                    title = $("table thead tr th").eq(j).text(); 
                    data = $(tds).eq(j).text();
                }
                rowJson[title] = data;                
            }
            rowJsons.push(rowJson);
        }        
        localStorage.setItem("rowData", JSON.stringify(rowJsons));
        //Get hide status
        var hideStatus = {};
        hideStatus["finalGrade"] = $("th.finalGrade").css("display");
        hideStatus["letterGrade"] = $("th.letterGrade").css("display");
        hideStatus["scaleGrade"] = $("th.scaleGrade").css("display");
        localStorage.setItem("hideStatus", JSON.stringify(hideStatus));
    }

    //Restore table
    $("#btnRestore").click(function() {
        if (localStorage.getItem("rowData") == null || localStorage.getItem("rowData") == "") {
            return false;
        }
        console.log(localStorage.getItem("rowData"));
        var rowJsons = JSON.parse(localStorage.getItem("rowData"));
        if (rowJsons.length == 0) {
            return fasle;
        }        
        $("table thead").html("");
        $("table tbody").html("");        
        var newTitle = "<tr>";
        //Title row
        var rowJson = rowJsons[0];          
        var keys = Object.keys(rowJson);
        //Name and student no
        newTitle += "<th style=\"width:120px;\">" + keys[0] + "</th>"; 
        newTitle += "<th style=\"width:75px;\">" + keys[1] + "</th>"; 
        //Grade columns
        for (var j = 2; j < parseInt($("#originalColCnt").val())+2; j++) {
            newTitle += "<th style=\"width:90px;\" class=\"grade\">" + keys[j] + "</th>"; 
        }
        //Extra grade columns
        for (var j = parseInt($("#originalColCnt").val())+2; j < keys.length-3; j++) {
            newTitle += "<th><input class=\"textInput\" style=\"color:black;font-weight:bold;"
                + "font-family:sans-serif\" value=\"" + keys[j]+ "\"></th>";
        }
        //Last 3 columns
        var hideStatus = JSON.parse(localStorage.getItem("hideStatus"));
        var finalGradeD = hideStatus["finalGrade"] == "none" ? "display:none;" : "display:table-cell";
        var letterGradeD = hideStatus["letterGrade"] == "none" ? "display:none;": "display:table-cell";
        var scaleGradeD = hideStatus["scaleGrade"] == "none" ? "display:none;": "display:table-cell";       
        newTitle += "<th style=\"width:110px;" + finalGradeD + "\" class=\"finalGrade\">" + keys[keys.length-3] + "</th>"; 
        newTitle += "<th style=\"width:110px;" + letterGradeD + "\" class=\"letterGrade\">" + keys[keys.length-2] + "</th>"; 
        newTitle += "<th style=\"width:110px;" + scaleGradeD + "\" class=\"scaleGrade\">" + keys[keys.length-1] + "</th>"; 
        newTitle += "</tr>"; 
        $("table thead").append(newTitle);
        //Data rows
        for (var i = 0; i < rowJsons.length; i++) {
            var newRow = "<tr>";
            rowJson = rowJsons[i];            
            // alert(JSON.stringify(rowJson));
            keys = Object.keys(rowJson);            
            for (var j = 0; j < keys.length; j++) {
                //Title name
                var title = keys[j];
                //Data
                if (j < 2) {
                    if (i < parseInt($("#originalRowCnt").val())) {
                        newRow += "<td>" + rowJson[title] + "</td>";
                    } else {
                        var setAlign = rowJson[title] != "-"? "text-align:left;": "";
                        newRow += "<td><input value=\"" + rowJson[title] + "\" class=\"textInput\" style=\"padding:0;" + setAlign + "\"></td>";
                    }
                } else if (j >=2 && j < keys.length-3) {
                    if (rowJson[title] != "-") {
                        newRow += "<td class=\"grade\"><input style=\"text-align:right\" value=\"" + rowJson[title] + "\"></td>";
                    } else {
                        newRow += "<td class=\"grade\"><input value=\"" + rowJson[title] + "\"></td>";
                    }
                } else {
                    var setAlign = rowJson["Average [%]"] != "-"? "text-align:right;":"";                    
                    var setColor = parseInt(rowJson["Average [%]"].replace("%","")) < 60 ? "background-color:red;color:white;":"";
                    if (j == keys.length - 3) {
                        newRow += "<td style=\"width:110px;" + setAlign + setColor + finalGradeD
                            + "\" class=\"finalGrade\">" + rowJson[title] + "</td>";
                    } else if (j == keys.length - 2) {
                        newRow += "<td style=\"width:110px;" + setColor + letterGradeD 
                        + "\" class=\"letterGrade\">" + rowJson[title] + "</td>";
                    } else {
                        newRow += "<td style=\"width:110px;" + setAlign + setColor + scaleGradeD 
                        + "\" class=\"scaleGrade\">" + rowJson[title] + "</td>";
                    }                   
                }
            }            
            newRow += "</tr>";   
            //console.log(newRow);         
            $("table tbody").append(newRow);    
        } 
        unAssignedNum();
    });

    //Click name, highlight the row
    $("tbody tr").on("click", "td:first-child", function() { 
    //$("tbody tr").find("td:first-child").click(function() {
        //Get current background
        var currentBg = $(this).parent().css("background-color");
        //alert(currentBg);
        if (currentBg == "rgb(204, 255, 51)") {
            var index = $(this).parent().index();
            //Recover the original color
            if (parseInt(index) % 2 == 0) {                
                $(this).parent().css("background-color","#d9d9d9");
                $(this).parent().children().css("background-color","#d9d9d9");
                for (var j = 0; j < $(this).parent().children(".grade").length; j++) {
                    if ($(this).parent().children(".grade").eq(j).children("input").eq(0).val() == "-") {
                        $(this).parent().children(".grade").eq(j).css("background-color","yellow");
                    }
                }
            } else {
                $(this).parent().css("background-color","#f2f2f2");
                $(this).parent().children().css("background-color","#f2f2f2");     
                for (var j = 0; j < $(this).parent().children(".grade").length; j++) {
                    if ($(this).parent().children(".grade").eq(j).children("input").eq(0).val() == "-") {
                        $(this).parent().children(".grade").eq(j).css("background-color","yellow");
                    }
                }           
            }
        } else {
            //Set high-lighted color
            $(this).parent().css("background-color","#ccff33");
            $(this).parent().children().css("background-color","#ccff33");
        }        
    });

    $("tbody tr").on("contextmenu", function(event) {
        $("#selectedRowIndex").val($(this).index());
        $("#deleteType").val("row");
        event.preventDefault(); 
        $(".menu").css({
            top: event.pageY,
            left: event.pageX
        }).show();
    });

    $("thead th").on("contextmenu", function(event) {
        var index = $(this).index();
        if (parseInt(index) >= 2 && parseInt(index) < $("thead th").length-3) { 
            $("#selectedColIndex").val($(this).index());
            $("#deleteType").val("column");
            event.preventDefault(); 
            $(".menu").css({
                top: event.pageY,
                left: event.pageX
            }).show();
        }
    });

    $(document).on("click", function() {
      $(".menu").hide();
    });

    // Right click the row and column name
    $(".menuItem").on("click", function() {
      var id = $(this).attr("id");
      switch (id) {
        case "menu1":
            var deleteType = $("#deleteType").val();
            if (deleteType == "row") {
                if (confirm("Do you want to delete this row?") == true) {
                    $("tbody tr").eq(parseInt($("#selectedRowIndex").val())).remove();
                    //$(this).parent().remove();
                    $("#originalRowCnt").val(parseInt($("#originalRowCnt").val()) - 1);                    
                    unAssignedNum();
                }
            } else if (deleteType == "column") {
                 if (confirm("Do you want to delete this column?") == true) {
                    //$(this).remove();
                    $("thead tr").children("th").eq(parseInt($("#selectedColIndex").val())).remove();
                    for (var i = 0; i < $("tbody tr").length; i++) {
                        var td = $("tbody tr").eq(i).children("td").eq(parseInt($("#selectedColIndex").val()));
                        $(td).children("input").val("-");
                        calculateTotalGrade($(td).children("input").eq(0));
                        $(td).remove();
                    }
                    $("#originalColCnt").val(parseInt($("#originalColCnt").val()) - 1);
                    unAssignedNum();
                } 
            } 
            break;
        default:
            break;
      }
    });

    //Click grade column, highlight the column
    $("thead th").click(function() { 
        selectColumn($(this));
    });

    function selectColumn(obj) {
        var index = obj.index();
        //Not inlcude the final, name, student no columns
        if (parseInt(index) >= 2 && parseInt(index) < $("thead th").length-3) {      
            //Get current background
            var currentBg = obj.css("background-color"); 
            if (currentBg == "rgb(204, 255, 51)") {                
                //Recover the original color
                obj.css("background-color", "#404040");
                for (var i = 0; i < $("tbody tr").length; i++) {
                    if ($("tbody tr").eq(i).children("td").eq(index).children("input").eq(0).val() == "-") {
                        $("tbody tr").eq(i).children("td").eq(index).css("background-color","yellow");
                        $("tbody tr").eq(i).children("td").eq(index).children("input").css("background-color","yellow");
                    } else {
                        var rowIndex = $("tbody tr").eq(i).index();
                        if (parseInt(rowIndex) % 2 == 0) {                
                            $("tbody tr").eq(i).children("td").eq(index).css("background-color","#d9d9d9");
                            $("tbody tr").eq(i).children("td").eq(index).children("input").css("background-color","#d9d9d9");
                        } else {
                            $("tbody tr").eq(i).children("td").eq(index).css("background-color","#f2f2f2");
                            $("tbody tr").eq(i).children("td").eq(index).children("input").css("background-color","#f2f2f2");
                        }
                    }
                }
            } else {
                obj.css("background-color", "#ccff33");
                for (var i = 0; i < $("tbody tr").length; i++) {
                    $("tbody tr").eq(i).children("td").eq(index).css("background-color", "#ccff33");
                    $("tbody tr").eq(i).children("td").eq(index).children("input").css("background-color", "#ccff33");
                    //console.log($("tbody tr").eq(i).children("td").eq(index).html());
                }
            }              
        } 
    }

});