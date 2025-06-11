<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <title>Nouveau message du Portfolio</title>
  <style>
    body {
      background-color: #f3f4f6;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      margin: 0;
      padding: 20px;
      color: #333;
    }

    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      padding: 24px;
    }

    .header {
      border-bottom: 1px solid #e5e7eb;
      padding-bottom: 16px;
      margin-bottom: 24px;
      text-align: center;
    }

    .header h2 {
      font-size: 24px;
      margin: 0;
      color: #1f2937;
    }

    .section-title {
      font-size: 18px;
      font-weight: 600;
      margin-top: 24px;
      margin-bottom: 8px;
      color: #111827;
    }

    .info p {
      margin: 6px 0;
    }

    .label {
      font-weight: 600;
      color: #111827;
    }

    .message-box {
      background-color: #f9fafb;
      border: 1px solid #d1d5db;
      padding: 16px;
      border-radius: 6px;
      white-space: pre-line;
    }

    .footer {
      border-top: 1px solid #e5e7eb;
      margin-top: 32px;
      padding-top: 16px;
      font-size: 13px;
      color: #6b7280;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <h2>📩 Nouveau message de contact</h2>
    </div>

    <!-- Infos -->
    <div class="info">
      <p><span class="label">Nom :</span> {{ $data['firstName'] }} {{ $data['lastName'] }}</p>
      <p><span class="label">Email :</span> {{ $data['email'] }}</p>
      @if($data['phone'])
      <p><span class="label">Téléphone :</span> {{ $data['phone'] }}</p>
      @endif
      <p><span class="label">Sujet :</span> {{ $data['subject'] }}</p>
    </div>

    <!-- Message -->
    <div>
      <h3 class="section-title">💬 Message :</h3>
      <div class="message-box">
        {{ $data['message'] }}
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p>Ce message a été envoyé depuis le formulaire de contact du portfolio.</p>
    </div>
  </div>
</body>
</html>
