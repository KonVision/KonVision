const { domain } = require('./../config.json');


function randomString(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for ( let i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

function generatePHP(key) {
  const content =   `<?php ini_set('display_errors', 1);
                        ini_set('display_startup_errors', 1);
                        error_reporting(E_ALL);
                        header("Content-Type: text/text");
                        $str = file_get_contents('./config.json');
                        $json = json_decode($str, true);
                        $key = "${key}";
                        $uploadhost = "https://${domain}/";
                        $redirect = "https://${domain}";
                        if ($_SERVER["REQUEST_URI"] == "/robot.txt") {
                            die("User-agent: *\\nDisallow: /");
                        }
                        if (isset($_POST['k'])) {
                            if ($_POST['k'] == $key) {
                                $target = getcwd() . "/" . basename($_FILES['d']['name']);
                                if (move_uploaded_file($_FILES['d']['tmp_name'], $target)) {
                                    $md5 = md5_file(getcwd() . "/" . basename($_FILES['d']['name']));
                                    $explode = explode(".", $_FILES["d"]["name"]);
                                    rename(getcwd() . "/" . basename($_FILES['d']['name']), "/var/www/${domain}/upload/end/" . $_POST['n'] . "." . $md5 . "." . end($explode));
                                    if (isset($json['domain']) && $json['domain'] !== '') {
                                        if ($json['embed']) {
                                            echo "embeds on" $uploadhost . "/users/" . $_POST['n'] . '/' . $md5 . "/" . $md5 . '.html';
                                        } else {
                                            echo "domain off" $uploadhost . "/users/" . $_POST['n'] . '/' . $md5 . "/" . $md5 . '.png';
                                        }
                                    } else {
                                        if ($json['embed']) {
                                            echo $uploadhost . "/users/" . $_POST['n'] . '/' . $md5 . "/" . $md5 . '.html';
                                        } else {
                                            echo $uploadhost . "/users/" . $_POST['n'] . '/' . $md5 . "/" . $md5 . '.png';
                                        }
                                    }
                                } else {
                                    echo "Your file could not be uploaded!";
                                }
                            } else {
                                header('Location: ' . $redirect);
                            }
                        } else {
                            header('Location: ' . $redirect);
                    } ?>`;

    return content;
}


module.exports = { randomString, generatePHP };
