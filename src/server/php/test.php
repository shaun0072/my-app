<?php
header("Access-Control-Allow-Origin: *");
header("content-type: application/x-www-form-urlencoded format");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS");


$obj = ["name" => "tsdyr"];
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $obj = $_POST;
}
echo json_encode($obj);
 ?>
