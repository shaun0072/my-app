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
    category_name,
    category_id
    FROM
    categories
    GROUP BY category_name
    ORDER BY category_id
    ');

  if(!$result) {
  	echo "Error with Database Query";
  	exit;
  }

  if($result->num_rows > 0) {
  	while($row = $result->fetch_assoc()) {
      $source[] = [
        "category_name" => $row['category_name'],
        "category_id" => $row['category_id']
      ];
    }
  }


  echo json_encode($source);

}
?>
