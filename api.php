<?php
  $config = include("config.php");

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
    $dates = file($config["disableFile"], FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    // "or die" has the false positive of an empty file
    if ($dates === false)
      die("Falha carregando o arquivo");

    $dates = filterOldDates($dates);
    return $dates;
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

    if (isOldDate($date))
      return;
    if (in_array($date, $dates))
      return;

    array_push($dates, $date);
    sort($dates);
    saveToFile($dates);
  }

  function rmDate($date) {
    $dates = getDates();
    if (($key = array_search($date, $dates)) !== false) {
      unset($dates[$key]);
    }
    saveToFile($dates);
  }

  function saveToFile($dates) {
    global $config;
    $fileHandle = fopen($config["disableFile"], "w");
    if (!$fileHandle)
      die("Erro abrindo o arquivo para salvar.");

    foreach ($dates as $date)
      fwrite($fileHandle, $date.PHP_EOL);

    if (!fclose($fileHandle))
      die("Erro fechando o arquivo para salvar.");
  }
?>
