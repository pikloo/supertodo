<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="utf-8" />
    <title>Toudou - Mail d'activation</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http–equiv=“Content-Type” content=“text/html; charset=UTF-8” />
    <meta http–equiv=“X-UA-Compatible” content=“IE=edge” />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    <style type=”text/css”>
        body {
            font-family: 'Montserrat', sans-serif;
            font-size: 16px;
            line-height: 1.5;
            color: rgb(45,39,47);
            background-color: rgb(250,255,253);
            margin: 0;
            padding:5px 10px;
        }

        h1 {
            font-size: 36px;
            font-weight: 700;
            line-height: 1.2;
            margin: 0;
            padding: 0;
            text-align: center;
        }
        
        img {
            width: 100%;
            height: auto;
            text-align: center;
        }
    </style>
</head>

<body>
    <table>
        <tr>
            <td>
                <img src="/assets/images/activation_mail_header_welcome.jpg" alt="Bienvenue sur Toudou" />
            </td>
        </tr>
        <tr>
            <td>
                <h1>Bienvenue <?= $name?> !</h1>
            </td>
        </tr>
        <tr>
            <td>
                <p style="text-align:center">
                    Ton inscription a bien été effectuée,
                </p>
            </td>
        </tr>
        <tr>
            <td>
                <p>
                    Pour activer votre compte, clique sur le lien ci-dessous :
                </p>
            </td>
        </tr>
        <tr>
            <td>
                <a href="http://localhost:9000/register/activation/<?= $activation_token?>">Activer mon compte</a>
            </td>
        </tr>
        <tr>
            <td>
                <p>
                    A très bientot,
                </p>
                <p>
                    La team Toudou
                </p>
            </td>
        </tr>
        <tr>
            <td>
                <p style="font-size:12px">
                    Ce mail a été automatiquement envoyé à la suite de ton inscription, si tu ne souhaites pas poursuivre tu peux te cliquer sur ce lien: <a href="http://localhost:9000/">Se désinscrire </a>
                </p>
            </td>
        </tr>
    </table>

</body>

</html>