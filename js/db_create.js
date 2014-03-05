var db;
var db_is_empty = false;
var jsonData;


function createDB() {
    //console.log("Starting up...");
    db = window.openDatabase("main","1","Main DB",1000000);//database_name, database_version, database_displayname, database_size
    db.transaction(initDB,dbError,dbReady);
}


function dbError(e) {
    console.log("SQL ERROR");
    console.dir(e);
}


function dbReady() {
    console.log("DB initialization done.");
    //begin sync process
    //if(navigator.network && navigator.network.connection.type != Connection.NONE) syncDB();
    //else displayDocs();
    displayData();
}


function initDB(tx) {
	//var newDate;
	//newDate.today() + " @ " + newDate.timeNow();

/*	
	tx.executeSql("SELECT COUNT(*) as num_cc FROM Credit_Card", [], function(tx, results) {
    	var num_cc = results.rows.item(0).num_cc;
        newDate = new Date();
        $("#tmp").append(newDate.timeNow() + ": Number of Card is " + num_cc + "<br/>");
    });
*/

	create_credit_card_table();
	create_card_service_table();
	create_bank_service_table();
	create_network_service_table();
	create_network_pro_service_table();
	create_membership_service_table();
	
	create_vendor_table();
	create_vendor_alias_table();
	create_vendor_category_table();
	
	create_base_vendor_rate();
	create_base_category_rate();
	create_rotation_vendor_rate();
	create_rotation_category_rate();
	create_bonus_center_vendor_rate();
	
	create_user_table();
	create_user_credit_card_table();
	

}


function clean_tables() {
		
	//tx.executeSql("DROP TABLE Credit_Card");
}


function create_credit_card_table() {
	
	tx.executeSql("DROP TABLE Credit_Card");
	
    var sql = "CREATE TABLE IF NOT EXISTS Credit_Card ( " + 
			"ccID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, " + 
			"name VARCHAR(100) NOT NULL, " + 
			"bank VARCHAR(100), " + 
			"network VARCHAR(10) NOT NULL, " + 
			"type VARCHAR(10) NOT NULL, " + 
			"low_APR BOOLEAN NOT NULL, " + 
			"membership VARCHAR(150), " + 
			"membership_level VARCHAR(50), " + 
			"network_pro VARCHAR(50), " +  
			"point_to_cash FLOAT DEFAULT 0.01, " + 
			"point_to_mile FLOAT DEFAULT 1.0, " + 
			"mile_to_cash FLOAT DEFAULT 0.01, " + 
			"annual_fee VARCHAR(250), " + 
			"foreign_transaction_fee VARCHAR(250), " + 
			"cash_advance_fee VARCHAR(250), " + 
			"balance_transfer_fee VARCHAR(250), " + 
			"late_payment_fee VARCHAR(250), " + 
			"return_payment_fee VARCHAR(250), " + 
			"purchase_APR VARCHAR(250), " + 
			"balance_transfer_APR VARCHAR(250), " + 
			"cash_advance_APR VARCHAR(250), " + 
			"penalty_APR VARCHAR(250), " + 
			"open_bonus VARCHAR(250), " + 
			"additional_bonus VARCHAR(250), " + 
			"disclaimer VARCHAR(250), " + 
			"original_link VARCHAR(250), " + 
			"apply_link VARCHAR(250), " + 
			"update_time DATETIME NOT NULL, " + 
			"deleted BOOLEAN NOT NULL)";
			
    tx.executeSql(sql); //create credit card db
    
    
	tx.executeSql("SELECT COUNT(*) as num_cc FROM Credit_Card", [], function(tx, results) {
	
    	if( results.rows.item(0).num_cc == 0 )
    	{
			db_is_empty = true;
			
	    	getJsonData("credit_card");
		    sql = "INSERT INTO Credit_Card (ccID, name, bank, network, type, low_APR, membership, membership_level, network_pro, point_to_cash, point_to_mile, mile_to_cash, annual_fee, foreign_transaction_fee, cash_advance_fee, balance_transfer_fee, late_payment_fee, return_payment_fee, purchase_APR, balance_transfer_APR, cash_advance_APR, penalty_APR, open_bonus, additional_bonus, disclaimer, original_link, apply_link, update_time, deleted) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);"; 
		    
		    //newDate = new Date();
		    //$("#tmp2").append(newDate.timeNow() + ": Number of Card in json is " + jsonData.length);// + "<br/>"​
		    
			$.each(jsonData, function(i, item) {
				db.transaction(function(ctx) {
					ctx.executeSql(sql, [item.ccid, item.name, item.bank, item.network, item.type, item.low_APR, item.membership, item.membership_level, item.annual_fee, item.update_time, item.deleted]);
					//success function would mark a field to indicate the creation of this table is right
				});
			});
		}
    });
	
}


function create_card_service_table() {}
function create_bank_service_table() {}
function create_network_service_table() {}
function create_network_pro_service_table() {}
function create_membership_service_table() {}




function create_vendor_category_table() {
	
    var sql = "CREATE TABLE IF NOT EXISTS Vendor_Category ( " + 
			"vcID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, " + 
			"name VARCHAR(200) NOT NULL, " + 
			"disclaimer VARCHAR(10) NOT NULL, " + 
			"update_time DATETIME NOT NULL, " + 
			"deleted BOOLEAN NOT NULL)";
			
    tx.executeSql(sql);
    
    if( db_is_empty )
    {	
	    getJsonData("vendor_category");
		sql = "INSERT INTO Vendor_Category (vID, name, disclaimer, update_time, deleted) VALUES (?,?,?,?,?);"; 
		
		$.each(jsonData, function(i, item) {
			db.transaction(function(ctx) {
				ctx.executeSql(sql, [item.vID, item.name, item.disclaimer, item.update_time, item.deleted]);
			});
		});
	}
}



function create_vendor_table() {
	
    var sql = "CREATE TABLE IF NOT EXISTS Vendor ( " + 
			"vID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, " + 
			"name VARCHAR(200) NOT NULL, " + 
			"vcID INTEGER NOT NULL, " + 
			"description VARCHAR(10) NOT NULL, " + 
			"update_time DATETIME NOT NULL, " + 
			"deleted BOOLEAN NOT NULL)";
			
    tx.executeSql(sql);
    
    if( db_is_empty )
    {	
	    getJsonData("vendor");
		sql = "INSERT INTO Vendor (vID, name, vcID, description, update_time, deleted) VALUES (?,?,?,?,?,?);"; 
		
		$.each(jsonData, function(i, item) {
			db.transaction(function(ctx) {
				ctx.executeSql(sql, [item.vID, item.name, item.vcID, item.description, item.update_time, item.deleted]);
			});
		});
	}
}



function create_vendor_alias_table() {}


	
function create_base_vendor_rate() {
	
    var sql = "CREATE TABLE IF NOT EXISTS Base_Vendor_Rate ( " + 
			"bvrID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, " + 
			"ccID INTEGER NOT NULL, " + 
			"vID INTEGER NOT NULL, " + 
			"rate FLOAT NOT NULL, " + 
			"update_time DATETIME NOT NULL, " + 
			"deleted BOOLEAN NOT NULL)";
			
    tx.executeSql(sql);
    
    if( db_is_empty )
    {	
	    getJsonData("base_vendor_rate");
		sql = "INSERT INTO Base_Vendor_Rate (ccID, vID, rate, update_time, deleted) VALUES (?,?,?,?,?,?);"; 
		
		$.each(jsonData, function(i, item) {
			db.transaction(function(ctx) {
				ctx.executeSql(sql, [item.ccID, item.vID, item.rate, item.update_time, item.deleted]);
			});
		});
	}
}



function create_base_category_rate() {
	
    var sql = "CREATE TABLE IF NOT EXISTS Base_Category_Rate ( " + 
			"bcrID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, " + 
			"ccID INTEGER NOT NULL, " + 
			"vcID INTEGER NOT NULL, " + 
			"rate FLOAT NOT NULL, " + 
			"update_time DATETIME NOT NULL, " + 
			"deleted BOOLEAN NOT NULL)";
			
    tx.executeSql(sql);
    
    if( db_is_empty )
    {	
	    getJsonData("base_category_rate");
		sql = "INSERT INTO Base_Category_Rate (ccID, vcID, rate, update_time, deleted) VALUES (?,?,?,?,?,?);"; 
		
		$.each(jsonData, function(i, item) {
			db.transaction(function(ctx) {
				ctx.executeSql(sql, [item.ccID, item.vcID, item.rate, item.update_time, item.deleted]);
			});
		});
	}
}



function create_rotation_vendor_rate() {
	
    var sql = "CREATE TABLE IF NOT EXISTS Rotation_Vendor_Rate ( " + 
			"rcrID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, " + 
			"ccID INTEGER NOT NULL, " + 
			"vID INTEGER NOT NULL, " + 
			"rate FLOAT NOT NULL, " + 
			"update_time DATETIME NOT NULL, " + 
			"deleted BOOLEAN NOT NULL)";
			
    tx.executeSql(sql);
    
    if( db_is_empty )
    {	
	    getJsonData("rotation_vendor_rate");
		sql = "INSERT INTO Rotation_Vendor_Rate (ccID, vID, rate, update_time, deleted) VALUES (?,?,?,?,?,?);"; 
		
		$.each(jsonData, function(i, item) {
			db.transaction(function(ctx) {
				ctx.executeSql(sql, [item.ccID, item.vID, item.rate, item.update_time, item.deleted]);
			});
		});
	}
}



function create_rotation_category_rate() {
	
    var sql = "CREATE TABLE IF NOT EXISTS Rotation_Category_Rate ( " + 
			"rcrID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, " + 
			"ccID INTEGER NOT NULL, " + 
			"vcID INTEGER NOT NULL, " + 
			"rate FLOAT NOT NULL, " + 
			"update_time DATETIME NOT NULL, " + 
			"deleted BOOLEAN NOT NULL)";
			
    tx.executeSql(sql);
    
    if( db_is_empty )
    {	
	    getJsonData("rotation_category_rate");
		sql = "INSERT INTO Rotation_Category_Rate (ccID, vcID, rate, update_time, deleted) VALUES (?,?,?,?,?,?);"; 
		
		$.each(jsonData, function(i, item) {
			db.transaction(function(ctx) {
				ctx.executeSql(sql, [item.ccID, item.vcID, item.rate, item.update_time, item.deleted]);
			});
		});
	}
}



function create_bonus_center_vendor_rate() {
	
    var sql = "CREATE TABLE IF NOT EXISTS Bonus_Vendor_Rate ( " + 
			"rcrID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, " + 
			"ccID INTEGER NOT NULL, " + 
			"vID INTEGER NOT NULL, " + 
			"rate FLOAT NOT NULL, " + 
			"update_time DATETIME NOT NULL, " + 
			"deleted BOOLEAN NOT NULL)";
			
    tx.executeSql(sql);
    
    if( db_is_empty )
    {	
	    getJsonData("bonus_vendor_rate");
		sql = "INSERT INTO Bonus_Vendor_Rate (ccID, vID, rate, update_time, deleted) VALUES (?,?,?,?,?,?);"; 
		
		$.each(jsonData, function(i, item) {
			db.transaction(function(ctx) {
				ctx.executeSql(sql, [item.ccID, item.vID, item.rate, item.update_time, item.deleted]);
			});
		});
	}
}


//user table don't have initial data to dump
function create_user_table() {

	var sql = "CREATE TABLE IF NOT EXISTS User ( " + 
			"uID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, " + 
			"email VARCHAR(50) NOT NULL, " + 
			"social_network VARCHAR(50), " +
			"nickname VARCHAR(50) NOT NULL, " + 
			"password VARCHAR(50) NOT NULL, " +  
			"registration_time DATETIME NOT NULL, " + 
			"last_login_time DATETIME NOT NULL, " + 
			"app_version VARCHAR(10) NOT NULL, " + //1.0.1
			"mobile_platform VARCHAR(50) NOT NULL)";
			
    tx.executeSql(sql);	
	
}



function create_user_credit_card_table() {

	var sql = "CREATE TABLE IF NOT EXISTS User_Credit_Card ( " + 
			"uID INTEGER NOT NULL, " + 
			"ccID INTEGER NOT NULL, " + 
			"point_to_cash FLOAT DEFAULT NULL, " + 
			"point_to_mile FLOAT DEFAULT NULL, " + 
			"mile_to_cash FLOAT DEFAULT NULL, " + 		
			"open_time DATETIME, " + 
			"linking_account VARCHAR(200))";
			
    tx.executeSql(sql);	

//-----------------------------need to be commented-------------------------------------------	
	if( db_is_empty )
    {	
	    getJsonData("user_credit_card_test");
		sql = "INSERT INTO User_Credit_Card (uID, ccID) VALUES (?,?);"; 
		
		$.each(jsonData, function(i, item) {
			db.transaction(function(ctx) {
				ctx.executeSql(sql, [item.uID, item.ccID]);
			});
		});
	}
}







function getJsonData(db_name) {
    return $.ajax({
			  url: "json/" + db_name + ".json", //path of index.html not js
			  dataType: 'json',
			  async: false,
			  cache: true,
			  success: 		
				function(json) {
					jsonData = json;				
				}, //need to comment if disable error function
			  error: function (xhr, ajaxOptions, thrownError) {
		        $("#tmp").append(xhr.status);
		        $("#tmp").append(thrownError);
		      }			    
			});
}

