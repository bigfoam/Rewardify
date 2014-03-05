//For todays date;
Date.prototype.today = function(){ 
    return ((this.getDate() < 10)?"0":"") + this.getDate() +"/"+(((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) +"/"+ this.getFullYear() 
};
//For the time now
Date.prototype.timeNow = function(){
     return ((this.getHours() < 10)?"0":"") + this.getHours() +":"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes() +":"+ ((this.getSeconds() < 10)?"0":"") + this.getSeconds();
};



function init() {
    document.addEventListener("deviceready",createDB);
}


//var updateurl = "http://www.raymondcamden.com/demos/2012/apr/3/serverbackend/service.cfc?method=getupdates&returnformat=json";


function syncDB() {
    $("#docs").html("Refreshing documentation...");

    var date = localStorage["lastdate"]?localStorage["lastdate"]:'';
    console.log("Will get items after "+date);
    $.get(updateurl, {date:date}, function(resp,code) {
        console.log("back from getting updates with "+resp.length + " items to process.");
        //Ok, loop through. For each one, we see if it exists, and if so, we update/delete it
        //If it doesn't exist, straight insert
        resp.forEach(function(ob) {
            db.transaction(function(ctx) {
                ctx.executeSql("select id from docs where token = ?", [ob.token], function(tx,checkres) {
                    if(checkres.rows.length) {
                        console.log("possible update/delete");
                        if(!ob.deleted) {
                            console.log("updating "+ob.title+ " "+ob.lastupdated);
                            tx.executeSql("update docs set title=?,body=?,lastupdated=? where token=?", [ob.title,ob.body,ob.lastupdated,ob.token]);
                        } else {
                            console.log("deleting "+ob.title+ " "+ob.lastupdated);
                            tx.executeSql("delete from docs where token = ?", [ob.token]);
                        }
                    } else {
                        //only insert if not deleted
                        console.log("possible insert");
                        if(!ob.deleted) {
                            console.log("inserting "+ob.title+ " "+ob.lastupdated);
                            tx.executeSql("insert into docs(title,body,lastupdated,token) values(?,?,?,?)", [ob.title,ob.body,ob.lastupdated,ob.token]);
                        }
                    }

                });
            });
        });
        //if we had anything, last value is most recent
        if(resp.length) localStorage["lastdate"] = resp[resp.length-1].lastupdated;
        displayDocs();    
    },"json");

}


function displayData()
{
    db.transaction(function(tx) {
        tx.executeSql("SELECT * FROM Credit_Card", [], function(tx, results) {
            var newDate = new Date();
            var s = "<h2>" + newDate.timeNow() + ": Data in DB</h2>";
            for(var i=0; i<results.rows.length; i++) {
            	$.each(results.rows.item(i), function(index, value){ 
					s += index + " : " + value + "<br/>";
				});
                s += "<br/>";
            }
            $("#docs").html(s);
        });
    });
}