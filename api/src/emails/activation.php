<!DOCTYPE html>
<html lang="fr">

<head>
    <title>Toudou - Mail d'activation</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http–equiv=“Content-Type” content=“text/html; charset=UTF-8” />
    <meta http–equiv=“X-UA-Compatible” content=“IE=edge” />
    <style type=”text/css”>
        body {
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
        }
        
        img {
            width: 100%;
            height: auto;
            border-radius: 10px;
        }

        .button:hover{
            background-color: rgb(66,167,20);
        }
    </style>
</head>

<body style="font-family:Arial, Helvetica, sans-serif">
    <table style='margin:auto'>
        <tr>
            <td style="text-align:center">
                <img src="http://localhost:8090/assets/images/activation_mail_header_welcome.jpg" alt="Bienvenue sur Toudou" />
            </td>
        </tr>
        <tr>
            <td>
                <h1 style="text-align:center">Bienvenue <?= $name?> !</h1>
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
        <tr style="margin:0 2rem; text-align:center">
            <td>
                <a class="button" style="text-decoration:none;padding:0.8rem;background:rgb(190,190,193);border-radius:5px;color:rgb(45,39,47)" href="http://localhost:9000/register/activation/<?= $activation_token?>">Activer mon compte</a>
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