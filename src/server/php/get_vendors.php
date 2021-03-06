<?php
header("Access-Control-Allow-Origin: *");
header("content-type: application/x-www-form-urlencoded format");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS");

include('db_fns.php');


$vendors = array();

if($_SERVER['REQUEST_METHOD'] === 'GET') {
  //Connect to tmfc_db and store result in variable
  $conn = connect_to_db();

  //Application INFO
  $result = $conn->query('SELECT vendor_name AS vendor FROM vendors ORDER BY vendor_name ASC');

  if(!$result) {
  	echo "Error with Database Query";
  	exit;
  }

//$result = [["vendor" => "haviland"],["vendor" => "ABrite"],... ]
  if($result->num_rows > 0) {
  	while($row = $result->fetch_assoc()) {
      //$row = ["vendor" => "haviland"]
      $vendors[] = ["title" => $row['vendor']];
      }
  }

  echo json_encode($vendors);

}
 ?>
