<?php

include('db_fns.php');

$conn = connect_to_db();

$var="Abrite";

$vendor_id;
if($add_vendors_stmt = $conn->prepare("SELECT vendor_id FROM vendors WHERE vendor_name=?")) {

  /* bind parameters for markers */
  $add_vendors_stmt->bind_param("s", $var);

  /* execute query */
  $add_vendors_stmt->execute();

  /* bind result variables */
  $add_vendors_stmt->bind_result($retrieved_vendor_id);

  /* fetch value */
  while($add_vendors_stmt->fetch()) {
    $vendor_id = $retrieved_vendor_id;
  }

  if(!isset($vendor_id)) {
    $add_vendor_stmt = $conn->prepare("INSERT INTO vendors (
      vendor_id,
      vendor_name
    )
    VALUES (?,?)");

    //bind
    $add_vendor_stmt->bind_param('ss', $auto_generate, $var);

    //execute
    $execute = $add_vendor_stmt->execute();
    //handle errors
    if(!$execute) {
      echo htmlspecialchars($add_vendor_stmt->error);
      exit;
    }
    $vendor_id = $conn->insert_id;
  }
}

printf($vendor_id);

 ?>
