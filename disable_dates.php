<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Radioauto - disable dates</title>
  <meta name="viewport" content="width=device-width, user-scalable=no">
  <link rel="stylesheet" href="/style.css">
</head>
<body>

  <?php
    define("FILE_PATH", "/var/opt/scripts/radioauto_disabled");
    $result = "";

    // Save submited dates to file
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
      if (array_key_exists("selectedDates", $_POST)) {
        $newDates = $_POST["selectedDates"];
      } else {
        $newDates = array();
      }
      if ($_POST["addedDate"] != "") {
        array_push($newDates, $_POST["addedDate"]);
      }
      sort($newDates);

      $fileHandle = fopen($FILE_PATH, "w");
      if(!$fileHandle) {
        $result = "Erro abrindo o arquivo para salvar.";
      } else {
        foreach($newDates as $date) {
          fwrite($fileHandle, $date.PHP_EOL);
        }

        // Close file
        if(!fclose($fileHandle)) {
          $result = "Erro fechando o arquivo para salvar.";
        } else {
          $result = "Salvo.";
        }
      }
    }

    // Get dates from file
    $originalDates = file($FILE_PATH, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    // "or die" has the false positive of an empty file
    if ($originalDates === false) {
      die("Falha carregando o arquivo");
    }
  ?>


  <h1>Datas desativadas para o radioauto</h1>

  <form action="disable_dates.php" method="POST">
    <ul>
      <?php
        if (count($originalDates) == 0) {
          echo "<h5>Nenhuma data configurada.</h5>";
        }
        foreach($originalDates as $date) {
          $dateSanitized = htmlspecialchars($date);
          echo <<<EOT
          <li>
            <input type="checkbox" name="selectedDates[]" value="$dateSanitized"
              onclick="resetResult()" checked> $dateSanitized
          </li>
EOT;
        }
      ?>

      <li>
        <input type="date" name="addedDate" id="addedDate" onclick="resetResult()">
      </li>
    </ul>
    <input type="submit" id="btnSubmit" value="Salvar">
  </form>

  <h5 id="result"><?= $result ?></h5>

  <script>
    function resetResult() {
      document.getElementById("result").innerText = "";
    }
  </script>
</body>
</html>
