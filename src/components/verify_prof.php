<?php
session_start();

if (!isset($_POST['email']) || !isset($_POST['password'])) {
    die("Accès non autorisé.");
}

$email = trim($_POST['email']);
$password = trim($_POST['password']);

$conn = new mysqli("localhost", "root", "", "edueva");

if ($conn->connect_error) {
    die("Erreur connexion BD : " . $conn->connect_error);
}

$sql = "SELECT id_prof, nom, password FROM PROF WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
    $prof = $result->fetch_assoc();

    if (password_verify($password, $prof['password'])) {

        $_SESSION['id_prof'] = $prof['id_prof'];
        $_SESSION['nom_prof'] = $prof['nom'];

        header("Location: test.php");
        exit();
    } else {
        $error = "Mot de passe incorrect.";
    }
} else {
    $error = "Aucun compte professeur trouvé.";
}

$stmt->close();
$conn->close();
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Erreur de connexion</title>
</head>
<body>
    <h2 style="color:red;">Erreur : <?= $error ?></h2>
    <a href="login.php">Retourner à la connexion</a>
</body>
</html>
