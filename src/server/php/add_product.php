<?php
header("Access-Control-Allow-Origin: *");
header("content-type: application/x-www-form-urlencoded format");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS");

include('db_fns.php');

if( $_SERVER['REQUEST_METHOD'] === 'POST') {
	function changeEmptyToNull($el) {
    return (!empty($el) || $el === "0" ) ? $el : NULL;
	}
	$_POST = array_map("changeEmptyToNull", $_POST);

	//Set all array keys to variables with the same name
	extract($_POST);

	$auto_generate = '';

  // //Connect to tmfc_db and store result in variable
	// $conn = connect_to_db();
	//
	// //ENTER PRODUCT INFO INTO PRODUCT TABLE
	// $location_stmt = $conn->prepare("INSERT INTO locations (
	// 	location_id,
	// 	location
	// )
	// VALUES (?,?)");
	// 
	// //bind
	// $location_stmt->bind_param('ss', $auto_generate, $location);
	//
	// //execute
	// $execute = $location_stmt->execute();
	// if(!$execute) {
	// 	echo htmlspecialchars($location_stmt->error);
	// 	exit;
	// }
	//
	// //$last_category_id = $conn->insert_id;
	//
	// //ENTER PRODUCT INFO INTO PRODUCT TABLE
	// $products_stmt = $conn->prepare("INSERT INTO products (
	// 	product_id,
	// 	product_name,
	// 	model_number
	// 	category_id
	// )
	// VALUES (?,?,?,?)");
	//
	// //bind
	// $products_stmt->bind_param('sssi', $auto_generate, $product_name, $model_number, $category_id);
	//
	// //execute
	// $execute = $products_stmt->execute();
	// if(!$execute) {
	// 	echo htmlspecialchars($products_stmt->error);
	// 	exit;
	// }


	echo json_encode($_POST);
}
?>
