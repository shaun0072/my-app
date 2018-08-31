<?php
header("Access-Control-Allow-Origin: *");
header("content-type: application/x-www-form-urlencoded format");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS");

include('db_fns.php');


$source = array();

if($_SERVER['REQUEST_METHOD'] === 'GET') {
  //Connect to tmfc_db and store result in variable
  $conn = connect_to_db();

  //Application INFO
  $result = $conn->query('SELECT
    categories.category_name,
    products.product_id,
    products.product_name,
    products.current_qty,
    products.model_number
    FROM
    products,
    categories
    WHERE
    categories.category_id = products.category_id
    ORDER BY category_name
    ');

  if(!$result) {
  	echo "Error with Database Query";
  	exit;
  }

  if($result->num_rows > 0) {
  	while($row = $result->fetch_assoc()) {
      if( !array_key_exists($row['category_name'], $source ) ) {
        $source[$row['category_name']] = [
          "name" => $row['category_name'],
          "results" => array()
        ];
      }


      array_push($source[$row['category_name']]['results'], [
        "title" => $row['product_name'],
        "model_number" => $row['model_number']
      ]);
  	}

  }

  echo json_encode($source);

}
 ?>
