<?php
  $config = include("config.php");

  createFile();

  $method = $_SERVER["REQUEST_METHOD"];
  $json = file_get_contents('php://input');
  $data = json_decode($json);

  if ($method == "GET") {
    header('Content-Type: application/json');
    echo json_encode(getDates());
  }

  if ($method == "POST" && isset($data->addDate)) {
    addDate($data->addDate);
  }

  if ($method == "POST" && isset($data->rmDate)) {
    rmDate($data->rmDate);
  }

  function getDates() {
    global $config;
    $dates = file($config["disabledFile"], FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    // "or die" has the false positive of an empty file
    if ($dates === false) {
      http_response_code(500);
      die("Error opening file to read.");
    }

    return filterOldDates($dates);
  }

  function filterOldDates($dates) {
    $filtered = array();
    foreach ($dates as $date) {
      if (! isOldDate($date))
        array_push($filtered, $date);
    }

    return $filtered;
  }

  function isOldDate($date) {
    $today = date("Y-m-d");
    return $date < $today;
  }

  function addDate($date) {
    $dates = getDates();

    if (isOldDate($date)) {
      http_response_code(400);
      die("Old date.");
    }
    if (in_array($date, $dates)) {
      http_response_code(400);
      die("Duplicate date.");
    }

    array_push($dates, $date);
    sort($dates);
    saveToFile($dates);
  }

  function rmDate($date) {
    $dates = getDates();
    if (($key = array_search($date, $dates)) !== false) {
      unset($dates[$key]);
    } else {
      http_response_code(400);
      die("Date is not in list.");
    }
    saveToFile($dates);
  }

  function saveToFile($dates) {
    global $config;
    $fileHandle = fopen($config["disabledFile"], "w");
    if (!$fileHandle) {
      http_response_code(500);
      die("Error opening file to save.");
    }

    foreach ($dates as $date)
      fwrite($fileHandle, $date.PHP_EOL);

    if (!fclose($fileHandle)) {
      http_response_code(400);
      die("Error closing file to save.");
    }
  }

  function createFile() {
    global $config;

    $path = $config["disabledFile"];
    if (!file_exists($path))
      touch($path);
  }
?>
