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

  //Connect to tmfc_db and store result in variable
	$conn = connect_to_db();

	//ENTER PRODUCT INFO INTO PRODUCT TABLE
	$add_product_stmt = $conn->prepare("INSERT INTO products (
		product_id,
		product_name,
		model_number,
		category_id
	)
	VALUES (?,?,?,?)");

	//bind
	$add_product_stmt->bind_param('sssi', $auto_generate, $product_name, $model_number, $category_id);

	//execute
	$execute = $add_product_stmt->execute();
	if(!$execute) {
		echo htmlspecialchars($add_product_stmt->error);
		exit;
	}

	$last_product_id = $conn->insert_id;

	if($description) {
		$add_tags_stmt = $conn->prepare("INSERT INTO tags (
			tags_id,
			product_id,
			tags
		)
		VALUES (?,?,?)");

		//bind
		$add_tags_stmt->bind_param('sis', $auto_generate, $last_product_id, $description);

		//execute
		$execute = $add_tags_stmt->execute();
		//handle errors
		if(!$execute) {
			echo htmlspecialchars($add_tags_stmt->error);
			exit;
		}
	}

	if($locations) {
		for($i=0;$i<count($locations);$i++) {
			$add_locations_stmt = $conn->prepare("INSERT INTO locations (
				location_id,
				product_id,
				location,
				current_qty,
				min_qty
			)
			VALUES (?,?,?,?,?)");

			//bind
			$add_locations_stmt->bind_param('sisii',
				$auto_generate,
				$last_product_id,
				$locations[$i]["location"],
				$locations[$i]["cur_qty"],
				$locations[$i]["min_qty"]
			);

			//execute
			$execute = $add_locations_stmt->execute();
			//handle errors
			if(!$execute) {
				echo htmlspecialchars($add_locations_stmt->error);
				exit;
			}
		}
	}

	if($vendors) {
		for($i=0;$i<count($vendors);$i++) {
			$vendor_id;
			//check if vendor exits in vendor table
			$sql = "SELECT vendor_id, vendor_name FROM vendors WHERE vendor_name = $vendors[$i]['vendor'] ";
			$result = $conn->query($sql);

			if($result->num_rows > 0)
			{
		    while($row = $result->fetch_assoc()) {
		        $vendor_id = $row['vendor_name'];
		    }
			}
			else
			{
				$add_vendor_stmt = $conn->prepare("INSERT INTO vendor (
					vendor_id,
					vendor_name
				)
				VALUES (?,?)");

				//bind
				$add_vendor_stmt->bind_param('ss',
					$auto_generate,
					$vendors[$i]["vendor"]
				);

				//execute
				$execute = $add_vendor_stmt->execute();
				//handle errors
				if(!$execute) {
					echo htmlspecialchars($add_vendor_stmt->error);
					exit;
				}
				$vendor_id = $conn->insert_id;
			}

			$add_vendors_stmt = $conn->prepare("INSERT INTO product_vendor_info (
				product_vendor_info_id,
				vendor_id,
				product_id,
				item_number,
				vendor_link
			)
			VALUES (?,?,?,?,?)");

			//bind
			$add_vendors_stmt->bind_param('siiis',
				$auto_generate,
				$vendor_id,
				$last_product_id,
				$vendors[$i]["item_number"],
				$vendors[$i]["link_to_item"]
			);

			//execute
			$execute = $add_vendors_stmt->execute();
			//handle errors
			if(!$execute) {
				echo htmlspecialchars($add_vendors_stmt->error);
				exit;
			}
		}
	}


	echo json_encode($_POST);
}
?>
