<?php
 $fName = 'Имя: '.$_POST['name'].' <br />';
 $fPhone = 'Телефон: '.$_POST['phone'].' <br />';
 $fMail = 'E-mail: '.$_POST['mail'].' <br />';
 $AllInOne = $fName.$fPhone.$fMail;
 $to = 'paf-gr8.johnvva2ri0r@yandex.by';
 $headers = "Content-type: text/html; charset=utf-8 \r\n";
 $headers = "From: Site <https://ioa2nvva2ri0r.github.io/HighPass>\r\n";
  if( mail($to, 'Свяжитесь с нами', $AllInOne, $headers)) {
    echo "Спасибо, мы вам перезвоним!";
  } else {
    echo "Ошибка отправки!";
  }
?>
